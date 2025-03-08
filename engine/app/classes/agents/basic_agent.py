from ..base.agent import Agent
from langchain.schema import HumanMessage


class BasicAgent(Agent):

    def run(self, message: str) -> str:

        response = str(self.chat([HumanMessage(content=message)]).content)

        return response
