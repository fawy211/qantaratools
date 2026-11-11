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
 if(!englishHome.includes('rel="canonical"')||!englishHome.includes('href="https://qantaratools.com/"')) errors.push('en/: wrong or missing canonical');
 validateHreflangs(englishHome,'en/');
 if(!englishHome.includes('assets/js/language-switcher.js')) errors.push('en/: shared language selector script missing');
}
for(const locale of locales){
 const home=path.join(root,locale,'index.html');
 if(!fs.existsSync(home)){errors.push(locale+': missing localized homepage');continue;}
 const homeHtml=fs.readFileSync(home,'utf8');
 if(!homeHtml.includes('lang="'+locale+'"')||!homeHtml.includes('rel="canonical"')) errors.push(locale+': homepage language/canonical missing');
 if(!homeHtml.includes('hreflang="ar"')||!homeHtml.includes('href="https://qantaratools.com/?locale=ar"')) errors.push(locale+': Arabic homepage hreflang missing');
 if(!homeHtml.includes('assets/js/language-switcher.js')) errors.push(locale+': shared language selector script missing');
 validateHreflangs(homeHtml,locale+'/');
 for(const tool of tools){
  const file=path.join(root,locale,'tools',tool.id,'index.html');
  if(!fs.existsSync(file)){errors.push(locale+'/'+tool.id+': page missing');continue;}
  const html=fs.readFileSync(file,'utf8');
  validateHreflangs(html,locale+'/'+tool.id);
  const checks=[
   [html.includes('lang="'+locale+'"'),'wrong or missing lang'],
   [html.includes('rel="canonical" href="https://qantaratools.com/'+locale+'/tools/'+tool.id+'/"'),'wrong or missing canonical'],
   [html.includes('hreflang="en"')&&html.includes('hreflang="de"')&&html.includes('hreflang="fr"')&&html.includes('hreflang="es"')&&html.includes('hreflang="ar"')&&html.includes('href="https://qantaratools.com/tools/'+tool.id+'/?locale=ar"'),'missing hreflang alternate'],
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
 if(!html.includes('href="https://qantaratools.com/tools/'+tool.id+'/?locale=ar"')) errors.push('en/'+tool.id+': Arabic hreflang URL missing');
 if(!html.includes('assets/js/language-switcher.js')) errors.push('en/'+tool.id+': shared language selector script missing');
}
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
if(!sitemap.includes('<loc>https://qantaratools.com/</loc>')) errors.push('en/: homepage absent from sitemap');
if(!sitemap.includes('<loc>https://qantaratools.com/?locale=ar</loc>')) errors.push('ar/: homepage absent from sitemap');
for(const tool of tools) if(!sitemap.includes('<loc>https://qantaratools.com/tools/'+tool.id+'/?locale=ar</loc>')) errors.push('ar/'+tool.id+': Arabic URL absent from sitemap');
for(const locale of locales){
 if(!sitemap.includes('https://qantaratools.com/'+locale+'/')) errors.push(locale+': homepage absent from sitemap');
 for(const tool of tools) if(!sitemap.includes('https://qantaratools.com/'+locale+'/tools/'+tool.id+'/')) errors.push(locale+'/'+tool.id+': sitemap URL missing');
}
if(errors.length){console.error('Localized page validation failed:\n'+errors.slice(0,50).map(x=>'- '+x).join('\n'));process.exitCode=1;}
else console.log('Localized page validation passed: English and Arabic homepages, 3 translated homepages, '+(tools.length*3)+' translated tool pages, '+tools.length+' English hreflang sets, and Arabic sitemap entries.');
