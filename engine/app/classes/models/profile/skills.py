from typing import Annotated, List, Optional

from pydantic import BaseModel, Field, field_validator

from app.utils.pydantic_custom_types import (
    LongStr,
    ShortStr,
    MAX_SHORT_STR_LENGTH,
    MAX_LONG_STR_LENGTH,
)


class SkillNote(BaseModel):
    name: ShortStr
    experience_years: float
    description: LongStr

    @field_validator("name", mode="before")
    @classmethod
    def crop_name(cls, v: Optional[str]) -> Optional[str]:
        if isinstance(v, str) and len(v) > MAX_SHORT_STR_LENGTH:
            return v[:MAX_SHORT_STR_LENGTH]
        return v

    @field_validator("description", mode="before")
    @classmethod
    def crop_description(cls, v: Optional[str]) -> Optional[str]:
        if isinstance(v, str) and len(v) > MAX_LONG_STR_LENGTH:
            return v[:MAX_LONG_STR_LENGTH]
        return v


class Skills(BaseModel):
    list: Annotated[List[ShortStr], Field(..., max_items=50)]
    notes: Optional[Annotated[List[SkillNote], Field(None, max_items=50)]] = (
        None
    )

    @field_validator("list", mode="before")
    @classmethod
    def crop_notes_list(cls, v: List[str]) -> List[str]:
        return v[:50] if len(v) > 50 else v
