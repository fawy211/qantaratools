// Unique SEO copy per tool. Keys are tool ids from tool-pages.json.
// title: short keyword-focused title (the site name is appended automatically)
// desc:  meta description (<= 155 characters)
// intro: first paragraph shown under the H1
// faq:   [question, answer] pairs shown on the page and in FAQPage JSON-LD
module.exports = {
  'base64': { title: "Base64 Encoder & Decoder: Text and Files Online", desc: "Encode text or files to Base64 and decode Base64 strings in your browser. Free Base64 converter for developers and data URLs.",
    intro: "Encode text or files as Base64, or decode a Base64 string back to its original content. Useful for data URLs, API payloads and development tasks.",
    
    faq: [['What is Base64 used for?', 'Base64 represents binary data as plain ASCII text, so it can travel safely through systems that only handle text, such as JSON, HTML, email and URLs.'], ['Is Base64 encryption?', 'No. Base64 is an encoding, not encryption. Anyone can decode it, so never use it to protect passwords or secrets.']] },
  'color-converter': { title: "HEX to RGB, HSL & CMYK Color Converter", desc: "Convert color values between HEX, RGB, HSL and CMYK. Free online color converter for CSS, web design and print workflows.",
    intro: "Convert a color between HEX, RGB, HSL and CMYK formats. Check values for CSS, digital design and print projects in one place.",
    
    faq: [['What is the difference between RGB and CMYK?', 'RGB mixes light and is used for screens, while CMYK mixes ink and is used for print. Converted values are close approximations because the two color spaces cover different ranges.'], ['How do I convert HEX to RGB?', 'Enter the HEX code, for example #1E90FF, and the tool shows the matching RGB, HSL and CMYK values you can copy.']] },
  'csv-cleaner': { title: "CSV Cleaner: Clean & Format CSV Data Online", desc: "Clean CSV files by trimming extra whitespace and formatting rows in your browser. Prepare spreadsheet exports for import.",
    intro: "Clean up CSV data before importing it into a spreadsheet or database. Remove unwanted whitespace and make rows more consistent in your browser.",
    
    faq: [['What problems can a CSV cleaner fix?', 'Typical issues are extra spaces around values, inconsistent formatting and untidy rows that cause import errors in spreadsheets and databases.'], ['Is my CSV file uploaded to a server?', 'The tool is designed to clean CSV files inside your browser. See the Privacy Policy for how each tool handles data.']] },
  'html-entity': { title: "HTML Entity Encoder & Decoder: Escape HTML Online", desc: "Encode special characters as HTML entities or decode entities into readable text. Free HTML escape tool for developers.",
    intro: "Convert special characters to HTML entities so they display as text, or decode HTML entities back into readable characters. Helpful when preparing snippets and debugging markup.",
    
    faq: [['Why encode HTML entities?', 'Encoding stops the browser from treating characters like < and & as markup, which prevents broken layouts and helps reduce cross-site scripting risks.'], ['Which characters need escaping in HTML?', 'At minimum the ampersand, less-than, greater-than and quote characters, depending on where the text is placed in the document.']] },
  'json-formatter': { title: "JSON Formatter & Validator: Beautify JSON Online", desc: "Format, validate and minify JSON in your browser. Find syntax errors and make API responses or configuration files easier to read.",
    intro: "Paste JSON to format it with readable indentation, validate its syntax or minify it. Use clear error feedback to troubleshoot malformed data and configuration files.",
    
    faq: [['How do I validate JSON?', 'Paste your JSON into the tool. If the syntax is invalid it reports the problem so you can correct missing commas, quotes or brackets.'], ['What does minifying JSON do?', 'Minifying removes whitespace and line breaks to make the payload smaller, without changing the data.']] },
  'uuid-generator': { title: "UUID v4 Generator: Create Random UUIDs Online", desc: "Generate random version 4 UUIDs individually or in bulk. Free online UUID generator for databases, software tests and APIs.",
    intro: "Generate random version 4 UUID identifiers one at a time or in batches. Use them for test data, database records and application development.",
    
    faq: [['What is a UUID v4?', 'A UUID v4 is a 128-bit identifier generated from random numbers, written as 32 hexadecimal digits in five groups.'], ['Can two UUIDs collide?', 'Collisions are extremely unlikely in practice, which is why UUID v4 is widely used for unique identifiers.']] },
  'url-encoder': { title: "URL Encoder & Decoder: Percent Encode Text Online", desc: "Encode text for use in URLs or decode percent-encoded strings in your browser. Free online URL encoding tool for developers.",
    intro: "Encode text for use in URL components or decode percent-encoded strings into readable characters. Useful when working with query parameters, links and redirects.",
    
    faq: [['What is URL encoding?', 'URL encoding replaces unsafe characters with a percent sign followed by two hexadecimal digits. For example, a space becomes %20.'], ['When should I encode a URL?', 'Encode query parameter values and any text containing spaces or special characters before placing it in a link.']] },
  'jwt-decoder': { title: "JWT Decoder: Decode JSON Web Token Header & Payload", desc: "Decode a JWT to inspect its header and payload claims in your browser. Local decoding does not verify the token signature.",
    intro: "Inspect the header and payload of a JSON Web Token, including claims such as issuer, subject and expiration. Decoding reveals the contents but does not verify the token signature.",
    
    faq: [['Does decoding a JWT verify it?', 'No. Decoding only reads the contents. Verifying a token requires checking its signature with the correct key on your server.'], ['Is it safe to paste a JWT here?', 'The tool reads tokens without sending them anywhere. Even so, avoid sharing live production tokens with anyone and treat them like passwords.']] },
  'regex-tester': { title: "JavaScript Regex Tester: Test Regular Expressions Online", desc: "Test JavaScript regular expressions against sample text in your browser. Check matches while building or debugging a pattern.",
    intro: "Test a JavaScript regular expression against sample text and inspect the matches. Use it to refine patterns before adding them to an application or script.",
    
    faq: [['Which regex flavor does this tester use?', 'It uses the JavaScript (ECMAScript) regular expression engine of your browser, so results match what JavaScript code will do.'], ['Will my pattern work in Python or PHP?', 'Basic patterns usually carry over, but features such as lookbehind and named groups differ between languages, so also test in your target language.']] },
  'timestamp-converter': { title: "Unix Timestamp Converter: Epoch to Date & Time", desc: "Convert Unix epoch timestamps to readable dates and convert dates back to timestamps. Free online timestamp converter for developers.",
    intro: "Convert Unix timestamps into readable dates and times, or convert a date back into an epoch value. Helpful when checking logs, database records and API responses.",
    
    faq: [['What is a Unix timestamp?', 'It is the number of seconds since January 1, 1970 UTC, also called epoch time.'], ['Seconds or milliseconds?', 'Many systems use seconds, while JavaScript uses milliseconds. A 10-digit value is usually seconds and a 13-digit value is usually milliseconds.']] },
  'hash-generator': { title: "SHA Hash Generator: Create SHA-256 & SHA-512 Hashes", desc: "Generate SHA-256, SHA-384, SHA-512 and SHA-1 hashes from text in your browser. Useful for checksums and integrity checks.",
    intro: "Generate SHA-1, SHA-256, SHA-384 or SHA-512 hash values from text. Use them for development tests and basic checksum comparisons; hashes are not encryption.",
    
    faq: [['Can a hash be reversed?', 'No. Hash functions are one-way, so the original text cannot be recovered from the hash, although weak inputs can be guessed.'], ['Which algorithm should I use?', 'Prefer SHA-256 or stronger. SHA-1 is considered weak against collisions and should not be used for security purposes.']] },
  'json-csv': { title: "JSON to CSV Converter & CSV to JSON Online", desc: "Convert JSON data to CSV or turn CSV rows into JSON. Free online data converter for spreadsheets, APIs and exports.",
    intro: "Convert structured data between JSON and CSV formats. Prepare API data for spreadsheets or turn tabular exports into JSON for development workflows.",
    
    faq: [['How should JSON be structured for CSV?', 'An array of objects with matching keys works best, because each object becomes a row and each key becomes a column.'], ['What happens with nested JSON?', 'CSV is flat, so deeply nested values may need to be flattened first to convert cleanly.']] },
  'sql-formatter': { title: "SQL Formatter: Format & Beautify SQL Queries Online", desc: "Format SQL queries with consistent indentation and line breaks. Free online SQL beautifier for easier reading and code reviews.",
    intro: "Format SQL queries with clearer indentation and line breaks so common statements are easier to read, review and debug.",
    
    faq: [['Does it support every SQL dialect?', 'It formats common SQL syntax. Vendor-specific extensions may not be formatted perfectly, so review the output.'], ['Does formatting change my query?', 'Formatting only changes whitespace and layout, not what the query does.']] },
  'code-formatter': { title: "HTML, CSS & JavaScript Code Formatter Online", desc: "Format HTML, CSS and JavaScript into readable code. Free online code formatter and beautifier for developers.",
    intro: "Beautify HTML, CSS or JavaScript so code is easier to scan, edit and debug. Paste a snippet to add consistent indentation and line breaks.",
    
    faq: [['Is this a full code beautifier?', 'It applies simple readable formatting, not the full rule set of tools like Prettier, so it suits quick cleanups.'], ['Can it fix syntax errors?', 'No. It only adjusts layout, so syntax errors in your code will remain.']] },
  'currency-converter': { title: "Currency Converter: Daily Exchange Rates", desc: "Convert currencies with daily reference exchange rates for USD, GBP, EUR and more. Check the rate date before using the estimate.",
    intro: "Convert amounts between a wide range of currencies using daily reference exchange rates. Rates are not live, and the displayed rate date helps you judge how current an estimate is.",
    
    faq: [['How accurate are the rates?', 'Rates are for general reference and may differ from the rate your bank or card provider applies. Always confirm before making payments.'], ['Does it work offline?', 'It can fall back to stored offline rates, which may be out of date.']] },
  'discount-calculator': { title: "Discount Calculator: Sale Price, Markup & Margin", desc: "Calculate sale prices, discount amounts, profit margin and markup. Free online discount calculator for shopping and pricing.",
    intro: "Calculate a sale price after a discount, or work out markup and profit margin when pricing products. Enter the values to compare your figures.",
    
    faq: [['What is the difference between margin and markup?', 'Markup is profit as a percentage of cost, while margin is profit as a percentage of selling price, so the same sale gives a different percentage for each.'], ['How do I calculate a discount?', 'Multiply the original price by the discount percentage and subtract the result from the price.']] },
  'loan-calculator': { title: "Loan Payment & Mortgage Calculator with Amortization", desc: "Estimate monthly loan or mortgage payments, total interest and an amortization schedule. Adjust the amount, interest rate and term to compare scenarios.",
    intro: "Estimate a loan or mortgage payment by entering the amount, interest rate and repayment term. Review the estimated total interest and how each payment reduces the balance.",
    
    faq: [['What is an amortization schedule?', 'It is a table showing how each payment is split between interest and principal over the life of the loan.'], ['Are the results exact?', 'Results are estimates. Lenders may add fees, taxes or different compounding, so confirm with your lender.']] },
  'qr-generator': { title: "Free QR Code Generator for URLs, Wi-Fi & Text", desc: "Create QR codes for website URLs, Wi-Fi access and plain text. Generate a code in your browser and save it for print or sharing.",
    intro: "Create a QR code for a website link, Wi-Fi network or plain text. Save the generated code to add it to a flyer, presentation, label or webpage.",
    
    faq: [['Do QR codes expire?', 'A QR code that encodes a link or text directly does not expire, although the page it points to might change or disappear.'], ['What can a QR code contain?', 'It can contain links, plain text and Wi-Fi network details, among other kinds of data.']] },
  'vat-calculator': { title: "VAT & Sales Tax Calculator: Add or Remove Tax", desc: "Calculate VAT or sales tax by adding tax to a price or removing it from a total. Enter the rate that applies to your transaction.",
    intro: "Add VAT or sales tax to a net price, or work backwards from a tax-inclusive total. Enter your own rate because tax rules vary by country, state and transaction.",
    
    faq: [['How do I remove VAT from a price?', 'Divide the gross price by 1 plus the VAT rate (for example 1.20 for 20 percent) to get the net price.'], ['Does it use my country rate?', 'You enter the rate yourself, so it works for any VAT or sales tax percentage.']] },
  'pdf-merge': { title: "Merge PDF Files Online: Combine Multiple PDFs", desc: "Combine multiple PDF files into one document in your browser. Arrange your source files, merge them and download a single PDF.",
    intro: "Combine multiple PDF documents into one file. Add the PDFs you want to join, arrange them in the right order and download the merged document.",
    
    faq: [['Is there a file size limit?', 'Because files are processed in your browser, very large PDFs depend on your device memory.'], ['Will merging change my original files?', 'No. Your originals stay untouched and you download a new merged file.']] },
  'pdf-split': { title: "Split PDF Files & Extract Pages Online", desc: "Split a PDF or extract selected pages into a new document. Choose the page range you need and download the resulting PDF in your browser.",
    intro: "Extract selected pages from a PDF to create a separate document. Enter the page range you want to keep, then download the new PDF.",
    
    faq: [['How do I extract specific pages?', 'Enter the page range you want, then download the new PDF that contains only those pages.'], ['Does the original PDF change?', 'No. The tool creates a new file and leaves the original as it is.']] },
  'pdf-compress': { title: "Compress & Optimize PDF Files Online", desc: "Optimize PDF files with lossless re-saving in your browser. File size reductions vary by document; image-heavy PDFs may shrink very little.",
    intro: "Re-save a PDF using lossless optimization to tidy its internal structure. It does not reduce image quality, and the final file may be only slightly smaller—or remain the same size.",
    
    faq: [['Will it make my PDF much smaller?', 'Lossless optimization can reduce the size of some files, but PDFs full of large images may shrink very little.'], ['Is quality affected?', 'No. The optimization is lossless, so the content is not degraded.']] },
  'pdf-rotate': { title: "Rotate PDF Pages Online: Fix Page Orientation", desc: "Rotate PDF pages to fix sideways or upside-down documents. Apply the rotation and download a corrected PDF in your browser.",
    intro: "Correct a PDF that opens sideways or upside down by rotating its pages. Download a new copy with the corrected page orientation.",
    
    faq: [['Can I rotate only one page?', 'This tool rotates every page in the document.'], ['Does rotating reduce quality?', 'Rotation changes the page orientation rather than the page content.']] },
  'pdf-reorder': { title: "Rearrange & Reorder PDF Pages Online", desc: "Rearrange pages in a PDF by entering their new order. Create a reorganized PDF online without installing desktop software.",
    intro: "Rearrange PDF pages into the order you need. Enter the page numbers in sequence, then download a new PDF with the pages reordered.",
    
    faq: [['How do I specify the new order?', 'Enter the page numbers in the order you want them, for example 3, 1, 2.'], ['Can I remove pages too?', 'Use the PDF Split & Page Extractor to keep only the pages you need.']] },
  'images-pdf': { title: "Images to PDF Converter: Combine Pictures into PDF", desc: "Convert JPG, PNG and other supported images into a single PDF document online. Create a PDF from scans, receipts and pictures.",
    intro: "Combine selected images into one PDF document. This is useful for turning scanned pages, receipts or photos into a file that is easier to print and share.",
    
    faq: [['How do I keep the images in order?', 'Select the images in the sequence you want and review the generated PDF before sharing it.'], ['Are my images uploaded?', 'The tool creates the PDF in your browser. See the Privacy Policy for how each tool handles data.']] },
  'text-pdf': { title: "Text to PDF Converter: Create a PDF from Text Online", desc: "Turn plain text into a printable PDF document in your browser. Free online text to PDF converter for notes and simple documents.",
    intro: "Paste or type plain text and create a PDF that is easy to print, save or share. Useful for simple notes and text-based documents.",
    
    faq: [['Is formatting preserved?', 'The tool creates a PDF from plain text, so rich formatting such as bold text or images is not included.'], ['Can I print the result?', 'Yes. The generated PDF is intended to be printable.']] },
  'exif-viewer': { title: "EXIF Viewer: Read Photo Metadata & GPS Data", desc: "View photo EXIF metadata, including camera details and GPS coordinates. Check image metadata in your browser before sharing photos.",
    intro: "Inspect image metadata such as camera make, capture settings and embedded GPS information. Check what details a photo may reveal before sharing it.",
    
    faq: [['What is EXIF data?', 'EXIF is metadata embedded in photos by cameras and phones, including device, settings, date and sometimes location.'], ['Why check GPS data?', 'Photos can contain the location where they were taken, so checking it helps you avoid sharing your location by accident.']] },
  'image-compressor': { title: "Image Compressor & Resizer: Reduce Image File Size", desc: "Compress and resize images online to reduce file size for websites, email and sharing. Adjust dimensions and quality before saving.",
    intro: "Reduce image file size by adjusting dimensions and compression quality. Create lighter images for websites, email attachments and online sharing.",
    
    faq: [['Does compression reduce quality?', 'Stronger compression lowers file size and can reduce visible quality, so compare the result before saving.'], ['Are my images uploaded?', 'The tool compresses images right in your browser. See the Privacy Policy for details.']] },
  'image-base64': { title: "Image to Base64 Converter: Create Data URIs Online", desc: "Convert images to Base64 data URIs for use in HTML, CSS and JSON. Free online image encoder that runs in your browser.",
    intro: "Convert an image into a Base64 data URI for embedding in HTML, CSS or JSON. Copy the result into a project when an inline image is appropriate.",
    
    faq: [['When should I use a Base64 image?', 'Inline Base64 images suit small icons and email templates. Larger images are better as normal files because Base64 increases size.'], ['How much bigger is Base64?', 'Base64 output is roughly one third larger than the original file.']] },
  'password-generator': { title: "Random Password Generator: Create Strong Passwords", desc: "Generate random passwords and passphrases in your browser. Choose length and character options to create a password for your accounts.",
    intro: "Create a random password or passphrase and adjust its length and character options to meet a website's requirements. Generate a separate password for each account.",
    
    faq: [['How long should a password be?', 'Longer is stronger. Many security guides recommend at least 12 to 16 characters and a unique password for every account.'], ['Should I store generated passwords?', 'Use a reputable password manager rather than reusing passwords or writing them down in plain text.']] },
  'svg-to-css': { title: "SVG to CSS Converter: Create CSS Background Data URIs", desc: "Convert SVG markup into an encoded data URI for CSS background images. Free online SVG to CSS converter for web developers.",
    intro: "Convert SVG markup into an encoded data URI that can be used as a CSS background image. Copy the generated value into your stylesheet.",
    
    faq: [['Why use an SVG data URI?', 'It removes an extra network request for small icons and patterns and keeps styling in one file.'], ['Where do I paste the result?', 'Use it as the value of a CSS background-image property, inside url().']] },
  'image-format': { title: "Image Converter: Convert PNG, JPEG & WebP", desc: "Convert images between PNG, JPEG and WebP formats in your browser. Free online image format converter for everyday use.",
    intro: "Convert an image to PNG, JPEG or WebP directly in your browser. Choose a format that fits your website, document or sharing needs.",
    
    faq: [['Which format should I choose?', 'WebP and JPEG usually give smaller files for photos, while PNG is better for graphics that need sharp edges or transparency.'], ['Will converting lose quality?', 'Converting to a lossy format such as JPEG can reduce quality, so keep your original file.']] },
  'image-cropper': { title: "Image Cropper Online: Crop Photos & Pictures", desc: "Crop photos and images online for profile pictures, thumbnails and social posts. Free browser-based image cropper.",
    intro: "Crop an image to the area you want for a profile picture, thumbnail, document or social media post. Adjust the selection and save the cropped image.",
    
    faq: [['Does cropping change the original?', 'No. You download a new cropped image.'], ['Can I crop to a specific size?', 'Select the area you need with the crop controls, then resize with the Image Compressor & Resizer if required.']] },
  'image-rotate-flip': { title: "Rotate & Flip Images Online: Fix Photo Orientation", desc: "Rotate photos and flip images horizontally or vertically in your browser. Free online image rotation tool.",
    intro: "Correct image orientation by rotating a photo or flipping it horizontally or vertically. Save the adjusted image directly from your browser.",
    
    faq: [['How do I fix a sideways photo?', 'Open the image and rotate it until it is upright, then download the corrected version.'], ['What does flipping do?', 'Flipping mirrors the image along its horizontal or vertical axis.']] },
  'image-batch': { title: "Batch Image Converter: Convert Multiple Images Online", desc: "Convert multiple images together in your browser. Batch convert image files to another supported format without installing software.",
    intro: "Select multiple images and convert them in one batch to a supported format. Save time when preparing groups of pictures for websites, documents or sharing.",
    
    faq: [['When is batch conversion useful?', 'It saves time when you need to prepare many images for a website or app in the same format.'], ['Are there limits?', 'Because processing happens in your browser, very large batches depend on your device memory.']] },
  'image-watermark': { title: "Add a Text Watermark to Images Online", desc: "Add a text watermark to photos and images in your browser. Position a simple label before saving your watermarked image.",
    intro: "Add a text overlay to an image to identify a creator, brand or draft before sharing. Adjust the watermark and save the updated image.",
    
    faq: [['Does a watermark prevent copying?', 'A watermark discourages casual reuse but cannot fully prevent copying.'], ['Can I change the text?', 'Yes. You enter the watermark text you want to apply.']] },
  'text-case': { title: "Text Case Converter & URL Slug Generator Online", desc: "Convert text to uppercase, lowercase, title case and more, or create a clean URL slug. Free online text case converter.",
    intro: "Convert text between common letter cases and create a URL-friendly slug for a page or post. Prepare headings, labels and web addresses in one place.",
    
    faq: [['What is a URL slug?', 'A slug is the readable part of a web address, usually lowercase words separated by hyphens.'], ['Which case styles are available?', 'Use the options in the tool to switch between common styles such as uppercase, lowercase and title case.']] },
  'word-counter': { title: "Word Counter: Count Words, Characters & Sentences", desc: "Count words, characters and sentences, and estimate reading time. Check text length for essays, articles, social posts and web content.",
    intro: "Paste or type your text to count words, characters and sentences, and estimate reading time. Useful when editing essays, articles, web copy and social posts.",
    
    faq: [['How is reading time estimated?', 'Reading time is estimated from the word count at an average reading speed.'], ['Why count characters?', 'Character counts help you stay within limits for social posts, captions, meta descriptions and forms.']] },
  'text-diff': { title: "Text Comparison Tool: Compare Two Texts Online", desc: "Compare two text passages to find added, removed or changed content. Use this online text comparison tool for drafts, notes and code.",
    intro: "Compare two versions of text and highlight what was added, removed or changed. Useful for editing drafts, reviewing notes and checking code snippets.",
    
    faq: [['What can I compare?', 'Any plain text, such as drafts, configuration files, code snippets or contracts.'], ['Does it work for code?', 'Yes. It compares text, so it can highlight changes between code snippets.']] },
  'arabic-fixer': { title: "Arabic Text Fixer: Repair Disconnected Arabic Letters Online", desc: "Fix Arabic text with disconnected letters in design and editing software. Free online Arabic text fixer for right-to-left text.",
    intro: "Fix Arabic text that appears with disconnected letters in apps that do not handle Arabic shaping correctly. Prepare right-to-left text for design, video and publishing tools.",
    
    faq: [['Why do Arabic letters appear disconnected?', 'Some programs do not apply Arabic letter shaping, so each letter is shown in its isolated form.'], ['How do I use the fixed text?', 'Copy the fixed output into the program that displayed the disconnected letters.']] },
  'duplicate-remover': { title: "Remove Duplicate Lines from Text Online", desc: "Remove repeated lines from text, lists, URLs and keywords. Free online duplicate line remover for clean, unique lists.",
    intro: "Remove repeated lines from a text list to create a cleaner set of unique entries. Useful for email lists, keywords, URLs and copied data.",
    
    faq: [['Does it remove all repeated lines?', 'It strips duplicate lines from your text, leaving each unique line once.'], ['Can I use it for keyword lists?', 'Yes. It works for any line-based list, such as keywords, emails or URLs.']] },
  'rtl-cleaner': { title: "RTL Text Cleaner: Remove Hidden Unicode Characters", desc: "Clean right-to-left text by removing invisible Unicode marks and zero-width characters that can affect search, sorting and layout.",
    intro: "Remove selected invisible Unicode characters that can interfere with right-to-left text, mixed Arabic and English content, search results and text layout.",
    
    faq: [['What are zero-width characters?', 'They are invisible Unicode characters that take no space on screen but can still affect matching and layout.'], ['Why clean directional marks?', 'Stray directional marks can reorder text unexpectedly when you mix right-to-left and left-to-right languages.']] },
  'text-sorter': { title: "Text Sorter: Sort Lines Alphabetically or Numerically", desc: "Sort text lines alphabetically or numerically in your browser. Free online list sorter for names, words and data.",
    intro: "Sort a list of lines alphabetically or numerically to organize names, words, values and other text data.",
    
    faq: [['Alphabetical or numeric sort?', 'Use alphabetical sorting for words and numeric sorting for numbers, so 10 comes after 2 rather than before it.'], ['Can I sort a list from a spreadsheet?', 'Yes. Paste one item per line and sort.']] },
  'lorem-ipsum': { title: "Lorem Ipsum Generator: Create Placeholder Text Online", desc: "Generate lorem ipsum placeholder text for website layouts, mockups and design prototypes. Free online filler text generator.",
    intro: "Generate placeholder lorem ipsum text for website layouts, wireframes, mockups and design prototypes. Use filler copy while planning a page before final content is ready.",
    
    faq: [['What is lorem ipsum?', 'It is placeholder text used in design and publishing to show how a layout looks before real content is ready.'], ['Is lorem ipsum real Latin?', 'It is derived from classical Latin but scrambled, so it does not form meaningful sentences.']] },
  'markdown-html': { title: "Markdown to HTML Converter Online: Convert Markdown", desc: "Convert Markdown text into HTML in your browser. Free online Markdown to HTML converter for notes, documentation and web content.",
    intro: "Convert Markdown content into HTML for a webpage, blog post, documentation or content management system. Paste your Markdown and copy the resulting markup.",
    
    faq: [['Which Markdown features are supported?', 'Common Markdown such as headings, lists, links and emphasis is supported.'], ['Can I paste the HTML into my site?', 'Yes. Review the output and then paste it where you need it.']] },
  'ascii-art': { title: "Free ASCII Art Text Generator for Banners & Text", desc: "Turn words into ASCII art text for README files, terminal banners and messages. Free online text art generator.",
    intro: "Turn words and short phrases into ASCII banner text for code README files, terminal screens, profiles and messages.",
    
    faq: [['Where can I use ASCII art?', 'It works anywhere plain text is shown, such as README files, code comments, terminals and chat.'], ['Will it look the same everywhere?', 'ASCII art needs a monospaced font, otherwise the alignment can break.']] },
  'gradient-generator': { title: "CSS Gradient Generator: Create Linear & Radial Gradients", desc: "Create CSS gradients and background patterns, preview the result and copy the CSS. Free browser-based gradient generator.",
    intro: "Create and preview CSS gradients and background patterns for web projects. Adjust the appearance and copy the generated CSS for your stylesheet.",
    
    faq: [['How do I use the CSS output?', 'Copy the generated CSS and paste it into your stylesheet as a background rule.'], ['Which gradient types exist?', 'Common CSS gradients are linear, radial and conic. Use the tool options to explore the styles it offers.']] },
  'fancy-text': { title: "Fancy Text Generator for Social Media & Bios", desc: "Create decorative Unicode text for social media bios, captions and usernames. Copy and paste stylish text online.",
    intro: "Convert plain text into decorative Unicode styles for social profiles, bios, captions and usernames. Copy a style and paste it where Unicode text is supported.",
    
    faq: [['Why does fancy text work when pasted?', 'It uses special Unicode characters rather than fonts, so it survives copy and paste on many platforms.'], ['Is fancy text accessible?', 'Screen readers may read decorative Unicode poorly, so use it sparingly and avoid it for important information.']] },
  'decision-maker': { title: "Random Decision Maker: Pick from a List Online", desc: "Choose a random option from your list with a simple online decision maker. Add choices and let the tool pick one.",
    intro: "Enter your choices and randomly pick one when you need help making a quick decision, choosing an activity or selecting from a list.",
    
    faq: [['Is the pick truly random?', 'It picks from your options using randomness in your browser, which is fine for everyday choices.'], ['Can I use it for giveaways?', 'It suits casual picks. For official draws, follow the rules that apply to you.']] },
  'pomodoro-timer': { title: "Pomodoro Timer & Stopwatch Online", desc: "Use an online Pomodoro focus timer or stopwatch to structure work sessions and breaks. Free browser-based productivity timer.",
    intro: "Use a stopwatch for elapsed time or run focused work sessions with a Pomodoro-style timer. Keep track of work periods and breaks directly in your browser.",
    
    faq: [['What is the Pomodoro technique?', 'It alternates focused work intervals, traditionally 25 minutes, with short breaks.'], ['Will it keep running in a background tab?', 'Browsers may throttle background tabs, so keep the tab visible for accurate timing.']] }
};
