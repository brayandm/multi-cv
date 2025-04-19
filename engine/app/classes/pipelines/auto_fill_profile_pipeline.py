from app.classes.agents import AutoFillProfileAgent, MergerDataAgent
from app.classes.base import Pipeline
from app.classes.models import Profile


class AutoFillProfilePipeline(Pipeline):

    def __init__(self) -> None:
        self.merger_agent = MergerDataAgent()
        self.agent = AutoFillProfileAgent()

    async def run(self, text1: str, text2: str) -> Profile:

        text = await self.merger_agent.run(text1, text2)

        result = await self.agent.run(text)

        return result
