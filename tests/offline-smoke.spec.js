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

test('offline smoke: QR code is generated from the local helper', async ({ page }) => {
  const externalRequests = await blockExternalRequests(page);
  const localHelperRequests = [];
  page.on('request', request => {
    if (request.url().includes('/assets/vendor/qrcodejs/')) localHelperRequests.push(request.url());
  });
  await page.goto('/tools/qr-generator/', { waitUntil: 'domcontentloaded' });
  await page.locator('#qrText').fill('https://qantaratools.com/');
  await page.locator('#qrGo').click();
  expect(await page.locator('#qrOut canvas, #qrOut img').count()).toBeGreaterThan(0);
  expect(localHelperRequests.some(url => url.endsWith('/qrcode.min.js'))).toBeTruthy();
  expect(externalRequests.some(url => /cdnjs\.cloudflare\.com.*qrcode/i.test(url))).toBeFalsy();
});

test('offline smoke: PDF merge uses the local pdf-lib helper and downloads a merged PDF', async ({ page }) => {
  await blockExternalRequests(page);
  const localHelperRequests = [];
  page.on('request', request => {
    if (request.url().includes('/assets/vendor/pdf-lib/')) localHelperRequests.push(request.url());
  });
  await page.goto('/tools/pdf-merge/', { waitUntil: 'domcontentloaded' });
  const pdfFixture = require('node:fs').readFileSync(require('node:path').join(__dirname, '..', 'QA-Samples', 'pdf', 'sample.pdf'));
  await page.locator('[data-pdf-files]').setInputFiles([1, 2].map(index => ({
    name: 'part-' + index + '.pdf',
    mimeType: 'application/pdf',
    buffer: pdfFixture
  })));
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#go').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('merged.pdf');
  await expect(page.locator('[data-pdf-msg]')).toContainText(/PDFs merged into one/i);
  expect(localHelperRequests.some(url => url.endsWith('/pdf-lib.min.js'))).toBeTruthy();
});

test('offline smoke: Images to PDF uses the local jsPDF helper and downloads a PDF', async ({ page }) => {
  await blockExternalRequests(page);
  const localHelperRequests = [];
  page.on('request', request => {
    if (request.url().includes('/assets/vendor/jspdf/')) localHelperRequests.push(request.url());
  });
  await page.goto('/tools/images-pdf/', { waitUntil: 'domcontentloaded' });
  const pngBase64 = await page.evaluate(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 2;
    canvas.height = 2;
    canvas.getContext('2d').fillRect(0, 0, 2, 2);
    return canvas.toDataURL('image/png').split(',')[1];
  });
  await page.locator('#imgs').setInputFiles({
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: Buffer.from(pngBase64, 'base64')
  });
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#go').click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('images.pdf');
  await expect(page.locator('[data-pdf-msg]')).toContainText(/Created a PDF/i);
  expect(localHelperRequests.some(url => url.endsWith('/jspdf.umd.min.js'))).toBeTruthy();
});

test('offline smoke: EXIF viewer loads its local helper and handles an image', async ({ page }) => {
  await blockExternalRequests(page);
  const localHelperRequests = [];
  page.on('request', request => {
    if (request.url().includes('/assets/vendor/exif-js/')) localHelperRequests.push(request.url());
  });
  await page.goto('/tools/exif-viewer/', { waitUntil: 'domcontentloaded' });
  await page.locator('#exifFile').setInputFiles({
    name: 'offline.jpg',
    mimeType: 'image/jpeg',
    buffer: Buffer.from('/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////2wBDAf//////////////////////////////////////////////////////////////////////////////////////wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAX/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIQAxAAAAH/AP/EABQQAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQEAAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQIBAT8Af//EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAIAQMBAT8Af//Z', 'base64')
  });
  await expect.poll(() => page.evaluate(() => typeof window.EXIF)).toBe('object');
  await expect(page.locator('#exifOut')).toBeVisible();
  expect(localHelperRequests.some(url => url.endsWith('/exif.js'))).toBeTruthy();
});

test('external helper loader clears failed requests and allows a later retry', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: require.resolve('../assets/js/external-resources.js') });
  let attempts = 0;
  await page.route('**/assets/vendor/qrcodejs/1.0.0/qrcode.min.js', async route => {
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

test('offline smoke: ASCII Art generates text locally with external network blocked', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/tools/ascii-art/', { waitUntil: 'domcontentloaded' });
  await page.locator('#asciiInput').fill('HI');
  await expect(page.locator('#asciiOut')).toHaveValue(/\S/);
  const output = await page.locator('#asciiOut').inputValue();
  expect(output.split('\n')).toHaveLength(5);
});

test('offline smoke: Text to PDF opens a local print view with external network blocked', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/tools/text-pdf/', { waitUntil: 'domcontentloaded' });
  await page.locator('#txt').fill('This text stays on this device.');
  const popupPromise = page.waitForEvent('popup');
  await page.locator('#go').click();
  const popup = await popupPromise;
  await expect(popup.locator('body')).toContainText('This text stays on this device.');
  await expect(popup.locator('h1')).toHaveText('qantaratools-text');
});

test('offline smoke: Outfit and IBM Plex Sans Arabic load from local font assets', async ({ page }) => {
  await blockExternalRequests(page);
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const fonts = await page.evaluate(async () => {
    const outfit = await document.fonts.load('16px Outfit');
    const arabic = await document.fonts.load('16px "IBM Plex Sans Arabic"');
    return { outfit: outfit.length, arabic: arabic.length };
  });
  expect(fonts.outfit).toBeGreaterThan(0);
  expect(fonts.arabic).toBeGreaterThan(0);
});
