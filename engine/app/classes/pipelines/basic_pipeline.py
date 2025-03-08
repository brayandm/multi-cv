from app.classes.agents import BasicAgent
from app.classes.base import Pipeline
from app.models import Message


class BasicPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = BasicAgent()

    def run(self, message: Message) -> str:
        return self.agent.run(message.message)
