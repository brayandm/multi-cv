from typing import List, TypedDict
import json
from pathlib import Path

BASE_URL = "https://multicv.space"
OUTPUT_FILE = "public/robots.txt"


class Route(TypedDict):
    path: str
    priority: float
    changefreq: str


class SitemapData(TypedDict):
    languages: List[str]
    routes: List[Route]


def generate_robots_txt(data: SitemapData) -> str:
    disallow_rules = [
        "User-agent: *",
        "Disallow: /",
        "Disallow: /*?callbackUrl=",
        "",
    ]

    # Paths that don't require multilingual variants
    shared_paths = [
        "/favicon.ico",
        "/sitemap.xml",
    ]

    # Paths that should be localized
    localized_paths = [
        "/",
        "/login",
        "/register",
        "/privacy-policy",
        "/terms-and-conditions",
        "/cookies-policy",
    ]

    # Build Allow rules
    allow_rules = []

    # Shared paths (only once, no languages)
    for path in shared_paths:
        allow_rules.append(f"Allow: {path}")
    allow_rules.append("")  # spacing

    # Localized paths
    for path in localized_paths:
        allow_rules.append(f"Allow: {path}")  # default (en)
        for lang in data["languages"]:
            if lang == "en":
                continue
            lang_path = f"/{lang}{path}"
            allow_rules.append(f"Allow: {lang_path}")
        allow_rules.append("")  # spacing between blocks

    # Also include base paths for languages: /es/, /ru/, /hi/
    language_home_rules = []
    for lang in data["languages"]:
        if lang == "en":
            continue
        language_home_rules.append(f"Allow: /{lang}/")
    language_home_rules.append("")

    # Sitemap line
    sitemap_line = f"Sitemap: {BASE_URL}/sitemap.xml"

    return "\n".join(
        disallow_rules + language_home_rules + allow_rules + [sitemap_line]
    )


if __name__ == "__main__":
    BASE_DIR = Path(__file__).resolve().parent
    json_path = BASE_DIR / "sites.json"

    with json_path.open("r", encoding="utf-8") as f:
        raw_data = json.load(f)
        data: SitemapData = {
            "languages": raw_data["languages"],
            "routes": raw_data["routes"],
        }

    robots_txt = generate_robots_txt(data)

    with open("./public/robots.txt", "w", encoding="utf-8") as f:
        f.write(robots_txt)

    print("✅ robots.txt successfully generated as 'public/robots.txt'")
