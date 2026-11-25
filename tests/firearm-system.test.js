import assert from "node:assert/strict";
import {FirearmSystem,FIREARMS} from "../src/firearm-system.js";
const f=new FirearmSystem();assert.deepEqual(f.ammo("pistol"),{magazine:12,reserve:60,capacity:12});
assert.equal(f.fire("pistol").ok,true);assert.equal(f.ammo("pistol").magazine,11);assert.equal(f.fire("pistol").reason,"cooldown");
f.update(.32);assert.equal(f.fire("pistol").ok,true);
for(let i=0;i<10;i++){f.update(.32);f.fire("pistol")}
assert.equal(f.ammo("pistol").magazine,0);assert.equal(f.fire("pistol").reason,"empty");
assert.equal(f.reload("pistol").ok,true);f.update(FIREARMS.pistol.reloadTime);
assert.equal(f.ammo("pistol").magazine,12);assert.equal(f.ammo("pistol").reserve,48);
assert.equal(f.reload("rifle").ok,true);f.cancelReload();assert.equal(f.reloading,false);
assert.equal(f.fire("unknown").reason,"not-firearm");console.log("Firearm ammo, cadence, reload and validation tests passed.");
