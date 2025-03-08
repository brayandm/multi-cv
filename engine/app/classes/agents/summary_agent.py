import json
from langchain.schema import HumanMessage
from app.classes.base import Agent
from app.models import Person


class SummaryAgent(Agent):

    def run(self, person: Person) -> str:
        person_json = json.dumps(person.dict(), indent=2, ensure_ascii=False)

        message = f"""
        Here is the information about the person in JSON format:

        ```json
        {person_json}
        ```

        Please generate a summary of this information.
        """

        response = str(self.chat([HumanMessage(content=message)]).content)

        return response
