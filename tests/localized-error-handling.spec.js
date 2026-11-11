const { test, expect } = require('@playwright/test');

const errorLocales = {
  en: {
    prefix: '', suffix: '',
    json: 'Invalid JSON: ',
    discount: 'A discount cannot be greater than 100%.',
    pdf: 'This does not look like a valid PDF file.'
  },
  ar: {
    prefix: '', suffix: '?locale=ar',
    json: 'JSON غير صالح: ',
    discount: 'لا يمكن أن يتجاوز الخصم 100%.',
    pdf: 'هذا الملف لا يبدو أنه ملف PDF صالح.'
  },
  de: {
    prefix: '/de', suffix: '',
    json: 'Ungültiges JSON: ',
    discount: 'Ein Rabatt darf nicht höher als 100 % sein.',
    pdf: 'Dies scheint keine gültige PDF-Datei zu sein.'
  },
  fr: {
    prefix: '/fr', suffix: '',
    json: 'JSON invalide : ',
    discount: 'Une remise ne peut pas dépasser 100 %.',
    pdf: 'Ce fichier ne semble pas être un PDF valide.'
  },
  es: {
    prefix: '/es', suffix: '',
    json: 'JSON no válido: ',
    discount: 'El descuento no puede superar el 100 %.',
    pdf: 'El archivo no parece ser un PDF válido.'
  }
};

for (const [locale, expected] of Object.entries(errorLocales)) {
  test('invalid input errors are visible and localized for ' + locale, async ({ page }) => {
    test.setTimeout(60000);
    const tool = slug => expected.prefix + '/tools/' + slug + '/' + expected.suffix;

    // Invalid JSON must show the localized error prefix, not a success state.
    await page.goto(tool('json-formatter'));
    await expect(page.locator('#jsonInput')).toBeVisible();
    await page.locator('#jsonInput').fill('{"name":');
    await page.locator('#formatBtn').click();
    const jsonStatus = page.locator('#jsonStatus');
    await expect(jsonStatus).toHaveClass(/text-red-400/);
    await expect(jsonStatus).toContainText(expected.json);
    expect(await jsonStatus.textContent()).toMatch(new RegExp('^' + expected.json.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));

    // A discount above 100% must be rejected with the translated validation message.
    await page.goto(tool('discount-calculator'));
    await expect(page.locator('#dcPrice')).toBeVisible();
    await page.locator('#dcPrice').fill('100');
    await page.locator('#dcPercent').fill('150');
    await page.locator('#dcGo').click();
    const discountError = page.locator('#dcError');
    await expect(discountError).toBeVisible();
    await expect(discountError).toHaveText(expected.discount);
    await expect(page.locator('#dcOut')).toBeHidden();

    // A corrupt PDF must produce the localized friendly error without crashing the tool.
    await page.goto(tool('pdf-split'));
    await page.locator('[data-pdf-files]').setInputFiles({
      name: 'not-a-real-pdf.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('This is not a PDF document.')
    });
    await page.locator('#pages').fill('1');
    await page.locator('#go').click();
    const pdfMessage = page.locator('[data-pdf-msg]');
    await expect(pdfMessage).toHaveText(expected.pdf, { timeout: 15000 });
    await expect(page.locator('#go')).toBeEnabled();
  });
}
