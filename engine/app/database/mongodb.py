from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

from fastapi import FastAPI, Request
from motor.core import AgnosticDatabase
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import MONGO_DB
from app.framework.logging import logger


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    uri = (
        f"mongodb://{MONGO_DB['username']}:{MONGO_DB['password']}@"
        f"{MONGO_DB['host']}:{MONGO_DB['port']}/"
        f"{MONGO_DB['name']}?authSource=admin"
    )
    client: AsyncIOMotorClient[Any] = AsyncIOMotorClient(uri)
    db: AgnosticDatabase[Any] = client[MONGO_DB["name"]]

    app.state.db = db
    logger.info("✅ Connection to MongoDB established")

    yield

    client.close()
    logger.info("✅ MongoDB connection closed")


def get_database(request: Request) -> AgnosticDatabase[Any]:
    return request.app.state.db  # type: ignore
