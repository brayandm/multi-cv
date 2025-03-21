from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class CvEducation(BaseModel):
    institution: ShortStr
    career: ShortStr
    location: ShortStr
    start_date: ShortStr
    end_date: ShortStr
