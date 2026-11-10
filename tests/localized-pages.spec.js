const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const localizedToolList = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'tool-pages.json'), 'utf8'));

for (const locale of ['de', 'fr', 'es']) {
  test(locale + ' localized homepage lists all 50 tools', async ({ page }) => {
    await page.goto('/' + locale + '/');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('.qt-loc-related a')).toHaveCount(50);
  });

  test(locale + ' localized Base64 page loads the working tool UI', async ({ page }) => {
    await page.goto('/' + locale + '/tools/base64/');
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.locator('h1').first()).toBeVisible();
    const input = page.locator('#active-tool-box textarea').first();
    await expect(input).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#active-tool-box')).not.toContainText(/Could not load|not available yet/i);
  });
}

test('language choice persists when switching from German to English and Arabic', async ({ page }) => {
  await page.goto('/de/tools/base64/');
  await expect(page.locator('html')).toHaveAttribute('lang', 'de');
  await page.locator('[data-locale-link="en"]').click();
  await expect(page).toHaveURL(/\/tools\/base64\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  expect(await page.evaluate(() => localStorage.getItem('qantaratools_language_v1'))).toBe('en');

  await page.locator('[data-locale-link="ar"]').click();
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
    await page.goto(expected.path);
    await page.waitForFunction(() => window.QTI18n && typeof window.QTI18n.setLocale === 'function');
    await page.evaluate(localeCode => window.QTI18n.setLocale(localeCode), locale);
    await page.evaluate(() => window.loadAiToOfficeTool());
    const source = 'User: Keep this exact text — Café & <tag> 123\nAssistant: Original answer stays unchanged: naïve & useful.';
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
    expect(wordXml).toContain(expected.user);
    expect(wordXml).toContain(expected.assistant);
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
    expect(sheet).toContain(expected.speaker);
    expect(sheet).toContain(expected.message);
    expect(sheet).toContain(expected.user);
    expect(sheet).toContain(expected.assistant);
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
    await popup.close();
  });
}


for (const locale of ['de', 'fr', 'es']) {
  test.setTimeout(180000);
  test(locale + ' all 50 localized tool pages load their actual tool modules', async ({ page }) => {
    for (const tool of localizedToolList) {
      await page.goto('/' + locale + '/tools/' + tool.id + '/');
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await page.waitForFunction(() => {
        const box = document.getElementById('active-tool-box');
        return !!box && box.children.length > 0 && !/Loading tool/i.test(box.textContent || '');
      }, { timeout: 15000 });
      await expect(page.locator('#active-tool-box')).not.toContainText(/Could not load this tool|This tool is not available yet|Loading tool/i);
    }
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
