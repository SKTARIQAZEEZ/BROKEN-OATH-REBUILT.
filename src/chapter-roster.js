const ROSTERS=[
 {ranvir:[4,0,-4],ananya:[-4,0,-4],anjali:[-3,0,-8]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4]},
 {ranvir:[4,0,-4]},
 {ranvir:[0,0,-20],devraj:[3,0,-24]},
 {ranvir:[0,0,-12],devraj:[12,0,-20]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4],anjali:[-2,0,-8]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4]},
 {ranvir:[4,0,-4],devraj:[10,0,-24]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4],anjali:[-3,0,-8]},
 {ranvir:[0,0,-22],anjali:[-4,0,-16],ananya:[4,0,-16],devraj:[0,0,-26]},
 {ranvir:[4,0,-4],ananya:[-4,0,-4],anjali:[-3,0,-8]}
];
export function chapterRoster(index){return ROSTERS[index]||ROSTERS[0]}
export function applyChapterRoster(index,actors){
 const roster=chapterRoster(index);
 for(const [name,actor] of Object.entries(actors)){
  const p=roster[name];actor.visible=!!p;
  if(p)actor.position.set(...p);
 }
 return roster;
}
