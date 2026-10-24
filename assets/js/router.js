/**
 * QantaraTools - Frontend Tool Router
 *
 * This file is intentionally browser-only. The old version used Express here,
 * which belongs on a Node backend and caused the whole script to crash in the browser.
 */

let activeToolInstance = null;

const TOOL_REGISTRY = {
    'image-rotate-flip': { title: 'Image Rotate & Flip', path: '../../tools/image-advanced.js', exportName: 'ImageRotateFlipTool' },
    'image-batch': { title: 'Batch Image Converter', path: '../../tools/image-advanced.js', exportName: 'ImageBatchTool' },
    'image-watermark': { title: 'Image Watermark', path: '../../tools/image-advanced.js', exportName: 'ImageWatermarkTool' },

    'pdf-merge': { title: 'PDF Merge', path: '../../tools/pdf-tools.js', exportName: 'PdfMergeTool' },
    'pdf-split': { title: 'PDF Split & Page Extractor', path: '../../tools/pdf-tools.js', exportName: 'PdfSplitTool' },
    'pdf-compress': { title: 'PDF Optimizer', path: '../../tools/pdf-tools.js', exportName: 'PdfCompressTool' },
    'pdf-rotate': { title: 'PDF Page Rotator', path: '../../tools/pdf-tools.js', exportName: 'PdfRotateTool' },
    'pdf-reorder': { title: 'PDF Page Reorder', path: '../../tools/pdf-tools.js', exportName: 'PdfReorderTool' },
    'images-pdf': { title: 'Images to PDF', path: '../../tools/pdf-tools.js', exportName: 'ImagesToPdfTool' },
    'text-pdf': { title: 'Text to PDF', path: '../../tools/pdf-tools.js', exportName: 'TextToPdfTool' },

    'url-encoder': { title: 'URL Encoder & Decoder', path: '../../tools/Core & Dev/URL Encoder & Decoder.js', exportName: 'UrlEncoderTool' },
    'jwt-decoder': { title: 'JWT Decoder', path: '../../tools/Core & Dev/JWT Decoder.js', exportName: 'JwtDecoderTool' },
    'regex-tester': { title: 'Regex Tester', path: '../../tools/Core & Dev/Regex Tester.js', exportName: 'RegexTesterTool' },
    'timestamp-converter': { title: 'Timestamp Converter', path: '../../tools/Core & Dev/Timestamp Converter.js', exportName: 'TimestampConverterTool' },
    'hash-generator': { title: 'Hash Generator', path: '../../tools/Core & Dev/Hash Generator.js', exportName: 'HashGeneratorTool' },
    'json-csv': { title: 'JSON ↔ CSV Converter', path: '../../tools/Core & Dev/JSON CSV Converter.js', exportName: 'JsonCsvTool' },
    'sql-formatter': { title: 'SQL Formatter', path: '../../tools/Core & Dev/SQL Formatter.js', exportName: 'SqlFormatterTool' },
    'code-formatter': { title: 'HTML / CSS / JavaScript Formatter', path: '../../tools/Core & Dev/HTML CSS JS Formatter.js', exportName: 'CodeFormatterTool' },
    'image-format': { title: 'Image Format Converter', path: '../../tools/Security & Media/Image Format Converter.js', exportName: 'ImageFormatTool' },
    'image-cropper': { title: 'Image Cropper', path: '../../tools/Security & Media/Image Cropper.js', exportName: 'ImageCropperTool' },
    'text-sorter': { title: 'Text Sorter', path: '../../tools/Text & Unicode/Text Sorter.js', exportName: 'TextSorterTool' },
    'lorem-ipsum': { title: 'Lorem Ipsum Generator', path: '../../tools/Text & Unicode/Lorem Ipsum Generator.js', exportName: 'LoremIpsumTool' },
    'markdown-html': { title: 'Markdown to HTML', path: '../../tools/Text & Unicode/Markdown to HTML.js', exportName: 'MarkdownHtmlTool' },

    'base64': {
        title: 'Base64 Encoder / Decoder',
        path: '../../tools/Core & Dev/base64-tool.js',
        exportName: 'Base64Tool'
    },
    'color-converter': {
        title: 'Color Converter',
        path: '../../tools/Core & Dev/Color Converter.js',
        exportName: 'ColorConverterTool'
    },
    'csv-cleaner': {
        title: 'CSV Data Cleaner',
        path: '../../tools/Core & Dev/csv-cleaner.js',
        exportName: 'CSVCleanerTool'
    },
    'html-entity': {
        title: 'HTML Entity Encoder',
        path: '../../tools/Core & Dev/HTML Entity Encoder.js',
        exportName: 'HtmlEntityTool'
    },
    'json-formatter': {
        title: 'JSON Formatter & Validator',
        path: '../../tools/Core & Dev/json-formatter.js',
        exportName: 'JSONFormatterTool'
    },
    'uuid-generator': {
        title: 'UUID v4 Generator',
        path: '../../tools/Core & Dev/UUID.js',
        exportName: 'UuidTool'
    },
    'currency-converter': {
        title: 'Currency & Exchange Rate Converter',
        path: '../../tools/Business & Finance/Currency & Exchange Rate Converter.js',
        exportName: 'CurrencyConverterTool'
    },
    'discount-calculator': {
        title: 'Discount & Markup Calculator',
        path: '../../tools/Business & Finance/Discount & Markup Calculator.js',
        exportName: 'DiscountCalculatorTool'
    },
    'loan-calculator': {
        title: 'Loan & Mortgage Amortization',
        path: '../../tools/Business & Finance/Loan & Mortgage Amortization.js',
        exportName: 'LoanCalculatorTool'
    },
    'qr-generator': {
        title: 'Quick QR Code Generator',
        path: '../../tools/Business & Finance/Quick QR Code Generator.js',
        exportName: 'QrGeneratorTool'
    },
    'vat-calculator': {
        title: 'VAT & Tax Calculator',
        path: '../../tools/Business & Finance/VAT.js',
        exportName: 'VatCalculatorTool'
    },
    'exif-viewer': {
        title: 'EXIF Data Viewer',
        path: '../../tools/Security & Media/EXIF Data Viewer.js',
        exportName: 'ExifViewerTool'
    },
    'image-compressor': {
        title: 'Image Compressor & Resizer',
        path: '../../tools/Security & Media/Image Compressor & Resizer.js',
        exportName: 'ImageCompressorTool'
    },
    'image-base64': {
        title: 'Image to Base64 Converter',
        path: '../../tools/Security & Media/Image to Base64 Converter.js',
        exportName: 'ImageBase64Tool'
    },
    'password-generator': {
        title: 'Secure Password Generator',
        path: '../../tools/Security & Media/Password Generator.js',
        exportName: 'PasswordGeneratorTool'
    },
    'svg-to-css': {
        title: 'SVG to CSS Background',
        path: '../../tools/Security & Media/svg to css base64 converter.js',
        exportName: 'SvgToCssTool'
    },
    'text-case': {
        title: 'Text Case & Slug Converter',
        path: '../../tools/Text & Unicode/Text Case & Slug Converter.js',
        exportName: 'TextCaseSlugTool'
    },
    'word-counter': {
        title: 'Word & Character Counter',
        path: '../../tools/Text & Unicode/Word & Character Counter.js',
        exportName: 'WordCounterTool'
    },
    'text-diff': {
        title: 'Text Diff Checker',
        path: '../../tools/Text & Unicode/Text Diff Checker.js',
        exportName: 'TextDiffTool'
    },
    'arabic-fixer': {
        title: 'Arabic Fixer',
        path: '../../tools/Text & Unicode/arabic-fixer.js',
        exportName: 'ArabicFixerTool'
    },
    'duplicate-remover': {
        title: 'Duplicate Line Remover',
        path: '../../tools/Text & Unicode/Duplicate Line Remover.js',
        exportName: 'DuplicateLineTool'
    },
    'rtl-cleaner': {
        title: 'RTL & Unicode Cleaner',
        path: '../../tools/Text & Unicode/RTL & Unicode Text Cleaner.js',
        exportName: 'RtlUnicodeCleanerTool'
    },
    'ascii-art': {
        title: 'ASCII Art Text Generator',
        path: '../../tools/Fun & Creative/ASCII Art Text Generator.js',
        exportName: 'AsciiArtTool'
    },
    'gradient-generator': {
        title: 'Background & Gradient Generator',
        path: '../../tools/Fun & Creative/Background & Gradient Generator.js',
        exportName: 'GradientGeneratorTool'
    },
    'fancy-text': {
        title: 'Fancy Text Generator',
        path: '../../tools/Fun & Creative/Fancy Text Generator.js',
        exportName: 'FancyTextTool'
    },
    'decision-maker': {
        title: 'Random Decision Maker',
        path: '../../tools/Fun & Creative/Random Decision Maker.js',
        exportName: 'DecisionMakerTool'
    },
    'pomodoro-timer': {
        title: 'Stopwatch & Pomodoro Timer',
        path: '../../tools/Fun & Creative/Stopwatch & Pomodoro Timer.js',
        exportName: 'PomodoroTimerTool'
    }
};

