from app.classes.base import Agent
from app.classes.models import Chat, Experience
from app.utils.pydantic_custom_types import MAX_NOTES_LENGTH


class ExperienceNotesAgent(Agent):

    async def run(self, chat: Chat, experience: Experience) -> str:

        system_prompt = f"""You are an assistant that updates a
        note about a user's past job experience by merging
        previous notes with new information from a recent chat.
        Focus on capturing valuable insights such as skills,
        achievements, challenges, and impact in a clear and neutral
        tone. Write concisely in plain text, and do not exceed
        the given {MAX_NOTES_LENGTH / 2} characters limit.
        """

        chat_message = await self.chat_response(
            system_prompt=system_prompt,
            context_data=experience,
            chat=chat,
        )

        return chat_message.text
