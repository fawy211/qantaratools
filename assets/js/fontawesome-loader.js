/* Load Font Awesome locally first, with CDN fallback only if the local file fails. */
(function () {
  'use strict';
  var localHref = '/assets/vendor/fontawesome/6.4.0/css/all.min.css';
  var fallbackHref = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  var link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = localHref;
  link.dataset.qtFontawesome = 'local';
  link.onerror = function () {
    if (link.dataset.qtFontawesomeFallback === 'true') return;
    link.dataset.qtFontawesomeFallback = 'true';
    var fallback = document.createElement('link');
    fallback.rel = 'stylesheet';
    fallback.href = fallbackHref;
    fallback.crossOrigin = 'anonymous';
    fallback.dataset.qtFontawesome = 'cdn-fallback';
    document.head.appendChild(fallback);
  };
  document.head.appendChild(link);
})();