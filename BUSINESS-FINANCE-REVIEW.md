# QantaraTools — Business & Finance Review

## Scope
Reviewed the five current Business & Finance tools in the QantaraTools project:

- Currency & Exchange Rate Converter
- Discount & Markup Calculator
- Loan & Mortgage Calculator
- Quick QR Code Generator
- VAT Calculator

## Fixes in this pass

### Currency & Exchange Rate Converter
- Added a request timeout and HTTP-status validation.
- Validates that all supported currencies are present in the daily rate response.
- Removed the misleading hard-coded fallback rates; if no current rate or same-day cache is available, the UI now reports that a daily rate is unavailable.
- Keeps same-day local caching.
- Shows the reference/update date in the result.
- Uses zero decimals for JPY results and four decimals for other supported currencies.

### Discount & Markup Calculator
- Markup percentages can now exceed 100% (discounts remain capped at 100%).
- Input validation distinguishes discount and markup rules.

### Quick QR Code Generator
- Clarified that the helper library is loaded only when generation is requested.
- Added a visible generating state.
- Existing external-library failure handling remains in place.

### Loan & Mortgage Calculator
- Reviewed zero-interest handling, payment calculation, amortization schedule, and CSV export.
- No calculation defect found in the current formula.

### VAT Calculator
- Reviewed add/remove VAT formulas and 0–100% validation.
- No calculation defect found in the current formula.

## Dependency / offline notes
- Currency Converter: requires a daily network request when a same-day cached rate is not available.
- QR Generator: requires its external QR helper library at generation time.
- Loan, Discount/Markup, and VAT calculations run locally.

## Syntax QA
All five Business & Finance JavaScript modules pass `node --check`.

## Status
Business & Finance is ready for practical browser testing. Do not mark it final until the five tools have been exercised in the actual QantaraTools UI, especially Currency and QR on a normal internet connection and with the network unavailable.
