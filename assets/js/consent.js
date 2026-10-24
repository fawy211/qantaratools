/* QantaraTools consent-aware Google Analytics loader. */
(function () {
  const KEY = 'qantaratools_analytics_consent_v1';
  const MEASUREMENT_ID = 'G-0CKBXQ6WXX';
  const existing = localStorage.getItem(KEY);

  function loadAnalytics() {
    if (window.__qtAnalyticsLoaded) return;
    window.__qtAnalyticsLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', MEASUREMENT_ID, { anonymize_ip: true });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
    document.head.appendChild(script);
  }

  function save(value) {
    localStorage.setItem(KEY, value);
    document.getElementById('qt-consent-banner')?.remove();
    if (value === 'accepted') loadAnalytics();
  }

  function showBanner() {
    if (document.getElementById('qt-consent-banner')) return;
    const banner = document.createElement('aside');
    banner.id = 'qt-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Analytics consent');
    banner.innerHTML = `<div class="qt-consent-copy"><strong>Help us improve QantaraTools</strong><p>We use Google Analytics to understand visits and improve the free toolkit. Tools and files are not sent to Analytics. Read our <a href="privacy.html">Privacy Policy</a>.</p></div><div class="qt-consent-actions"><button type="button" data-consent="declined">Only necessary</button><button type="button" class="primary" data-consent="accepted">Accept analytics</button></div>`;
    banner.addEventListener('click', event => {
      const button = event.target.closest('[data-consent]');
      if (button) save(button.dataset.consent);
    });
    document.body.appendChild(banner);
  }

  if (existing === 'accepted') loadAnalytics();
  else if (existing !== 'declined') {
    if (document.body) showBanner();
    else document.addEventListener('DOMContentLoaded', showBanner, { once: true });
  }
})();
