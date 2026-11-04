// js/tools/Development/text-case-slug.js

export class TextCaseSlugTool {
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
                        <h2 class="text-lg font-semibold text-white">Text Case & Slug Converter</h2>
                        <p class="text-xs text-gray-400 mt-0.5">Transform text cases (UPPER, lower, camel, snake) and generate clean URL slugs.</p>
                    </div>
                    <span class="bg-indigo-500/10 text-indigo-400 text-xs px-2.5 py-1 rounded-md border border-indigo-500/20">Dev Tool</span>
                </div>

                <!-- Input Text Area -->
                <div class="space-y-1">
                    <label class="block text-xs font-medium text-gray-400">Input Text</label>
                    <textarea id="caseInput" rows="3" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-100 text-xs font-mono focus:outline-none focus:border-indigo-500" placeholder="Type or paste your text here..."></textarea>
                </div>

                <!-- Action Buttons / Cases -->
                <div class="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
                    <button id="btnUpper" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs py-2 px-3 rounded-lg font-medium transition cursor-pointer">UPPERCASE</button>
                    <button id="btnLower" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs py-2 px-3 rounded-lg font-medium transition cursor-pointer">lowercase</button>
                    <button id="btnTitle" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs py-2 px-3 rounded-lg font-medium transition cursor-pointer">Title Case</button>
                    <button id="btnSentence" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs py-2 px-3 rounded-lg font-medium transition cursor-pointer">Sentence case</button>
                    <button id="btnCamel" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs py-2 px-3 rounded-lg font-medium transition cursor-pointer">camelCase</button>
                    <button id="btnSnake" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs py-2 px-3 rounded-lg font-medium transition cursor-pointer">snake_case</button>
                    <button id="btnKebab" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs py-2 px-3 rounded-lg font-medium transition cursor-pointer">kebab-slug</button>
                    <button id="btnClearCase" class="bg-gray-800 hover:bg-gray-700 text-gray-400 text-xs py-2 px-3 rounded-lg font-medium transition cursor-pointer">Clear</button>
                </div>

                <!-- Output Area -->
                <div id="caseResultArea" class="hidden space-y-2 pt-2">
                    <div class="flex items-center justify-between">
                        <label class="block text-xs font-medium text-gray-400">Converted Output</label>
                        <button id="copyCaseBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded border border-gray-700 transition cursor-pointer">Copy Output</button>
                    </div>
                    <textarea id="caseOutput" rows="3" readonly class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-indigo-300 text-xs font-mono focus:outline-none"></textarea>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    convert(type) {
        const inputEl = document.getElementById('caseInput');
        const outputArea = document.getElementById('caseOutput');
        const resultArea = document.getElementById('caseResultArea');

        if (!inputEl || !outputArea || !resultArea) return;

        const input = inputEl.value;

        if (!input) {
            alert('Please enter some text first.');
            return;
        }

        let result = '';

        switch (type) {
            case 'upper':
                result = input.toUpperCase();
                break;
            case 'lower':
                result = input.toLowerCase();
                break;
            case 'title':
                result = input.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
                break;
            case 'sentence':
                result = input.toLowerCase().replace(/(^\s*[\w])|([.!?]\s*[\w])/g, (c) => c.toUpperCase());
                break;
            case 'camel':
                result = input
                    .replace(/[^a-zA-Z0-9]+(.)/g, (match, chr) => chr.toUpperCase())
                    .replace(/^[A-Z]/, (chr) => chr.toLowerCase())
                    .replace(/[^a-zA-Z0-9]/g, '');
                break;
            case 'snake':
                result = input
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9]+/g, '_')
                    .replace(/^_+|_+$/g, '');
                break;
            case 'kebab':
                result = input
                    .trim()
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9]+/g, '-')
                    .replace(/^-+|-+$/g, '');
                break;
        }

        outputArea.value = result;
        resultArea.classList.remove('hidden');
    }

    bindEvents() {
        const inputEl = document.getElementById('caseInput');
        const outputArea = document.getElementById('caseOutput');
        const clearBtn = document.getElementById('btnClearCase');
        const copyBtn = document.getElementById('copyCaseBtn');
        const resultArea = document.getElementById('caseResultArea');

        const btnUpper = document.getElementById('btnUpper');
        const btnLower = document.getElementById('btnLower');
        const btnTitle = document.getElementById('btnTitle');
        const btnSentence = document.getElementById('btnSentence');
        const btnCamel = document.getElementById('btnCamel');
        const btnSnake = document.getElementById('btnSnake');
        const btnKebab = document.getElementById('btnKebab');

        if (btnUpper) btnUpper.addEventListener('click', () => this.convert('upper'));
        if (btnLower) btnLower.addEventListener('click', () => this.convert('lower'));
        if (btnTitle) btnTitle.addEventListener('click', () => this.convert('title'));
        if (btnSentence) btnSentence.addEventListener('click', () => this.convert('sentence'));
        if (btnCamel) btnCamel.addEventListener('click', () => this.convert('camel'));
        if (btnSnake) btnSnake.addEventListener('click', () => this.convert('snake'));
        if (btnKebab) btnKebab.addEventListener('click', () => this.convert('kebab'));

        if (clearBtn && inputEl && outputArea && resultArea) {
            clearBtn.addEventListener('click', () => {
                inputEl.value = '';
                outputArea.value = '';
                resultArea.classList.add('hidden');
            });
        }

        if (copyBtn && outputArea) {
            copyBtn.addEventListener('click', () => {
                const text = outputArea.value;
                if (!text) return;
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy Output'; }, 2000);
                });
            });
        }
    }
}