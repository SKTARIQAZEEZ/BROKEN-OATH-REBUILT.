import assert from "node:assert/strict";
import * as THREE from "three";
import {CHAPTER_ENVIRONMENT_NAMES,CHAPTER_ENVIRONMENT_KINDS,buildChapterEnvironment} from "../src/environments.js";
import {buildWorld} from "../src/world.js";
assert.equal(CHAPTER_ENVIRONMENT_NAMES.length,15);
assert.equal(new Set(CHAPTER_ENVIRONMENT_NAMES).size,15);
assert.equal(CHAPTER_ENVIRONMENT_KINDS.length,15);
assert.ok(CHAPTER_ENVIRONMENT_KINDS.includes("warehouse"));
assert.ok(CHAPTER_ENVIRONMENT_KINDS.includes("ceremony"));
assert.ok(CHAPTER_ENVIRONMENT_KINDS.includes("investigation"));
assert.ok(CHAPTER_ENVIRONMENT_KINDS.includes("arena"));
assert.ok(CHAPTER_ENVIRONMENT_KINDS.includes("rooftop"));
const scene=new THREE.Scene();for(let i=0;i<15;i++){const env=buildChapterEnvironment(scene,i);assert.ok(env.group.children.length>0);assert.ok(env.objectiveAnchors.length>0);if(!["rooftop","interior","ceremony"].includes(env.kind))assert.ok(env.group.children.some(o=>o.name==="drivable-main-road"),"Outdoor chapters need a drivable road surface");if(env.kind==="sports"){for(const name of ["football-pitch","centre-circle","football-goal-post","goal-net-vertical","spectator-bleacher","football-floodlight-pole","school-scoreboard"])assert.ok(env.group.children.some(o=>o.name===name),`Football ground needs ${name}`);assert.ok(env.group.children.some(o=>o.name==="drivable-connector-road"),"Football ground should connect to the road network");}for(const anchor of env.objectiveAnchors){assert.ok(anchor.x>=env.walkableBounds.minX&&anchor.x<=env.walkableBounds.maxX,"objective anchors must be inside walkable X bounds");assert.ok(anchor.z>=env.walkableBounds.minZ&&anchor.z<=env.walkableBounds.maxZ,"objective anchors must be inside walkable Z bounds");assert.ok(env.colliders.every(c=>Math.abs(anchor.x-c.x)>=c.halfX+.5||Math.abs(anchor.z-c.z)>=c.halfZ+.5),"objective markers must not spawn inside solid geometry")}assert.ok(env.group.children.some(o=>["service-floor-hatch","overhead-pipe","utility-pole","burned-masonry","warm-string-light"].includes(o.name)),"environment must contain kind-specific set dressing");assert.ok(env.colliders.every(c=>Number.isFinite(c.x)&&c.halfX>0));if(["warehouse","interior","fortress","compound","safehouse"].includes(env.kind))assert.ok(env.group.children.some(o=>o.name==="interior-floor"));
if(["homes","safehouse","street"].includes(env.kind))assert.ok(env.group.children.some(o=>o.name==="residential-house"),"Residential chapters need house facade models");
if(["homes","safehouse","street"].includes(env.kind)){
 const houses=env.group.children.filter(o=>o.name==="residential-house");
 assert.ok(houses.length>0,"Residential chapters need house shells");
 const house=houses[0],hx=house.position.x,hz=house.position.z,houseParts=[];house.traverse(o=>houseParts.push(o.name));
 for(const part of ["house-front-wall-left","house-front-wall-right","house-front-door","house-interior-floor","house-sofa","house-cabinet","house-coffee-table","house-bed"])
  assert.ok(houseParts.includes(part),`Enterable furnished house needs ${part}`);
 assert.ok(!env.colliders.some(c=>Math.abs(c.x-hx)<.7&&Math.abs(c.z-(hz+3.05))<.45),
  "The front doorway must remain open in the collision grid");
 assert.ok(env.colliders.some(c=>c.x<hx-3&&Math.abs(c.z-hz)<.2),"House side walls must block passage");
}
if(["homes","safehouse","street"].includes(env.kind))assert.ok(env.colliders.length>=5,"Residential facades and street props need collision");
if(env.kind==="investigation")assert.ok(env.group.children.some(o=>o.name==="evidence-marker"),"Investigation districts need physical evidence staging");
if(env.kind==="arena")assert.ok(env.group.children.some(o=>o.name==="punching-bag"),"Memory arenas need training props");
if(env.kind==="rooftop")assert.ok(env.group.children.some(o=>o.name==="rooftop-water-tank"),"Rooftops need recognizable rooftop equipment");env.dispose()}assert.equal(scene.children.length,0);
const mobileScene=new THREE.Scene();buildWorld(mobileScene,{mobile:true});
const mobileSun=mobileScene.children.find(o=>o.isDirectionalLight);
assert.equal(mobileSun.shadow.mapSize.width,1024,"Mobile should use a lighter shadow map");
const desktopScene=new THREE.Scene();buildWorld(desktopScene,{mobile:false});
const desktopSun=desktopScene.children.find(o=>o.isDirectionalLight);
assert.equal(desktopSun.shadow.mapSize.width,2048,"Desktop should retain higher shadow quality");
const floorGrid=desktopScene.children.find(o=>o.type==="GridHelper");
assert.equal(floorGrid.material.opacity,.12,"The floor grid should remain subtle rather than look like a debug overlay");
console.log("Environment checks passed: 15 chapter spaces, furnished interiors and disposable collision geometry.");
