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
          ]
        }
        """

        input = f"""
        You are an AI assistant that generates JSON-formatted resumes. Your
        task is to generate a CV strictly in the JSON format provided below.

        Do not include any additional text, comments, or explanations before
        or after the JSON output.

        Here is the input data in JSON format:
        {profile_json}

        The expected JSON output format is:
        {cv_structure}

        Respond with ONLY the JSON output, enclosed between the following
        markers:

        BEGIN_JSON
        <valid JSON response>
        END_JSON
        """

        response = str(self.chat([HumanMessage(content=input)]).content)

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
