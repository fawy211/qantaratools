# SEO and accessibility fixes

- Corrected homepage title/heading hierarchy, aligned Open Graph title, and removed hreflang declarations that incorrectly mapped every page to the homepage.
- Added visible-on-focus skip links, semantic site navigation on static routes, focus styling, and main-content focus targets.
- Added explicit labels to homepage search and request form fields, accessible dialog metadata, focus management, Escape handling, and keyboard focus trapping.
- Added keyboard activation and accessible names to the clickable tool cards; tool loading now updates the document title, announces loading, transfers focus into the selected tool, and returns focus to its card when closed.
- Added a shared fallback accessibility layer for dynamically-rendered legacy tool controls, images, and result/status regions.
- Replaced plain FAQ question divs with heading elements, added accessible labels for legacy controls through the shared support module, and fixed a missing image alt attribute.
- Added theme-color metadata to static routes, corrected privacy policy section numbering, and updated inaccurate homepage privacy wording.

## Validation

All public HTML pages parsed successfully; each has a unique title, description, canonical URL, language, one H1, main landmark, and skip link. Static links/assets, duplicate IDs, image alts, and static form labels were checked. All JavaScript files pass `node --check`. This is not a substitute for live Lighthouse/axe, keyboard, screen-reader, or contrast testing.
