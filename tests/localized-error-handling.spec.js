const { test, expect } = require('@playwright/test');

const errorLocales = {
  en: {
    loan: "Enter valid loan details.",
    vat: "Enter a valid amount and VAT rate from 0 to 100.",
    csv: "Please choose or load a CSV file first.",
    jc: "Use a JSON array of objects.",
    prefix: '', suffix: '',
    json: 'Invalid JSON: ',
    discount: 'A discount cannot be greater than 100%.',
    pdf: 'This does not look like a valid PDF file.
    imageLoad: "The image could not be loaded. Choose a valid image file.",
    imageInvalid: "Please choose a valid image file.",'
  },
  ar: {
    loan: "أدخل بيانات قرض صحيحة.",
    vat: "أدخل مبلغًا ونسبة ضريبة صحيحة من 0 إلى 100.",
    csv: "اختر ملف CSV أو حمّله أولًا.",
    jc: "استخدم مصفوفة JSON تحتوي على كائنات.",
    prefix: '', suffix: '?locale=ar',
    json: 'JSON غير صالح: ',
    discount: 'لا يمكن أن يتجاوز الخصم 100%.',
    pdf: 'هذا الملف لا يبدو أنه ملف PDF صالح.
    imageLoad: "تعذر تحميل الصورة. اختر ملف صورة صالحًا.",
    imageInvalid: "يرجى اختيار ملف صورة صالح.",'
  },
  de: {
    loan: "Bitte gib gültige Kreditdaten ein.",
    vat: "Bitte gib einen gültigen Betrag und einen Steuersatz von 0 bis 100 ein.",
    csv: "Bitte wähle zuerst eine CSV-Datei aus oder lade ein Beispiel.",
    jc: "Verwende ein JSON-Array aus Objekten.",
    prefix: '/de', suffix: '',
    json: 'Ungültiges JSON: ',
    discount: 'Ein Rabatt darf nicht höher als 100 % sein.',
    pdf: 'Dies scheint keine gültige PDF-Datei zu sein.
    imageLoad: "Das Bild konnte nicht geladen werden. Wähle eine gültige Bilddatei aus.",
    imageInvalid: "Bitte wähle eine gültige Bilddatei aus.",'
  },
  fr: {
    loan: "Veuillez saisir des informations de prêt valides.",
    vat: "Saisissez un montant et un taux de TVA valides entre 0 et 100.",
    csv: "Veuillez d’abord choisir ou charger un fichier CSV.",
    jc: "Utilisez un tableau JSON d’objets.",
    prefix: '/fr', suffix: '',
    json: 'JSON invalide : ',
    discount: 'Une remise ne peut pas dépasser 100 %.',
    pdf: 'Ce fichier ne semble pas être un PDF valide.
    imageLoad: "Impossible de charger l’image. Choisissez un fichier image valide.",
    imageInvalid: "Veuillez choisir un fichier image valide.",'
  },
  es: {
    loan: "Introduce datos válidos del préstamo.",
    vat: "Introduce una cantidad y un tipo de IVA válidos entre 0 y 100.",
    csv: "Primero elige o carga un archivo CSV.",
    jc: "Usa una matriz JSON de objetos.",
    prefix: '/es', suffix: '',
    json: 'JSON no válido: ',
    discount: 'El descuento no puede superar el 100 %.',
    pdf: 'El archivo no parece ser un PDF válido.'
    imageLoad: "No se pudo cargar la imagen. Selecciona un archivo de imagen válido.",
    imageInvalid: "Selecciona un archivo de imagen válido.",
  }
};

for (const [locale, expected] of Object.entries(errorLocales)) {
  test('invalid input errors are visible and localized for ' + locale, async ({ page }) => {
    test.setTimeout(60000);

    // Keep the unrelated analytics-consent overlay from intercepting tool clicks.
    // Consent behavior is covered separately; this suite focuses on tool validation.
    await page.addInitScript(() => {
      const hideConsent = () => {
        const banner = document.getElementById('qt-consent-banner');
        if (banner) banner.style.setProperty('display', 'none', 'important');
      };
      new MutationObserver(hideConsent).observe(document, { childList: true, subtree: true });
      hideConsent();
    });

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

    // Loan calculator must reject a zero principal and expose the localized validation alert.
    await page.goto(tool('loan-calculator'));
    await page.locator('#loanAmount').fill('0');
    const loanDialogPromise = page.waitForEvent('dialog');
    await page.locator('#loanGo').click();
    const loanDialog = await loanDialogPromise;
    expect(loanDialog.message()).toBe(expected.loan);
    await loanDialog.accept();

    // VAT calculator must reject a negative amount with a localized alert.
    await page.goto(tool('vat-calculator'));
    await page.locator('#vatAmount').fill('-1');
    const vatDialogPromise = page.waitForEvent('dialog');
    await page.locator('#vatGo').click();
    const vatDialog = await vatDialogPromise;
    expect(vatDialog.message()).toBe(expected.vat);
    await vatDialog.accept();

    // CSV cleaner must explain that a file is required before processing.
    await page.goto(tool('csv-cleaner'));
    await page.locator('#cleanCsvBtn').click();
    await expect(page.locator('#csvStats')).toHaveText(expected.csv);

    // JSON-to-CSV must reject a valid JSON value that is not an array of objects.
    await page.goto(tool('json-csv'));
    await page.locator('#jcIn').fill('{"name":"Alex"}');
    await page.locator('#jcJson').click();
    await expect(page.locator('#jcStatus')).toHaveText(expected.jc);
    await expect(page.locator('#jcOut')).toHaveValue('');

    // Corrupt image files must be rejected with localized errors in all three image tools.
    await page.goto(tool('image-format'));
    await page.locator('#ifFile').setInputFiles({
      name: 'broken-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('not an image')
    });
    await expect(page.locator('#ifStatus')).toHaveText(expected.imageLoad, { timeout: 10000 });
    await page.goto(tool('image-compressor'));
    await page.locator('#imgFile').setInputFiles({
      name: 'broken-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('not an image')
    });
    await expect(page.locator('#imgStats')).toHaveText(expected.imageLoad, { timeout: 10000 });
    await page.goto(tool('image-cropper'));
    await page.locator('#cropFile').setInputFiles({
      name: 'broken-image.png',
      mimeType: 'image/png',
      buffer: Buffer.from('not an image')
    });
    await expect(page.locator('#cropStatus')).toHaveText(expected.imageLoad, { timeout: 10000 });
  });
}
