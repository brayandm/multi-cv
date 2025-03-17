from app.classes.base import Pipeline
from app.classes.models import Profile, Cv
from app.classes.agents.generate_cv_agent import GenerateCvAgent


class GenerateCvPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = GenerateCvAgent()

    def run(self, profile: Profile) -> Cv:

        result = self.agent.run(profile)

        return result
