from typing import Any, Dict, Optional
from urllib.parse import quote

from fastapi import (
    APIRouter,
    BackgroundTasks,
    Depends,
    FastAPI,
    File,
    Query,
    UploadFile,
)
from fastapi.encoders import jsonable_encoder
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response

from app.classes.models import (
    Application,
    Chat,
    Cv,
    CvTemplate,
    CvTexts,
    Document,
    ExperienceId,
    GenerationInput,
    Html,
    Profile,
    Settings,
    Text,
    Traduction,
    WebhookPayload,
)
from app.classes.pipelines import (
    AutoFillProfilePipeline,
    ChatExperiencePipeline,
    GenerateCvPipeline,
    RenderCVPipeline,
)
from app.database.mongodb import lifespan
from app.facades.document_render_facade import DocumentRenderFacade
from app.framework.decorators import (
    authenticate,
    consume_action,
    validate_api_token,
)
from app.framework.decorators.action import (
    cancel_action,
    commit_action,
    commit_action_after,
    rollback_action,
)
from app.framework.decorators.context_vars import (
    get_action_id,
    get_auth_token,
    get_user_id,
)
from app.framework.logging import logger
from app.framework.middlewares import (
    RequestHandleMiddleware,
)
from app.framework.types.request import DeleteRequest, DocumentDownloadRequest
from app.services.application_service import (
    ApplicationService,
    get_application_service,
)
from app.services.chat_engine import ChatEngineService
from app.services.document_service import DocumentService, get_document_service
from app.services.profile_service import ProfileService, get_profile_service
from app.services.settings_service import SettingsService, get_settings_service
from app.services.text_extractor import InvalidPDFError, TextExtractor
from app.utils.playwright import get_browser
from app.utils.traductions import get_traductions
from app.worker.queue_manager import QueueManager

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(RequestHandleMiddleware)

queue_manager = QueueManager(default_queue="openai_queue")

router = APIRouter(prefix="/api/v1")


@router.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


@router.post("/moderation")
@authenticate()
async def moderation(
    text: Text,
) -> Response:

    input = text.content

    if not input:
        return JSONResponse(
            status_code=400,
            content={"error": "Input is required."},
        )

    service = ChatEngineService()

    result = await service.moderation(input)

    if result:
        return JSONResponse(
            status_code=200,
            content={"message": "Input is safe."},
        )
    else:
        return JSONResponse(
            status_code=400,
            content={"error": "Input is unsafe."},
        )


async def process_document_task(
    contents: bytes,
    user_id: int,
    profile_service: ProfileService,
) -> None:
    try:
        chat_engine_service = ChatEngineService()
        extractor = TextExtractor(contents)

        # text_from_pdf = await extractor.extract_text()
        # extractor.close()

        # is_safe = await chat_engine_service.moderation(text_from_pdf)
        # if not is_safe:
        #     cancel_action()
        #     return JSONResponse(
        #         status_code=400,
        #         content={"error": "Input is unsafe."},
        #     )

        is_safe = await chat_engine_service.moderation_from_images(
            await extractor.extract_images()
        )
        if not is_safe:
            cancel_action()
            return

        text_from_images = await extractor.extract_text_from_images()

        is_safe = await chat_engine_service.moderation(text_from_images)
        if not is_safe:
            cancel_action()
            return

        profile = await AutoFillProfilePipeline().run(text_from_images)

        await profile_service.sync_profile(user_id, profile)

        commit_action()

    except InvalidPDFError:
        rollback_action()
    except Exception:
        rollback_action()


@router.post("/auto-fill/cv/from-document")
@consume_action("auto_fill_cv_from_document")
async def auto_fill_cv_from_document(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    profile_service: ProfileService = Depends(get_profile_service),
) -> Response:
    if file.content_type != "application/pdf":
        cancel_action()
        return JSONResponse(
            status_code=400,
            content={
                "error": "Invalid file type. Only PDF files are allowed."
            },
        )

    contents = await file.read()
    user_id = get_user_id()
    action_id = get_action_id()

    background_tasks.add_task(
        process_document_task,
        contents,
        user_id,
        profile_service,
    )

    return JSONResponse(
        content={
            "message": "Document is being processed in the background.",
            "action_id": action_id,
        },
        status_code=202,
    )


