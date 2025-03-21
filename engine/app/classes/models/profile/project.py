from typing import Optional

from pydantic import BaseModel, field_validator

from app.utils.pydantic_custom_types import (
    LongStr,
    NotesStr,
    ShortStr,
    MAX_NOTES_LENGTH,
)


class Project(BaseModel):
    id: ShortStr
    name: ShortStr
    link: ShortStr
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
