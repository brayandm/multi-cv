from typing import List, Union

from langchain.callbacks import get_openai_callback
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from langchain.schema import (
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
)
from langchain_openai import ChatOpenAI
from pydantic import BaseModel, SecretStr

from app.classes.models import Chat
from app.config import OPENAI_API_KEY
from app.database.mongodb import mongo_handler
from app.framework.decorators.context_vars import (
    get_action,
    get_action_id,
    get_user_id,
)


class ChatEngineService:
    def __init__(self) -> None:
        self.chat = ChatOpenAI(
            api_key=SecretStr(OPENAI_API_KEY),
            model="gpt-4o-mini",
            temperature=0.7,
        )
        self.db = mongo_handler.get_database()

    async def add_cost(self, cost: float, tokens: int) -> None:

        user_id = get_user_id()
        action_id = get_action_id()
        action = get_action()

        await self.db["total_costs"].update_one(
            {"user_id": user_id},
            {"$inc": {"total_cost": cost, "total_tokens": tokens}},
            upsert=True,
        )

        await self.db["actions_costs"].insert_one(
            {
                "user_id": user_id,
                "action_id": action_id,
                "action": action,
                "cost": cost,
                "tokens": tokens,
            }
        )

    async def generate_response(self, messages: List[BaseMessage]) -> str:

        with get_openai_callback() as cb:
            response = await self.chat.ainvoke(messages)
            total_cost = cb.total_cost
            total_tokens = cb.total_tokens

            await self.add_cost(total_cost, total_tokens)

        return str(response.content)

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

        with get_openai_callback() as cb:
            response = await chain.arun({})
            total_cost = cb.total_cost
            total_tokens = cb.total_tokens

            await self.add_cost(total_cost, total_tokens)

        return str(response)
