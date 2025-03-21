from pydantic import BaseModel

from app.utils.pydantic_custom_types import LongStr, ShortStr


class CvProject(BaseModel):
    name: ShortStr
    location: ShortStr
    start_date: ShortStr
    end_date: ShortStr
    link: ShortStr
    description: LongStr
