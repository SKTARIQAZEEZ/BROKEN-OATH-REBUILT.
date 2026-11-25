import assert from "node:assert/strict";
import {MissionManager} from "../src/mission-manager.js";
const campaign=[{id:"a",objectives:[
 {type:"reach",target:"gate"},{type:"collect",target:"key"},{type:"interact",target:"npc"},
 {type:"defeat",target:"guard"},{type:"stealth",target:"warehouse"},{type:"survive",target:"ambush",duration:5},
 {type:"rescue",target:"captive"},{type:"evidence",target:"record"}
]},{id:"b",objectives:[{type:"defeat",target:"boss"}]}];
const m=new MissionManager(campaign);
assert.equal(m.completeObjective({zone:"wrong"}),false);
assert.equal(m.completeObjective({zone:"gate"}),true);
m.setCheckpoint({spawn:"safe"});
assert.equal(m.completeObjective({item:"wrong"}),false);
assert.equal(m.completeObjective({item:"key"}),true);
assert.equal(m.completeObjective({target:"wrong"}),false);
assert.equal(m.completeObjective({target:"npc"}),true);
assert.equal(m.completeObjective({target:"wrong"}),false);
assert.equal(m.completeObjective({target:"guard"}),true);
assert.equal(m.completeObjective({alerted:true}),false);
assert.equal(m.completeObjective({alerted:false}),true);
assert.equal(m.completeObjective({elapsed:4}),false);
assert.equal(m.completeObjective({elapsed:5}),true);
assert.equal(m.completeObjective({target:"wrong"}),false);
assert.equal(m.completeObjective({target:"captive"}),true);
assert.equal(m.completeObjective({target:"record"}),false);
m.collectEvidence("record");
assert.equal(m.completeObjective({}),true);
const saved=m.snapshot(),restored=new MissionManager(campaign);
assert.equal(restored.restore(saved),true);
assert.equal(restored.evidence[0],"record");
assert.equal(restored.completeObjective({target:"boss"}),true);
assert.equal(restored.status,"complete");
assert.equal(restored.unlocked.has(1),true);
const retry=new MissionManager(campaign);retry.setCheckpoint({chapter:0,objective:2});retry.fail("test");assert.equal(retry.status,"failed");retry.retry();assert.equal(retry.status,"active");assert.equal(retry.objective,2);
console.log("Mission manager tests passed: all objective types, checkpoint, retry, restore and unlock.");
