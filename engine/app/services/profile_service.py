from typing import Any

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Profile
from app.database.mongodb import get_database


class ProfileService:
    def __init__(self, db: AgnosticDatabase[Any]):
        self.db = db

    async def sync_profile(self, user_id: int, profile: Profile) -> Profile:
        profile_data = profile.model_dump()

        profile_data["user_id"] = user_id

        await self.db.profiles.update_one(
            {"user_id": user_id},
            {"$set": profile_data},
            upsert=True,
        )

        return profile


def get_profile_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> ProfileService:
    return ProfileService(db)
