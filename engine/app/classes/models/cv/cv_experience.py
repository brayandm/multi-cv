from typing import Annotated, List

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    MAX_EXPERIENCE_BULLETS_LENGTH,
    ForceLongStr,
    ForceShortStr,
    crop_list,
)


class CvExperience(BaseModel):
    company: ForceShortStr
    link: ForceShortStr
    position: ForceShortStr
    location: ForceShortStr
    start_date: ForceShortStr
    end_date: ForceShortStr
    descriptions: Annotated[
        List[ForceLongStr],
        crop_list(MAX_EXPERIENCE_BULLETS_LENGTH),
        Field(None, max_items=MAX_EXPERIENCE_BULLETS_LENGTH),
    ]
