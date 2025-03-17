from typing import Any

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Profile
from app.database.mongodb import get_database
from app.utils.merger import merge_dicts


class ProfileService:
    def __init__(self, db: AgnosticDatabase[Any]):
        self.db = db

    async def sync_profile(self, user_id: int, profile: Profile) -> Profile:
        profile_data = profile.model_dump()
        profile_data["user_id"] = user_id

        existing_profile = (
            await self.db.profiles.find_one({"user_id": user_id}) or {}
        )

        new_profile = merge_dicts(
            existing_profile,
            profile_data,
            preserve_keys=["notes", "general_notes"],
        )

        await self.db.profiles.update_one(
            {"user_id": user_id},
            {"$set": new_profile},
            upsert=True,
        )

        return profile


def get_profile_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> ProfileService:
    return ProfileService(db)
