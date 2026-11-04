/* QantaraTools Plugin API v1
 * Plugins are opt-in, same-origin ES modules. No plugin runs until registered.
 */
(function () {
  const plugins = new Map();
  const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

  function validate(plugin) {
    if (!plugin || !idPattern.test(plugin.id || '')) throw new Error('Plugin id must be kebab-case.');
    for (const field of ['title', 'path', 'exportName', 'category']) {
      if (typeof plugin[field] !== 'string' || !plugin[field].trim()) throw new Error(`Plugin ${field} is required.`);
    }
    const url = new URL(plugin.path, document.baseURI);
    if (url.origin !== window.location.origin) throw new Error('Plugins must be same-origin modules.');
    if (!url.pathname.endsWith('.js')) throw new Error('Plugin path must point to a JavaScript module.');
    return {
      title: plugin.title.trim(), path: url.href, exportName: plugin.exportName.trim(),
      category: plugin.category.trim(), version: String(plugin.version || '1.0.0'),
      plugin: true, enabled: plugin.enabled !== false
    };
  }

  function register(plugin) {
    const normalized = validate(plugin);
    if (plugins.has(normalized.id)) throw new Error(`Plugin already registered: ${normalized.id}`);
    plugins.set(normalized.id, normalized);
    return normalized.id;
  }

  function registerMany(list) { return (Array.isArray(list) ? list : []).map(register); }
  function getRegistry() { return Object.fromEntries([...plugins].filter(([, p]) => p.enabled)); }

  window.QTPluginSystem = Object.freeze({ register, registerMany, getRegistry, version: '1.0.0' });
})();
