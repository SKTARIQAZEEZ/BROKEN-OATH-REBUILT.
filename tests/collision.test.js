import assert from "node:assert/strict";
import {resolveCircleAgainstAABBs} from "../src/collision.js";
const wall={x:0,z:0,halfX:2,halfZ:1};
const p={x:0,z:0};
resolveCircleAgainstAABBs(p,[wall],.5);
assert.ok(Math.abs(p.z)===1.5||Math.abs(p.x)===2.5,"player must be pushed outside expanded wall bounds");
const clear={x:5,z:5};resolveCircleAgainstAABBs(clear,[wall],.5);
assert.deepEqual(clear,{x:5,z:5});
console.log("Collision tests passed.");
