/* QantaraTools dynamic tool accessibility safeguards. Keep visible labels where possible; this provides an accessible-name fallback for legacy tool templates. */
(() => {
  const controlName = el => {
    const explicit = el.getAttribute('aria-label') || el.getAttribute('title');
    if (explicit) return explicit.trim();
    if (el.id) {
      const label = document.querySelector(`label[for="${CSS.escape(el.id)}"]`);
      if (label) return label.textContent.replace(/\s+/g, ' ').trim();
    }
    const wrappingLabel = el.closest('label');
    if (wrappingLabel) return wrappingLabel.textContent.replace(/\s+/g, ' ').trim();
    if (el.placeholder) return el.placeholder.trim();
    const tool = document.querySelector('#active-tool-box h2, #active-tool-box h1');
    const toolName = tool?.textContent.trim() || 'Tool';
    const idName = (el.id || el.name || '').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/[_-]+/g, ' ').trim();
    const typeName = el.type === 'file' ? 'Choose file' : el.type === 'checkbox' || el.type === 'radio' ? 'Option' : el.tagName === 'SELECT' ? 'Select option' : 'Input';
    return `${toolName}: ${idName || typeName}`;
  };
  const enhance = root => {
    if (!root) return;
    root.querySelectorAll('input:not([type="hidden"]), textarea, select').forEach(el => {
      const named = el.labels?.length || el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.title;
      if (!named) el.setAttribute('aria-label', controlName(el));
    });
    root.querySelectorAll('img:not([alt])').forEach(img => {
      img.alt = img.closest('[aria-hidden="true"]') ? '' : 'Tool preview';
    });
    root.querySelectorAll('[id]').forEach(el => {
      if (el.matches('input,textarea,select,button,a')) return;
      if (/error|status|message|stats|result/i.test(el.id) && !el.hasAttribute('aria-live') && !el.hasAttribute('role')) {
        el.setAttribute('aria-live', /error/i.test(el.id) ? 'assertive' : 'polite');
      }
    });
  };
  const start = () => {
    enhance(document);
    const active = document.getElementById('active-tool-box');
    if (active) new MutationObserver(() => enhance(active)).observe(active, { childList: true, subtree: true });
    const modal = document.getElementById('request-modal');
    if (modal) modal.setAttribute('aria-hidden', modal.classList.contains('hidden') ? 'true' : 'false');
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
