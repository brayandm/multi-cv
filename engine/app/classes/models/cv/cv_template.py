from typing import Annotated, Literal

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import ShortStr

from .cv_texts import CvTexts

CvTemplateType = Annotated[
    Literal[
        "latex",
        "html",
    ],
    Field(...),
]


class CvTemplate(BaseModel):
    id: ShortStr
    type: CvTemplateType
    cv_texts: CvTexts
