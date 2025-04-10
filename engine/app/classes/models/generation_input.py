from typing import Annotated, Literal, Optional

from pydantic import BaseModel, Field, model_validator

from app.utils.pydantic_custom_types import ExtraLongStr, ShortStr, LongStr

GenerationInputType = Annotated[
    Literal["simple", "role", "job"],
    Field(...),
]


class GenerationInput(BaseModel):
    type: GenerationInputType
    role_input: Optional[ShortStr] = None
    job_input: Optional[ExtraLongStr] = None
    custom_prompt: LongStr

    @model_validator(mode="after")
    def check_inputs(self) -> "GenerationInput":
        if self.type == "simple":
            if self.role_input is not None or self.job_input is not None:
                raise ValueError(
                    "For type 'simple', both role_input and job_input must be "
                    "null"
                )
        elif self.type == "role":
            if self.role_input is None or self.job_input is not None:
                raise ValueError(
                    "For type 'role', role_input must not be null and "
                    "job_input must be null"
                )
        elif self.type == "job":
            if self.job_input is None or self.role_input is not None:
                raise ValueError(
                    "For type 'job', job_input must not be null and "
                    "role_input must be null"
                )
        return self
