from typing import Annotated, Literal

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import ExtraLongStr, ShortStr

GenerationInputType = Annotated[
    Literal["simple", "role", "job"],
    Field(...),
]


class GenerationInput(BaseModel):
    type: GenerationInputType
    role_input: ShortStr
    job_input: ExtraLongStr
