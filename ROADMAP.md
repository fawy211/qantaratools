# QantaraTools Development Roadmap

## Completed in current build
- Phase A: UX and quality improvements for core utility tools.
- Phase B: functional upgrades for JSON, CSV, images, diff, Base64 and currency.
- Phase C: upgrades for loan, QR, image metadata, ASCII, gradients, password and Unicode cleanup.
- Phase D1: remaining utility upgrades plus a local Tool Request workflow and shared tool metadata registry.

## Deferred to final pass
- Chat to Office File Converter: final quality pass and full browser testing.
- Full cross-browser testing (Chrome, Firefox, Edge).
- Full mobile/responsive test pass.
- SEO/content pass.
- Consolidation of external CDN dependencies where practical.
- Desktop application packaging and update manifest.

## New tools added — current build
- URL Encoder & Decoder
- JWT Decoder
- Regex Tester
- Timestamp Converter
- Hash Generator
- JSON ↔ CSV Converter
- SQL Formatter
- HTML / CSS / JavaScript Formatter
- Image Format Converter
- Image Cropper
- Text Sorter
- Lorem Ipsum Generator
- Markdown to HTML

PDF merge/split/compress/OCR remain a dedicated next-stage module because a fully local browser implementation needs a proper PDF processing engine rather than a simulated download.

## PDF & Image expansion
- Added PDF Merge, Split/Page Extractor, Optimizer, Page Rotator, Page Reorder, Images to PDF, and Text to PDF.
- Added Image Rotate & Flip, Batch Image Converter, and Image Watermark.
- Note: PDF tools load their processing libraries from public CDNs; user files are processed in-browser and are not uploaded by the tools.


## Remaining project work - updated 2026-09-27

- [x] Central Tool Registry metadata expanded for the current tool set.
- [x] Search UX improved with result count and `/` keyboard focus.
- [x] Favorites stored locally on the user's device.
- [x] Recently used tools stored locally.
- [x] Request a Tool stores requests locally.
- [x] Basic SEO metadata added to the main page.
- [x] Privacy and Terms updated to describe local storage and third-party resources accurately.
- [x] Mobile layout reviewed at the structure level using responsive Tailwind classes.
- [ ] Replace or self-host CDN assets for a stronger offline experience.
- [ ] Final manual browser testing on desktop and mobile.
- [ ] Final review of every tool's error handling and edge cases.
- [ ] Finalize Chat to Office Converter.
- [ ] Prepare beta release package.

## Visual & UX Pass — September 2026
- Added category navigation chips and category filtering.
- Improved search presentation and keyboard shortcut hint.
- Standardized tool-card height, spacing, hover/focus treatment, and responsive behavior.
- Added a clearer toolkit section intro and visual hierarchy.
- Ensured PDF and newly added media cards are grouped into their correct category sections at runtime.
- Improved hero copy so privacy claims match the current architecture more accurately.

## Dependency Hardening
- Centralized PDF helper-library loading in `assets/js/external-resources.js`.
- Added consistent connection/error handling for PDF helper libraries.
- Added preconnect hints for the existing CDN resources to reduce first-load delay.
- Third-party CDN resources are still external in this phase; replacing them with local vendor copies requires bundling the actual library files and is reserved for the final packaging pass.

## Final UI polish — September 2026
- Added structured WebSite metadata for search engines.
- Added skip navigation and visible keyboard focus states.
- Improved search updates to respond while typing.
- Added reduced-motion support and theme metadata.
- Kept the current 50-tool catalog and existing routing intact.
