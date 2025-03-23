from app.classes.agents import ExperienceChatAgent, ExperienceNotesAgent
from app.classes.base import Pipeline
from app.classes.models import Chat, Experience


class ChatExperiencePipeline(Pipeline):

    def __init__(self) -> None:
        self.chat_agent = ExperienceChatAgent()
        self.notes_agent = ExperienceNotesAgent()

    def run(self, chat: Chat, experience: Experience) -> tuple[str, str]:

        return (
            self.chat_agent.run(chat, experience).text,
            self.notes_agent.run(chat, experience),
        )
