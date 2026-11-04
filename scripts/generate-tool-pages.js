// Generates /tools/<id>/index.html (one SEO page per tool), sitemap.xml
// Run: node scripts/generate-tool-pages.js
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const site = 'https://qantaratools.com';
const today = new Date().toISOString().slice(0, 10);
const tools = JSON.parse(fs.readFileSync(path.join(root, 'tool-pages.json'), 'utf8'));
const seo = require('./seo-content.js');
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

const categoryText = {
  'Core & Dev': 'Use it for everyday development work, quick conversions, and data cleanup without installing a separate desktop utility.',
  'Business & Finance': 'Use it for quick estimates and common business calculations. Check the assumptions and verify important financial decisions independently.',
  'PDF & Documents': 'Use it for common document tasks directly from your browser. Keep the original file and check the output before sharing or relying on it.',
  'Security & Media': 'Use it to inspect, convert, or prepare images and other media. Review selected files and outputs before sharing them.',
  'Text & Unicode': 'Use it to transform or inspect text for writing, development, and multilingual workflows.',
  'Fun & Creative': 'Use it to make quick creative assets and small productivity helpers in your browser.'
};
const steps = {
  'Core & Dev': ['Paste or enter your input in the tool above', 'Choose the options you need and run the conversion', 'Copy the result into your code, config or workflow'],
  'Business & Finance': ['Enter your numbers in the fields above', 'Review the calculated result and adjust the inputs to compare scenarios', 'Copy or note the figures you need'],
  'PDF & Documents': ['Select your PDF or source files', 'Apply the operation you need', 'Download the new file and review it before sharing'],
  'Security & Media': ['Choose your file or set your options', 'Adjust the available settings', 'Preview and download the result'],
  'Text & Unicode': ['Paste or type your text into the tool', 'Pick an operation or formatting option', 'Copy the processed text'],
  'Fun & Creative': ['Enter your text, list or creative options', 'Generate or adjust the result', 'Copy or save the output']
};
const appType = {
  'Core & Dev': 'DeveloperApplication', 'Business & Finance': 'FinanceApplication', 'PDF & Documents': 'BusinessApplication',
  'Security & Media': 'MultimediaApplication', 'Text & Unicode': 'UtilitiesApplication', 'Fun & Creative': 'EntertainmentApplication'
};
const appTypeOverride = { 'password-generator': 'SecurityApplication', 'gradient-generator': 'DesignApplication', 'pomodoro-timer': 'UtilitiesApplication', 'qr-generator': 'UtilitiesApplication', 'currency-converter': 'FinanceApplication' };

const byCategory = {};
tools.forEach(t => (byCategory[t.category] ||= []).push(t));
const related = tool => {
  const list = byCategory[tool.category];
  const i = list.findIndex(t => t.id === tool.id);
  const out = [];
  for (let k = 1; k < list.length && out.length < 4; k++) out.push(list[(i + k) % list.length]);
  return out;
};
const clip = (s, n) => s.length > n ? s.slice(0, n - 3).replace(/[ ,;:.!?-]+$/, '') + '...' : s;

