from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote

ROOT = Path(__file__).resolve().parent / "dist"

class Handler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self):
        parsed = urlsplit(self.path)
        if parsed.path != "/" and parsed.path.endswith("/"):
            canonical = parsed.path.rstrip("/")
            local = Path(super().translate_path(canonical))
            if local.with_suffix(".html").is_file():
                self.send_response(302)
                self.send_header("Location", canonical + ("?" + parsed.query if parsed.query else ""))
                self.end_headers()
                return
        super().do_GET()

    def translate_path(self, path):
        local = Path(super().translate_path(urlsplit(path).path.rstrip("/") or "/"))
        if local.suffix == "":
            html = local.with_suffix(".html")
            if html.is_file():
                return str(html)
        return str(local)

if __name__ == "__main__":
    print("Open http://localhost:8000 in your browser. Press Ctrl+C to stop.")
    ThreadingHTTPServer(("127.0.0.1", 8000), Handler).serve_forever()
