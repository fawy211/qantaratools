const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  const externalRequests = [];
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
      await route.continue();
      return;
    }
    externalRequests.push(url.href);
    await route.abort('internetdisconnected');
  });
  return externalRequests;
}

test('offline smoke: Base64 and Word Counter work with all external requests blocked', async ({ page }) => {
  const externalRequests = await blockExternalRequests(page);

  await page.goto('/tools/base64/', { waitUntil: 'domcontentloaded' });
  await page.locator('#base64Input').fill('Hello offline');
  await page.locator('#encodeBtn').click();
  await expect(page.locator('#base64Output')).toHaveText('SGVsbG8gb2ZmbGluZQ==');
  await page.locator('#base64Input').fill('SGVsbG8gb2ZmbGluZQ==');
  await page.locator('#decodeBtn').click();
  await expect(page.locator('#base64Output')).toHaveText('Hello offline');

  await page.goto('/tools/word-counter/', { waitUntil: 'domcontentloaded' });
  await page.locator('#wcInput').fill('one two three');
  await expect(page.locator('#wcWords')).toHaveText('3');

  expect(externalRequests.length).toBeGreaterThan(0);
});

test('offline smoke: Chat to Office creates a Word file without external services', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.waitForFunction(() => typeof window.loadAiToOfficeTool === 'function');
  await page.evaluate(() => window.loadAiToOfficeTool());
  const source = 'User: Keep this exact offline text\nAssistant: No upload and no external service.';
  await page.locator('#ai-office-input').fill(source);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#ai-word').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/\.docx$/i);
});

test('offline smoke: QR helper reports a clear message when its approved online dependency is unavailable', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/tools/qr-generator/', { waitUntil: 'domcontentloaded' });
  await page.locator('#qrText').fill('https://qantaratools.com/');
  await page.locator('#qrGo').click();
  await expect(page.locator('#qrOut')).toContainText(/could not be loaded|internet connection|not available/i);
});

test('offline smoke: EXIF helper fails gracefully rather than freezing the tool', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/tools/exif-viewer/', { waitUntil: 'domcontentloaded' });
  await page.locator('#exifFile').setInputFiles({
    name: 'offline.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9])
  });
  await expect(page.locator('#exifOut')).toBeVisible();
  await expect(page.locator('#exifOut')).toContainText(/could not be loaded|internet connection|not available/i);
});
