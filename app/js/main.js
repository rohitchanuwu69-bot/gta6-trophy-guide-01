import { loadTrophies } from './data.js';
import { loadState, saveState, loadSettings, saveSettings, exportState } from './store.js';
import { renderList, renderDetail, renderRoadmap, renderMissables, renderPlanner } from './views.js';
const $ = s => document.querySelector(s);
let trophies = [];
let earnedSet = loadState();
let settings = loadSettings();
let state = { q:'', kind:'all', grade:'all', earned:'all', earnedSet, spoiler: !!settings.spoiler };
let selected = null;
let view = 'checklist';
function counts(){
  const n = trophies.filter(t => earnedSet[t.name]).length;
  $('#earned-count').textContent = n + ' / ' + trophies.length;
  $('#pct').textContent = trophies.length ? Math.round(n / trophies.length * 100) + '%' : '0%';
  $('#bar-fill').style.width = (trophies.length ? n / trophies.length * 100 : 0) + '%';
}
function render(){
  counts();
  const listEl = $('#list'), pane = $('#pane');
  document.querySelectorAll('nav button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
  if(view === 'roadmap'){ renderRoadmap(listEl, trophies, state); renderDetail(pane, selected, !!earnedSet[selected && selected.name], state.spoiler); }
  else if(view === 'missables'){ renderMissables(listEl, trophies, state); renderDetail(pane, selected, !!earnedSet[selected && selected.name], state.spoiler); }
  else if(view === 'planner'){ renderPlanner(listEl, trophies, state); renderDetail(pane, selected, !!earnedSet[selected && selected.name], state.spoiler); }
  else if(view === 'settings'){
    listEl.innerHTML = '<section class="stage"><h3>Settings and save</h3><p>Progress is saved in this browser only (localStorage). Export a backup file, or import one to restore it.</p>'
      + '<p><button class="action" id="export-btn">Export progress</button> <button class="ghost" id="import-btn">Import progress</button> <input type="file" id="import-file" accept="application/json" hidden></p>'
      + '<p><button class="ghost" id="reset-btn">Reset all progress</button></p>'
      + '<p><label><input type="checkbox" id="spoiler-settings"> Hide story trophies until earned (spoiler protection)</label></p></section>';
    const cb = $('#spoiler-settings'); cb.checked = state.spoiler;
    cb.addEventListener('change', () => { state.spoiler = cb.checked; settings.spoiler = cb.checked; saveSettings(settings); $('#spoiler-toggle').checked = cb.checked; render(); });
    $('#export-btn').addEventListener('click', () => exportState(earnedSet));
    $('#import-btn').addEventListener('click', () => $('#import-file').click());
    $('#import-file').addEventListener('change', e => {
      const f = e.target.files[0]; if(!f) return;
      const r = new FileReader();
      r.onload = () => { try { earnedSet = JSON.parse(r.result); state.earnedSet = earnedSet; saveState(earnedSet); render(); } catch(err){ alert('That file could not be imported.'); } };
      r.readAsText(f);
    });
    $('#reset-btn').addEventListener('click', () => { if(confirm('Reset all earned trophies?')){ earnedSet = {}; state.earnedSet = earnedSet; saveState(earnedSet); render(); } });
    renderDetail(pane, selected, !!earnedSet[selected && selected.name], state.spoiler);
  }
  else { renderList(listEl, trophies, state); renderDetail(pane, selected, !!earnedSet[selected && selected.name], state.spoiler); }
  const tog = $('#toggle-earned');
  if(tog && selected){ tog.addEventListener('click', () => {
    if(earnedSet[selected.name]) delete earnedSet[selected.name]; else earnedSet[selected.name] = true;
    saveState(earnedSet); render();
  }); }
}
async function boot(){
  try { trophies = await loadTrophies(); }
  catch(e){ $('#list').innerHTML = '<p>Could not load the trophy data. Open this page from the app folder so data/trophies.json can load.</p>'; return; }
  document.querySelectorAll('nav button').forEach(b => b.addEventListener('click', () => { view = b.dataset.view; render(); }));
  $('#search').addEventListener('input', e => { state.q = e.target.value; view = 'checklist'; render(); });
  $('#kind').addEventListener('change', e => { state.kind = e.target.value; view = 'checklist'; render(); });
  $('#grade').addEventListener('change', e => { state.grade = e.target.value; view = 'checklist'; render(); });
  $('#earned-filter').addEventListener('change', e => { state.earned = e.target.value; view = 'checklist'; render(); });
  $('#spoiler-toggle').checked = state.spoiler;
  $('#spoiler-toggle').addEventListener('change', e => { state.spoiler = e.target.checked; settings.spoiler = e.target.checked; saveSettings(settings); render(); });
  $('#export-top').addEventListener('click', () => exportState(earnedSet));
  $('#import-top').addEventListener('click', () => { view = 'settings'; render(); });
  $('#list').addEventListener('click', e => {
    const card = e.target.closest('.card'); if(!card) return;
    selected = trophies.find(t => t.name === card.dataset.name) || null; render();
  });
  render();
}
boot();
