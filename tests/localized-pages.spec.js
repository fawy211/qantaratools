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
