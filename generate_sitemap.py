"""Generate sitemap.xml and robots.txt for a supplied website origin."""
import argparse
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree.ElementTree import Element, SubElement, ElementTree, register_namespace

parser = argparse.ArgumentParser()
parser.add_argument("--base-url", required=True)
args = parser.parse_args()
origin = args.base_url.rstrip("/")
parsed = urlsplit(origin)
if parsed.scheme not in ("http", "https") or not parsed.netloc or parsed.query or parsed.fragment or parsed.path:
    parser.error("--base-url must be a website origin, such as https://example.com")
root = Path(__file__).resolve().parent / "dist"
namespace = "http://www.sitemaps.org/schemas/sitemap/0.9"
register_namespace("", namespace)
urlset = Element("{" + namespace + "}urlset")
count = 0
for page in sorted(root.rglob("*.html")):
    if "noindex" in page.read_text(encoding="utf-8"):
        continue
    relative = page.relative_to(root).as_posix()
    route = "/" if relative == "index.html" else "/" + relative.removesuffix(".html")
    item = SubElement(urlset, "{" + namespace + "}url")
    SubElement(item, "{" + namespace + "}loc").text = origin + route
    count += 1
ElementTree(urlset).write(root / "sitemap.xml", encoding="utf-8", xml_declaration=True)
(root / "robots.txt").write_text("User-agent: *\nAllow: /\n\nSitemap: " + origin + "/sitemap.xml\n", encoding="utf-8")
print(f"Generated sitemap with {count} pages for {origin}")
