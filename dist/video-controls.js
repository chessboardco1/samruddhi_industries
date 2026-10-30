/* Video playback controls for the static site. */
(() => {
 const start = () => {
  document.querySelectorAll('section.framer-qBywq').forEach(section => {
   const video = section.querySelector('video');
   const button = section.querySelector('.framer-qV2QB');
   if (!video || !button || button.dataset.videoControl) return;
   button.dataset.videoControl = 'true';
   button.setAttribute('role', 'button');
   button.tabIndex = 0;
   button.style.cursor = 'pointer';
   button.style.position = 'relative';
   button.style.zIndex = '10';
   const icon = document.createElement('span');
   icon.style.cssText = 'display:flex;align-items:center;justify-content:center;width:100%;height:100%;color:white;pointer-events:none';
   button.replaceChildren(icon);
   const update = () => {
    const playing = !video.paused && !video.ended;
    button.setAttribute('aria-label', playing ? 'Pause video' : 'Play video');
    icon.innerHTML = playing
     ? '<svg width="14" height="16" viewBox="0 0 14 16" aria-hidden="true"><path fill="currentColor" d="M1 1h4v14H1zM9 1h4v14H9z"/></svg>'
     : '<svg width="16" height="18" viewBox="0 0 16 18" aria-hidden="true"><path fill="currentColor" d="M2 1v16l13-8z"/></svg>';
   };
   const play = () => video.play().catch(update);
   const toggle = event => {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (video.paused || video.ended) play(); else video.pause();
   };
   button.addEventListener('click', toggle, true);
   button.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') toggle(event);
   }, true);
   ['play', 'pause', 'ended', 'error'].forEach(name => video.addEventListener(name, update));
   video.muted = true;
   video.defaultMuted = true;
   video.loop = true;
   video.playsInline = true;
   video.autoplay = true;
   video.preload = 'auto';
   update();
   play();
  });
 };
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
