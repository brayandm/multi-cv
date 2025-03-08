from abc import ABC

from langchain_openai import ChatOpenAI
from pydantic import SecretStr

from app.config import OPENAI_API_KEY


class Agent(ABC):

    def __init__(self) -> None:

        self.chat = ChatOpenAI(
            api_key=SecretStr(OPENAI_API_KEY),
            model="gpt-4o-mini",
            temperature=0.7,
        )
