import assert from "node:assert/strict";
import {SaveSystem} from "../src/save-system.js";
import {readFile} from "node:fs/promises";

const values=new Map();
globalThis.localStorage={
 getItem:key=>values.has(key)?values.get(key):null,
 setItem:(key,value)=>values.set(key,String(value)),
 removeItem:key=>values.delete(key)
};
const saves=new SaveSystem();
const key="broken-oath-rebuilt-save";
const legacyMission={schema:1,chapter:3,objective:2,status:"active"};
values.set(key,JSON.stringify({schema:1,chapter:3,step:2,health:64,mission:legacyMission}));
const migrated=saves.load();
assert.equal(migrated.schema,2,"Legacy save should migrate to the current schema");
assert.equal(migrated.chapter,3);
assert.equal(migrated.step,2);
assert.equal(migrated.health,64);
assert.deepEqual(migrated.mission,legacyMission,"Legacy mission snapshots must remain restorable");
const saved=saves.save({schema:99,chapter:99,step:-2,health:150,mission:{schema:2}});
assert.equal(saved.schema,2,"Callers must not override the save schema");
assert.equal(saved.chapter,14);
assert.equal(saved.step,0);
assert.equal(saved.health,100);
assert.equal(saves.load().schema,2);
const positioned=saves.save({chapter:1,step:1,health:80,player:{x:45,z:-32},mission:{schema:2}});
assert.deepEqual(positioned.player,{x:28,z:-28},"Saved player coordinates must stay inside world bounds");
assert.deepEqual(saves.load().player,{x:28,z:-28},"Player position must survive save and restore");
const main=await readFile(new URL("../src/main.js",import.meta.url),"utf8");
assert.match(main,/player:\{x:player\.position\.x,z:player\.position\.z\}/,"Manual saves must capture the current player position");
assert.match(main,/const savedPosition=s\.player\|\|s\.mission\?\.checkpoint\?\.player/,"Loading must restore the saved or checkpoint position");
values.set(key,"{invalid json");
assert.equal(saves.load(),null,"Corrupt saves should fail safely");
values.set(key,JSON.stringify({schema:77,chapter:1,step:0,health:100}));
assert.equal(saves.load(),null,"Unknown save schemas should be rejected");
saves.clear();
assert.equal(saves.load(),null);
console.log("Save migration and validation tests passed.");
