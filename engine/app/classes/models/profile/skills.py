from typing import Annotated, List, Optional

from pydantic import BaseModel, Field, field_validator

from app.utils.pydantic_custom_types import (
    ForceLongStr,
    ForceShortStr,
    ShortStr,
)


class SkillNote(BaseModel):
    name: ForceShortStr
    experience_years: float
    description: ForceLongStr


class Skills(BaseModel):
    list: Annotated[List[ShortStr], Field(..., max_items=50)]
    notes: Optional[Annotated[List[SkillNote], Field(None, max_items=50)]] = (
        None
    )

    @field_validator("list", mode="before")
    @classmethod
    def crop_notes_list(cls, v: List[str]) -> List[str]:
        return v[:50] if len(v) > 50 else v
