import assert from "node:assert/strict";
import { CAMPAIGN } from "../src/campaign.js";
assert.equal(CAMPAIGN.length, 15, "campaign must contain 15 chapters");
assert.equal(new Set(CAMPAIGN.map(c => c.id)).size, 15, "chapter IDs must be unique");
for (const [i, chapter] of CAMPAIGN.entries()) {
  assert.ok(chapter.title, `chapter ${i+1} needs a title`);
  assert.ok(Array.isArray(chapter.objectives) && chapter.objectives.length > 0, `chapter ${i+1} needs objectives`);
  assert.ok(chapter.story, `chapter ${i+1} needs a story beat`);
}
assert.equal(CAMPAIGN[14].title, "The Promise Fulfilled");
console.log("Campaign structure checks passed: 15 chapters, unique IDs, objectives and story beats.");
