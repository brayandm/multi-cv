from fastapi import Depends
from pymongo.database import Database
from typing import Any
from app.main import get_database
from app.classes.models import Profile


class ProfileService:
    def __init__(self, db: Database[Any] = Depends(get_database)):
        self.db = db

    def sync_profile(self, profile: Profile) -> Profile:
        self.db.profiles.insert_one(profile.model_dump())
        return profile
