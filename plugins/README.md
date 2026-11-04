# QantaraTools Plugin System

Add future tools without editing the router:

```js
window.QTPluginSystem.register({
  id: 'my-tool',
  title: 'My Tool',
  category: 'Core & Dev',
  path: 'plugins/my-tool.js',
  exportName: 'MyTool',
  version: '1.0.0'
});
```

The module must export a class whose constructor accepts `active-tool-box`:

```js
export class MyTool {
  constructor(id) { this.root = document.getElementById(id); }
  destroy() { /* release timers/listeners */ }
}
```

Only same-origin `.js` modules are accepted. Plugin IDs must be kebab-case. Register the plugin script before `assets/js/router.js` in `index.html`. Add its card with `router.loadTool(...)` when you want it visible in the catalog.
