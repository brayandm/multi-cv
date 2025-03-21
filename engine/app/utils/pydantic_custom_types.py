from typing import Annotated

from pydantic import Field

MAX_SHORT_STR_LENGTH = 100
MAX_LONG_STR_LENGTH = 1000
MAX_NOTES_LENGTH = 2000
MAX_GENERAL_NOTES_LENGTH = 5000

ShortStr = Annotated[str, Field(..., max_length=MAX_SHORT_STR_LENGTH)]
LongStr = Annotated[str, Field(..., max_length=MAX_LONG_STR_LENGTH)]
NotesStr = Annotated[str, Field(None, max_length=MAX_NOTES_LENGTH)]
GeneralNotesStr = Annotated[
    str, Field(None, max_length=MAX_GENERAL_NOTES_LENGTH)
]
