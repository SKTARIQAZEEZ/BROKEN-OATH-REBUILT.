import assert from "node:assert/strict";
import {WeaponSystem,WEAPONS} from "../src/weapon-system.js";
const w=new WeaponSystem();assert.equal(w.equip("baton"),true);assert.equal(w.equip("unknown"),false);
assert.equal(w.current,"baton");w.beginCounter();assert.deepEqual(w.counterIncoming(10),{countered:true,damage:0,stagger:true});
const target={visible:true,userData:{staggered:true,hp:2}};assert.equal(w.canFinish(target),true);assert.equal(w.finish(target),true);assert.equal(target.userData.dead,true);
assert.equal(Object.keys(WEAPONS).length,4);console.log("Weapon and counter tests passed.");
