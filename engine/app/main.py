from typing import Dict, Optional

from fastapi import APIRouter, Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response

from app.classes.models import (
    Chat,
    Cv,
    CvTemplate,
    ExperienceId,
    Message,
    Profile,
    WebhookPayload,
)
from app.classes.pipelines import (
    BasicPipeline,
    ChatExperiencePipeline,
    ImproveAboutPipeline,
    RenderCVPipeline,
    SummaryPipeline,
)
from app.classes.pipelines.generate_cv_pipeline import GenerateCvPipeline
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
from app.worker.queue_manager import QueueManager

from app.utils.parsers import get_first_name_last_name

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


@router.post("/message")
@consume_action("message")
async def message(message: Message) -> Dict[str, str]:

    queue_manager.execute_pipeline(BasicPipeline, "message", message)

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/summary")
@consume_action("summary")
async def summary(profile: Profile) -> Dict[str, str]:

    queue_manager.execute_pipeline(SummaryPipeline, "summary", profile)

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/improve/about")
@consume_action("improve_about")
async def improve_about(profile: Profile, message: Message) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        ImproveAboutPipeline, "improve_about", profile, message
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/render/cv")
@consume_action("render_cv")
async def render_cv(cv: Cv, cv_template: CvTemplate) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        RenderCVPipeline, "render_cv", cv, cv_template
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/generate/cv/inline")
@commit_action_after()
@consume_action("generate_cv_inline")
async def generate_cv_inline(
    profile_service: ProfileService = Depends(get_profile_service),
) -> Response:

    profile = await profile_service.get_profile(get_user_id())

    if profile is None:
        return Response(
            content="Profile not found.",
            status_code=404,
        )

    cv_template = CvTemplate(id="default")

    cv = GenerateCvPipeline().run(profile)

    document_render = DocumentRenderFacade.get_render()

    document_render.render_cv(cv, cv_template)

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
    chat: Chat,
    profile_service: ProfileService = Depends(get_profile_service),
) -> Dict[str, str]:

    experience = await profile_service.get_experience(
        get_user_id(), experience_id.id
    )

    chat_message, notes = ChatExperiencePipeline().run(chat, experience)

    await profile_service.update_notes_experience(
        get_user_id(), experience_id.id, notes
    )

    return {"message": chat_message}


@router.post("/render/cv/inline")
@authenticate()
async def render_cv_inline(cv: Cv, cv_template: CvTemplate) -> Response:

    document_render = DocumentRenderFacade.get_render()

    document_render.render_cv(cv, cv_template)

    pdf_bytes = document_render.get_cv()

    return Response(content=pdf_bytes, media_type="application/pdf")


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
) -> Optional[Profile]:

    user_id = get_user_id()

    profile = await profile_service.get_profile(user_id)

    return profile


@router.post("/webhook")
@commit_action_after()
@validate_api_token()
async def webhook(payload: WebhookPayload) -> Dict[str, str]:
    action_id = payload.action_id
    action = payload.action
    result = payload.result

    logger.info(
        f"Received webhook with action: {action} with id: {action_id} "
        f"with result: {result}"
    )

    return {"message": "Webhook processed successfully."}


app.include_router(router)

logger.info("FastAPI application started!")
