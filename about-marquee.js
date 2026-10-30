/* Continuous About page banner for the static export. */
(() => {
 const start = () => {
  document.querySelectorAll('.framer-13vikz6').forEach(banner => {
   const track = banner.querySelector('ul');
   if (!track || track.dataset.scrolling) return;
   const originals = [...track.querySelectorAll(':scope > .ticker-item')].slice(0, 2);
   if (originals.length !== 2) return;
   track.dataset.scrolling = 'true';
   banner.style.overflow = 'hidden';
   track.style.setProperty('width', 'max-content');
   track.style.setProperty('max-width', 'none');
   track.style.setProperty('transform', 'none');
   track.replaceChildren();
   for (let i = 0; i < 12; i++) originals.forEach(original => {
    const item = original.cloneNode(true);
    item.style.whiteSpace = 'nowrap';
    item.removeAttribute('aria-posinset');
    item.removeAttribute('aria-setsize');
    if (i > 0) item.setAttribute('aria-hidden', 'true');
    track.append(item);
   });
   let animation;
   const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
   const update = () => {
    if (animation) animation.cancel();
    const distance = track.children[2].offsetLeft - track.children[0].offsetLeft;
    if (distance > 0 && !preference.matches) {
     animation = track.animate([
      {transform: 'translateX(0)'},
      {transform: `translateX(-${distance}px)`}
     ], {duration: distance / 45 * 1000, iterations: Infinity, easing: 'linear'});
    }
   };
   new ResizeObserver(update).observe(banner);
   preference.addEventListener('change', update);
   document.fonts.ready.then(update);
  });
 };
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
 else start();
})();
