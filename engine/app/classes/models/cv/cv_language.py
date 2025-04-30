from pydantic import BaseModel, field_validator

from app.utils.pydantic_custom_types import ShortStr


class CvLanguage(BaseModel):
    name: ShortStr
    level: ShortStr

    @field_validator("level", mode="before")
    @classmethod
    def format_level(cls, v: str) -> str:
        return v.title() if isinstance(v, str) else v
