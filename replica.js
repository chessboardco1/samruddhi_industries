/* Local preview behaviour. The reference's published motion runtime is preserved. */
// Preserve only custom branding and edited copy; Framer owns animated content.
document.addEventListener('DOMContentLoaded', () => {
  const manifest = document.getElementById('saved-page-content');
  if (!manifest) return;
  const entries = JSON.parse(manifest.textContent).map(entry => {
    if (entry.html !== undefined) {
      const template = document.createElement('template');
      template.innerHTML = entry.html;
      entry.text = template.content.textContent;
    }
    return entry;
  });
  const restore = () => {
    for (const entry of entries) {
      for (const element of document.querySelectorAll(entry.selector)) {
        if (entry.html !== undefined && element.textContent !== entry.text) {
          element.innerHTML = entry.html;
        }
        for (const [name, value] of Object.entries(entry.attributes || {})) {
          if (element.getAttribute(name) !== value) element.setAttribute(name, value);
        }
        if (entry.attributes && !('srcset' in entry.attributes) && element.hasAttribute('srcset')) {
          element.removeAttribute('srcset');
        }
      }
    }
    window.initReviewSliders?.();
  };
  // Batch mutations so counters, slides, and scroll effects can update freely.
  let scheduled = false;
  const observer = new MutationObserver(() => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      scheduled = false;
      observer.disconnect();
      restore();
      observe();
    });
  });
  const observe = () => observer.observe(document.body, {
    childList: true, characterData: true, subtree: true,
    attributes: true, attributeFilter: ['src', 'srcset', 'alt', 'sizes', 'href'],
  });
  restore();
  observe();
});

document.addEventListener('submit', (event) => {
  event.preventDefault();
  event.stopImmediatePropagation();
  const form = event.target;
  let notice = form.querySelector('[data-replica-notice]');
  if (!notice) {
    notice = document.createElement('p');
    notice.dataset.replicaNotice = '';
    notice.setAttribute('role', 'status');
    notice.style.cssText = 'font: 16px/1.5 Arial,sans-serif;color:#4774a9;padding:16px;background:#fff;position:relative;z-index:5;width:100%;';
    form.appendChild(notice);
  }
  notice.textContent = 'This is a website preview. Enquiry delivery has not been connected yet.';
}, true);
