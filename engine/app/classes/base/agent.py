from abc import ABC
from typing import List

from langchain.schema import (
    BaseMessage,
)
from pydantic import BaseModel

from app.classes.models import Chat, ChatMessage
from app.services.chat_engine import ChatEngineService


class Agent(ABC):
    def __init__(
        self,
    ) -> None:
        self.engine = ChatEngineService()

    async def generate_response(self, messages: List[BaseMessage]) -> str:
        response = await self.engine.generate_response(messages)
        return response

    async def chat_response(
        self,
        system_prompt: str,
        context_data: BaseModel,
        chat: Chat,
    ) -> ChatMessage:
        response_text = await self.engine.run_chain(
            system_prompt, context_data, chat
        )
        return ChatMessage(sender="bot", text=response_text)
