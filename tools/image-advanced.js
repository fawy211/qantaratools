const tr=(key,fallback)=>window.QTI18n?.t(key,fallback)||fallback;
function dl(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function ui(title,desc){return `<div class="max-w-4xl mx-auto"><h2 class="text-2xl font-bold text-slate-100">${title}</h2><p class="text-slate-400 mt-2 mb-6">${desc}</p></div>`}
async function loadImg(f){return await new Promise((res,rej)=>{const invalid=()=>rej(new Error(tr('imageInvalidFile','Please choose a valid image file.')));if(!f||(f.type&&!f.type.startsWith('image/'))||!f.size){invalid();return}const r=new FileReader();r.onerror=()=>rej(new Error(tr('imageLoadFailed','The image could not be loaded. Choose a valid image file.')));r.onload=()=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error(tr('imageLoadFailed','The image could not be loaded. Choose a valid image file.')));i.src=r.result};try{r.readAsDataURL(f)}catch(e){rej(new Error(tr('imageLoadFailed','The image could not be loaded. Choose a valid image file.')))}})}
function saveCanvas(c,name,type='image/png',quality=.9){return new Promise((resolve,reject)=>c.toBlob(b=>{if(!b){reject(new Error(tr('imageProcessFailed','The image could not be processed. Try another image or format.')));return}dl(b,name);resolve()},type,quality))}
export class ImageRotateFlipTool{constructor(id){this.root=document.getElementById(id);this.root.innerHTML=ui(tr('imgRotateTitle','Image Rotate & Flip'),tr('imgRotateDesc','Rotate or flip an image locally, then download the result.'))+`<input id="f" type="file" accept="image/*" class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"><div class="mt-4 flex flex-wrap gap-2"><button id="r90" class="px-4 py-2 rounded-lg bg-blue-600 text-white">${tr('imgRotate90','Rotate 90°')}</button><button id="r180" class="px-4 py-2 rounded-lg bg-slate-700 text-white">${tr('imgRotate180','Rotate 180°')}</button><button id="fh" class="px-4 py-2 rounded-lg bg-slate-700 text-white">${tr('imgFlipH','Flip Horizontal')}</button><button id="fv" class="px-4 py-2 rounded-lg bg-slate-700 text-white">${tr('imgFlipV','Flip Vertical')}</button></div><div id="m" class="mt-4 text-sm text-slate-400"></div>`;let img=null;this.root.querySelector('#f').onchange=async e=>{try{img=await loadImg(e.target.files[0]);this.root.querySelector('#m').textContent=''}catch(error){img=null;this.root.querySelector('#m').textContent=error.message}};const act=async(type)=>{if(!img){this.root.querySelector('#m').textContent=tr('imgChoose','Choose an image first.');return}try{let w=img.width,h=img.height,ang=0,fh=false,fv=false;if(type==='90'){ang=Math.PI/2;[w,h]=[h,w]}if(type==='180')ang=Math.PI;if(type==='fh')fh=true;if(type==='fv')fv=true;const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(!x)throw new Error(tr('imageProcessFailed','The image could not be processed. Try another image or format.'));x.translate(w/2,h/2);x.rotate(ang);x.scale(fh?-1:1,fv?-1:1);x.drawImage(img,-img.width/2,-img.height/2);await saveCanvas(c,'edited-image.png');this.root.querySelector('#m').textContent=tr('imgDownloaded','Image downloaded.')}catch(error){this.root.querySelector('#m').textContent=error.message||tr('imageProcessFailed','The image could not be processed. Try another image or format.')}};this.root.querySelector('#r90').onclick=()=>act('90');this.root.querySelector('#r180').onclick=()=>act('180');this.root.querySelector('#fh').onclick=()=>act('fh');this.root.querySelector('#fv').onclick=()=>act('fv')}}
export class ImageBatchTool{constructor(id){this.root=document.getElementById(id);this.root.innerHTML=ui(tr('imgBatchTitle','Batch Image Converter'),tr('imgBatchDesc','Convert multiple images to PNG, JPEG, or WebP in your browser. Each result downloads separately.'))+`<input id="f" type="file" accept="image/*" multiple class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"><div class="mt-4 flex gap-3"><select id="type" class="p-3 rounded-lg bg-slate-800 text-white"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select><input id="q" type="number" min="10" max="100" value="90" class="w-24 p-3 rounded-lg bg-slate-800 text-white"></div><button id="go" class="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold">${tr('imgConvertAll','Convert All')}</button><div id="m" class="mt-4 text-sm text-slate-400"></div>`;this.root.querySelector('#go').onclick=async()=>{try{const fs=[...this.root.querySelector('#f').files];if(!fs.length){this.root.querySelector('#m').textContent=tr('imgChooseImages','Choose images first.');return}const type=this.root.querySelector('#type').value,q=Number(this.root.querySelector('#q').value)/100;for(let n=0;n<fs.length;n++){const img=await loadImg(fs[n]);const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');if(!ctx)throw new Error(tr('imageProcessFailed','The image could not be processed. Try another image or format.'));if(type!=='image/png'){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height)}ctx.drawImage(img,0,0);const ext=type.split('/')[1];await saveCanvas(c,`converted-${n+1}.${ext==='jpeg'?'jpg':ext}`,type,q)}this.root.querySelector('#m').textContent=`${tr('imgConverted','Converted')} ${window.QTI18n?.formatNumber(fs.length)||fs.length} ${tr('imgImages','image(s).')}`}catch(error){this.root.querySelector('#m').textContent=error.message||tr('imageProcessFailed','The image could not be processed. Try another image or format.')}}}}
export class ImageWatermarkTool {
  constructor(id) {
    this.root = document.getElementById(id);
    this.image = null; this.x = 0.5; this.y = 0.5; this.dragging = false;
    const locale = (window.QTI18n?.locale || 'en').toLowerCase().slice(0,2);
    const copy = {
      en:{desc:'Add a text watermark and position it exactly where you want. Your image stays on your device.',upload:'Choose image',text:'Watermark text',placeholder:'Enter your watermark',size:'Text size',opacity:'Opacity',color:'Text color',position:'Quick position',center:'Center',tl:'Top left',tr:'Top right',bl:'Bottom left',br:'Bottom right',format:'Download format',apply:'Download watermarked image',hint:'Drag the watermark on the image to position it.',choose:'Choose an image and enter watermark text.',ready:'Your image is ready. Drag the watermark to position it.',downloaded:'Watermarked image downloaded.',error:'Could not process this image. Please try another file.',loading:'Loading preview…'},
      ar:{desc:'أضف علامة مائية نصية وحدد مكانها وحجمها بدقة. الصورة تظل على جهازك.',upload:'اختيار صورة',text:'نص العلامة المائية',placeholder:'اكتب العلامة المائية هنا',size:'حجم النص',opacity:'الشفافية',color:'لون النص',position:'مواضع سريعة',center:'المنتصف',tl:'أعلى اليسار',tr:'أعلى اليمين',bl:'أسفل اليسار',br:'أسفل اليمين',format:'صيغة التنزيل',apply:'تنزيل الصورة بالعلامة المائية',hint:'اسحب العلامة المائية فوق الصورة لتحديد مكانها.',choose:'اختر صورة واكتب نص العلامة المائية.',ready:'الصورة جاهزة. اسحب العلامة المائية لتحديد مكانها.',downloaded:'تم تنزيل الصورة بالعلامة المائية.',error:'تعذرت معالجة الصورة. جرّب ملفًا آخر.',loading:'جارٍ تجهيز المعاينة…'},
      de:{desc:'Füge ein Textwasserzeichen hinzu und positioniere es genau. Dein Bild bleibt auf deinem Gerät.',upload:'Bild auswählen',text:'Wasserzeichentext',placeholder:'Wasserzeichen eingeben',size:'Textgröße',opacity:'Deckkraft',color:'Textfarbe',position:'Schnellposition',center:'Mitte',tl:'Oben links',tr:'Oben rechts',bl:'Unten links',br:'Unten rechts',format:'Downloadformat',apply:'Bild mit Wasserzeichen herunterladen',hint:'Ziehe das Wasserzeichen auf dem Bild an die gewünschte Stelle.',choose:'Wähle ein Bild und gib einen Wasserzeichentext ein.',ready:'Bild bereit. Ziehe das Wasserzeichen an die gewünschte Stelle.',downloaded:'Bild mit Wasserzeichen heruntergeladen.',error:'Bild konnte nicht verarbeitet werden. Bitte versuche eine andere Datei.',loading:'Vorschau wird geladen…'},
      fr:{desc:'Ajoutez un filigrane texte et placez-le précisément. Votre image reste sur votre appareil.',upload:'Choisir une image',text:'Texte du filigrane',placeholder:'Saisissez votre filigrane',size:'Taille du texte',opacity:'Opacité',color:'Couleur du texte',position:'Position rapide',center:'Centre',tl:'En haut à gauche',tr:'En haut à droite',bl:'En bas à gauche',br:'En bas à droite',format:'Format de téléchargement',apply:'Télécharger l’image avec filigrane',hint:'Faites glisser le filigrane sur l’image pour le positionner.',choose:'Choisissez une image et saisissez le texte du filigrane.',ready:'Image prête. Faites glisser le filigrane pour le positionner.',downloaded:'Image avec filigrane téléchargée.',error:'Impossible de traiter cette image. Essayez un autre fichier.',loading:'Chargement de l’aperçu…'},
      es:{desc:'Añade una marca de agua de texto y colócala con precisión. La imagen permanece en tu dispositivo.',upload:'Elegir imagen',text:'Texto de la marca de agua',placeholder:'Escribe tu marca de agua',size:'Tamaño del texto',opacity:'Opacidad',color:'Color del texto',position:'Posición rápida',center:'Centro',tl:'Arriba izquierda',tr:'Arriba derecha',bl:'Abajo izquierda',br:'Abajo derecha',format:'Formato de descarga',apply:'Descargar imagen con marca de agua',hint:'Arrastra la marca de agua sobre la imagen para colocarla.',choose:'Elige una imagen e introduce el texto de la marca de agua.',ready:'Imagen lista. Arrastra la marca de agua para colocarla.',downloaded:'Imagen con marca de agua descargada.',error:'No se pudo procesar la imagen. Prueba con otro archivo.',loading:'Cargando vista previa…'}
    };
    const t = copy[locale] || copy.en;
    const rtl = locale === 'ar';
    const markup = ui(tr('imgWatermarkTitle','Image Watermark'),t.desc) +
      '<div class="space-y-5" dir="' + (rtl?'rtl':'ltr') + '">' +
      '<label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">' + t.upload + '</span><input id="wm-file" type="file" accept="image/*" class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"></label>' +
      '<div id="wm-stage-wrap" class="hidden rounded-xl border border-slate-700 bg-slate-900/60 p-2"><canvas id="wm-canvas" class="block mx-auto max-w-full rounded-lg" style="max-height:560px;width:auto;touch-action:none;cursor:grab"></canvas><p class="text-xs text-slate-400 text-center mt-2">' + t.hint + '</p></div>' +
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">' +
      '<label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">' + t.text + '</span><input id="wm-text" type="text" maxlength="120" placeholder="' + t.placeholder + '" class="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"></label>' +
      '<label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">' + t.color + '</span><input id="wm-color" type="color" value="#ffffff" class="w-full h-11 rounded-lg bg-slate-800 border border-slate-700 p-1"></label>' +
      '<label class="block"><span class="flex justify-between text-sm font-semibold text-slate-200 mb-2"><span>' + t.size + '</span><output id="wm-size-out">7%</output></span><input id="wm-size" type="range" min="2" max="20" value="7" class="w-full accent-blue-500"></label>' +
      '<label class="block"><span class="flex justify-between text-sm font-semibold text-slate-200 mb-2"><span>' + t.opacity + '</span><output id="wm-opacity-out">65%</output></span><input id="wm-opacity" type="range" min="5" max="100" value="65" class="w-full accent-blue-500"></label></div>' +
      '<div><span class="block text-sm font-semibold text-slate-200 mb-2">' + t.position + '</span><div class="flex flex-wrap gap-2">' +
      '<button type="button" data-pos="tl" class="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">' + t.tl + '</button><button type="button" data-pos="tr" class="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">' + t.tr + '</button><button type="button" data-pos="center" class="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">' + t.center + '</button><button type="button" data-pos="bl" class="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">' + t.bl + '</button><button type="button" data-pos="br" class="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">' + t.br + '</button></div></div>' +
      '<div class="flex flex-col sm:flex-row gap-3 sm:items-end"><label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">' + t.format + '</span><select id="wm-format" class="p-3 rounded-lg bg-slate-800 text-white border border-slate-700"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></label><button id="wm-download" type="button" class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed" disabled>' + t.apply + '</button></div>' +
      '<div id="wm-message" class="text-sm text-slate-400" role="status" aria-live="polite"></div></div>';
    this.root.innerHTML = markup;
    this.canvas = this.root.querySelector('#wm-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.fileInput = this.root.querySelector('#wm-file');
    this.fileInput.addEventListener('change', async e => {
      const file = e.target.files && e.target.files[0]; if (!file) return;
      if (!file.type.startsWith('image/')) { this.message(t.error); return; }
      this.message(t.loading);
      try {
        this.image = await loadImg(file);
        this.canvas.width = this.image.naturalWidth || this.image.width;
        this.canvas.height = this.image.naturalHeight || this.image.height;
        this.x = 0.5; this.y = 0.5;
        this.root.querySelector('#wm-stage-wrap').classList.remove('hidden');
        this.root.querySelector('#wm-download').disabled = false;
        this.message(t.ready); this.render();
      } catch (_) { this.image = null; this.message(t.error); }
    });
    ['wm-text','wm-color','wm-size','wm-opacity'].forEach(key => this.root.querySelector('#'+key).addEventListener('input', () => {
      if (key === 'wm-size') this.root.querySelector('#wm-size-out').textContent = this.root.querySelector('#wm-size').value + '%';
      if (key === 'wm-opacity') this.root.querySelector('#wm-opacity-out').textContent = this.root.querySelector('#wm-opacity').value + '%';
      this.render();
    }));
    this.root.querySelectorAll('[data-pos]').forEach(btn => btn.addEventListener('click', () => {
      const positions = {tl:[.08,.12],tr:[.92,.12],center:[.5,.5],bl:[.08,.88],br:[.92,.88]};
      this.x = positions[btn.dataset.pos][0]; this.y = positions[btn.dataset.pos][1]; this.render();
    }));
    const getPoint = e => {
      const r = this.canvas.getBoundingClientRect();
      return {x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};
    };
    this.canvas.addEventListener('pointerdown', e => { if (!this.image) return; this.dragging=true; this.canvas.setPointerCapture(e.pointerId); const p=getPoint(e); this.x=p.x; this.y=p.y; this.canvas.style.cursor='grabbing'; this.render(); });
    this.canvas.addEventListener('pointermove', e => { if (!this.dragging) return; const p=getPoint(e); this.x=p.x; this.y=p.y; this.render(); });
    const stop = () => { this.dragging=false; this.canvas.style.cursor='grab'; };
    this.canvas.addEventListener('pointerup', stop); this.canvas.addEventListener('pointercancel', stop);
    this.root.querySelector('#wm-download').addEventListener('click', async () => {
      if (!this.image) { this.message(t.choose); return; }
      try {
        const type=this.root.querySelector('#wm-format').value;
        const ext=type==='image/jpeg'?'jpg':type.split('/')[1];
        await saveCanvas(this.makeOutput(),'watermarked-image.'+ext,type,.92);
        this.message(t.downloaded);
      } catch (_) { this.message(t.error); }
    });
  }
  message(value) { const el=this.root.querySelector('#wm-message'); if(el) el.textContent=value; }
  makeOutput() {
    const c=document.createElement('canvas'); c.width=this.canvas.width; c.height=this.canvas.height;
    const x=c.getContext('2d'); if(!x) throw new Error('Canvas unavailable');
    this.draw(x); return c;
  }
  draw(ctx) {
    if (!this.image) return;
    const w=this.canvas.width,h=this.canvas.height;
    ctx.clearRect(0,0,w,h); ctx.drawImage(this.image,0,0,w,h);
    const text=this.root.querySelector('#wm-text').value.trim(); if (!text) return;
    const size=Math.max(12,Math.round(w*Number(this.root.querySelector('#wm-size').value)/100));
    ctx.save(); ctx.globalAlpha=Number(this.root.querySelector('#wm-opacity').value)/100;
    ctx.fillStyle=this.root.querySelector('#wm-color').value;
    ctx.font='600 '+size+'px Arial, sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.shadowColor='rgba(0,0,0,.45)'; ctx.shadowBlur=Math.max(1,size*.08);
    ctx.fillText(text,this.x*w,this.y*h,w*.92); ctx.restore();
  }
  render() { if(this.image && this.ctx) this.draw(this.ctx); }
  destroy() { this.image=null; if(this.root) this.root.innerHTML=''; }
}
