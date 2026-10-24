// QantaraTools - Currency & Exchange Rate Converter
// Uses the daily USD-based reference feed and exposes every currency returned by it.

export class CurrencyConverterTool {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.rates = {};
        this.rateDate = "";
        this.currencyNames = {};
        this.init();
    }

    async init() {
        if (!this.container) return;

        this.container.innerHTML = `
            <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
                <div class="flex items-center justify-between pb-4 border-b border-gray-800">
                    <div>
                        <h2 class="text-lg font-semibold text-white">Currency & Exchange Rate Converter</h2>
                        <p class="text-xs text-gray-400 mt-0.5">Convert currencies using a daily reference rate. Rates are not live.</p>
                    </div>
                    <span class="flex items-center gap-2"><span class="cc-currency-count bg-indigo-500/10 text-indigo-400 text-xs px-2.5 py-1 rounded-md border border-indigo-500/20">Currencies</span><span class="bg-slate-700/50 text-slate-300 text-xs px-2.5 py-1 rounded-md border border-slate-700">Daily Rate</span></span>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <div class="space-y-1">
                        <label class="block text-xs font-medium text-gray-400">Amount</label>
                        <input type="number" id="ccAmount" value="1" min="0" step="any" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500">
                    </div>

                    <div class="space-y-1">
                        <label class="block text-xs font-medium text-gray-400">From</label>
                        <select id="ccFrom" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500"></select>
                    </div>

                    <div class="space-y-1">
                        <label class="block text-xs font-medium text-gray-400">To</label>
                        <select id="ccTo" class="w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-100 text-sm font-mono focus:outline-none focus:border-indigo-500"></select>
                    </div>
                </div>

                <div class="flex flex-wrap gap-2 pt-2">
                    <button id="ccConvertBtn" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2.5 rounded-lg font-medium transition cursor-pointer">Convert Currency</button>
                    <button id="ccSwapBtn" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg font-medium transition cursor-pointer">Swap Currencies</button>
                </div>

                <div id="ccResultArea" class="hidden mt-4 p-4 bg-gray-950 rounded-xl border border-gray-800 space-y-1">
                    <label class="block text-xs font-medium text-gray-400">Converted Result</label>
                    <div class="flex items-baseline justify-between gap-3">
                        <span id="ccResultText" class="text-xl font-bold text-emerald-400 font-mono">0.00</span>
                        <span id="ccRateInfo" class="text-xs text-gray-500 font-mono text-right"></span>
                    </div>
                </div>
            </div>
        `;

        await this.fetchRates();
        this.populateCurrencySelects();
        this.bindEvents();
    }

    async fetchRates() {
        const key = "qantaratools_currency_daily_rates_v2";
        const today = new Date().toISOString().slice(0, 10);

        try {
            const cached = JSON.parse(localStorage.getItem(key) || "null");
            if (cached && cached.date === today && cached.rates && cached.rates.USD) {
                this.rates = cached.rates;
                this.rateDate = cached.sourceDate || cached.date;
                return;
            }
        } catch (_) {}

        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 7000);
            const response = await fetch("https://open.er-api.com/v6/latest/USD", {
                signal: controller.signal,
                cache: "no-store"
            });
            clearTimeout(timeout);

            if (!response.ok) throw new Error(`Rate service returned ${response.status}`);
            const data = await response.json();
            if (!data || !data.rates || !Number.isFinite(Number(data.rates.USD))) {
                throw new Error("Rate service unavailable");
            }

            this.rates = Object.fromEntries(
                Object.entries(data.rates).filter(([, value]) => Number.isFinite(Number(value)) && Number(value) > 0)
            );
            this.rates.USD = 1;
            this.rateDate = data.time_last_update_utc || today;

            try {
                localStorage.setItem(key, JSON.stringify({
                    date: today,
                    rates: this.rates,
                    sourceDate: this.rateDate
                }));
            } catch (_) {}
        } catch (_) {
            try {
                const cached = JSON.parse(localStorage.getItem(key) || "null");
                if (cached?.rates?.USD) {
                    this.rates = cached.rates;
                    this.rateDate = cached.sourceDate || cached.date;
                    return;
                }
            } catch (_) {}

            this.rates = {};
            this.rateDate = "No daily rate available";
        }
    }

    getCurrencyName(code) {
        if (this.currencyNames[code]) return this.currencyNames[code];
        try {
            if (typeof Intl !== "undefined" && Intl.DisplayNames) {
                const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
                const name = displayNames.of(code);
                if (name && name !== code) {
                    this.currencyNames[code] = name;
                    return name;
                }
            }
        } catch (_) {}
        return code;
    }

    populateCurrencySelects() {
        const fromSelect = document.getElementById("ccFrom");
        const toSelect = document.getElementById("ccTo");
        if (!fromSelect || !toSelect) return;

        const preferred = [
            "USD", "EUR", "GBP", "EGP", "SAR", "AED", "CAD", "AUD", "JPY",
            "CHF", "CNY", "HKD", "SGD", "NZD", "SEK", "NOK", "DKK", "ZAR", "TRY", "INR"
        ];

        const codes = Object.keys(this.rates).filter(code => /^[A-Z]{3}$/.test(code));
        const ordered = [
            ...preferred.filter(code => codes.includes(code)),
            ...codes.filter(code => !preferred.includes(code)).sort()
        ];

        const options = ordered.map(code => {
            const name = this.getCurrencyName(code);
            return `<option value="${code}">${code} - ${this.escapeHtml(name)}</option>`;
        }).join("");

        fromSelect.innerHTML = options;
        toSelect.innerHTML = options;
        fromSelect.value = this.rates.EGP ? "EGP" : "USD";
        toSelect.value = "USD";

        const count = ordered.length;
        const rateBadge = this.container.querySelector(".cc-currency-count");
        if (rateBadge) rateBadge.textContent = `${count} currencies`;
    }

    escapeHtml(value) {
        return String(value).replace(/[&<>'"]/g, char => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
        }[char]));
    }

    calculate() {
        const amount = parseFloat(document.getElementById("ccAmount")?.value);
        const from = document.getElementById("ccFrom")?.value;
        const to = document.getElementById("ccTo")?.value;
        const resultArea = document.getElementById("ccResultArea");
        const resultText = document.getElementById("ccResultText");
        const rateInfo = document.getElementById("ccRateInfo");

        if (!resultArea || !resultText || !rateInfo) return;
        if (!Number.isFinite(amount) || amount < 0) {
            resultArea.classList.add("hidden");
            return;
        }

        if (!this.rates[from] || !this.rates[to]) {
            resultArea.classList.remove("hidden");
            resultText.textContent = "Daily rate unavailable";
            rateInfo.textContent = "Connect to the internet and try again.";
            return;
        }

        const amountInUSD = amount / Number(this.rates[from]);
        const finalAmount = amountInUSD * Number(this.rates[to]);
        const singleRate = Number(this.rates[to]) / Number(this.rates[from]);
        const decimals = to === "JPY" || to === "KRW" || to === "CLP" ? 0 : 4;

        resultText.textContent = `${finalAmount.toFixed(decimals)} ${to}`;
        rateInfo.textContent = `1 ${from} = ${singleRate.toFixed(decimals)} ${to} • Daily reference • ${String(this.rateDate).replace(" GMT", "")}`;
        resultArea.classList.remove("hidden");
    }

    bindEvents() {
        const convertBtn = document.getElementById("ccConvertBtn");
        const swapBtn = document.getElementById("ccSwapBtn");
        const fromSelect = document.getElementById("ccFrom");
        const toSelect = document.getElementById("ccTo");
        const amountInput = document.getElementById("ccAmount");

        convertBtn?.addEventListener("click", () => this.calculate());
        amountInput?.addEventListener("input", () => this.calculate());
        fromSelect?.addEventListener("change", () => this.calculate());
        toSelect?.addEventListener("change", () => this.calculate());

        swapBtn?.addEventListener("click", () => {
            const temp = fromSelect.value;
            fromSelect.value = toSelect.value;
            toSelect.value = temp;
            this.calculate();
        });

        this.calculate();
    }
}
