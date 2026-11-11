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
  await expect.poll(() => page.evaluate(() => typeof window.QRCode)).toBe('function');
  await expect.poll(() => page.locator('#qrOut canvas, #qrOut img').count()).toBeGreaterThan(0);
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

test('offline smoke: browser image editing tools process and export files without external network', async ({ page }) => {
  await blockExternalRequests(page);
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAIAAAB7QOjdAAAAD0lEQVR4nGP8z8DAwMAAAAYIAQHLR3Z1AAAAAElFTkSuQmCC', 'base64');
  const file = { name: 'tiny.png', mimeType: 'image/png', buffer: png };

  await page.goto('/tools/image-rotate-flip/', { waitUntil: 'domcontentloaded' });
  await page.locator('#f').setInputFiles(file);
  await page.waitForFunction(() => {
    const input = document.querySelector('#f');
    return !!input && !!document.querySelector('#m') && input.files.length === 1;
  });
  const rotated = page.waitForEvent('download');
  await page.locator('#r90').click();
  expect((await rotated).suggestedFilename()).toBe('edited-image.png');

  await page.goto('/tools/image-cropper/', { waitUntil: 'domcontentloaded' });
  await page.locator('#cropFile').setInputFiles(file);
  await expect.poll(() => page.locator('#cropCanvas').evaluate(canvas => canvas.width)).toBeGreaterThan(0);
  await page.locator('#cx').fill('0');
  await page.locator('#cy').fill('0');
  await page.locator('#cw').fill('1');
  await page.locator('#ch').fill('1');
  await page.locator('#cropRun').click();
  await expect(page.locator('#cropCanvas')).toHaveJSProperty('width', 1);
  await expect(page.locator('#cropDown')).toBeVisible();

  await page.goto('/tools/image-format/', { waitUntil: 'domcontentloaded' });
  await page.locator('#ifFile').setInputFiles(file);
  await expect.poll(() => page.locator('#ifPreview').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
  await page.locator('#ifRun').click();
  await expect(page.locator('#ifDownload')).toBeVisible();
  const converted = page.waitForEvent('download');
  await page.locator('#ifDownload').click();
  expect((await converted).suggestedFilename()).toBe('converted-image.png');

  await page.goto('/tools/image-compressor/', { waitUntil: 'domcontentloaded' });
  await page.locator('#imgFile').setInputFiles(file);
  await page.locator('#imgWidth').fill('1');
  await page.locator('#processImg').click();
  await expect(page.locator('#downloadImg')).toBeVisible();
  const compressed = page.waitForEvent('download');
  await page.locator('#downloadImg').click();
  expect((await compressed).suggestedFilename()).toBe('compressed-tiny.jpg');

  await page.goto('/tools/image-batch/', { waitUntil: 'domcontentloaded' });
  await page.locator('#f').setInputFiles([file, { ...file, name: 'tiny-2.png' }]);
  const batchDownloads = [];
  page.on('download', download => batchDownloads.push(download));
  await page.locator('#go').click();
  await expect.poll(() => batchDownloads.length).toBe(2);
  expect(batchDownloads.map(download => download.suggestedFilename()).sort()).toEqual(['converted-1.png', 'converted-2.png']);

  await page.goto('/tools/image-watermark/', { waitUntil: 'domcontentloaded' });
  await page.locator('#f').setInputFiles(file);
  await page.locator('#t').fill('Qantara');
  const watermarked = page.waitForEvent('download');
  await page.locator('#go').click();
  expect((await watermarked).suggestedFilename()).toBe('watermarked-image.png');
});

test('offline smoke: EXIF viewer loads its local helper and handles an image', async ({ page }) => {
  await blockExternalRequests(page);
  const localHelperRequests = [];
  page.on('request', request => {
    if (request.url().includes('/assets/vendor/exif-js/')) localHelperRequests.push(request.url());
  });
  await page.goto('/tools/exif-viewer/', { waitUntil: 'domcontentloaded' });
  await page.locator('#exifFile').setInputFiles(
    require('node:path').join(__dirname, '..', 'QA-Samples', 'images', 'sample.jpg')
  );
  await expect.poll(() => page.evaluate(() => typeof window.EXIF)).toBe('function');
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
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js', route => route.abort('internetdisconnected'));

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


test('external helper loader falls back to the CDN when the local copy fails', async ({ page }) => {
  await page.route('**/assets/vendor/qrcodejs/1.0.0/qrcode.min.js', route => route.abort('failed'));
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js', route => route.fulfill({
    status: 200,
    contentType: 'application/javascript',
    body: 'window.QRCode = function QRCode() {}; window.QRCode.CorrectLevel = { H: 2 };'
  }));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.addScriptTag({ path: require.resolve('../assets/js/external-resources.js') });
  await page.evaluate(() => window.QTExternal.loadScript('qrCode'));
  expect(await page.evaluate(() => typeof window.QRCode)).toBe('function');
  expect(page.url()).toContain('/');
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


test('Font Awesome prefers the local stylesheet and does not request the CDN', async ({ page }) => {
  const requests = [];
  await page.route('**/assets/vendor/fontawesome/6.4.0/css/all.min.css', async route => {
    requests.push('local');
    await route.fulfill({ status: 200, contentType: 'text/css', body: '.fa-test{display:inline-block}' });
  });
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', async route => {
    requests.push('cdn');
    await route.abort('internetdisconnected');
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => !!document.querySelector('link[data-qt-fontawesome="local"]'))).toBeTruthy();
  await expect.poll(() => page.evaluate(() => {
    const link = document.querySelector('link[data-qt-fontawesome="local"]');
    return link && link.sheet ? 'loaded' : 'pending';
  })).toBe('loaded');
  expect(requests).toEqual(['local']);
});

test('Font Awesome falls back to CDN when its local stylesheet fails', async ({ page }) => {
  const requests = [];
  await page.route('**/assets/vendor/fontawesome/6.4.0/css/all.min.css', async route => {
    requests.push('local');
    await route.abort('failed');
  });
  await page.route('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css', async route => {
    requests.push('cdn');
    await route.fulfill({ status: 200, contentType: 'text/css', body: '.fa-test{display:inline-block}' });
  });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect.poll(() => page.evaluate(() => !!document.querySelector('link[data-qt-fontawesome="cdn-fallback"]'))).toBeTruthy();
  await expect.poll(() => page.evaluate(() => {
    const link = document.querySelector('link[data-qt-fontawesome="cdn-fallback"]');
    return link && link.sheet ? 'loaded' : 'pending';
  })).toBe('loaded');
  expect(requests).toEqual(['local', 'cdn']);
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
