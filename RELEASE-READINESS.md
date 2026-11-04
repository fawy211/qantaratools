# QantaraTools Release Readiness

This package contains the submitted 50-tool project plus runnable Playwright QA, safer localStorage rendering, repaired catalog smoke coverage, and a deployment checklist.

Before release:

```bash
npm install
npx playwright install chromium
npm run qa
```

Manual checks remain required for CDN-backed PDF, QR, EXIF, and Currency tools with network success and failure.
