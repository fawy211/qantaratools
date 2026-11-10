const { test, expect } = require('@playwright/test');

for (const locale of ['de', 'fr', 'es']) {
  test(locale + ' localized homepage lists all 50 tools', async ({ page }) => {
    await page.goto('/' + locale + '/');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('.qt-loc-related a')).toHaveCount(50);
  });

  test(locale + ' localized Base64 page loads the working tool UI', async ({ page }) => {
    await page.goto('/' + locale + '/tools/base64/');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1')).toBeVisible();
    const input = page.locator('#active-tool-box textarea').first();
    await expect(input).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#active-tool-box')).not.toContainText(/Could not load|not available yet/i);
  });
}

test('language choice persists when switching from German to English and Arabic', async ({ page }) => {
  await page.goto('/de/tools/base64/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await page.locator('[data-locale-link="en"]').click();
  await expect(page).toHaveURL(/\/tools\/base64\/\?locale=ar$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => localStorage.getItem('qantaratools_language_v1'))).toBe('en');

  await page.locator('[data-locale-link="ar"]').click();
  await expect(page).toHaveURL(/\/tools\/base64\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  expect(await page.evaluate(() => localStorage.getItem('qantaratools_language_v1'))).toBe('ar');
});
