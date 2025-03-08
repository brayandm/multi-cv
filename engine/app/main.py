from typing import Dict

from fastapi import FastAPI

from app.classes.pipelines import (
    BasicPipeline,
    SummaryPipeline,
    ImproveAboutPipeline,
)
from app.worker.queue_manager import QueueManager
from app.classes.models import Message, Person

app = FastAPI()

queue_manager = QueueManager(default_queue="openai_queue")


@app.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


@app.post("/message")
async def message(message: Message) -> Dict[str, str]:

    queue_manager.execute(BasicPipeline, "message", {"message": message})

    return {
        "message": "Request received. Processing in background.",
    }


@app.post("/summary")
async def summary(person: Person) -> Dict[str, str]:

    queue_manager.execute(SummaryPipeline, "summary", {"person": person})

    return {
        "message": "Request received. Processing in background.",
    }


@app.post("/improve/about")
async def improve_about(person: Person, message: Message) -> Dict[str, str]:

    queue_manager.execute(
        ImproveAboutPipeline, "summary", {"person": person, "message": message}
    )

    return {
        "message": "Request received. Processing in background.",
    }
