const PDF_LIB_URL = 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js';
const JSPDF_URL = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';

function esc(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));}
function baseUI(title, desc){return `<div class="max-w-4xl mx-auto"><div class="mb-6"><h2 class="text-2xl font-bold text-slate-100">${title}</h2><p class="text-slate-400 mt-2">${desc}</p></div></div>`;}
function loadScript(src){
  const key = src.includes('pdf-lib') ? 'pdfLib' : 'jsPdf';
  if(key==='pdfLib' && window.PDFLib) return Promise.resolve();
  if(key==='jsPdf' && window.jspdf) return Promise.resolve();
  if(window.QTExternal) return window.QTExternal.loadScript(key,{error:'This PDF tool needs a helper library. Please allow internet access, then try again.'});
  return new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.async=true;s.onload=resolve;s.onerror=()=>reject(new Error('This PDF tool needs a helper library. Please allow internet access, then try again.'));document.head.appendChild(s);});
}
function downloadBlob(blob,name){const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);}
function downloadBytes(bytes,name){downloadBlob(new Blob([bytes],{type:'application/pdf'}),name);}
function setMsg(root,text,isError=false){const el=root.querySelector('[data-pdf-msg]');if(el){el.textContent=text;el.className='mt-4 text-sm '+(isError?'text-red-400':'text-slate-400');}}
function ensureFileSize(file,maxMB=50){if(file && file.size>maxMB*1024*1024)throw Error(`This file is larger than ${maxMB} MB. Please choose a smaller PDF to keep the browser responsive.`);}
function friendlyError(e){const m=String(e?.message||e||'Something went wrong.');if(/encrypted|password|decrypt/i.test(m))return 'This PDF is password-protected or encrypted. Please unlock it first, then try again.';if(/Invalid PDF|Failed to parse|Expected a PDF|No PDF header/i.test(m))return 'This does not look like a valid PDF file.';if(/memory|allocation|out of/i.test(m))return 'The PDF is too large or complex for this browser session. Try a smaller file.';return m;}
function fileInput(multiple=false){return `<input data-pdf-files type="file" accept="application/pdf" ${multiple?'multiple':''} class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"/>`;}
function btn(id,label){return `<button id="${id}" type="button" class="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold">${label}</button>`;}
function msg(){return `<div data-pdf-msg class="mt-4 text-sm text-slate-400" aria-live="polite"></div>`;}
function busy(root,button,label){button.disabled=true;button.dataset.oldLabel=button.textContent;button.textContent=label;button.classList.add('opacity-60','cursor-wait');return ()=>{button.disabled=false;button.textContent=button.dataset.oldLabel||'Create PDF';button.classList.remove('opacity-60','cursor-wait');};}
function parsePageList(value,pageCount){
  const raw=String(value||'').trim();
  if(!raw) throw Error('Enter the page numbers you want.');
  const result=[]; const seen=new Set();
  for(const part of raw.split(',')){
    const p=part.trim(); if(!p) continue;
    if(/^\d+$/.test(p)){const n=Number(p);if(n<1||n>pageCount)throw Error(`Page ${n} is outside this PDF.`);if(!seen.has(n)){seen.add(n);result.push(n-1);}continue;}
    const m=p.match(/^(\d+)\s*-\s*(\d+)$/); if(!m) throw Error(`Invalid page range: ${p}`);
    const a=Number(m[1]),b=Number(m[2]); if(a<1||b<a||b>pageCount)throw Error(`Invalid page range: ${p}`);
    for(let n=a;n<=b;n++){if(!seen.has(n)){seen.add(n);result.push(n-1);}}
  }
  if(!result.length) throw Error('Enter at least one valid page.');
  return result;
}
async function ensurePdfLib(){
  if(window.PDFLib) return window.PDFLib;
  if(window.QTExternal) await window.QTExternal.loadScript('pdfLib',{error:'PDF helper library could not be loaded. Please check your internet connection and try again.'});
  if(!window.PDFLib) throw new Error('PDF helper library could not be loaded. Please refresh the page and try again.');
  return window.PDFLib;
}
async function readPdf(file){
  const lib=await ensurePdfLib();
  return lib.PDFDocument.load(await file.arrayBuffer(),{updateMetadata:false,ignoreEncryption:false});
}

