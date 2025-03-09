from app.classes.base import Pipeline
from app.classes.models import Cv, CvTemplate

from jinja2 import Environment, FileSystemLoader
import subprocess
import os
import uuid
from app.helpers.filesystem import Filesystem


class GenerateCVPipeline(Pipeline):

    def run(self, cv: Cv, cv_template: CvTemplate) -> str:

        env = Environment(loader=FileSystemLoader("./app/templates/cv/"))
        template = env.get_template(f"{cv_template.id}.tex.jinja2")

        cv_uuid = str(uuid.uuid4())
        cv_folder = f"./app/templates/generated/{cv_uuid}/"
        os.makedirs(cv_folder, exist_ok=True)

        tex_path = os.path.join(cv_folder, "cv_generated.tex")
        pdf_path = os.path.join(cv_folder, "cv_generated.pdf")

        with open(tex_path, "w", encoding="utf-8") as f:
            f.write(template.render(cv=cv.model_dump()))

        try:
            subprocess.run(
                ["pdflatex", "-output-directory", cv_folder, tex_path],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
        except subprocess.CalledProcessError as e:
            return f"Error while generating CV: {e.stderr.decode()}"

        fs = Filesystem.get_filesystem()

        dest_folder = "/documents"

        if not fs.exists(dest_folder):
            fs.makedirs(dest_folder)

        with open(pdf_path, "rb") as f:
            fs.writebytes(f"/documents/{cv_uuid}.pdf", f.read())

        return f"/documents/{cv_uuid}.pdf"
