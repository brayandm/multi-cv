from typing import Optional

from pydantic import BaseModel

from app.utils.pydantic_custom_types import LongStr


class Settings(BaseModel):
    custom_prompt: Optional[LongStr] = None