const css = `
    .qt-tool-page{min-height:100vh}.qt-tool-header{position:sticky;top:0;z-index:40;background:color-mix(in srgb,var(--qt-bg) 90%,transparent);backdrop-filter:blur(16px);border-bottom:1px solid var(--qt-line)}
    .qt-tool-header-inner{max-width:1160px;margin:auto;padding:12px 22px;display:flex;align-items:center;justify-content:space-between;gap:16px}
    .qt-tool-brand{display:flex;align-items:center;gap:10px;color:var(--qt-text);text-decoration:none;font-weight:900}.qt-tool-brand img{width:36px;height:36px}.qt-tool-brand span span{color:var(--qt-blue)}
    .qt-tool-nav{display:flex;gap:12px;align-items:center}.qt-tool-nav a{font-size:13px;font-weight:800;color:var(--qt-blue);text-decoration:none}
    .qt-tool-main{width:min(960px,calc(100% - 28px));margin:0 auto;padding:30px 0 64px}
    .qt-crumbs{display:flex;flex-wrap:wrap;gap:6px;margin:0 0 14px;padding:0;list-style:none;font-size:12.5px;color:var(--qt-muted)}.qt-crumbs li+li::before{content:"\\203A";margin-inline-end:6px}.qt-crumbs a{color:var(--qt-blue);text-decoration:none;font-weight:700}
    .qt-tool-intro{padding:28px 32px;border:2px solid #17151f;border-radius:24px;background:linear-gradient(115deg,#fffdf8,#f1eeff 58%,#e9fff6);box-shadow:6px 6px 0 #17151f}
    .qt-tool-kicker{color:#6857ff;font-size:11px;font-weight:900;letter-spacing:.15em;text-transform:uppercase}.qt-tool-intro h1{margin:12px 0;color:#17151f;font-size:clamp(30px,5vw,48px);line-height:1.08;letter-spacing:-.04em;font-weight:900}.qt-tool-intro p{max-width:720px;color:#635d6c;font-size:15px;line-height:1.75}
    .qt-tool-workspace{margin-top:28px;padding:24px;border:1px solid var(--qt-line);border-radius:22px;background:var(--qt-panel);box-shadow:0 10px 28px rgba(23,21,31,.08)}.qt-tool-workspace h2{margin:0 0 14px;font-size:20px;font-weight:900;color:var(--qt-text)}
    .qt-tool-details{margin-top:28px;padding:24px;border:1px solid var(--qt-line);border-radius:20px;background:var(--qt-panel)}.qt-tool-details h2{font-size:19px;font-weight:900;color:var(--qt-text);margin:0 0 10px}.qt-tool-details h3{font-size:16px;font-weight:800;color:var(--qt-text);margin:18px 0 6px}.qt-tool-details p,.qt-tool-details li{color:var(--qt-muted);line-height:1.75;font-size:14px}.qt-tool-details ol{padding-inline-start:20px}
    .qt-tool-details a{color:var(--qt-blue);font-weight:700}
    .qt-faq details{border-top:1px solid var(--qt-line);padding:12px 0}.qt-faq summary{cursor:pointer;font-weight:800;color:var(--qt-text);font-size:15px}.qt-faq details p{margin:8px 0 0}
    .qt-related{display:grid;grid-template-columns:repeat(auto-fill,minmax(210px,1fr));gap:10px;padding:0;margin:10px 0 0;list-style:none}.qt-related a{display:block;padding:12px 14px;border:1px solid var(--qt-line);border-radius:14px;text-decoration:none;font-weight:800;color:var(--qt-text)}.qt-related a small{display:block;margin-top:2px;font-weight:500;color:var(--qt-muted);font-size:12px}.qt-related a:hover{border-color:var(--qt-blue)}
    .qt-tool-footer{padding:22px;text-align:center;border-top:1px solid var(--qt-line);color:var(--qt-muted);font-size:12px}.qt-tool-footer a{margin:0 8px;color:var(--qt-blue);font-weight:800;text-decoration:none}
    html.dark .qt-tool-intro{background:linear-gradient(115deg,#1a1725,#242044 58%,#123934);border-color:#fff9ef;box-shadow:6px 6px 0 #fff9ef}html.dark .qt-tool-intro h1{color:#fff9ef}html.dark .qt-tool-intro p{color:#b6acbd}
    @media(max-width:600px){.qt-tool-header-inner{padding:10px 14px}.qt-tool-nav{gap:8px}.qt-tool-nav a{font-size:11px}.qt-tool-main{padding-top:18px}.qt-tool-intro{padding:23px 20px}.qt-tool-workspace,.qt-tool-details{padding:16px}}
  `;

const page = tool => {
  const c = seo[tool.id];
  if (!c) throw new Error('Missing SEO content for ' + tool.id);
  const url = `${site}/tools/${encodeURIComponent(tool.id)}/`;
  const pageTitle = `${c.title} | QantaraTools`;
  const desc = clip(c.desc, 155);
  const faqs = c.faq;
  const rel = related(tool);
  const graph = [
    { '@type': 'WebApplication', '@id': url + '#app', name: tool.title, url, description: c.desc, applicationCategory: appTypeOverride[tool.id] || appType[tool.category],
      operatingSystem: 'Any', browserRequirements: 'Requires JavaScript and a modern web browser', isAccessibleForFree: true, inLanguage: 'en',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' }, publisher: { '@id': site + '/#org' }, mainEntityOfPage: url },
    { '@type': 'Organization', '@id': site + '/#org', name: 'QantaraTools', url: site + '/', logo: site + '/assets/branding/qantara-mark.svg' },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'All tools', item: site + '/' },
      { '@type': 'ListItem', position: 2, name: tool.title, item: url } ] },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) }
  ];
  const jsonLd = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="en" dir="ltr">
<head>
  <meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(pageTitle)}</title>
  <meta name="description" content="${esc(desc)}">
  <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">
  <meta name="theme-color" content="#17151f">
  <link rel="canonical" href="${esc(url)}">
  <link rel="icon" type="image/svg+xml" href="/assets/branding/favicon.svg">
  <meta property="og:type" content="website"><meta property="og:site_name" content="QantaraTools"><meta property="og:locale" content="en_US">
  <meta property="og:title" content="${esc(pageTitle)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${esc(url)}">
  <meta property="og:image" content="${site}/assets/branding/og-image.png"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630">
  <meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(pageTitle)}"><meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${site}/assets/branding/og-image.png">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <link rel="stylesheet" href="/assets/css/custom.css">
  <link rel="stylesheet" href="/assets/css/theme-light.css">
  <script src="/assets/js/theme.js"></script>
  <script type="application/ld+json">${jsonLd}</script>
  <script>try{document.documentElement.classList.toggle('dark',localStorage.getItem('theme')!=='light');document.documentElement.dataset.identity=localStorage.getItem('visual_identity')||'electric';}catch(e){document.documentElement.classList.add('dark');}</script>
  <style>${css}</style>
