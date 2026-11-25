/**
 * Small deterministic squad coordinator for guard encounters.
 * Assigns distinct roles around a shared last-known player position.
 */
export class SquadTactics {
  constructor({flankDistance=4,holdDistance=7,searchSpread=3}={}) {
    this.flankDistance=flankDistance;this.holdDistance=holdDistance;this.searchSpread=searchSpread;
    this.squads=new Map();
  }
  update(squadId,guards,{playerPosition=null,alert=false,dt=0}={}) {
    if(!squadId)throw new TypeError("Squad id is required");
    const squad=this.squads.get(squadId)||{mode:"patrol",elapsed:0,lastKnown:null};
    squad.elapsed+=Math.max(0,dt);
    if(playerPosition){squad.lastKnown={x:playerPosition.x,y:playerPosition.y,z:playerPosition.z}}
    squad.mode=alert?"engage":squad.lastKnown?"search":"patrol";
    const active=guards.filter(g=>g&&g.position);
    const assignments=active.map((guard,index)=>{
      let role="hold",offset={x:0,z:0};
      if(squad.mode==="engage"){
        if(index===0){role="suppress";offset={x:0,z:this.holdDistance}}
        else if(index%2===1){role="flank-left";offset={x:-this.flankDistance,z:0}}
        else {role="flank-right";offset={x:this.flankDistance,z:0}}
      } else if(squad.mode==="search"){
        role="search";
        const angle=(Math.PI*2*index)/Math.max(active.length,1);
        offset={x:Math.cos(angle)*this.searchSpread,z:Math.sin(angle)*this.searchSpread};
      } else {role="patrol"}
      const target=squad.lastKnown?{x:squad.lastKnown.x+offset.x,y:squad.lastKnown.y,z:squad.lastKnown.z+offset.z}:null;
      return {guard,role,target};
    });
    this.squads.set(squadId,squad);
    return {mode:squad.mode,assignments,lastKnown:squad.lastKnown};
  }
  forget(squadId){this.squads.delete(squadId)}
  reset(){this.squads.clear()}
}
