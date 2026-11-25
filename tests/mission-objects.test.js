import assert from "node:assert/strict";
import * as THREE from "three";
import {createMissionObject} from "../src/mission-objects.js";
const scene=new THREE.Scene();
for(const type of ["collect","evidence","interact","rescue","defeat","reach"]){
 const prop=createMissionObject(scene,{id:"test-"+type,type,target:"test"},new THREE.Vector3(3,.1,4));
 assert.equal(prop.group.name,"MISSION_OBJECT_test-"+type);
 assert.equal(prop.position.x,3);
 assert.ok(prop.group.children.length>0,"objective should have visible geometry");
 prop.dispose();
 assert.equal(scene.children.length,0,"disposed objective should be removed from scene");
}
console.log("Mission object tests passed: physical props spawn, carry identity and dispose cleanly.");
