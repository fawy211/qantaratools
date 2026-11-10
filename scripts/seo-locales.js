/**
 * Reviewed SEO copy for localized tool landing pages.
 *
 * Add one complete record per tool for each locale before enabling localized
 * page generation. Empty maps are intentional: the generator/QA must never
 * silently reuse English FAQs or descriptions as translated SEO content.
 *
 * Record shape:
 * {
 *   "tool-id": {
 *     "title": "Localized search title",
 *     "desc": "Localized meta description",
 *     "intro": "Localized introduction",
 *     "faq": [["Localized question", "Localized answer"], ...]
 *   }
 * }
 */
module.exports = {
  de: {},
  fr: {},
  es: {}
};
