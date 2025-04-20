from app.classes.agents import (
    GenerateCvAgent,
    GenerateCvBasedOnJobPostAgent,
    GenerateCvBasedOnPromptAgent,
    GenerateApplicationBasedOnJobPostAgent,
)
from app.classes.base import Pipeline
from app.classes.models import (
    Cv,
    GenerationInput,
    Profile,
    Traduction,
    Application,
)


class GenerateCvPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = GenerateCvAgent()
        self.agent_role = GenerateCvBasedOnPromptAgent()
        self.agent_job = GenerateCvBasedOnJobPostAgent()
        self.agent_application = GenerateApplicationBasedOnJobPostAgent()

    async def run(
        self, profile: Profile, input: GenerationInput, traduction: Traduction
    ) -> tuple[Cv, Application | None]:

        application = None

        if input.type == "simple":
            result = await self.agent.run(
                profile, input.custom_prompt, traduction
            )
        elif input.type == "role" and input.role_input is not None:
            result = await self.agent_role.run(
                profile, input.custom_prompt, input.role_input, traduction
            )
        elif input.type == "job" and input.job_input is not None:
            application = await self.agent_application.run(
                input.job_input, traduction
            )
            result = await self.agent_job.run(
                profile, input.custom_prompt, input.job_input, traduction
            )
        else:
            raise ValueError("Invalid input type or missing input data.")

        return result, application
