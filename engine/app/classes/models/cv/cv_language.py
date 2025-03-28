from pydantic import BaseModel, Field

from typing import Annotated, Literal

from app.utils.pydantic_custom_types import ShortStr


CvLanguageLevel = Annotated[
    Literal[
        "Basic",
        "Intermediate",
        "Professional",
        "Native",
    ],
    Field(...),
]


class CvLanguage(BaseModel):
    name: ShortStr
    level: CvLanguageLevel
