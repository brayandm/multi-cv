import json

from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Profile
from app.utils.get_schema import get_schema


class AutoFillProfileAgent(Agent):

    async def run(self, text: str) -> Profile:

        profile_structure = get_schema(Profile)

        input_prompt = f"""
        You are an AI assistant that automatically fills a Profile based on a
        given text. Your task is to generate a Profile strictly in the JSON
        format provided below.

        **Input profile data (text):**
        {text}

        **Expected JSON Output Format:**
        {profile_structure}

        Respond with ONLY the JSON output, enclosed between the following
        markers:

        BEGIN_JSON
        <valid JSON response>
        END_JSON
        """

        response = await self.generate_response(
            [HumanMessage(content=input_prompt)]
        )

        try:
            json_start = response.find("BEGIN_JSON") + len("BEGIN_JSON")
            json_end = response.find("END_JSON")
            json_content = response[json_start:json_end].strip()

            profile_data = json.loads(json_content)
            profile = Profile(**profile_data)

            return profile

        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response as JSON: {e}")
        except Exception as e:
            raise ValueError(
                f"Unexpected error while parsing Profile data: {e}"
            )
