/* Visible, accessible language selector shared by the homepage and every generated tool page. */
(function () {
  'use strict';
  var locales = {
    en: { name: 'English', label: 'Language' },
    ar: { name: 'العربية', label: 'اللغة' },
    de: { name: 'Deutsch', label: 'Sprache' },
    fr: { name: 'Français', label: 'Langue' },
    es: { name: 'Español', label: 'Idioma' }
  };
  function init() {
    if (document.querySelector('[data-qt-language-switcher]')) return;
    var nav = document.querySelector('#site-header nav[aria-label="Site controls"], .qt-tool-nav, .qt-loc-head nav, .qt-static-nav, .qt-policy-actions, .qt-about-nav');
    if (!nav) return;

    var path = window.location.pathname || '/';
    var prefix = path.match(/^\/(de|fr|es)(?=\/|$)/);
    var queryLocale = new URLSearchParams(window.location.search).get('locale');
    var storedLocale = '';
    try { storedLocale = localStorage.getItem('qantaratools_language_v1') || ''; } catch (_) {}
    var current = prefix ? prefix[1] : (queryLocale === 'ar' ? 'ar' : (Object.prototype.hasOwnProperty.call(locales, storedLocale) ? storedLocale : 'en'));
    var basePath = prefix ? (path.slice(prefix[0].length) || '/') : path;
    if (!basePath.startsWith('/')) basePath = '/' + basePath;

    var wrap = document.createElement('label');
    wrap.className = 'qt-language-switcher';
    wrap.dataset.qtLanguageSwitcher = 'true';
    wrap.setAttribute('aria-label', locales[current].label);

    var caption = document.createElement('span');
    caption.className = 'qt-language-caption';
    caption.textContent = '🌐 ' + locales[current].label;
    var select = document.createElement('select');
    select.className = 'qt-language-select';
    select.setAttribute('aria-label', locales[current].label);
    select.title = locales[current].label;

    Object.keys(locales).forEach(function (code) {
      var option = document.createElement('option');
      option.value = code;
      option.textContent = locales[code].name;
      option.selected = code === current;
      select.appendChild(option);
    });

    select.addEventListener('change', function () {
      var target = select.value;
      var params = new URLSearchParams(window.location.search);
      params.delete('locale');
      var targetPath = basePath;
      if (target === 'de' || target === 'fr' || target === 'es') {
        targetPath = '/' + target + (basePath === '/' ? '/' : basePath);
      } else if (target === 'ar') {
        params.set('locale', 'ar');
      }
      var query = params.toString();
      try { localStorage.setItem('qantaratools_language_v1', target); } catch (_) {}
      window.location.href = targetPath + (query ? '?' + query : '') + window.location.hash;
    });

    wrap.appendChild(caption);
    wrap.appendChild(select);
    nav.appendChild(wrap);

    if (!document.getElementById('qt-language-switcher-style')) {
      var style = document.createElement('style');
      style.id = 'qt-language-switcher-style';
      style.textContent = '.qt-language-switcher{display:inline-flex;align-items:center;gap:7px;padding:5px 9px;border:1px solid var(--qt-line,#64748b);border-radius:11px;background:var(--qt-panel,#1e293b);color:var(--qt-text,#f8fafc);font:inherit;font-size:13px;font-weight:600;white-space:nowrap}.qt-language-caption{font-weight:800}.qt-language-select{max-width:118px;border:0;outline:0;background:transparent;color:inherit;font:inherit;cursor:pointer}.qt-language-select option{background:#fff;color:#172033}.qt-tool-nav .qt-language-switcher,.qt-loc-head nav .qt-language-switcher,.qt-static-nav .qt-language-switcher,.qt-policy-actions .qt-language-switcher,.qt-about-nav .qt-language-switcher{margin-inline-start:4px}@media(max-width:640px){#site-header>div{flex-wrap:wrap;gap:10px}#site-header nav{flex-wrap:wrap;justify-content:flex-end;width:100%}.qt-language-switcher{gap:4px;padding:5px 6px;font-size:12px}.qt-language-caption{font-size:11px}.qt-language-select{max-width:88px}.qt-tool-nav{flex-wrap:wrap;justify-content:flex-end}}';
      document.head.appendChild(style);
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
