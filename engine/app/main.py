from typing import Dict

from fastapi import FastAPI
from .models import Message
from .models import Person

from .tasks import message_task  # type: ignore

app = FastAPI()


@app.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


@app.post("/message")
async def message(data: Message) -> Dict[str, str]:

    message_task.delay(data.message)

    return {
        "message": "Request received. Processing in background.",
    }


@app.post("/person/summary")
async def person_summary(data: Person) -> Dict[str, str]:

    return {
        "message": "Request received. Processing in background.",
    }
