from app.classes.base import Pipeline
from app.classes.models import Cv, CvTemplate

from jinja2 import Environment, FileSystemLoader
import subprocess
import os
import uuid


class GenerateCVPipeline(Pipeline):

    def run(self, cv: Cv, cv_template: CvTemplate) -> str:

        env = Environment(loader=FileSystemLoader("./app/templates/cv/"))
        template = env.get_template(f"{cv_template.id}.tex")

        cv_uuid = str(uuid.uuid4())
        cv_folder = f"./app/templates/generated/{cv_uuid}/"
        os.makedirs(cv_folder, exist_ok=True)

        tex_path = os.path.join(cv_folder, "cv_generated.tex")
        pdf_path = os.path.join(cv_folder, "cv_generated.pdf")

        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(template.render(cv=cv.model_dump()))

        subprocess.run(
            ["pdflatex", "-output-directory", cv_folder, tex_path], check=True
        )

        return "CV generated successfully."
