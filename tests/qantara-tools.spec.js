const { test, expect } = require('@playwright/test');
async function home(page) { await page.goto('/index.html'); await expect(page.locator('#tools-grid-container')).toBeVisible(); await expect(page.locator('.tool-card')).toHaveCount(50); }
test('catalog has 50 tools', async ({ page }) => { await home(page); await expect(page.locator('.tool-card h4')).toHaveCount(50); });
test('search and categories work', async ({ page }) => { await home(page); await page.locator('#tool-search-input').fill('json'); await expect(page.locator('.tool-card:visible').first()).toContainText(/JSON/i); await page.locator('#tool-search-input').fill(''); await page.locator('[data-filter="business"]').click(); });
test('theme persists', async ({ page }) => { await home(page); const before = await page.evaluate(() => localStorage.getItem('theme')); await page.locator('button[onclick="toggleTheme()"]') .click(); const after = await page.evaluate(() => localStorage.getItem('theme')); expect(after).not.toBe(before); await page.reload(); expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(after); });
for (const identity of ['electric', 'citrus', 'violet']) {
  test(`all 50 routes render under ${identity} identity`, async ({ page }) => {
    await page.addInitScript(identity => localStorage.setItem('visual_identity', identity), identity);
    await home(page);
    await expect(page.locator('html')).toHaveAttribute('data-identity', identity);
    const cards = page.locator('.tool-card');
    for (let i = 0; i < 50; i++) {
      await cards.nth(i).click();
      await expect(page.locator('#active-tool-box')).not.toContainText(/Could not load|not registered|Loading tool/);
      await page.locator('#tool-view-container button[onclick="closeToolView()"]') .click();
    }
  });
}
test('local storage labels are text only', async ({ page }) => { await page.addInitScript(() => localStorage.setItem('qantaratools_recent_v1', JSON.stringify([{id:'json-formatter',title:'<img src=x onerror=alert(1)>'}]))); await home(page); await expect(page.locator('#recent-tools-list img')).toHaveCount(0); });

test('exif viewer shows metadata as text, not markup', async ({ page }) => {
  await page.addInitScript(() => {
    window.__xss = 0;
    window.EXIF = {
      getData(file, cb) { cb.call({}); },
      getAllTags() {
        return {
          ImageDescription: '<img src=x onerror="window.__xss=1">',
          Artist: '<script>window.__xss=2</script>',
          Software: 'ordinary value'
        };
      }
    };
  });
  await page.goto('/tools/exif-viewer/index.html', { waitUntil: 'domcontentloaded' });
  await page.setInputFiles('#exifFile', { name: 'photo.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('junk') });
  await expect(page.locator('#exifOut table')).toBeVisible();
  await expect(page.locator('#exifOut')).toContainText('<img src=x onerror="window.__xss=1">');
  await expect(page.locator('#exifOut img')).toHaveCount(0);
  await expect(page.locator('#exifOut script')).toHaveCount(0);
  expect(await page.evaluate(() => window.__xss)).toBe(0);

  await page.evaluate(() => {
    window.__xss = 0;
    window.EXIF.getAllTags = () => { throw new Error('<img src=x onerror="window.__xss=3">'); };
  });
  await page.setInputFiles('#exifFile', { name: 'bad.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('junk2') });
  await expect(page.locator('#exifOut')).toContainText('<img src=x onerror="window.__xss=3">');
  await expect(page.locator('#exifOut img')).toHaveCount(0);
  expect(await page.evaluate(() => window.__xss)).toBe(0);
});
