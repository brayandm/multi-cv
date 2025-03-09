from app.classes.document_generators.latex_generator import LatexGenerator


class DocumentGeneratorFacade:
    @staticmethod
    def get_generator() -> LatexGenerator:
        return LatexGenerator()
