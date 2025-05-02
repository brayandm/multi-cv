import json

from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Profile
from app.utils.get_schema import structure_to_string


class AutoFillProfileAgent(Agent):

    async def run(self, text: str) -> Profile:

        profile_structure = structure_to_string(
            Profile, exclude_keys=["notes", "general_notes", "moderation"]
        )

        input_prompt = f"""
        You are an AI assistant whose task is to automatically generate
        a structured Profile in JSON format based on a given input text.
        The input may have been extracted from a PDF or another type
        of document, so the information might be unstructured, incomplete,
        or noisy. Your goal is to extract and organize the relevant information
        strictly following the JSON schema provided below.

        **Requirements:**
        - In Languages, the only levels allowed are: "Basic", "Intermediate",
        "Professional", "Native" so asign the correct level to each language.
        - In phone_country_code try to guess the country code (e.g. ES for
        Spain, FR for France, etc.) based on the phone number provided.
        - Fix encoding issues and restore correct accents or special characters
          in names or text written in Spanish. Only correct malformed
          characters—do not change content that is already correct.
        - Dates should be formatted as YYYY-MM and if there is no date
          provided, use the empty string "".
        - The only professional links allowed are "github", "linkedin",
        "portfolio"
        - Dont fill is_present or hasnt_expiration_date fields if the
        dates are not provided.
        - If there are some IDs fill them with a random UUID.

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
