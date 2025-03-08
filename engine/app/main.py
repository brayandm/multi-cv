from typing import Dict

from fastapi import FastAPI
from pydantic import BaseModel

from .tasks import send_to_openai  # type: ignore

app = FastAPI()


@app.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


class InputData(BaseModel):
    user_input: str


@app.post("/hello")
async def hello(data: InputData) -> Dict[str, str]:

    task = send_to_openai.delay(data.user_input)

    return {
        "message": "Request received. Processing in background.",
        "task_id": task.id,
    }
