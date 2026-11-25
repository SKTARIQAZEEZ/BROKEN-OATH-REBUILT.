const ENCOUNTER_RULES=[
 [/guards|gang|compound|district|street/i,4],
 [/lieutenant/i,2],
 [/devraj/i,1]
];
export function encounterSize(target=""){
 const rule=ENCOUNTER_RULES.find(([pattern])=>pattern.test(target));
 return rule?rule[1]:3;
}
export function encounterPositions(center,count,radius=3.2){
 return Array.from({length:count},(_,i)=>{
  const angle=(Math.PI*2*i/count)+(Math.PI/4);
  return {x:center.x+Math.cos(angle)*radius,z:center.z+Math.sin(angle)*radius};
 });
}
export function encounterComplete(actors){
 return actors.length>0&&actors.every(actor=>actor.userData?.dead===true);
}
