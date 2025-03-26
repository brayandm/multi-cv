from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class CoverLetterTemplate(BaseModel):
    id: ShortStr
