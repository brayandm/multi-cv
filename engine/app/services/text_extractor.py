import fitz  # type: ignore


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

    def extract_text(self) -> str:
        text: str = ""
        for page in self.doc:
            text += page.get_text()
        return text

    def num_pages(self) -> int:
        return len(self.doc)

    def close(self) -> None:
        self.doc.close()
