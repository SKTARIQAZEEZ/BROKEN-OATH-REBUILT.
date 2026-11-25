import assert from "node:assert/strict";
import {readFile} from "node:fs/promises";

const source=await readFile(new URL("../src/main.js",import.meta.url),"utf8");
const stealthSetup=source.match(/if\(o\.type===\"stealth\"\)\{([^}]+(?:\}[^}]+)*)\}else if\(o\.type===\"defeat\"/);
assert.ok(stealthSetup,"Stealth objectives must create a dedicated encounter setup");
assert.match(stealthSetup[1],/const count=4/,"Infiltration must populate the warehouse with multiple guards");
assert.match(stealthSetup[1],/e\.visible=true/,"Stealth guards must be active in the scene");
assert.match(stealthSetup[1],/e\.userData\.setAnimation\(\"guard\"\)/,"Stealth guards must enter their guard animation state");
assert.match(source,/failWhen:context=>context\.alerted===true/,"A detected infiltration must fail through the mission trigger");
console.log("Stealth encounter integration tests passed.");
