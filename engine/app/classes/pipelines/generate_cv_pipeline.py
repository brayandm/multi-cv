from app.classes.base import Pipeline
from app.classes.models import Cv, CvTemplate

from app.facades import (
    DocumentGeneratorFacade,
)


class GenerateCVPipeline(Pipeline):

    def run(self, cv: Cv, cv_template: CvTemplate) -> str:

        generator = DocumentGeneratorFacade.get_generator(cv, cv_template)

        return generator.store()
