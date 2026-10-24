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
  loadScript(key, options = {}) {
    const src = this.urls[key] || key;
    if (this.loaded[src]) return this.loaded[src];
    this.loaded[src] = new Promise((resolve, reject) => {
      const existing = [...document.scripts].find(s => s.src === src);
      if (existing) {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error(options.error || 'The helper library could not be loaded.')));
        return;
      }
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      script.crossOrigin = 'anonymous';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(options.error || 'The helper library could not be loaded. Please check your internet connection.'));
      document.head.appendChild(script);
    });
    return this.loaded[src];
  },
  async checkConnection() {
    return navigator.onLine !== false;
  }
};
