import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";

const CLIP_ALIASES={
 idle:["Idle"],walk:["Walk"],run:["Run"],guard:["Fighting stance","Block (unarmed)"],
 attack:["Punch","Punch combo (jab, cross, hook)"],counter:["Punch combo (jab, cross, hook)"],
 dodge:["Roundhouse kick","Front kick"],finisher:["Front kick","Punch combo (jab, cross, hook)"],
 hit:["Block (unarmed)","Shot in the chest"]
};
const normalize=value=>String(value||"").toLowerCase().replace(/[^a-z0-9]/g,"");
export function resolveCharacterClip(clips,requested){
 const wanted=CLIP_ALIASES[requested]||[requested];
 for(const alias of wanted){const key=normalize(alias);const found=clips.find(clip=>normalize(clip.name)===key)||clips.find(clip=>normalize(clip.name).includes(key));if(found)return found}
 return clips.find(clip=>normalize(clip.name)==="idle")||clips[0]||null;
}

/**
 * Replace a procedural stand-in with an authored GLB while retaining the actor
 * group, world transform, gameplay userData and any attached weapon mount.
 * A missing asset deliberately leaves the stand-in in place.
 */
export function attachCharacterAsset(actor,url,{targetHeight=1.8,loader=new GLTFLoader()}={}){
 const state={status:"loading",url,mixer:null,actions:new Map(),activeAction:null,requested:"idle",clips:[],model:null,load:null};
 actor.userData.characterAsset=state;
 const originalAnimate=actor.userData.animate;
 const load=nextUrl=>{state.status="loading";state.url=nextUrl;loader.load(nextUrl,gltf=>{
  const model=gltf.scene;
  const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());
  if(!Number.isFinite(size.y)||size.y<=0){state.status="error";state.error="GLB has no measurable model height";return}
  model.scale.setScalar(targetHeight/size.y);
  model.updateMatrixWorld(true);
  const scaledBounds=new THREE.Box3().setFromObject(model);
  model.position.x-=(scaledBounds.min.x+scaledBounds.max.x)/2;
  model.position.z-=(scaledBounds.min.z+scaledBounds.max.z)/2;
  model.position.y-=scaledBounds.min.y;
  model.traverse(object=>{if(object.isMesh){object.castShadow=true;object.receiveShadow=true;if(object.material){for(const material of Array.isArray(object.material)?object.material:[object.material]){if("roughness" in material&&material.roughness===undefined)material.roughness=.78}}}});
  const weaponMount=actor.children.find(child=>child.name==="weapon-mount");
  for(const child of [...actor.children])if(child!==weaponMount){actor.remove(child);child.traverse?.(object=>{if(object.geometry)object.geometry.dispose();if(object.material){for(const material of Array.isArray(object.material)?object.material:[object.material])material.dispose()}})}
  actor.add(model);
  if(weaponMount){actor.remove(weaponMount);actor.add(weaponMount);weaponMount.position.set(.34,targetHeight*.58,-.12)}
  const mixer=new THREE.AnimationMixer(model);state.mixer=mixer;state.clips=gltf.animations||[];
  for(const clip of state.clips)state.actions.set(clip.name,mixer.clipAction(clip));
  state.status="loaded";
  const play=requested=>{
   const clip=resolveCharacterClip(state.clips,requested);if(!clip)return;
   const next=state.actions.get(clip.name);if(!next)return;
   if(state.activeAction===next)return;
   next.reset();next.enabled=true;next.setLoop(THREE.LoopRepeat,Infinity);next.clampWhenFinished=false;next.fadeIn(.16);
   state.activeAction?.fadeOut(.16);next.play();state.activeAction=next;state.requested=requested;
  };
  state.play=play;
  actor.userData.setAnimation=name=>{state.requested=name;play(name)};
  actor.userData.animate=(dt,_time,moving=false)=>{
   if(moving&&state.requested==="idle")play("walk");
   else if(!moving&&state.requested==="walk")play("idle");
   mixer.update(Math.min(Math.max(dt,0),.1));
  };
  actor.userData.setExpression=()=>{};
  actor.userData.setTalking=()=>{};
  play("idle");
 },undefined,error=>{
  state.status="fallback";state.error=error?.message||"Unable to load GLB";
  actor.userData.animate=originalAnimate;
 });
 return state;
}
