// js/tools/Text & Unicode/arabic-fixer.js

export class ArabicFixerTool {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.t=(k,f)=>window.QTI18n?.t(k,f)||f;
        this.init();
    }

    init() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between pb-4 border-b border-gray-800">
                    <div>
                        <h2 class="text-lg font-semibold text-white">${this.t('arabicFixTitle','Arabic Mojibake & Text Fixer')}</h2>
                        <p class="text-xs text-gray-400 mt-0.5">${this.t('arabicFixDesc','Fix broken Arabic text encoding, unreadable characters, and normalization.')}</p>
                    </div>
                    <span class="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-md border border-emerald-500/20">${this.t('activeEngine','Active Engine')}</span>
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">${this.t('brokenArabic','Broken Arabic Text')}</label>
                    <textarea id="arabicInput" rows="4" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500" placeholder="${this.t('brokenPlaceholder','Paste broken text here (e.g. Ù…Ø±Ø­Ø¨Ø§)...')}"></textarea>
                </div>

                <div class="flex flex-wrap gap-2">
                    <button id="fixArabicBtn" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 rounded-lg font-medium transition cursor-pointer">${this.t('fixNormalize','Fix & Normalize Text')}</button>
                    <button id="clearArabicBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg font-medium transition cursor-pointer">${this.t('clear','Clear')}</button>
                </div>

                <div id="arabicResultArea" class="hidden mt-4 space-y-2">
                    <label class="block text-xs font-medium text-gray-400">${this.t('correctedOutput','Corrected Output')}</label>
                    <div class="relative">
                        <textarea id="arabicOutput" rows="4" readonly class="w-full bg-gray-950 p-4 rounded-xl border border-gray-800 text-emerald-400 text-sm font-mono focus:outline-none"></textarea>
                        <button id="copyArabicBtn" class="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded border border-gray-700 transition">${this.t('copy','Copy')}</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    bindEvents() {
        const fixBtn = document.getElementById('fixArabicBtn');
        const clearBtn = document.getElementById('clearArabicBtn');
        const inputArea = document.getElementById('arabicInput');
        const outputArea = document.getElementById('arabicOutput');
        const resultContainer = document.getElementById('arabicResultArea');
        const copyBtn = document.getElementById('copyArabicBtn');

        if (fixBtn) {
            fixBtn.addEventListener('click', () => {
                if (!inputArea || !outputArea || !resultContainer) return;

                try {
                    let text = inputArea.value;
                    if (!text) return;

                    // دالة إصلاح الـ Mojibake المضمونة
                    if (!/[ÃØÙ]/.test(text)) {
                        outputArea.value = text;
                        resultContainer.classList.remove('hidden');
                        return;
                    }
                    try {
                        // Some Windows-1252 decoders display UTF-8 byte 0x85 as an ellipsis.
                        // Map the Windows-1252 punctuation range back to its original byte first.
                        const windows1252 = {
                            '€': 0x80, '‚': 0x82, 'ƒ': 0x83, '„': 0x84, '…': 0x85,
                            '†': 0x86, '‡': 0x87, 'ˆ': 0x88, '‰': 0x89, 'Š': 0x8A,
                            '‹': 0x8B, 'Œ': 0x8C, 'Ž': 0x8E, '‘': 0x91, '’': 0x92,
                            '“': 0x93, '”': 0x94, '•': 0x95, '–': 0x96, '—': 0x97,
                            '˜': 0x98, '™': 0x99, 'š': 0x9A, '›': 0x9B, 'œ': 0x9C,
                            'ž': 0x9E, 'Ÿ': 0x9F
                        };
                        const normalizedBytes = [...text].map(char => {
                            const code = char.codePointAt(0);
                            return code <= 0xFF ? String.fromCharCode(code)
                                : Object.prototype.hasOwnProperty.call(windows1252, char)
                                    ? String.fromCharCode(windows1252[char]) : char;
                        }).join('');
                        text = decodeURIComponent(escape(normalizedBytes));
                    } catch (e) {
                        // Keep the original input if it is not valid UTF-8 mojibake.
                    }

                    outputArea.value = text;
                    resultContainer.classList.remove('hidden');
                } catch (err) {
                    outputArea.value = `Error: ${err.message}`;
                    resultContainer.classList.remove('hidden');
                }
            });
        }

        if (clearBtn && inputArea && outputArea && resultContainer) {
            clearBtn.addEventListener('click', () => {
                inputArea.value = '';
                outputArea.value = '';
                resultContainer.classList.add('hidden');
            });
        }

        if (copyBtn && outputArea) {
            copyBtn.addEventListener('click', () => {
                const text = outputArea.value;
                if (!text) return;

                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = this.t('copied','Copied!');
                    setTimeout(() => { copyBtn.textContent = this.t('copy','Copy'); }, 2000);
                });
            });
        }
    }
}