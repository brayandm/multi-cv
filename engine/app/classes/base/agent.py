from abc import ABC

from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage, AIMessage, SystemMessage
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
from pydantic import SecretStr, BaseModel

from app.config import OPENAI_API_KEY
from app.classes.models import Chat, ChatMessage


class Agent(ABC):

    def __init__(self) -> None:

        self.chat = ChatOpenAI(
            api_key=SecretStr(OPENAI_API_KEY),
            model="gpt-4o-mini",
            temperature=0.7,
        )

    def generate_bot_response(
        self,
        chat: Chat,
        context_data: BaseModel,
        system_prompt: str,
    ) -> ChatMessage:
        context_dict = context_data.model_dump()

        messages: list[HumanMessage | AIMessage] = []
        for msg in chat.messages:
            if msg.sender == "person":
                messages.append(HumanMessage(content=msg.text))
            elif msg.sender == "bot":
                messages.append(AIMessage(content=msg.text))

        prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessage(content=system_prompt),
                SystemMessage(content=f"Contexto adicional: {context_dict}"),
                *messages,
                HumanMessage(content="{input}"),
            ]
        )

        last_user_message = next(
            (
                msg.text
                for msg in reversed(chat.messages)
                if msg.sender == "person"
            ),
            "",
        )

        chain = LLMChain(llm=self.chat, prompt=prompt)

        response = chain.run(input=last_user_message)

        return ChatMessage(sender="bot", text=response)
