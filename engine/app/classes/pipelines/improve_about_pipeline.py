from app.classes.agents import ImproveAboutAgent
from app.classes.base import Pipeline
from app.classes.models import Message, Profile


class ImproveAboutPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = ImproveAboutAgent()

    def run(self, profile: Profile, message: Message) -> Profile:

        result = self.agent.run(profile, message)

        profile.basic_info.about = result

        return profile
