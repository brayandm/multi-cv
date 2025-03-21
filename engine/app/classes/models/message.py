from pydantic import BaseModel

from app.utils.pydantic_custom_types import LongStr


class Message(BaseModel):
    message: LongStr
