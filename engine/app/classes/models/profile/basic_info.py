from typing import Optional

from pydantic import BaseModel, field_validator

from app.utils.pydantic_custom_types import (
    MAX_NOTES_LENGTH,
    LongStr,
    NotesStr,
    ShortStr,
)


class BasicInfo(BaseModel):
    full_name: ShortStr
    email: ShortStr
    about: LongStr
    phone_country_code: ShortStr
    phone_number: ShortStr
    location: ShortStr
    notes: Optional[NotesStr] = None

    @field_validator("notes", mode="before")
    @classmethod
    def crop_notes(cls, v: Optional[str]) -> Optional[str]:
        if isinstance(v, str) and len(v) > MAX_NOTES_LENGTH:
            return v[:MAX_NOTES_LENGTH]
        return v
