export class HashGeneratorTool {
  constructor(id) {
    this.container = document.getElementById(id);
    this.t=(k,f)=>window.QTI18n?.t(k,f)||f;
    this.tf=(k,f,v)=>Object.entries(v).reduce((a,[x,y])=>a.replaceAll('{'+x+'}',y),this.t(k,f));
    this.init();
  }

  init() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Main Tool Card -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div class="pb-4 border-b border-gray-800/80">
            <h1 class="text-xl font-bold text-white tracking-tight">${this.t('hashTitle','Online Hash Generator (SHA-256, SHA-512, SHA-1)')}</h1>
            <p class="text-xs text-gray-400 mt-1">${this.t('hashDesc','Generate cryptographic hashes locally in your browser with zero data exposure.')}</p>
          </div>

          <textarea id="hashIn" rows="5" class="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-4 text-gray-100 font-mono text-sm transition-all outline-none" placeholder="${this.t('hashPlaceholder','Enter text or string to hash...')}"></textarea>
          
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="flex items-center gap-2">
              <select id="hashAlg" class="bg-gray-950 border border-gray-800 hover:border-gray-700 focus:border-indigo-500 rounded-xl px-4 py-2.5 text-xs text-gray-200 outline-none transition-all cursor-pointer">
                <option value="SHA-256">SHA-256</option>
                <option value="SHA-384">SHA-384</option>
                <option value="SHA-512">SHA-512</option>
                <option value="SHA-1">SHA-1</option>
              </select>
              <button id="hashRun" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20">${this.t('generateHash','Generate Hash')}</button>
            </div>
            
            <button id="hashCopy" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium px-5 py-2.5 rounded-xl transition-all">${this.t('copyHash','Copy Hash')}</button>
          </div>

          <div class="relative">
            <textarea id="hashOut" rows="3" readonly placeholder="${this.t('hashOutputPlaceholder','Generated hash will appear here...')}" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-emerald-400 font-mono text-xs overflow-auto outline-none select-all resize-none"></textarea>
          </div>

          <div id="hashStatus" class="text-xs text-indigo-400 font-medium h-4"></div>
        </div>

        <!-- SEO Content & Guide Section -->
        <section class="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 text-gray-400 text-xs space-y-3">
          <h2 class="text-sm font-semibold text-gray-300">${this.t('aboutHash','About Cryptographic Hash Functions')}</h2>
          <p>
            Cryptographic hash algorithms like SHA-256 and SHA-512 transform any text or data into a fixed-size, unique string. 
            **QantaraTools Hash Generator** performs all calculations securely inside your browser using native Web Crypto APIs. 
            Your private data never gets transmitted or stored on any remote servers.
          </p>
        </section>
      </div>
    `;
    
    this.bind();
  }

  bind() {
    const inputEl = document.getElementById('hashIn');
    const algEl = document.getElementById('hashAlg');
    const outputEl = document.getElementById('hashOut');
    const runBtn = document.getElementById('hashRun');
    const copyBtn = document.getElementById('hashCopy');
    const statusEl = document.getElementById('hashStatus');

    const hex = b => [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');

    const generate = async () => {
      try {
        const text = inputEl.value;
        if (!text) {
          statusEl.textContent = this.t('enterHash','Please enter text to generate hash.');
          outputEl.value = '';
          return;
        }
        const alg = algEl.value;
        const msgUint8 = new TextEncoder().encode(text);
        const hashBuffer = await crypto.subtle.digest(alg, msgUint8);
        outputEl.value = hex(hashBuffer);
        statusEl.textContent = this.tf('hashGenerated','{algorithm} hash generated successfully.',{algorithm:alg});
      } catch (e) {
        statusEl.textContent = this.t('hashError','Error generating hash.');
      }
    };

    runBtn.onclick = generate;
    inputEl.oninput = generate;
    algEl.onchange = generate;

    copyBtn.onclick = () => {
      if (!outputEl.value) {
        statusEl.textContent = this.t('noHash','No hash to copy.');
        return;
      }
      navigator.clipboard?.writeText(outputEl.value);
      statusEl.textContent = this.t('hashCopied','Hash copied to clipboard!');
      setTimeout(() => { statusEl.textContent = ''; }, 2000);
    };
  }
}