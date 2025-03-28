from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, Field

from app.classes.models import (
    CoverLetter,
    CoverLetterTemplate,
    CoverLetterTexts,
    Cv,
    CvTemplate,
    CvTexts,
)
from app.utils.pydantic_custom_types import ShortStr


class Document(BaseModel):
    id: ShortStr = Field(alias="_id")
    user_id: ShortStr
    name: ShortStr
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    type: ShortStr

    class Config:
        allow_population_by_field_name = True


class CvDocument(Document):
    type: Literal["cv"]
    cv: Cv
    cv_template: CvTemplate
    cv_texts: CvTexts


class CoverLetterDocument(Document):
    type: Literal["cover_letter"]
    cover_letter: CoverLetter
    cover_letter_template: CoverLetterTemplate
    cover_letter_texts: CoverLetterTexts
