const { test, expect } = require('@playwright/test');

const slugs = ['about-us', 'contact', 'faq', 'privacy', 'terms'];
const locales = ['en', 'ar', 'de', 'fr', 'es'];

function pagePath(locale, slug) {
  if (locale === 'de' || locale === 'fr' || locale === 'es') return '/' + locale + '/' + slug + '/';
  return '/' + slug + '.html' + (locale === 'ar' ? '?locale=ar' : '');
}

for (const locale of locales) {
  for (const slug of slugs) {
    test(locale + ' ' + slug + ' page has working shared controls and layout', async ({ page }) => {
      await page.goto(pagePath(locale, slug));
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');

      const selector = page.locator('.qt-language-select');
      await expect(selector).toBeVisible();
      await expect(selector.locator('option')).toHaveCount(5);
      await expect(selector).toHaveValue(locale);

      const theme = page.locator('[data-theme-toggle]').first();
      await expect(theme).toBeVisible();
      const themeLabels = {
        en: ['Switch to light mode', 'Switch to dark mode'],
        ar: ['التبديل إلى الوضع الفاتح', 'التبديل إلى الوضع الداكن'],
        de: ['Zum hellen Modus wechseln', 'Zum dunklen Modus wechseln'],
        fr: ['Passer au mode clair', 'Passer au mode sombre'],
        es: ['Cambiar al modo claro', 'Cambiar al modo oscuro']
      };
      await expect(theme).toHaveAttribute('aria-label', new RegExp(themeLabels[locale].join('|')));
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('main').first()).toBeVisible();
      await expect(page.locator('link[rel="stylesheet"][href*="theme-light.css"]')).toHaveCount(1);

      const before = await page.evaluate(() => localStorage.getItem('theme'));
      await theme.click();
      const after = await page.evaluate(() => localStorage.getItem('theme'));
      expect(after).not.toBe(before);
      await expect(page.locator('[data-theme-toggle]').first()).toBeVisible();

      // The shared theme choice survives navigation/reload on informational pages.
      await page.reload();
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(after);
      await expect(page.locator('[data-theme-toggle]').first()).toBeVisible();
    });
  }
}

test('static-page language selector keeps the same page while changing locale', async ({ page }) => {
  await page.goto('/de/faq/');
  await page.locator('.qt-language-select').selectOption('fr');
  await expect(page).toHaveURL(/\/fr\/faq\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.locator('.qt-language-select').selectOption('en');
  await expect(page).toHaveURL(/\/faq\.html$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.locator('.qt-language-select').selectOption('ar');
  await expect(page).toHaveURL(/\/faq\.html\?locale=ar$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('localized legal and information pages remain usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const locale of locales) {
    for (const slug of slugs) {
      await page.goto(pagePath(locale, slug));
      await expect(page.locator('.qt-language-select')).toBeVisible();
      await expect(page.locator('[data-theme-toggle]').first()).toBeVisible();
      await expect(page.locator('h1').first()).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      expect(overflow, locale + '/' + slug + ' should not overflow horizontally on mobile').toBeFalsy();
    }
  }
});
