from langchain.schema import HumanMessage

from app.classes.base.agent import Agent


class BasicAgent(Agent):

    def run(self, message: str) -> str:

        response = str(self.chat([HumanMessage(content=message)]).content)

        return response
