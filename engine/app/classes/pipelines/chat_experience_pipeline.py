from app.classes.agents import ExperienceNotesAgent
from app.classes.base import Pipeline
from app.classes.models import Chat, ChatMessage, Experience


class ChatExperiencePipeline(Pipeline):

    def __init__(self) -> None:
        self.agent = ExperienceNotesAgent()

    def run(self, chat: Chat, experience: Experience) -> ChatMessage:
        return self.agent.run(chat, experience)
