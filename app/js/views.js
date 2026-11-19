import { applyFilters, displayName, displayDesc } from './filters.js';
import { STAGES } from './data.js';
export function gradeLabel(g){ return g.charAt(0).toUpperCase() + g.slice(1); }
export function cardHtml(t, earned, spoilerOn){
  const name = displayName(t, spoilerOn, earned);
  const desc = displayDesc(t, spoilerOn, earned);
  const count = t.count ? ' · target ' + t.count.toLocaleString('en-GB') : '';
  const miss = t.missable ? '<span class="pill miss">Missable</span>' : '';
  return '<article class="card' + (earned ? ' earned' : '') + '" data-name="' + t.name.replace(/"/g,'&quot;') + '" tabindex="0">'
    + '<h3>' + (earned ? '✓ ' : '') + name + '</h3><p>' + desc + '</p>'
    + '<div class="meta"><span class="pill ' + t.grade + '">' + gradeLabel(t.grade) + '</span>'
    + '<span class="pill">' + t.kind + '</span>' + miss + '<span class="pill">' + t.roadmap + count + '</span></div></article>';
}
export function renderList(el, trophies, state){
  const list = applyFilters(trophies, state);
  el.innerHTML = list.length ? list.map(t => cardHtml(t, !!state.earnedSet[t.name], state.spoiler)).join('')
    : '<p>No trophies match these filters. Clear the search or change a filter.</p>';
}
export function renderDetail(pane, t, earned, spoilerOn){
  if(!t){ pane.innerHTML = '<h2>Guide</h2><p>Select a trophy to read its guide, steps and sources.</p>'; return; }
  const hidden = spoilerOn && t.hidden && !earned;
  const body = hidden
    ? '<p>Hidden story trophy — earn it to reveal.</p>'
    : '<p><strong>' + t.description + '</strong></p><p>' + t.guide + '</p>'
      + '<p class="src">Sources:<br>' + t.sources.map(s => '<a href="' + s.url + '">' + s.name + '</a>').join('') + '</p>';
  pane.innerHTML = '<h2>' + (hidden ? 'Hidden story trophy' : t.name) + '</h2>'
    + '<div class="meta"><span class="pill ' + t.grade + '">' + gradeLabel(t.grade) + '</span>'
    + '<span class="pill">' + t.kind + '</span>' + (t.missable ? '<span class="pill miss">Missable</span>' : '')
    + (t.count ? '<span class="pill">Target: ' + t.count.toLocaleString('en-GB') + '</span>' : '') + '</div>'
    + body
    + '<p><button class="action" id="toggle-earned">' + (earned ? 'Mark as not earned' : 'Mark as earned') + '</button></p>'
    + (t.missable ? '<p class="note">Missable: built from the official description — missability not yet verified in-game; the game launched today.</p>' : '');
}
export function renderRoadmap(el, trophies, state){
  el.innerHTML = STAGES.map(s => {
    const items = trophies.filter(t => t.roadmap === s.id);
    const done = items.filter(t => state.earnedSet[t.name]).length;
    return '<section class="stage"><h3>' + s.title + ' — ' + done + ' / ' + items.length + ' earned</h3><p>' + s.text + '</p>'
      + '<p>' + items.map(t => (state.earnedSet[t.name] ? '✓ ' : '○ ') + displayName(t, state.spoiler, !!state.earnedSet[t.name])).join(' · ') + '</p></section>';
  }).join('');
}
export function renderMissables(el, trophies, state){
  const items = trophies.filter(t => t.missable);
  el.innerHTML = '<p class="note">Built from the official descriptions — missability not yet verified in-game; the game launched today. Chapter-completion and grind/count trophies are not listed here.</p>'
    + items.map(t => cardHtml(t, !!state.earnedSet[t.name], state.spoiler)).join('');
}
export function nextUp(trophies, earnedSet){
  const order = ['missable','story','crime','activities','collectibles','cleanup'];
  const left = trophies.filter(t => !earnedSet[t.name]);
  left.sort((a,b) => {
    const am = a.missable ? 0 : 1, bm = b.missable ? 0 : 1;
    if(am !== bm) return am - bm;
    return order.indexOf(a.roadmap) - order.indexOf(b.roadmap);
  });
  return left.slice(0, 5);
}
export function renderPlanner(el, trophies, state){
  const picks = nextUp(trophies, state.earnedSet);
  el.innerHTML = '<p>Recommended next trophies, given what you have earned. Missable trophies come first, then the current roadmap stage.</p>'
    + (picks.length ? picks.map(t => cardHtml(t, false, state.spoiler)).join('') : '<p>All 55 trophies earned — Leonida Legend.</p>');
}
