const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const tools = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tool-pages.json'), 'utf8'));
const locales = ['en', 'ar', 'de', 'fr', 'es'];

function toolPath(locale, id) {
  if (locale === 'en') return '/tools/' + id + '/';
  if (locale === 'ar') return '/tools/' + id + '/?locale=ar';
  return '/' + locale + '/tools/' + id + '/';
}

// Verify that every published tool mounts a real, usable interaction surface
// in every supported locale. This complements (but does not replace) tool-specific
// calculation, conversion, upload, and download tests.
for (const locale of locales) {
  for (let offset = 0; offset < tools.length; offset += 10) {
    const batch = tools.slice(offset, offset + 10);
    test(locale + ' tool interaction surfaces ' + (offset + 1) + '-' + (offset + batch.length), async ({ page }) => {
      test.setTimeout(120000);
      for (const tool of batch) {
        await page.goto(toolPath(locale, tool.id), { waitUntil: 'domcontentloaded' });
        await expect(page.locator('html')).toHaveAttribute('lang', locale);
        await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
        // Every one of the 250 localized tool routes must expose the language selector.
        const languageSwitcher = page.locator('[data-qt-language-switcher]');
        await expect(languageSwitcher).toBeVisible();
        const languageSelect = languageSwitcher.locator('select.qt-language-select');
        await expect(languageSelect.locator('option')).toHaveCount(5);
        await expect(languageSelect).toHaveValue(locale);

        const toolBox = page.locator('#active-tool-box');
        await page.waitForFunction(() => {
          const box = document.getElementById('active-tool-box');
          return !!box && box.children.length > 0 && !/Loading tool/i.test(box.textContent || '');
        }, { timeout: 15000 });

        await expect(toolBox).not.toContainText(/Could not load this tool|This tool is not available yet|Loading tool/i);
        const controls = toolBox.locator('input:not([type="hidden"]):visible, textarea:visible, select:visible, button:visible, [role="button"]:visible, canvas:visible, label:has(input[type="file"]):visible');
        await expect(controls.first(), tool.id + ' should expose an interactive control in ' + locale).toBeVisible();
        await expect(controls).not.toHaveCount(0);
      }
    });
  }
}
