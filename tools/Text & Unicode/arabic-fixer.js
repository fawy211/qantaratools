// js/tools/Text & Unicode/arabic-fixer.js

export class ArabicFixerTool {
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
                        <h2 class="text-lg font-semibold text-white">Arabic Mojibake & Text Fixer</h2>
                        <p class="text-xs text-gray-400 mt-0.5">Fix broken Arabic text encoding, unreadable characters, and normalization.</p>
                    </div>
                    <span class="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-md border border-emerald-500/20">Active Engine</span>
                </div>

                <div>
                    <label class="block text-xs font-medium text-gray-400 mb-1">Broken Arabic Text</label>
                    <textarea id="arabicInput" rows="4" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-4 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500" placeholder="Paste broken text here (e.g. Ù…Ø±Ø­Ø¨Ø§)..."></textarea>
                </div>

                <div class="flex flex-wrap gap-2">
                    <button id="fixArabicBtn" class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-4 py-2.5 rounded-lg font-medium transition cursor-pointer">Fix & Normalize Text</button>
                    <button id="clearArabicBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg font-medium transition cursor-pointer">Clear</button>
                </div>

                <div id="arabicResultArea" class="hidden mt-4 space-y-2">
                    <label class="block text-xs font-medium text-gray-400">Corrected Output</label>
                    <div class="relative">
                        <textarea id="arabicOutput" rows="4" readonly class="w-full bg-gray-950 p-4 rounded-xl border border-gray-800 text-emerald-400 text-sm font-mono focus:outline-none"></textarea>
                        <button id="copyArabicBtn" class="absolute top-2 right-2 bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-2.5 py-1 rounded border border-gray-700 transition">Copy</button>
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
                        // Convert common UTF-8 mojibake back to readable text.
                        text = decodeURIComponent(escape(text));
                    } catch (e) {
                        // لو النص مش بحاجة لإصلاح أو حصل خطأ، بنجرب الطريقة البديلة
                        try {
                            const bytes = Uint8Array.from(text, c => c.charCodeAt(0));
                            text = new TextDecoder('utf-8').decode(bytes);
                        } catch (err) {
                            // لو فشل تماماً بنسخ النص الأصلي زي ما هو
                        }
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
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
                });
            });
        }
    }
}