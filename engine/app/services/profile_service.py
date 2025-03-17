from typing import Any

from fastapi import Depends
from pymongo.database import Database

from app.classes.models import Profile
from app.database.mongodb import get_database


class ProfileService:
    def __init__(self, db: Database[Any]):
        self.db = db

    def sync_profile(self, profile: Profile) -> Profile:
        self.db.profiles.insert_one(profile.model_dump())
        return profile


def get_profile_service(
    db: Database[Any] = Depends(get_database),
) -> ProfileService:
    return ProfileService(db)
