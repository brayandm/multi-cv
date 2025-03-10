from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Profile


class SummaryAgent(Agent):

    def run(self, person: Profile) -> str:
        person_json = person.model_dump_json()

        input = f"""
        Here is the information about the person in JSON format:

        ```json
        {person_json}
        ```

        Please generate a summary of this information.
        """

        response = str(self.chat([HumanMessage(content=input)]).content)

        return response
