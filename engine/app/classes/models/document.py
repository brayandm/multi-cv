from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field

from app.classes.models import (
    CoverLetter,
    CoverLetterTemplate,
    Cv,
    CvTemplate,
)
from app.utils.pydantic_custom_types import LongStr, ShortStr


class Document(BaseModel):
    document_id: ShortStr
    user_id: int
    name: LongStr  # Is concatenation of a ShortStr + something
    size: int
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    type: ShortStr

    class Config:
        json_encoders = {
            datetime: lambda v: v.astimezone(timezone.utc)
            .isoformat()
            .replace("+00:00", "Z")
        }


class CvDocument(Document):
    type: Literal["cv"]
    cv: Cv
    cv_template: CvTemplate


class CoverLetterDocument(Document):
    type: Literal["cover_letter"]
    cover_letter: CoverLetter
    cover_letter_template: CoverLetterTemplate
