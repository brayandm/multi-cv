from abc import ABC, abstractmethod

from app.classes.models import Cv, CvTemplate


class DocumentRender(ABC):

    @abstractmethod
    def render_cv(self, cv: Cv, cv_template: CvTemplate) -> None:
        pass

    @abstractmethod
    def store_cv(self) -> str:
        pass

    @abstractmethod
    def get_cv(self) -> bytes:
        pass
