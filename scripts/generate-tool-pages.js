const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const site = 'https://qantaratools.com';
const tools = JSON.parse(fs.readFileSync(path.join(root, 'tool-pages.json'), 'utf8'));
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = {
  'Core & Dev': 'Use it for everyday development work, quick conversions, and data cleanup without installing a separate desktop utility.',
  'Business & Finance': 'Use it for quick estimates and common business calculations. Check the assumptions and verify important financial decisions independently.',
  'PDF & Documents': 'Use it for common document tasks directly from your browser. Keep the original file and check the output before sharing or relying on it.',
  'Security & Media': 'Use it to inspect, convert, or prepare images and other media. Review selected files and outputs before sharing them.',
  'Text & Unicode': 'Use it to transform or inspect text for writing, development, and multilingual workflows.',
  'Fun & Creative': 'Use it to make quick creative assets and small productivity helpers in your browser.'
};
const useCases = {
  'Core & Dev': ['Prepare data for development tasks', 'Convert or validate common text formats', 'Copy a result into your next workflow'],
  'Business & Finance': ['Make a quick estimate from your inputs', 'Compare the result under different assumptions', 'Export or copy figures where the tool supports it'],
  'PDF & Documents': ['Choose one or more source files', 'Apply the requested document operation', 'Download and review the generated file'],
  'Security & Media': ['Choose a supported image or media input', 'Adjust the available options', 'Preview and download the result'],
  'Text & Unicode': ['Paste or enter the text to process', 'Choose an operation or formatting option', 'Copy the transformed text'],
  'Fun & Creative': ['Enter a prompt, text, or creative options', 'Generate or adjust the result', 'Copy or download the output where supported']
};
const html = tool => {
  const title = esc(tool.title);
  const category = esc(tool.category);
  const desc = tool.description.trim();
  const meta = desc.length > 155 ? desc.slice(0, 152).replace(/[ ,;:.!?-]+$/, '') + '...' : desc;
  const url = `${site}/tools/${encodeURIComponent(tool.id)}/`;
  const facts = useCases[tool.category] || useCases['Core & Dev'];
  const jsonLd = {
    '@context':'https://schema.org', '@type':'WebApplication', name:tool.title,
    url, description:desc, applicationCategory:tool.category,
    operatingSystem:'Any', browserRequirements:'Requires a modern web browser',
    offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}
  };
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="index,follow,max-image-preview:large">
  <meta name="description" content="${esc(meta)}">
  <meta name="theme-color" content="#17151f">
  <link rel="canonical" href="${esc(url)}">
  <link rel="icon" type="image/svg+xml" href="../../assets/branding/favicon.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="stylesheet" href="../../assets/css/custom.css">
  <link rel="stylesheet" href="../../assets/css/theme-light.css">
  <script src="../../assets/js/theme.js"></script>
  <meta property="og:type" content="website"><meta property="og:site_name" content="QantaraTools">
  <meta property="og:title" content="${esc(tool.title)} | Free Online Tool | QantaraTools">
  <meta property="og:description" content="${esc(meta)}"><meta property="og:url" content="${esc(url)}">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g,'\\u003c')}</script>
  <script>document.documentElement.classList.toggle('dark',localStorage.getItem('theme')!=='light');document.documentElement.dataset.identity=localStorage.getItem('visual_identity')||'electric';</script>
  <title>${title} | Free Online Tool | QantaraTools</title>
  <style>
    .qt-tool-page{min-height:100vh}.qt-tool-header{position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--qt-bg) 90%,transparent);backdrop-filter:blur(16px);border-bottom:1px solid var(--qt-line)}
    .qt-tool-header-inner{max-width:1160px;margin:auto;padding:12px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px}
    .qt-tool-brand{display:flex;align-items:center;gap:10px;color:var(--qt-text);text-decoration:none;font-weight:900}.qt-tool-brand img{width:36px;height:36px}.qt-tool-brand span span{color:var(--qt-blue)}
    .qt-tool-nav{display:flex;gap:12px;align-items:center}.qt-tool-nav a{font-size:13px;font-weight:800;color:var(--qt-blue);text-decoration:none}
    .qt-tool-main{width:min(960px,calc(100% - 28px));margin:0 auto;padding:38px 0 64px}.qt-tool-intro{padding:28px 32px;border:2px solid #17151f;border-radius:24px;background:linear-gradient(115deg,#fffdf8,#f1eeff 58%,#e9fff6);box-shadow:6px 6px 0 #17151f}
    .qt-tool-kicker{color:#6857ff;font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}.qt-tool-intro h1{margin:12px 0;color:#17151f;font-size:clamp(30px,5vw,48px);line-height:1.08;letter-spacing:-.055em;font-weight:900}.qt-tool-intro p{max-width:720px;color:#635d6c;font-size:15px;line-height:1.75}
    .qt-tool-workspace{margin-top:28px;padding:24px;border:1px solid var(--qt-line);border-radius:22px;background:var(--qt-panel);box-shadow:0 10px 28px rgba(23,21,31,.08)}.qt-tool-workspace h2{margin:0 0 14px;font-size:20px;font-weight:900;color:var(--qt-text)}
    .qt-tool-details{margin-top:28px;padding:24px;border:1px solid var(--qt-line);border-radius:20px;background:var(--qt-panel)}.qt-tool-details h2{font-size:19px;font-weight:900;color:var(--qt-text)}.qt-tool-details p,.qt-tool-details li{color:var(--qt-muted);line-height:1.75;font-size:14px}
    .qt-tool-footer{padding:22px;text-align:center;border-top:1px solid var(--qt-line);color:var(--qt-muted);font-size:12px}.qt-tool-footer a{margin:0 8px;color:var(--qt-blue);font-weight:800;text-decoration:none}
    html.dark .qt-tool-intro{background:linear-gradient(115deg,#1a1725,#242044 58%,#123934);border-color:#fff9ef;box-shadow:6px 6px 0 #fff9ef}html.dark .qt-tool-intro h1{color:#fff9ef}html.dark .qt-tool-intro p{color:#b6acbd}
    @media(max-width:600px){.qt-tool-header-inner{padding:10px 14px}.qt-tool-nav{gap:8px}.qt-tool-nav a{font-size:11px}.qt-tool-main{padding-top:22px}.qt-tool-intro{padding:23px 20px}.qt-tool-workspace,.qt-tool-details{padding:16px}}
  </style>
</head>
<body class="qt-tool-page">
  <a class="skip-link" href="#tool-workspace">Skip to tool</a>
  <header class="qt-tool-header"><div class="qt-tool-header-inner">
    <a class="qt-tool-brand" href="/"><img src="../../assets/branding/qantara-mark.svg" alt=""><span>Qantara<span>Tools</span></span></a>
    <nav class="qt-tool-nav" aria-label="Main navigation"><a href="/">All tools</a><a href="/about-us.html">About</a><a href="/contact.html">Contact</a><button type="button" class="qt-theme-btn" data-theme-toggle aria-label="Toggle theme"><i class="fa-solid fa-sun" aria-hidden="true"></i></button></nav>
  </div></header>
  <main class="qt-tool-main">
    <section class="qt-tool-intro" aria-labelledby="tool-page-title">
      <span class="qt-tool-kicker">${category} · Free browser tool</span>
      <h1 id="tool-page-title">${title}</h1>
      <p>${esc(desc)}</p>
      <p>${esc(paragraphs[tool.category] || paragraphs['Core & Dev'])}</p>
    </section>
    <section id="tool-workspace" class="qt-tool-workspace" aria-labelledby="active-tool-title">
      <h2 id="active-tool-title">${title}</h2>
      <div id="active-tool-box"><p role="status" aria-live="polite">Loading ${title}…</p></div>
    </section>
    <section class="qt-tool-details" aria-labelledby="tool-uses-title">
      <h2 id="tool-uses-title">What you can do with ${title}</h2>
      <p>${esc(desc)} This free ${esc(category.toLowerCase())} tool runs in your browser. Tool behavior can vary by feature; see the <a href="/privacy.html">Privacy Policy</a> before using sensitive content.</p>
      <h3>Common workflow</h3><ol>${facts.map(item=>`<li>${esc(item)}</li>`).join('')}</ol>
      <p>Need another utility? Browse the <a href="/">complete QantaraTools collection</a>.</p>
    </section>
  </main>
  <footer class="qt-tool-footer">© 2026 QantaraTools <a href="/">All tools</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></footer>
  <script src="../../assets/js/external-resources.js"></script>
  <script src="../../assets/js/consent.js"></script>
  <script src="../../assets/js/plugin-system.js"></script>
  <script src="../../assets/js/tool-feedback.js"></script>
  <script src="../../assets/js/router.js"></script>
  <script src="../../assets/js/accessibility.js"></script>
  <script>window.addEventListener('DOMContentLoaded',()=>{if(window.router)window.router.loadTool(${JSON.stringify(tool.category)},${JSON.stringify(tool.title)},${JSON.stringify(tool.id)});});</script>
</body></html>
`;
};
for (const tool of tools) {
  const out = path.join(root, 'tools', tool.id, 'index.html');
  fs.mkdirSync(path.dirname(out), {recursive:true});
  fs.writeFileSync(out, html(tool));
}
const fixed = ['/', '/about-us.html', '/faq.html', '/contact.html', '/privacy.html', '/terms.html'];
const urls = [...fixed, ...tools.map(tool => `/tools/${tool.id}/`)];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(route => `  <url><loc>${site}${route}</loc></url>`).join('\n')}\n</urlset>\n`;
fs.writeFileSync(path.join(root, 'sitemap.xml'), sitemap);
console.log(`Generated ${tools.length} tool pages and updated sitemap.xml (${urls.length} URLs).`);
