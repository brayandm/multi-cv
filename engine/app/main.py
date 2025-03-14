from typing import Dict

from fastapi import APIRouter, FastAPI
from fastapi.responses import Response

from app.classes.models import Cv, CvTemplate, Message, Profile, WebhookPayload
from app.classes.pipelines import (
    BasicPipeline,
    GenerateCVPipeline,
    ImproveAboutPipeline,
    SummaryPipeline,
)
from app.facades.document_generator_facade import DocumentGeneratorFacade
from app.framework.logging import logger
from app.worker.queue_manager import QueueManager
from app.framework.decorators import validate_action

app = FastAPI()

queue_manager = QueueManager(default_queue="openai_queue")

router = APIRouter(prefix="/api/v1")


@router.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


@router.post("/message")
@validate_action("message")
async def message(message: Message) -> Dict[str, str]:

    queue_manager.execute_pipeline(BasicPipeline, "message", message)

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/summary")
@validate_action("summary")
async def summary(profile: Profile) -> Dict[str, str]:

    queue_manager.execute_pipeline(SummaryPipeline, "summary", profile)

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/improve/about")
@validate_action("improve_about")
async def improve_about(profile: Profile, message: Message) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        ImproveAboutPipeline, "improve_about", profile, message
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/generate/cv")
@validate_action("generate_cv")
async def generate_cv(cv: Cv, cv_template: CvTemplate) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        GenerateCVPipeline, "generate_cv", cv, cv_template
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/generate/cv/inline")
@validate_action("generate_cv_inline")
async def generate_cv_inline(cv: Cv, cv_template: CvTemplate) -> Response:

    document_generator = DocumentGeneratorFacade.get_generator()

    document_generator.generate_cv(cv, cv_template)

    pdf_bytes = document_generator.get_cv()

    return Response(content=pdf_bytes, media_type="application/pdf")


@router.post("/webhook")
async def webhook(payload: WebhookPayload) -> Dict[str, str]:
    action = payload.action
    result = payload.result

    logger.info(f"Received webhook with action: {action} and result: {result}")

    return {"message": "Webhook processed successfully."}


app.include_router(router)

logger.info("FastAPI application started!")
