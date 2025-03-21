from typing import Optional

from pydantic import BaseModel, field_validator

from app.utils.pydantic_custom_types import (
    MAX_NOTES_LENGTH,
    LongStr,
    NotesStr,
    ShortStr,
)


class Experience(BaseModel):
    id: ShortStr
    company: ShortStr
    link: ShortStr
    role: ShortStr
    location: ShortStr
    description: LongStr
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
