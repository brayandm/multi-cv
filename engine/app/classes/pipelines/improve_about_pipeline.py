from app.classes.agents import ImproveAboutAgent
from app.classes.base import Pipeline
from app.classes.models import Message, Person


class ImproveAboutPipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = ImproveAboutAgent()

    def run(self, person: Person, message: Message) -> Person:

        result = self.agent.run(person, message)

        person.about = result

        return person
