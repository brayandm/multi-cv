from langchain.schema import HumanMessage

from app.classes.base import Agent


class MergerDataAgent(Agent):

    async def run(self, text1: str, text2: str) -> str:

        input_prompt = f"""
        You are an AI assistant whose task is to merge two texts/json
        containing the same information but in different formats because
        they were extracted from different sources. Your goal is to organize
        the information in just one structured JSON.

        **Input profile data (text1):**
        {text1}

        **Input profile data (text2):**
        {text2}
        """

        response = await self.generate_response(
            [HumanMessage(content=input_prompt)]
        )

        return response
