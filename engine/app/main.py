from typing import Dict

from fastapi import FastAPI

from app.classes.pipelines import (
    BasicPipeline,
    SummaryPipeline,
    ImproveAboutPipeline,
    GenerateCVPipeline,
)
from app.worker.queue_manager import QueueManager
from app.classes.models import Message, Person, Cv, CvTemplate

app = FastAPI()

queue_manager = QueueManager(default_queue="openai_queue")


@app.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


@app.post("/message")
async def message(message: Message) -> Dict[str, str]:

    queue_manager.execute_pipeline(BasicPipeline, "message", message)

    return {
        "message": "Request received. Processing in background.",
    }


@app.post("/summary")
async def summary(person: Person) -> Dict[str, str]:

    queue_manager.execute_pipeline(SummaryPipeline, "summary", person)

    return {
        "message": "Request received. Processing in background.",
    }


@app.post("/improve/about")
async def improve_about(person: Person, message: Message) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        ImproveAboutPipeline, "summary", person, message
    )

    return {
        "message": "Request received. Processing in background.",
    }


@app.post("/generate/cv")
async def generate_cv(cv: Cv, cv_template: CvTemplate) -> Dict[str, str]:

    queue_manager.execute_pipeline(
        GenerateCVPipeline, "generate_cv", cv, cv_template
    )

    return {
        "message": "Request received. Processing in background.",
    }
