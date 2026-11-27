import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
const CLIP_ALIASES={idle:["Idle"],walk:["Walk"],run:["Run"],guard:["Fighting stance","Block (unarmed)"],attack:["Punch","Punch combo (jab, cross, hook)"],counter:["Punch combo (jab, cross, hook)"],dodge:["Roundhouse kick","Front kick"],finisher:["Front kick","Punch combo (jab, cross, hook)"],hit:["Block (unarmed)","Shot in the chest"]};
const normalize=value=>String(value||"").toLowerCase().replace(/[^a-z0-9]/g,"");
let sharedAnimationClipsPromise=null;
function sharedAnimationClips(loader){
 if(!sharedAnimationClipsPromise)sharedAnimationClipsPromise=loader.loadAsync("/assets/characters/Azeez.glb").then(gltf=>gltf.animations||[]).catch(()=>[]);
 return sharedAnimationClipsPromise;
}
export function resolveCharacterClip(clips,requested){
 const wanted=CLIP_ALIASES[requested]||[requested];
 for(const alias of wanted){const key=normalize(alias),found=clips.find(c=>normalize(c.name)===key)||clips.find(c=>normalize(c.name).includes(key));if(found)return found}
 return clips.find(c=>normalize(c.name)==="idle")||clips[0]||null;
}
export function attachCharacterAsset(actor,url,{targetHeight=1.8,loader=new GLTFLoader()}={}){
 const originalAnimate=actor.userData.animate,weaponMount=()=>actor.children.find(c=>c.name==="weapon-mount");
 const state={status:"loading",url,mixer:null,actions:new Map(),activeAction:null,requested:"idle",clips:[],model:null,load:null,requestId:0};
 actor.userData.characterAsset=state;
 const load=nextUrl=>{
  const requestId=++state.requestId;state.status="loading";state.url=nextUrl;
  loader.load(nextUrl,async gltf=>{
   let clips=gltf.animations||[];
   // The 12 gang variants are skinned meshes without embedded clips. Their rig
   // matches the authored cast rig, so reuse the named cast's animation library.
   if(!clips.length)clips=await sharedAnimationClips(loader);
   if(requestId!==state.requestId)return;
   const model=gltf.scene,bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3());
   if(!Number.isFinite(size.y)||size.y<=0){state.status="error";state.error="GLB has no measurable model height";return}
   model.scale.setScalar(targetHeight/size.y);model.updateMatrixWorld(true);
   const scaled=new THREE.Box3().setFromObject(model);
   model.position.x-=(scaled.min.x+scaled.max.x)/2;model.position.z-=(scaled.min.z+scaled.max.z)/2;model.position.y-=scaled.min.y;
   model.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true}});
   if(state.mixer){state.mixer.stopAllAction();state.mixer.uncacheRoot(state.model)}
   if(state.model){actor.remove(state.model);state.model.traverse(o=>{o.geometry?.dispose();if(o.material){for(const mat of Array.isArray(o.material)?o.material:[o.material])mat.dispose()}})}
   const mount=weaponMount();
   for(const child of [...actor.children])if(child!==mount){actor.remove(child);child.traverse?.(o=>{o.geometry?.dispose();if(o.material){for(const mat of Array.isArray(o.material)?o.material:[o.material])mat.dispose()}})}
   actor.add(model);state.model=model;
   if(mount){actor.remove(mount);actor.add(mount);mount.position.set(.34,targetHeight*.58,-.12)}
   state.mixer=new THREE.AnimationMixer(model);state.clips=clips.map(source=>{const clip=source.clone();clip.tracks=clip.tracks.filter(track=>{try{const parsed=THREE.PropertyBinding.parseTrackName(track.name);const target=parsed.nodeName?model.getObjectByName(parsed.nodeName):model;if(!target)return false;if(parsed.propertyName==="morphTargetInfluences"&&!target.morphTargetInfluences)return false;return true}catch{return false}});return clip}).filter(clip=>clip.tracks.length);state.actions.clear();state.activeAction=null;
   for(const clip of state.clips)state.actions.set(clip.name,state.mixer.clipAction(clip));
   const play=requested=>{
    const clip=resolveCharacterClip(state.clips,requested);if(!clip)return;
    const action=state.actions.get(clip.name);if(!action||state.activeAction===action)return;
    action.reset();action.enabled=true;action.setLoop(THREE.LoopRepeat,Infinity);action.clampWhenFinished=false;action.fadeIn(.16);
    state.activeAction?.fadeOut(.16);action.play();state.activeAction=action;state.requested=requested;
   };
   state.play=play;actor.userData.setAnimation=name=>{state.requested=name;play(name)};
   actor.userData.animate=(dt,_time,moving=false)=>{if(moving&&state.requested==="idle")play("walk");else if(!moving&&state.requested==="walk")play("idle");state.mixer?.update(Math.min(Math.max(dt,0),.1))};
   actor.userData.setExpression=()=>{};actor.userData.setTalking=()=>{};state.status="loaded";state.animationSource=gltf.animations?.length?"embedded":clips.length?"shared:Azeez.glb":"none";play(state.requested||"idle");
  },undefined,error=>{if(requestId!==state.requestId)return;state.status=state.model?"loaded":"fallback";state.error=error?.message||"Unable to load GLB";if(!state.model)actor.userData.animate=originalAnimate});
 };
 state.load=load;load(url);return state;
}
