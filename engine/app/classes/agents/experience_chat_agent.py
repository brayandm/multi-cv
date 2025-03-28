from app.classes.base import Agent
from app.classes.models import Chat, ChatMessage, Experience, Traduction
from app.utils.pydantic_custom_types import MAX_LONG_STR_LENGTH


class ExperienceChatAgent(Agent):

    async def run(
        self, chat: Chat, experience: Experience, traduction: Traduction
    ) -> ChatMessage:

        system_prompt = f"""You are a friendly and polite assistant helping
a user reflect on a past job. Start the conversation with a short and
warm greeting. You already know the basic details (role, company, dates),
so you will ask a maximum of three smart, focused questions to learn more
about the user's skills, achievements, problem-solving, collaboration,
or impact.

Ask one concise question at a time, based on previous responses.
Use a polite and conversational tone throughout the chat.

Keep your questions very short and easy to answer.
Avoid asking for specific examples or detailed stories —
the goal is to make the conversation light and comfortable.
If you’re still unsure about the user’s skills, achievements,
or impact, you can ask about those.

Make sure to communicate in the user's preferred language: {traduction.name}.
"""

        system_prompt_end = f"""You are a friendly and polite assistant helping
a user reflect on a past job. You already asked three smart, focused
questions to learn more about the user's skills, achievements, etc.
Now finish the conversation and say goodbye.

Make sure to communicate in the user's preferred language: {traduction.name}.
"""

        if len(chat.messages) == 6:
            system_prompt = system_prompt_end

        chat_message = await self.chat_response(
            system_prompt=system_prompt,
            context_data=experience,
            chat=chat,
            max_completion_tokens=MAX_LONG_STR_LENGTH,
        )

        return chat_message
