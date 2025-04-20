from datetime import datetime
from typing import Annotated, List, Literal, Optional

from pydantic import BaseModel, Field

from app.utils.pydantic_custom_types import (
    ForceExtraLongStr,
    ForceLongStr,
    ForceShortStr,
    LongStr,
    ShortStr,
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

    application_date: datetime
    status: ApplicationStatusType
    contact_email: Optional[ForceShortStr] = None
    recruiter_name: Optional[ForceShortStr] = None

    job_post_source: Optional[ForceShortStr] = None
    salary: Optional[ForceShortStr] = None
    skills: Optional[List[str]] = None

    user_comments: LongStr
