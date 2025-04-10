from app.classes.agents import (
    GenerateCvAgent,
    GenerateCvAgentBasedOnJobPost,
    GenerateCvAgentBasedOnPrompt,
)
from app.classes.base import Pipeline
from app.classes.models import Cv, GenerationInput, Profile, Traduction


class GenerateCvPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = GenerateCvAgent()
        self.agent_role = GenerateCvAgentBasedOnPrompt()
        self.agent_job = GenerateCvAgentBasedOnJobPost()

    async def run(
        self, profile: Profile, input: GenerationInput, traduction: Traduction
    ) -> Cv:

        if input.type == "simple":
            result = await self.agent.run(profile, traduction)
        elif input.type == "role" and input.role_input is not None:
            result = await self.agent_role.run(
                profile, input.role_input, traduction
            )
        elif input.type == "job" and input.job_input is not None:
            result = await self.agent_job.run(
                profile, input.job_input, traduction
            )
        else:
            raise ValueError("Invalid input type or missing input data.")

        return result
