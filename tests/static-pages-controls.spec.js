const { test, expect } = require('@playwright/test');

const slugs = ['about-us', 'contact', 'faq', 'privacy', 'terms'];
const locales = ['en', 'ar', 'de', 'fr', 'es'];

function pagePath(locale, slug) {
  if (locale === 'de' || locale === 'fr' || locale === 'es') return '/' + locale + '/' + slug + '/';
  return '/' + slug + '.html' + (locale === 'ar' ? '?locale=ar' : '');
}

for (const locale of locales) {
  for (const slug of slugs) {
    test(locale + ' ' + slug + ' page has working shared controls and layout', async ({ page }) => {
      await page.goto(pagePath(locale, slug));
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');

      const selector = page.locator('.qt-language-select');
      await expect(selector).toBeVisible();
      await expect(selector.locator('option')).toHaveCount(5);
      await expect(selector).toHaveValue(locale);

      const theme = page.locator('[data-theme-toggle]').first();
      await expect(theme).toBeVisible();
      const themeLabels = {
        en: ['Switch to light mode', 'Switch to dark mode'],
        ar: ['التبديل إلى الوضع الفاتح', 'التبديل إلى الوضع الداكن'],
        de: ['Zum hellen Modus wechseln', 'Zum dunklen Modus wechseln'],
        fr: ['Passer au mode clair', 'Passer au mode sombre'],
        es: ['Cambiar al modo claro', 'Cambiar al modo oscuro']
      };
      await expect(theme).toHaveAttribute('aria-label', new RegExp(themeLabels[locale].join('|')));
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('main').first()).toBeVisible();
      await expect(page.locator('link[rel="stylesheet"][href*="theme-light.css"]')).toHaveCount(1);

      const before = await page.evaluate(() => localStorage.getItem('theme'));
      await theme.click();
      const after = await page.evaluate(() => localStorage.getItem('theme'));
      expect(after).not.toBe(before);
      await expect(page.locator('[data-theme-toggle]').first()).toBeVisible();

      // The shared theme choice survives navigation/reload on informational pages.
      await page.reload();
      expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(after);
      await expect(page.locator('[data-theme-toggle]').first()).toBeVisible();
    });
  }
}

