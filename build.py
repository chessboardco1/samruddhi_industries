"""Package the static template as a self-contained hosting worker."""
import base64
import json
import mimetypes
from pathlib import Path

root = Path(__file__).parent / 'dist'
assets = {}
for path in sorted(root.rglob('*')):
    relative = path.relative_to(root)
    if not path.is_file() or relative.parts[0] in ('server', '.openai'):
        continue
    mime = mimetypes.guess_type(path.name)[0] or 'application/octet-stream'
    assets['/' + relative.as_posix()] = [mime, base64.b64encode(path.read_bytes()).decode('ascii')]
assert '/index.html' in assets and '/assets/logo-1-blue.png' in assets
worker = 'const assets = ' + json.dumps(assets, separators=(',', ':')) + ';\n'
worker += '''export default {
  async fetch(request) {
    if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', {status: 405});
    let path;
    try { path = decodeURIComponent(new URL(request.url).pathname); }
    catch { return new Response('Invalid URL', {status: 400}); }
    if (path.endsWith('/')) path += 'index.html';
    const asset = assets[path] || assets[path + '.html'];
    const selected = asset || assets['/404.html'];
    if (!selected) return new Response('Not found', {status: 404});
    const body = request.method === 'HEAD' ? null : Uint8Array.from(atob(selected[1]), c => c.charCodeAt(0));
    return new Response(body, {status: asset ? 200 : 404, headers: {'Content-Type': selected[0], 'Cache-Control': 'no-cache'}});
  }
};
'''
(root / 'server').mkdir(exist_ok=True)
(root / 'server/index.js').write_text(worker, encoding='utf-8')
print(f'Built hosting worker with {len(assets)} static files.')
