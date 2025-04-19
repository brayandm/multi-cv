from typing import Any

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Settings
from app.database.mongodb import get_database


class SettingsService:
    def __init__(self, db: AgnosticDatabase[Any]):
        self.db = db

    async def sync_settings(self, user_id: int, settings: Settings) -> None:
        new_settings = settings.model_dump(exclude_none=True)
        new_settings["user_id"] = user_id

        await self.db.settings.update_one(
            {"user_id": user_id},
            {"$set": new_settings},
            upsert=True,
        )

    async def get_settings(self, user_id: int) -> Settings:

        settings_data = await self.db.settings.find_one({"user_id": user_id})
        if settings_data:
            return Settings(**settings_data)
        return Settings()

    async def delete_settings(self, user_id: int) -> None:
        await self.db.settings.delete_one({"user_id": user_id})


def get_settings_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> SettingsService:
    return SettingsService(db)
