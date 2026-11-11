const { test, expect } = require('@playwright/test');

for (const locale of ['en', 'ar', 'de', 'fr', 'es']) {
  test(locale + ' localized homepage lists all 50 tools', async ({ page }) => {
    const homePath = locale === 'en' ? '/' : locale === 'ar' ? '/?locale=ar' : '/' + locale + '/';
    await page.goto(homePath);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('[data-qt-language-switcher]')).toBeVisible();
    if (locale === 'ar') await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://127.0.0.1:4173/?locale=ar');
    const toolLinks = locale === 'en' || locale === 'ar'
      ? page.locator('.tool-card a.qt-tool-permalink')
      : page.locator('.qt-loc-related a');
    await expect(toolLinks).toHaveCount(50);
  });

  test(locale + ' localized Base64 page loads the working tool UI', async ({ page }) => {
    const toolPath = locale === 'en'
      ? '/tools/base64/'
      : locale === 'ar'
        ? '/tools/base64/?locale=ar'
        : '/' + locale + '/tools/base64/';
    await page.goto(toolPath);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('[data-qt-language-switcher]')).toBeVisible();
    if (locale === 'ar') await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'http://127.0.0.1:4173/tools/base64/?locale=ar');
    await expect(page.locator('h1').first()).toBeVisible();
    const input = page.locator('#active-tool-box textarea').first();
    await expect(input).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#active-tool-box')).not.toContainText(/Could not load|not available yet/i);
  });
}

test('language selector remains visible and usable on mobile homepage and tool pages', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const homeSelector = page.locator('.qt-language-select');
  await expect(homeSelector).toBeVisible();
  await expect(page.locator('[data-qt-language-switcher]')).toBeInViewport();
  await homeSelector.selectOption('de');
  await expect(page).toHaveURL(/\\/de\\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');

  await page.goto('/tools/base64/');
  const toolSelector = page.locator('.qt-language-select');
  await expect(toolSelector).toBeVisible();
  await expect(page.locator('[data-qt-language-switcher]')).toBeInViewport();
  await toolSelector.selectOption('fr');
  await expect(page).toHaveURL(/\\/fr\\/tools\\/base64\\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');
});

test('language choice persists when switching from German to English and Arabic', async ({ page }) => {
  await page.goto('/de/tools/base64/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await page.locator('.qt-language-select').selectOption('en');
  await expect(page).toHaveURL(/\/tools\/base64\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => localStorage.getItem('qantaratools_language_v1'))).toBe('en');

  await page.locator('.qt-language-select').selectOption('ar');
  await expect(page).toHaveURL(/\/tools\/base64\/\?locale=ar$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
  expect(await page.evaluate(() => localStorage.getItem('qantaratools_language_v1'))).toBe('ar');
});


const officeLocales = {
  en: { path: '/', user: 'User', assistant: 'Assistant', speaker: 'Speaker', message: 'Message', dir: 'ltr' },
  ar: { path: '/?locale=ar', user: 'المستخدم', assistant: 'المساعد', speaker: 'المتحدث', message: 'الرسالة', dir: 'rtl' },
  de: { path: '/de/', user: 'Nutzer', assistant: 'Assistent', speaker: 'Sprecher', message: 'Nachricht', dir: 'ltr' },
  fr: { path: '/fr/', user: 'Utilisateur', assistant: 'Assistant', speaker: 'Intervenant', message: 'Message', dir: 'ltr' },
  es: { path: '/es/', user: 'Usuario', assistant: 'Asistente', speaker: 'Interlocutor', message: 'Mensaje', dir: 'ltr' }
};

function unzipStoredEntry(buffer, wanted) {
  let offset = 0;
  while (offset + 30 <= buffer.length && buffer.readUInt32LE(offset) === 0x04034b50) {
    const method = buffer.readUInt16LE(offset + 8);
    const compressedSize = buffer.readUInt32LE(offset + 18);
    const nameLength = buffer.readUInt16LE(offset + 26);
    const extraLength = buffer.readUInt16LE(offset + 28);
    const name = buffer.toString('utf8', offset + 30, offset + 30 + nameLength);
    const start = offset + 30 + nameLength + extraLength;
    if (name === wanted) {
      if (method !== 0) throw new Error('Expected a store-mode ZIP entry: ' + wanted);
      return buffer.toString('utf8', start, start + compressedSize);
    }
    offset = start + compressedSize;
  }
  throw new Error('ZIP entry not found: ' + wanted);
}

for (const [locale, expected] of Object.entries(officeLocales)) {
  test('Chat to Office preserves source text and localizes Word, Excel and PDF for ' + locale, async ({ page }) => {
    // Prevent the print dialog from opening during the automated PDF byte-level check.
    // The test still creates a real PDF with Chromium's page.pdf() below.
    await page.addInitScript(() => { window.print = () => {}; });
    await page.goto(expected.path);
    await page.waitForFunction(() => window.QTI18n && typeof window.QTI18n.setLocale === 'function');
    await page.evaluate(localeCode => window.QTI18n.setLocale(localeCode), locale);
    await page.evaluate(() => window.loadAiToOfficeTool());
    const source = 'User: Keep this exact text — Café & <tag> 123\nAssistant: Original answer stays unchanged: naïve & useful.\n- Keep this bullet\nColumn A\tColumn B\nValue A\tValue B';
    const input = page.locator('#ai-office-input');
    await input.fill(source);

    const wordDownload = page.waitForEvent('download');
    await page.locator('#ai-word').click();
    const word = await wordDownload;
    const wordBuffer = await word.createReadStream().then(stream => new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    }));
    const wordXml = unzipStoredEntry(wordBuffer, 'word/document.xml');
    const wordStyles = unzipStoredEntry(wordBuffer, 'word/styles.xml');
    const wordRels = unzipStoredEntry(wordBuffer, 'word/_rels/document.xml.rels');
    const wordTypes = unzipStoredEntry(wordBuffer, '[Content_Types].xml');
    expect(wordXml).toContain(expected.user);
    expect(wordXml).toContain(expected.assistant);
    expect(wordRels).toContain('relationships/styles');
    expect(wordRels).toContain('Target="styles.xml"');
    expect(wordTypes).toContain('PartName="/word/styles.xml"');
    if (locale === 'ar') { expect(wordXml).toContain('<w:bidi/>'); expect(wordStyles).toContain('<w:rtl/>'); }
    else expect(wordStyles).not.toContain('<w:rtl/>');
    if (locale === 'ar') { expect(wordXml).toContain('<w:bidiVisual/>'); expect(wordXml).toContain('<w:ind w:right="360" w:hanging="180"/>'); }
    if (locale === 'ar') expect((wordXml.match(/<w:bidi\/>/g)||[]).length).toBeGreaterThan(2);
    else { expect(wordXml).not.toContain('<w:bidi/>'); }
    expect(wordXml).toContain('Keep this exact text');
    expect(wordXml).toContain('Café &amp; &lt;tag&gt; 123');
    expect(wordXml).toContain('naïve &amp; useful.');

    const excelDownload = page.waitForEvent('download');
    await page.locator('#ai-excel').click();
    const excel = await excelDownload;
    const excelBuffer = await excel.createReadStream().then(stream => new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    }));
    const sheet = unzipStoredEntry(excelBuffer, 'xl/worksheets/sheet1.xml');
    const workbook = unzipStoredEntry(excelBuffer, 'xl/workbook.xml');
    const workbookRels = unzipStoredEntry(excelBuffer, 'xl/_rels/workbook.xml.rels');
    expect(workbook).toContain('r:id="rId1"');
    expect(workbookRels).toContain('Target="worksheets/sheet1.xml"');
    expect(workbookRels).toContain('Target="styles.xml"');
    expect(sheet).toContain(expected.speaker);
    expect(sheet).toContain(expected.message);
    expect(sheet).toContain(expected.user);
    expect(sheet).toContain(expected.assistant);
    if (locale === 'ar') expect(sheet).toContain('rightToLeft="1"');
    else expect(sheet).not.toContain('rightToLeft="1"');
    expect(sheet).toContain('Keep this exact text');
    expect(sheet).toContain('Café &amp; &lt;tag&gt; 123');

    const popupPromise = page.waitForEvent('popup');
    await page.locator('#ai-pdf').click();
    const popup = await popupPromise;
    await expect(popup.locator('html')).toHaveAttribute('lang', locale);
    await expect(popup.locator('html')).toHaveAttribute('dir', expected.dir);
    await expect(popup.locator('body')).toContainText(expected.user);
    await expect(popup.locator('body')).toContainText(expected.assistant);
    await expect(popup.locator('body')).toContainText('Keep this exact text');
    await expect(popup.locator('body')).toContainText('Café & <tag> 123');
    await expect(popup.locator('.msg')).toHaveCount(2);
    await expect(popup.locator('li')).toContainText('Keep this bullet');
    expect(await popup.locator('.msg').first().evaluate(el => getComputedStyle(el).direction)).toBe(expected.dir);
    expect(await popup.locator('.role').first().evaluate(el => getComputedStyle(el).direction)).toBe(expected.dir);

    // Generate an actual PDF in headless Chromium, not only a preview DOM, and verify its file structure.
    const pdfBytes = await popup.pdf({ format: 'A4', printBackground: true });
    expect(pdfBytes.subarray(0, 5).toString('ascii')).toBe('%PDF-');
    expect(pdfBytes.length).toBeGreaterThan(1000);
    const pdfPageCount = (pdfBytes.toString('latin1').match(/\/Type\s*\/Page\b/g) || []).length;
    expect(pdfPageCount).toBeGreaterThan(0);
    await popup.close();
  });
}


