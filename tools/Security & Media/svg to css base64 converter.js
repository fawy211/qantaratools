// js/tools/Security & Media/svg-to-css.js

export class SvgToCssTool {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    init() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between pb-4 border-b border-gray-800">
                    <div>
                        <h2 class="text-lg font-semibold text-white">SVG to CSS Base64 Converter</h2>
                        <p class="text-xs text-gray-400 mt-0.5">Convert SVG code or files into clean CSS background-image Base64 strings.</p>
                    </div>
                    <span class="bg-indigo-500/10 text-indigo-400 text-xs px-2.5 py-1 rounded-md border border-indigo-500/20">Media Tool</span>
                </div>

                <!-- Input Section -->
                <div class="space-y-2">
                    <div class="flex items-center justify-between">
                        <label class="block text-xs font-medium text-gray-400">Paste SVG Code</label>
                        <label class="text-xs text-indigo-400 hover:text-indigo-300 cursor-pointer">
                            Upload SVG File <input type="file" id="svgFileInput" accept=".svg" class="hidden">
                        </label>
                    </div>
                    <textarea id="svgInput" rows="5" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-100 text-xs font-mono focus:outline-none focus:border-indigo-500" placeholder="<svg xmlns='http://www.w3.org/2000/svg' ...>...</svg>"></textarea>
                </div>

                <div class="flex gap-2 pt-1">
                    <button id="convertSvgBtn" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2.5 rounded-lg font-medium transition cursor-pointer">Convert to CSS</button>
                    <button id="minifySvgBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg font-medium transition cursor-pointer">Minify SVG</button>
                    <button id="downloadSvgBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg font-medium transition cursor-pointer">Download CSS</button>
                    <button id="clearSvgBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg font-medium transition cursor-pointer">Clear</button>
                </div>

                <!-- Results Output Area -->
                <div id="svgResultArea" class="hidden space-y-3 pt-2">
                    <div class="flex items-center justify-between">
                        <label class="block text-xs font-medium text-gray-400">CSS Background Property</label>
                        <button id="copySvgCssBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded border border-gray-700 transition cursor-pointer">Copy CSS</button>
                    </div>
                    <textarea id="svgCssOutput" rows="3" readonly class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-emerald-400 text-xs font-mono focus:outline-none"></textarea>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    convert() {
        const svgCode = document.getElementById('svgInput').value.trim();
        const outputArea = document.getElementById('svgCssOutput');
        const resultArea = document.getElementById('svgResultArea');

        if (!svgCode) {
            alert('Please enter or upload an SVG code first.');
            return;
        }

        try {
            if (!/^<svg[\s>]/i.test(svgCode)) throw new Error('Input does not look like an SVG file.');
            // تنظيف وترميز الـ SVG للاستخدام الآمن في الـ CSS
            let cleanedSvg = svgCode.replace(/\s+/g, ' ').trim();
            
            // ترميز الأحرف الخاصة للـ Data URI
            const encoded = encodeURIComponent(cleanedSvg)
                .replace(/'/g, '%27')
                .replace(/"/g, '%22');

            const cssValue = `background-image: url("data:image/svg+xml;charset=utf-8,${encoded}");`;
            
            outputArea.value = cssValue;
            resultArea.classList.remove('hidden');
        } catch (err) {
            alert('Error processing SVG code. Please check your syntax.');
        }
    }

    bindEvents() {
        const convertBtn = document.getElementById('convertSvgBtn');
        const clearBtn = document.getElementById('clearSvgBtn');
        const fileInput = document.getElementById('svgFileInput');
        const svgInput = document.getElementById('svgInput');
        const copyBtn = document.getElementById('copySvgCssBtn');
        const minifyBtn = document.getElementById('minifySvgBtn');
        const downloadBtn = document.getElementById('downloadSvgBtn');
        const outputArea = document.getElementById('svgCssOutput');

        convertBtn.addEventListener('click', () => this.convert());

        fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files[0]) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    svgInput.value = event.target.result;
                    this.convert();
                };
                reader.readAsText(e.target.files[0]);
            }
        });

        minifyBtn.addEventListener('click', () => {
            const value = svgInput.value.trim();
            if (!value) return alert('Please enter SVG code first.');
            svgInput.value = value.replace(/<!--[\s\S]*?-->/g, '').replace(/>\s+</g, '><').replace(/\s{2,}/g, ' ').trim();
        });

        downloadBtn.addEventListener('click', () => {
            const text = outputArea.value;
            if (!text) return alert('Convert the SVG first.');
            const blob = new Blob([text], {type:'text/css'});
            const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'svg-background.css'; a.click();
            setTimeout(() => URL.revokeObjectURL(a.href), 500);
        });

        clearBtn.addEventListener('click', () => {
            svgInput.value = '';
            fileInput.value = '';
            outputArea.value = '';
            document.getElementById('svgResultArea').classList.add('hidden');
        });

        copyBtn.addEventListener('click', () => {
            const text = outputArea.value;
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => { copyBtn.textContent = 'Copy CSS'; }, 2000);
            });
        });
    }
}