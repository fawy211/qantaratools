/* QantaraTools shared theme engine: one saved choice for the homepage, tools, ratings, and every static page. */
(function () {
  var KEY = 'theme';
  var root = document.documentElement;
  var COLORS = { light: '#f7f4ee', dark: '#11101a' };

  function saved() {
    try { return localStorage.getItem(KEY) === 'light' ? 'light' : 'dark'; } catch (e) { return 'dark'; }
  }
  function current() { return root.classList.contains('dark') ? 'dark' : 'light'; }

  function sync(mode) {
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) { meta.setAttribute('content', COLORS[mode]); });
    document.querySelectorAll('[data-theme-toggle]').forEach(function (button) {
      var next = mode === 'dark' ? 'light' : 'dark';
      button.setAttribute('aria-label', 'Switch to ' + next + ' mode');
      button.title = 'Switch to ' + next + ' mode';
      var icon = button.querySelector('i');
      if (icon) icon.className = 'fa-solid ' + (mode === 'dark' ? 'fa-sun' : 'fa-moon');
    });
  }

  function apply(mode, options) {
    mode = mode === 'light' ? 'light' : 'dark';
    root.classList.toggle('dark', mode === 'dark');
    root.classList.toggle('light', mode === 'light');
    root.dataset.theme = mode;
    if (!options || options.persist !== false) {
      try { localStorage.setItem(KEY, mode); } catch (e) {}
    }
    sync(mode);
    document.dispatchEvent(new CustomEvent('qt:themechange', { detail: { mode: mode } }));
  }

  function toggle() { apply(current() === 'dark' ? 'light' : 'dark'); }

  apply(saved(), { persist: false });

  document.addEventListener('click', function (event) {
    var button = event.target.closest && event.target.closest('[data-theme-toggle]');
    if (!button || button.hasAttribute('onclick')) return;
    event.preventDefault();
    toggle();
  });
  window.addEventListener('storage', function (event) { if (event.key === KEY) apply(saved(), { persist: false }); });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { sync(current()); }, { once: true });

  window.QTTheme = { apply: apply, toggle: toggle, current: current };
  window.togglePolicyTheme = toggle;
  window.toggleAboutTheme = toggle;
})();
