from app.classes.base import Pipeline
from app.classes.models import CV


class GenerateCVPipeline(Pipeline):

    def run(self, cv: CV) -> str:
        return "CV generated successfully."
