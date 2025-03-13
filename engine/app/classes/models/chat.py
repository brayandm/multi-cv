from typing import Literal, List
from pydantic import BaseModel, Field

type SenderType = Literal["bot", "person"]


class Message(BaseModel):
    sender: SenderType = Field(...)
    text: str = Field(..., min_length=1)


class Chat(BaseModel):
    messages: List[Message] = Field(...)
