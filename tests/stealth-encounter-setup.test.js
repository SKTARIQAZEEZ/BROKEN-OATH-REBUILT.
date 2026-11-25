import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(new URL("../src/main.js",import.meta.url),"utf8");
const stealthSetup=source.match(/if\(o\.type===\"stealth\"\)\{([^}]+(?:\}[^}]+)*)\}else if\(o\.type===\"survive\"/);
assert.ok(stealthSetup,"Stealth objectives must create a dedicated encounter setup");
assert.match(stealthSetup[1],/const count=4/,"Infiltration must populate the warehouse with multiple guards");
assert.match(stealthSetup[1],/e\.visible=true/,"Stealth guards must be active in the scene");
assert.match(stealthSetup[1],/e\.userData\.setAnimation\(\"guard\"\)/,"Stealth guards must enter their guard animation state");
assert.match(source,/failWhen:context=>context\.alerted===true/,"A detected infiltration must fail through the mission trigger");
assert.match(source,/e\.userData\.patrolX=positions\[i\]\.x;e\.userData\.patrolZ=positions\[i\]\.z/,"Infiltration guards must patrol around the active mission site");
assert.match(source,/else if\(o\.type===\"survive\"\)\{const count=o\.target===\"training\"\?2:3/,"Survival objectives must create active combat pressure");
assert.match(source,/MISSION FAILED — RESTART THE CHAPTER TO TRY AGAIN/,"Mission failure must tell the player how to recover");
assert.match(source,/if\(missionManager\.status===\"failed\"\)\{paused=true/,"A failed mission must not allow the player to resume a broken objective");
assert.match(source,/e\.pointerType===\"touch\"\)\{dragX=e\.clientX/,"Touch users must be able to orbit the gameplay camera");
assert.match(source,/addEventListener\(\"pointercancel\",stopCameraDrag\)/,"Camera drag must clean up when a touch is interrupted");
assert.match(source,/if\(missionManager\.status===\"failed\"\)\{paused=true;\$\(\"#pauseMenu\"\)\.classList\.remove\(\"hide\"\)/,"A saved failed mission must reopen the retry menu after loading");
console.log("Stealth encounter integration tests passed.");
