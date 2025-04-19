import uuid
from typing import Optional

from pydantic import BaseModel, field_validator

from app.utils.pydantic_custom_types import (
    LongStr,
    NotesStr,
    ShortStr,
)


class CertificateId(BaseModel):
    id: ShortStr


class Certificate(BaseModel):
    id: ShortStr
    name: ShortStr
    issuer: ShortStr
    certificate_id: ShortStr
    verification_url: ShortStr
    description: LongStr
    issue_date: ShortStr
    expiration_date: ShortStr
    hasnt_expiration_date: bool
    notes: Optional[NotesStr] = None

    @field_validator("id", mode="before")
    @classmethod
    def set_id_if_empty(cls, v: str) -> str:
        if v == "":
            return str(uuid.uuid4())
        return v
