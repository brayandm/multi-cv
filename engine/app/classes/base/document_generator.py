from abc import ABC, abstractmethod
import os
import uuid
from app.classes.models import Cv, CvTemplate


class DocumentGenerator(ABC):

    def __init__(self) -> None:
        self.cv_uuid = str(uuid.uuid4())
        self.cv_folder = f"./app/templates/latex/generated/{self.cv_uuid}/"
        self.tex_path = os.path.join(self.cv_folder, "cv_generated.tex")
        self.pdf_path = os.path.join(self.cv_folder, "cv_generated.pdf")
        os.makedirs(self.cv_folder, exist_ok=True)

    @abstractmethod
    def generate_cv(self, cv: Cv, cv_template: CvTemplate) -> None:
        pass

    @abstractmethod
    def store(self) -> str:
        pass
