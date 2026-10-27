// QantaraTools - Main browser UI script


const FAVORITES_KEY = 'qantaratools_favorites_v1';
const RECENT_KEY = 'qantaratools_recent_v1';
let requestModalReturnFocus = null;
document.addEventListener('click', event => {
    const card = event.target.closest?.('.tool-card');
    if (card) window.QTActiveToolCard = card;
}, true);

function readJsonStorage(key, fallback = []) {
    try {
        const value = JSON.parse(localStorage.getItem(key) || 'null');
        return Array.isArray(value) ? value : fallback;
    } catch (_) {
        return fallback;
    }
}

function getToolIdFromCard(card) {
    const onclick = card?.getAttribute('onclick') || '';
    const match = onclick.match(/loadTool\([^,]+,\s*[^,]+,\s*['"]([^'"]+)['"]\)/);
    return match ? match[1] : null;
}

function getToolTitleFromCard(card) {
    return card?.querySelector('.card-title')?.textContent?.trim() || 'Tool';
}

function isFavorite(toolId) {
    return readJsonStorage(FAVORITES_KEY).includes(toolId);
}

function updateFavoriteButton(button, toolId) {
    const active = isFavorite(toolId);
    button.setAttribute('aria-pressed', active ? 'true' : 'false');
    button.title = active ? 'Remove from favorites' : 'Add to favorites';
    button.setAttribute('aria-label', `${active ? 'Remove' : 'Add'} ${getToolTitleFromCard(button.closest('.tool-card'))} ${active ? 'from' : 'to'} favorites`);
    button.innerHTML = active
        ? '<i class="fa-solid fa-star"></i>'
        : '<i class="fa-regular fa-star"></i>';
}

function toggleFavorite(toolId, button) {
    if (!toolId) return;
    const favorites = readJsonStorage(FAVORITES_KEY);
    const index = favorites.indexOf(toolId);
    if (index >= 0) favorites.splice(index, 1);
    else favorites.unshift(toolId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites.slice(0, 50)));
    if (button) updateFavoriteButton(button, toolId);
    renderQuickToolLists();
}

function recordRecentTool(toolId, title) {
    if (!toolId) return;
    const recent = readJsonStorage(RECENT_KEY).filter(item => item.id !== toolId);
    recent.unshift({ id: toolId, title });
    localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 8)));
    renderQuickToolLists();
}

function clearRecentlyUsed() {
    const recent = readJsonStorage(RECENT_KEY);
    if (!recent.length) return;
    localStorage.removeItem(RECENT_KEY);
    renderQuickToolLists();
}

function openToolById(toolId) {
    const card = [...document.querySelectorAll('.tool-card')].find(c => getToolIdFromCard(c) === toolId);
    if (card) card.click();
}

function setupFavoriteButtons() {
    document.querySelectorAll('.tool-card').forEach(card => {
        const toolId = getToolIdFromCard(card);
        if (!toolId) return;
        const permalink = card.querySelector('a[data-tool-link]');
        if (permalink) {
            card.removeAttribute('role'); card.removeAttribute('tabindex'); card.removeAttribute('aria-label');
        } else {
            card.setAttribute('role', 'button');
            card.setAttribute('tabindex', '0');
            card.setAttribute('aria-label', `Open ${getToolTitleFromCard(card)}`);
        }
        if (!permalink && !card.dataset.keyboardOpenBound) {
            card.dataset.keyboardOpenBound = 'true';
            card.addEventListener('keydown', event => {
                if ((event.key === 'Enter' || event.key === ' ') && event.target === card) {
                    event.preventDefault(); card.click();
                }
            });
        }
        if (card.querySelector('.favorite-tool-btn')) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.setAttribute('aria-label', `Add ${getToolTitleFromCard(card)} to favorites`);
        button.className = 'favorite-tool-btn absolute top-3 right-3 w-9 h-9 rounded-xl bg-slate-950/70 border border-slate-700/70 text-slate-300 hover:text-amber-400 hover:border-amber-400/50 flex items-center justify-center z-10';
        button.addEventListener('click', event => {
            event.stopPropagation();
            toggleFavorite(toolId, button);
        });
        card.classList.add('relative');
        updateFavoriteButton(button, toolId);
        card.appendChild(button);
    });
}

