from app.classes.agents.generate_cv_agent import GenerateCvAgent
from app.classes.base import Pipeline
from app.classes.models import Cv, Language, Profile


class GenerateCvPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = GenerateCvAgent()

    async def run(self, profile: Profile, language: Language) -> Cv:

        result = await self.agent.run(profile, language)

        return result
