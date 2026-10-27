# Theme consistency

One saved theme choice now controls the homepage, every tool, the rating box, the request dialog, all 50 tool pages, and About, FAQ, Contact, Privacy, and Terms.

- `assets/js/theme.js`: shared theme engine (applies the saved choice before the page paints, powers every theme button, syncs open tabs, updates the browser theme color).
- `assets/css/theme-light.css`: light palette for tool panels, inputs, tables, buttons, ratings, dialog, footer, and static pages. Dark mode keeps the existing dark design.
- Every page has one theme button. FAQ, Contact, and the tool pages got one; the old per-page toggle scripts were removed.
- FAQ and Contact were loading Tailwind incorrectly; they now use the same Tailwind loader as the homepage.

After adding new tool pages, run `npm run generate:tool-pages` so the pages include the theme files.
