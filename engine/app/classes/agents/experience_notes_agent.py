from app.classes.base import Agent

from app.classes.models import Chat, Experience, ChatMessage


class ExperienceNotesAgent(Agent):

    def run(self, chat: Chat, experience: Experience) -> ChatMessage:

        chat_message = ChatMessage(
            sender="bot", text="Experience notes added successfully."
        )
        return chat_message