function renderQuickToolLists() {
    const recentBox = document.getElementById('recent-tools-list');
    const favoritesBox = document.getElementById('favorite-tools-list');
    const normalize = items => items.map(item => {
        const id = typeof item === 'string' ? item : item?.id;
        const card = [...document.querySelectorAll('.tool-card')].find(c => getToolIdFromCard(c) === id);
        return card && id ? { id, title: getToolTitleFromCard(card) } : null;
    }).filter(Boolean);
    const makeItems = (items, emptyText) => {
        const fragment = document.createDocumentFragment();
        if (!items.length) { const empty = document.createElement('span'); empty.className = 'text-sm text-slate-500'; empty.textContent = emptyText; fragment.appendChild(empty); return fragment; }
        items.forEach(({ id, title }) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'text-left px-3 py-2 rounded-xl bg-slate-800/70 hover:bg-slate-700 text-sm text-slate-200 truncate'; button.textContent = title; button.addEventListener('click', () => openToolById(id)); fragment.appendChild(button); });
        return fragment;
    };
    if (recentBox) recentBox.replaceChildren(makeItems(normalize(readJsonStorage(RECENT_KEY)), 'Your recently used tools will appear here.'));
    if (favoritesBox) favoritesBox.replaceChildren(makeItems(normalize(readJsonStorage(FAVORITES_KEY)), 'Star a tool to keep it here.'));
}

function updateSearchCount() {
    const count = [...document.querySelectorAll('.tool-card')].filter(card => card.style.display !== 'none').length;
    const label = document.getElementById('tool-count-label');
    if (label) label.textContent = `${count} tool${count === 1 ? '' : 's'} shown`;
}


let activeCategoryFilter = 'all';

function prepareToolSections() {
    const root = document.getElementById('tools-grid-container');
    if (!root) return;
    const sectionMap = {};
    document.querySelectorAll('.category-section').forEach(section => {
        if (section.dataset.category) sectionMap[section.dataset.category] = section;
    });
    const gridMap = {};
    Object.entries(sectionMap).forEach(([key, section]) => {
        gridMap[key] = section.querySelector('.grid');
    });

    const categoryByText = [
        ['Core & Dev', 'dev'], ['Business & Finance', 'business'], ['PDF & Documents', 'pdf'],
        ['Security & Media', 'security'], ['Text & Unicode', 'text'], ['Fun & Creative', 'fun']
    ];
    document.querySelectorAll('.tool-card').forEach(card => {
        const onclick = card.getAttribute('onclick') || '';
        const match = categoryByText.find(([name]) => onclick.includes(`'${name}'`));
        if (!match) return;
        const grid = gridMap[match[1]];
        if (grid && !grid.contains(card)) grid.appendChild(card);
    });
}

