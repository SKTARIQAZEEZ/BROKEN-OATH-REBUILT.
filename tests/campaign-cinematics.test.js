import assert from "node:assert/strict";
import {CAMPAIGN} from "../src/campaign.js";
import {STORY_CINEMATICS} from "../src/campaign-cinematics.js";
const shots=new Set(["wide","close","overShoulder","memory","confrontation","medium"]);
for(const chapter of CAMPAIGN){
 const beats=STORY_CINEMATICS[chapter.id];
 assert.ok(Array.isArray(beats)&&beats.length>0,"Missing authored sequence: "+chapter.id);
 for(const beat of beats){assert.ok(beat.caption&&beat.speaker,"Dialogue beat requires speaker and caption");assert.ok(shots.has(beat.shot),"Unknown shot: "+beat.shot);assert.ok(beat.duration>0,"Dialogue beat duration must be positive")}
}
assert.match(STORY_CINEMATICS.CH15_PROMISE.at(-1).caption,/We did\. Together\./);
console.log("Cinematic coverage passed: all 15 chapters have authored dialogue and valid camera direction.");
