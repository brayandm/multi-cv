from typing import Any, Optional

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Profile, Experience
from app.database.mongodb import get_database
from app.utils.preserve_notes import preserve_notes, remove_notes


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

    async def get_profile(
        self, user_id: int, with_notes: bool = False
    ) -> Optional[Profile]:
        profile = await self.db.profiles.find_one({"user_id": user_id})

        if profile is None:
            return None

        if with_notes:
            return Profile(**profile)

        return remove_notes(Profile(**profile))

    async def get_experience(self, user_id: int, id: str) -> Experience:
        profile = await self.get_profile(user_id, with_notes=True)

        if profile is None:
            raise ValueError("Profile not found")

        experiences = profile.experience

        for experience in experiences:
            if experience.id == id:
                return experience

        raise ValueError("Experience not found")

    async def update_notes_experience(
        self, user_id: int, experience_id: str, notes: str
    ) -> None:
        profile = await self.get_profile(user_id, with_notes=True)

        if profile is None:
            raise ValueError("Profile not found")

        for experience in profile.experience:
            if experience.id == experience_id:
                experience.notes = notes

                await self.db.profiles.update_one(
                    {"user_id": user_id},
                    {"$set": profile.model_dump()},
                    upsert=True,
                )
                break


def get_profile_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> ProfileService:
    return ProfileService(db)
