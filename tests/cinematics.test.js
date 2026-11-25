import assert from "node:assert/strict";
import {CinematicDirector} from "../src/cinematics.js";
const events=[];
const director=new CinematicDirector({
 onCaption:(caption,speaker)=>events.push(["caption",caption,speaker]),
 onLetterbox:value=>events.push(["letterbox",value]),
 onShot:(shot,beat)=>events.push(["shot",shot,beat.speaker]),
 onSequenceEnd:name=>events.push(["end",name])
});
assert.equal(director.play([{speaker:"AZEEZ",shot:"close",caption:"I will return.",duration:.2}],{name:"opening"}),true);
assert.equal(director.playing,true);
assert.deepEqual(events[0],["letterbox",true]);
assert.deepEqual(events[1],["caption","I will return.","AZEEZ"]);
assert.deepEqual(events[2],["shot","close","AZEEZ"]);
director.update(.25);
assert.equal(director.playing,false);
assert.ok(events.some(e=>e[0]==="end"&&e[1]==="opening"));
assert.ok(events.some(e=>e[0]==="letterbox"&&e[1]===false));
director.play([{caption:"Skip me",duration:5}],{name:"skip-check"});
director.skip();
assert.equal(director.playing,false);
assert.ok(events.some(e=>e[0]==="end"&&e[1]==="skip-check"));
console.log("Cinematic director tests passed: playback, callbacks, completion and skip lifecycle.");
