from app.classes.document_generators.latex_generator import LatexGenerator
from app.classes.models import Cv, CvTemplate


class DocumentGeneratorFacade:
    @staticmethod
    def get_generator(cv: Cv, cv_template: CvTemplate) -> LatexGenerator:
        return LatexGenerator()
