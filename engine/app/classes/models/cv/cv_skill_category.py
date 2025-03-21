from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    ShortStr,
    crop_list,
    MAX_SKILLS_PER_CATEGORY,
)

from typing import List, Annotated


class CvSkillCategory(BaseModel):
    category: ShortStr
    list: Annotated[
        List[ShortStr],
        crop_list(MAX_SKILLS_PER_CATEGORY),
        Field(None, max_items=MAX_SKILLS_PER_CATEGORY),
    ]
