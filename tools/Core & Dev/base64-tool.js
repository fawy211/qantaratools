export class Base64Tool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.init();
  }

  init() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Main Tool Card -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div>
            <h1 class="text-xl font-bold text-white tracking-tight">Base64 Encoder & Decoder</h1>
            <p class="text-xs text-gray-400 mt-1">Encode and decode text or files securely in your browser with zero data leakage.</p>
          </div>

          <textarea id="base64Input" rows="5" class="w-full bg-gray-950 border border-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl p-4 text-gray-100 text-sm font-mono transition-all outline-none" placeholder="Paste your text or Base64 string here..."></textarea>
          
          <div class="flex items-center justify-between flex-wrap gap-3">
            <label class="flex items-center gap-2 cursor-pointer bg-gray-950 border border-gray-800 hover:border-gray-700 px-3 py-2 rounded-xl text-xs text-gray-300 transition-all">
              <span>📁 Upload File</span>
              <input id="base64File" type="file" class="hidden">
            </label>
            <span id="base64Status" class="text-xs text-indigo-400 font-medium"></span>
          </div>

          <div class="flex flex-wrap gap-2 pt-2 border-t border-gray-800/60">
            <button id="encodeBtn" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20">Encode Text</button>
            <button id="decodeBtn" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-4 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20">Decode Text</button>
            <button id="copyBase64Btn" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium px-4 py-2.5 rounded-xl transition-all">Copy Result</button>
            <button id="clearBase64Btn" class="bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-gray-200 text-xs font-medium px-4 py-2.5 rounded-xl transition-all ml-auto">Clear</button>
          </div>

          <pre id="base64Output" class="hidden bg-gray-950 p-4 rounded-xl border border-gray-800 text-indigo-300 text-xs font-mono overflow-auto max-h-72 whitespace-pre-wrap select-all"></pre>
        </div>

        <!-- SEO Content & Guide Section (Hidden from UX clutter, perfect for Google Search) -->
        <section class="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 text-gray-400 text-xs space-y-3">
          <h2 class="text-sm font-semibold text-gray-300">About Base64 Encoding & Privacy</h2>
          <p>
            Base64 is a binary-to-text encoding scheme that represents binary data in an ASCII string format. 
            Unlike other online tools, **QantaraTools Base64 Encoder/Decoder** runs 100% locally inside your web browser using JavaScript. 
            Your confidential data, API keys, or sensitive files never leave your device or get sent to any external server.
          </p>
        </section>
      </div>
    `;
    
    this.bind();
  }

  encode(s) {
    let bin = '';
    const bytes = new TextEncoder().encode(s);
    for (let i = 0; i < bytes.length; i += 0x8000) {
      bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    }
    return btoa(bin);
  }

  decode(s) {
    const bin = atob(s.replace(/\s/g, ''));
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  }

  bind() {
    const i = document.getElementById('base64Input');
    const f = document.getElementById('base64File');
    const o = document.getElementById('base64Output');
    const st = document.getElementById('base64Status');

    document.getElementById('encodeBtn').onclick = () => {
      try {
        if (!i.value) {
          st.textContent = 'Please enter text to encode.';
          return;
        }
        const r = this.encode(i.value);
        o.textContent = r;
        o.classList.remove('hidden');
        st.textContent = 'Encoded successfully.';
      } catch (e) {
        st.textContent = 'Could not encode this text.';
      }
    };

    document.getElementById('decodeBtn').onclick = () => {
      try {
        if (!i.value) {
          st.textContent = 'Please enter Base64 string to decode.';
          return;
        }
        const r = this.decode(i.value);
        o.textContent = r;
        o.classList.remove('hidden');
        st.textContent = 'Decoded successfully.';
      } catch (e) {
        st.textContent = 'Invalid Base64 text.';
      }
    };

    f.onchange = () => {
      const file = f.files?.[0];
      if (!file) return;
      const r = new FileReader();
      r.onload = () => {
        const data = String(r.result);
        o.textContent = data.split(',')[1] || data;
        o.classList.remove('hidden');
        st.textContent = `Encoded ${file.name} locally.`;
      };
      r.readAsDataURL(file);
    };

    document.getElementById('copyBase64Btn').onclick = () => {
      if (!o.textContent) return;
      navigator.clipboard?.writeText(o.textContent);
      st.textContent = 'Copied to clipboard!';
      setTimeout(() => { st.textContent = ''; }, 2000);
    };

    document.getElementById('clearBase64Btn').onclick = () => {
      i.value = '';
      f.value = '';
      o.textContent = '';
      o.classList.add('hidden');
      st.textContent = '';
    };
  }
}