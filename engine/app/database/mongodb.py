from contextlib import asynccontextmanager
from typing import Any, AsyncGenerator

from fastapi import FastAPI, Request
from motor.core import AgnosticDatabase
from motor.motor_asyncio import AsyncIOMotorClient

from app.config import MONGO_DB
from app.framework.logging import logger


class MongoDBHandler:
    def __init__(self) -> None:
        self.client: AsyncIOMotorClient[Any] | None = None
        self.db: AgnosticDatabase[Any] | None = None

    async def connect(self) -> None:
        uri = (
            f"mongodb://{MONGO_DB['username']}:{MONGO_DB['password']}@"
            f"{MONGO_DB['host']}:{MONGO_DB['port']}/"
            f"{MONGO_DB['name']}?authSource=admin"
        )
        self.client = AsyncIOMotorClient(uri)
        self.db = self.client[MONGO_DB["name"]]
        logger.info("✅ Connection to MongoDB established.")

    async def close(self) -> None:
        if self.client:
            self.client.close()
            logger.info("✅ MongoDB connection closed.")

    def get_database(self) -> AgnosticDatabase[Any]:
        if self.db is None:
            raise RuntimeError("Database connection has not been established.")
        return self.db


async def ensure_indexes(db: AgnosticDatabase[Any]) -> None:
    await db["documents"].create_index("document_id")
    await db["documents"].create_index("user_id")
    await db["profiles"].create_index("user_id")
    await db["actions_costs"].create_index("user_id")
    await db["total_costs"].create_index("user_id")


mongo_handler = MongoDBHandler()


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    await mongo_handler.connect()
    app.state.db = mongo_handler.get_database()
    yield
    await mongo_handler.close()


def get_database(request: Request) -> AgnosticDatabase[Any]:
    return request.app.state.db  # type: ignore
