# Extending QantaraTools

QantaraTools now has a versioned plugin API for adding future tools without changing the core router. Plugins are registered through `window.QTPluginSystem.register(...)`, validated as same-origin ES modules, and merged into the router at startup.

See `plugins/README.md` for the contract and example. Keep third-party plugins disabled by default, review their source, and add their script before `assets/js/router.js`.