const pdfUiLocales = {
  en: { path: '/tools/pdf-merge/', mergeTitle: 'PDF Merge', mergeButton: 'Merge PDFs', reorderPath: '/tools/pdf-reorder/', reorderTitle: 'PDF Page Reorder', example: 'Example: 3,1,4-6,2' },
  ar: { path: '/tools/pdf-merge/?locale=ar', mergeTitle: 'دمج ملفات PDF', mergeButton: 'دمج ملفات PDF', reorderPath: '/tools/pdf-reorder/?locale=ar', reorderTitle: 'إعادة ترتيب صفحات PDF', example: 'مثال: 3,1,4-6,2' },
  de: { path: '/de/tools/pdf-merge/', mergeTitle: 'PDF-Dateien zusammenführen', mergeButton: 'PDFs zusammenführen', reorderPath: '/de/tools/pdf-reorder/', reorderTitle: 'PDF-Seiten neu anordnen', example: 'Beispiel: 3,1,4-6,2' },
  fr: { path: '/fr/tools/pdf-merge/', mergeTitle: 'Fusionner des PDF', mergeButton: 'Fusionner les PDF', reorderPath: '/fr/tools/pdf-reorder/', reorderTitle: 'Réorganiser les pages PDF', example: 'Exemple : 3,1,4-6,2' },
  es: { path: '/es/tools/pdf-merge/', mergeTitle: 'Unir archivos PDF', mergeButton: 'Unir PDF', reorderPath: '/es/tools/pdf-reorder/', reorderTitle: 'Reordenar páginas PDF', example: 'Ejemplo: 3,1,4-6,2' }
};

for (const [locale, expected] of Object.entries(pdfUiLocales)) {
  test('PDF tool interface is localized for ' + locale, async ({ page }) => {
    await page.goto(expected.path);
    await expect(page.locator('#active-tool-box')).toContainText(expected.mergeTitle);
    await expect(page.locator('#active-tool-box button#go')).toHaveText(expected.mergeButton);
    await page.goto(expected.reorderPath);
    await expect(page.locator('#active-tool-box')).toContainText(expected.reorderTitle);
    await expect(page.locator('#active-tool-box input#pages')).toHaveAttribute('placeholder', expected.example);
  });
}


const homeOfficePaths = {
  en: '/', ar: '/?locale=ar', de: '/de/', fr: '/fr/', es: '/es/'
};
for (const [locale, homePath] of Object.entries(homeOfficePaths)) {
  test('localized homepage features and opens Chat to Office for ' + locale, async ({ page }) => {
    await page.goto(homePath);
    const featured = page.locator('#qt-featured-office, .qt-featured-wrap');
    await expect(featured).toBeVisible();
    await featured.click();
    const expectedCanonical = locale === 'ar' ? 'http://127.0.0.1:4173/?locale=ar' : 'https://qantaratools.com' + homePath;
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', expectedCanonical);
    await expect(page.locator('#ai-office-input')).toBeVisible();
    await expect(page.locator('#ai-word')).toBeVisible();
    await expect(page.locator('#ai-excel')).toBeVisible();
    await expect(page.locator('#ai-pdf')).toBeVisible();
  });
}

// Additional PDF tools: verify localized titles and primary actions in every supported language.
const pdfAdditionalLocales = {
  en: {
    split: ['PDF Split & Page Extractor', 'Extract Pages'],
    rotate: ['PDF Page Rotator', 'Create Rotated PDF'],
    compress: ['PDF Optimizer', 'Optimize PDF'],
    images: ['Images to PDF', 'Create PDF'],
    text: ['Text to PDF', 'Open PDF Print View']
  },
  ar: {
    split: ['تقسيم PDF واستخراج الصفحات', 'استخراج الصفحات'],
    rotate: ['تدوير صفحات PDF', 'إنشاء PDF بعد التدوير'],
    compress: ['تحسين ملفات PDF', 'تحسين PDF'],
    images: ['تحويل الصور إلى PDF', 'إنشاء PDF'],
    text: ['تحويل النص إلى PDF', 'فتح معاينة طباعة PDF']
  },
  de: {
    split: ['PDF teilen und Seiten extrahieren', 'Seiten extrahieren'],
    rotate: ['PDF-Seiten drehen', 'Gedrehte PDF erstellen'],
    compress: ['PDF optimieren', 'PDF optimieren'],
    images: ['Bilder in PDF umwandeln', 'PDF erstellen'],
    text: ['Text in PDF umwandeln', 'PDF-Druckansicht öffnen']
  },
  fr: {
    split: ['Diviser un PDF et extraire des pages', 'Extraire les pages'],
    rotate: ['Pivoter les pages PDF', 'Créer le PDF pivoté'],
    compress: ['Optimiseur de PDF', 'Optimiser le PDF'],
    images: ['Images en PDF', 'Créer le PDF'],
    text: ['Texte en PDF', 'Ouvrir l’aperçu PDF']
  },
  es: {
    split: ['Dividir PDF y extraer páginas', 'Extraer páginas'],
    rotate: ['Girar páginas PDF', 'Crear PDF girado'],
    compress: ['Optimizador de PDF', 'Optimizar PDF'],
    images: ['Convertir imágenes a PDF', 'Crear PDF'],
    text: ['Convertir texto a PDF', 'Abrir vista de impresión PDF']
  }
};

