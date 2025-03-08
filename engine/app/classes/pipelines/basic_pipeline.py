from app.classes.base.pipeline import Pipeline
from app.classes.agents.basic_agent import BasicAgent
from app.classes.base.agent import Agent


class BasicPipeline(Pipeline):

    def __init__(self, agent: Agent) -> None:
        self.agent = BasicAgent()

    def run(self, message: str) -> str:
        return self.agent.run(message)
