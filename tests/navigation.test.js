import assert from "node:assert/strict";
import {NavigationGrid} from "../src/navigation.js";
const nav=new NavigationGrid({bounds:{minX:0,maxX:20,minZ:0,maxZ:20},cellSize:2,colliders:[{x:10,z:10,halfX:2,halfZ:6}]});
const path=nav.findPath({x:2,z:10},{x:18,z:10});
assert.ok(path.length>0);assert.ok(path.every(p=>!(Math.abs(p.x-10)<2.7&&Math.abs(p.z-10)<6.7)));
assert.deepEqual(nav.findPath({x:2,z:2},{x:10,z:10}),[]);
console.log("Navigation pathfinding tests passed.");
