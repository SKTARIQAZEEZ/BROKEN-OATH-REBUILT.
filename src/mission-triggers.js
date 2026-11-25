export class MissionTriggerSystem {
 constructor({onFailure=()=>{},onTrigger=()=>{}}={}){this.onFailure=onFailure;this.onTrigger=onTrigger;this.triggers=new Map();this.failed=false;this.elapsed=0;this.damageTaken=0}
 register(id,config){if(!id||this.triggers.has(id))throw new Error("Trigger id must be unique");this.triggers.set(id,{id,active:true,once:true,...config});return this}
 reset(){this.failed=false;this.elapsed=0;this.damageTaken=0;for(const t of this.triggers.values())t.active=true}
 update(dt,context={}){if(this.failed)return[];this.elapsed+=dt;const fired=[];for(const t of this.triggers.values()){if(!t.active)continue;if(t.deadline&&this.elapsed>t.deadline)return this.fail("TIME_LIMIT",t.id);if(t.maxDamage!==undefined&&this.damageTaken>t.maxDamage)return this.fail("DAMAGE_LIMIT",t.id);if(t.condition?.(context)){fired.push(t.id);this.onTrigger(t.id,context);if(t.once)t.active=false}}return fired}
 recordDamage(amount){this.damageTaken+=Math.max(0,amount)}
 fail(reason,triggerId=null){this.failed=true;this.onFailure({reason,triggerId,elapsed:this.elapsed,damageTaken:this.damageTaken});return false}
 isFailed(){return this.failed}
}
