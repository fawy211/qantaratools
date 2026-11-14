const tr=(key,fallback)=>window.QTI18n?.t(key,fallback)||fallback;
function dl(blob,name){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)}
function ui(title,desc){return `<div class="max-w-4xl mx-auto"><h2 class="text-2xl font-bold text-slate-100">${title}</h2><p class="text-slate-400 mt-2 mb-6">${desc}</p></div>`}
async function loadImg(f){return await new Promise((res,rej)=>{const invalid=()=>rej(new Error(tr('imageInvalidFile','Please choose a valid image file.')));if(!f||(f.type&&!f.type.startsWith('image/'))||!f.size){invalid();return}const r=new FileReader();r.onerror=()=>rej(new Error(tr('imageLoadFailed','The image could not be loaded. Choose a valid image file.')));r.onload=()=>{const i=new Image();i.onload=()=>res(i);i.onerror=()=>rej(new Error(tr('imageLoadFailed','The image could not be loaded. Choose a valid image file.')));i.src=r.result};try{r.readAsDataURL(f)}catch(e){rej(new Error(tr('imageLoadFailed','The image could not be loaded. Choose a valid image file.')))}})}
function saveCanvas(c,name,type='image/png',quality=.9){return new Promise((resolve,reject)=>c.toBlob(b=>{if(!b){reject(new Error(tr('imageProcessFailed','The image could not be processed. Try another image or format.')));return}dl(b,name);resolve()},type,quality))}
export class ImageRotateFlipTool{constructor(id){this.root=document.getElementById(id);this.root.innerHTML=ui(tr('imgRotateTitle','Image Rotate & Flip'),tr('imgRotateDesc','Rotate or flip an image locally, then download the result.'))+`<input id="f" type="file" accept="image/*" class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"><div class="mt-4 flex flex-wrap gap-2"><button id="r90" class="px-4 py-2 rounded-lg bg-blue-600 text-white">${tr('imgRotate90','Rotate 90°')}</button><button id="r180" class="px-4 py-2 rounded-lg bg-slate-700 text-white">${tr('imgRotate180','Rotate 180°')}</button><button id="fh" class="px-4 py-2 rounded-lg bg-slate-700 text-white">${tr('imgFlipH','Flip Horizontal')}</button><button id="fv" class="px-4 py-2 rounded-lg bg-slate-700 text-white">${tr('imgFlipV','Flip Vertical')}</button></div><div id="m" class="mt-4 text-sm text-slate-400"></div>`;let img=null;this.root.querySelector('#f').onchange=async e=>{try{img=await loadImg(e.target.files[0]);this.root.querySelector('#m').textContent=''}catch(error){img=null;this.root.querySelector('#m').textContent=error.message}};const act=async(type)=>{if(!img){this.root.querySelector('#m').textContent=tr('imgChoose','Choose an image first.');return}try{let w=img.width,h=img.height,ang=0,fh=false,fv=false;if(type==='90'){ang=Math.PI/2;[w,h]=[h,w]}if(type==='180')ang=Math.PI;if(type==='fh')fh=true;if(type==='fv')fv=true;const c=document.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(!x)throw new Error(tr('imageProcessFailed','The image could not be processed. Try another image or format.'));x.translate(w/2,h/2);x.rotate(ang);x.scale(fh?-1:1,fv?-1:1);x.drawImage(img,-img.width/2,-img.height/2);await saveCanvas(c,'edited-image.png');this.root.querySelector('#m').textContent=tr('imgDownloaded','Image downloaded.')}catch(error){this.root.querySelector('#m').textContent=error.message||tr('imageProcessFailed','The image could not be processed. Try another image or format.')}};this.root.querySelector('#r90').onclick=()=>act('90');this.root.querySelector('#r180').onclick=()=>act('180');this.root.querySelector('#fh').onclick=()=>act('fh');this.root.querySelector('#fv').onclick=()=>act('fv')}}
export class ImageBatchTool{constructor(id){this.root=document.getElementById(id);this.root.innerHTML=ui(tr('imgBatchTitle','Batch Image Converter'),tr('imgBatchDesc','Convert multiple images to PNG, JPEG, or WebP in your browser. Each result downloads separately.'))+`<input id="f" type="file" accept="image/*" multiple class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"><div class="mt-4 flex gap-3"><select id="type" class="p-3 rounded-lg bg-slate-800 text-white"><option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option></select><input id="q" type="number" min="10" max="100" value="90" class="w-24 p-3 rounded-lg bg-slate-800 text-white"></div><button id="go" class="mt-4 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold">${tr('imgConvertAll','Convert All')}</button><div id="m" class="mt-4 text-sm text-slate-400"></div>`;this.root.querySelector('#go').onclick=async()=>{try{const fs=[...this.root.querySelector('#f').files];if(!fs.length){this.root.querySelector('#m').textContent=tr('imgChooseImages','Choose images first.');return}const type=this.root.querySelector('#type').value,q=Number(this.root.querySelector('#q').value)/100;for(let n=0;n<fs.length;n++){const img=await loadImg(fs[n]);const c=document.createElement('canvas');c.width=img.width;c.height=img.height;const ctx=c.getContext('2d');if(!ctx)throw new Error(tr('imageProcessFailed','The image could not be processed. Try another image or format.'));if(type!=='image/png'){ctx.fillStyle='#ffffff';ctx.fillRect(0,0,c.width,c.height)}ctx.drawImage(img,0,0);const ext=type.split('/')[1];await saveCanvas(c,`converted-${n+1}.${ext==='jpeg'?'jpg':ext}`,type,q)}this.root.querySelector('#m').textContent=`${tr('imgConverted','Converted')} ${window.QTI18n?.formatNumber(fs.length)||fs.length} ${tr('imgImages','image(s).')}`}catch(error){this.root.querySelector('#m').textContent=error.message||tr('imageProcessFailed','The image could not be processed. Try another image or format.')}}}}
export class ImageWatermarkTool {
  constructor(id) {
    this.root=document.getElementById(id);
    this.image=null; this.logo=null;
    this.textPos={x:.5,y:.5}; this.logoPos={x:.5,y:.5};
    this.activeLayer='text'; this.dragging=false; this.selectedPosition='center';
    const locale=(window.QTI18n?.locale||'en').toLowerCase().slice(0,2);
    const c={
      en:{desc:'Add a text watermark, a logo image, or both. Position and customize each layer separately. Everything stays on your device.',upload:'Base image',text:'Text watermark',placeholder:'Enter watermark text',size:'Text size',opacity:'Text opacity',color:'Text color',logo:'Logo image (optional)',logoSize:'Logo size',logoOpacity:'Logo opacity',layer:'Select layer to move',textLayer:'Text watermark',logoLayer:'Logo image',position:'Quick position',center:'Center',tl:'Top left',tr:'Top right',bl:'Bottom left',br:'Bottom right',format:'Download format',apply:'Download watermarked image',hint:'Drag the selected layer on the preview to position it.',choose:'Choose a base image first.',ready:'Image ready. Select a layer and drag it to position.',downloaded:'Watermarked image downloaded.',error:'Could not process this image. Please try another file.',loading:'Loading preview…',removeLogo:'Remove logo',logoReady:'Logo loaded. Adjust its size, opacity and position.'},
      ar:{desc:'أضف علامة مائية نصية أو شعارًا كصورة أو الاثنين معًا. تحكم في كل طبقة بشكل مستقل، وتظل الصور على جهازك.',upload:'الصورة الأساسية',text:'نص العلامة المائية',placeholder:'اكتب العلامة المائية هنا',size:'حجم النص',opacity:'شفافية النص',color:'لون النص',logo:'صورة الشعار (اختياري)',logoSize:'حجم الشعار',logoOpacity:'شفافية الشعار',layer:'اختر العنصر لتحريكه',textLayer:'العلامة النصية',logoLayer:'صورة الشعار',position:'مواضع سريعة',center:'المنتصف',tl:'أعلى اليسار',tr:'أعلى اليمين',bl:'أسفل اليسار',br:'أسفل اليمين',format:'صيغة التنزيل',apply:'تنزيل الصورة بالعلامة المائية',hint:'اسحب العنصر المحدد فوق المعاينة لتحديد مكانه.',choose:'اختر الصورة الأساسية أولًا.',ready:'الصورة جاهزة. اختر العنصر واسحبه لتحديد مكانه.',downloaded:'تم تنزيل الصورة بالعلامة المائية.',error:'تعذرت معالجة الصورة. جرّب ملفًا آخر.',loading:'جارٍ تجهيز المعاينة…',removeLogo:'إزالة الشعار',logoReady:'تم تحميل الشعار. تحكم في حجمه وشفافيته ومكانه.'},
      de:{desc:'Füge ein Textwasserzeichen, ein Logo oder beides hinzu. Jede Ebene lässt sich separat positionieren und anpassen.',upload:'Basisbild',text:'Wasserzeichentext',placeholder:'Wasserzeichen eingeben',size:'Textgröße',opacity:'Textdeckkraft',color:'Textfarbe',logo:'Logobild (optional)',logoSize:'Logogröße',logoOpacity:'Logodeckkraft',layer:'Zu verschiebende Ebene',textLayer:'Textwasserzeichen',logoLayer:'Logobild',position:'Schnellposition',center:'Mitte',tl:'Oben links',tr:'Oben rechts',bl:'Unten links',br:'Unten rechts',format:'Downloadformat',apply:'Bild mit Wasserzeichen herunterladen',hint:'Ziehe die ausgewählte Ebene auf der Vorschau an die gewünschte Stelle.',choose:'Wähle zuerst ein Basisbild.',ready:'Bild bereit. Wähle eine Ebene und ziehe sie an die gewünschte Stelle.',downloaded:'Bild mit Wasserzeichen heruntergeladen.',error:'Bild konnte nicht verarbeitet werden. Bitte versuche eine andere Datei.',loading:'Vorschau wird geladen…',removeLogo:'Logo entfernen',logoReady:'Logo geladen. Größe, Deckkraft und Position anpassen.'},
      fr:{desc:'Ajoutez un filigrane texte, un logo image ou les deux. Réglez et positionnez chaque élément séparément.',upload:'Image de base',text:'Texte du filigrane',placeholder:'Saisissez votre filigrane',size:'Taille du texte',opacity:'Opacité du texte',color:'Couleur du texte',logo:'Image du logo (facultatif)',logoSize:'Taille du logo',logoOpacity:'Opacité du logo',layer:'Élément à déplacer',textLayer:'Filigrane texte',logoLayer:'Image du logo',position:'Position rapide',center:'Centre',tl:'En haut à gauche',tr:'En haut à droite',bl:'En bas à gauche',br:'En bas à droite',format:'Format de téléchargement',apply:'Télécharger l’image avec filigrane',hint:'Faites glisser l’élément sélectionné sur l’aperçu pour le positionner.',choose:'Choisissez d’abord une image de base.',ready:'Image prête. Sélectionnez un élément et faites-le glisser.',downloaded:'Image avec filigrane téléchargée.',error:'Impossible de traiter cette image. Essayez un autre fichier.',loading:'Chargement de l’aperçu…',removeLogo:'Supprimer le logo',logoReady:'Logo chargé. Réglez sa taille, son opacité et sa position.'},
      es:{desc:'Añade una marca de agua de texto, un logotipo como imagen o ambos. Ajusta y coloca cada elemento por separado.',upload:'Imagen base',text:'Texto de la marca de agua',placeholder:'Escribe tu marca de agua',size:'Tamaño del texto',opacity:'Opacidad del texto',color:'Color del texto',logo:'Imagen del logotipo (opcional)',logoSize:'Tamaño del logotipo',logoOpacity:'Opacidad del logotipo',layer:'Elemento que se moverá',textLayer:'Marca de agua de texto',logoLayer:'Imagen del logotipo',position:'Posición rápida',center:'Centro',tl:'Arriba izquierda',tr:'Arriba derecha',bl:'Abajo izquierda',br:'Abajo derecha',format:'Formato de descarga',apply:'Descargar imagen con marca de agua',hint:'Arrastra el elemento seleccionado sobre la vista previa para colocarlo.',choose:'Elige primero una imagen base.',ready:'Imagen lista. Selecciona un elemento y arrástralo para colocarlo.',downloaded:'Imagen con marca de agua descargada.',error:'No se pudo procesar la imagen. Prueba con otro archivo.',loading:'Cargando vista previa…',removeLogo:'Quitar logotipo',logoReady:'Logotipo cargado. Ajusta su tamaño, opacidad y posición.'}
    };
    const t=c[locale]||c.en, rtl=locale==='ar';
    const field=(label,id,control)=>'<label class="block"><span class="flex justify-between text-sm font-semibold text-slate-200 mb-2"><span>'+label+'</span>'+control+'</span></label>';
    this.root.innerHTML=ui(tr('imgWatermarkTitle','Image Watermark'),t.desc)+
      '<div class="space-y-5" dir="'+(rtl?'rtl':'ltr')+'">'+
      '<label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">'+t.upload+'</span><input id="wm-file" type="file" accept="image/*" class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"></label>'+
      '<div id="wm-stage-wrap" class="hidden rounded-xl border border-slate-700 bg-slate-900/60 p-2"><canvas id="wm-canvas" class="block mx-auto max-w-full rounded-lg" style="max-height:560px;width:auto;touch-action:none;cursor:grab"></canvas><p class="text-xs text-slate-400 text-center mt-2">'+t.hint+'</p></div>'+
      '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">'+
      '<label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">'+t.text+'</span><input id="wm-text" type="text" maxlength="120" placeholder="'+t.placeholder+'" class="w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-700"></label>'+
      '<label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">'+t.color+'</span><input id="wm-color" type="color" value="#ffffff" class="w-full h-11 rounded-lg bg-slate-800 border border-slate-700 p-1"></label>'+
      '<label class="block"><span class="flex justify-between text-sm font-semibold text-slate-200 mb-2"><span>'+t.size+'</span><output id="wm-size-out">7%</output></span><input id="wm-size" type="range" min="2" max="20" value="7" class="w-full accent-blue-500"></label>'+
      '<label class="block"><span class="flex justify-between text-sm font-semibold text-slate-200 mb-2"><span>'+t.opacity+'</span><output id="wm-opacity-out">65%</output></span><input id="wm-opacity" type="range" min="5" max="100" value="65" class="w-full accent-blue-500"></label>'+
      '<label class="block md:col-span-2"><span class="block text-sm font-semibold text-slate-200 mb-2">'+t.logo+'</span><input id="wm-logo" type="file" accept="image/*" class="block w-full text-sm text-slate-300 file:mr-3 file:rounded-lg file:border-0 file:px-4 file:py-2 file:bg-slate-700 file:text-slate-100"><button id="wm-remove-logo" type="button" class="hidden mt-2 px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">'+t.removeLogo+'</button></label>'+
      '<label class="block"><span class="flex justify-between text-sm font-semibold text-slate-200 mb-2"><span>'+t.logoSize+'</span><output id="wm-logo-size-out">20%</output></span><input id="wm-logo-size" type="range" min="5" max="60" value="20" class="w-full accent-blue-500"></label>'+
      '<label class="block"><span class="flex justify-between text-sm font-semibold text-slate-200 mb-2"><span>'+t.logoOpacity+'</span><output id="wm-logo-opacity-out">80%</output></span><input id="wm-logo-opacity" type="range" min="5" max="100" value="80" class="w-full accent-blue-500"></label></div>'+
      '<label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">'+t.layer+'</span><select id="wm-layer" class="w-full sm:w-auto p-3 rounded-lg bg-slate-800 text-white border border-slate-700"><option value="text">'+t.textLayer+'</option><option value="logo">'+t.logoLayer+'</option></select></label>'+
      '<div><span class="block text-sm font-semibold text-slate-200 mb-2">'+t.position+'</span><div class="flex flex-wrap gap-2">'+
      '<button type="button" data-pos="tl" class="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">'+t.tl+'</button><button type="button" data-pos="tr" class="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">'+t.tr+'</button><button type="button" data-pos="center" class="px-3 py-2 rounded-lg bg-blue-600 text-white text-sm">'+t.center+'</button><button type="button" data-pos="bl" class="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">'+t.bl+'</button><button type="button" data-pos="br" class="px-3 py-2 rounded-lg bg-slate-700 text-white text-sm">'+t.br+'</button></div></div>'+
      '<div class="flex flex-col sm:flex-row gap-3 sm:items-end"><label class="block"><span class="block text-sm font-semibold text-slate-200 mb-2">'+t.format+'</span><select id="wm-format" class="p-3 rounded-lg bg-slate-800 text-white border border-slate-700"><option value="image/png">PNG</option><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option></select></label><button id="wm-download" type="button" class="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed" disabled>'+t.apply+'</button></div>'+
      '<div id="wm-message" class="text-sm text-slate-400" role="status" aria-live="polite"></div></div>';
    this.canvas=this.root.querySelector('#wm-canvas'); this.ctx=this.canvas.getContext('2d');
    this.root.querySelector('#wm-file').addEventListener('change',async e=>{
      const file=e.target.files&&e.target.files[0]; if(!file)return;
      this.message(t.loading);
      try{this.image=await loadImg(file);this.canvas.width=this.image.naturalWidth||this.image.width;this.canvas.height=this.image.naturalHeight||this.image.height;this.textPos={x:.5,y:.5};this.logoPos={x:.5,y:.5};this.root.querySelector('#wm-stage-wrap').classList.remove('hidden');this.root.querySelector('#wm-download').disabled=false;this.message(t.ready);this.render();}
      catch(_){this.image=null;this.message(t.error);}
    });
    this.root.querySelector('#wm-logo').addEventListener('change',async e=>{
      const file=e.target.files&&e.target.files[0];if(!file)return;
      try{this.logo=await loadImg(file);this.root.querySelector('#wm-remove-logo').classList.remove('hidden');this.root.querySelector('#wm-layer').value='logo';this.activeLayer='logo';this.message(t.logoReady);this.render();}
      catch(_){this.logo=null;this.message(t.error);}
    });
    this.root.querySelector('#wm-remove-logo').addEventListener('click',()=>{this.logo=null;this.root.querySelector('#wm-logo').value='';this.root.querySelector('#wm-remove-logo').classList.add('hidden');this.root.querySelector('#wm-layer').value='text';this.activeLayer='text';this.render();});
    this.root.querySelector('#wm-layer').addEventListener('change',e=>{this.activeLayer=e.target.value;this.updatePositionButtons();});
    [['wm-size','wm-size-out','%'],['wm-opacity','wm-opacity-out','%'],['wm-logo-size','wm-logo-size-out','%'],['wm-logo-opacity','wm-logo-opacity-out','%']].forEach(([id,out,suffix])=>this.root.querySelector('#'+id).addEventListener('input',()=>{this.root.querySelector('#'+out).textContent=this.root.querySelector('#'+id).value+suffix;this.render();}));
    ['wm-text','wm-color'].forEach(id=>this.root.querySelector('#'+id).addEventListener('input',()=>this.render()));
    this.root.querySelectorAll('[data-pos]').forEach(btn=>btn.addEventListener('click',()=>{
      const p={tl:[.08,.12],tr:[.92,.12],center:[.5,.5],bl:[.08,.88],br:[.92,.88]}[btn.dataset.pos];
      if(!p)return;
      // Always read the current selector value so the preset controls the visible layer.
      this.activeLayer=this.root.querySelector('#wm-layer').value;
      if(this.activeLayer==='logo'&&!this.logo){
        this.activeLayer='text';this.root.querySelector('#wm-layer').value='text';
      }
      const target=this.activeLayer==='logo'?this.logoPos:this.textPos;
      target.x=p[0];target.y=p[1];this.selectedPosition=btn.dataset.pos;
      this.updatePositionButtons();this.render();
    }));
    this.updatePositionButtons();
    const point=e=>{const r=this.canvas.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/r.width)),y:Math.max(0,Math.min(1,(e.clientY-r.top)/r.height))};};
    this.canvas.addEventListener('pointerdown',e=>{if(!this.image)return;if(this.activeLayer==='logo'&&!this.logo)return;this.dragging=true;this.canvas.setPointerCapture(e.pointerId);const p=point(e);const target=this.activeLayer==='logo'?this.logoPos:this.textPos;target.x=p.x;target.y=p.y;this.canvas.style.cursor='grabbing';this.render();});
    this.canvas.addEventListener('pointermove',e=>{if(!this.dragging)return;const p=point(e);const target=this.activeLayer==='logo'?this.logoPos:this.textPos;target.x=p.x;target.y=p.y;this.selectedPosition=null;this.updatePositionButtons();this.render();});
    const stop=()=>{this.dragging=false;this.canvas.style.cursor='grab';};
    this.canvas.addEventListener('pointerup',stop);this.canvas.addEventListener('pointercancel',stop);
    this.root.querySelector('#wm-download').addEventListener('click',async()=>{
      if(!this.image){this.message(t.choose);return;}
      try{const type=this.root.querySelector('#wm-format').value,ext=type==='image/jpeg'?'jpg':type.split('/')[1];await saveCanvas(this.makeOutput(),'watermarked-image.'+ext,type,.92);this.message(t.downloaded);}
      catch(_){this.message(t.error);}
    });
  }
  message(value){const el=this.root.querySelector('#wm-message');if(el)el.textContent=value;}
  updatePositionButtons(){
    if(!this.root)return;
    this.root.querySelectorAll('[data-pos]').forEach(btn=>{
      const active=btn.dataset.pos===this.selectedPosition;
      // Inline styles make the selected state reliable even if site CSS overrides utility classes.
      btn.style.backgroundColor=active?'#2563eb':'#334155';
      btn.style.color='#ffffff';
      btn.style.border=active?'2px solid #93c5fd':'2px solid transparent';
      btn.style.boxShadow=active?'0 0 0 2px rgba(37,99,235,.22)':'none';
      btn.style.transform=active?'translateY(-1px)':'none';
      btn.style.fontWeight=active?'700':'500';
      btn.setAttribute('aria-pressed',active?'true':'false');
    });
  }
  draw(ctx){
    if(!this.image)return;
    const w=this.canvas.width,h=this.canvas.height;
    ctx.clearRect(0,0,w,h);ctx.drawImage(this.image,0,0,w,h);
    const text=this.root.querySelector('#wm-text').value.trim();
    if(text){
      const size=Math.max(12,Math.round(w*Number(this.root.querySelector('#wm-size').value)/100));
      ctx.save();ctx.globalAlpha=Number(this.root.querySelector('#wm-opacity').value)/100;ctx.fillStyle=this.root.querySelector('#wm-color').value;
      ctx.font='600 '+size+'px Arial, sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.shadowColor='rgba(0,0,0,.45)';ctx.shadowBlur=Math.max(1,size*.08);
      const maxTextWidth=w*.92, measured=Math.min(maxTextWidth,ctx.measureText(text).width);
      const tx=Math.max(measured/2+8,Math.min(w-measured/2-8,this.textPos.x*w));
      const ty=Math.max(size/2+8,Math.min(h-size/2-8,this.textPos.y*h));
      ctx.fillText(text,tx,ty,maxTextWidth);ctx.restore();
    }
    if(this.logo){
      const maxW=w*Number(this.root.querySelector('#wm-logo-size').value)/100;
      const ratio=Math.min(1,maxW/this.logo.width);
      const dw=this.logo.width*ratio,dh=this.logo.height*ratio;
      ctx.save();ctx.globalAlpha=Number(this.root.querySelector('#wm-logo-opacity').value)/100;
      const lx=Math.max(dw/2+8,Math.min(w-dw/2-8,this.logoPos.x*w));
      const ly=Math.max(dh/2+8,Math.min(h-dh/2-8,this.logoPos.y*h));
      ctx.drawImage(this.logo,lx-dw/2,ly-dh/2,dw,dh);ctx.restore();
    }
  }
  render(){if(this.image&&this.ctx)this.draw(this.ctx);}
  makeOutput(){const c=document.createElement('canvas');c.width=this.canvas.width;c.height=this.canvas.height;const x=c.getContext('2d');if(!x)throw new Error('Canvas unavailable');this.draw(x);return c;}
  destroy(){this.image=null;this.logo=null;if(this.root)this.root.innerHTML='';}
}
