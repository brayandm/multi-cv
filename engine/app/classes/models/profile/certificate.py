from typing import Optional

from pydantic import BaseModel

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
    issue_date: ShortStr
    expiration_date: ShortStr
    certificate_id: ShortStr
    verification_url: ShortStr
    description: LongStr
    notes: Optional[NotesStr] = None
