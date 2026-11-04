export class ColorConverterTool {
  constructor(id) {
    this.container = document.getElementById(id);
    this.init();
  }

  init() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Main Tool Card -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div class="pb-4 border-b border-gray-800/80">
            <h1 class="text-xl font-bold text-white tracking-tight">Color Converter (HEX, RGB, HSL)</h1>
            <p class="text-xs text-gray-400 mt-1">Convert HEX color codes instantly to RGB, HSL, and CSS formats locally.</p>
          </div>

          <div class="flex flex-wrap gap-3 items-center">
            <div class="relative flex items-center justify-center w-12 h-11 bg-gray-950 border border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:border-gray-700 transition-all">
              <input id="ccPicker" type="color" value="#4f46e5" class="absolute -inset-2 w-16 h-16 opacity-0 cursor-pointer">
              <div id="ccPickerPreview" class="w-8 h-8 rounded-lg shadow-inner bg-indigo-600"></div>
            </div>
            
            <div class="flex-1 relative">
              <span class="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-mono text-gray-500">#</span>
              <input id="ccHex" value="4f46e5" placeholder="4f46e5" maxlength="6" class="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl py-3 pl-8 pr-4 text-gray-100 font-mono text-sm uppercase transition-all outline-none">
            </div>

            <button id="ccCopy" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-3 rounded-xl transition-all shadow-lg shadow-indigo-600/20">Copy CSS</button>
          </div>

          <div id="ccOut" class="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2"></div>
          
          <div id="ccStatus" class="text-xs text-indigo-400 font-medium h-4"></div>
        </div>

        <!-- SEO Content & Guide Section -->
        <section class="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 text-gray-400 text-xs space-y-3">
          <h2 class="text-sm font-semibold text-gray-300">About Online Color Format Converter</h2>
          <p>
            Web developers and designers often need to translate color codes between different formats like HEX, RGB, and HSL. 
            **QantaraTools Color Converter** performs these conversions instantly in your browser with zero latency and absolute privacy. 
            Simply pick a color or type your HEX code to get matching CSS-ready values right away.
          </p>
        </section>
      </div>
    `;
    
    this.bind();
    this.convert();
  }

  bind() {
    const hex = this.container.querySelector('#ccHex');
    const pick = this.container.querySelector('#ccPicker');
    const preview = this.container.querySelector('#ccPickerPreview');
    const copyBtn = this.container.querySelector('#ccCopy');
    const status = this.container.querySelector('#ccStatus');

    pick.oninput = () => {
      hex.value = pick.value.replace('#', '').toUpperCase();
      preview.style.backgroundColor = pick.value;
      this.convert();
    };

    hex.oninput = () => {
      const cleanVal = hex.value.replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
      if (cleanVal.length === 6) {
        pick.value = '#' + cleanVal;
        preview.style.backgroundColor = '#' + cleanVal;
      }
      this.convert();
    };

    copyBtn.onclick = () => {
      let h = hex.value.trim().replace('#', '');
      if (h.length === 3) h = h.split('').map(x => x + x).join('');
      if (!/^[0-9a-fA-F]{6}$/.test(h)) {
        status.textContent = 'Please enter a valid HEX code first.';
        return;
      }
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      const cssString = `background-color: #${h.toUpperCase()}; /* rgb(${r}, ${g}, ${b}) */`;
      
      navigator.clipboard?.writeText(cssString);
      status.textContent = 'Copied CSS format to clipboard!';
      setTimeout(() => { status.textContent = ''; }, 2000);
    };
  }

  convert() {
    let h = this.container.querySelector('#ccHex').value.trim().replace('#', '');
    if (h.length === 3) h = h.split('').map(x => x + x).join('');
    
    const out = this.container.querySelector('#ccOut');
    const status = this.container.querySelector('#ccStatus');

    if (!/^[0-9a-fA-F]{6}$/.test(h)) {
      out.innerHTML = `<div class="col-span-full text-center py-4 text-xs text-red-400 bg-gray-950 border border-gray-800 rounded-xl">Invalid HEX code. Please enter 3 or 6 valid hex characters (e.g., 4F46E5).</div>`;
      return;
    }

    if (status.textContent.includes('Invalid')) status.textContent = '';

    const r = parseInt(h.slice(0, 2), 16);
    const g = parseInt(h.slice(2, 4), 16);
    const b = parseInt(h.slice(4, 6), 16);
    
    const R = r / 255, G = g / 255, B = b / 255;
    const max = Math.max(R, G, B), min = Math.min(R, G, B);
    const d = max - min;
    const l = (max + min) / 2;
    
    let s = 0, hh = 0;
    if (d) {
      s = d / (1 - Math.abs(2 * l - 1));
      if (max === R) hh = 60 * (((G - B) / d) % 6);
      else if (max === G) hh = 60 * ((B - R) / d + 2);
      else hh = 60 * ((R - G) / d + 4);
      if (hh < 0) hh += 360;
    }

    out.innerHTML = [
      ['HEX', '#' + h.toUpperCase()],
      ['RGB', `rgb(${r}, ${g}, ${b})`],
      ['HSL', `hsl(${Math.round(hh)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`]
    ].map(x => `
      <div class="bg-gray-950 border border-gray-800 hover:border-gray-700 rounded-xl p-4 transition-all group select-all">
        <div class="text-[11px] font-medium text-gray-500 uppercase tracking-wider">${x[0]}</div>
        <div class="font-mono text-sm text-indigo-300 mt-1 font-semibold">${x[1]}</div>
      </div>
    `).join('');
  }
}