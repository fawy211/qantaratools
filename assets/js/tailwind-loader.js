/* Load the locally compiled Tailwind stylesheet first; use the matching CDN runtime only if it fails. */
(function () {
  'use strict';
  if (document.querySelector('link[data-qt-tailwind="local"], script[data-qt-tailwind="cdn-fallback"]')) return;

  var local = document.createElement('link');
  local.rel = 'stylesheet';
  local.href = '/assets/css/tailwind-local.css';
  local.dataset.qtTailwind = 'local';

  local.onerror = function () {
    if (document.querySelector('script[data-qt-tailwind="cdn-fallback"]')) return;
    var fallback = document.createElement('script');
    fallback.src = 'https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.1.17';
    fallback.crossOrigin = 'anonymous';
    fallback.dataset.qtTailwind = 'cdn-fallback';
    document.head.appendChild(fallback);
  };

  document.head.appendChild(local);
})();
