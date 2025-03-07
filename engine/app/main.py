from fastapi import FastAPI
from typing import Dict

app = FastAPI()


@app.get("/ping")
async def ping() -> Dict[str, str]:
    return {"message": "pong"}
