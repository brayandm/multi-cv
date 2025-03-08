from app.classes.agents import BasicAgent
from app.classes.base import Pipeline


class BasicPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = BasicAgent()

    def run(self, message: str) -> str:
        return self.agent.run(message)
