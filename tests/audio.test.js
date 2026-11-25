import assert from "node:assert/strict";
import {AudioDirector} from "../src/audio.js";
const audio=new AudioDirector();
for(const cue of ["playUI","playHit","playFootstep","playObjectiveComplete","playFailure","playChapterTransition","playBossPhase","playBossDefeat","stopAmbience","dispose"]){assert.equal(typeof audio[cue],"function",cue+" must be available")}
audio.setEnabled(false);assert.equal(audio.enabled,false);audio.setEnabled(true);assert.equal(audio.enabled,true);
audio.startAmbience("industrial");audio.startAmbience("outdoor");audio.dispose();
console.log("Audio checks passed: named gameplay cues, mute toggle and safe lifecycle.");
