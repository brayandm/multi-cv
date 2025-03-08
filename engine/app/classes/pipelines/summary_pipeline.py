from app.classes.agents import SummaryAgent
from app.classes.base import Pipeline
from app.models import Person
from typing import Any


class SummaryPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = SummaryAgent()

    def run(self, person: Any) -> str:
        person = Person(**person)
        return self.agent.run(person)
