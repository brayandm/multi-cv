import os
import uuid
from datetime import datetime, timezone
from io import BytesIO
from typing import Any, Optional, Tuple
from urllib.parse import quote

from fastapi import Depends
from motor.core import AgnosticDatabase

from app.classes.models import Cv, CvTemplate, Document, Profile
from app.database.mongodb import get_database
from app.facades.document_render_facade import DocumentRenderFacade
from app.facades.filesystem_facade import FilesystemFacade
from app.framework.decorators.context_vars import get_user_id
from app.framework.logging import logger
from app.utils.parsers import get_first_name_last_name


class DocumentService:
    def __init__(self, db: AgnosticDatabase[Any]):
        self.db = db

    def get_file_extension(self, filename: str) -> str:
        return os.path.splitext(filename)[1]

    async def save_cv(
        self,
        user_id: int,
        cv: Cv,
        cv_template: CvTemplate,
        filename: str,
        file: bytes,
        application_id: Optional[str] = None,
    ) -> None:

        try:

            fs = FilesystemFacade.get_filesystem()

            cv_id = str(uuid.uuid4())
            dest_folder = f"/documents/cv/{user_id}/{cv_id}/"

            if not fs.exists(dest_folder):
                fs.makedirs(dest_folder)

            fs.writefile(
                dest_folder + "document" + self.get_file_extension(filename),
                BytesIO(file),
            )

            await self.db["documents"].insert_one(
                {
                    "document_id": cv_id,
                    "user_id": user_id,
                    "application_id": application_id,
                    "name": filename,
                    "size": len(file),
                    "created_at": datetime.now(timezone.utc),
                    "updated_at": datetime.now(timezone.utc),
                    "type": "cv",
                    "cv": cv.model_dump(),
                    "cv_template": cv_template.model_dump(),
                }
            )
        except Exception as e:
            logger.info(f"Error saving CV document: {e}")

            if fs.exists(dest_folder):
                fs.removetree(dest_folder)

            raise e

    async def get_all_documents(self, user_id: int) -> list[Document]:
        documents_data = (
            await self.db["documents"]
            .find({"user_id": user_id})
            .to_list(length=None)
        )
        return [Document(**doc) for doc in documents_data]

    async def get_document_file(
        self, user_id: int, document_id: str
    ) -> Tuple[str, bytes]:

        document = await self.db["documents"].find_one(
            {"user_id": user_id, "document_id": document_id}
        )
        if not document:
            raise ValueError("Document not found")

        fs = FilesystemFacade.get_filesystem()
        dest_folder = f"/documents/cv/{user_id}/{document_id}/"
        filename = document["name"]
        file = fs.readbytes(
            dest_folder + "document" + self.get_file_extension(filename)
        )

        if not file:
            raise ValueError("File not found")

        return filename, file

    async def delete_document(self, user_id: int, document_id: str) -> None:
        document = await self.db["documents"].find_one(
            {"user_id": user_id, "document_id": document_id}
        )
        if not document:
            raise ValueError("Document not found")

        fs = FilesystemFacade.get_filesystem()
        dest_folder = f"/documents/cv/{user_id}/{document_id}/"

        if fs.exists(dest_folder):
            fs.removetree(dest_folder)

        await self.db["documents"].delete_one(
            {"user_id": user_id, "document_id": document_id}
        )

    async def delete_all_documents(self, user_id: int) -> None:
        documents = await self.get_all_documents(user_id)

        for document in documents:
            try:
                await self.delete_document(
                    user_id=user_id, document_id=document.document_id
                )
            except Exception as e:
                logger.info(f"Error deleting document: {e}")

    async def process_cv(
        self,
        profile: Profile,
        cv: Cv,
        cv_template: CvTemplate,
        application_id: Optional[str] = None,
    ) -> Tuple[str, bytes]:
        document_render = DocumentRenderFacade.get_render()

        document_render.render_cv(cv, cv_template)

        pdf_bytes = document_render.get_cv()

        first_name = profile.basic_info.first_name
        last_name = profile.basic_info.last_name
        filename = f"{get_first_name_last_name(first_name, last_name)}_CV.pdf"

        await self.save_cv(
            user_id=get_user_id(),
            cv=cv,
            cv_template=cv_template,
            filename=filename,
            file=pdf_bytes,
            application_id=application_id,
        )

        quoted_filename = quote(filename)

        return (quoted_filename, pdf_bytes)

    async def get_application_documents(
        self, user_id: int, application_id: str
    ) -> list[Document]:
        documents = (
            await self.db["documents"]
            .find({"user_id": user_id, "application_id": application_id})
            .to_list(length=None)
        )

        return [Document(**doc) for doc in documents]


def get_document_service(
    db: AgnosticDatabase[Any] = Depends(get_database),
) -> DocumentService:
    return DocumentService(db)
