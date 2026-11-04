export class ExifViewerTool {
    constructor(id) {
        this.container = document.getElementById(id);
        this.init();
    }
    init() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                    <h2 class="text-lg font-semibold text-white">Image Metadata Viewer</h2>
                    <p class="text-xs text-gray-400 mt-1">Inspect metadata stored inside an image. Processing stays in your browser.</p>
                </div>
                <input id="exifFile" type="file" accept="image/*" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-200">
                <div class="text-xs text-amber-300">If the image contains GPS data, it may reveal where the photo was taken.</div>
                <div id="exifOut" class="hidden overflow-auto max-h-80 border border-gray-800 rounded-xl"></div>
            </div>
        `;
        this.bind();
    }
    bind() {
        this.container.querySelector('#exifFile').onchange = e => this.read(e.target.files[0]);
    }
    async read(file) {
        const out = this.container.querySelector('#exifOut');
        if (!file) return;
        try {
            if (!window.EXIF && window.QTExternal) {
                await window.QTExternal.loadScript('exifJs', { error: 'The metadata helper could not be loaded. Please check your internet connection and try again.' });
            }
            if (!window.EXIF) throw new Error('The metadata helper is not available right now.');
            
            EXIF.getData(file, function() {
                const data = EXIF.getAllTags(this);
                const keys = Object.keys(data);
                out.classList.remove('hidden');
                if (!keys.length) {
                    out.innerHTML = '<div class="p-4 text-gray-400">No readable EXIF metadata was found.</div>';
                    return;
                }
                out.innerHTML = '<table class="w-full text-xs"><tbody>' + keys.map(k => `<tr class="border-b border-gray-800"><td class="p-2 text-gray-400">${k}</td><td class="p-2 text-gray-100 break-all">${String(data[k])}</td></tr>`).join('') + '</tbody></table>';
            });
        } catch (e) {
            out.classList.remove('hidden');
            out.innerHTML = '<div class="p-4 text-amber-300">' + String(e.message || e) + '</div>';
        }
    }
}