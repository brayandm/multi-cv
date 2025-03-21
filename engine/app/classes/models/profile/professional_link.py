from pydantic import BaseModel

from app.utils.pydantic_custom_types import ShortStr


class ProfessionalLink(BaseModel):
    name: ShortStr
    link: ShortStr
