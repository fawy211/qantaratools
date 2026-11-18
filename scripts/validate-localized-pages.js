#!/usr/bin/env node
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const tools=JSON.parse(fs.readFileSync(path.join(root,'tool-pages.json'),'utf8'));
const locales=['de','fr','es'];
const errors=[];
const expectedHreflangs=['en','de','fr','es','ar','x-default'];
function validateHreflangs(html,label){
 const found=[...html.matchAll(/<link\b(?=[^>]*\brel=["']alternate["'])[^>]*\bhreflang=["']([^"']+)["'][^>]*>/gi)].map(m=>m[1].toLowerCase());
 for(const code of expectedHreflangs){
  const count=found.filter(value=>value===code).length;
  if(count!==1) errors.push(label+': expected exactly one hreflang="'+code+'", found '+count);
 }
 for(const code of found) if(!expectedHreflangs.includes(code)) errors.push(label+': unexpected hreflang="'+code+'"');
}
const englishHomePath=path.join(root,'index.html');
if(!fs.existsSync(englishHomePath)){
 errors.push('en/: missing English homepage');
}else{
 const englishHome=fs.readFileSync(englishHomePath,'utf8');
 if(!/<html\b[^>]*\blang="en"/i.test(englishHome)) errors.push('en/: wrong or missing lang');
 if(!englishHome.includes('dir="ltr"')) errors.push('en/: wrong or missing text direction');
 if(!englishHome.includes('rel="canonical"')||!englishHome.includes('href="https://www.qantaratools.com/"')) errors.push('en/: wrong or missing canonical');
 validateHreflangs(englishHome,'en/');
 if(!englishHome.includes('assets/js/language-switcher.js')) errors.push('en/: shared language selector script missing');
}
for(const locale of locales){
 const home=path.join(root,locale,'index.html');
 if(!fs.existsSync(home)){errors.push(locale+': missing localized homepage');continue;}
 const homeHtml=fs.readFileSync(home,'utf8');
 if(!homeHtml.includes('lang="'+locale+'"')||!homeHtml.includes('rel="canonical"')) errors.push(locale+': homepage language/canonical missing');
 if(!homeHtml.includes('hreflang="ar"')||!homeHtml.includes('href="https://www.qantaratools.com/?locale=ar"')) errors.push(locale+': Arabic homepage hreflang missing');
 if(!homeHtml.includes('assets/js/language-switcher.js')) errors.push(locale+': shared language selector script missing');
 // Localized homepages must be generated from the same complete product template.
 const homeFeatures=[
  ['id="site-header"','site header missing'],
  ['id="hero-title"','hero title missing'],
  ['id="hero-desc"','hero description missing'],
  ['id="tool-search-input"','tool search missing'],
  ['class="category-nav','category navigation missing'],
  ['id="recent-tools-list"','recent tools missing'],
  ['id="favorite-tools-list"','favorites missing'],
  ['qt-featured-wrap','featured Office tool missing'],
  // The site intentionally supports only the light/dark theme toggle; legacy color identity presets were removed.
  ['data-theme-toggle','theme control missing'],
  ['id="request-modal"','tool request modal missing'],
  ['id="site-footer"','site footer missing'],
  ['assets/css/qt-redesign.css','shared redesign stylesheet missing'],
  ['assets/css/theme-light.css','shared theme stylesheet missing']
 ];
 for(const [needle,message] of homeFeatures) if(!homeHtml.includes(needle)) errors.push(locale+': '+message);
 const homeToolLinks=homeHtml.match(/qt-tool-permalink/g)||[];
 if(homeToolLinks.length!==tools.length) errors.push(locale+': expected '+tools.length+' homepage tool cards, found '+homeToolLinks.length);
 for(const tool of tools) if(!homeHtml.includes('href="/'+locale+'/tools/'+tool.id+'/')) errors.push(locale+'/'+tool.id+': localized homepage tool link missing');
 validateHreflangs(homeHtml,locale+'/');
 for(const tool of tools){
  const file=path.join(root,locale,'tools',tool.id,'index.html');
  if(!fs.existsSync(file)){errors.push(locale+'/'+tool.id+': page missing');continue;}
  const html=fs.readFileSync(file,'utf8');
  validateHreflangs(html,locale+'/'+tool.id);
  const checks=[
   [html.includes('lang="'+locale+'"'),'wrong or missing lang'],
   [html.includes('rel="canonical" href="https://www.qantaratools.com/'+locale+'/tools/'+tool.id+'/"'),'wrong or missing canonical'],
   [html.includes('hreflang="en"')&&html.includes('hreflang="de"')&&html.includes('hreflang="fr"')&&html.includes('hreflang="es"')&&html.includes('hreflang="ar"')&&html.includes('href="https://www.qantaratools.com/tools/'+tool.id+'/?locale=ar"'),'missing hreflang alternate'],
   [html.includes('hreflang="x-default"'),'missing x-default'],
   [html.includes('application/ld+json')&&html.includes('"inLanguage":"'+locale+'"'),'missing localized structured data'],
   [html.includes('/assets/js/i18n.js')&&html.includes('/assets/js/router.js'),'tool runtime scripts missing'],
   [html.includes('assets/js/language-switcher.js'),'shared language selector script missing'],
   [(html.match(/<details>/g)||[]).length>=2,'fewer than two FAQ entries']
  ];
  for(const [ok,message] of checks) if(!ok) errors.push(locale+'/'+tool.id+': '+message);
 }
}
for(const tool of tools){
 const file=path.join(root,'tools',tool.id,'index.html');
 if(!fs.existsSync(file)){errors.push('en/'+tool.id+': page missing');continue;}
 const html=fs.readFileSync(file,'utf8');
 validateHreflangs(html,'en/'+tool.id);
 if(!html.includes('href="https://www.qantaratools.com/tools/'+tool.id+'/?locale=ar"')) errors.push('en/'+tool.id+': Arabic hreflang URL missing');
 if(!html.includes('assets/js/language-switcher.js')) errors.push('en/'+tool.id+': shared language selector script missing');
}
// Arabic static legal pages are generated separately because the existing locale
// generator only creates German, French, and Spanish legal routes.
const arabicLegalPages=['about-us','contact','faq','privacy','terms'];
for(const slug of arabicLegalPages){
 const label='ar/'+slug;
 const file=path.join(root,'ar',slug,'index.html');
 if(!fs.existsSync(file)){errors.push(label+': static Arabic page missing');continue;}
 const html=fs.readFileSync(file,'utf8');
 if(!/<html\b[^>]*\blang="ar"[^>]*\bdir="rtl"/i.test(html)) errors.push(label+': missing Arabic lang/RTL');
 if(!html.includes('rel="canonical" href="https://www.qantaratools.com/ar/'+slug+'/"')) errors.push(label+': canonical missing or incorrect');
 if(!html.includes('hreflang="ar"')) errors.push(label+': Arabic hreflang missing');
 if(!html.includes('<title>')||!html.includes('name="description"')) errors.push(label+': SEO title or description missing');
 if(!html.includes('/assets/js/theme.js')) errors.push(label+': theme script missing');
 const visible=html.replace(/<script[\s\S]*?<\/script>/gi,'').replace(/<style[\s\S]*?<\/style>/gi,'').replace(/<[^>]+>/g,' ').replace(/&(?:nbsp|amp|lt|gt|quot);/g,' ').replace(/\s+/g,' ');
 const englishTerms=/\b(?:About Us|Contact Us|Privacy Policy|Terms of Service|Frequently Asked Questions|Skip to main content|Last updated|What is QantaraTools|Do I need to install anything)\b/i;
 if(englishTerms.test(visible)) errors.push(label+': untranslated English copy found');
 for(const href of [...html.matchAll(/href="([^"]+)"/g)].map(m=>m[1])){
  if(href.startsWith('/ar/')){
   const target=href.endsWith('/')?path.join(root,href.slice(1),'index.html'):path.join(root,href.slice(1));
   if(!fs.existsSync(target)) errors.push(label+': broken internal Arabic link '+href);
  }
 }
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
if(!sitemap.includes('<loc>https://www.qantaratools.com/</loc>')) errors.push('en/: homepage absent from sitemap');
if(!sitemap.includes('<loc>https://www.qantaratools.com/?locale=ar</loc>')) errors.push('ar/: homepage absent from sitemap');
for(const tool of tools) if(!sitemap.includes('<loc>https://www.qantaratools.com/tools/'+tool.id+'/?locale=ar</loc>')) errors.push('ar/'+tool.id+': Arabic URL absent from sitemap');
for(const locale of locales){
 if(!sitemap.includes('https://www.qantaratools.com/'+locale+'/')) errors.push(locale+': homepage absent from sitemap');
 for(const tool of tools) if(!sitemap.includes('https://www.qantaratools.com/'+locale+'/tools/'+tool.id+'/')) errors.push(locale+'/'+tool.id+': sitemap URL missing');
}
if(errors.length){console.error('Localized page validation failed:\n'+errors.slice(0,50).map(x=>'- '+x).join('\n'));process.exitCode=1;}
else console.log('Localized page validation passed: English and Arabic homepages, 3 translated homepages, '+(tools.length*3)+' translated tool pages, '+tools.length+' English hreflang sets, and Arabic sitemap entries.');
