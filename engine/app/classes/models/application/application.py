from datetime import datetime, timezone
from typing import Annotated, List, Literal, Optional

from pydantic import BaseModel, Field, field_validator

from app.utils.pydantic_custom_types import (
    ForceExtraLongStr,
    ForceLongStr,
    ForceShortStr,
    LongStr,
    ShortStr,
)

LocationType = Annotated[
    Literal[
        "remote",
        "hybrid",
        "onsite",
    ],
    Field(...),
]

ApplicationStatusType = Annotated[
    Literal[
        "none",
        "applied",
        "test_scheduled",
        "test_completed",
        "interview_scheduled",
        "interview_completed",
        "offer_extended",
        "offer_accepted",
        "offer_declined",
        "application_withdrawn",
        "rejected",
    ],
    Field(...),
]


class Application(BaseModel):
    application_id: ShortStr

    role: Optional[ForceShortStr] = None
    company_name: Optional[ForceShortStr] = None
    company_website: Optional[ForceShortStr] = None
    company_logo_link: Optional[ForceShortStr] = None
    job_post_link: Optional[ForceShortStr] = None
    location_type: Optional[LocationType] = None
    country_or_region: Optional[ForceShortStr] = None

    job_summary: Optional[ForceLongStr] = None
    job_bullets: Optional[List[ForceLongStr]] = None
    job_description_raw: ForceExtraLongStr

    application_date: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )
    status: ApplicationStatusType
    contact_email: Optional[ForceShortStr] = None
    recruiter_name: Optional[ForceShortStr] = None

    job_post_source: Optional[ForceShortStr] = None
    salary: Optional[ForceShortStr] = None
    skills: Optional[List[str]] = None

    user_comments: LongStr

    class Config:
        json_encoders = {
            datetime: lambda v: v.astimezone(timezone.utc)
            .isoformat()
            .replace("+00:00", "Z")
        }

    @field_validator("location_type", "status", mode="before")
    @classmethod
    def lowercase_str(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return None
        if isinstance(v, str):
            return v.lower()
        return v
