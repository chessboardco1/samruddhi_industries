/* Lightweight motion for the static GitHub Pages export. */
(() => {
 const start = () => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const candidates = [...document.querySelectorAll('[data-framer-appear-id], main h1, main h2, main h3, .textile-service-card, .review-slide, .current-blog-cards > a, .blog-footer-columns > *, .framer-1qu3668 > div')];
  const seen = new Set();
  const observer = new IntersectionObserver(entries => {
   for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    observer.unobserve(entry.target);
    // Independent translate works alongside existing layout transforms.
    entry.target.animate([{translate:'0 28px',filter:'blur(2px)'},{translate:'0 0',filter:'blur(0px)'}],{duration:700,easing:'cubic-bezier(.22,1,.36,1)',fill:'none'});
   }
  }, {threshold:0.12});
  for (const element of candidates) {
   if (seen.has(element) || element.closest('nav') || !element.getClientRects().length) continue;
   // Animate the outer section rather than nesting heading motion inside it.
   if (element.parentElement.closest('[data-framer-appear-id]')) continue;
   seen.add(element);observer.observe(element);
  }
 };
 if (document.readyState==='loading') document.addEventListener('DOMContentLoaded',start);else start();
})();
