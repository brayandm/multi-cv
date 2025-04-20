from pydantic import BaseModel, Field
from typing import Optional, List, Annotated, Literal

from app.utils.pydantic_custom_types import (
    ForceShortStr,
    ForceLongStr,
    ForceExtraLongStr,
)

from datetime import date


LocationType = Annotated[
    Literal[
        "Remote",
        "Hybrid",
        "Onsite",
    ],
    Field(...),
]

ApplicationStatusType = Annotated[
    Literal[
        "Applied",
        "Interview",
        "Offer",
        "Rejected",
    ],
    Field(...),
]


class Application(BaseModel):
    role: ForceShortStr
    job_post_link: ForceShortStr
    location_type: LocationType

    job_summary: ForceLongStr
    job_bullets: List[ForceShortStr]
    job_description_raw: ForceExtraLongStr

    company_name: ForceShortStr
    country_or_region: ForceShortStr

    application_date: date
    status: ApplicationStatusType
    contact_email: ForceShortStr
    recruiter_name: ForceShortStr

    job_post_source: Optional[ForceShortStr] = None
    salary: Optional[ForceShortStr] = None
    skills: Optional[List[str]] = None
    comments: Optional[ForceShortStr] = None
