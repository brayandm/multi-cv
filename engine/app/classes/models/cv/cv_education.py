from pydantic import BaseModel

from app.utils.pydantic_custom_types import ForceShortStr


class CvEducation(BaseModel):
    institution: ForceShortStr
    career: ForceShortStr
    location: ForceShortStr
    start_date: ForceShortStr
    end_date: ForceShortStr
