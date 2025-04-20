import uuid
from typing import Any

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Application
from app.database.mongodb import get_database


class ApplicationService:
    def __init__(self, db: AgnosticDatabase[Any]):
        self.db = db

    async def store_application(
        self, user_id: int, application: Application
    ) -> str:
        application_id = str(uuid.uuid4())
        new_application = application.model_dump(exclude_none=True)
        new_application["user_id"] = user_id
        new_application["application_id"] = application_id

        await self.db.applications.insert_one(new_application)

        return application_id

    async def get_application(
        self, user_id: int, application_id: str
    ) -> Application:
        application = await self.db.applications.find_one(
            {"user_id": user_id, "application_id": application_id}
        )
        if not application:
            raise ValueError("Application not found")
        return Application(**application)

    async def get_applications(self, user_id: int) -> list[Application]:
        applications = await self.db.applications.find(
            {"user_id": user_id}
        ).to_list(length=None)
        return [Application(**app) for app in applications]

    async def update_application(
        self, user_id: int, application_id: str, application: Application
    ) -> None:
        updated_application = application.model_dump(exclude_none=True)
        await self.db.applications.update_one(
            {"user_id": user_id, "application_id": application_id},
            {"$set": updated_application},
        )

    async def delete_application(
        self, user_id: int, application_id: str
    ) -> None:
        await self.db.applications.delete_one(
            {"user_id": user_id, "application_id": application_id}
        )

    async def delete_applications(self, user_id: int) -> None:
        await self.db.applications.delete_many({"user_id": user_id})


def get_application_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> ApplicationService:
    return ApplicationService(db)
