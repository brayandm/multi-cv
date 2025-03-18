from typing import Any

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Profile
from app.database.mongodb import get_database
from app.utils.preserve_notes import preserve_notes


class ProfileService:
    def __init__(self, db: AgnosticDatabase[Any]):
        self.db = db

    async def sync_profile(self, user_id: int, profile: Profile) -> Profile:
        existing_profile = (
            await self.db.profiles.find_one({"user_id": user_id}) or {}
        )

        preserve_notes(
            profile,
            Profile(**existing_profile),
        )

        profile = profile.model_dump()
        profile["user_id"] = user_id

        await self.db.profiles.update_one(
            {"user_id": user_id},
            {"$set": profile},
            upsert=True,
        )

        return profile

    async def get_profile(self, user_id: int) -> Profile:
        profile = await self.db.profiles.find_one({"user_id": user_id})

        if profile is None:
            raise ValueError("Profile not found for the given user_id")

        return Profile(**profile)


def get_profile_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> ProfileService:
    return ProfileService(db)
