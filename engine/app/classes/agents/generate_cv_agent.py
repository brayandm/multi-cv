import json

from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Cv, Profile


class GenerateCvAgent(Agent):

    def run(self, profile: Profile) -> Cv:
        profile_json = profile.model_dump_json()

        cv_structure = """
        {
          "name": "string",
          "email": "string",
          "phone": "string",
          "summary": "string",
          "experiences": [
            {
              "company": "string",
              "position": "string",
              "location": "string",
              "start_date": "string",
              "end_date": "string",
              "description": ["string"]
            }
          ],
          "education": [
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
        - Use only the information provided in the input profile.
        - Do NOT infer or generate missing data.
        - If any field is missing, omit it instead of filling it with
        placeholders.
        - Do not include any additional text, comments, or explanations before
        or after the JSON output.

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
        """

        response = str(self.chat([HumanMessage(content=input_prompt)]).content)

        try:
            json_start = response.find("BEGIN_JSON") + len("BEGIN_JSON")
            json_end = response.find("END_JSON")
            json_content = response[json_start:json_end].strip()

            cv_data = json.loads(json_content)
            return Cv(**cv_data)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response as JSON: {e}")
        except Exception as e:
            raise ValueError(f"Unexpected error while parsing CV data: {e}")
