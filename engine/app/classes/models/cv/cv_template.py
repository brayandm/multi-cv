from pydantic import BaseModel

from app.utils.pydantic_custom_types import ForceShortStr


class CvTemplate(BaseModel):
    id: ForceShortStr
