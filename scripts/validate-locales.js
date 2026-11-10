#!/usr/bin/env node
'use strict';

// Static and runtime checks for the locale dictionary. Does not expose locale controls.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const locales = ['de', 'fr', 'es'];
const source = fs.readFileSync(path.join(root, 'assets/js/i18n.js'), 'utf8');
const windowStub = { dispatchEvent() {} };
const context = {
  window: windowStub,
  document: { documentElement: { dataset: {}, lang: 'en', dir: 'ltr' } },
  location: { pathname: '/' },
  localStorage: { getItem() { return 'en'; }, setItem() {} },
  Intl, Date,
  CustomEvent: class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } }
};
vm.runInNewContext(source, context);
const i18n = windowStub.QTI18n;
if (!i18n) throw new Error('QTI18n could not be initialized.');

const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
}
walk(path.join(root, 'tools'));
for (const file of ['assets/js/main.js', 'assets/js/router.js', 'assets/js/ai-office.js']) files.push(path.join(root, file));

const used = new Map();
const patterns = [
  /\b(?:this\.t|tr)\(\s*['"]([A-Za-z][A-Za-z0-9]+)['"]/g,
  /\bt\(\s*['"]([A-Za-z][A-Za-z0-9]+)['"]/g
];
for (const file of files) {
  const text = fs.readFileSync(file, 'utf8');
  for (const pattern of patterns) {
    for (const match of text.matchAll(pattern)) {
      const key = match[1];
      if (!used.has(key)) used.set(key, new Set());
      used.get(key).add(path.relative(root, file));
    }
  }
}

const missing = [];
for (const [key, paths] of used) {
  for (const locale of locales) {
    if (!i18n.hasTranslation(locale, key)) missing.push({ locale, key, paths: [...paths] });
  }
}

const tools = JSON.parse(fs.readFileSync(path.join(root, 'tool-pages.json'), 'utf8'));
const untranslatedToolMeta = [];
for (const tool of tools) {
  const enTitle = i18n.toolTitle(tool.id, tool.title);
  const enDesc = i18n.toolDescription(tool.id, tool.description);
  for (const locale of locales) {
    i18n.setLocale(locale);
    const title = i18n.toolTitle(tool.id, tool.title);
    const desc = i18n.toolDescription(tool.id, tool.description);
    if (!title || !desc || title === tool.id || desc === '') {
      untranslatedToolMeta.push({ locale, id: tool.id, title, description: desc });
    }
  }
  i18n.setLocale('en');
  if (!enTitle || !enDesc) untranslatedToolMeta.push({ locale: 'en', id: tool.id, title: enTitle, description: enDesc });
}

if (missing.length || untranslatedToolMeta.length) {
  if (missing.length) {
    console.error('Missing UI message translations:');
    for (const item of missing) console.error('- ' + item.locale + ' :: ' + item.key + ' :: ' + item.paths.join(', '));
  }
  if (untranslatedToolMeta.length) {
    console.error('Missing tool title/description metadata:');
    for (const item of untranslatedToolMeta) console.error('- ' + JSON.stringify(item));
  }
  process.exitCode = 1;
} else {
  i18n.setLocale('de');
  const germanNumber = i18n.formatNumber(12345.6);
  i18n.setLocale('fr');
  const frenchNumber = i18n.formatNumber(12345.6);
  i18n.setLocale('es');
  const spanishNumber = i18n.formatNumber(12345.6);
  console.log('Locale QA passed: ' + used.size + ' UI keys and ' + tools.length + ' tool metadata records checked for de/fr/es.');
  console.log('Locale number formatting samples: de=' + germanNumber + ', fr=' + frenchNumber + ', es=' + spanishNumber);
}