</head>
<body class="qt-tool-page">
  <a class="skip-link" href="#tool-workspace">Skip to tool</a>
  <header class="qt-tool-header"><div class="qt-tool-header-inner">
    <a class="qt-tool-brand" href="/"><img src="/assets/branding/qantara-mark.svg" alt=""><span>Qantara<span>Tools</span></span></a>
    <nav class="qt-tool-nav" aria-label="Main navigation"><a href="/">All tools</a><a href="/about-us.html">About</a><a href="/contact.html">Contact</a><button type="button" class="qt-theme-btn" data-theme-toggle aria-label="Toggle theme"><i class="fa-solid fa-sun" aria-hidden="true"></i></button></nav>
  </div></header>
  <main class="qt-tool-main">
    <nav aria-label="Breadcrumb"><ol class="qt-crumbs"><li><a href="/">All tools</a></li><li>${esc(tool.category)}</li><li aria-current="page">${esc(tool.title)}</li></ol></nav>
    <section class="qt-tool-intro" aria-labelledby="tool-page-title">
      <span class="qt-tool-kicker">${esc(tool.category)} · Free browser tool</span>
      <h1 id="tool-page-title">${esc(tool.title)}</h1>
      <p>${esc(c.intro)}</p>
      <p>${esc(categoryText[tool.category] || categoryText['Core & Dev'])}</p>
    </section>
    <section id="tool-workspace" class="qt-tool-workspace" aria-labelledby="active-tool-title">
      <h2 id="active-tool-title">${esc(tool.title)}</h2>
      <div id="active-tool-box"><p role="status" aria-live="polite">Loading ${esc(tool.title)}…</p></div>
      <noscript><p>${esc(tool.title)} needs JavaScript to run in your browser. Please enable JavaScript to use this free tool.</p></noscript>
    </section>
    <section class="qt-tool-details" aria-labelledby="tool-uses-title">
      <h2 id="tool-uses-title">How to use ${esc(tool.title)}</h2>
      <p>${esc(tool.description)} It is free to use and runs in your browser. Tool behavior can vary by feature, so see the <a href="/privacy.html">Privacy Policy</a> before using sensitive content.</p>
      <ol>${steps[tool.category].map(s => `<li>${esc(s)}</li>`).join('')}</ol>
      <h2 id="faq-title" style="margin-top:22px">Frequently asked questions</h2>
      <div class="qt-faq">${faqs.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join('')}</div>
      <h2 style="margin-top:22px">More ${esc(tool.category)} tools</h2>
      <ul class="qt-related">${rel.map(r => `<li><a href="/tools/${encodeURIComponent(r.id)}/">${esc(r.title)}<small>${esc(clip(r.description, 70))}</small></a></li>`).join('')}</ul>
      <p style="margin-top:16px">Looking for something else? Browse the <a href="/">complete QantaraTools collection</a>.</p>
    </section>
  </main>
  <footer class="qt-tool-footer">© 2026 QantaraTools <a href="/">All tools</a><a href="/privacy.html">Privacy</a><a href="/terms.html">Terms</a></footer>
  <script src="/assets/js/external-resources.js"></script>
  <script src="/assets/js/consent.js"></script>
  <script src="/assets/js/plugin-system.js"></script>
  <script src="/assets/js/tool-feedback.js"></script>
  <script src="/assets/js/router.js"></script>
  <script src="/assets/js/accessibility.js"></script>
  <script>window.addEventListener('DOMContentLoaded',()=>{if(window.router)window.router.loadTool(${JSON.stringify(tool.category)},${JSON.stringify(tool.title)},${JSON.stringify(tool.id)});});</script>
</body></html>
`;
};

for (const tool of tools) {
  const out = path.join(root, 'tools', tool.id, 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page(tool));
}

const staticPages = ['/about-us.html', '/faq.html', '/contact.html', '/privacy.html', '/terms.html'];
const entries = [
  `  <url><loc>${site}/</loc><lastmod>${today}</lastmod></url>`,
  ...tools.map(t => `  <url><loc>${site}/tools/${t.id}/</loc><lastmod>${today}</lastmod></url>`),
  ...staticPages.map(p => `  <url><loc>${site}${p}</loc></url>`)
];
fs.writeFileSync(path.join(root, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${entries.join('\n')}\n</urlset>\n`);
console.log(`Generated ${tools.length} tool pages and sitemap.xml (${entries.length} URLs).`);
