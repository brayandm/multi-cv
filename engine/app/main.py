from typing import Dict, Any, AsyncGenerator

from fastapi import APIRouter, FastAPI, Depends
from fastapi.responses import Response

from app.classes.models import Cv, CvTemplate, Message, Profile, WebhookPayload
from app.classes.pipelines import (
    BasicPipeline,
    GenerateCVPipeline,
    ImproveAboutPipeline,
    SummaryPipeline,
)
from app.facades.document_generator_facade import DocumentGeneratorFacade
from app.framework.decorators import consume_action, validate_api_token
from app.framework.decorators.action import commit_action
from app.framework.logging import logger
from app.framework.middlewares import (
    RequestHandleMiddleware,
)
from app.worker.queue_manager import QueueManager

from contextlib import asynccontextmanager

from pymongo.database import Database

from app.config import MONGO_DB

from pymongo import MongoClient

from app.services.profile_service import ProfileService


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    uri = (
        f"mongodb://{MONGO_DB['username']}:{MONGO_DB['password']}@"
        f"{MONGO_DB['host']}:{MONGO_DB['port']}/"
        f"{MONGO_DB['name']}?authSource=admin"
    )
    client: MongoClient[Any] = MongoClient(uri)
    db = client[MONGO_DB["name"]]

    app.state.db = db
    print("✅ Connection opened")

    yield

    client.close()
    print("✅ Connection closed")


app = FastAPI(lifespan=lifespan)

app.add_middleware(RequestHandleMiddleware)

queue_manager = QueueManager(default_queue="openai_queue")

router = APIRouter(prefix="/api/v1")


def get_database() -> Database[Any]:
    return app.state.db  # type: ignore


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


@router.post("/generate/cv")
@consume_action("generate_cv")
async def generate_cv(cv: Cv, cv_template: CvTemplate) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        GenerateCVPipeline, "generate_cv", cv, cv_template
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/generate/cv/inline")
@consume_action("generate_cv_inline")
async def generate_cv_inline(cv: Cv, cv_template: CvTemplate) -> Response:

    document_generator = DocumentGeneratorFacade.get_generator()

    document_generator.generate_cv(cv, cv_template)

    pdf_bytes = document_generator.get_cv()

    commit_action()

    return Response(content=pdf_bytes, media_type="application/pdf")


@router.post("/profile/sync")
async def store_profile(
    profile: Profile, profile_service: ProfileService = Depends()
) -> Dict[str, str]:
    profile_service.sync_profile(profile)

    return {"message": "Profile synced successfully."}


@router.post("/webhook")
@validate_api_token()
async def webhook(payload: WebhookPayload) -> Dict[str, str]:
    action_id = payload.action_id
    action = payload.action
    result = payload.result

    logger.info(
        f"Received webhook with action: {action} with id: {action_id} "
        f"with result: {result}"
    )

    commit_action()

    return {"message": "Webhook processed successfully."}


app.include_router(router)

logger.info("FastAPI application started!")