// Merge opt-in same-origin plugins registered before this script loads.
if (window.QTPluginSystem) Object.assign(TOOL_REGISTRY, window.QTPluginSystem.getRegistry());

async function loadTool(category, title, toolName) {
    const grid = document.getElementById('tools-grid-container');
    const view = document.getElementById('tool-view-container');
    const titleEl = document.getElementById('active-tool-title');
    const box = document.getElementById('active-tool-box');

    if (!view || !box) {
        console.error('Tool view containers are missing from index.html');
        return;
    }

    if (activeToolInstance && typeof activeToolInstance.destroy === 'function') {
        try { activeToolInstance.destroy(); } catch (e) { console.warn('Tool cleanup failed:', e); }
    }
    activeToolInstance = null;

    const config = TOOL_REGISTRY[toolName];
    if (!config) {
        box.innerHTML = `<div class="p-6 rounded-xl border border-red-500/30 bg-red-500/10 text-red-300">Tool <b>${toolName}</b> is not registered yet.</div>`;
        if (grid) grid.classList.add('hidden');
        view.classList.remove('hidden');
        return;
    }

    if (grid) grid.classList.add('hidden');
    view.classList.remove('hidden');
    if (titleEl) titleEl.textContent = title || config.title;
    box.innerHTML = '<div class="py-12 text-center text-slate-400">Loading tool…</div>';
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
        const moduleUrl = encodeURI(config.path);
        const module = await import(moduleUrl);
        const ToolClass = module[config.exportName];

        if (typeof ToolClass !== 'function') {
            throw new Error(`Export "${config.exportName}" was not found in ${config.path}`);
        }

        box.innerHTML = '';
        activeToolInstance = new ToolClass('active-tool-box');
        requestAnimationFrame(() => window.QTToolFeedback?.add(toolName, title || config.title));
        if (typeof window.applySmartExample === 'function') window.applySmartExample(toolName);
        if (typeof window.recordRecentTool === 'function') window.recordRecentTool(toolName, title || config.title);
    } catch (error) {
        console.error(`Failed to load tool: ${toolName}`, error);
        box.innerHTML = `
            <div class="p-6 rounded-2xl border border-red-500/30 bg-red-500/10">
                <h3 class="text-lg font-semibold text-red-300 mb-2">Could not load this tool</h3>
                <p class="text-sm text-red-200/80 mb-3">${error.message}</p>
                <p class="text-xs text-slate-400">Open the browser console (F12) if you need the technical details.</p>
            </div>`;
    }
}

window.router = { loadTool, registry: TOOL_REGISTRY };

window.destroyActiveTool = function(){ if(activeToolInstance && typeof activeToolInstance.destroy==='function'){ try{activeToolInstance.destroy()}catch(e){console.warn('Tool cleanup failed:',e)} } activeToolInstance=null; };
