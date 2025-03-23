from app.classes.agents import ExperienceNotesAgent, ExperienceChatAgent
from app.classes.base import Pipeline
from app.classes.models import Chat, ChatMessage, Experience


class ChatExperiencePipeline(Pipeline):

    def __init__(self) -> None:
        self.chat_agent = ExperienceChatAgent()
        self.notes_agent = ExperienceNotesAgent()

    def run(self, chat: Chat, experience: Experience) -> ChatMessage:

        return self.chat_agent.run(chat, experience)
