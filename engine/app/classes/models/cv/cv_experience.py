from typing import Annotated, List

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    MAX_EXPERIENCE_BULLETS_LENGTH,
    LongStr,
    ShortStr,
    crop_list,
)


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
