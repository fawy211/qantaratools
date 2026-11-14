export class ImageCropperTool {
  constructor(id) {
    this.c = document.getElementById(id);
    this.t = (key, fallback) => window.QTI18n?.t(key, fallback) || fallback;
    this.init();
  }

  init() {
    this.c.innerHTML = `<div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
      <h2 class="text-lg font-semibold text-white">${this.t('cropTitle','Image Cropper')}</h2>
      <p class="text-xs text-gray-400">${this.t('cropDesc','Crop an image using a simple local canvas editor.')}</p>
      <input id="cropFile" type="file" accept="image/*" class="w-full text-sm text-gray-300">
      <div class="grid md:grid-cols-4 gap-2">
        <input id="cx" type="number" min="0" value="0" placeholder="X" class="bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-100">
        <input id="cy" type="number" min="0" value="0" placeholder="Y" class="bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-100">
        <input id="cw" type="number" min="1" value="300" placeholder="${this.t('width','Width')}" class="bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-100">
        <input id="ch" type="number" min="1" value="300" placeholder="${this.t('height','Height')}" class="bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-100">
      </div>
      <button id="cropRun" class="bg-indigo-600 text-white px-4 py-2 rounded-lg">${this.t('cropPreview','Crop & Preview')}</button>
      <canvas id="cropCanvas" class="max-w-full rounded-xl border border-gray-800"></canvas>
      <a id="cropDown" class="hidden bg-gray-800 text-gray-200 px-4 py-2 rounded-lg inline-block">${this.t('downloadCropped','Download cropped image')}</a>
      <div id="cropStatus" class="text-xs text-gray-400" role="status" aria-live="polite"></div>
    </div>`;

    const fileInput = document.getElementById('cropFile');
    const canvas = document.getElementById('cropCanvas');
    const download = document.getElementById('cropDown');
    const status = document.getElementById('cropStatus');
    let file = null;
    let image = new Image();
    let sourceUrl = null;
    const error = key => { status.textContent = this.t(key, key); download.classList.add('hidden'); };

    fileInput.onchange = event => {
      file = event.target.files?.[0] || null;
      image = new Image();
      download.classList.add('hidden');
      status.textContent = '';
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (!file) return;
      if ((file.type && !file.type.startsWith('image/')) || !file.size) {
        file = null;
        error('imageInvalidFile');
        return;
      }
      image.onerror = () => error('imageLoadFailed');
      image.onload = () => { status.textContent = ''; };
      sourceUrl = URL.createObjectURL(file);
      image.src = sourceUrl;
    };

    document.getElementById('cropRun').onclick = () => {
      if (!file) { error('imageInvalidFile'); return; }
      if (!image.complete || !image.naturalWidth || !image.naturalHeight) { error('imageLoadFailed'); return; }
      const x = Number(document.getElementById('cx').value);
      const y = Number(document.getElementById('cy').value);
      const requestedWidth = Number(document.getElementById('cw').value);
      const requestedHeight = Number(document.getElementById('ch').value);
      if (![x, y, requestedWidth, requestedHeight].every(Number.isFinite) || x < 0 || y < 0 || requestedWidth <= 0 || requestedHeight <= 0 || x >= image.naturalWidth || y >= image.naturalHeight) {
        error('imageCropInvalid');
        return;
      }
      const width = Math.min(requestedWidth, image.naturalWidth - x);
      const height = Math.min(requestedHeight, image.naturalHeight - y);
      if (width <= 0 || height <= 0) { error('imageCropInvalid'); return; }
      try {
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext('2d');
        if (!context) { error('imageProcessFailed'); return; }
        context.drawImage(image, x, y, width, height, 0, 0, width, height);
        canvas.toBlob(blob => {
          if (!blob) { error('imageProcessFailed'); return; }
          if (download.dataset.objectUrl) URL.revokeObjectURL(download.dataset.objectUrl);
          const outputUrl = URL.createObjectURL(blob);
          download.dataset.objectUrl = outputUrl;
          download.href = outputUrl;
          download.download = 'cropped-image.png';
          download.classList.remove('hidden');
          status.textContent = '';
        }, 'image/png');
      } catch {
        error('imageProcessFailed');
      }
    };
  }
}
