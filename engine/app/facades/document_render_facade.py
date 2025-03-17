from app.classes.document_renders.latex_render import LatexRender


class DocumentRenderFacade:
    @staticmethod
    def get_render() -> LatexRender:
        return LatexRender()
