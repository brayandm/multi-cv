from app.classes.agents.generate_cv_agent import GenerateCvAgent
from app.classes.base import Pipeline
from app.classes.models import Cv, Profile, Traduction, GenerationInput


class GenerateCvPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = GenerateCvAgent()

    async def run(
        self, profile: Profile, input: GenerationInput, traduction: Traduction
    ) -> Cv:

        result = await self.agent.run(profile, traduction)

        return result
