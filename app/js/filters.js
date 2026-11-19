export function applyFilters(trophies, state){
  const q = (state.q || '').toLowerCase();
  return trophies.filter(t => {
    if(state.kind && state.kind !== 'all' && (state.kind === 'missable' ? !t.missable : t.kind !== state.kind)) return false;
    if(state.grade && state.grade !== 'all' && t.grade !== state.grade) return false;
    if(state.earned === 'earned' && !state.earnedSet[t.name]) return false;
    if(state.earned === 'unearned' && state.earnedSet[t.name]) return false;
    if(q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
    return true;
  });
}
export function displayName(t, spoilerOn, earned){
  if(spoilerOn && t.hidden && !earned) return 'Hidden story trophy';
  return t.name;
}
export function displayDesc(t, spoilerOn, earned){
  if(spoilerOn && t.hidden && !earned) return 'Hidden story trophy — earn it to reveal.';
  return t.description;
}
