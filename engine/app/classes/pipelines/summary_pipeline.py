from app.classes.agents import SummaryAgent
from app.classes.base import Pipeline
from app.models import Person
from typing import Dict


class SummaryPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = SummaryAgent()

    def run(self, person: Dict) -> str:
        person = Person(**person)
        return self.agent.run(person)
