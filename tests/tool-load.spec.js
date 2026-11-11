const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const localizedToolList = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tool-pages.json'), 'utf8'));

// Keep each browser batch small so failures are isolated and CI progress is visible.
for (const locale of ['en', 'ar', 'de', 'fr', 'es']) {
  for (let offset = 0; offset < localizedToolList.length; offset += 10) {
    const batch = localizedToolList.slice(offset, offset + 10);
    test.setTimeout(120000);
    test(locale + ' localized tool pages ' + (offset + 1) + '-' + (offset + batch.length) + ' load their actual modules', async ({ page }) => {
      for (const tool of batch) {
        const toolPath = locale === 'en'
          ? '/tools/' + tool.id + '/'
          : locale === 'ar'
            ? '/tools/' + tool.id + '/?locale=ar'
            : '/' + locale + '/tools/' + tool.id + '/';
        await page.goto(toolPath);
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
        await page.waitForFunction(() => {
          const box = document.getElementById('active-tool-box');
          return !!box && box.children.length > 0 && !/Loading tool/i.test(box.textContent || '');
        }, { timeout: 15000 });
        await expect(page.locator('#active-tool-box')).not.toContainText(/Could not load this tool|This tool is not available yet|Loading tool/i);
      }
    });
  }
}
