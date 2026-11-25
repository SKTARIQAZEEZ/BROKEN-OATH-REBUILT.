/** Multi-phase boss controller with explicit phase transitions and telegraphed attacks. */
export class BossEncounter {
 constructor({phases=[{name:"opening",health:100,damage:8,telegraph:1.1,cooldown:2},{name:"enraged",health:45,damage:14,telegraph:.7,cooldown:1.4},{name:"desperate",health:20,damage:18,telegraph:.5,cooldown:1.1}],onPhase=()=>{},onDefeat=()=>{}}={}) {
  if(!phases.length||phases.some(p=>!(p.health>0)))throw new TypeError("Boss phases require positive health thresholds");
  this.phases=phases.map(p=>({...p}));this.onPhase=onPhase;this.onDefeat=onDefeat;this.maxHealth=phases[0].health;this.health=this.maxHealth;this.phaseIndex=0;this.cooldown=0;this.telegraph=0;this.defeated=false;this.attackReady=false;
 }
 get phase(){return this.phases[this.phaseIndex]}
 receiveDamage(amount){if(this.defeated||!(amount>0))return {applied:0,defeated:this.defeated};const before=this.phaseIndex;this.health=Math.max(0,this.health-amount);while(this.phaseIndex<this.phases.length-1&&this.health<=this.phases[this.phaseIndex+1].health)this.phaseIndex++;if(before!==this.phaseIndex)this.onPhase(this.phase,this.phaseIndex);if(this.health===0){this.defeated=true;this.onDefeat()}return {applied:amount,health:this.health,phase:this.phase,defeated:this.defeated}}
 update(dt){if(this.defeated)return {state:"defeated"};this.cooldown=Math.max(0,this.cooldown-dt);if(this.telegraph>0){this.telegraph=Math.max(0,this.telegraph-dt);if(this.telegraph===0){this.attackReady=true;this.cooldown=this.phase.cooldown;return {state:"attack",damage:this.phase.damage,phase:this.phase.name}}return {state:"telegraph",remaining:this.telegraph,phase:this.phase.name}}if(this.cooldown===0&&this.phase){this.telegraph=this.phase.telegraph;this.attackReady=false;return {state:"telegraph",remaining:this.telegraph,phase:this.phase.name}}return {state:"recover",phase:this.phase.name}}
 consumeAttack(){if(!this.attackReady)return null;this.attackReady=false;return this.phase.damage}
 reset(){this.health=this.maxHealth;this.phaseIndex=0;this.cooldown=0;this.telegraph=0;this.defeated=false;this.attackReady=false}
}
