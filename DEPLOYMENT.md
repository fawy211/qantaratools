# QantaraTools deployment notes

The site is a static website. Publish the project root, including `index.html`, `privacy.html`, `terms.html`, `contact.html`, `faq.html`, `robots.txt`, `sitemap.xml`, `assets/`, `tools/`, and `plugins/`.

Set the production domain to `https://qantaratools.com` or update the canonical URLs, robots sitemap URL, and `sitemap.xml` before using another domain. Apply the headers in `_headers` through the host, or configure equivalent headers in the host dashboard. Do not deploy `node_modules`, `test-results`, `playwright-report`, or `tools.rar`.

Before publishing:

```bash
npm install
npx playwright install chromium
npm run qa
```

The policy pages describe the current 50-tool release: local-first behavior where supported, external CDN/live-rate exceptions, browser storage, no intentionally integrated intrusive advertising SDKs, and plugin behavior.

Google Analytics 4 is configured with measurement ID G-0CKBXQ6WXX. Confirm the Google Analytics property receives data after deployment and make sure your consent/legal setup matches your target audience and jurisdiction.

Central ratings require Firebase Anonymous Authentication to be enabled and `firestore.rules` deployed. See `FIREBASE_FEEDBACK_SETUP.md`; ratings will remain unavailable until those console steps are completed.
