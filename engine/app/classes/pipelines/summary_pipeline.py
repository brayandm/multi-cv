from app.classes.agents import SummaryAgent
from app.classes.base import Pipeline
from app.models import Person


class SummaryPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = SummaryAgent()

    def run(self, person: Person) -> str:
        return self.agent.run(person)