function setCategoryFilter(category, button) {
    activeCategoryFilter = category;
    document.querySelectorAll('.category-filter').forEach(item => item.classList.toggle('active', item === button));
    filterTools();
    if (category !== 'all') {
        const section = document.querySelector(`.category-section[data-category="${category}"]`);
        if (section && !document.getElementById('tool-search-input')?.value.trim()) {
            setTimeout(() => section.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
        }
    }
}

function normalizeSearchText(value) {
    return String(value || '').toLocaleLowerCase().normalize('NFKC').trim();
}

function filterTools() {
    const input = document.getElementById('tool-search-input');
    const query = normalizeSearchText(input?.value);
    const cards = [...document.querySelectorAll('.tool-card')];
    const sections = [...document.querySelectorAll('.category-section')];

    cards.forEach(card => {
        const section = card.closest('.category-section');
        const searchable = normalizeSearchText([
            card.querySelector('.card-title')?.textContent,
            card.querySelector('.card-desc')?.textContent,
            card.getAttribute('onclick')
        ].join(' '));
        const categoryMatch = activeCategoryFilter === 'all' || section?.dataset.category === activeCategoryFilter;
        card.style.display = categoryMatch && (!query || searchable.includes(query)) ? '' : 'none';
    });

    sections.forEach(section => {
        section.style.display = [...section.querySelectorAll('.tool-card')]
            .some(card => card.style.display !== 'none') ? '' : 'none';
    });
    updateSearchCount();
}

function closeToolView() {
    if (typeof window.destroyActiveTool === 'function') window.destroyActiveTool();
    const grid = document.getElementById('tools-grid-container');
    const view = document.getElementById('tool-view-container');
    const box = document.getElementById('active-tool-box');

    if (grid) grid.classList.remove('hidden');
    if (view) view.classList.add('hidden');
    if (box) box.innerHTML = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openRequestModal() {
    const modal = document.getElementById('request-modal');
    if (!modal) return;
    requestModalReturnFocus = document.activeElement;
    modal.classList.remove('hidden');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('#req-tool-name')?.focus();
}

function closeRequestModal() {
    const modal = document.getElementById('request-modal');
    if (!modal) return;
    modal.classList.add('hidden');
    modal.setAttribute('aria-hidden', 'true');
    if (requestModalReturnFocus instanceof HTMLElement) requestModalReturnFocus.focus();
    requestModalReturnFocus = null;
}

function submitToolRequest() {
    const name = document.getElementById('req-tool-name');
    const desc = document.getElementById('req-tool-desc');
    const example = document.getElementById('req-tool-example');
    if (!name || !name.value.trim()) {
        alert('Please enter the tool name or idea.');
        return;
    }

    const request = {
        id: `REQ-${Date.now()}`,
        name: name.value.trim(),
        description: (desc?.value || '').trim(),
        example: (example?.value || '').trim(),
        status: 'New',
        createdAt: new Date().toISOString()
    };

    const key = 'qantaratools_tool_requests_v1';
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(request);
    localStorage.setItem(key, JSON.stringify(existing));

    alert('Thanks! Your request was saved on this device.');
    name.value = '';
    if (desc) desc.value = '';
    if (example) example.value = '';
    closeRequestModal();
}

function applyTheme(isDark) {
    if (window.QTTheme) { window.QTTheme.apply(isDark ? 'dark' : 'light'); return; }
    // Theme is a global UI state. Do not rebuild or replace component class lists here.
    // Keeping the DOM intact prevents Favorites, Recently Used, filters, and tool state
    // from being disturbed when the user switches themes.
    document.documentElement.classList.toggle('dark', isDark);
    localStorage.setItem('theme', isDark ? 'dark' : 'light');

    const icon = document.getElementById('theme-icon');
    if (icon) icon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';

    const themeButton = icon?.closest('button');
    if (themeButton) {
        themeButton.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeButton.title = isDark ? 'Switch to light mode' : 'Switch to dark mode';
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', isDark ? '#0f172a' : '#f1f5f9');
}

function toggleTheme() {
    const isDark = document.documentElement.classList.contains('dark');
    applyTheme(!isDark);
}

function setVisualIdentity(identity) {
    const allowed = ['electric', 'citrus', 'violet'];
    const selected = allowed.includes(identity) ? identity : 'electric';
    document.documentElement.dataset.identity = selected;
    localStorage.setItem('visual_identity', selected);
    document.querySelectorAll('[data-identity]').forEach(button => {
        const active = button.dataset.identity === selected;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
}

Object.assign(window, {
    filterTools,
    setCategoryFilter,
    closeToolView,
    openRequestModal,
    closeRequestModal,
    submitToolRequest,
    applyTheme,
    toggleTheme,
    setVisualIdentity,
    toggleFavorite,
    recordRecentTool,
    openToolById,
    renderQuickToolLists,
});

document.addEventListener('click', event => {
    const link = event.target.closest?.('a[data-tool-link]');
    if (link) {
        event.preventDefault();
        event.stopPropagation();
        const {toolId, toolTitle, toolCategory} = link.dataset;
        window.QTActiveToolCard = link.closest('.tool-card');
        history.pushState({tool: toolId}, '', link.href);
        window.router?.loadTool(toolCategory, toolTitle, toolId);
        return;
    }
    const card = event.target.closest?.('.tool-card');
    if (!card || event.target.closest('.favorite-tool-btn')) return;
    const direct = card.querySelector('a[data-tool-link]');
    if (direct) {
        window.QTActiveToolCard = card;
        history.pushState({tool: direct.dataset.toolId}, '', direct.href);
    }
}, true);

window.addEventListener('popstate', () => {
    const path = location.pathname.replace(/\/$/, '');
    if (!path || path === '/index.html') {
        if (typeof window.closeToolView === 'function') window.closeToolView({fromPopState: true});
        return;
    }
    const link = [...document.querySelectorAll('a[data-tool-link]')].find(item => new URL(item.href).pathname.replace(/\/$/, '') === path);
    if (link) {
        window.QTActiveToolCard = link.closest('.tool-card');
        window.router?.loadTool(link.dataset.toolCategory, link.dataset.toolTitle, link.dataset.toolId);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    prepareToolSections();
    applyTheme(localStorage.getItem('theme') !== 'light');
    setVisualIdentity(localStorage.getItem('visual_identity') || 'electric');
    setupFavoriteButtons();
    renderQuickToolLists();
    updateSearchCount();
    const input = document.getElementById('tool-search-input');
    if (input) input.addEventListener('input', filterTools);
});

document.addEventListener('keydown', event => {
    const modal = document.getElementById('request-modal');
    if (modal && !modal.classList.contains('hidden')) {
        if (event.key === 'Escape') { event.preventDefault(); closeRequestModal(); return; }
        if (event.key === 'Tab') {
            const items = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])')].filter(el => el.offsetParent !== null);
            if (!items.length) { event.preventDefault(); return; }
            const first = items[0], last = items[items.length - 1];
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
        }
    }
    if (event.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
        event.preventDefault();
        document.getElementById('tool-search-input')?.focus();
    }
});
