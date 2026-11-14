#!/usr/bin/env node
'use strict';

// Prevent incomplete translated SEO pages from being generated or published.
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const tools = JSON.parse(fs.readFileSync(path.join(root, 'tool-pages.json'), 'utf8'));
const localized = require('./seo-locales.js');
const locales = ['de', 'fr', 'es'];
const errors = [];

for (const locale of locales) {
  const records = localized[locale] || {};
  for (const tool of tools) {
    const record = records[tool.id];
    if (!record) {
      errors.push(locale + '/' + tool.id + ': missing complete SEO record');
      continue;
    }
    for (const field of ['title', 'desc', 'intro']) {
      if (typeof record[field] !== 'string' || !record[field].trim()) {
        errors.push(locale + '/' + tool.id + ': missing ' + field);
      }
    }
    if (!Array.isArray(record.faq) || record.faq.length < 2 ||
        record.faq.some(pair => !Array.isArray(pair) || pair.length !== 2 ||
          pair.some(value => typeof value !== 'string' || !value.trim()))) {
      errors.push(locale + '/' + tool.id + ': provide at least two translated FAQ pairs');
    }
  }
  for (const id of Object.keys(records)) {
    if (!tools.some(tool => tool.id === id)) errors.push(locale + '/' + id + ': unknown tool id');
  }
}

if (errors.length) {
  console.error('Localized SEO is not ready. No localized pages should be generated.');
  console.error(errors.slice(0, 30).map(item => '- ' + item).join('\n'));
  if (errors.length > 30) console.error('- ... and ' + (errors.length - 30) + ' more issue(s)');
  process.exitCode = 1;
} else {
  console.log('Localized SEO QA passed for ' + tools.length + ' tools in de/fr/es.');
}
