#!/usr/bin/env node
'use strict';

// Static translation coverage check. This does not change the live language setting.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const localeSource = fs.readFileSync(path.join(root, 'assets/js/i18n.js'), 'utf8');
const windowStub = { dispatchEvent() {} };
const context = {
  window: windowStub,
  document: { documentElement: { dataset: {}, lang: 'en', dir: 'ltr' } },
  location: { pathname: '/' },
  localStorage: { getItem() { return 'en'; }, setItem() {} },
  CustomEvent: class CustomEvent { constructor(type, init) { this.type = type; this.detail = init?.detail; } }
};
vm.runInNewContext(localeSource, context);
const i18n = windowStub.QTI18n;
if (!i18n) throw new Error('QTI18n could not be initialized in the QA environment.');

const locales = ['de', 'fr', 'es'];
const files = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith('.js')) files.push(full);
  }
}
walk(path.join(root, 'tools'));
for (const file of ['assets/js/main.js', 'assets/js/router.js', 'assets/js/ai-office.js']) {
  files.push(path.join(root, file));
}

const usage = new Map();
const patterns = [
  /\b(?:this\.t|tr)\(\s*['"]([A-Za-z][A-Za-z0-9]+)['"]/g
];
for (const file of files) {
  const source = fs.readFileSync(file, 'utf8');
  for (const pattern of patterns) {
    for (const match of source.matchAll(pattern)) {
      const key = match[1];
      if (!usage.has(key)) usage.set(key, new Set());
      usage.get(key).add(path.relative(root, file));
    }
  }
}

// The home page uses a local t() wrapper rather than this.t()/tr().
const main = fs.readFileSync(path.join(root, 'assets/js/main.js'), 'utf8');
for (const match of main.matchAll(/\bt\(\s*['"]([A-Za-z][A-Za-z0-9]+)['"]/g)) {
  const key = match[1];
  if (!usage.has(key)) usage.set(key, new Set());
  usage.get(key).add('assets/js/main.js');
}

const missing = [];
for (const [key, usedIn] of usage) {
  for (const locale of locales) {
    if (!i18n.hasTranslation(locale, key)) {
      missing.push({ key, locale, files: [...usedIn] });
    }
  }
}

if (missing.length) {
  console.error('Missing translations:');
  for (const item of missing) console.error('- ' + item.locale + ' :: ' + item.key + ' :: ' + item.files.join(', '));
  process.exitCode = 1;
} else {
  console.log('Translation coverage passed for ' + usage.size + ' message keys across ' + locales.join(', ') + '.');
}