export class PdfMergeTool{
  constructor(id){this.root=document.getElementById(id);this.root.innerHTML=baseUI('PDF Merge','Combine two or more PDF files into one. Files are processed in the order you select them.');this.root.innerHTML+=fileInput(true)+`<p class="mt-2 text-xs text-slate-500">Tip: select files in the order you want them to appear.</p>`+btn('go','Merge PDFs')+msg();
    this.root.querySelector('#go').onclick=async()=>{const button=this.root.querySelector('#go');let done=()=>{};try{const files=[...this.root.querySelector('[data-pdf-files]').files];if(files.length<2)throw Error('Choose at least two PDF files.');files.forEach(f=>ensureFileSize(f));done=busy(this.root,button,'Merging…');setMsg(this.root,'Reading PDF files…');const PDFLib=await ensurePdfLib(); const out=await PDFLib.PDFDocument.create();for(let i=0;i<files.length;i++){setMsg(this.root,`Adding file ${i+1} of ${files.length}…`);const src=await readPdf(files[i]);const pages=await out.copyPages(src,src.getPageIndices());pages.forEach(p=>out.addPage(p));}const bytes=await out.save({useObjectStreams:true,addDefaultPage:false});downloadBytes(bytes,'merged.pdf');setMsg(this.root,`Done. ${files.length} PDFs merged into one file.`);}catch(e){setMsg(this.root,friendlyError(e),true);}finally{done();}};
  }
}

export class PdfSplitTool{
  constructor(id){this.root=document.getElementById(id);this.root.innerHTML=baseUI('PDF Split & Page Extractor','Extract the pages you need. You can enter a range such as 1-3 or a list such as 1,4,7.');this.root.innerHTML+=fileInput()+`<div class="mt-4"><label class="block text-sm text-slate-400 mb-2">Pages</label><input id="pages" placeholder="Example: 1-3, 5, 8" class="w-full p-3 rounded-lg bg-slate-800 text-white"/></div>`+btn('go','Extract Pages')+msg();
    this.root.querySelector('#go').onclick=async()=>{const button=this.root.querySelector('#go');let done=()=>{};try{const f=this.root.querySelector('[data-pdf-files]').files[0];if(!f)throw Error('Choose a PDF.');ensureFileSize(f);done=busy(this.root,button,'Extracting…');const src=await readPdf(f);const nums=parsePageList(this.root.querySelector('#pages').value,src.getPageCount());const PDFLib=await ensurePdfLib(); const out=await PDFLib.PDFDocument.create();const pages=await out.copyPages(src,nums);pages.forEach(p=>out.addPage(p));downloadBytes(await out.save({useObjectStreams:true,addDefaultPage:false}),'extracted-pages.pdf');setMsg(this.root,`Done. Extracted ${nums.length} page${nums.length===1?'':'s'}.`);}catch(e){setMsg(this.root,friendlyError(e),true);}finally{done();}};
  }
}

