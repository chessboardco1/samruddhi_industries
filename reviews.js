/* Standalone controls for the existing review content. */
(() => {
  const initialized = new WeakSet();
  window.initReviewSliders = () => {
    document.querySelectorAll('[data-review-slider]').forEach(root => {
      if (initialized.has(root)) return;
      initialized.add(root);
      const track = root.querySelector('.review-track');
      const slides = [...root.querySelectorAll('.review-slide')];
      const dots = [...root.querySelectorAll('[data-review-index]')];
      let current = 0;
      const visibleCount = () => Math.min(slides.length, Number(getComputedStyle(root).getPropertyValue('--review-cards')) || 1);
      const show = index => {
        const visible = visibleCount();
        const positions = slides.length - visible + 1;
        current = (index + positions) % positions;
        const step = slides[0].getBoundingClientRect().width + 16;
        track.style.transform = `translateX(-${current * step}px)`;
        slides.forEach((slide, i) => slide.setAttribute('aria-hidden', String(i < current || i >= current + visible)));
        dots.forEach((dot, i) => {
          dot.hidden = i >= positions;
          dot.setAttribute('aria-label', `Show review group ${i + 1}`);
          dot.setAttribute('aria-pressed', String(i === current));
        });
      };
      root.querySelector('[data-review-prev]').addEventListener('click', () => show(current - 1));
      root.querySelector('[data-review-next]').addEventListener('click', () => show(current + 1));
      dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
      root.addEventListener('keydown', event => {
        if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
        event.preventDefault();
        show(current + (event.key === 'ArrowRight' ? 1 : -1));
      });
      let start = null;
      root.addEventListener('touchstart', event => {
        start = [event.touches[0].clientX, event.touches[0].clientY];
      }, { passive: true });
      root.addEventListener('touchend', event => {
        if (!start) return;
        const dx = event.changedTouches[0].clientX - start[0];
        const dy = event.changedTouches[0].clientY - start[1];
        if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
        start = null;
      }, { passive: true });
      root.addEventListener('touchcancel', () => { start = null; });
      show(0);
      const resize = new ResizeObserver(() => {
        if (!root.isConnected) return resize.disconnect();
        show(Math.min(current, slides.length - visibleCount()));
      });
      resize.observe(root);
    });
  };
  document.addEventListener('DOMContentLoaded', window.initReviewSliders);
})();
