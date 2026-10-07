"""Normalize captured public pages for independent static hosting."""
import re
from pathlib import Path
from urllib.parse import urljoin, urlparse

ROOT = Path(__file__).parent / 'dist'
REFERENCE = 'https://manufact-wbs.framer.website'
ORIGIN = 'https://manufact-replica.chessboardco1.chatgpt.site'

for path in ROOT.rglob('*.html'):
    source = path.read_text()
    route = '/' if path.name == 'index.html' else '/' + str(path.relative_to(ROOT)).removesuffix('.html')
    head = re.search(r'<head[^>]*>(.*?)</head>', source, re.S)
    body = re.search(r'<body([^>]*)>(.*?)</body>', source, re.S)
    if not head or not body:
        raise ValueError(f'Incomplete document: {path}')
    source = '<!DOCTYPE html><html lang="en" dir="ltr"><head>' + head[1] + '</head><body' + body[1] + '>' + body[2] + '</body></html>'
    source = re.sub(r'<iframe\b[^>]*id="__framer-editorbar"[^>]*>.*?</iframe>', '', source, flags=re.S)
    source = re.sub(r'<script\b[^>]*src="https://events\.framer\.com/[^>]*>.*?</script>', '', source, flags=re.S)
    source = re.sub(r'<script>try\{if\(localStorage\.getItem\("__framer_force_showing_editorbar_since"\)\).*?</script>', '', source, flags=re.S)
    source = source.replace(REFERENCE, ORIGIN)
    def internal_link(match):
        href = match[1]
        if href.startswith(('./', '../')):
            full = urlparse(urljoin(REFERENCE + route, href))
            href = full.path + ('?' + full.query if full.query else '') + ('#' + full.fragment if full.fragment else '')
        return 'href="' + href + '"'
    source = re.sub(r'href="([^"]*)"', internal_link, source)
    if 'src="/replica.js"' not in source:
        source = source.replace('<head>', '<head><meta http-equiv="Content-Security-Policy" content="form-action \'none\'; connect-src \'self\' https://framerusercontent.com https://*.framerusercontent.com; frame-src \'none\'"><script src="/replica.js"></script>', 1)
    if not re.search(r'rel="(?:shortcut )?icon"', source):
        source = source.replace('</head>', '<link rel="icon" href="data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 32 32\'%3E%3Crect width=\'32\' height=\'32\' rx=\'5\' fill=\'%23c73908\'/%3E%3Cpath d=\'M7 24V8h4l5 9 5-9h4v16h-4V15l-5 9-5-9v9z\' fill=\'white\'/%3E%3C/svg%3E"></head>')
    path.write_text(source)
print('Prepared', len(list(ROOT.rglob('*.html'))), 'pages')
