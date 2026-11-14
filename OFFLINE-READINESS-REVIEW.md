# QantaraTools Offline Readiness Review

Review scope: `feature/complete-multilingual-support`

This is an inventory and implementation plan, not a claim that the full site is already offline-capable.

## Runtime libraries

| Resource | Version/source | Purpose | Current offline status |
|---|---|---|---|
| pdf-lib | 1.17.1, cdnjs | PDF merge, split/extract, compress/optimize, rotate and reorder | Requires a local copy |
| jsPDF | 2.5.1, cdnjs | Images to PDF | Requires a local copy |
| PDF.js | 4.10.38, cdnjs | No active tool usage confirmed in this review | Do not bundle until actual usage is found |
| QRCode.js | 1.0.0, cdnjs | QR generation | Requires a local copy |
| EXIF.js | 2.3.0, jsDelivr | Image EXIF reading | Requires a local copy |

The shared loader is `assets/js/external-resources.js`. It already handles already-loaded resources, concurrent requests, failed-load cleanup and retry behavior, but its library URLs are currently remote.

## Styles, icons and fonts

| Resource | Current source | Where found | Required action |
|---|---|---|---|
| Tailwind CSS Browser v4 | jsDelivr browser CDN | Homepage and generated tool/localized pages | Build a local static stylesheet after auditing dynamic class names |
| Font Awesome Free 6.4.0 | cdnjs | Homepage and English tool-page template | Vendor exact CSS/webfonts and license notices, or replace only after icon coverage review |
| Outfit | Google Fonts | Homepage, English tool pages and redesign CSS | Store required font files locally and retain its OFL license |
| IBM Plex Sans Arabic | Google Fonts import in `assets/css/qt-redesign.css` | Main redesign styling | Store required Arabic font files locally and retain its OFL license |
| Inter | Font-family reference in `assets/css/custom.css` | CSS fallback/reference | Confirm whether it is intentionally loaded; otherwise keep a safe system fallback |

No local WOFF/WOFF2/TTF/OTF files, `vendor` directory, or third-party license bundle were found in the repository during this review.

## Other network services

- Currency rates use `https://open.er-api.com/v6/latest/USD`. The converter caches daily rates and can reuse cached rates offline; a fresh daily update still needs a connection.
- Firebase feedback is an optional shared service, not a dependency for core local tools.
- Google AdSense is optional advertising and must not block core tool functionality.
- Analytics and consent-related remote services, if enabled, should fail without blocking local tool execution.

## Tool registry classification

The registry contains 50 tools:
- 41 marked as offline-capable.
- 8 marked as requiring an external helper library: five PDF document operations (Merge, Split, Optimize, Rotate and Reorder), Images to PDF, Quick QR Code Generator and EXIF Data Viewer.
- 1 marked as requiring a daily network update: Currency & Exchange Rate Converter.

Recently confirmed native tools:
- ASCII Art Text Generator generates its output locally.
- Text to PDF builds a local print view; the browser print dialog provides Save as PDF.

Registry metadata is not a substitute for testing every feature with external requests blocked.

## Existing offline test coverage

`tests/offline-smoke.spec.js` checks:
- Base64 and Word Counter with external requests blocked.
- Chat to Office DOCX generation without external services.
- QR, PDF and EXIF graceful failure when their remote helper cannot load.
- External helper retry after a failed first request.
- ASCII Art local text generation.
- Text to PDF local print-view creation.

The QR/PDF/EXIF tests currently verify graceful failure, not successful offline operation. They must be upgraded after local library copies are installed.

## Safe implementation sequence

1. Obtain pinned copies of required libraries and font assets from official release/package sources.
2. Verify each package's exact license file and add third-party notices. Do not infer licenses from package names alone.
3. Add local assets under `assets/vendor/` and `assets/fonts/`, using versioned filenames and source attribution.
4. Change the shared helper loader to use local files by default. Keep an online fallback only if explicitly desired.
5. Replace Tailwind Browser CDN with generated local CSS. Audit dynamic class construction first to prevent missing styles.
6. Replace remote font and icon stylesheet references with local assets.
7. Update offline tests so PDF, QR and EXIF complete their core operations with external requests blocked.
8. Run all 250 localized tool-page checks, homepage/functionality tests, offline tests and visual checks in light and dark themes.
9. Test the packaged desktop app with internet disabled.

## Release guardrails

- Do not remove a CDN reference until its local replacement is present and tested.
- Do not claim complete offline support while any core tool requires a remote library.
- Cached currency data is not a freshly updated exchange rate; always show its source/update date.
- Optional ads, analytics and shared feedback may remain unavailable offline without disabling core tools.
- Keep all work on the feature branch. Do not merge to `main` or deploy without explicit approval.
