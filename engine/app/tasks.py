import requests  # type: ignore
from langchain_openai import ChatOpenAI
from langchain.schema import HumanMessage
from pydantic import SecretStr
from .celery import celery  # type: ignore
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")

WEBHOOK_URL = "https://webhook.site/fcd06ee9-af22-4a21-b127-6a47095e9f41"


@celery.task(name="tasks.send_to_openai")
def send_to_openai(user_input: str) -> str:
    chat = ChatOpenAI(
        api_key=SecretStr(OPENAI_API_KEY),
        model="gpt-4o-mini",
        temperature=0.7,
    )

    response = str(chat([HumanMessage(content=user_input)]).content)

    payload = {"user_input": user_input, "response": response}
    requests.post(WEBHOOK_URL, json=payload)

    return response