@router.post("/generate/cv/inline")
@commit_action_after()
@consume_action("generate_cv")
async def generate_cv_inline(
    input: GenerationInput,
    traduction: Traduction,
    profile_service: ProfileService = Depends(get_profile_service),
    document_service: DocumentService = Depends(get_document_service),
    application_service: ApplicationService = Depends(get_application_service),
) -> Response:

    user_id = get_user_id()

    profile = await profile_service.get_profile(user_id, with_notes=True)

    if profile is None:
        return Response(
            content="Profile not found.",
            status_code=404,
        )

    chat_engine_service = ChatEngineService()

    if profile.moderation is not True:
        is_safe = await chat_engine_service.moderation(
            profile.model_dump_json()
        )

        if not is_safe:
            cancel_action()
            return JSONResponse(
                status_code=400,
                content={"error": "Input is unsafe."},
            )

        await profile_service.profile_moderation(user_id, moderation=True)

    is_safe = await chat_engine_service.moderation(input.model_dump_json())
    if not is_safe:
        cancel_action()
        return JSONResponse(
            status_code=400,
            content={"error": "Input is unsafe."},
        )

    cv, application = await GenerateCvPipeline().run(
        profile, input, traduction
    )

    application_id = None

    if application:
        application_id = await application_service.store_application(
            user_id, application
        )

    cv_template = CvTemplate(
        id="default", type="latex", cv_texts=get_traductions(traduction.locale)
    )

    quoted_filename, pdf_bytes = await document_service.process_cv(
        profile, cv, cv_template, application_id
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f"inline; filename*=UTF-8''{quoted_filename}"
            ),
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )


@router.post("/generate/cv/inline/norender")
@commit_action_after()
@consume_action("generate_cv")
async def generate_cv_inline_norender(
    input: GenerationInput,
    traduction: Traduction,
    profile_service: ProfileService = Depends(get_profile_service),
    application_service: ApplicationService = Depends(get_application_service),
) -> Response:

    user_id = get_user_id()

    profile = await profile_service.get_profile(user_id, with_notes=True)

    if profile is None:
        return Response(
            content="Profile not found.",
            status_code=404,
        )

    chat_engine_service = ChatEngineService()

    if profile.moderation is not True:
        is_safe = await chat_engine_service.moderation(
            profile.model_dump_json()
        )

        if not is_safe:
            cancel_action()
            return JSONResponse(
                status_code=400,
                content={"error": "Input is unsafe."},
            )

        await profile_service.profile_moderation(user_id, moderation=True)

    is_safe = await chat_engine_service.moderation(input.model_dump_json())
    if not is_safe:
        cancel_action()
        return JSONResponse(
            status_code=400,
            content={"error": "Input is unsafe."},
        )

    cv, application = await GenerateCvPipeline().run(
        profile, input, traduction
    )

    application_id = None

    if application:
        application_id = await application_service.store_application(
            user_id, application
        )

    cv_texts = CvTexts(**get_traductions(traduction.locale))

    return JSONResponse(
        content={
            "cv": cv.model_dump(exclude_none=True),
            "cv_texts": cv_texts.model_dump(exclude_none=True),
            "application_id": application_id,
        },
        status_code=200,
    )


@router.get("/documents")
@authenticate()
async def get_documents(
    document_service: DocumentService = Depends(get_document_service),
) -> list[Document]:
    documents = await document_service.get_all_documents(get_user_id())
    return documents


@router.get("/applications")
@authenticate()
async def get_applications(
    application_service: ApplicationService = Depends(get_application_service),
) -> list[Application]:
    applications = await application_service.get_applications(get_user_id())
    return applications


@router.get("/application")
@authenticate()
async def get_application(
    application_id: str = Query(...),
    application_service: ApplicationService = Depends(get_application_service),
) -> Response:
    application, documents = await application_service.get_application(
        get_user_id(), application_id
    )
    return JSONResponse(
        content=jsonable_encoder(
            {
                "application": application.model_dump(exclude_none=True),
                "documents": [
                    document.model_dump(exclude_none=True)
                    for document in documents
                ],
            }
        ),
        status_code=200,
    )


@router.post("/application")
@authenticate()
async def update_application(
    application: Application,
    application_service: ApplicationService = Depends(get_application_service),
) -> Response:

    await application_service.update_application(
        get_user_id(), application.application_id, application
    )
    return JSONResponse(
        content={"message": "Application updated successfully."},
        status_code=200,
    )


@router.post("/document/download")
@authenticate()
async def download_document(
    document_download_request: DocumentDownloadRequest,
    document_service: DocumentService = Depends(get_document_service),
) -> Response:
    document_id = document_download_request.document_id

    filename, document = await document_service.get_document_file(
        get_user_id(), document_id
    )

    if not document or not filename:
        return JSONResponse(
            status_code=404,
            content={"error": "Document not found."},
        )

    quoted_filename = quote(filename)

    return Response(
        content=document,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f"inline; filename*=UTF-8''{quoted_filename}"
            ),
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )


@router.post("/chat/experience")
@commit_action_after()
@consume_action("chat")
async def chat_experience(
    experience_id: ExperienceId,
    traduction: Traduction,
    chat: Chat,
    profile_service: ProfileService = Depends(get_profile_service),
) -> Response:

    experience = await profile_service.get_experience(
        get_user_id(), experience_id.id
    )

    chat_engine_service = ChatEngineService()
    is_safe = await chat_engine_service.moderation(
        chat.model_dump_json() + experience.model_dump_json()
    )

    if not is_safe:
        cancel_action()
        return JSONResponse(
            status_code=400,
            content={"error": "Input is unsafe."},
        )

    chat_message, notes = await ChatExperiencePipeline().run(
        chat, experience, traduction
    )

    await profile_service.update_notes_experience(
        get_user_id(), experience_id.id, notes
    )

    return JSONResponse(content={"message": chat_message}, status_code=200)


