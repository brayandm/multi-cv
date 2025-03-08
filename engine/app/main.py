from typing import Dict

from fastapi import FastAPI
from app.models import Message

from app.classes.queue_manager import QueueManager

from app.classes.pipelines.basic_pipeline import BasicPipeline

app = FastAPI()

queue_manager = QueueManager(default_queue="openai_queue")


@app.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


@app.post("/message")
async def message(data: Message) -> Dict[str, str]:

    queue_manager.execute(BasicPipeline, {"nombre": "Brayan", "edad": 25})

    return {
        "message": "Request received. Processing in background.",
    }
