from app.classes.base import Pipeline
from app.classes.models import Cv, CvTemplate
from app.facades import (
    DocumentGeneratorFacade,
)


class GenerateCVPipeline(Pipeline):

    def run(self, cv: Cv, cv_template: CvTemplate) -> str:

        generator = DocumentGeneratorFacade.get_generator()

        generator.generate_cv(cv, cv_template)

        path = generator.store_cv()

        return path
