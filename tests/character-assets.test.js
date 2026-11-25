import assert from "node:assert/strict";
import {resolveCharacterClip} from "../src/character-assets.js";
const clips=["Idle","Walk","Run","Punch","Fighting stance","Punch combo (jab, cross, hook)","Front kick","Roundhouse kick","Block (unarmed)"].map(name=>({name}));
for(const [state,expected] of [["idle","Idle"],["walk","Walk"],["run","Run"],["guard","Fighting stance"],["attack","Punch"],["counter","Punch combo (jab, cross, hook)"],["dodge","Roundhouse kick"],["finisher","Front kick"],["hit","Block (unarmed)"]])assert.equal(resolveCharacterClip(clips,state)?.name,expected, state+" should resolve to its authored animation");
assert.equal(resolveCharacterClip([{name:"Idle"}],"unknown").name,"Idle");
assert.equal(resolveCharacterClip([],"idle"),null);
console.log("Character asset animation mapping checks passed.");
