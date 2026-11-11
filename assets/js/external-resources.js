/* QantaraTools external resource manager
 * First-party assets are preferred; pinned CDN copies are fallback only.
 */
window.QTExternal = window.QTExternal || {
  urls: {
    pdfLib: '/assets/vendor/pdf-lib/1.17.1/pdf-lib.min.js',
    jsPdf: '/assets/vendor/jspdf/2.5.1/jspdf.umd.min.js',
    pdfJs: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs',
    qrCode: '/assets/vendor/qrcodejs/1.0.0/qrcode.min.js',
    exifJs: '/assets/vendor/exif-js/2.3.0/exif.js'
  },
  fallbacks: {
    pdfLib: 'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
    jsPdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    qrCode: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    exifJs: 'https://cdnjs.cloudflare.com/ajax/libs/exif-js/2.3.0/exif.min.js'
  },
  loaded: Object.create(null),
  globals: {
    pdfLib: () => Boolean(window.PDFLib),
    jsPdf: () => Boolean(window.jspdf),
    qrCode: () => Boolean(window.QRCode),
    exifJs: () => Boolean(window.EXIF)
  },
  loadScript(key, options = {}) {
    const primary = this.urls[key] || key;
    const candidates = [primary];
    if (this.fallbacks[key]) candidates.push(this.fallbacks[key]);
    const isReady = this.globals[key];
    if (isReady && isReady()) return Promise.resolve();
    const cacheKey = key + ':' + candidates.join('|');
    if (this.loaded[cacheKey]) return this.loaded[cacheKey];

    const loadOne = (requestedSrc) => {
      const src = new URL(requestedSrc, document.baseURI).href;
      if (isReady && isReady()) return Promise.resolve();
      return new Promise((resolve, reject) => {
        const existing = [...document.scripts].find(script => script.src === src);
        if (existing && (existing.dataset.qtLoaded === 'true' || (isReady && isReady()))) {
          resolve();
          return;
        }
        const script = existing || document.createElement('script');
        const fail = () => {
          if (script.dataset.qtLoaded !== 'true') script.remove();
          reject(new Error('Unable to load ' + requestedSrc));
        };
        script.addEventListener('load', () => {
          script.dataset.qtLoaded = 'true';
          resolve();
        }, { once: true });
        script.addEventListener('error', fail, { once: true });
        if (!existing) {
          script.src = src;
          script.async = true;
          script.crossOrigin = 'anonymous';
          document.head.appendChild(script);
        }
      });
    };

    const promise = candidates.reduce((attempt, src) =>
      attempt.catch(() => loadOne(src)), Promise.reject(new Error('Start local-first load')));
    const result = promise.catch(() => {
      throw new Error(options.error || 'The helper library could not be loaded from the local copy or CDN. Check your connection and try again.');
    });
    this.loaded[cacheKey] = result;
    result.catch(() => {
      if (this.loaded[cacheKey] === result) delete this.loaded[cacheKey];
    });
    return result;
  },
  async checkConnection() {
    return navigator.onLine !== false;
  }
};
