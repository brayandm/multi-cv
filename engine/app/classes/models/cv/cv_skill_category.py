from typing import Annotated, List

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    MAX_SKILLS_PER_CATEGORY,
    ForceShortStr,
    crop_list,
)


class CvSkillCategory(BaseModel):
    category: ForceShortStr
    list: Annotated[
        List[ForceShortStr],
        crop_list(MAX_SKILLS_PER_CATEGORY),
        Field(None, max_items=MAX_SKILLS_PER_CATEGORY),
    ]
