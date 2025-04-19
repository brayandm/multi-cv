import fitz  # type: ignore
from pdf2image import convert_from_bytes

from app.services.chat_engine import ChatEngineService


class InvalidPDFError(Exception):
    """Raised when the file is not a valid PDF"""

    pass


class TextExtractor:
    def __init__(self, file_bytes: bytes):
        self.file_bytes: bytes = file_bytes
        self.doc: fitz.Document = self._load_pdf()

    def _load_pdf(self) -> fitz.Document:
        try:
            return fitz.open(stream=self.file_bytes, filetype="pdf")
        except Exception as e:
            raise InvalidPDFError(
                "The provided file is not a valid PDF."
            ) from e

    async def extract_text_from_images(self) -> str:

        images = convert_from_bytes(self.file_bytes, dpi=300)

        prompt = (
            "You are an expert in extracting text from images, "
            "specifically from PDF files that are CVs. So please "
            "extract the CV data from the images and return it in a"
            "structured format."
        )

        chat_service = ChatEngineService()
        result = await chat_service.vision_chat_from_images(prompt, images)

        return result

    def extract_text(self) -> str:
        text: str = ""
        for page in self.doc:
            text += page.get_text()
        return text

    def num_pages(self) -> int:
        return len(self.doc)

    def close(self) -> None:
        self.doc.close()
