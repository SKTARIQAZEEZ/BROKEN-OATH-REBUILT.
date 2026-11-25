import assert from "node:assert/strict";
import {StealthSystem} from "../src/stealth.js";
class Vec {
 constructor(x=0,y=0,z=0){this.x=x;this.y=y;this.z=z}
 clone(){return new Vec(this.x,this.y,this.z)}
 sub(v){this.x-=v.x;this.y-=v.y;this.z-=v.z;return this}
 length(){return Math.hypot(this.x,this.y,this.z)}
 normalize(){const n=this.length()||1;this.x/=n;this.y/=n;this.z/=n;return this}
 applyQuaternion(){return this}
 angleTo(v){const a=this.clone().normalize(),b=v.clone().normalize();return Math.acos(Math.max(-1,Math.min(1,a.x*b.x+a.y*b.y+a.z*b.z)))}
}
const stealth=new StealthSystem({visionRange:12,hearingRange:6,searchDuration:2,alarmThreshold:1});
const guard={position:new Vec(0,0,0),quaternion:{}},player={position:new Vec(0,0,2)};
const result=stealth.evaluate(guard,player,{dt:1});
assert.equal(result.state,"combat");assert.equal(result.alarmActive,true);
const lost=stealth.evaluate(guard,player,{obstacleTest:()=>true,dt:.1});
assert.equal(lost.state,"search");assert.ok(lost.lastKnown);
stealth.evaluate(guard,player,{obstacleTest:()=>true,dt:2.1});
assert.equal(stealth.getState(guard),"patrol");assert.equal(stealth.getLastKnownPosition(guard),null);
const heard=stealth.evaluate(guard,player,{moving:true,obstacleTest:()=>true});
assert.equal(heard.state,"investigate");
stealth.resetGuard(guard);assert.equal(stealth.getState(guard),"patrol");
console.log("Stealth state transition tests passed.");
