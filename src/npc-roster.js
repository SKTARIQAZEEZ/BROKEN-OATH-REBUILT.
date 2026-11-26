import * as THREE from "three";
import {createCharacter} from "./characters.js";
import {attachCharacterAsset} from "./character-assets.js";

// Four regular guard archetypes, ten ambient residents/workers and five mini-bosses = all 19 NPC exports.
export const GUARD_ASSETS = Object.freeze(["Guard_Armed.glb","Guard_Male.glb","Guard_Female.glb","Guard_Supervisor.glb"]);

// Ambient cast is deliberately separate from hostile encounter actors.
export const NPC_AMBIENT = [
 {id:"civilian-elderly-man",asset:"Civilian_Elderly_Man.glb",name:"Elderly Resident",role:"civilian",chapters:[0,6,7],position:[-23,8]},
 {id:"civilian-elderly-woman",asset:"Civilian_Elderly_Woman.glb",name:"Elderly Resident",role:"civilian",chapters:[0,6,12],position:[23,8]},
 {id:"civilian-man",asset:"Civilian_Man.glb",name:"Local Resident",role:"civilian",chapters:[0,1,6,14],position:[-8,22]},
 {id:"civilian-woman",asset:"Civilian_Woman.glb",name:"Local Resident",role:"civilian",chapters:[0,1,6,14],position:[8,22]},
 {id:"civilian-young-man",asset:"Civilian_Young_Man.glb",name:"Young Resident",role:"civilian",chapters:[6,7,8,10],position:[-23,-7]},
 {id:"civilian-young-woman",asset:"Civilian_Young_Woman.glb",name:"Young Resident",role:"civilian",chapters:[0,1,7,12],position:[23,-7]},
 {id:"worker-construction",asset:"Worker_Construction.glb",name:"Construction Worker",role:"worker",chapters:[3,4,13],position:[-22,5]},
 {id:"worker-mechanic",asset:"Worker_Mechanic.glb",name:"Mechanic",role:"worker",chapters:[3,6,13],position:[22,5]},
 {id:"worker-shopkeeper",asset:"Worker_Shopkeeper.glb",name:"Shopkeeper",role:"worker",chapters:[0,6,7,12],position:[-8,-23]},
 {id:"worker-warehouse",asset:"Worker_Warehouse.glb",name:"Warehouse Worker",role:"worker",chapters:[5,9,11],position:[8,-23]}
];

export const MINI_BOSS_BY_TARGET = Object.freeze({
 "compound-guards":"MiniBoss_Territory_Commander.glb",
 "street-gang":"MiniBoss_Street_Scout.glb",
 "devraj-lieutenant":"MiniBoss_Gang_Lieutenant.glb",
 "district-gang":"MiniBoss_District_Captain.glb",
 "final-guards":"MiniBoss_Protection_Collector.glb"
});

export const MINI_BOSS_ASSETS = Object.freeze(Object.values(MINI_BOSS_BY_TARGET));

export function createAmbientNpcActors(scene){
 return NPC_AMBIENT.map((definition,index)=>{
  const actor=createCharacter({name:definition.name,role:"civilian",scale:.96,shirt:index%2?0x49433d:0x55504a});
  actor.name=definition.id;
  actor.userData.npcId=definition.id;
  actor.userData.npcRole=definition.role;
  actor.userData.npcChapters=definition.chapters;
  actor.visible=false;
  attachCharacterAsset(actor,"/assets/npcs/"+definition.asset,{targetHeight:1.7});
  scene.add(actor);
  return {definition,actor};
 });
}

export function setAmbientNpcChapter(entries,chapter,environment){
 for(const {definition,actor} of entries){
  const active=definition.chapters.includes(chapter);
  actor.visible=active;
  if(!active)continue;
  const [x,z]=definition.position;
  const resolved=environment?.resolvePosition
   ? environment.resolvePosition(new THREE.Vector3(x,0,z),.48)
   : new THREE.Vector3(x,0,z);
  actor.position.copy(resolved);
  actor.rotation.y=(chapter+definition.chapters.length)*.37;
  actor.userData.setAnimation?.("idle");
 }
 return entries.filter(({actor})=>actor.visible).length;
}
