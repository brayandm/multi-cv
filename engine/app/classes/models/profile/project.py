from typing import Optional

from pydantic import BaseModel, field_validator

from app.utils.pydantic_custom_types import (
    LongStr,
    NotesStr,
    ShortStr,
)

import uuid


class Project(BaseModel):
    id: ShortStr
    name: ShortStr
    link: ShortStr
    description: LongStr
    start_date: ShortStr
    end_date: ShortStr
    is_present: bool
    notes: Optional[NotesStr] = None

    @field_validator("id", mode="before")
    @classmethod
    def set_id_if_empty(cls, v: str) -> str:
        if v == "":
            return str(uuid.uuid4())
        return v
