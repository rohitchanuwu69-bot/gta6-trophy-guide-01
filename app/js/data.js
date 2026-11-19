export async function loadTrophies(){
  const r = await fetch('data/trophies.json');
  if(!r.ok) throw new Error('Could not load trophies.json');
  const d = await r.json();
  return d.trophies || [];
}
export const STAGES = [
  {id:'story', title:'Stage 1 — Story playthrough', text:'Chapters 1–4 and the final mission, plus the named story missions: Breakfast Run, The Cartel Heist, Child\u2019s Play, Headliners, VCIA Takedown and Operation Savage Glory. Finish the 8 stranger strands and the final missions for Andy, Kenton, Billy, Randy and Tyrone.'},
  {id:'activities', title:'Stage 2 — Activities', text:'42 Shooting Range golds, 250 stunts, 14 Top Fun drone-race locations, 20 different races, fishing against Cal, an arcade game and 18 meditation spots.'},
  {id:'collectibles', title:'Stage 3 — Collectibles', text:'3 Collectible Card sets, 100 WAiNK It locations, 100 vehicles, 52 Leonida areas, 8 garage properties and 10 Scooter Bros vehicles.'},
  {id:'crime', title:'Stage 4 — Crime and optional', text:'5 bank vaults, 9 gangs\u2019 illegal operations, $250,000 of marked bills laundered, $100,000 spent in shops and 50 challenges.'},
  {id:'cleanup', title:'Stage 5 — Cleanup and platinum', text:'Finish whatever is left, reach 100% completion, and the platinum unlocks.'}
];
