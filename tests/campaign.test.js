import assert from "node:assert/strict";
import { CAMPAIGN } from "../src/campaign.js";
assert.equal(CAMPAIGN.length,15,"campaign must contain 15 chapters");
assert.equal(new Set(CAMPAIGN.map(c=>c.id)).size,15,"chapter IDs must be unique");
for(const [i,chapter] of CAMPAIGN.entries()){
 assert.ok(chapter.title,`chapter ${i+1} needs a title`);
 assert.ok(Array.isArray(chapter.objectives)&&chapter.objectives.length>0,`chapter ${i+1} needs objectives`);
 assert.ok(chapter.story,`chapter ${i+1} needs a story beat`);
 for(const o of chapter.objectives){assert.ok(o.id&&o.label&&o.type&&o.target,`chapter ${i+1} objective must have id, label, type and target`);assert.ok(["reach","interact","collect","defeat","stealth","survive","rescue","evidence"].includes(o.type),`unsupported objective type: ${o.type}`)}
}
assert.equal(CAMPAIGN[7].title,"The Investigation");
assert.equal(CAMPAIGN[8].title,"The Truth");
assert.equal(CAMPAIGN[9].title,"The Reunion");
assert.equal(CAMPAIGN[14].title,"The Promise Fulfilled");
console.log("Campaign checks passed: 15 chapters and typed, canon-ordered objectives.");
