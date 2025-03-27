from app.classes.base import Pipeline
from app.classes.models import Cv, CvTemplate, Traduction
from app.facades.document_render_facade import (
    DocumentRenderFacade,
)


class RenderCVPipeline(Pipeline):

    async def run(
        self, cv: Cv, cv_template: CvTemplate, traduction: Traduction
    ) -> str:

        render = DocumentRenderFacade.get_render()

        render.render_cv(cv, cv_template, traduction)

        path = render.store_cv()

        return path
