import requests  # type: ignore
from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage
from .celery import celery  # type: ignore

WEBHOOK_URL = "https://webhook.site/fcd06ee9-af22-4a21-b127-6a47095e9f41"


@celery.task
def send_to_openai(user_input: str) -> str:
    chat = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.7)

    response = str(chat([HumanMessage(content=user_input)]).content)

    payload = {"user_input": user_input, "response": response}
    requests.post(WEBHOOK_URL, json=payload)

    return response
