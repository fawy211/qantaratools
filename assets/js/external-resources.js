/* QantaraTools external resource manager
 * Keeps third-party URLs in one place and provides a small, consistent loader.
 * Tool data is still processed in the browser; these resources are only helper libraries.
 */
window.QTExternal = window.QTExternal || {
  urls: {
    pdfLib: 'https://cdnjs.cloudflare.com/ajax/libs/pdf-lib/1.17.1/pdf-lib.min.js',
    jsPdf: 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
    pdfJs: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs',
    qrCode: 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js',
    exifJs: 'https://cdn.jsdelivr.net/npm/exif-js@2.3.0/exif.js'
  },
  loaded: Object.create(null),
  globals: {
    pdfLib: () => Boolean(window.PDFLib),
    jsPdf: () => Boolean(window.jspdf),
    qrCode: () => Boolean(window.QRCode),
    exifJs: () => Boolean(window.EXIF)
  },
  loadScript(key, options = {}) {
    const src = this.urls[key] || key;
    const isReady = this.globals[key];
    if (isReady && isReady()) return Promise.resolve();
    if (this.loaded[src]) return this.loaded[src];

    const promise = new Promise((resolve, reject) => {
      const fail = () => reject(new Error(options.error || 'The helper library could not be loaded. Please check your internet connection.'));
      const existing = [...document.scripts].find(script => script.src === src);

      if (existing) {
        if (existing.dataset.qtLoaded === 'true' || (isReady && isReady())) {
          resolve();
          return;
        }
        existing.addEventListener('load', resolve, { once: true });
        existing.addEventListener('error', fail, { once: true });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => {
        script.dataset.qtLoaded = 'true';
        resolve();
      };
      script.onerror = fail;
      document.head.appendChild(script);
    });

    this.loaded[src] = promise;
    promise.catch(() => {
      if (this.loaded[src] === promise) delete this.loaded[src];
    });
    return promise;
  },
  async checkConnection() {
    return navigator.onLine !== false;
  }
};
