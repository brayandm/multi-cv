from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class Traduction(BaseModel):
    locale: ShortStr
    name: ShortStr
