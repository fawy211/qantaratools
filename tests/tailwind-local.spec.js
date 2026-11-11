const { test, expect } = require('@playwright/test');

async function blockExternalRequests(page) {
  await page.route('**/*', async route => {
    const url = new URL(route.request().url());
    if (url.hostname === '127.0.0.1' || url.hostname === 'localhost') {
      await route.continue();
      return;
    }
    await route.abort('internetdisconnected');
  });
}

test('Tailwind utility styles load from the local compiled stylesheet with internet blocked', async ({ page }) => {
  await blockExternalRequests(page);
  const cssResponse = page.waitForResponse(response =>
    response.url().includes('/assets/css/tailwind-local.css') && response.status() === 200
  );
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await cssResponse;
  await expect(page.locator('script[data-qt-tailwind="cdn-fallback"]')).toHaveCount(0);
  const cssText = await page.evaluate(async () => {
    const response = await fetch('/assets/css/tailwind-local.css');
    return response.text();
  });
  expect(cssText).toContain('.bg-slate-950');
  expect(cssText).toContain('.flex');
});

test('Tailwind CDN runtime is requested only when the local stylesheet fails', async ({ page }) => {
  await page.route('**/assets/css/tailwind-local.css', route => route.abort('failed'));
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  const fallback = page.locator('script[data-qt-tailwind="cdn-fallback"]');
  await expect(fallback).toHaveCount(1);
  await expect(fallback).toHaveAttribute('src', /cdn\.jsdelivr\.net\/npm\/@tailwindcss\/browser@4\.1\.17/);
});
