from typing import Any, Optional

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
            await self.db.profiles.find_one({"user_id": user_id}) or None
        )

        if existing_profile is not None:

            preserve_notes(
                profile,
                Profile(**existing_profile),
            )

        new_profile = profile.model_dump()
        new_profile["user_id"] = user_id

        await self.db.profiles.update_one(
            {"user_id": user_id},
            {"$set": new_profile},
            upsert=True,
        )

        return profile

    async def get_profile(self, user_id: int) -> Optional[Profile]:
        profile = await self.db.profiles.find_one({"user_id": user_id})

        if profile is None:
            return None

        return Profile(**profile)


def get_profile_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> ProfileService:
    return ProfileService(db)
