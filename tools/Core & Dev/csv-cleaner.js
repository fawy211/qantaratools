export class CSVCleanerTool {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    this.rows = [];
    this.headers = [];
    this.fileName = 'cleaned.csv';
    this.init();
  }

  init() {
    if (!this.container) return;
    
    this.container.innerHTML = `
      <div class="max-w-4xl mx-auto space-y-6">
        <!-- Main Tool Card -->
        <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div class="pb-4 border-b border-gray-800/80">
            <h1 class="text-xl font-bold text-white tracking-tight">CSV Data Cleaner & Deduplicator</h1>
            <p class="text-xs text-gray-400 mt-1">Clean spaces, remove blank rows, and strip duplicates from your CSV files locally in your browser.</p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
            <label class="flex items-center justify-between cursor-pointer bg-gray-950 border border-gray-800 hover:border-gray-700 px-4 py-3 rounded-xl text-xs text-gray-300 transition-all">
              <span class="truncate" id="csvFileLabel">📁 Choose CSV or TXT file...</span>
              <input id="csvFileInput" type="file" accept=".csv,.txt" class="hidden">
            </label>
            <button id="loadSampleCsvBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-medium px-4 py-3 rounded-xl transition-all">Load Example CSV</button>
          </div>

          <div class="flex flex-wrap gap-2 pt-2 border-t border-gray-800/60">
            <button id="cleanCsvBtn" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-indigo-600/20">Clean CSV</button>
            <button id="downloadCsvBtn" class="hidden bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-emerald-600/20">Download Cleaned CSV</button>
            <button id="clearCsvBtn" class="bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-gray-200 text-xs font-medium px-4 py-2.5 rounded-xl transition-all ml-auto">Clear</button>
          </div>

          <div id="csvStats" class="text-xs text-indigo-400 font-medium"></div>
          
          <div class="overflow-x-auto max-h-80 rounded-xl border border-gray-800 bg-gray-950">
            <table id="csvPreview" class="hidden min-w-full text-xs text-left border-collapse"></table>
          </div>
        </div>

        <!-- SEO Content & Guide Section -->
        <section class="bg-gray-900/40 border border-gray-800/60 rounded-2xl p-6 text-gray-400 text-xs space-y-3">
          <h2 class="text-sm font-semibold text-gray-300">About Online CSV Data Cleaner</h2>
          <p>
            Cleaning messy spreadsheets, trimming whitespaces, and filtering out duplicate rows is essential for data analysis. 
            **QantaraTools CSV Cleaner** processes your files entirely inside your web browser. Your sensitive datasets and private CSV files never leave your computer, ensuring 100% data privacy and instant execution.
          </p>
        </section>
      </div>
    `;
    
    this.bind();
  }

  parse(text) {
    const rows = [];
    let row = [], cell = '', q = false;
    for (let i = 0; i < text.length; i++) {
      const c = text[i], n = text[i + 1];
      if (c === '"' && q && n === '"') { cell += '"'; i++; continue; }
      if (c === '"') { q = !q; continue; }
      if (c === ',' && !q) { row.push(cell); cell = ''; continue; }
      if ((c === '\n' || c === '\r') && !q) {
        if (c === '\r' && n === '\n') i++;
        row.push(cell);
        if (row.some(x => x.trim())) rows.push(row);
        row = []; cell = ''; continue;
      }
      cell += c;
    }
    if (cell.length || row.length) {
      row.push(cell);
      if (row.some(x => x.trim())) rows.push(row);
    }
    return rows;
  }

  csv(rows) {
    return rows.map(r => r.map(v => {
      v = String(v ?? '').trim();
      return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v;
    }).join(',')).join('\r\n');
  }

  render() {
    const t = document.getElementById('csvPreview');
    if (!this.rows.length) {
      t.classList.add('hidden');
      return;
    }
    const sample = this.rows.slice(0, 10);
    t.innerHTML = sample.map((r, i) => `
      <tr class="${i === 0 ? 'bg-gray-900/80 font-semibold text-gray-200 border-b border-gray-800' : 'border-b border-gray-900 hover:bg-gray-900/30'}">
        ${r.map(c => `<${i === 0 ? 'th' : 'td'} class="p-3 text-gray-300 truncate max-w-xs">${this.esc(c)}</${i === 0 ? 'th' : 'td'}>`).join('')}
      </tr>
    `).join('');
    t.classList.remove('hidden');
  }

  esc(s) {
    return String(s).replace(/[&<>]/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[m]));
  }

  bind() {
    const fi = document.getElementById('csvFileInput');
    const fileLabel = document.getElementById('csvFileLabel');
    const sample = document.getElementById('loadSampleCsvBtn');
    const clean = document.getElementById('cleanCsvBtn');
    const dl = document.getElementById('downloadCsvBtn');
    const stats = document.getElementById('csvStats');
    const preview = document.getElementById('csvPreview');

    fi.onchange = () => {
      const file = fi.files?.[0];
      if (file) {
        fileLabel.textContent = `📄 ${file.name}`;
        fileLabel.classList.add('text-indigo-300');
      }
    };

    sample.onclick = () => {
      const csvData = 'Name,Email,Age\nAlex, alex@example.com ,31\nSarah,sarah@example.com,27\nAlex, alex@example.com ,31\n Omar ,omar@example.com,34\n';
      const dt = new DataTransfer();
      dt.items.add(new File([csvData], 'sample-data.csv', { type: 'text/csv' }));
      fi.files = dt.files;
      fileLabel.textContent = '📄 sample-data.csv (Example Loaded)';
      fileLabel.classList.add('text-indigo-300');
      stats.textContent = 'Example CSV loaded. Click Clean CSV to process it.';
    };

    clean.onclick = () => {
      const f = fi.files?.[0];
      if (!f) {
        stats.textContent = 'Please choose or load a CSV file first.';
        return;
      }
      this.fileName = 'cleaned-' + f.name;
      const r = new FileReader();
      r.onload = e => {
        const raw = this.parse(e.target.result);
        const seen = new Set();
        this.rows = raw.map(row => row.map(v => v.trim())).filter(row => {
          const k = JSON.stringify(row);
          if (seen.has(k)) return false;
          seen.add(k);
          return true;
        });
        stats.textContent = `Successfully cleaned! Processed ${raw.length} rows → ${this.rows.length} unique rows (Duplicates and blanks removed).`;
        this.render();
        dl.classList.remove('hidden');
      };
      r.readAsText(f);
    };

    dl.onclick = () => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([this.csv(this.rows)], { type: 'text/csv;charset=utf-8' }));
      a.download = this.fileName;
      a.click();
    };

    document.getElementById('clearCsvBtn').onclick = () => {
      fi.value = '';
      fileLabel.textContent = '📁 Choose CSV or TXT file...';
      fileLabel.classList.remove('text-indigo-300');
      this.rows = [];
      stats.textContent = '';
      dl.classList.add('hidden');
      preview.classList.add('hidden');
    };
  }
}