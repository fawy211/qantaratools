export class DiscountCalculatorTool {
  constructor(id) {
    this.container = document.getElementById(id);
    this.init();
  }

  init() {
    if (!this.container) return;

    this.container.innerHTML = `
      <div class="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div class="pb-4 border-b border-gray-800">
          <h2 class="text-lg font-semibold text-white">Discount & Markup Calculator</h2>
          <p class="text-xs text-gray-400 mt-1">Calculate a discount or add a markup to an amount.</p>
        </div>

        <div class="flex flex-wrap gap-4 text-sm text-gray-200" role="radiogroup" aria-label="Calculation type">
          <label class="cursor-pointer"><input type="radio" name="dcMode" value="discount" checked> Discount</label>
          <label class="cursor-pointer"><input type="radio" name="dcMode" value="markup"> Markup</label>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label class="text-xs text-gray-400">
            Amount
            <input id="dcPrice" type="number" min="0" step="any" inputmode="decimal" value="100"
              class="mt-1 w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-100">
          </label>
          <label class="text-xs text-gray-400">
            <span id="dcPctLabel">Discount</span> (%)
            <input id="dcPercent" type="number" min="0" step="any" inputmode="decimal" value="20"
              class="mt-1 w-full bg-gray-950 border border-gray-800 rounded-xl p-3 text-gray-100">
          </label>
        </div>

        <div id="dcError" class="hidden rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300" role="alert"></div>

        <div class="flex gap-2">
          <button id="dcGo" class="bg-indigo-600 hover:bg-indigo-500 text-white text-xs px-5 py-2.5 rounded-lg">Calculate</button>
          <button id="dcClear" class="bg-gray-800 hover:bg-gray-700 text-gray-300 text-xs px-4 py-2.5 rounded-lg">Clear</button>
        </div>

        <div id="dcOut" class="hidden grid grid-cols-1 md:grid-cols-2 gap-3">
          <div class="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <div id="dcMainLabel" class="text-xs text-gray-400">Final Price</div>
            <div id="dcMain" class="text-xl font-bold text-emerald-400 mt-1">0.00</div>
          </div>
          <div class="bg-gray-950 border border-gray-800 rounded-xl p-4">
            <div id="dcSubLabel" class="text-xs text-gray-400">You Save</div>
            <div id="dcSub" class="text-lg font-semibold text-indigo-300 mt-1">0.00</div>
          </div>
        </div>
      </div>`;

    this.bind();
  }

  bind() {
    const q = (selector) => this.container.querySelector(selector);
    const price = q('#dcPrice');
    const pct = q('#dcPercent');
    const go = q('#dcGo');
    const clear = q('#dcClear');
    const error = q('#dcError');

    const getMode = () => q('input[name="dcMode"]:checked')?.value || 'discount';

    const updateMode = () => {
      const mode = getMode();
      q('#dcPctLabel').textContent = mode === 'discount' ? 'Discount' : 'Markup';
      if (mode === 'discount') {
        pct.max = '100';
        if (Number(pct.value) > 100) pct.value = '100';
      } else {
        pct.removeAttribute('max');
      }
      error.classList.add('hidden');
    };

    const showError = (message) => {
      error.textContent = message;
      error.classList.remove('hidden');
    };

    this.container.querySelectorAll('input[name="dcMode"]').forEach((input) => {
      input.addEventListener('change', updateMode);
    });

    go.onclick = () => {
      const mode = getMode();
      const amount = Number(price.value);
      const percentage = Number(pct.value);

      if (!Number.isFinite(amount) || amount < 0) {
        showError('Please enter a valid amount of 0 or more.');
        return;
      }
      if (!Number.isFinite(percentage) || percentage < 0) {
        showError('Please enter a valid percentage of 0 or more.');
        return;
      }
      if (mode === 'discount' && percentage > 100) {
        showError('A discount cannot be greater than 100%.');
        return;
      }

      const change = amount * percentage / 100;
      const result = mode === 'discount' ? amount - change : amount + change;

      q('#dcMain').textContent = result.toFixed(2);
      q('#dcSub').textContent = change.toFixed(2);
      q('#dcMainLabel').textContent = mode === 'discount' ? 'Final Price' : 'Selling Price';
      q('#dcSubLabel').textContent = mode === 'discount' ? 'You Save' : 'Markup Amount';
      q('#dcOut').classList.remove('hidden');
      error.classList.add('hidden');
    };

    clear.onclick = () => {
      price.value = '';
      pct.value = '';
      q('#dcOut').classList.add('hidden');
      error.classList.add('hidden');
    };

    updateMode();
  }
}