for (const [locale, expected] of Object.entries(pdfAdditionalLocales)) {
  const prefix = locale === 'en' ? '' : locale === 'ar' ? '' : '/' + locale;
  const suffix = locale === 'ar' ? '?locale=ar' : '';
  for (const [key, slug] of [['split', 'pdf-split'], ['rotate', 'pdf-rotate'], ['compress', 'pdf-compress'], ['images', 'images-pdf'], ['text', 'text-pdf']]) {
    test('PDF ' + slug + ' interface is localized for ' + locale, async ({ page }) => {
      await page.goto(prefix + '/tools/' + slug + '/' + suffix);
      await expect(page.locator('#active-tool-box')).toContainText(expected[key][0]);
      await expect(page.locator('#active-tool-box button#go')).toHaveText(expected[key][1]);
    });
  }
}


const functionalLocalePaths = {
  en: '/tools/discount-calculator/',
  ar: '/tools/discount-calculator/?locale=ar',
  de: '/de/tools/discount-calculator/',
  fr: '/fr/tools/discount-calculator/',
  es: '/es/tools/discount-calculator/'
};
for (const [locale, calculatorPath] of Object.entries(functionalLocalePaths)) {
  test('calculator and text tool results follow selected locale for ' + locale, async ({ page }) => {
    await page.goto(calculatorPath);
    await page.locator('#dcGo').click();
    const expectedAmount = await page.evaluate(() => window.QTI18n.formatNumber(80, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    await expect(page.locator('#dcMain')).toHaveText(expectedAmount);
    const expectedLabel = await page.evaluate(() => window.QTI18n.t('finalPrice', 'Final Price'));
    await expect(page.locator('#dcMainLabel')).toHaveText(expectedLabel);

    const wordCounterPath = calculatorPath.replace('discount-calculator', 'word-counter');
    await page.goto(wordCounterPath);
    await page.locator('#wcInput').fill('Hello world. New line');
    const expectedWords = await page.evaluate(() => window.QTI18n.formatNumber(4));
    await expect(page.locator('#wcWords')).toHaveText(expectedWords);
    const expectedWordLabel = await page.evaluate(() => window.QTI18n.t('words', 'Words'));
    await expect(page.locator('#wcWords').locator('..')).toContainText(expectedWordLabel);

    const jsonPath = calculatorPath.replace('discount-calculator', 'json-formatter');
    await page.goto(jsonPath);
    await page.locator('#jsonInput').fill('{"hello":"world"}');
    await page.locator('#formatBtn').click();
    const expectedStatus = await page.evaluate(() => window.QTI18n.t('validJson', 'Valid JSON.'));
    await expect(page.locator('#jsonStatus')).toHaveText(expectedStatus);
    await expect(page.locator('#jsonOutput')).toContainText('"hello": "world"');
  });
}


// Real PDF processing checks: create valid sample PDFs, run each operation, then
// reopen the downloaded file and verify its structure rather than only its UI.
async function makePdfFixture(page, widths) {
  await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js' });
  return page.evaluate(async (sizes) => {
    const doc = await PDFLib.PDFDocument.create();
    for (const width of sizes) doc.addPage([width, 200]);
    const bytes = await doc.save();
    let binary = '';
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary);
  }, widths);
}

async function setPdfFixture(input, base64, name = 'sample.pdf') {
  await input.setInputFiles({
    name,
    mimeType: 'application/pdf',
    buffer: Buffer.from(base64, 'base64')
  });
}

async function readDownloadedPdf(download, page) {
  const stream = await download.createReadStream();
  const bytes = await new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', chunk => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
  const base64 = bytes.toString('base64');
  return page.evaluate(async (encoded) => {
    const binary = atob(encoded);
    const data = Uint8Array.from(binary, char => char.charCodeAt(0));
    const doc = await PDFLib.PDFDocument.load(data);
    return {
      pageCount: doc.getPageCount(),
      widths: doc.getPages().map(p => Math.round(p.getWidth())),
      rotations: doc.getPages().map(p => p.getRotation().angle)
    };
  }, base64);
}

const pdfFunctionalPaths = {
  en: '/tools/pdf-merge/',
  ar: '/tools/pdf-merge/?locale=ar',
  de: '/de/tools/pdf-merge/',
  fr: '/fr/tools/pdf-merge/',
  es: '/es/tools/pdf-merge/'
};

for (const [locale, mergePath] of Object.entries(pdfFunctionalPaths)) {
  test('PDF merge, split, rotate, reorder and optimize produce valid files for ' + locale, async ({ page }) => {
    test.setTimeout(90000);
    const fixture = await makePdfFixture(page, [100, 200, 300]);
    const onePageFixture = await makePdfFixture(page, [400]);

    // Merge: three pages plus one page must produce a valid four-page PDF.
    await page.goto(mergePath);
    await setPdfFixture(page.locator('[data-pdf-files]'), fixture);
    await page.locator('[data-pdf-files]').setInputFiles([
      { name: 'first.pdf', mimeType: 'application/pdf', buffer: Buffer.from(fixture, 'base64') },
      { name: 'second.pdf', mimeType: 'application/pdf', buffer: Buffer.from(onePageFixture, 'base64') }
    ]);
    let downloadPromise = page.waitForEvent('download');
    await page.locator('#go').click();
    let result = await readDownloadedPdf(await downloadPromise, page);
    expect(result.pageCount).toBe(4);
    expect(result.widths).toEqual([100, 200, 300, 400]);

    // Split: extracting pages 1 and 3 from the same source must preserve their order.
    await page.goto(mergePath.replace('pdf-merge', 'pdf-split'));
    await setPdfFixture(page.locator('[data-pdf-files]'), fixture);
    await page.locator('#pages').fill('1,3');
    downloadPromise = page.waitForEvent('download');
    await page.locator('#go').click();
    result = await readDownloadedPdf(await downloadPromise, page);
    expect(result.pageCount).toBe(2);
    expect(result.widths).toEqual([100, 300]);

    // Rotate: only page 2 should be rotated by 90 degrees.
    await page.goto(mergePath.replace('pdf-merge', 'pdf-rotate'));
    await setPdfFixture(page.locator('[data-pdf-files]'), fixture);
    await page.locator('#pages').fill('2');
    await page.locator('#degrees').selectOption('90');
    downloadPromise = page.waitForEvent('download');
    await page.locator('#go').click();
    result = await readDownloadedPdf(await downloadPromise, page);
    expect(result.pageCount).toBe(3);
    expect(result.rotations).toEqual([0, 90, 0]);

    // Reorder: all three pages should appear in the requested 3,1,2 sequence.
    await page.goto(mergePath.replace('pdf-merge', 'pdf-reorder'));
    await setPdfFixture(page.locator('[data-pdf-files]'), fixture);
    await page.locator('#pages').fill('3,1,2');
    downloadPromise = page.waitForEvent('download');
    await page.locator('#go').click();
    result = await readDownloadedPdf(await downloadPromise, page);
    expect(result.pageCount).toBe(3);
    expect(result.widths).toEqual([300, 100, 200]);

    // Optimize: the rebuilt file must still be readable and retain all pages.
    await page.goto(mergePath.replace('pdf-merge', 'pdf-compress'));
    await setPdfFixture(page.locator('[data-pdf-files]'), fixture);
    downloadPromise = page.waitForEvent('download');
    await page.locator('#go').click();
    result = await readDownloadedPdf(await downloadPromise, page);
    expect(result.pageCount).toBe(3);
    expect(result.widths).toEqual([100, 200, 300]);
  });
}


for (const [locale, mergePath] of Object.entries(pdfFunctionalPaths)) {
  test('Images to PDF and Text to PDF create localized printable output for ' + locale, async ({ page }) => {
    test.setTimeout(90000);
    // Build a small, valid PNG fixture without relying on external image files.
    const pngBase64 = await page.evaluate(() => {
      const canvas = document.createElement('canvas');
      canvas.width = 40;
      canvas.height = 20;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#336699';
      ctx.fillRect(0, 0, 40, 20);
      return canvas.toDataURL('image/png').split(',')[1];
    });

    await page.goto(mergePath.replace('pdf-merge', 'images-pdf'));
    const imagePath = page.locator('#imgs');
    await imagePath.setInputFiles({
      name: 'sample.png',
      mimeType: 'image/png',
      buffer: Buffer.from(pngBase64, 'base64')
    });
    let downloadPromise = page.waitForEvent('download');
    await page.locator('#go').click();
    const imageDownload = await downloadPromise;
    await page.addScriptTag({ url: 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js' });
    let pdfResult = await readDownloadedPdf(imageDownload, page);
    expect(pdfResult.pageCount).toBe(1);
    expect(pdfResult.widths).toHaveLength(1);

    // Text-to-PDF opens a print-ready document; verify locale metadata and exact text.
    await page.goto(mergePath.replace('pdf-merge', 'text-pdf'));
    const sourceText = 'QantaraTools text export — Café, naïve & useful. 12345';
    await page.locator('#filename').fill('localized-sample');
    await page.locator('#txt').fill(sourceText);
    const popupPromise = page.waitForEvent('popup');
    await page.locator('#go').click();
    const printPage = await popupPromise;
    await expect(printPage.locator('body')).toContainText(sourceText);
    await expect(printPage.locator('h1')).toHaveText('localized-sample');
    await expect(printPage.locator('html')).toHaveAttribute('lang', locale);
    await expect(printPage.locator('body')).toHaveCSS('font-size', '16px');
    await printPage.close();
  });
}


// Functional regression coverage for additional everyday tools in every locale.
const extraFunctionalPaths = {
  en: { prefix: '', suffix: '' },
  ar: { prefix: '', suffix: '?locale=ar' },
  de: { prefix: '/de', suffix: '' },
  fr: { prefix: '/fr', suffix: '' },
  es: { prefix: '/es', suffix: '' }
};

for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('URL, UUID, hash, VAT and timestamp tools work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    // URL encoding and decoding must preserve Unicode and reserved characters.
    await page.goto(tool('url-encoder'));
    await page.locator('#urlText').fill('Café & tea');
    await page.locator('#urlEnc').click();
    expect(await page.locator('#urlOut').inputValue()).toBe(encodeURIComponent('Café & tea'));
    await page.locator('#urlText').fill(encodeURIComponent('Café & tea'));
    await page.locator('#urlDec').click();
    expect(await page.locator('#urlOut').inputValue()).toBe('Café & tea');

    // UUID generator must honor requested count and emit valid v4 UUIDs.
    await page.goto(tool('uuid-generator'));
    await page.locator('#uuidCount').fill('3');
    await page.locator('#uuidGo').click();
    const uuids = (await page.locator('#uuidOut').inputValue()).trim().split(/\r?\n/);
    expect(uuids).toHaveLength(3);
    for (const uuid of uuids) expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    // SHA-256 result is checked against a known published test vector.
    await page.goto(tool('hash-generator'));
    await page.locator('#hashIn').fill('abc');
    await page.locator('#hashAlg').selectOption('SHA-256');
    await page.locator('#hashRun').click();
    await expect(page.locator('#hashOut')).toHaveValue('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

    // VAT arithmetic and localized number formatting.
    await page.goto(tool('vat-calculator'));
    await page.locator('#vatAmount').fill('1000');
    await page.locator('#vatRate').fill('14');
    await page.locator('#vatGo').click();
    const vatExpected = await page.evaluate(() => ({
      net: window.QTI18n.formatNumber(1000, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      tax: window.QTI18n.formatNumber(140, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      total: window.QTI18n.formatNumber(1140, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }));
    await expect(page.locator('#vatNet')).toHaveText(vatExpected.net);
    await expect(page.locator('#vatTax')).toHaveText(vatExpected.tax);
    await expect(page.locator('#vatTotal')).toHaveText(vatExpected.total);

    // Timestamp conversion must handle Unix epoch zero without locale drift.
    await page.goto(tool('timestamp-converter'));
    await page.locator('#tsIn').fill('0');
    await page.locator('#tsToDate').click();
    await expect(page.locator('#tsOut')).toContainText('1970-01-01T00:00:00.000Z');
  });
}


// Additional functional regression coverage: JSON, Base64, passwords and text cleanup.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('JSON, Base64, password and text cleanup tools work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('json-formatter'));
    await page.locator('#jsonInput').fill('{"name":"Qantara","count":2}');
    await page.locator('#formatBtn').click();
    await expect(page.locator('#jsonOutput')).toContainText('"name": "Qantara"');
    await expect(page.locator('#jsonStatus')).toHaveClass(/text-emerald-400/);
    await page.locator('#jsonInput').fill('{"name":');
    await page.locator('#formatBtn').click();
    await expect(page.locator('#jsonStatus')).toHaveClass(/text-red-400/);

    await page.goto(tool('base64'));
    await page.locator('#base64Input').fill('مرحبا Café');
    await page.locator('#encodeBtn').click();
    const encoded = await page.locator('#base64Output').textContent();
    expect(encoded).toBe('2YXYsdit2KjYpyBDYWbDqQ==');
    await page.locator('#base64Input').fill(encoded);
    await page.locator('#decodeBtn').click();
    await expect(page.locator('#base64Output')).toHaveText('مرحبا Café');

    await page.goto(tool('password-generator'));
    await page.locator('#pgLen').fill('24');
    await page.locator('#pgUpper').uncheck();
    await page.locator('#pgLower').uncheck();
    await page.locator('#pgNums').check();
    await page.locator('#pgSymbols').uncheck();
    await page.locator('#pgGo').click();
    const password = await page.locator('#pgOut').inputValue();
    expect(password).toMatch(/^[0-9]{24}$/);
    await expect(page.locator('#pgStrength')).toContainText('24');

    await page.goto(tool('text-case'));
    await page.locator('#caseInput').fill('hello qantara tools');
    await page.locator('#btnUpper').click();
    await expect(page.locator('#caseOutput')).toHaveValue('HELLO QANTARA TOOLS');
    await page.locator('#btnSnake').click();
    await expect(page.locator('#caseOutput')).toHaveValue('hello_qantara_tools');

    await page.goto(tool('duplicate-remover'));
    await page.locator('#dupInput').fill('Apple\napple\nBanana\nApple\n');
    await page.locator('#dupCase').check();
    await page.locator('#dupGo').click();
    await expect(page.locator('#dupOut')).toHaveValue('Apple\nBanana');
  });
}


// More localized functional coverage for conversion, regex, finance and image data.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('JSON CSV, regex, discount and image Base64 tools work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('json-csv'));
    await page.locator('#jcIn').fill('[{"name":"Ada","note":"hello, world"},{"name":"Lin","note":"second"}]');
    await page.locator('#jcJson').click();
    await expect(page.locator('#jcOut')).toHaveValue(/name.*note/);
    await page.locator('#jcIn').fill('"name","age"\n"Ada","37"');
    await page.locator('#jcCsv').click();
    await expect(page.locator('#jcOut')).toHaveValue(/name.*Ada/);
    await expect(page.locator('#jcOut')).toHaveValue(/age.*37/);

    await page.goto(tool('regex-tester'));
    await page.locator('#rxPat').fill('cat');
    await page.locator('#rxFlags').fill('gi');
    await page.locator('#rxText').fill('Cat and catalog; a CAT.');
    await page.locator('#rxRun').click();
    await expect(page.locator('#rxOut .bg-gray-950')).toHaveCount(3);
    await page.locator('#rxPat').fill('[');
    await page.locator('#rxRun').click();
    await expect(page.locator('#rxOut')).not.toBeEmpty();

    await page.goto(tool('discount-calculator'));
    await page.locator('#dcPrice').fill('250');
    await page.locator('#dcPercent').fill('20');
    await page.locator('#dcGo').click();
    const discountExpected = await page.evaluate(() => window.QTI18n.formatNumber(200, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    await expect(page.locator('#dcMain')).toHaveText(discountExpected);
    await page.locator('input[name="dcMode"][value="markup"]').check();
    await page.locator('#dcGo').click();
    const markupExpected = await page.evaluate(() => window.QTI18n.formatNumber(300, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    await expect(page.locator('#dcMain')).toHaveText(markupExpected);

    await page.goto(tool('image-base64'));
    await page.locator('#b64FileInput').setInputFiles({
      name: 'tiny.png',
      mimeType: 'image/png',
      buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l7sAAAAASUVORK5CYII=', 'base64')
    });
    await expect(page.locator('#b64ResultArea')).toBeVisible();
    expect(await page.locator('#b64Output').inputValue()).toMatch(/^data:image/);
  });
}


// Further local processing checks for text utilities in all supported locales.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('HTML entities, word count, sorting and SQL formatting work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('html-entity'));
    await page.locator('#heInput').fill('<Qantara & Tools>');
    await page.locator('#heGo').click();
    await expect(page.locator('#heOutput')).toHaveValue('&lt;Qantara &amp; Tools&gt;');
    await page.locator('input[name="heMode"][value="decode"]').check();
    await page.locator('#heInput').fill('&lt;Qantara &amp; Tools&gt;');
    await page.locator('#heGo').click();
    await expect(page.locator('#heOutput')).toHaveValue('<Qantara & Tools>');

    await page.goto(tool('word-counter'));
    await page.locator('#wcInput').fill('One two.\n\nThree!');
    const localizedCount = n => page.evaluate(value => window.QTI18n.formatNumber(value), n);
    await expect(page.locator('#wcWords')).toHaveText(await localizedCount(3));
    await expect(page.locator('#wcChars')).toHaveText(await localizedCount(16));
    await expect(page.locator('#wcParas')).toHaveText(await localizedCount(2));

    await page.goto(tool('text-sorter'));
    await page.locator('#sortIn').fill('pear\nApple\nbanana');
    await page.locator('#sortAZ').click();
    await expect(page.locator('#sortOut')).toHaveValue('Apple\nbanana\npear');
    await page.locator('#sortZA').click();
    await expect(page.locator('#sortOut')).toHaveValue('pear\nbanana\nApple');

    await page.goto(tool('sql-formatter'));
    await page.locator('#sqlIn').fill('select id, name from users where active = 1 order by name;');
    await page.locator('#sqlRun').click();
    const sql = await page.locator('#sqlOut').inputValue();
    expect(sql).toContain('SELECT');
    expect(sql).toContain('FROM');
    expect(sql).toContain('WHERE');
    expect(sql).toContain('ORDER BY');
  });
}


