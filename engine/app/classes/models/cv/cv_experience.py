from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    ShortStr,
    LongStr,
    MAX_EXPERIENCE_BULLETS_LENGTH,
    crop_list,
)

from typing import List, Annotated


class CvExperience(BaseModel):
    company: ShortStr
    position: ShortStr
    location: ShortStr
    start_date: ShortStr
    end_date: ShortStr
    descriptions: Annotated[
        List[LongStr],
        crop_list(MAX_EXPERIENCE_BULLETS_LENGTH),
        Field(None, max_items=MAX_EXPERIENCE_BULLETS_LENGTH),
    ]
