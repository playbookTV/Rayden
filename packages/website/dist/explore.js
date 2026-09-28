const $ = (selector) => document.querySelector(selector);
const status = $('#showcase-status');
const catalog = $('[data-catalog]');
if (catalog) {
  const cards = [...document.querySelectorAll('.library-card')];
  let type = 'blocks'; let category = 'All examples';
  const search = $('#library-search');
  function readURL() {
    const params = new URLSearchParams(location.search);
    type = params.get('type') === 'components' ? 'components' : 'blocks';
    category = params.get('category') || 'All examples';
    if (![...document.querySelectorAll('[data-category-filter]')].some(b => b.dataset.categoryFilter === category)) category = 'All examples';
    search.value = params.get('q') || '';
  }
  function render(updateURL = false) {
    const query = search.value.toLocaleLowerCase().trim();
    let count = 0;
    for (const card of cards) {
      const visible = card.dataset.type === type && (category === 'All examples' || card.dataset.category === category) && card.dataset.search.includes(query);
      card.hidden = !visible; if (visible) count++;
    }
    document.querySelectorAll('[data-type-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.typeFilter === type)));
    document.querySelectorAll('[data-category-filter]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.categoryFilter === category)));
    document.querySelectorAll('[data-category-count]').forEach(el => { el.textContent = cards.filter(c => c.dataset.type === type && (el.dataset.categoryCount === 'All examples' || c.dataset.category === el.dataset.categoryCount)).length; });
    $('#mobile-category').value = category;
    $('#library-results').textContent = `${count} ${type === 'blocks' ? (count === 1 ? 'block' : 'blocks') : (count === 1 ? 'component' : 'components')}${query ? ` matching “${search.value.trim()}”` : ' to make your own'}`;
    $('#library-empty').hidden = count > 0;
    if (updateURL) {
      const params = new URLSearchParams({ type });
      if (category !== 'All examples') params.set('category', category);
      if (search.value.trim()) params.set('q', search.value.trim());
      history.replaceState(null, '', `/explore?${params}`);
    }
    try { sessionStorage.setItem('rayden-explore-return', location.pathname + location.search); } catch {}
  }
  readURL(); render();
  const saveScroll = () => { try { sessionStorage.setItem('rayden-explore-scroll', JSON.stringify({url: location.pathname + location.search, y: scrollY})); } catch {} };
  cards.forEach(card => card.addEventListener('click', saveScroll));
  addEventListener('pagehide', saveScroll);
  try {
    const saved = JSON.parse(sessionStorage.getItem('rayden-explore-scroll') || 'null');
    const referrer = document.referrer && new URL(document.referrer);
    if (saved?.url === location.pathname + location.search && referrer?.origin === location.origin && /^\/(blocks|components)\//.test(referrer.pathname)) requestAnimationFrame(() => scrollTo(0, saved.y));
  } catch {}

  search.addEventListener('input', () => render(true));
  document.querySelectorAll('[data-type-filter]').forEach(b => b.addEventListener('click', () => { type = b.dataset.typeFilter; category = 'All examples'; render(true); }));
  document.querySelectorAll('[data-category-filter]').forEach(b => b.addEventListener('click', () => { category = b.dataset.categoryFilter; render(true); }));
  $('#mobile-category').addEventListener('change', e => { category = e.target.value; render(true); });
  $('#clear-filters').addEventListener('click', () => { search.value = ''; category = 'All examples'; render(true); search.focus(); });
  addEventListener('popstate', () => { readURL(); render(); });
}
const detail = $('[data-detail]');
if (detail) {
  const iframe = $('#live-preview');
  let timer;
  function load() {
    clearTimeout(timer);
    $('#preview-loading').hidden = false; $('#preview-failure').hidden = true;
    const query = new URLSearchParams({ example: iframe.dataset.example, theme: $('#preview-theme').value, state: $('#preview-state')?.value || 'default' });
    iframe.src = `/explore-assets/preview?${query}`;
    timer = setTimeout(() => { $('#preview-loading').hidden = true; $('#preview-failure').hidden = false; }, 20000);
  }
  addEventListener('message', event => {
    if (event.origin !== location.origin || event.source !== iframe.contentWindow || event.data?.source !== 'rayden-preview') return;
    if (event.data.type === 'ready' || event.data.type === 'error') { clearTimeout(timer); $('#preview-loading').hidden = true; $('#preview-failure').hidden = event.data.type !== 'error'; }
  });
  $('#code-panel').hidden = true;
  document.querySelectorAll('[data-view]').forEach(button => button.addEventListener('click', () => {
    const isCode = button.dataset.view === 'code';
    $('#code-panel').hidden = !isCode; $('#preview-panel').hidden = isCode; $('#preview-options').hidden = isCode;
    document.querySelectorAll('[data-view]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  }));
  $('#preview-reset').addEventListener('click', () => { if ($('#preview-state')) $('#preview-state').value = 'default'; load(); status.textContent = 'Preview reset to its initial example.'; });
  $('#preview-theme').addEventListener('change', load);
  $('#preview-state')?.addEventListener('change', load);
  $('#preview-viewport').addEventListener('change', event => { $('#preview-frame-wrap').dataset.viewport = event.target.value; });
  try { const back = sessionStorage.getItem('rayden-explore-return'); if (back && /^\/explore(?:\?|$)/.test(back)) $('[data-back]').href = back; } catch {}
  load();
}
document.querySelectorAll('[data-copy-target]').forEach(button => button.addEventListener('click', async () => {
  const element = document.getElementById(button.dataset.copyTarget);
  const value = (button.dataset.aiPrompt ? button.dataset.aiPrompt + '\n\nExample:\n' : '') + element.textContent;
  const original = button.textContent;
  try { await navigator.clipboard.writeText(value); button.textContent = 'Copied ✓'; status.textContent = button.dataset.aiPrompt ? 'Example and AI prompt copied.' : 'Code copied.'; }
  catch { if (element.id === 'example-code') document.querySelector('[data-view="code"]')?.click(); const range = document.createRange(); range.selectNodeContents(element); const selection = getSelection(); selection.removeAllRanges(); selection.addRange(range); status.textContent = 'Copy unavailable. Example code selected; use your device’s copy command.'; }
  setTimeout(() => { button.textContent = original; }, 1800);
}));
