from typing import Annotated, List, Literal

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import MAX_CHAT_MESSAGES, ForceLongStr

SenderType = Annotated[Literal["bot", "person"], Field(...)]


class Message(BaseModel):
    sender: SenderType
    text: ForceLongStr


class Chat(BaseModel):
    messages: Annotated[List[Message], Field(..., max_items=MAX_CHAT_MESSAGES)]
