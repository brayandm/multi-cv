from app.classes.agents import ExperienceChatAgent, ExperienceNotesAgent
from app.classes.base import Pipeline
from app.classes.models import Chat, Experience, Language


class ChatExperiencePipeline(Pipeline):

    def __init__(self) -> None:
        self.chat_agent = ExperienceChatAgent()
        self.notes_agent = ExperienceNotesAgent()

    def run(
        self, chat: Chat, experience: Experience, language: Language
    ) -> tuple[str, str]:

        return (
            self.chat_agent.run(chat, experience, language).text,
            self.notes_agent.run(chat, experience),
        )
