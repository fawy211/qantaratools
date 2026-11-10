#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const site = 'https://qantaratools.com';
const tools = JSON.parse(fs.readFileSync(path.join(root, 'tool-pages.json'), 'utf8'));
const seo = require('./seo-locales.js');
const locales = ['de', 'fr', 'es'];
const esc = v => String(v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L = {
de:{all:'Alle Tools',skip:'Zum Tool springen',free:'Kostenloses Browser-Tool',how:'So verwenden Sie dieses Tool',faq:'Häufig gestellte Fragen',more:'Weitere Tools dieser Kategorie',browse:'Alle QantaraTools entdecken',privacy:'Datenschutz',terms:'Nutzungsbedingungen',cat:{'Core & Dev':'Entwicklung & Programmierung','Business & Finance':'Business & Finanzen','PDF & Documents':'PDF & Dokumente','Security & Media':'Sicherheit & Medien','Text & Unicode':'Text & Unicode','Fun & Creative':'Kreativität & Spaß'},steps:{'Core & Dev':['Geben Sie Ihre Eingabe oben ein.','Wählen Sie die gewünschten Optionen und starten Sie die Verarbeitung.','Kopieren Sie das Ergebnis in Ihren Arbeitsablauf.'],'Business & Finance':['Geben Sie die benötigten Zahlen ein.','Prüfen Sie das Ergebnis und vergleichen Sie weitere Szenarien.','Notieren oder kopieren Sie die benötigten Angaben.'],'PDF & Documents':['Wählen Sie Ihre PDF- oder Quelldateien aus.','Führen Sie den gewünschten Vorgang aus.','Laden Sie die neue Datei herunter und prüfen Sie sie.'],'Security & Media':['Wählen Sie eine Datei oder legen Sie Ihre Optionen fest.','Passen Sie die verfügbaren Einstellungen an.','Prüfen und laden Sie das Ergebnis herunter.'],'Text & Unicode':['Fügen Sie Ihren Text ein.','Wählen Sie die gewünschte Aktion oder Formatierung.','Kopieren Sie den bearbeiteten Text.'],'Fun & Creative':['Geben Sie Text oder Optionen ein.','Erstellen oder bearbeiten Sie das Ergebnis.','Kopieren oder speichern Sie die Ausgabe.']}},
fr:{all:'Tous les outils',skip:'Accéder à l’outil',free:'Outil gratuit dans le navigateur',how:'Comment utiliser cet outil',faq:'Questions fréquentes',more:'Autres outils de cette catégorie',browse:'Découvrir tous les outils QantaraTools',privacy:'Confidentialité',terms:'Conditions d’utilisation',cat:{'Core & Dev':'Développement','Business & Finance':'Entreprise et finance','PDF & Documents':'PDF et documents','Security & Media':'Sécurité et médias','Text & Unicode':'Texte et Unicode','Fun & Creative':'Créativité et loisirs'},steps:{'Core & Dev':['Saisissez votre contenu dans l’outil ci-dessus.','Choisissez les options souhaitées et lancez le traitement.','Copiez le résultat dans votre projet.'],'Business & Finance':['Saisissez les valeurs nécessaires.','Vérifiez le résultat et comparez plusieurs scénarios.','Copiez ou notez les informations utiles.'],'PDF & Documents':['Sélectionnez vos fichiers PDF ou sources.','Effectuez l’opération souhaitée.','Téléchargez et vérifiez le nouveau fichier.'],'Security & Media':['Choisissez un fichier ou définissez vos options.','Ajustez les paramètres disponibles.','Vérifiez et téléchargez le résultat.'],'Text & Unicode':['Collez ou saisissez votre texte.','Choisissez l’opération ou la mise en forme.','Copiez le texte traité.'],'Fun & Creative':['Saisissez votre texte ou vos options.','Générez ou ajustez le résultat.','Copiez ou enregistrez le résultat.']}},
es:{all:'Todas las herramientas',skip:'Ir a la herramienta',free:'Herramienta gratuita en el navegador',how:'Cómo utilizar esta herramienta',faq:'Preguntas frecuentes',more:'Más herramientas de esta categoría',browse:'Explorar todas las herramientas de QantaraTools',privacy:'Privacidad',terms:'Términos y condiciones',cat:{'Core & Dev':'Desarrollo','Business & Finance':'Negocios y finanzas','PDF & Documents':'PDF y documentos','Security & Media':'Seguridad y medios','Text & Unicode':'Texto y Unicode','Fun & Creative':'Creatividad y ocio'},steps:{'Core & Dev':['Introduce tu contenido en la herramienta.','Elige las opciones e inicia el proceso.','Copia el resultado en tu proyecto.'],'Business & Finance':['Introduce los valores necesarios.','Revisa el resultado y compara escenarios.','Copia o anota la información que necesites.'],'PDF & Documents':['Selecciona tus archivos PDF o de origen.','Realiza la operación que necesitas.','Descarga y revisa el archivo nuevo.'],'Security & Media':['Elige un archivo o configura las opciones.','Ajusta los parámetros disponibles.','Previsualiza y descarga el resultado.'],'Text & Unicode':['Pega o escribe tu texto.','Elige la operación o el formato.','Copia el texto procesado.'],'Fun & Creative':['Introduce texto u opciones.','Genera o ajusta el resultado.','Copia o guarda el contenido.']}}
};
const groups = {};
tools.forEach(t => (groups[t.category] ||= []).push(t));
function render(tool, locale) {
 const r = seo[locale] && seo[locale][tool.id];
 if (!r || !r.title || !r.desc || !r.intro || !Array.isArray(r.faq) || r.faq.length < 2) throw new Error('Incomplete '+locale+' SEO record: '+tool.id);
 const l=L[locale], cat=l.cat[tool.category] || tool.category;
 const url=site+'/'+locale+'/tools/'+tool.id+'/';
 const alternates=['en','de','fr','es'].map(code=>'<link rel="alternate" hreflang="'+code+'" href="'+site+(code==='en'?'':'/'+code)+'/tools/'+tool.id+'/">').join('\n')+'\n<link rel="alternate" hreflang="x-default" href="'+site+'/tools/'+tool.id+'/">';
 const graph={'@context':'https://schema.org','@graph':[
 {'@type':'WebApplication',name:r.title,url:url,description:r.desc,applicationCategory:'UtilitiesApplication',operatingSystem:'Any',inLanguage:locale,publisher:{'@type':'Organization',name:'QantaraTools',url:site+'/'}},
 {'@type':'FAQPage',mainEntity:r.faq.map(x=>({'@type':'Question',name:x[0],acceptedAnswer:{'@type':'Answer',text:x[1]}}))}
 ]};
 const related=(groups[tool.category]||[]).filter(x=>x.id!==tool.id).slice(0,4).map(x=>{
 const rr=seo[locale][x.id]; return rr?'<li><a href="/'+locale+'/tools/'+x.id+'/">'+esc(rr.title)+'</a></li>':'';
 }).join('');
 const steps=(l.steps[tool.category]||l.steps['Core & Dev']).map(x=>'<li>'+esc(x)+'</li>').join('');
 const faq=r.faq.map(x=>'<details><summary>'+esc(x[0])+'</summary><p>'+esc(x[1])+'</p></details>').join('');
 const title=esc(r.title+' | QantaraTools');
 const nav=[['English','/tools/'+tool.id+'/','en'],['Deutsch','/de/tools/'+tool.id+'/','de'],['Français','/fr/tools/'+tool.id+'/','fr'],['Español','/es/tools/'+tool.id+'/','es'],['العربية','/tools/'+tool.id+'/?locale=ar','ar']].map(x=>'<a href="'+x[1]+'" data-locale-link="'+x[2]+'">'+x[0]+'</a>').join('');
 return '<!doctype html><html lang="'+locale+'" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'+
 '<title>'+title+'</title><meta name="description" content="'+esc(r.desc.slice(0,155))+'"><meta name="robots" content="index,follow">'+
 '<link rel="canonical" href="'+url+'">'+alternates+
 '<meta property="og:type" content="website"><meta property="og:site_name" content="QantaraTools"><meta property="og:title" content="'+title+'"><meta property="og:description" content="'+esc(r.desc)+'"><meta property="og:url" content="'+url+'"><meta property="og:locale" content="'+({de:'de_DE',fr:'fr_FR',es:'es_ES'}[locale])+'">'+
 '<meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/branding/favicon.svg">'+
 '<link rel="stylesheet" href="/assets/css/custom.css"><link rel="stylesheet" href="/assets/css/theme-light.css"><script src="/assets/js/theme.js"></script>'+
 '<script type="application/ld+json">'+JSON.stringify(graph).replace(/</g,'\\u003c')+'</script>'+
 '<style>body{font-family:Outfit,Arial,sans-serif}.qt-loc-head{padding:14px 5%;border-bottom:1px solid var(--qt-line);display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}.qt-loc-head a{color:var(--qt-blue);font-weight:700;text-decoration:none}.qt-loc-main{max-width:960px;width:94%;margin:28px auto 60px}.qt-loc-panel{padding:24px;margin:18px 0;border:1px solid var(--qt-line);border-radius:18px;background:var(--qt-panel)}h1{font-size:clamp(28px,5vw,44px);line-height:1.12;color:var(--qt-text)}h2{font-size:20px;color:var(--qt-text)}p,li{line-height:1.75;color:var(--qt-muted)}summary{cursor:pointer;font-weight:700;color:var(--qt-text);padding:12px 0;border-top:1px solid var(--qt-line)}.qt-loc-related{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;padding:0;list-style:none}.qt-loc-related a{display:block;padding:12px;border:1px solid var(--qt-line);border-radius:12px}.qt-loc-footer{text-align:center;padding:20px;color:var(--qt-muted);border-top:1px solid var(--qt-line)}</style></head><body class="qt-tool-page">'+
 '<header class="qt-loc-head"><a href="/'+locale+'/">QantaraTools</a><nav>'+nav+'</nav></header>'+
 '<main class="qt-loc-main"><section class="qt-loc-panel"><p>'+esc(cat)+' · '+esc(l.free)+'</p><h1>'+esc(r.title)+'</h1><p>'+esc(r.intro)+'</p></section>'+
 '<section id="tool-workspace" class="qt-loc-panel"><h2>'+esc(r.title)+'</h2><div id="active-tool-box"><p role="status">…</p></div></section>'+
 '<section class="qt-loc-panel"><h2>'+esc(l.how)+'</h2><p>'+esc(r.desc)+'</p><ol>'+steps+'</ol><h2>'+esc(l.faq)+'</h2>'+faq+
 '<h2>'+esc(l.more)+'</h2><ul class="qt-loc-related">'+related+'</ul><p><a href="/'+locale+'/">'+esc(l.browse)+'</a></p></section></main>'+
 '<footer class="qt-loc-footer">© 2026 QantaraTools · <a href="/privacy.html">'+esc(l.privacy)+'</a> · <a href="/terms.html">'+esc(l.terms)+'</a></footer>'+
 '<script src="/assets/js/external-resources.js"></script><script src="/assets/js/consent.js"></script><script src="/assets/js/plugin-system.js"></script><script src="/assets/js/tool-feedback.js"></script><script src="/assets/js/i18n.js"></script><script src="/assets/js/router.js"></script><script src="/assets/js/accessibility.js"></script>'+
 '<script>document.querySelectorAll("[data-locale-link]").forEach(function(a){a.addEventListener("click",function(){try{localStorage.setItem("qantaratools_language_v1",a.dataset.localeLink);if(window.QTI18n&&window.QTI18n.setLocale)window.QTI18n.setLocale(a.dataset.localeLink);}catch(e){}});});</script>'+'<script>window.addEventListener("DOMContentLoaded",function(){if(window.router)window.router.loadTool('+JSON.stringify(tool.category)+','+JSON.stringify(tool.title)+','+JSON.stringify(tool.id)+');});</script></body></html>';
}

function renderHome(locale) {
 const l=L[locale], groups={};
 tools.forEach(t=>(groups[t.category] ||= []).push(t));
 const cards=Object.keys(groups).map(category=>{
  const list=groups[category].map(t=>'<li><a href="/'+locale+'/tools/'+t.id+'/">'+esc(seo[locale][t.id].title)+'</a></li>').join('');
  return '<section class="qt-loc-panel"><h2>'+esc(l.cat[category]||category)+'</h2><ul class="qt-loc-related">'+list+'</ul></section>';
 }).join('');
 const desc=locale==='de'?'Kostenlose Browser-Tools für Dokumente, Text, Bilder, Entwicklung und den Alltag.':locale==='fr'?'Des outils gratuits dans le navigateur pour les documents, le texte, les images, le développement et les tâches quotidiennes.':'Herramientas gratuitas en el navegador para documentos, texto, imágenes, desarrollo y tareas cotidianas.';
 const title=locale==='de'?'Kostenlose Online-Tools | QantaraTools':locale==='fr'?'Outils en ligne gratuits | QantaraTools':'Herramientas online gratuitas | QantaraTools';
 const alternates=['en','de','fr','es'].map(code=>'<link rel="alternate" hreflang="'+code+'" href="'+site+(code==='en'?'':'/'+code)+'/">').join('');
 const languageNav=[['English','/','en'],['Deutsch','/de/','de'],['Français','/fr/','fr'],['Español','/es/','es'],['العربية','/','ar']].map(x=>'<a href="'+x[1]+'" data-locale-link="'+x[2]+'">'+x[0]+'</a>').join('');
 return '<!doctype html><html lang="'+locale+'" dir="ltr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>'+esc(title)+'</title><meta name="description" content="'+esc(desc)+'"><link rel="canonical" href="'+site+'/'+locale+'/">'+alternates+'<link rel="alternate" hreflang="x-default" href="'+site+'/"><link rel="stylesheet" href="/assets/css/custom.css"><link rel="stylesheet" href="/assets/css/theme-light.css"><script src="/assets/js/theme.js"></script><style>body{font-family:Outfit,Arial,sans-serif}.qt-loc-head{padding:14px 5%;border-bottom:1px solid var(--qt-line);display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap}.qt-loc-head a{color:var(--qt-blue);font-weight:700;text-decoration:none}.qt-loc-main{max-width:1120px;width:94%;margin:28px auto 60px}.qt-loc-panel{padding:22px;margin:18px 0;border:1px solid var(--qt-line);border-radius:18px;background:var(--qt-panel)}h1,h2{color:var(--qt-text)}p,li{line-height:1.7;color:var(--qt-muted)}.qt-loc-related{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;padding:0;list-style:none}.qt-loc-related a{display:block;padding:10px;border:1px solid var(--qt-line);border-radius:10px}.qt-loc-footer{text-align:center;padding:20px;color:var(--qt-muted)}</style></head><body><header class="qt-loc-head"><a href="/'+locale+'/">QantaraTools</a><nav>'+languageNav+'</nav></header><main class="qt-loc-main"><section class="qt-loc-panel"><h1>'+esc(title)+'</h1><p>'+esc(desc)+'</p></section>'+cards+'</main><footer class="qt-loc-footer">© 2026 QantaraTools · <a href="/privacy.html">'+esc(l.privacy)+'</a> · <a href="/terms.html">'+esc(l.terms)+'</a></footer><script src="/assets/js/i18n.js"></script><script>document.querySelectorAll("[data-locale-link]").forEach(function(a){a.addEventListener("click",function(){try{localStorage.setItem("qantaratools_language_v1",a.dataset.localeLink);if(window.QTI18n&&window.QTI18n.setLocale)window.QTI18n.setLocale(a.dataset.localeLink);}catch(e){}});});</script></body></html>';
}

const sitemapPath=path.join(root,'sitemap.xml');
let sitemap=fs.existsSync(sitemapPath)?fs.readFileSync(sitemapPath,'utf8'):'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>\n';
const entries=[];
for(const locale of locales){
 const home=path.join(root,locale,'index.html');
 fs.mkdirSync(path.dirname(home),{recursive:true});
 fs.writeFileSync(home,renderHome(locale));
 entries.push('<url><loc>'+site+'/'+locale+'/</loc></url>');
}
for(const locale of locales) for(const tool of tools){
 const out=path.join(root,locale,'tools',tool.id,'index.html');
 fs.mkdirSync(path.dirname(out),{recursive:true});
 fs.writeFileSync(out,render(tool,locale));
 entries.push('<url><loc>'+site+'/'+locale+'/tools/'+tool.id+'/</loc></url>');
}
for(const tool of tools){
 const p=path.join(root,'tools',tool.id,'index.html');
 if(!fs.existsSync(p)) continue;
 let html=fs.readFileSync(p,'utf8');
 let changed=false;
 if(!html.includes('data-locale-link="de"')){
  const languageLinks='<a href="/tools/'+tool.id+'/" data-locale-link="en">English</a><a href="/de/tools/'+tool.id+'/" data-locale-link="de">Deutsch</a><a href="/fr/tools/'+tool.id+'/" data-locale-link="fr">Français</a><a href="/es/tools/'+tool.id+'/" data-locale-link="es">Español</a><a href="/tools/'+tool.id+'/?locale=ar" data-locale-link="ar">العربية</a>';
  if(html.includes('</nav>')) html=html.replace('</nav>',languageLinks+'</nav>');
  else html=html.replace('</header>', '<nav class="qt-locale-switch">'+languageLinks+'</nav></header>');
  changed=true;
 }
 const localeBootstrap='<script>(function(){var m=location.search.match(/[?&]locale=([a-z]{2})(?:&|$)/i);if(m&&m[1].toLowerCase()==="ar"){document.documentElement.lang="ar";document.documentElement.dir="rtl";document.documentElement.dataset.locale="ar";}})();</script>';
 if(!html.includes('dataset.locale="ar"')){html=html.replace('</head>',localeBootstrap+'</head>');changed=true;}
 if(html.includes('/assets/js/i18n.js')&&!html.includes('qantaratools_language_v1')){
  html=html.replace('<script src="/assets/js/i18n.js"></script>','<script src="/assets/js/i18n.js"></script><script>document.querySelectorAll("[data-locale-link]").forEach(function(a){a.addEventListener("click",function(){try{localStorage.setItem("qantaratools_language_v1",a.dataset.localeLink);if(window.QTI18n&&window.QTI18n.setLocale)window.QTI18n.setLocale(a.dataset.localeLink);}catch(e){}});});</script>');
  changed=true;
 }
 if(!html.includes('hreflang="de"')){
  const tags=['en','de','fr','es'].map(code=>'<link rel="alternate" hreflang="'+code+'" href="'+site+(code==='en'?'':'/'+code)+'/tools/'+tool.id+'/">').join('\n  ')+'\n  <link rel="alternate" hreflang="x-default" href="'+site+'/tools/'+tool.id+'/">';
  html=html.replace(/<link rel="canonical" href="([^"]+)">/,m=>m+'\n  '+tags);
  changed=true;
 }
 if(changed) fs.writeFileSync(p,html);
}
if(!sitemap.includes('/de/tools/')) sitemap=sitemap.replace('</urlset>',entries.join('\n')+'\n</urlset>');
fs.writeFileSync(sitemapPath,sitemap);
console.log('Generated '+(tools.length*locales.length)+' localized tool pages and updated hreflang/sitemap entries.');
