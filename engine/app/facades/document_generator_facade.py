from app.classes.models import Cv, CvTemplate
from app.classes.document_generators.latex_generator import LatexGenerator


class DocumentGeneratorFacade:
    @staticmethod
    def get_generator(cv: Cv, cv_template: CvTemplate) -> LatexGenerator:
        return LatexGenerator()