// Financial, color and content-generation tools: deterministic browser checks in every locale.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('Color, loan, Lorem Ipsum and Markdown tools work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('color-converter'));
    await page.locator('#ccHex').fill('FF0000');
    await expect(page.locator('#ccOut')).toContainText('#FF0000');
    await expect(page.locator('#ccOut')).toContainText('rgb(255, 0, 0)');
    await expect(page.locator('#ccOut')).toContainText('hsl(0, 100%, 50%)');
    await page.locator('#ccHex').fill('not-a-color');
    await expect(page.locator('#ccOut > div').first()).toHaveClass(/text-red-400/);

    await page.goto(tool('loan-calculator'));
    await page.locator('#loanAmount').fill('12000');
    await page.locator('#loanRate').fill('0');
    await page.locator('#loanYears').fill('1');
    await page.locator('#loanGo').click();
    const monthly = await page.evaluate(() => window.QTI18n.formatNumber(1000, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    await expect(page.locator('#loanPay')).toHaveText(monthly);
    await expect(page.locator('#loanInterest')).toHaveText(await page.evaluate(() => window.QTI18n.formatNumber(0, { minimumFractionDigits: 2, maximumFractionDigits: 2 })));
    await expect(page.locator('#loanBody tr')).toHaveCount(12);

    await page.goto(tool('lorem-ipsum'));
    await page.locator('#liCount').fill('2');
    await page.locator('#liRun').click();
    const lorem = await page.locator('#liOut').inputValue();
    expect(lorem.split(/\n\s*\n/)).toHaveLength(2);
    expect(lorem.trim().split(/\s+/)).toHaveLength(90);

    await page.goto(tool('markdown-html'));
    await page.locator('#mdIn').fill('# Qantara\n\n**Local first**');
    await page.locator('#mdRun').click();
    const html = await page.locator('#mdOut').inputValue();
    expect(html).toContain('<h1>Qantara</h1>');
    expect(html).toContain('<strong>Local first</strong>');
  });
}


