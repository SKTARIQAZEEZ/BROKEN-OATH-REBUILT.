import assert from "node:assert/strict";
import {CAMPAIGN} from "../src/campaign.js";
import {MissionManager} from "../src/mission-manager.js";
const manager=new MissionManager(CAMPAIGN);
let completed=0;
while(manager.status!=="complete"){
 const objective=manager.objectiveData;assert.ok(objective,"Campaign stalled before final chapter");
 const payload={};
 switch(objective.type){
  case "collect":payload.item=objective.target;break;
  case "defeat":payload.target=objective.target;break;
  case "interact":payload.target=objective.target;break;
  case "reach":payload.zone=objective.target;break;
  case "stealth":payload.alerted=false;break;
  case "survive":payload.elapsed=objective.duration||12;break;
  case "rescue":payload.target=objective.target;break;
  case "evidence":manager.collectEvidence(objective.target);break;
  default:throw new Error("Unmapped objective type: "+objective.type);
 }
 assert.equal(manager.completeObjective(payload),true,objective.id+" should complete");
 completed++;
}
assert.equal(manager.completed.size,15);
assert.equal(manager.chapter,14);
assert.equal(manager.status,"complete");
assert.equal(completed,CAMPAIGN.reduce((n,c)=>n+c.objectives.length,0));
console.log("Campaign simulation passed: all 15 chapters and every objective type completed in canon order.");
