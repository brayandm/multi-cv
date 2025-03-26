from typing import List, Union

from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from langchain.schema import AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, SecretStr

from app.config import OPENAI_API_KEY
from app.classes.models import Chat


class ChatEngineService:
    def __init__(self) -> None:
        self.chat = ChatOpenAI(
            api_key=SecretStr(OPENAI_API_KEY),
            model="gpt-4o-mini",
            temperature=0.7,
        )

    async def run_chain(
        self, system_prompt: str, context_data: BaseModel, chat: Chat
    ) -> str:
        context_dict = context_data.model_dump_json()

        messages: List[Union[HumanMessage, AIMessage, SystemMessage]] = [
            SystemMessage(content=system_prompt),
            SystemMessage(content=f"Context Data: {context_dict}"),
        ]

        for msg in chat.messages:
            if msg.sender == "person":
                messages.append(HumanMessage(content=msg.text))
            elif msg.sender == "bot":
                messages.append(AIMessage(content=msg.text))

        prompt = ChatPromptTemplate.from_messages(messages)
        chain = LLMChain(llm=self.chat, prompt=prompt)

        return str(await chain.arun({}))


def get_chat_engine_service() -> ChatEngineService:
    return ChatEngineService()