// Creative tools also run locally and must preserve user input in all locales.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('ASCII, gradient and random decision tools work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('ascii-art'));
    await page.locator('#asciiInput').fill('A1');
    const art = await page.locator('#asciiOut').inputValue();
    expect(art.split('\n')).toHaveLength(5);
    expect(art).toContain('A');
    expect(art).toContain('1');

    await page.goto(tool('gradient-generator'));
    await page.locator('#gradColor1').fill('#112233');
    await page.locator('#gradColor2').fill('#AABBCC');
    await page.locator('#gradDirection').selectOption({ label: 'to right' });
    await expect(page.locator('#gradientPreview')).toHaveCSS('background-image', 'linear-gradient(to right, rgb(17, 34, 51), rgb(170, 187, 204))');
    await expect(page.locator('#cssOutputBadge')).toContainText('linear-gradient(to right, #112233, #aabbcc)');

    await page.goto(tool('decision-maker'));
    await page.locator('#rdInput').fill('Alpha\nBeta\nGamma');
    await page.locator('#rdGo').click();
    await expect(page.locator('#rdOut')).toBeVisible();
    await expect(page.locator('#rdChoice')).toHaveText(/^(Alpha|Beta|Gamma)$/);
    await page.locator('#rdInput').fill('Only one');
    await page.locator('#rdGo').click();
    await expect(page.locator('#rdOut')).toBeHidden();
    await expect(page.locator('#rdError')).not.toHaveClass(/hidden/);
  });
}


