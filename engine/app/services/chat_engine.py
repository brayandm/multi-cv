import asyncio
from datetime import datetime, timezone
from typing import Any, List, Optional, Union

import requests  # type: ignore
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
from openai import OpenAI
from pydantic import BaseModel, SecretStr
from pymongo import ReturnDocument

from app.classes.models import Chat
from app.config import (
    BACKEND_API_URL,
    INTER_COMMUNICATION_TOKEN,
    OPENAI_API_KEY,
)
from app.database.mongodb import mongo_handler
from app.framework.decorators.context_vars import (
    get_action,
    get_action_id,
    get_user_id,
)
from app.framework.logging import logger


class ChatEngineService:
    def __init__(self) -> None:
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
                "created_at": datetime.now(timezone.utc),
            }
        )

    async def generate_response(
        self,
        messages: List[BaseMessage],
        max_completion_tokens: Optional[int] = None,
    ) -> str:

        user_id = str(get_user_id())

        client = ChatOpenAI(
            api_key=SecretStr(OPENAI_API_KEY),
            model="gpt-4o-mini",
            temperature=0.7,
            max_completion_tokens=(
                max_completion_tokens
                if max_completion_tokens is not None
                else None
            ),
        )

        with get_openai_callback() as cb:
            response = await client.ainvoke(messages, user=user_id)
            total_cost = cb.total_cost
            total_tokens = cb.total_tokens

            await self.add_cost(total_cost, total_tokens)

        return str(response.content)

    async def run_chain(
        self,
        system_prompt: str,
        context_data: BaseModel,
        chat: Chat,
        max_completion_tokens: Optional[int] = None,
    ) -> str:
        user_id = str(get_user_id())

        client = ChatOpenAI(
            api_key=SecretStr(OPENAI_API_KEY),
            model="gpt-4o-mini",
            temperature=0.7,
            max_completion_tokens=(
                max_completion_tokens
                if max_completion_tokens is not None
                else None
            ),
        )

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
        chain = LLMChain(llm=client, prompt=prompt)

        with get_openai_callback() as cb:
            response = await chain.arun(user=user_id)
            total_cost = cb.total_cost
            total_tokens = cb.total_tokens

            await self.add_cost(total_cost, total_tokens)

        return str(response)

    async def moderation(self, text: str) -> bool:
        def sync_moderation() -> Any:
            client = OpenAI(api_key=OPENAI_API_KEY)
            result = client.moderations.create(
                model="omni-moderation-latest",
                input=text,
            )
            return result

        result = await asyncio.to_thread(sync_moderation)

        flagged = result.results[0].flagged

        user_id = get_user_id()

        if flagged:
            await self.moderate_user(
                user_id=user_id,
                message=text,
                result=result,
            )
        return not flagged

    async def moderate_user(
        self, user_id: int, message: str, result: Any
    ) -> None:
        await self.db["moderated_messages"].insert_one(
            {
                "user_id": user_id,
                "message": message,
                "result": result.model_dump(),
                "created_at": datetime.now(timezone.utc),
            }
        )

        doc = await self.db["user_moderation_stats"].find_one_and_update(
            {"user_id": user_id},
            {
                "$inc": {"inappropriate_messages": 1},
                "$setOnInsert": {"created_at": datetime.now(timezone.utc)},
                "$set": {"updated_at": datetime.now(timezone.utc)},
            },
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )

        inappropriate_messages = doc["inappropriate_messages"]

        if inappropriate_messages >= 20:
            try:
                requests.post(
                    f"{BACKEND_API_URL}/suspend/account",
                    json={"user_id": user_id},
                    headers={
                        "X-API-Key": INTER_COMMUNICATION_TOKEN,
                    },
                )

            except Exception as e:
                logger.error(
                    f"Error suspending account for user {user_id}: {e}"
                )
                raise e
