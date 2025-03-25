import os
import re
import shutil
import subprocess
import uuid
from typing import Any, Dict, List, Union

from jinja2 import Environment, FileSystemLoader

from app.classes.base.document_render import (
    DocumentRender,
)
from app.classes.models import Cv, CvTemplate, Language
from app.facades.filesystem_facade import FilesystemFacade

import json


def escape_latex(text: str) -> str:
    if not isinstance(text, str):
        return text

    latex_escape_dict = {
        "&": r"\&",
        "%": r"\%",
        "$": r"\$",
        "#": r"\#",
        "_": r"\_",
        "{": r"\{",
        "}": r"\}",
        "~": r"\textasciitilde{}",
        "^": r"\textasciicircum{}",
        "\\": r"\textbackslash{}",
    }

    return re.sub(
        r"([&%$#{}_~^\\])",
        lambda match: latex_escape_dict[match.group()],
        text,
    )


class LatexRender(DocumentRender):

    def __init__(self) -> None:
        self.cv_uuid = str(uuid.uuid4())
        self.working_dir = "./app/templates/latex/"
        self.cv_template = f"{self.working_dir}/cv/"
        self.cv_folder = f"{self.working_dir}/rendered/{self.cv_uuid}/"
        self.tex_path = os.path.join(self.cv_folder, "cv_rendered.tex")
        self.pdf_path = os.path.join(self.cv_folder, "cv_rendered.pdf")
        os.makedirs(self.cv_folder, exist_ok=True)

    def cleanup(self) -> None:
        shutil.rmtree(self.cv_folder, ignore_errors=True)

    def sanitize_cv(self, cv: Cv) -> Dict[str, Any]:
        sanitized_cv = cv.model_dump()

        def sanitize_data(
            data: Union[Dict[str, Any], List[Any], str, Any],
        ) -> Union[Dict[str, Any], List[Any], str, Any]:

            if isinstance(data, str):
                return escape_latex(data)

            elif isinstance(data, list):
                return [sanitize_data(item) for item in data]

            elif isinstance(data, dict):
                return {
                    key: sanitize_data(value) for key, value in data.items()
                }

            return data

        return sanitize_data(sanitized_cv)  # type: ignore

    def render_cv(
        self, cv: Cv, cv_template: CvTemplate, language: Language
    ) -> None:
        env = Environment(loader=FileSystemLoader(self.cv_template))
        template = env.get_template(f"{cv_template.id}.tex.jinja2")

        sanitized_cv = self.sanitize_cv(cv)

        traductions_path = os.path.join(
            "app", "utils", "traductions", "cv", f"{language.locale}.json"
        )
        with open(traductions_path, "r", encoding="utf-8") as traductions_file:
            traductions = json.load(traductions_file)

        with open(self.tex_path, "w", encoding="utf-8") as f:
            f.write(template.render(cv=sanitized_cv, traductions=traductions))

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
            self.cleanup()
            raise e

    def store_cv(self) -> str:
        fs = FilesystemFacade.get_filesystem()
        dest_folder = "/documents"

        if not fs.exists(dest_folder):
            fs.makedirs(dest_folder)

        with open(self.pdf_path, "rb") as f:
            fs.writebytes(f"/documents/{self.cv_uuid}.pdf", f.read())

        self.cleanup()

        return f"/documents/{self.cv_uuid}.pdf"

    def get_cv(self) -> bytes:

        with open(self.pdf_path, "rb") as f:
            pdf_content = f.read()

        self.cleanup()

        return pdf_content