// EXIF viewer: callback translations remain available and metadata is rendered as text, not HTML.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('EXIF metadata is safely displayed in ' + locale, async ({ page }) => {
    await page.addInitScript(() => {
      window.EXIF = {
        getData(file, callback) { callback.call(file); },
        getAllTags() { return { Make: 'Qantara Camera', Comment: '<img src=x onerror=alert(1)>' }; }
      };
    });
    await page.goto(route.prefix + '/tools/exif-viewer/' + route.suffix);
    await page.locator('#exifFile').setInputFiles({
      name: 'sample.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from([0xff, 0xd8, 0xff, 0xd9])
    });
    await expect(page.locator('#exifOut')).toBeVisible();
    await expect(page.locator('#exifOut')).toContainText('Qantara Camera');
    await expect(page.locator('#exifOut')).toContainText('<img src=x onerror=alert(1)>');
    await expect(page.locator('#exifOut img')).toHaveCount(0);
  });
}


// QR generator UI integration: verify the lazy-loaded helper receives user settings.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('QR generator invokes its helper with localized page settings in ' + locale, async ({ page }) => {
    await page.addInitScript(() => {
      window.QTExternal = {
        async loadScript() {
          window.QRCode = class {
            static CorrectLevel = { L: 1, M: 0, Q: 3, H: 2 };
            constructor(target, options) {
              window.__qrOptions = options;
              const image = document.createElement('img');
              image.alt = 'Generated QR preview';
              image.src = 'data:image/png;base64,aGVsbG8=';
              target.appendChild(image);
            }
          };
        }
      };
    });
    await page.goto(route.prefix + '/tools/qr-generator/' + route.suffix);
    await page.locator('#qrText').fill('https://qantaratools.com/');
    await page.locator('#qrSize').selectOption('400');
    await page.locator('#qrEc').selectOption('H');
    await page.locator('#qrGo').click();
    await expect(page.locator('#qrOut img')).toBeVisible();
    const options = await page.evaluate(() => window.__qrOptions);
    expect(options.text).toBe('https://qantaratools.com/');
    expect(options.width).toBe(400);
    expect(options.height).toBe(400);
    expect(options.correctLevel).toBe(2);
  });
}


// Browser-only image editing tools: verify file input, canvas output and downloads.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('Image rotate, crop, format and watermark tools process files in ' + locale, async ({ page }) => {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAIAAAB7QOjdAAAAD0lEQVR4nGP8z8DAwMAAAAYIAQHLR3Z1AAAAAElFTkSuQmCC', 'base64');
    const file = { name: 'tiny.png', mimeType: 'image/png', buffer: png };
    await page.addInitScript(() => {
      const NativeImage = window.Image;
      window.__loadedImageCount = 0;
      window.Image = function(...args) {
        const image = new NativeImage(...args);
        image.addEventListener('load', () => window.__loadedImageCount++);
        return image;
      };
      window.Image.prototype = NativeImage.prototype;
    });
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('image-rotate-flip'));
    await page.locator('#f').setInputFiles(file);
    await page.waitForFunction(() => window.__loadedImageCount > 0);
    const rotatedDownload = page.waitForEvent('download');
    await page.locator('#r90').click();
    expect((await rotatedDownload).suggestedFilename()).toBe('edited-image.png');

    await page.goto(tool('image-cropper'));
    await page.locator('#cropFile').setInputFiles(file);
    await page.waitForFunction(() => window.__loadedImageCount > 0);
    await page.locator('#cx').fill('0');
    await page.locator('#cy').fill('0');
    await page.locator('#cw').fill('1');
    await page.locator('#ch').fill('1');
    await page.locator('#cropRun').click();
    await expect(page.locator('#cropCanvas')).toHaveJSProperty('width', 1);
    await expect(page.locator('#cropCanvas')).toHaveJSProperty('height', 1);
    await expect(page.locator('#cropDown')).toBeVisible();

    await page.goto(tool('image-format'));
    await page.locator('#ifFile').setInputFiles(file);
    await expect.poll(() => page.locator('#ifPreview').evaluate(img => img.naturalWidth)).toBeGreaterThan(0);
    await page.locator('#ifRun').click();
    await expect(page.locator('#ifDownload')).toBeVisible();
    const convertedDownload = page.waitForEvent('download');
    await page.locator('#ifDownload').click();
    expect((await convertedDownload).suggestedFilename()).toBe('converted-image.png');

    await page.goto(tool('image-watermark'));
    await page.locator('#f').setInputFiles(file);
    await page.locator('#t').fill('Qantara');
    const imageLoaded = page.waitForFunction(() => window.__loadedImageCount > 0);
    const watermarkedDownload = page.waitForEvent('download');
    await page.locator('#go').click();
    await imageLoaded;
    expect((await watermarkedDownload).suggestedFilename()).toBe('watermarked-image.png');
  });
}


