from app.classes.base import Pipeline
from app.classes.models import Cv, CvTemplate

from jinja2 import Environment, FileSystemLoader
import subprocess


class GenerateCVPipeline(Pipeline):

    def run(self, cv: Cv, cv_template: CvTemplate) -> str:

        env = Environment(loader=FileSystemLoader("../../templates/cv"))
        template = env.get_template(f"{cv_template.id}.tex")

        output_tex = "cv_generated.tex"
        with open(output_tex, "w", encoding="utf-8") as f:
            f.write(template.render(cv=cv.model_dump()))

        subprocess.run(["pdflatex", output_tex])

        print("Generating CV...")

        return "CV generated successfully."