test('static-page language selector keeps the same page while changing locale', async ({ page }) => {
  await page.goto('/de/faq/');
  await page.locator('.qt-language-select').selectOption('fr');
  await expect(page).toHaveURL(/\/fr\/faq\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

  await page.locator('.qt-language-select').selectOption('en');
  await expect(page).toHaveURL(/\/faq\.html$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');

  await page.locator('.qt-language-select').selectOption('ar');
  await expect(page).toHaveURL(/\/faq\.html\?locale=ar$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('Arabic information and legal pages apply RTL and Arabic content', async ({ page }) => {
  const expected = {
    'about-us': 'عن قنطرة تولز',
    contact: 'اتصل بنا',
    faq: 'الأسئلة الشائعة',
    privacy: 'سياسة الخصوصية',
    terms: 'شروط الاستخدام'
  };
  for (const slug of slugs) {
    await page.goto(pagePath('ar', slug));
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('body')).toContainText(expected[slug]);
    await expect(page.locator('.qt-language-select')).toHaveValue('ar');
  }
});

test('localized legal and information pages remain usable on a narrow mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  for (const locale of locales) {
    for (const slug of slugs) {
      await page.goto(pagePath(locale, slug));
      await expect(page.locator('.qt-language-select')).toBeVisible();
      await expect(page.locator('[data-theme-toggle]').first()).toBeVisible();
      await expect(page.locator('h1').first()).toBeVisible();
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2);
      expect(overflow, locale + '/' + slug + ' should not overflow horizontally on mobile').toBeFalsy();
    }
  }
});

test('all information and legal pages have working canonical routes and localized navigation', async ({ page }) => {
  const expectedTitles = {
    en: ['About QantaraTools', 'Contact Us', 'Frequently Asked Questions', 'Privacy Policy', 'Terms of Service'],
    ar: ['من نحن', 'اتصل بنا', 'الأسئلة الشائعة', 'سياسة الخصوصية', 'شروط الاستخدام'],
    de: ['Über QantaraTools', 'Kontakt', 'Häufig gestellte Fragen', 'Datenschutzerklärung', 'Nutzungsbedingungen'],
    fr: ['À propos de QantaraTools', 'Contact', 'Foire aux questions', 'Politique de confidentialité', 'Conditions d’utilisation'],
    es: ['Acerca de QantaraTools', 'Contacto', 'Preguntas frecuentes', 'Política de privacidad', 'Términos del servicio']
  };
  const exactHeadings = {
    en: { contact: 'Contact Us', faq: 'Frequently Asked Questions', privacy: 'Privacy Policy', terms: 'Terms of Service' },
    ar: { contact: 'اتصل بنا', faq: 'الأسئلة الشائعة', privacy: 'سياسة الخصوصية', terms: 'شروط الاستخدام' },
    de: { contact: 'Kontaktieren Sie uns', faq: 'Häufig gestellte Fragen', privacy: 'Datenschutzerklärung', terms: 'Nutzungsbedingungen' },
    fr: { contact: 'Nous contacter', faq: 'Foire aux questions', privacy: 'Politique de confidentialité', terms: 'Conditions d’utilisation' },
    es: { contact: 'Contacto', faq: 'Preguntas frecuentes', privacy: 'Política de privacidad', terms: 'Términos del servicio' }
  };
  for (const locale of locales) {
    for (let i = 0; i < slugs.length; i++) {
      const response = await page.goto(pagePath(locale, slugs[i]));
      expect(response && response.status(), locale + '/' + slugs[i] + ' HTTP response').toBe(200);
      await expect(page.locator('h1').first()).toBeVisible();
      await expect(page.locator('body')).toContainText(expectedTitles[locale][i]);
      if (i > 0) await expect(page.locator('h1').first()).toHaveText(exactHeadings[locale][slugs[i]]);
      if (locale !== 'en' && locale !== 'ar') {
        const visibleText = await page.locator('body').innerText();
        expect(visibleText).not.toContain('Contactoo');
        expect(visibleText).not.toContain('Do not email passwords, private keys, or confidential files.');
      }
      const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
      if (locale === 'de' || locale === 'fr' || locale === 'es') {
        expect(canonical).toBe('https://www.qantaratools.com/' + locale + '/' + slugs[i] + '/');
      } else if (locale === 'en') {
        expect(canonical).toBe('https://www.qantaratools.com/' + slugs[i] + '.html');
      }
      const links = page.locator('header a');
      await expect(links.filter({ hasText: /FAQ|الأسئلة الشائعة|Häufig gestellte Fragen|Foire aux questions|Preguntas frecuentes/ }).first()).toBeVisible();
      await expect(links.filter({ hasText: /Contact|اتصل بنا|Kontakt|Contacto/ }).first()).toBeVisible();
    }
  }
});

test('language switching works in both directions for every static page', async ({ page }) => {
  for (const slug of slugs) {
    await page.goto('/' + slug + '.html');
    await page.locator('.qt-language-select').selectOption('de');
    await expect(page).toHaveURL(new RegExp('/de/' + slug + '/$'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'de');

    await page.locator('.qt-language-select').selectOption('fr');
    await expect(page).toHaveURL(new RegExp('/fr/' + slug + '/$'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'fr');

    await page.locator('.qt-language-select').selectOption('es');
    await expect(page).toHaveURL(new RegExp('/es/' + slug + '/$'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'es');

    await page.locator('.qt-language-select').selectOption('ar');
    await expect(page).toHaveURL(new RegExp('/' + slug + '\\.html\\?locale=ar$'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'ar');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    await page.locator('.qt-language-select').selectOption('en');
    await expect(page).toHaveURL(new RegExp('/' + slug + '\\.html$'));
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  }
});