// Image compression and batch conversion must produce downloadable local results.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('Image compressor and batch converter work in ' + locale, async ({ page }) => {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAIAAAB7QOjdAAAAD0lEQVR4nGP8z8DAwMAAAAYIAQHLR3Z1AAAAAElFTkSuQmCC', 'base64');
    const file = { name: 'tiny.png', mimeType: 'image/png', buffer: png };
    await page.addInitScript(() => {
      const NativeImage = window.Image;
      window.__loadedImageCount = 0;
      window.Image = function(...args) {
        const image = new NativeImage(...args);
        image.addEventListener('load', () => window.__loadedImageCount++);
        return image;
      };
      window.Image.prototype = NativeImage.prototype;
    });

    await page.goto(route.prefix + '/tools/image-compressor/' + route.suffix);
    await page.locator('#imgFile').setInputFiles(file);
    await page.waitForFunction(() => window.__loadedImageCount > 0);
    await page.locator('#imgWidth').fill('1');
    await page.locator('#processImg').click();
    await expect(page.locator('#downloadImg')).toBeVisible();
    const compressedDownload = page.waitForEvent('download');
    await page.locator('#downloadImg').click();
    expect((await compressedDownload).suggestedFilename()).toBe('compressed-tiny.jpg');

    await page.goto(route.prefix + '/tools/image-batch/' + route.suffix);
    await page.locator('#f').setInputFiles([file, { ...file, name: 'tiny-2.png' }]);
    const downloads = [];
    page.on('download', download => downloads.push(download));
    await page.locator('#go').click();
    await expect.poll(() => downloads.length).toBe(2);
    expect(downloads.map(item => item.suggestedFilename()).sort()).toEqual(['converted-1.png', 'converted-2.png']);
  });
}


// Core developer and finance utilities: deterministic functional checks in all five locales.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('URL, UUID, JWT, regex, timestamp, hash, VAT and password tools work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('url-encoder'));
    await page.locator('#urlText').fill('hello world & Qantara');
    await page.locator('#urlEnc').click();
    await expect(page.locator('#urlOut')).toHaveValue('hello%20world%20%26%20Qantara');
    await page.locator('#urlText').fill('hello%20world%20%26%20Qantara');
    await page.locator('#urlDec').click();
    await expect(page.locator('#urlOut')).toHaveValue('hello world & Qantara');

    await page.goto(tool('uuid-generator'));
    await page.locator('#uuidCount').fill('3');
    await page.locator('#uuidGo').click();
    const uuids = (await page.locator('#uuidOut').inputValue()).trim().split('\n');
    expect(uuids).toHaveLength(3);
    for (const value of uuids) expect(value).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);

    await page.goto(tool('jwt-decoder'));
    const b64 = value => Buffer.from(JSON.stringify(value)).toString('base64url');
    await page.locator('#jwtIn').fill(b64({alg:'none',typ:'JWT'}) + '.' + b64({sub:'qantara',role:'tester'}) + '.signature');
    await page.locator('#jwtRun').click();
    await expect(page.locator('#jwtHead')).toContainText('"alg": "none"');
    await expect(page.locator('#jwtPay')).toContainText('"sub": "qantara"');
    await expect(page.locator('#jwtStatus')).toHaveClass(/text-amber-400/);

    await page.goto(tool('regex-tester'));
    await page.locator('#rxPat').fill('cat');
    await page.locator('#rxFlags').fill('gi');
    await page.locator('#rxText').fill('cat CAT dog');
    await page.locator('#rxRun').click();
    const foundMessage = await page.evaluate(() => window.QTI18n.t('regexFound').replace('{count}', window.QTI18n.formatNumber(2)));
    await expect(page.locator('#rxOut')).toContainText(foundMessage);

    await page.goto(tool('timestamp-converter'));
    await page.locator('#tsIn').fill('0');
    await page.locator('#tsToDate').click();
    await expect(page.locator('#tsOut')).toContainText('1970');

    await page.goto(tool('hash-generator'));
    await page.locator('#hashIn').fill('abc');
    await page.locator('#hashAlg').selectOption('SHA-256');
    await page.locator('#hashRun').click();
    await expect(page.locator('#hashOut')).toHaveValue('ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad');

    await page.goto(tool('vat-calculator'));
    await page.locator('#vatAmount').fill('100');
    await page.locator('#vatRate').fill('10');
    await page.locator('#vatGo').click();
    await expect(page.locator('#vatNet')).toHaveText(await page.evaluate(() => window.QTI18n.formatNumber(100,{minimumFractionDigits:2,maximumFractionDigits:2})));
    await expect(page.locator('#vatTax')).toHaveText(await page.evaluate(() => window.QTI18n.formatNumber(10,{minimumFractionDigits:2,maximumFractionDigits:2})));
    await expect(page.locator('#vatTotal')).toHaveText(await page.evaluate(() => window.QTI18n.formatNumber(110,{minimumFractionDigits:2,maximumFractionDigits:2})));

    await page.goto(tool('password-generator'));
    await page.locator('#pgLen').fill('24');
    await page.locator('#pgGo').click();
    const password = await page.locator('#pgOut').inputValue();
    expect(password).toHaveLength(24);
    expect(password).toMatch(/[A-Z]/);
    expect(password).toMatch(/[a-z]/);
    expect(password).toMatch(/[0-9]/);
  });
}


// Currency converter regression: currency codes must populate and conversions use the selected locale.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('Currency converter lists currencies and calculates localized results in ' + locale, async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem('qantaratools_currency_daily_rates_v2');
      const nativeFetch = window.fetch.bind(window);
      window.fetch = async (input, init) => {
        if (String(input).includes('open.er-api.com/v6/latest/USD')) {
          return new Response(JSON.stringify({
            result: 'success',
            time_last_update_utc: 'Wed, 11 Nov 2026 00:00:01 +0000',
            rates: { USD: 1, EUR: 0.9, EGP: 50, GBP: 0.8, JPY: 150 }
          }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return nativeFetch(input, init);
      };
    });
    await page.goto(route.prefix + '/tools/currency-converter/' + route.suffix);
    await expect(page.locator('#ccFrom option')).toHaveCount(5);
    await expect(page.locator('#ccFrom')).toHaveValue('EGP');
    await expect(page.locator('#ccTo')).toHaveValue('USD');
    await page.locator('#ccAmount').fill('10');
    await page.locator('#ccFrom').selectOption('USD');
    await page.locator('#ccTo').selectOption('EUR');
    await page.locator('#ccConvertBtn').click();
    const expected = await page.evaluate(() => window.QTI18n.formatNumber(9, { minimumFractionDigits: 4, maximumFractionDigits: 4 }));
    await expect(page.locator('#ccResultText')).toHaveText(expected + ' EUR');
    await expect(page.locator('#ccRateInfo')).toContainText('1 USD');
    await expect(page.locator('#ccResultArea')).toBeVisible();
  });
}


