from typing import Annotated, Literal

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import ShortStr

CoverLetterTemplateType = Annotated[
    Literal[
        "latex",
        "html",
    ],
    Field(...),
]


class CoverLetterTemplate(BaseModel):
    id: ShortStr
    type: CoverLetterTemplateType
