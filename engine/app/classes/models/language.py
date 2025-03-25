from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class Language(BaseModel):
    locale: ShortStr
    name: ShortStr