// CSV cleaner and discount/markup calculator must preserve data and format values by locale.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('CSV cleaner and discount calculator work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;
    const fmt = value => page.evaluate(n => window.QTI18n.formatNumber(n, { minimumFractionDigits: 2, maximumFractionDigits: 2 }), value);

    await page.goto(tool('csv-cleaner'));
    await page.locator('#loadSampleCsvBtn').click();
    await page.locator('#cleanCsvBtn').click();
    await expect(page.locator('#csvPreview tr')).toHaveCount(4);
    await expect(page.locator('#downloadCsvBtn')).toBeVisible();
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#downloadCsvBtn').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('cleaned-sample-data.csv');
    const stream = await download.createReadStream();
    const chunks = [];
    for await (const chunk of stream) chunks.push(chunk);
    const csv = Buffer.concat(chunks).toString('utf8');
    expect(csv).toContain('Name,Email,Age');
    expect(csv.match(/Alex,alex@example.com,31/g)).toHaveLength(1);
    expect(csv).toContain('Omar,omar@example.com,34');

    await page.goto(tool('discount-calculator'));
    await page.locator('#dcPrice').fill('200');
    await page.locator('#dcPercent').fill('25');
    await page.locator('#dcGo').click();
    await expect(page.locator('#dcMain')).toHaveText(await fmt(150));
    await expect(page.locator('#dcSub')).toHaveText(await fmt(50));
    await page.locator('input[name="dcMode"][value="markup"]').check();
    await page.locator('#dcPercent').fill('25');
    await page.locator('#dcGo').click();
    await expect(page.locator('#dcMain')).toHaveText(await fmt(250));
    await expect(page.locator('#dcSub')).toHaveText(await fmt(50));
    await page.locator('input[name="dcMode"][value="discount"]').check();
    await page.locator('#dcPercent').fill('150');
    await page.locator('#dcGo').click();
    await expect(page.locator('#dcError')).toBeVisible();
    await expect(page.locator('#dcOut')).toBeVisible();
  });
}


// Text normalization tools must preserve meaningful content and remove only selected characters.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('Text case, duplicate, RTL cleaner and Arabic fixer work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('text-case'));
    await page.locator('#caseInput').fill('Hello World 2026');
    await page.locator('#btnKebab').click();
    await expect(page.locator('#caseOutput')).toHaveValue('hello-world-2026');
    await page.locator('#btnUpper').click();
    await expect(page.locator('#caseOutput')).toHaveValue('HELLO WORLD 2026');

    await page.goto(tool('duplicate-remover'));
    await page.locator('#dupInput').fill('Apple\napple\nBanana\n\nApple');
    await page.locator('#dupCase').check();
    await page.locator('#dupGo').click();
    await expect(page.locator('#dupOut')).toHaveValue('Apple\nBanana');
    await expect(page.locator('#dupStats')).toContainText(await page.evaluate(() => window.QTI18n.formatNumber(5)));

    await page.goto(tool('rtl-cleaner'));
    await page.locator('#unicodeInput').fill('A\u200Bب\u200F C');
    await page.locator('#cleanUnicodeBtn').click();
    await expect(page.locator('#unicodeOutput')).toHaveValue('Aب C');

    await page.goto(tool('arabic-fixer'));
    await page.locator('#arabicInput').fill('Ù…Ø±Ø­Ø¨Ø§');
    await page.locator('#fixArabicBtn').click();
    await expect(page.locator('#arabicOutput')).toHaveValue('مرحبا');
  });
}


// Code and media encoders should preserve input and create valid data-URI output locally.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('Code formatter, SVG encoder and image Base64 converter work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAIAAAB7QOjdAAAAD0lEQVR4nGP8z8DAwMAAAAYIAQHLR3Z1AAAAAElFTkSuQmCC', 'base64');

    await page.goto(tool('code-formatter'));
    await page.locator('#cfType').selectOption({ label: 'HTML' });
    await page.locator('#cfIn').fill('<div><span>Hello</span></div>');
    await page.locator('#cfRun').click();
    const formatted = await page.locator('#cfOut').inputValue();
    expect(formatted).toContain('<div>');
    expect(formatted).toContain('<span>Hello</span>');
    expect(formatted).toContain('\n');

    await page.goto(tool('svg-to-css'));
    await page.locator('#svgInput').fill('<svg xmlns="http://www.w3.org/2000/svg"><rect width="1" height="1"/></svg>');
    await page.locator('#convertSvgBtn').click();
    const css = await page.locator('#svgCssOutput').inputValue();
    expect(css).toContain('background-image: url("data:image/svg+xml');
    expect(css).toContain('%3Csvg');

    await page.goto(tool('image-base64'));
    await page.locator('#b64FileInput').setInputFiles({ name: 'tiny.png', mimeType: 'image/png', buffer: png });
    await expect(page.locator('#b64ResultArea')).toBeVisible();
    await expect(page.locator('#b64Output')).toHaveValue(/^data:image/);
  });
}


// Remaining interactive text and productivity tools: verify actual transformed output and timer state.
for (const [locale, route] of Object.entries(extraFunctionalPaths)) {
  test('Fancy text, text diff and Pomodoro timer work in ' + locale, async ({ page }) => {
    const tool = slug => route.prefix + '/tools/' + slug + '/' + route.suffix;

    await page.goto(tool('fancy-text'));
    await page.locator('#fancyInput').fill('Hi');
    await page.locator('#fancySearch').fill('Bold');
    await expect(page.locator('#fancyResultsList')).toContainText('𝐇𝐢');
    await expect(page.locator('#fancyResultCount')).toContainText(await page.evaluate(() => window.QTI18n.formatNumber(5)));

    await page.goto(tool('text-diff'));
    await page.locator('#diffOriginal').fill('old\nsame');
    await page.locator('#diffModified').fill('new\nsame');
    await page.locator('#compareBtn').click();
    await expect(page.locator('#diffOutput')).toContainText('- old');
    await expect(page.locator('#diffOutput')).toContainText('+ new');
    await expect(page.locator('#diffOutput')).toContainText('same');
    const changedCount = await page.evaluate(() => window.QTI18n.formatNumber(2));
    await expect(page.locator('#diffStats')).toContainText(changedCount);

    await page.clock.install();
    await page.goto(tool('pomodoro-timer'));
    await expect(page.locator('#timerDisplay')).toHaveText('25:00');
    await page.locator('#stopwatchModeTab').click();
    await expect(page.locator('#timerDisplay')).toHaveText('00:00');
    await page.locator('#startPauseBtn').click();
    await page.clock.fastForward(2500);
    await expect(page.locator('#timerDisplay')).toHaveText('00:02');
    await page.locator('#resetBtn').click();
    await expect(page.locator('#timerDisplay')).toHaveText('00:00');
    await page.locator('#pomoModeTab').click();
    await expect(page.locator('#timerDisplay')).toHaveText('25:00');
  });
}
