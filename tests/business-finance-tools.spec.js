const { test, expect } = require('@playwright/test');

const routes = {
  en: { data: '/tools/data-analyzer/', finance: '/tools/financial-statements/' },
  ar: { data: '/tools/data-analyzer/?locale=ar', finance: '/tools/financial-statements/?locale=ar' },
  de: { data: '/de/tools/data-analyzer/', finance: '/de/tools/financial-statements/' },
  fr: { data: '/fr/tools/data-analyzer/', finance: '/fr/tools/financial-statements/' },
  es: { data: '/es/tools/data-analyzer/', finance: '/es/tools/financial-statements/' }
};

test.describe('Data Analyzer & Splitter', () => {
  test('loads sample data, searches, cleans duplicates and exports CSV', async ({ page }) => {
    await page.goto(routes.en.data);
    await expect(page.locator('#daSample')).toBeVisible();
    await page.locator('#daSample').click();
    await expect(page.locator('#daTable tbody tr')).toHaveCount(5);

    await page.locator('#daSearch').fill('Alex');
    await expect(page.locator('#daTable tbody tr')).toHaveCount(2);
    await page.locator('#daSearch').fill('');

    await page.locator('#daDupes').check();
    await page.locator('#daApply').click();
    await expect(page.locator('#daTable tbody tr')).toHaveCount(4);

    const downloadPromise = page.waitForEvent('download');
    await page.locator('#daCSV').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.csv$/);
  });

  test('imports a CSV with quoted commas and exports filtered JSON', async ({ page }) => {
    await page.goto(routes.en.data);
    await page.locator('#daFile').setInputFiles({
      name: 'quoted.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('Name,Note,Amount\nAlex,"North, West",12\nSara,South,8\n')
    });
    await expect(page.locator('#daTable tbody tr')).toHaveCount(2);
    await expect(page.locator('#daTable')).toContainText('North, West');
    await page.locator('#daSearch').fill('Alex');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#daJSON').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toMatch(/\.json$/);
  });

  test('renders localized labels for all supported languages', async ({ page }) => {
    for (const locale of Object.keys(routes)) {
      await page.goto(routes[locale].data);
      await expect(page.locator('#active-tool-box')).toContainText(
        ({ en: 'Data Analyzer & Splitter', ar: 'محلل ومقسم البيانات', de: 'Datenanalyse & Aufteilung', fr: 'Analyseur et séparateur de données', es: 'Analizador y separador de datos' })[locale]
      );
      await page.locator('#daSample').click();
      await expect(page.locator('#daTable tbody tr')).toHaveCount(5);
    }
  });
});

test.describe('Financial Statements Generator', () => {
  test('generates a balanced manual income statement and balance sheet', async ({ page }) => {
    await page.goto(routes.en.finance);
    const values = {
      revenue: '1000', cogs: '300', opex: '100', otherIncome: '0', otherExpense: '0',
      currentAssets: '1000', noncurrentAssets: '0', currentLiabilities: '200',
      noncurrentLiabilities: '0', equity: '200', openingCash: '100',
      closingCash: '700', operatingCash: '600', investingCash: '0', financingCash: '0'
    };
    for (const [key, value] of Object.entries(values)) {
      await page.locator('[data-field="' + key + '"]').fill(value);
    }
    await page.locator('#fsPeriod').fill('FY 2026');
    await page.locator('#fsGenerate').click();
    await expect(page.locator('#fsOutput')).toBeVisible();
    await expect(page.locator('#fsOutput')).toContainText('600');
    await expect(page.locator('#fsOutput')).toContainText('Balanced');
    const downloadPromise = page.waitForEvent('download');
    await page.locator('#fsDownload').click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('financial-statements.csv');
  });

  test('imports and classifies a trial balance before generating reports', async ({ page }) => {
    await page.goto(routes.en.finance);
    await page.locator('#fsImport').click();
    await page.locator('#fsFile').setInputFiles({
      name: 'trial-balance.csv',
      mimeType: 'text/csv',
      buffer: Buffer.from('Account,Debit,Credit\nCash,1000,0\nAccounts Payable,0,200\nOwner Equity,0,200\nSales,0,1000\nCost of Sales,300,0\nOperating Expense,100,0\n')
    });
    await expect(page.locator('#fsAccounts select[data-account]')).toHaveCount(6);
    const categories = ['current_asset', 'current_liability', 'equity', 'revenue', 'cost_of_sales', 'expense'];
    for (let i = 0; i < categories.length; i++) {
      await page.locator('[data-account="' + i + '"]').selectOption(categories[i]);
    }
    await page.locator('#fsGenerate').click();
    await expect(page.locator('#fsOutput')).toBeVisible();
    await expect(page.locator('#fsOutput')).toContainText('Balanced');
    await expect(page.locator('#fsOutput')).toContainText('600');
  });

  test('shows translated interface labels for all supported languages', async ({ page }) => {
    const titles = {
      en: 'Financial Statements Generator',
      ar: 'منشئ القوائم المالية',
      de: 'Finanzbericht-Generator',
      fr: 'Générateur d’états financiers',
      es: 'Generador de estados financieros'
    };
    for (const locale of Object.keys(routes)) {
      await page.goto(routes[locale].finance);
      await expect(page.locator('#active-tool-box')).toContainText(titles[locale]);
      await expect(page.locator('#fsGenerate')).toBeVisible();
    }
  });
});
