from io import BytesIO
from typing import Any, Dict, Optional

from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response, StreamingResponse

from app.classes.models import (
    Chat,
    Cv,
    CvTemplate,
    ExperienceId,
    Html,
    Language,
    Profile,
    WebhookPayload,
)
from app.classes.pipelines import (
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
from app.framework.decorators.action import commit_action_after
from app.framework.decorators.context_vars import get_user_id
from app.framework.logging import logger
from app.framework.middlewares import (
    RequestHandleMiddleware,
)
from app.services.profile_service import ProfileService, get_profile_service
from app.utils.parsers import get_first_name_last_name
from app.utils.playwright import get_browser
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


@router.post("/generate/cv/inline")
@commit_action_after()
@consume_action("generate_cv_inline")
async def generate_cv_inline(
    language: Language,
    profile_service: ProfileService = Depends(get_profile_service),
) -> Response:

    profile = await profile_service.get_profile(get_user_id())

    if profile is None:
        return Response(
            content="Profile not found.",
            status_code=404,
        )

    cv_template = CvTemplate(id="default")

    cv = await GenerateCvPipeline().run(profile, language)

    document_render = DocumentRenderFacade.get_render()

    document_render.render_cv(cv, cv_template, language)

    pdf_bytes = document_render.get_cv()

    first_name = profile.basic_info.first_name
    last_name = profile.basic_info.last_name
    filename = f"{get_first_name_last_name(first_name, last_name)}_CV.pdf"

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'inline; filename="{filename}"',
            "Access-Control-Expose-Headers": "Content-Disposition",
        },
    )


@router.post("/chat/experience")
@commit_action_after()
@consume_action("chat")
async def chat_experience(
    experience_id: ExperienceId,
    language: Language,
    chat: Chat,
    profile_service: ProfileService = Depends(get_profile_service),
) -> Dict[str, str]:

    experience = await profile_service.get_experience(
        get_user_id(), experience_id.id
    )

    chat_message, notes = await ChatExperiencePipeline().run(
        chat, experience, language
    )

    await profile_service.update_notes_experience(
        get_user_id(), experience_id.id, notes
    )

    return {"message": chat_message}


@router.post("/render/cv")
@consume_action("render_cv")
async def render_cv(
    cv: Cv, cv_template: CvTemplate, language: Language
) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        RenderCVPipeline, "render_cv", cv, cv_template, language
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/render/cv/inline")
@authenticate()
async def render_cv_inline(
    cv: Cv, cv_template: CvTemplate, language: Language
) -> Response:

    document_render = DocumentRenderFacade.get_render()

    document_render.render_cv(cv, cv_template, language)

    pdf_bytes = document_render.get_cv()

    return Response(content=pdf_bytes, media_type="application/pdf")


@router.post("/render/html/inline")
@authenticate()
async def render_html_inline(html: Html) -> Response:
    try:
        html_content = html.content

        if not html_content:
            return JSONResponse(
                status_code=400, content={"error": "Missing HTML"}
            )

        browser = await get_browser()
        page = await browser.new_page()
        await page.set_content(html_content, wait_until="networkidle")

        pdf = await page.pdf(format="A4", print_background=True)
        await page.close()

        return StreamingResponse(
            BytesIO(pdf),
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=cv.pdf"},
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


@router.post("/webhook")
@commit_action_after()
@validate_api_token()
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


app.include_router(router)

logger.info("FastAPI application started!")
