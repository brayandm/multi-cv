from typing import Annotated, List, Optional

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    MAX_SKILS,
    ForceLongStr,
    ForceShortStr,
    ShortStr,
    crop_list,
)


class SkillNote(BaseModel):
    name: ForceShortStr
    experience_years: float
    description: ForceLongStr


class Skills(BaseModel):
    list: Annotated[List[ShortStr], Field(..., max_items=MAX_SKILS)]

    notes: Optional[
        Annotated[
            Optional[List[SkillNote]],
            crop_list(MAX_SKILS),
            Field(None, max_items=MAX_SKILS),
        ]
    ] = None
