from pydantic import BaseModel


class DocumentDownloadRequest(BaseModel):
    document_id: str
