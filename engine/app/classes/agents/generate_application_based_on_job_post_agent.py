from app.classes.base import Agent
from app.utils.get_schema import get_schema
from app.framework.logging import logger
from app.classes.models import Application, Cv, Profile


class GenerateApplicationBasedOnJobPostAgent(Agent):

    async def run(
        self,
        job_post: str,
    ) -> None:

        logger.info(get_schema(Application))
        logger.info(get_schema(Cv))
        logger.info(get_schema(Profile))
        pass
