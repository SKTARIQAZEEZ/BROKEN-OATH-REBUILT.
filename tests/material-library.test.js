import assert from "node:assert/strict";
import {createSurfaceMaterial} from "../src/material-library.js";
for(const kind of ["concrete","asphalt","metal","wood","burnt","fabric","stone"]){
 const a=createSurfaceMaterial(kind,{seed:7}),b=createSurfaceMaterial(kind,{seed:7});
 assert.equal(a.userData.proceduralSurface,kind);
 assert.equal(a.map.image.width,96);
 assert.equal(a.bumpMap.image.height,96);
 assert.deepEqual(a.map.image.data,b.map.image.data,"same seed must be deterministic");
 a.map.dispose();a.bumpMap.dispose();a.dispose();b.map.dispose();b.bumpMap.dispose();b.dispose();
}
console.log("Material library tests passed: deterministic PBR albedo and bump maps for seven surface families.");
