import json

from langchain.schema import HumanMessage

from app.classes.base import Agent
from app.classes.models import Cv, Profile, Traduction
from app.utils.get_schema import get_schema
from app.utils.phone import to_international_format


class GenerateCvAgentBasedOnJobPost(Agent):

    async def run(
        self, profile: Profile, input: str, traduction: Traduction
    ) -> Cv:
        profile_json = profile.model_dump_json()

        cv_structure = get_schema(Cv)

        input_prompt = f"""
        You are an AI assistant that generates JSON-formatted resumes in
        {traduction.name} language so any results should be in this language.
        Your task is to generate a CV strictly in the JSON format provided
        below.

        **Requirements:**
        - Ensure the CV is well-written, formatted correctly, and
        professionally structured.
        - Improve and enhance the provided information where possible (e.g.,
        refining job descriptions, making summaries more compelling, ensuring
        education details are clear).
        - Do not include any additional text, comments, or explanations before
        or after the JSON output.
        - In Experience Section add severals descriptions for each experience.

        **Format Guidelines:**
        - Location of the person should be in the format "City, Country",
        you can get the location from the location field in basic_info. If
        City or Country is missing just use the available one.
        - The Experiences should be in reverse chronological order.
        - The Education should be in reverse chronological order.
        - The Dates of the Experiences should be "month_name year" format.
        - In case of having is_present as True, the end_date should be
        "Present" in {traduction.name} language.
        - The most Recent Experience should have more descriptions. And
        the oldest experience should have less descriptions.

        **Skills Section Guidelines:**
        - The skills should be categorized into meaningful groups. Each group
        should have:
        - A `category` name describing the type of skills (e.g., "Programming
        Languages", "Frameworks & Libraries", "Databases", "DevOps Tools").
        - A `list` of specific skills within that category.
        - Avoid duplicate categories and ensure a logical grouping of skills.

       **Additional Input Job Post:**
        - You have to generate a CV based on the provided input, that is
        a Job Post, so you have to adapt the CV to this Job Post.
        - You need to add or remove some information from the CV to be
        more relevant to the Job Post provided in the input, but
        dont hallucinate or add any information that is not in the profile.
        - You need to adjust the role or position title in the experiences
        to be more relevant to the Role or Position Title in the Job Post and
        try to be consistent with the role among the experiences if are similar
        - You need to restructure and order the bullet points in the CV to be
        more relevant to the Job Post provided in the input.
        - You need to create a summary, experience, educations, skills,
        projects, and certifications that are relevant to the Job Post
        provided in the input.
        - You can omit experience, educations, skills, projects,
        and certifications that you are 100% sure are not relevant to the
        field of the Job Post provided in the input.
        - You need to highlight the most important information in the CV
        to be more relevant to the Job Post provided in the input and
        pass the ATS test.

        **Input Job Post**
        {input}

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

        response = await self.generate_response(
            [HumanMessage(content=input_prompt)]
        )

        try:
            json_start = response.find("BEGIN_JSON") + len("BEGIN_JSON")
            json_end = response.find("END_JSON")
            json_content = response[json_start:json_end].strip()

            cv_data = json.loads(json_content)
            cv = Cv(**cv_data)

            cv.phone = to_international_format(
                profile.basic_info.phone_number,
                profile.basic_info.phone_country_code,
            )

            return cv

        except json.JSONDecodeError as e:
            raise ValueError(f"Failed to parse response as JSON: {e}")
        except Exception as e:
            raise ValueError(f"Unexpected error while parsing CV data: {e}")
