from typing import List, Literal, Annotated

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import LongStr, MAX_CHAT_MESSAGES

SenderType = Annotated[Literal["bot", "person"], Field(...)]


class Message(BaseModel):
    sender: SenderType
    text: LongStr


class Chat(BaseModel):
    messages: Annotated[List[Message], Field(..., max_items=MAX_CHAT_MESSAGES)]
