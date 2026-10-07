"""Build a GitHub Pages project-site export without altering the local preview."""
from pathlib import Path
import re, json, shutil
from xml.etree.ElementTree import Element, SubElement, ElementTree, register_namespace
BASE = '/samruddhi_industries/'
ORIGIN = 'https://chessboardco1.github.io'
ROOT = Path(__file__).resolve().parent
SOURCE = ROOT / 'dist'
OUTPUT = ROOT / '.pages-build'
OUTPUT.mkdir(exist_ok=True)

def local_url(value):
    if value.startswith(('http:', 'https:', '//', 'data:', 'mailto:', 'tel:', '#')):
        return value
    if value.startswith(BASE):
        return value
    if value.startswith('/'):
        route = value.lstrip('/')
    elif value.startswith('assets/') or value.split('?')[0] in {p.name for p in SOURCE.glob('*') if p.is_file()}:
        route = value
    else:
        return value
    path = route.split('?')[0].split('#')[0]
    if path and not Path(path).suffix and (SOURCE / (path + '.html')).is_file():
        route = route.replace(path, path + '/', 1)
    return BASE + route

visibility = '<style id="pages-static-visibility">[data-framer-appear-id], [style*="will-change:transform"], [style*="will-change: transform"]{opacity:1 !important} [data-framer-appear-id]{transform:none !important} footer [style*="will-change"]{opacity:1 !important;transform:none !important}</style>'
for source in SOURCE.rglob('*'):
    if not source.is_file() or 'server' in source.relative_to(SOURCE).parts:
        continue
    relative = source.relative_to(SOURCE)
    if relative.name in ('sitemap.xml','robots.txt'):
        continue
    target = OUTPUT / relative
    target.parent.mkdir(parents=True, exist_ok=True)
    if source.suffix not in ('.html','.js','.css','.svg'):
        shutil.copyfile(source,target)
        continue
    text = source.read_text(encoding='utf-8')
    if source.suffix == '.html':
        text = re.sub(r'<script\b(?=[^>]*type="module")(?=[^>]*data-framer-bundle="main")[^>]*>.*?</script>', '', text, flags=re.S)
        text = re.sub(r'<link\b[^>]*rel="modulepreload"[^>]*>', '', text)
        text = re.sub(r'<script>const samruddhiPosts = .*?</script>', '', text, flags=re.S)
        def manifest(match):
            entries = json.loads(match.group(2))
            for entry in entries:
                for key,value in list(entry.get('attributes',{}).items()):
                    if key in ('href','src'):
                        entry['attributes'][key] = local_url(value)
                if 'html' in entry:
                    entry['html'] = re.sub(r'(href|src)="([^"]*)"', lambda m:m.group(1)+'="'+local_url(m.group(2))+'"', entry['html'])
            return match.group(1)+json.dumps(entries).replace('<','\\u003c')+match.group(3)
        text = re.sub(r'(<script type="application/json" id="saved-page-content">)(.*?)(</script>)',manifest,text,flags=re.S)
        text = re.sub(r'(href|src)="([^"]*)"', lambda m:m.group(1)+'="'+local_url(m.group(2))+'"',text)
        text = text.replace("const icon = '/assets/logo-1-blue.png';", "const icon = '"+BASE+"assets/logo-1-blue.png';")
        text = text.replace('</head>', visibility+'</head>')
        text = re.sub(r'opacity:\s*0(?=;|\")','opacity:1',text)
        text = re.sub(r'transform:\s*translateY\(40px\);?','',text)
        route = '' if relative.name == 'index.html' else relative.as_posix().removesuffix('.html')+'/'
        text = re.sub(r'<link\b[^>]*rel="canonical"[^>]*>','',text)
        text = text.replace('</head>','<link rel="canonical" href="'+ORIGIN+BASE+route+'"></head>')
    target.write_text(text,encoding='utf-8')
    if source.suffix == '.html' and relative.name not in ('index.html','404.html'):
        clean = OUTPUT / relative.with_suffix('') / 'index.html'
        clean.parent.mkdir(parents=True,exist_ok=True)
        clean.write_text(text,encoding='utf-8')
register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
ns='{http://www.sitemaps.org/schemas/sitemap/0.9}'
urlset=Element(ns+'urlset')
for page in sorted(SOURCE.rglob('*.html')):
    if 'noindex' in page.read_text(encoding='utf-8'): continue
    route='' if page.name=='index.html' else page.relative_to(SOURCE).as_posix().removesuffix('.html')+'/'
    SubElement(SubElement(urlset,ns+'url'),ns+'loc').text=ORIGIN+BASE+route
ElementTree(urlset).write(OUTPUT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
(OUTPUT/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+ORIGIN+BASE+'sitemap.xml\n',encoding='utf-8')
(OUTPUT/'.nojekyll').write_text('')
print('Built GitHub Pages export:', OUTPUT)
