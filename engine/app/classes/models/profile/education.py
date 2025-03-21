from typing import Optional

from pydantic import BaseModel, field_validator

from app.utils.pydantic_custom_types import (
    NotesStr,
    ShortStr,
    MAX_NOTES_LENGTH,
)


class Education(BaseModel):
    id: ShortStr
    institution: ShortStr
    link: ShortStr
    career: ShortStr
    location: ShortStr
    start_date: ShortStr
    end_date: ShortStr
    is_present: bool
    notes: Optional[NotesStr] = None

    @field_validator("notes", mode="before")
    @classmethod
    def crop_notes(cls, v: Optional[str]) -> Optional[str]:
        if isinstance(v, str) and len(v) > MAX_NOTES_LENGTH:
            return v[:MAX_NOTES_LENGTH]
        return v
