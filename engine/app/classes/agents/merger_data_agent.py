from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Profile
from app.utils.get_schema import structure_to_string


class MergerDataAgent(Agent):

    async def run(self, text1: str, text2: str) -> str:

        profile_structure = structure_to_string(
            Profile, exclude_keys=["notes", "general_notes", "moderation"]
        )

        input_prompt = f"""
        You are an AI assistant whose task is to merge two texts/json
        containing the same information but in different formats because
        they were extracted from different sources. Your goal is to organize
        the information in just one structured JSON.

        **Requirements:**
        - If there are some IDs fill them with a random UUID.
        - If you see any date with only the year, just keep the year without
          the month.

        **Input profile data (text1):**
        {text1}

        **Input profile data (text2):**
        {text2}

        **Expected JSON Output Format:**
        {profile_structure}
        """

        response = await self.generate_response(
            [HumanMessage(content=input_prompt)]
        )

        return response
