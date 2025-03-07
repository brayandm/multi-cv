from fastapi import FastAPI
from tasks import send_to_openai
from typing import Dict


app = FastAPI()


@app.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}


@app.post("/hello")
async def hello(user_input: str) -> Dict[str, str]:

    task = send_to_openai.delay(user_input)
    return {
        "message": "Request received. Processing in background.",
        "task_id": task.id,
    }