export class PdfPageTool{
  constructor(id,mode){this.root=document.getElementById(id);this.mode=mode;const title=mode==='rotate'?'PDF Page Rotator':'PDF Page Reorder';const desc=mode==='rotate'?'Rotate all pages or only selected pages.':'Reorder pages with numbers and ranges, for example 3,1,4-6,2.';this.root.innerHTML=baseUI(title,desc);if(mode==='rotate'){this.root.innerHTML+=fileInput()+`<div class="mt-4 grid gap-3 md:grid-cols-2"><div><label class="block text-sm text-slate-400 mb-2">Pages</label><input id="pages" placeholder="All pages" class="w-full p-3 rounded-lg bg-slate-800 text-white"/><p class="text-xs text-slate-500 mt-1">Leave empty to rotate every page.</p></div><div><label class="block text-sm text-slate-400 mb-2">Rotation</label><select id="degrees" class="w-full p-3 rounded-lg bg-slate-800 text-white"><option value="90">90° clockwise</option><option value="180">180°</option><option value="270">270° clockwise</option></select></div></div>`+btn('go','Create Rotated PDF')+msg();}
    else{this.root.innerHTML+=fileInput()+`<div class="mt-4"><label class="block text-sm text-slate-400 mb-2">New page order</label><input id="pages" placeholder="Example: 3,1,4-6,2" class="w-full p-3 rounded-lg bg-slate-800 text-white"/><p class="text-xs text-slate-500 mt-1">Each page is included once. The order you enter is the output order.</p></div>`+btn('go','Reorder PDF')+msg();}
    this.root.querySelector('#go').onclick=async()=>{const button=this.root.querySelector('#go');let done=()=>{};try{const f=this.root.querySelector('[data-pdf-files]').files[0];if(!f)throw Error('Choose a PDF.');ensureFileSize(f);done=busy(this.root,button,'Working…');const src=await readPdf(f);const count=src.getPageCount();const PDFLib=await ensurePdfLib(); const out=await PDFLib.PDFDocument.create();if(mode==='rotate'){const raw=this.root.querySelector('#pages').value.trim();const selected=raw?new Set(parsePageList(raw,count)):new Set(Array.from({length:count},(_,i)=>i));const deg=Number(this.root.querySelector('#degrees').value);const PDFLib=await ensurePdfLib(); const pages=await out.copyPages(src,src.getPageIndices());pages.forEach((p,i)=>{if(selected.has(i))p.setRotation(PDFLib.degrees(p.getRotation().angle+deg));out.addPage(p);});downloadBytes(await out.save({useObjectStreams:true,addDefaultPage:false}),'rotated.pdf');setMsg(this.root,raw?`Done. Rotated ${selected.size} page${selected.size===1?'':'s'}.`:'Done. Rotated all pages.');}
      else{const nums=parsePageList(this.root.querySelector('#pages').value,count);if(nums.length!==count)throw Error(`Enter all ${count} pages exactly once for a complete reorder.`);const pages=await out.copyPages(src,nums);pages.forEach(p=>out.addPage(p));downloadBytes(await out.save({useObjectStreams:true,addDefaultPage:false}),'reordered.pdf');setMsg(this.root,'Done. Pages reordered successfully.');}}
    catch(e){setMsg(this.root,friendlyError(e),true);}finally{done();}};
  }
}
export class PdfRotateTool extends PdfPageTool { constructor(id){super(id,'rotate');} }
export class PdfReorderTool extends PdfPageTool { constructor(id){super(id,'reorder');} }

export class PdfCompressTool{
  constructor(id){this.root=document.getElementById(id);this.root.innerHTML=baseUI('PDF Optimizer','Apply lossless PDF structure optimization. This does not reduce the quality of scanned images, so some PDFs may become only slightly smaller—or even a little larger.');this.root.innerHTML+=fileInput()+btn('go','Optimize PDF')+msg();
    this.root.querySelector('#go').onclick=async()=>{const button=this.root.querySelector('#go');let done=()=>{};try{const f=this.root.querySelector('[data-pdf-files]').files[0];if(!f)throw Error('Choose a PDF.');ensureFileSize(f);done=busy(this.root,button,'Optimizing…');const src=await readPdf(f);const bytes=await src.save({useObjectStreams:true,addDefaultPage:false});downloadBytes(bytes,'optimized.pdf');const oldKb=f.size/1024,newKb=bytes.length/1024;const note=bytes.length<f.size?'File size reduced.':'The optimized file is not smaller, but the PDF was rebuilt successfully without reducing image quality.';setMsg(this.root,`Done. Original: ${oldKb.toFixed(1)} KB • New: ${newKb.toFixed(1)} KB • ${note}`);}catch(e){setMsg(this.root,friendlyError(e),true);}finally{done();}};
  }
}

