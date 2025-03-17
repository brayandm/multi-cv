from typing import Any

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Profile
from app.database.mongodb import get_database


class ProfileService:
    def __init__(self, db: AgnosticDatabase[Any]):
        self.db = db

    async def sync_profile(self, profile: Profile) -> Profile:
        await self.db.profiles.insert_one(profile.model_dump())
        return profile


def get_profile_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> ProfileService:
    return ProfileService(db)
