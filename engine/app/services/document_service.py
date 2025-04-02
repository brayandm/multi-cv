from typing import Any

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Cv, CvTemplate

from datetime import datetime, timezone

from app.database.mongodb import get_database

from app.framework.logging import logger

import uuid
from io import BytesIO

from app.facades.filesystem_facade import FilesystemFacade


class DocumentService:
    def __init__(self, db: AgnosticDatabase[Any]):
        self.db = db

    async def save_cv(
        self,
        user_id: int,
        cv: Cv,
        cv_template: CvTemplate,
        filename: str,
        file: bytes,
    ) -> None:

        try:

            fs = FilesystemFacade.get_filesystem()

            cv_id = str(uuid.uuid4())
            dest_folder = f"/documents/cv/{user_id}/{cv_id}/"

            if not fs.exists(dest_folder):
                fs.makedirs(dest_folder)

            fs.writefile(
                dest_folder + filename,
                BytesIO(file),
            )

            await self.db["documents"].insert_one(
                {
                    "user_id": user_id,
                    "name": filename,
                    "size": len(file),
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc),
                    "type": "cv",
                    "cv": cv,
                    "cv_template": cv_template,
                }
            )
        except Exception as e:
            logger.info(f"Error saving CV document: {e}")

            if fs.exists(dest_folder):
                fs.remove(dest_folder)

            raise e


def get_document_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> DocumentService:
    return DocumentService(db)
