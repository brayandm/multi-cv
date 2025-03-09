import subprocess

from jinja2 import Environment, FileSystemLoader

from app.classes.base.document_generator import (
    DocumentGenerator,
)
from app.classes.models import Cv, CvTemplate
from app.facades import FilesystemFacade


class LatexGenerator(DocumentGenerator):

    def generate_cv(self, cv: Cv, cv_template: CvTemplate) -> None:

        env = Environment(loader=FileSystemLoader("./app/templates/latex/cv/"))
        template = env.get_template(f"{cv_template.id}.tex.jinja2")

        with open(self.tex_path, "w", encoding="utf-8") as f:
            f.write(template.render(cv=cv.model_dump()))

        try:
            subprocess.run(
                [
                    "pdflatex",
                    "-output-directory",
                    self.cv_folder,
                    self.tex_path,
                ],
                check=True,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
            )
        except subprocess.CalledProcessError as e:
            raise e

    def store_cv(self) -> str:
        fs = FilesystemFacade.get_filesystem()
        dest_folder = "/documents"

        if not fs.exists(dest_folder):
            fs.makedirs(dest_folder)

        with open(self.pdf_path, "rb") as f:
            fs.writebytes(f"/documents/{self.cv_uuid}.pdf", f.read())

        return f"/documents/{self.cv_uuid}.pdf"
