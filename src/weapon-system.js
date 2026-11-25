/** Weapon profiles and combat actions layered over the base melee controller. */
export const WEAPONS={
 unarmed:{range:2.8,damage:1,stamina:5,speed:1,kind:"melee"},
 baton:{range:3.4,damage:2,stamina:8,speed:.86,kind:"melee"},
 knife:{range:2.5,damage:3,stamina:10,speed:1.15,kind:"melee"},
 heavy:{range:3.8,damage:3,stamina:14,speed:.68,kind:"heavy"}
};
export class WeaponSystem {
 constructor({initial="unarmed"}={}){this.current=initial;this.cooldown=0;this.counterWindow=0;this.finisherWindow=0;this.lastAttackAt=-Infinity}
 equip(name){if(!WEAPONS[name])return false;this.current=name;return true}
 update(dt){this.cooldown=Math.max(0,this.cooldown-dt);this.counterWindow=Math.max(0,this.counterWindow-dt);this.finisherWindow=Math.max(0,this.finisherWindow-dt)}
 attack(combat,actor,targets,onHit){if(this.cooldown>0)return{hit:false,reason:"cooldown"};const w=WEAPONS[this.current];const oldRange=combat.range,oldDamage=combat.damage;combat.range=w.range;combat.damage=w.damage;const result=combat.attack(actor,targets,onHit);combat.range=oldRange;combat.damage=oldDamage;if(result.hit){this.cooldown=combat.cooldown/w.speed;this.lastAttackAt=0;this.finisherWindow=result.defeated?1.2:0}return result}
 beginCounter(){this.counterWindow=.32;return true}
 counterIncoming(amount){if(this.counterWindow<=0)return{countered:false,damage:amount};this.counterWindow=0;this.finisherWindow=1.5;return{countered:true,damage:0,stagger:true}}
 canFinish(target){return !!target&&target.userData?.staggered===true&&this.finisherWindow>0}
 finish(target){if(!this.canFinish(target))return false;target.userData.hp=0;target.userData.dead=true;target.visible=false;this.finisherWindow=0;return true}
}
