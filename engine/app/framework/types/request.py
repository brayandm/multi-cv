from pydantic import BaseModel


class DeleteRequest(BaseModel):
    user_id: int


class DocumentDownloadRequest(BaseModel):
    document_id: str
