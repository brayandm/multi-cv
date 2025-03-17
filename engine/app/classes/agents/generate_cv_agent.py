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
        Here is the information about the person in JSON format:

        ```json
        {profile_json}
        ```

        The expected output format for the CV is:

        ```json
        {cv_structure}
        ```

        Please generate a CV in the expected JSON format using the provided
        information.
        """

        response = str(self.chat([HumanMessage(content=input)]).content)

        try:
            cv_data = json.loads(response)
            return Cv(**cv_data)
        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response as JSON: {e}")
        except Exception as e:
            raise ValueError(f"Unexpected error while parsing CV data: {e}")
