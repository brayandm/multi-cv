import json
from typing import Any, Dict, List, TypedDict
from xml.etree.ElementTree import Element, SubElement, tostring
from xml.dom import minidom
from pathlib import Path

BASE_URL = "https://multicv.space"


class Route(TypedDict):
    path: str
    priority: float
    changefreq: str


class SitemapData(TypedDict):
    languages: List[str]
    routes: List[Route]


def prettify(xml_bytes: bytes) -> str:
    """Return a pretty-printed XML string."""
    return minidom.parseString(xml_bytes).toprettyxml(indent="  ")


def generate_sitemap(data: SitemapData) -> str:
    """Generate the XML sitemap string from given route and language data."""
    urlset: Element = Element(
        "urlset",
        {
            "xmlns": "http://www.sitemaps.org/schemas/sitemap/0.9",
            "xmlns:xhtml": "http://www.w3.org/1999/xhtml",
        },
    )

    for route in data["routes"]:
        for lang in data["languages"]:
            url = SubElement(urlset, "url")
            full_path = f"{BASE_URL}/{lang}{route['path']}".replace(
                "//", "/"
            ).replace(":/", "://")
            SubElement(url, "loc").text = full_path

            for alt_lang in data["languages"]:
                alt_href = f"{BASE_URL}/{alt_lang}{route['path']}".replace(
                    "//", "/"
                ).replace(":/", "://")
                SubElement(
                    url,
                    "{http://www.w3.org/1999/xhtml}link",
                    {
                        "rel": "alternate",
                        "hreflang": alt_lang,
                        "href": alt_href,
                    },
                )

            SubElement(url, "priority").text = str(route["priority"])
            SubElement(url, "changefreq").text = route["changefreq"]

    xml_bytes = tostring(urlset, encoding="utf-8", method="xml")
    return prettify(xml_bytes)


if __name__ == "__main__":
    BASE_DIR = Path(__file__).resolve().parent
    json_path = BASE_DIR / "sites.json"

    with json_path.open("r", encoding="utf-8") as f:
        raw_data: Dict[str, Any] = json.load(f)
        data: SitemapData = {
            "languages": raw_data["languages"],
            "routes": raw_data["routes"],
        }

    sitemap_xml: str = generate_sitemap(data)

    with open("./public/sitemap.xml", "w", encoding="utf-8") as f:
        f.write(sitemap_xml)

    print("✅ Sitemap successfully generated as 'sitemap.xml'")
