from app.classes.base import Pipeline
from app.classes.models import Cv, CvTemplate, Language
from app.facades.document_render_facade import (
    DocumentRenderFacade,
)


class RenderCVPipeline(Pipeline):

    async def run(
        self, cv: Cv, cv_template: CvTemplate, language: Language
    ) -> str:

        render = DocumentRenderFacade.get_render()

        render.render_cv(cv, cv_template, language)

        path = render.store_cv()

        return path
