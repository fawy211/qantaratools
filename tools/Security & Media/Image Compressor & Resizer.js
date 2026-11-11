export class ImageCompressorTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.t = (key, fallback) => window.QTI18n?.t(key, fallback) || fallback;
    this.img = null;
    this.file = null;
    this.output = null;
    this.init();
  }

  init() {
    if (!this.container) return;
    this.container.innerHTML = `<div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
      <div><h2 class="text-lg font-semibold text-white">${this.t('icTitle','Image Compressor & Resizer')}</h2><p class="text-xs text-gray-400 mt-1">${this.t('icDesc','Resize and compress images locally. No upload required.')}</p></div>
      <input id="imgFile" type="file" accept="image/*" class="block w-full text-xs text-gray-400">
      <div id="imgMeta" class="hidden text-xs text-gray-400"></div>
      <div id="imgControls" class="hidden grid grid-cols-1 md:grid-cols-3 gap-3">
        <label class="text-xs text-gray-400">${this.t('quality','Quality')} <input id="imgQuality" type="range" min="10" max="100" value="80" class="w-full"><span id="qVal">80%</span></label>
        <label class="text-xs text-gray-400">${this.t('width','Width')} <input id="imgWidth" type="number" min="1" class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200"></label>
        <label class="text-xs text-gray-400">${this.t('format','Format')}<select id="imgFormat" class="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-200"><option value="image/jpeg">JPG</option><option value="image/webp">WebP</option><option value="image/png">PNG</option></select></label>
      </div>
      <div class="flex flex-wrap gap-2">
        <button id="processImg" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-4 py-2.5 rounded-lg">${this.t('processImage','Process Image')}</button>
        <button id="downloadImg" class="hidden bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 rounded-lg">${this.t('download','Download')}</button>
        <button id="clearImg" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg">${this.t('clear','Clear')}</button>
      </div>
      <div id="imgStats" class="text-xs text-gray-400" role="status" aria-live="polite"></div>
    </div>`;
    this.bind();
  }

  fmt(n) {
    const units = ['B', 'KB', 'MB'];
    let i = 0;
    while (n >= 1024 && i < 2) { n /= 1024; i++; }
    return `${window.QTI18n?.formatNumber(n,{maximumFractionDigits:i?1:0}) || n.toFixed(i?1:0)} ${units[i]}`;
  }

  bind() {
    const fileInput = document.getElementById('imgFile');
    const controls = document.getElementById('imgControls');
    const width = document.getElementById('imgWidth');
    const quality = document.getElementById('imgQuality');
    const qualityValue = document.getElementById('qVal');
    const meta = document.getElementById('imgMeta');
    const stats = document.getElementById('imgStats');
    const download = document.getElementById('downloadImg');
    const error = key => { stats.textContent = this.t(key, key); download.classList.add('hidden'); this.output = null; };

    fileInput.onchange = () => {
      const file = fileInput.files?.[0] || null;
      this.file = file;
      this.img = null;
      this.output = null;
      download.classList.add('hidden');
      controls.classList.add('hidden');
      meta.classList.add('hidden');
      stats.textContent = '';
      if (!file) return;
      if (!file.type.startsWith('image/') || !file.size) {
        this.file = null;
        error('imageInvalidFile');
        return;
      }
      const reader = new FileReader();
      reader.onerror = () => error('imageLoadFailed');
      reader.onload = event => {
        const image = new Image();
        image.onerror = () => error('imageLoadFailed');
        image.onload = () => {
          this.img = image;
          width.value = image.naturalWidth;
          meta.textContent = `${this.t('original','Original')}: ${image.naturalWidth} × ${image.naturalHeight} • ${this.fmt(file.size)}`;
          meta.classList.remove('hidden');
          controls.classList.remove('hidden');
        };
        image.src = event.target.result;
      };
      reader.readAsDataURL(file);
    };

    quality.oninput = () => qualityValue.textContent = quality.value + '%';
    document.getElementById('processImg').onclick = () => this.process();
    download.onclick = () => {
      if (!this.output) return;
      const anchor = document.createElement('a');
      anchor.href = this.output.url;
      anchor.download = this.output.name;
      anchor.click();
    };
    document.getElementById('clearImg').onclick = () => {
      fileInput.value = '';
      this.img = null;
      this.file = null;
      if (this.output?.url) URL.revokeObjectURL(this.output.url);
      this.output = null;
      controls.classList.add('hidden');
      meta.classList.add('hidden');
      download.classList.add('hidden');
      stats.textContent = '';
    };
  }

  process() {
    const stats = document.getElementById('imgStats');
    const download = document.getElementById('downloadImg');
    const error = key => { stats.textContent = this.t(key, key); download.classList.add('hidden'); };
    if (!this.img || !this.file) { error('imageInvalidFile'); return; }
    const width = Math.max(1, parseInt(document.getElementById('imgWidth').value, 10) || this.img.naturalWidth);
    const height = Math.max(1, Math.round(this.img.naturalHeight * width / this.img.naturalWidth));
    const type = document.getElementById('imgFormat').value;
    const quality = parseInt(document.getElementById('imgQuality').value, 10) / 100;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    if (!context) { error('imageProcessFailed'); return; }
    if (type !== 'image/png') { context.fillStyle = '#ffffff'; context.fillRect(0, 0, width, height); }
    try {
      context.drawImage(this.img, 0, 0, width, height);
      canvas.toBlob(blob => {
        if (!blob) { error('imageProcessFailed'); return; }
        if (this.output?.url) URL.revokeObjectURL(this.output.url);
        const extension = type === 'image/png' ? 'png' : type === 'image/webp' ? 'webp' : 'jpg';
        this.output = { url: URL.createObjectURL(blob), name: `compressed-${this.file.name.replace(/\.[^.]+$/, '')}.${extension}` };
        stats.textContent = `${this.t('result','Result')}: ${width} × ${height} • ${this.fmt(blob.size)} (${((1 - blob.size / this.file.size) * 100).toFixed(1)}% ${this.t('sizeChange','size change')})`;
        download.classList.remove('hidden');
      }, type, type === 'image/png' ? undefined : quality);
    } catch {
      error('imageProcessFailed');
    }
  }
}
