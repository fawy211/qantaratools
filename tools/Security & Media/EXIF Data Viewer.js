export class ExifViewerTool {
    constructor(id) {
        this.container = document.getElementById(id);
        this.t=(k,f)=>window.QTI18n?.t(k,f)||f;
        this.init();
    }
    init() {
        if (!this.container) return;
        this.container.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div>
                    <h2 class="text-lg font-semibold text-white">${this.t('exifTitle','Image Metadata Viewer')}</h2>
                    <p class="text-xs text-gray-400 mt-1">${this.t('exifDesc','Inspect metadata stored inside an image. Processing stays in your browser.')}</p>
                </div>
                <input id="exifFile" type="file" accept="image/*" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-200">
                <div class="text-xs text-amber-300">${this.t('gpsWarning','If the image contains GPS data, it may reveal where the photo was taken.')}</div>
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
        const t = this.t;
        try {
            if (!window.EXIF && window.QTExternal) {
                await window.QTExternal.loadScript('exifJs', { error: t('exifHelperError','The metadata helper could not be loaded. Please check your internet connection and try again.') });
            }
            if (!window.EXIF) throw new Error(t('exifUnavailable','The metadata helper is not available right now.'));

            EXIF.getData(file, function() {
                const data = EXIF.getAllTags(this) || {};
                const keys = Object.keys(data);
                out.classList.remove('hidden');
                out.replaceChildren();
                if (!keys.length) {
                    out.textContent = t('exifNone','No readable EXIF metadata was found.');
                    return;
                }
                const table = document.createElement('table');
                table.className = 'w-full text-xs';
                const tbody = document.createElement('tbody');
                for (const key of keys) {
                    const row = document.createElement('tr');
                    row.className = 'border-b border-gray-800';
                    const name = document.createElement('td');
                    name.className = 'p-2 text-gray-400';
                    name.textContent = key;
                    const value = document.createElement('td');
                    value.className = 'p-2 text-gray-100 break-all';
                    const raw = data[key];
                    value.textContent = raw && typeof raw === 'object' ? JSON.stringify(raw) : String(raw);
                    row.append(name, value);
                    tbody.appendChild(row);
                }
                table.appendChild(tbody);
                out.appendChild(table);
            });
        } catch (e) {
            out.classList.remove('hidden');
            out.textContent = String(e.message || e);
        }
    }
}
