from pydantic import BaseModel

from typing import Optional

from app.utils.pydantic_custom_types import LongStr


class Settings(BaseModel):
    custom_prompt: Optional[LongStr] = None
