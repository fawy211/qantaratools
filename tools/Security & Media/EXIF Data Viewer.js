function exifRow(tag, value) {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-800';
    const tagCell = document.createElement('td');
    tagCell.className = 'p-2 text-gray-400';
    tagCell.textContent = String(tag);
    const valueCell = document.createElement('td');
    valueCell.className = 'p-2 text-gray-100 break-all';
    valueCell.textContent = String(value);
    tr.append(tagCell, valueCell);
    return tr;
}
function exifTable(keys, data) {
    const table = document.createElement('table');
    table.className = 'w-full text-xs';
    const tbody = document.createElement('tbody');
    keys.forEach(k => tbody.appendChild(exifRow(k, data[k])));
    table.appendChild(tbody);
    return table;
}
function exifMessage(text, colorClass) {
    const div = document.createElement('div');
    div.className = 'p-4 ' + colorClass;
    div.textContent = text;
    return div;
}

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
                    out.replaceChildren(exifMessage('No readable EXIF metadata was found.', 'text-gray-400'));
                    return;
                }
                out.replaceChildren(exifTable(keys, data));
            });
        } catch (e) {
            out.classList.remove('hidden');
            out.replaceChildren(exifMessage(String(e.message || e), 'text-amber-300'));
        }
    }
}