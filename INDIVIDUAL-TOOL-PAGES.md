# Individual tool pages

The project now has a dedicated, static, indexable URL for each catalog tool under `/tools/<tool-id>/`. Every page has a self-referencing canonical URL, unique title and description, Open Graph metadata, WebApplication structured data, crawlable explanatory content, and automatically loads the matching interactive tool. Homepage tool titles link to these pages.

## Keep the pages current

1. Update `tool-pages.json` when the tool catalog changes.
2. Run `npm run generate:tool-pages`. This generates the pages and updates `sitemap.xml`.
3. Deploy the project root to the existing Vercel site.
4. Submit `https://qantaratools.com/sitemap.xml` in Google Search Console.

The public URL list is in `TOOL-URLS.md`. Google controls crawling and indexing timing; URLs in a sitemap are not guaranteed to be indexed or rank for a query.
