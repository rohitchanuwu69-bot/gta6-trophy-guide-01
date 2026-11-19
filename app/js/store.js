export const KEY = 'gta6-trophy-guide-v1';
export function loadState(){
  try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch(e){ return {}; }
}
export function saveState(s){ localStorage.setItem(KEY, JSON.stringify(s)); }
export function loadSettings(){
  try { return JSON.parse(localStorage.getItem(KEY + '-settings') || '{}'); } catch(e){ return {}; }
}
export function saveSettings(s){ localStorage.setItem(KEY + '-settings', JSON.stringify(s)); }
export function exportState(state){
  const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob); a.download = 'gta6-trophy-progress.json'; a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href), 1000);
}
