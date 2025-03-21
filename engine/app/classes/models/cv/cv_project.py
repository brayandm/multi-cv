from pydantic import BaseModel

from app.utils.pydantic_custom_types import ForceLongStr, ForceShortStr


class CvProject(BaseModel):
    name: ForceShortStr
    location: ForceShortStr
    start_date: ForceShortStr
    end_date: ForceShortStr
    link: ForceShortStr
    description: ForceLongStr
