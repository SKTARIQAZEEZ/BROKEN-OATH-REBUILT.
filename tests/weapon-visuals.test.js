import assert from "node:assert/strict";
import * as THREE from "three";
import {createWeaponVisuals} from "../src/weapon-visuals.js";
const actor=new THREE.Group(),visuals=createWeaponVisuals(actor);
assert.equal(actor.children.length,1);
for(const name of ["unarmed","baton","knife","heavy"]){
 assert.equal(visuals.equip(name),true);
 const visible=visuals.mount.children.filter(o=>o.visible);
 assert.equal(visible.length,1,name+" should show exactly one weapon");
 assert.equal(visible[0].name,"weapon-"+name);
 if(name!=="unarmed"){assert.equal(visuals.swing(),true);visuals.update(.17);assert.notEqual(visuals.mount.rotation.x,0);visuals.update(.2);assert.equal(visuals.mount.rotation.x,0)}
}
assert.equal(visuals.equip("invalid"),false);
visuals.dispose();assert.equal(actor.children.length,0);
console.log("Weapon visual tests passed: all equipment meshes switch and dispose cleanly.");
