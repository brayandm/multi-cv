from typing import Any

from app.classes.models import Profile


def preserve_notes_list(new_list: list[Any], existing_list: list[Any]) -> None:
    for new_item in new_list:
        for existing_item in existing_list:
            if new_item.id == existing_item.id:
                new_item.notes = existing_item.notes
                break


def preserve_notes(new_profile: Profile, existing_profile: Profile) -> None:

    new_profile.general_notes = existing_profile.general_notes
    new_profile.basic_info.notes = existing_profile.basic_info.notes
    new_profile.skills.notes = existing_profile.skills.notes

    preserve_notes_list(new_profile.experience, existing_profile.experience)
    preserve_notes_list(new_profile.education, existing_profile.education)
    preserve_notes_list(new_profile.projects, existing_profile.projects)
    preserve_notes_list(
        new_profile.certifications, existing_profile.certifications
    )


def remove_notes(profile: Profile) -> Profile:

    profile.general_notes = None
    profile.basic_info.notes = None
    profile.skills.notes = None

    for experience in profile.experience:
        experience.notes = None

    for education in profile.education:
        education.notes = None

    for project in profile.projects:
        project.notes = None

    for certification in profile.certifications:
        certification.notes = None

    return profile
