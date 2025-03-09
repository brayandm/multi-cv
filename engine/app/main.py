from typing import Dict

from fastapi import APIRouter, FastAPI

from app.classes.models import Cv, CvTemplate, Message, Person
from app.classes.pipelines import (
    BasicPipeline,
    GenerateCVPipeline,
    ImproveAboutPipeline,
    SummaryPipeline,
)
from app.worker.queue_manager import QueueManager
from app.facades.document_generator_facade import DocumentGeneratorFacade

app = FastAPI()

queue_manager = QueueManager(default_queue="openai_queue")

router = APIRouter(prefix="/api/v1")


@router.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


@router.post("/message")
async def message(message: Message) -> Dict[str, str]:

    queue_manager.execute_pipeline(BasicPipeline, "message", message)

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/summary")
async def summary(person: Person) -> Dict[str, str]:

    queue_manager.execute_pipeline(SummaryPipeline, "summary", person)

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/improve/about")
async def improve_about(person: Person, message: Message) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        ImproveAboutPipeline, "summary", person, message
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/generate/cv")
async def generate_cv(cv: Cv, cv_template: CvTemplate) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        GenerateCVPipeline, "generate_cv", cv, cv_template
    )

    return {
        "message": "Request received. Processing in background.",
    }


@router.post("/generate/cv/inline")
async def generate_cv_inline(cv: Cv, cv_template: CvTemplate) -> bytes:

    document_generator = DocumentGeneratorFacade.get_generator()

    document_generator.generate_cv(cv, cv_template)

    return document_generator.get_cv()


app.include_router(router)