export class ImagesToPdfTool{
  constructor(id){this.root=document.getElementById(id);this.root.innerHTML=baseUI('Images to PDF','Turn JPG or PNG images into a single A4 PDF. Large images are scaled to fit the page.');this.root.innerHTML+=`<input id="imgs" type="file" accept="image/jpeg,image/png" multiple class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"><p class="text-xs text-slate-500 mt-2">For best browser performance, keep the total selected image size under 50 MB.</p>`+btn('go','Create PDF')+msg();
    this.root.querySelector('#go').onclick=async()=>{const button=this.root.querySelector('#go');let done=()=>{};try{const files=[...this.root.querySelector('#imgs').files];if(!files.length)throw Error('Choose at least one JPG or PNG image.');const total=files.reduce((n,f)=>n+f.size,0);if(total>50*1024*1024)throw Error('The selected images are larger than 50 MB in total. Please choose fewer or smaller images.');files.forEach(f=>{if(f.size>15*1024*1024)throw Error(`${f.name} is larger than 15 MB. Please choose a smaller image.`);});done=busy(this.root,button,'Creating PDF…');const {jsPDF}=await (loadScript(JSPDF_URL).then(()=>window.jspdf));const doc=new jsPDF({unit:'pt',format:'a4'});for(let i=0;i<files.length;i++){setMsg(this.root,`Adding image ${i+1} of ${files.length}…`);if(i)doc.addPage();const data=await new Promise((res,rej)=>{const r=new FileReader();r.onload=()=>res(r.result);r.onerror=()=>rej(new Error(`Could not read ${files[i].name}.`));r.readAsDataURL(files[i]);});const img=new Image();await new Promise((res,rej)=>{img.onload=res;img.onerror=()=>rej(new Error(`Could not read ${files[i].name} as an image.`));img.src=data;});const m=24,maxW=doc.internal.pageSize.getWidth()-m*2,maxH=doc.internal.pageSize.getHeight()-m*2;const scale=Math.min(maxW/img.width,maxH/img.height);if(!isFinite(scale)||scale<=0)throw Error(`Invalid image dimensions in ${files[i].name}.`);const w=img.width*scale,h=img.height*scale;doc.addImage(data,files[i].type==='image/png'?'PNG':'JPEG',m+(maxW-w)/2,m+(maxH-h)/2,w,h);}doc.save('images.pdf');setMsg(this.root,`Done. Created a PDF with ${files.length} page${files.length===1?'':'s'}.`);}catch(e){setMsg(this.root,friendlyError(e),true);}finally{done();}};
  }
}

export class TextToPdfTool{
  constructor(id){this.root=document.getElementById(id);this.root.innerHTML=baseUI('Text to PDF','Create a printable PDF from your text. Your browser handles the final PDF creation, including Arabic and English text.');this.root.innerHTML+=`<div class="flex flex-wrap gap-3 mb-3"><input id="filename" value="qantaratools-text" maxlength="80" placeholder="File name" class="flex-1 min-w-52 p-3 rounded-lg bg-slate-800 text-white"><select id="size" class="p-3 rounded-lg bg-slate-800 text-white"><option value="12">Normal text</option><option value="14">Large text</option><option value="10">Small text</option></select></div><textarea id="txt" rows="16" class="w-full p-4 rounded-xl bg-slate-800 text-white" placeholder="Type or paste your text here..."></textarea>`+btn('go','Open PDF Print View')+msg();
    this.root.querySelector('#go').onclick=()=>{try{const text=this.root.querySelector('#txt').value.trim();if(!text)throw Error('Enter some text first.');const name=(this.root.querySelector('#filename').value.trim()||'qantaratools-text').replace(/[\\/:*?"<>|]+/g,'-');const size=Number(this.root.querySelector('#size').value)||12;const win=window.open('','_blank');if(!win)throw Error('Your browser blocked the print window. Please allow pop-ups for QantaraTools.');const safe=esc(text).replace(/\r?\n/g,'<br>');win.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${esc(name)}</title><style>@page{size:A4;margin:18mm}body{font-family:Arial,"Noto Sans",sans-serif;font-size:${size}pt;line-height:1.55;white-space:normal;color:#111;overflow-wrap:anywhere}h1{font-size:18pt;margin:0 0 16px}</style></head><body><h1>${esc(name)}</h1><div>${safe}</div><script>window.addEventListener('load',()=>setTimeout(()=>window.print(),250));</script></body></html>`);win.document.close();setMsg(this.root,'Print view opened. Choose “Save as PDF” in your browser.');}catch(e){setMsg(this.root,String(e.message||e),true);}};
  }
}
