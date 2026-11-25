import assert from "node:assert/strict";
import {StealthSystem} from "../src/stealth.js";
const stealth=new StealthSystem({visionRange:12,hearingRange:6,searchDuration:2,alarmThreshold:1});
const guard={position:{clone(){return {x:0,y:0,z:0,length(){return 0}}}},quaternion:{}};
const player={position:{clone(){return {x:0,y:0,z:0,length(){return 0}}}}};
// Lightweight vector-compatible fixtures for the system's geometric operations.
function vec(x,y,z){return {x,y,z,clone(){return vec(x,y,z)},sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this},length(){return Math.hypot(this.x,this.y,this.z)},normalize(){const n=this.length()||1;this.x/=n;this.y/=n;this.z/=n;return this},angleTo(){return 0}}}
const g={position:vec(0,0,0),quaternion:{}},p={position:vec(0,0,2)};
const result=stealth.evaluate(g,p,{dt:1});
assert.equal(result.state,"combat");
assert.equal(result.alarmActive,true);
const lost=stealth.evaluate(g,p,{obstacleTest:()=>true,dt:.1});
assert.equal(lost.state,"search");
assert.ok(lost.lastKnown);
stealth.evaluate(g,p,{obstacleTest:()=>true,dt:2.1});
assert.equal(stealth.getState(g),"patrol");
assert.equal(stealth.getLastKnownPosition(g),null);
const heard=stealth.evaluate(g,p,{moving:true,obstacleTest:()=>true});
assert.equal(heard.state,"investigate");
stealth.resetGuard(g);
assert.equal(stealth.getState(g),"patrol");
console.log("Stealth state transition tests passed.");
