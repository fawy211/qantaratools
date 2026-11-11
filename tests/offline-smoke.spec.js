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

test('offline smoke: PDF tool reports its unavailable helper and remains responsive', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/tools/pdf-merge/', { waitUntil: 'domcontentloaded' });
  await page.locator('[data-pdf-files]').setInputFiles([
    { name: 'first.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 offline fixture') },
    { name: 'second.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF-1.4 offline fixture') }
  ]);
  await page.locator('#go').click();
  await expect(page.locator('[data-pdf-msg]')).toContainText(/could not be loaded|internet connection|helper library/i);
  await expect(page.locator('#go')).toBeEnabled();
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


test('external helper loader clears failed requests and allows a later retry', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: require.resolve('../assets/js/external-resources.js') });
  let attempts = 0;
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js', async route => {
    attempts += 1;
    if (attempts === 1) {
      await route.abort('internetdisconnected');
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/javascript',
      body: 'window.QRCode = function QRCode() {}; window.QRCode.CorrectLevel = { H: 2 };'
    });
  });

  const firstError = await page.evaluate(async () => {
    try {
      await window.QTExternal.loadScript('qrCode', { error: 'Offline test: helper unavailable.' });
      return '';
    } catch (error) {
      return error.message;
    }
  });
  expect(firstError).toBe('Offline test: helper unavailable.');

  await page.evaluate(() => window.QTExternal.loadScript('qrCode'));
  expect(attempts).toBe(2);
  expect(await page.evaluate(() => typeof window.QRCode)).toBe('function');
});
