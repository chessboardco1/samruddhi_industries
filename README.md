# Samruddhi Industries website

Static website for Samruddhi Industries, with fabric information, manufacturing services, contact details and six sourcing guides.

## Run locally

Requires Python 3. From this directory run:

```sh
python preview.py
```

Open http://localhost:8000. On Windows, `py preview.py` also works.

## Project files

- `dist/`: website HTML, CSS, JavaScript and local images.
- `preview.py`: local server with clean URL routing.
- `build.py`: generates `dist/server/index.js` for the hosting worker.
- `generate_sitemap.py`: generates the sitemap and robots.txt.

## Hosting

Serve the contents of `dist/` on a static host that maps `/about` to `about.html` and `/blog/article` to the matching HTML file. Alternatively, run `python build.py` to rebuild the hosting worker.

Before publishing, regenerate the sitemap using the actual website domain:

```sh
python generate_sitemap.py --base-url https://yourdomain.com
python build.py
```

The current sitemap uses the local preview origin. Google Analytics still needs a GA4 Measurement ID. The contact form currently provides preview behavior rather than sending enquiries.

Some fonts, images and published Framer animation modules remain externally hosted. Preserve the original Webestica attribution when using this reference template. Sample review names and ratings are labeled as sample content.
