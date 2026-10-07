MANUFACT WEBSITE CODE

CONTENTS
- dist/index.html: homepage
- dist/about.html, service.html, product.html, contact.html: main pages
- dist/blog/, service/, case-study/: detail pages
- dist/replica.js: preview-only form behaviour
- preview.py: local preview server (Python 3 required)
- prepare.py: source normalization script for the captured reference pages

OPEN LOCALLY
1. Extract this ZIP.
2. Open the manufact-website folder in VS Code or a terminal.
3. Run: python preview.py
   On Windows, use: py preview.py
4. Open http://localhost:8000 in your browser.

EDITING
HTML and CSS are included in the page files. Edit them with any code editor.
The preserved Framer runtime may regenerate content after loading. These are
published page files, not the original editable Framer project or React source.
For structural or interactive changes, the affected components may need rebuilding.

LIMITATIONS
Internet access is required. Images, fonts and Framer animation modules load
from the original host; those external asset files are not bundled in this ZIP.
The contact form does not send enquiries. Full browser fidelity is unverified.

HOSTING
Upload the CONTENTS of dist/ to a static host with clean URL support
(e.g. /about serves about.html). No build step is required.
Keep the original Webestica attribution when using this reference template.
