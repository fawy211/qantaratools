export class FancyTextTool {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.styles = this.buildStyles();
        this.activeCategory = 'All';
        this.searchTerm = '';
        this.inputText = 'Qantara Tools';
        if (this.container) this.init();
    }

    init() {
        this.container.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
                <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between pb-4 border-b border-gray-800">
                    <div>
                        <h2 class="text-xl font-semibold text-white">Fancy Text Generator</h2>
                        <p class="text-sm text-gray-400 mt-1">Create stylish Unicode text, symbols and decorative designs.</p>
                    </div>
                    <span class="w-fit bg-indigo-500/10 text-indigo-300 text-xs px-3 py-1.5 rounded-full border border-indigo-500/20">Unicode Styles</span>
                </div>

                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-300" for="fancyInput">Your text</label>
                    <textarea id="fancyInput" rows="2" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3.5 text-gray-100 text-base focus:outline-none focus:border-indigo-500 resize-y" placeholder="Type your text here...">Qantara Tools</textarea>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span id="fancyCharCount">0 characters</span>
                        <button id="fancyClearBtn" type="button" class="hover:text-gray-300 transition">Clear</button>
                    </div>
                </div>

                <div class="space-y-3">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                        <div class="flex flex-wrap gap-1.5" id="fancyCategories"></div>
                        <div class="relative sm:w-56">
                            <input id="fancySearch" type="search" class="w-full bg-gray-950 border border-gray-800 rounded-lg px-3 py-2 text-xs text-gray-200 focus:outline-none focus:border-indigo-500" placeholder="Search styles...">
                        </div>
                    </div>
                    <div class="flex items-center justify-between text-xs text-gray-500">
                        <span id="fancyResultCount"></span>
                        <button id="fancyCopyAll" type="button" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg transition">Copy all</button>
                    </div>
                </div>

                <div id="fancyResultsList" class="grid grid-cols-1 lg:grid-cols-2 gap-2.5 max-h-[34rem] overflow-y-auto pr-1"></div>

                <div class="rounded-xl border border-gray-800 bg-gray-950/60 p-3 text-xs text-gray-500 leading-relaxed">
                    Some styles use Unicode characters rather than real fonts. A few apps or older devices may display an unsupported character as a box.
                </div>
            </div>
        `;

        this.bindEvents();
        this.renderCategories();
        this.render();
    }

    buildStyles() {
        const mapRange = (upperStart, lowerStart, digitStart = null) => (text) => [...text].map(ch => {
            const c = ch.codePointAt(0);
            if (c >= 65 && c <= 90) return String.fromCodePoint(upperStart + c - 65);
            if (c >= 97 && c <= 122) return String.fromCodePoint(lowerStart + c - 97);
            if (digitStart !== null && c >= 48 && c <= 57) return String.fromCodePoint(digitStart + c - 48);
            return ch;
        }).join('');

        const combining = mark => text => [...text].map(ch => /\s/.test(ch) ? ch : ch + mark).join('');
        const reverse = text => [...text].reverse().join('');
        const mirror = text => [...text].map(ch => ({
            'a':'ɒ','b':'d','c':'ɔ','d':'b','e':'ɘ','f':'ʇ','g':'ǫ','h':'ɥ','i':'i','j':'ɾ','k':'ʞ','l':'l','m':'m','n':'u','o':'o','p':'q','q':'p','r':'ɿ','s':'s','t':'ʇ','u':'n','v':'ʌ','w':'ʍ','x':'x','y':'ʎ','z':'z',
            'A':'A','B':'ᗺ','C':'Ↄ','D':'◖','E':'Ǝ','F':'ꟻ','G':'ᒋ','H':'H','I':'I','J':'Ⴑ','K':'⋊','L':'⅃','M':'M','N':'N','O':'O','P':'ꟼ','Q':'Q','R':'Я','S':'S','T':'T','U':'∩','V':'Λ','W':'M','X':'X','Y':'⅄','Z':'Z'
        }[ch] || ch)).join('');

        const decorated = (left, right) => text => `${left}${text}${right}`;
        const spaced = text => [...text].join(' ');
        const tiny = text => [...text].map(ch => ({a:'ᵃ',b:'ᵇ',c:'ᶜ',d:'ᵈ',e:'ᵉ',f:'ᶠ',g:'ᵍ',h:'ʰ',i:'ⁱ',j:'ʲ',k:'ᵏ',l:'ˡ',m:'ᵐ',n:'ⁿ',o:'ᵒ',p:'ᵖ',q:'ᑫ',r:'ʳ',s:'ˢ',t:'ᵗ',u:'ᵘ',v:'ᵛ',w:'ʷ',x:'ˣ',y:'ʸ',z:'ᶻ','0':'⁰','1':'¹','2':'²','3':'³','4':'⁴','5':'⁵','6':'⁶','7':'⁷','8':'⁸','9':'⁹',' ':' ' }[ch.toLowerCase()] || ch)).join('');
        const sub = text => [...text].map(ch => ({a:'ₐ',e:'ₑ',h:'ₕ',i:'ᵢ',j:'ⱼ',k:'ₖ',l:'ₗ',m:'ₘ',n:'ₙ',o:'ₒ',p:'ₚ',r:'ᵣ',s:'ₛ',t:'ₜ',u:'ᵤ',v:'ᵥ',x:'ₓ','0':'₀','1':'₁','2':'₂','3':'₃','4':'₄','5':'₅','6':'₆','7':'₇','8':'₈','9':'₉',' ':' ' }[ch.toLowerCase()] || ch)).join('');

        return [
            {name:'Bold', category:'Fonts', fn:mapRange(0x1D400,0x1D41A)},
            {name:'Italic', category:'Fonts', fn:mapRange(0x1D434,0x1D44E)},
            {name:'Bold Italic', category:'Fonts', fn:mapRange(0x1D468,0x1D482)},
            {name:'Sans Serif', category:'Fonts', fn:mapRange(0x1D5A0,0x1D5BA)},
            {name:'Sans Bold', category:'Fonts', fn:mapRange(0x1D5D4,0x1D5EE)},
            {name:'Sans Italic', category:'Fonts', fn:mapRange(0x1D608,0x1D622)},
            {name:'Monospace', category:'Fonts', fn:mapRange(0x1D670,0x1D68A,0x1D7F6)},
            {name:'Double Struck', category:'Fonts', fn:mapRange(0x1D538,0x1D552)},
            {name:'Fraktur', category:'Fonts', fn:mapRange(0x1D504,0x1D51E)},
            {name:'Bold Fraktur', category:'Fonts', fn:mapRange(0x1D56C,0x1D586)},
            {name:'Script', category:'Fonts', fn:mapRange(0x1D49C,0x1D4B6)},
            {name:'Bold Script', category:'Fonts', fn:mapRange(0x1D4D0,0x1D4EA)},
            {name:'Fullwidth', category:'Fonts', fn:text => [...text].map(ch => { const c=ch.codePointAt(0); return c>=33&&c<=126?String.fromCodePoint(c+0xFEE0):ch; }).join('')},
            {name:'Small Caps', category:'Fonts', fn:text => [...text].map(ch => ({a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ꜰ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'s',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',' ':' ' }[ch.toLowerCase()]||ch)).join('')},
            {name:'Superscript', category:'Symbols', fn:tiny},
            {name:'Subscript', category:'Symbols', fn:sub},
            {name:'Circled', category:'Symbols', fn:text => [...text].map(ch => {const c=ch.toUpperCase().codePointAt(0); if(c>=65&&c<=90)return String.fromCodePoint(0x24B6+c-65); if(/[0-9]/.test(ch))return ({'0':'⓪','1':'①','2':'②','3':'③','4':'④','5':'⑤','6':'⑥','7':'⑦','8':'⑧','9':'⑨'}[ch]); return ch;}).join('')},
            {name:'Squared', category:'Symbols', fn:text => [...text].map(ch => {const c=ch.toUpperCase().codePointAt(0); return c>=65&&c<=90?String.fromCodePoint(0x1F130+c-65):ch;}).join('')},
            {name:'Negative Squared', category:'Symbols', fn:text => [...text].map(ch => {const c=ch.toUpperCase().codePointAt(0); return c>=65&&c<=90?String.fromCodePoint(0x1F170+c-65):ch;}).join('')},
            {name:'Strikethrough', category:'Effects', fn:combining('\u0336')},
            {name:'Underline', category:'Effects', fn:combining('\u0332')},
            {name:'Double Underline', category:'Effects', fn:combining('\u0333')},
            {name:'Overline', category:'Effects', fn:combining('\u0305')},
            {name:'Slash', category:'Effects', fn:combining('\u0338')},
            {name:'Dotted', category:'Effects', fn:combining('\u0307')},
            {name:'Glitch', category:'Effects', fn:text => [...text].map(ch => /\s/.test(ch)?ch:ch+'\u035c\u033d\u0489').join('')},
            {name:'Spaced', category:'Decorations', fn:spaced},
            {name:'꧁ Royal ꧂', category:'Decorations', fn:decorated('꧁ ',' ꧂')},
            {name:'『 Elegant 』', category:'Decorations', fn:decorated('『 ',' 』')},
            {name:'【 Box 】', category:'Decorations', fn:decorated('【 ',' 】')},
            {name:'༺ Fantasy ༻', category:'Decorations', fn:decorated('༺ ',' ༻')},
            {name:'✦ Sparkle ✦', category:'Decorations', fn:decorated('✦ ',' ✦')},
            {name:'♡ Hearts ♡', category:'Decorations', fn:decorated('♡ ',' ♡')},
            {name:'☾ Night ☽', category:'Decorations', fn:decorated('☾ ',' ☽')},
            {name:'Upside Down', category:'Effects', fn:text => mirror(reverse(text))}
        ];
    }

    renderCategories() {
        const el = document.getElementById('fancyCategories');
        if (!el) return;
        const categories = ['All', ...new Set(this.styles.map(s => s.category))];
        el.innerHTML = categories.map(cat => `
            <button type="button" data-category="${cat}" class="fancy-category-btn px-3 py-1.5 rounded-lg text-xs border transition ${cat===this.activeCategory?'bg-indigo-600 text-white border-indigo-500':'bg-gray-950 text-gray-400 border-gray-800 hover:text-gray-200'}">${cat}</button>
        `).join('');
        el.querySelectorAll('.fancy-category-btn').forEach(btn => btn.addEventListener('click', () => {
            this.activeCategory = btn.dataset.category;
            this.renderCategories();
            this.render();
        }));
    }

    render() {
        const list = document.getElementById('fancyResultsList');
        const count = document.getElementById('fancyResultCount');
        const counter = document.getElementById('fancyCharCount');
        const copyAll = document.getElementById('fancyCopyAll');
        if (!list) return;

        const text = this.inputText;
        if (counter) counter.textContent = `${[...text].length} character${[...text].length===1?'':'s'}`;
        const q = this.searchTerm.trim().toLowerCase();
        const filtered = this.styles.filter(style => {
            const catOk = this.activeCategory === 'All' || style.category === this.activeCategory;
            const searchOk = !q || style.name.toLowerCase().includes(q) || style.category.toLowerCase().includes(q);
            return catOk && searchOk;
        });

        if (count) count.textContent = `${filtered.length} style${filtered.length===1?'':'s'}`;
        if (copyAll) copyAll.disabled = filtered.length === 0;
        list.innerHTML = '';

        if (!text) {
            list.innerHTML = '<div class="lg:col-span-2 text-sm text-gray-500 text-center py-8">Type something above to see your styles.</div>';
            return;
        }
        if (!filtered.length) {
            list.innerHTML = '<div class="lg:col-span-2 text-sm text-gray-500 text-center py-8">No styles match your search.</div>';
            return;
        }

        filtered.forEach(style => {
            const value = style.fn(text);
            const item = document.createElement('div');
            item.className = 'flex items-center gap-3 p-3 bg-gray-950 rounded-xl border border-gray-800 hover:border-gray-700 transition min-w-0';
            item.innerHTML = `
                <div class="min-w-0 flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] text-gray-500 uppercase tracking-wide">${this.escape(style.category)}</span>
                        <span class="text-xs text-gray-300">${this.escape(style.name)}</span>
                    </div>
                    <div class="text-sm text-gray-100 break-words select-all leading-6">${this.escape(value)}</div>
                </div>
                <button type="button" class="copy-style-btn shrink-0 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs px-3 py-2 rounded-lg border border-gray-700 transition">Copy</button>
            `;
            const btn = item.querySelector('.copy-style-btn');
            btn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(value);
                    btn.textContent = 'Copied';
                    setTimeout(() => btn.textContent = 'Copy', 1400);
                } catch {
                    btn.textContent = 'Select & copy';
                }
            });
            list.appendChild(item);
        });
    }

    bindEvents() {
        const input = document.getElementById('fancyInput');
        const search = document.getElementById('fancySearch');
        const clear = document.getElementById('fancyClearBtn');
        const copyAll = document.getElementById('fancyCopyAll');

        input?.addEventListener('input', e => { this.inputText = e.target.value; this.render(); });
        search?.addEventListener('input', e => { this.searchTerm = e.target.value; this.render(); });
        clear?.addEventListener('click', () => { this.inputText = ''; if(input) input.value=''; this.render(); input?.focus(); });
        copyAll?.addEventListener('click', async () => {
            const q = this.searchTerm.trim().toLowerCase();
            const styles = this.styles.filter(s => (this.activeCategory==='All'||s.category===this.activeCategory) && (!q||s.name.toLowerCase().includes(q)||s.category.toLowerCase().includes(q)));
            const output = styles.map(s => s.fn(this.inputText)).join('\n');
            if (!output) return;
            try { await navigator.clipboard.writeText(output); copyAll.textContent='Copied'; setTimeout(()=>copyAll.textContent='Copy all',1400); } catch {}
        });
    }

    escape(value) {
        return String(value).replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
    }
}
