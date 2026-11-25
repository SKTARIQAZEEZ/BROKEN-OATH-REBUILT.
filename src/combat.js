export class CombatSystem {
  constructor({range=3.0,cooldown=.48,damage=1}={}) {
    this.range=range; this.cooldown=cooldown; this.damage=damage; this.timer=0;
  }
  update(dt){this.timer=Math.max(0,this.timer-dt)}
  attack(actor,targets,onHit=()=>{}) {
    if(this.timer>0)return {hit:false,reason:"cooldown"};
    this.timer=this.cooldown;
    let target=null,nearest=this.range;
    for(const candidate of targets){
      if(!candidate.visible || candidate.userData?.dead)continue;
      const d=actor.position.distanceTo(candidate.position);
      if(d<nearest){nearest=d;target=candidate}
    }
    if(!target)return {hit:false,reason:"out-of-range"};
    target.userData.hp=(target.userData.hp??3)-this.damage;
    if(target.userData.hp<=0){target.userData.dead=true;target.visible=false}
    onHit(target,{damage:this.damage,defeated:!!target.userData.dead});
    return {hit:true,target,defeated:!!target.userData.dead};
  }
}
