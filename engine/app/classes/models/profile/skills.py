from typing import Annotated, List, Optional

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    ForceLongStr,
    ForceShortStr,
    ShortStr,
    crop_list,
    MAX_SKILS,
)


class SkillNote(BaseModel):
    name: ForceShortStr
    experience_years: float
    description: ForceLongStr


class Skills(BaseModel):
    list: Annotated[List[ShortStr], Field(..., max_items=MAX_SKILS)]

    notes: Annotated[
        Optional[List[SkillNote]],
        crop_list(MAX_SKILS),
        Field(None, max_items=MAX_SKILS),
    ]
