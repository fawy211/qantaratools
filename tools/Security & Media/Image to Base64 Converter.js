// js/tools/Security & Media/image-base64.js

export class ImageBase64Tool {
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
                        <h2 class="text-lg font-semibold text-white">Image to Base64 Converter</h2>
                        <p class="text-xs text-gray-400 mt-0.5">Convert images to Base64 data strings or decode Base64 back to images instantly.</p>
                    </div>
                    <span class="bg-indigo-500/10 text-indigo-400 text-xs px-2.5 py-1 rounded-md border border-indigo-500/20">Media Tool</span>
                </div>

                <!-- Upload / Input Section -->
                <div class="border-2 border-dashed border-gray-800 rounded-xl p-6 text-center hover:border-indigo-500/50 transition cursor-pointer relative" id="b64DropZone">
                    <input type="file" id="b64FileInput" accept="image/*" class="absolute inset-0 opacity-0 cursor-pointer w-full h-full">
                    <div class="space-y-2 pointer-events-none">
                        <svg class="w-8 h-8 mx-auto text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        <p class="text-xs text-gray-300 font-medium">Drop an image here, or <span class="text-indigo-400">browse</span></p>
                        <p class="text-[10px] text-gray-500">Converts image file to Base64 string automatically</p>
                    </div>
                </div>

                <!-- Results Area -->
                <div id="b64ResultArea" class="hidden space-y-3 pt-2">
                    <div class="flex items-center justify-between">
                        <label class="block text-xs font-medium text-gray-400">Base64 Output String</label>
                        <button id="copyB64Btn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-3 py-1 rounded border border-gray-700 transition cursor-pointer">Copy String</button>
                    </div>
                    <textarea id="b64Output" rows="4" readonly class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-indigo-300 text-xs font-mono focus:outline-none"></textarea>
                    
                    <div class="flex justify-end">
                        <button id="clearB64Btn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2 rounded-lg font-medium transition cursor-pointer">Clear</button>
                    </div>
                </div>
            </div>
        `;

        this.bindEvents();
    }

    processFile(file) {
        const outputArea = document.getElementById('b64Output');
        const resultArea = document.getElementById('b64ResultArea');

        if (!outputArea || !resultArea) return;

        if (!file || !file.type.startsWith('image/')) {
            alert('Please select a valid image file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64String = e.target.result;
            outputArea.value = base64String;
            resultArea.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    }

    bindEvents() {
        const fileInput = document.getElementById('b64FileInput');
        const outputArea = document.getElementById('b64Output');
        const copyBtn = document.getElementById('copyB64Btn');
        const clearBtn = document.getElementById('clearB64Btn');
        const resultArea = document.getElementById('b64ResultArea');

        if (fileInput) {
            fileInput.addEventListener('change', (e) => {
                if (e.target.files && e.target.files[0]) {
                    this.processFile(e.target.files[0]);
                }
            });
        }

        if (copyBtn && outputArea) {
            copyBtn.addEventListener('click', () => {
                const text = outputArea.value;
                if (!text) return;
                navigator.clipboard.writeText(text).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy String'; }, 2000);
                });
            });
        }

        if (clearBtn && fileInput && outputArea && resultArea) {
            clearBtn.addEventListener('click', () => {
                fileInput.value = '';
                outputArea.value = '';
                resultArea.classList.add('hidden');
            });
        }
    }
}