@router.post("/render/cv")
@consume_action("render_cv")
async def render_cv(
    cv: Cv, cv_template: CvTemplate, traduction: Traduction
) -> Dict[str, str]:

    if cv_template.type != "latex":
        raise ValueError("Invalid template type. Expected 'latex'.")

    queue_manager.execute_pipeline(
        RenderCVPipeline, "render_cv", cv, cv_template, traduction
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/render/cv/inline")
@authenticate()
async def render_cv_inline(cv: Cv, cv_template: CvTemplate) -> Response:

    if cv_template.type != "latex":
        raise ValueError("Invalid template type. Expected 'latex'.")

    document_render = DocumentRenderFacade.get_render()

    document_render.render_cv(cv, cv_template)

    pdf_bytes = document_render.get_cv()

    return Response(content=pdf_bytes, media_type="application/pdf")


@router.post("/render/html/inline")
@authenticate()
async def render_html_inline(
    html: Html,
    cv: Cv,
    cv_template: CvTemplate,
    application_id: Optional[str] = Query(None),
    document_service: DocumentService = Depends(get_document_service),
    profile_service: ProfileService = Depends(get_profile_service),
) -> Response:
    try:
        html_content = html.content

        if not html_content:
            return JSONResponse(
                status_code=400, content={"error": "Missing HTML"}
            )

        browser = await get_browser()
        page = await browser.new_page()

        await page.set_extra_http_headers({"Authorization": get_auth_token()})

        await page.set_content(html_content, wait_until="networkidle")

        pdf = await page.pdf(format="A4", print_background=True)
        await page.close()

        profile = await profile_service.get_profile(get_user_id())

        if profile:
            quoted_filename, _ = await document_service.process_cv(
                profile, cv, cv_template, application_id, pdf
            )

        return Response(
            content=pdf,
            media_type="application/pdf",
            headers={
                "Content-Disposition": (
                    f"inline; filename*=UTF-8''{quoted_filename}"
                ),
                "Access-Control-Expose-Headers": "Content-Disposition",
            },
        )

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": str(e)})


@router.put("/profile/sync")
@authenticate()
async def store_profile(
    profile: Profile,
    profile_service: ProfileService = Depends(get_profile_service),
) -> Dict[str, str]:

    user_id = get_user_id()

    await profile_service.sync_profile(user_id, profile)

    return {"message": "Profile synced successfully."}


@router.get("/profile")
@authenticate()
async def get_profile(
    profile_service: ProfileService = Depends(get_profile_service),
) -> Optional[dict[Any, Any]]:

    user_id = get_user_id()

    profile = await profile_service.get_profile(user_id)

    if profile is None:
        return None

    return profile.model_dump(exclude_none=True)


@router.post("/settings")
@authenticate()
async def store_settings(
    settings: Settings,
    settings_service: SettingsService = Depends(get_settings_service),
) -> Response:

    user_id = get_user_id()

    chat_engine_service = ChatEngineService()
    is_safe = await chat_engine_service.moderation(settings.model_dump_json())
    if not is_safe:
        return JSONResponse(
            status_code=400,
            content={"error": "Input is unsafe."},
        )

    await settings_service.sync_settings(user_id, settings)

    logger.info(f"Settings: {settings}")
    print(f"Settings: {settings}")

    return JSONResponse(
        content={"message": "Settings synced successfully."},
        status_code=200,
    )


@router.get("/settings")
@authenticate()
async def get_settings(
    settings_service: SettingsService = Depends(get_settings_service),
) -> Dict[str, str]:

    user_id = get_user_id()

    settings = await settings_service.get_settings(user_id)

    logger.info(f"Settings: {settings}")
    print(f"Settings: {settings}")

    return settings.model_dump(exclude_none=True)


@router.post("/webhook")
@commit_action_after()
@validate_api_token(check_action=True)
async def webhook(payload: WebhookPayload) -> Dict[str, str]:
    action = payload.action
    action_id = payload.action_id
    user_id = payload.user_id
    result = payload.result

    logger.info(
        f"Received webhook with action: {action} with id: {action_id} "
        f"for user: {user_id} "
        f"with result: {result}"
    )

    return {"message": "Webhook processed successfully."}


@router.post("/profile/delete")
@validate_api_token()
async def delete_profile(
    delete_request: DeleteRequest,
    profile_service: ProfileService = Depends(get_profile_service),
    settings_service: SettingsService = Depends(get_settings_service),
    document_service: DocumentService = Depends(get_document_service),
    application_service: ApplicationService = Depends(get_application_service),
) -> Response:
    user_id = delete_request.user_id

    await profile_service.delete_profile(user_id)

    await profile_service.delete_moderated_messages(user_id)

    await settings_service.delete_settings(user_id)

    await document_service.delete_all_documents(user_id)

    await application_service.delete_applications(user_id)

    return JSONResponse(
        content={"message": "Profile deleted successfully."},
        status_code=200,
    )


app.include_router(router)

logger.info("FastAPI application started!")
