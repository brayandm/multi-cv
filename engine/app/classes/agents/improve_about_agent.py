from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Message, Profile


class ImproveAboutAgent(Agent):

    def run(self, profile: Profile, message: Message) -> str:
        profile_json = profile.model_dump_json()

        input = f"""
        Here is the information about the person in JSON format:

        ```json
        {profile_json}
        ```

         Here is extra information about the person:

        ```json
        {message.message}
        ```

        Please generate a summary of this information.
        """

        response = str(self.chat([HumanMessage(content=input)]).content)

        return response
