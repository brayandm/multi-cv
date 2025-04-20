from datetime import date
from typing import Annotated, List, Literal, Optional

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    ForceExtraLongStr,
    ForceLongStr,
    ForceShortStr,
)

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
    role: Optional[ForceShortStr]
    company_name: Optional[ForceShortStr]
    job_post_link: Optional[ForceShortStr]
    location_type: Optional[LocationType]
    country_or_region: Optional[ForceShortStr]

    job_summary: Optional[ForceLongStr]
    job_bullets: Optional[List[ForceShortStr]]
    job_description_raw: ForceExtraLongStr

    application_date: date
    status: ApplicationStatusType
    contact_email: Optional[ForceShortStr]
    recruiter_name: Optional[ForceShortStr]

    job_post_source: Optional[ForceShortStr] = None
    salary: Optional[ForceShortStr] = None
    skills: Optional[List[str]] = None

    user_comments: ForceShortStr
