from pydantic import BaseModel, Field
from typing import Annotated, Literal
from app.utils.pydantic_custom_types import ShortStr, ExtraLongStr


GenerationInputType = Annotated[
    Literal["simple", "role", "job"],
    Field(...),
]


class GenerationInput(BaseModel):
    type: GenerationInputType
    role_input: ShortStr
    job_input: ExtraLongStr
