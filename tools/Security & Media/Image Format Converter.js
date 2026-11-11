export class ImageFormatTool {
  constructor(id) {
    this.c = document.getElementById(id);
    this.t = (key, fallback) => window.QTI18n?.t(key, fallback) || fallback;
    this.init();
  }

  init() {
    this.c.innerHTML = `<div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
      <h2 class="text-lg font-semibold text-white">${this.t('formatTitle','Image Format Converter')}</h2>
      <p class="text-xs text-gray-400">${this.t('formatDesc','Convert images to PNG, JPEG, or WebP locally. Your image stays on this device.')}</p>
      <input id="ifFile" type="file" accept="image/*" class="w-full text-sm text-gray-300">
      <div class="flex flex-wrap gap-3">
        <select id="ifFmt" class="bg-gray-950 border border-gray-800 rounded-lg p-2 text-gray-100">
          <option value="image/png">PNG</option><option value="image/jpeg">JPEG</option><option value="image/webp">WebP</option>
        </select>
        <input id="ifQ" type="range" min="0.1" max="1" step="0.05" value="0.9">
        <button id="ifRun" class="bg-indigo-600 text-white px-4 py-2 rounded-lg">${this.t('convert','Convert')}</button>
      </div>
      <img id="ifPreview" class="max-h-72 max-w-full rounded-xl border border-gray-800 hidden" alt="${this.t('result','Converted image preview')}">
      <a id="ifDownload" class="hidden bg-gray-800 text-gray-200 px-4 py-2 rounded-lg inline-block">${this.t('downloadImage','Download image')}</a>
      <div id="ifStatus" class="text-xs text-gray-400" role="status" aria-live="polite"></div>
    </div>`;

    const fileInput = document.getElementById('ifFile');
    const preview = document.getElementById('ifPreview');
    const status = document.getElementById('ifStatus');
    const download = document.getElementById('ifDownload');
    let file = null;
    let sourceUrl = null;
    const showError = key => { status.textContent = this.t(key, key); download.classList.add('hidden'); };

    preview.onerror = () => {
      preview.classList.add('hidden');
      showError('imageLoadFailed');
    };

    fileInput.onchange = event => {
      file = event.target.files?.[0] || null;
      download.classList.add('hidden');
      status.textContent = '';
      if (sourceUrl) URL.revokeObjectURL(sourceUrl);
      if (!file) return;
      if (!file.type.startsWith('image/') || !file.size) {
        file = null;
        preview.classList.add('hidden');
        showError('imageInvalidFile');
        return;
      }
      sourceUrl = URL.createObjectURL(file);
      preview.src = sourceUrl;
      preview.classList.remove('hidden');
    };

    document.getElementById('ifRun').onclick = () => {
      if (!file) {
        showError('imageInvalidFile');
        return;
      }
      const image = new Image();
      image.onerror = () => showError('imageLoadFailed');
      image.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const context = canvas.getContext('2d');
          if (!context || !canvas.width || !canvas.height) {
            showError('imageProcessFailed');
            return;
          }
          context.drawImage(image, 0, 0);
          canvas.toBlob(blob => {
            if (!blob) {
              showError('imageProcessFailed');
              return;
            }
            const outputUrl = URL.createObjectURL(blob);
            download.href = outputUrl;
            download.download = 'converted-image.' + document.getElementById('ifFmt').value.split('/')[1];
            download.classList.remove('hidden');
            status.textContent = this.t('convertedLocally', 'Converted locally.');
          }, document.getElementById('ifFmt').value, Number(document.getElementById('ifQ').value));
        } catch {
          showError('imageProcessFailed');
        }
      };
      image.src = sourceUrl || URL.createObjectURL(file);
    };
  }
}
