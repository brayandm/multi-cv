import json
from datetime import datetime, timezone

from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Application, Traduction
from app.utils.get_schema import get_schema


class GenerateApplicationBasedOnJobPostAgent(Agent):

    async def run(
        self,
        job_post: str,
        traduction: Traduction,
    ) -> Application:

        application_structure = get_schema(
            Application,
            exclude_keys=[
                "company_logo_link",
                "job_description_raw",
                "application_date",
                "status",
                "user_comments",
            ],
        )

        input_prompt = f"""
        You are an AI assistant whose task is to generate a structured
        Application in JSON format based on a given job post. The input may
        have been extracted from a HTML or just pure text, so the information
        might be unstructured, incomplete, or noisy. Your goal is to extract
        and organize the relevant information strictly following the JSON
        schema provided below. You need to extract the information and
        translate it to {traduction.name} language.

        **Instructions:**
        - In Job Summary, include a brief summary of the job.
        - In Job Bullets, include the main responsibilities and requirements
          of the job in small bullet points.
        - In Job Post Source, include the source of the job post if is
          available. (e.g., LinkedIn, Indeed, etc.).
        - In skills, include the main skills required for the job.

        **Input Job Post**
        {job_post}

        **Expected JSON Output Format:**
        {application_structure}

        Respond with ONLY the JSON output, enclosed between the following
        markers:

        BEGIN_JSON
        <valid JSON response>
        END_JSON
        """

        response = await self.generate_response(
            [HumanMessage(content=input_prompt)]
        )

        try:
            json_start = response.find("BEGIN_JSON") + len("BEGIN_JSON")
            json_end = response.find("END_JSON")
            json_content = response[json_start:json_end].strip()

            application_data = json.loads(json_content)

            application_data["job_description_raw"] = job_post
            application_data["application_date"] = datetime.now(timezone.utc)
            application_data["status"] = "Applied"
            application_data["user_comments"] = ""

            application = Application(**application_data)

            return application

        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response as JSON: {e}")
        except Exception as e:
            raise ValueError(
                f"Unexpected error while parsing Application data: {e}"
            )
