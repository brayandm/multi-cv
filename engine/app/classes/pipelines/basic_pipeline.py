from app.classes.agents import BasicAgent
from app.classes.base import Pipeline
from app.models import Message
from typing import Dict


class BasicPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = BasicAgent()

    def run(self, message: Dict) -> str:
        message = Message(**message)
        return self.agent.run(message.message)
