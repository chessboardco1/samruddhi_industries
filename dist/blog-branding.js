const samruddhiPosts = [["breakthroughs-powering-manufacturing-efficiency", "how-to-read-a-greige-fabric-specification-sheet", "How to Read a Greige Fabric Specification Sheet Before Placing an Order"], ["how-automation-is-shaping-the-future-of-manufacturing", "gsm-epi-ppi-yarn-count-greige-fabric", "GSM, EPI, PPI & Yarn Count: What Actually Matters When Sourcing Greige Fabric?"], ["top-5-materials-revolutionizing-industrial-components", "why-two-fabrics-with-the-same-gsm-feel-different", "Why Two Fabrics With the Same GSM Can Feel Completely Different"]];

(() => {
 const findPost = link => {
  const raw = link.getAttribute('href') || '';
  let path;
  try { path = new URL(raw, location.origin).pathname; } catch { return; }
  if (path.endsWith('/')) path = path.slice(0,-1);
  return samruddhiPosts.find(([oldSlug,slug]) => path === '/blog/'+oldSlug || path === '/blog/'+slug);
 };
 // Force a full page load so Framer's original route handlers cannot open template articles.
 window.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  const post = findPost(link);
  if (!post) return;
  event.preventDefault(); event.stopImmediatePropagation();
  const url = '/blog/'+post[1];
  if (event.ctrlKey || event.metaKey || link.target === '_blank') window.open(url,'_blank','noopener');
  else location.assign(url);
 }, true);
 const start = () => {
  const restore = () => {
   document.querySelectorAll('a[href]').forEach(card => {
    const post = findPost(card);
    if (!post) return;
    const container = card.querySelector('[data-framer-name="Title"]');
    const heading = container?.querySelector('h1,h2,h3,h4,h5,h6,p') || card.querySelector('h1,h2,h3,h4,h5,h6');
    if (heading && heading.textContent !== post[2]) heading.textContent = post[2];
    else if (!heading && container && container.textContent !== post[2]) container.textContent = post[2];
    if (card.getAttribute('href') !== '/blog/'+post[1]) card.setAttribute('href','/blog/'+post[1]);
    card.querySelectorAll('p,span,div').forEach(node => {
     if (node.childElementCount === 0 && node.textContent.trim() === 'Read full blog') node.textContent = '';
    });
   });
  };
  let pending = false;
  const observer = new MutationObserver(() => {
   if (pending) return;
   pending = true;
   requestAnimationFrame(() => {pending=false;observer.disconnect();restore();observe();});
  });
  const observe = () => observer.observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:['href']});
  restore();observe();
 };
 if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',start); else start();
})();
