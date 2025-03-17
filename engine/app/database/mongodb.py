from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

from fastapi import FastAPI, Request
from pymongo import MongoClient
from pymongo.database import Database

from app.config import MONGO_DB


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


def get_database(request: Request) -> Database[Any]:
    return request.app.state.db  # type: ignore
