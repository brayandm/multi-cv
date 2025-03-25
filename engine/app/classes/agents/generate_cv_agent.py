import json

from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Cv, Profile, Language
from app.utils.phone import to_international_format


class GenerateCvAgent(Agent):

    async def run(self, profile: Profile, language: Language) -> Cv:
        profile_json = profile.model_dump_json()

        cv_structure = """
        {
          "full_name": "string",
          "email": "string",
          "location": "string",
          "linkedin": "string",
          "github": "string",
          "summary": "string",
          "experiences": [
            {
              "company": "string",
              "position": "string",
              "location": "string",
              "start_date": "string",
              "end_date": "string",
              "descriptions": ["string"]
            }
          ],
          "educations": [
            {
              "institution": "string",
              "career": "string",
              "location": "string",
              "start_date": "string",
              "end_date": "string"
            }
          ],
          "skill_categories": [
            {
              "category": "string",
              "list": ["string"]
            }
          ],
           "projects": [
            {
              "name": "string",
              "start_date": "string",
              "end_date": "string"
              "description": "string",
            }
          ]
        }
        """

        input_prompt = f"""
        You are an AI assistant that generates JSON-formatted resumes.
        Your task is to generate a CV strictly in the JSON format provided
        below.

        **Requirements:**
        - Ensure the CV is well-written, formatted correctly, and
        professionally structured.
        - Improve and enhance the provided information where possible (e.g.,
        refining job descriptions, making summaries more compelling, ensuring
        education details are clear).
        - Do not include any additional text, comments, or explanations before
        or after the JSON output.
        - In Experience Section add severals descriptions for each experience.

        **Format Guidelines:**
        - If possible, include the number of years of experience in the main
        field within the summary.
        - Location of the person should be in the format "City, Country",
        you can get the location from the location field in basic_info. If
        City or Country is missing just use the available one.
        - The Experiences should be in reverse chronological order.
        - The Education should be in reverse chronological order.
        - The Dates of the Experiences should be "month_name year" format.
        - In case of having is_present as True, the end_date should be
        "Present".
        - The most Recent Experience should have more descriptions. And
        the oldest experience should have less descriptions.

        **Skills Section Guidelines:**
        - The skills should be categorized into meaningful groups. Each group
        should have:
        - A `category` name describing the type of skills (e.g., "Programming
        Languages", "Frameworks & Libraries", "Databases", "DevOps Tools").
        - A `list` of specific skills within that category.
        - Avoid duplicate categories and ensure a logical grouping of skills.

        **Input Profile (JSON format):**
        {profile_json}

        **Expected JSON Output Format:**
        {cv_structure}

        Respond with ONLY the JSON output, enclosed between the following
        markers:

        BEGIN_JSON
        <valid JSON response>
        END_JSON

        Remember to generate the CV in the user's preferred language:
        {language.name}
        """

        response = str(
            (
                await self.chat.ainvoke([HumanMessage(content=input_prompt)])
            ).content
        )

        try:
            json_start = response.find("BEGIN_JSON") + len("BEGIN_JSON")
            json_end = response.find("END_JSON")
            json_content = response[json_start:json_end].strip()

            cv_data = json.loads(json_content)
            cv = Cv(**cv_data)

            cv.phone = to_international_format(
                profile.basic_info.phone_number,
                profile.basic_info.phone_country_code,
            )

            return cv

        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response as JSON: {e}")
        except Exception as e:
            raise ValueError(f"Unexpected error while parsing CV data: {e}")
