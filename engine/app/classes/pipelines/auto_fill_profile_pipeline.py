from app.classes.agents import AutoFillProfileAgent
from app.classes.base import Pipeline
from app.classes.models import Profile


class AutoFillProfilePipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = AutoFillProfileAgent()

    async def run(self, text: str) -> Profile:

        result = await self.agent.run(text)

        return result
