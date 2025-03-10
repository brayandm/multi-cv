from app.classes.agents import SummaryAgent
from app.classes.base import Pipeline
from app.classes.models import Profile


class SummaryPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = SummaryAgent()

    def run(self, person: Profile) -> str:
        return self.agent.run(person)
