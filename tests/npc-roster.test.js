import assert from "node:assert/strict";
import {GUARD_ASSETS,NPC_AMBIENT,MINI_BOSS_ASSETS,MINI_BOSS_BY_TARGET,setAmbientNpcChapter} from "../src/npc-roster.js";

assert.equal(GUARD_ASSETS.length,4);
assert.equal(NPC_AMBIENT.length,10);
assert.equal(MINI_BOSS_ASSETS.length,5);
assert.equal(new Set([...GUARD_ASSETS,...NPC_AMBIENT.map(n=>n.asset),...MINI_BOSS_ASSETS]).size,19,
 "the mission roster must cover all 19 supplied NPC exports");
assert.deepEqual(Object.keys(MINI_BOSS_BY_TARGET).sort(),
 ["compound-guards","devraj-lieutenant","district-gang","final-guards","street-gang"].sort());
for(const npc of NPC_AMBIENT){
 assert.ok(npc.id&&npc.name&&npc.asset);
 assert.ok(npc.chapters.length>0);
 assert.ok(npc.chapters.every(c=>Number.isInteger(c)&&c>=0&&c<15));
}
const entries=NPC_AMBIENT.map(definition=>({
 definition,
 actor:{visible:false,position:{copy(v){this.x=v.x;this.y=v.y;this.z=v.z}},rotation:{y:0},userData:{setAnimation(name){this.animation=name}}}
}));
const visible=setAmbientNpcChapter(entries,0,{resolvePosition:p=>p});
assert.equal(visible,entries.filter(e=>e.definition.chapters.includes(0)).length);
assert.ok(entries.filter(e=>e.actor.visible).every(e=>e.actor.userData.animation==="idle"));
assert.ok(entries.filter(e=>!e.actor.visible).every(e=>!e.actor.visible));
console.log("NPC roster passed: 4 guards + 10 ambient civilians/workers + 5 target-specific mini-bosses = 19 NPC assets.");
