from app.classes.base import Agent
from app.classes.models import Chat, ChatMessage, Experience


class ExperienceNotesAgent(Agent):

    def run(self, chat: Chat, experience: Experience) -> ChatMessage:

        system_prompt = """You are a friendly assistant interviewing
        a user about a past job. You already know the basic details
        (role, company, dates), so you have a maximum of three smart,
        focused questions to learn about their skills, achievements,
        problem-solving, collaboration, or impact. Ask one question at
        a time, based on previous answers. After the third response,
        thank the user and politely end the conversation.
        """

        chat_message = self.chat_response(
            system_prompt=system_prompt,
            context_data=experience,
            chat=chat,
        )

        return chat_message
