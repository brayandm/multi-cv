from typing import Annotated
from pydantic import Field

ShortStr = Annotated[str, Field(..., max_length=100)]
LongStr = Annotated[str, Field(..., max_length=1000)]
NotesStr = Annotated[str, Field(None, max_length=2000)]
