import * as THREE from "three";
const mat=(c,r=.75,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
function part(geo,material,x,y,z,parent){const o=new THREE.Mesh(geo,material);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o}
export function createCharacter({name,shirt=0x35485b,trousers=0x20252a,skin=0x98745d,hair=0x211b18,scale=1,role="civilian",accent=0x8b765d}={}){
 const root=new THREE.Group();root.name=name;
 const skinMat=mat(skin),shirtMat=mat(shirt),pantsMat=mat(trousers),hairMat=mat(hair),shoeMat=mat(0x17191c),accentMat=mat(accent,.55);
 const torso=part(new THREE.CapsuleGeometry(.39*scale,.78*scale,6,12),shirtMat,0,1.12*scale,0,root);
 const neck=part(new THREE.CylinderGeometry(.105*scale,.12*scale,.2*scale,10),skinMat,0,1.72*scale,0,root);
 const headPivot=new THREE.Group();headPivot.position.set(0,1.78*scale,0);root.add(headPivot);
 part(new THREE.SphereGeometry(.27*scale,20,16),skinMat,0,.18*scale,0,headPivot);
 part(new THREE.SphereGeometry(.275*scale,16,8,0,Math.PI*2,0,Math.PI*.48),hairMat,0,.29*scale,0,headPivot);
 part(new THREE.BoxGeometry(.17*scale,.035*scale,.025*scale),mat(0x17191b),0,.20*scale,-.245*scale,headPivot);
 part(new THREE.ConeGeometry(.055*scale,.13*scale,8),skinMat,0,.13*scale,-.27*scale,headPivot);
 const eyeMat=mat(0x171412,.35),browMat=mat(0x30221c),mouth=part(new THREE.SphereGeometry(.052*scale,12,8),mat(0x3c1716),0,.075*scale,-.258*scale,headPivot);mouth.scale.set(1,.22,.28);
 const brows=[];for(const x of [-1,1]){part(new THREE.SphereGeometry(.032*scale,10,8),eyeMat,x*.095*scale,.205*scale,-.235*scale,headPivot);const brow=part(new THREE.BoxGeometry(.105*scale,.025*scale,.035*scale),browMat,x*.095*scale,.255*scale,-.235*scale,headPivot);brows.push(brow)}
 // Hairline side locks and ears make silhouettes more readable at gameplay distance.
 for(const x of [-1,1]){part(new THREE.SphereGeometry(.055*scale,8,8),skinMat,x*.265*scale,.17*scale,0,headPivot);part(new THREE.CapsuleGeometry(.045*scale,.18*scale,4,6),hairMat,x*.22*scale,.12*scale,-.03*scale,headPivot)}
 const limbs={legs:[],arms:[],feet:[]};
 for(const x of [-1,1]){
  const leg=new THREE.Group();leg.position.set(x*.17*scale,.72*scale,0);part(new THREE.CapsuleGeometry(.13*scale,.48*scale,5,8),pantsMat,0,-.28*scale,0,leg);root.add(leg);limbs.legs.push(leg);
  part(new THREE.BoxGeometry(.22*scale,.12*scale,.36*scale),shoeMat,x*.17*scale,.08*scale,-.09*scale,root);
  const arm=new THREE.Group();arm.position.set(x*.46*scale,1.45*scale,0);
  part(new THREE.CapsuleGeometry(.105*scale,.42*scale,5,8),shirtMat,0,-.22*scale,0,arm);
  part(new THREE.SphereGeometry(.09*scale,10,8),skinMat,0,-.48*scale,-.01*scale,arm);root.add(arm);limbs.arms.push(arm);
  if(role==="gang"||role==="soldier")part(new THREE.CylinderGeometry(.115*scale,.115*scale,.2*scale,10),accentMat,0,-.36*scale,0,arm);
 }
 // Belt, collar and layered clothing add shape separation.
 part(new THREE.CylinderGeometry(.29*scale,.29*scale,.1*scale,12),mat(0x171a1d),0,.78*scale,0,root);
 part(new THREE.BoxGeometry(.12*scale,.09*scale,.035*scale),mat(0xb18a50,.4,.55),0,.78*scale,-.3*scale,root);
 part(new THREE.ConeGeometry(.13*scale,.24*scale,4),mat(0x20252a),0,1.47*scale,-.28*scale,root);
 if(role==="gang"||role==="soldier"){
  part(new THREE.BoxGeometry(.66*scale,.56*scale,.43*scale),mat(0x292d2c),0,1.2*scale,0,root);
  part(new THREE.BoxGeometry(.12*scale,.28*scale,.04*scale),accentMat,0,1.2*scale,-.23*scale,root);
 }
 if(role==="leader"){
  part(new THREE.CapsuleGeometry(.44*scale,.92*scale,5,10),mat(0x1c2228),0,1.08*scale,.035*scale,root);
  part(new THREE.BoxGeometry(.07*scale,.42*scale,.04*scale),accentMat,.12*scale,1.25*scale,-.36*scale,root);
 }
 const animation={name:"idle",elapsed:0,talking:false,expression:"neutral"};
 root.userData={name,limbs,headPivot,animation,face:{mouth,brows},setExpression(expression="neutral"){animation.expression=expression;const tilt=expression==="angry"?.16:expression==="sad"?-.12:0;brows[0].rotation.z=tilt;brows[1].rotation.z=-tilt;mouth.scale.y=expression==="surprised"?.8:expression==="sad"?.35:.22},setTalking(value){animation.talking=!!value},setAnimation(name){animation.name=name;animation.elapsed=0},animate(dt,time,moving=false){
  if(moving&&animation.name==="idle")animation.name="walk";if(!moving&&animation.name==="walk")animation.name="idle";
  animation.elapsed+=dt;const t=time*9,swing=moving?Math.sin(t)*.55:0;mouth.scale.y=animation.talking?.22+Math.abs(Math.sin(time*13))*.48:(animation.expression==="surprised"?.8:.22);
  limbs.legs[0].rotation.x=swing;limbs.legs[1].rotation.x=-swing;
  limbs.arms[0].rotation.x=-swing*.7;limbs.arms[1].rotation.x=swing*.7;
  if(animation.name==="attack"){limbs.arms[0].rotation.x=-1.15;limbs.arms[0].rotation.z=-.35}
  else if(animation.name==="counter"){limbs.arms[0].rotation.x=-1.25;limbs.arms[1].rotation.x=-1.05;limbs.arms[0].rotation.z=-.3;limbs.arms[1].rotation.z=.3}
  else if(animation.name==="dodge"){root.rotation.z=Math.sin(animation.elapsed*18)*.16;limbs.legs[0].rotation.x=-.7;limbs.legs[1].rotation.x=.7;limbs.arms.forEach(a=>a.rotation.x=-.5)}
  else if(animation.name==="finisher"){limbs.arms[0].rotation.x=-1.5;limbs.arms[0].rotation.z=-.55;root.rotation.x=-.08}
  else if(animation.name==="guard"){limbs.arms.forEach((a,i)=>{a.rotation.x=-.85;a.rotation.z=i===0?-.25:.25})}
  else if(animation.name==="hit"){headPivot.rotation.x=.22;limbs.arms[0].rotation.x=.6}
  else {root.rotation.z=0;root.rotation.x=0;headPivot.rotation.x=Math.sin(time*1.4)*.025;limbs.arms.forEach(a=>a.rotation.z=0)}
 }};
 return root;
}
export const CHARACTER_PRESETS={
 azeez:{name:"Azeez",shirt:0x354d66,trousers:0x20252a,skin:0x986f58,hair:0x171615,accent:0x9b805b,role:"hero"},
 ranvir:{name:"Ranvir",shirt:0x6d4032,trousers:0x282626,skin:0x91694f,hair:0x171513,accent:0x9b805b,role:"leader"},
 ananya:{name:"Ananya",shirt:0x76566a,trousers:0x29252a,skin:0xa87960,hair:0x211714,accent:0xb28a68,role:"civilian"},
 anjali:{name:"Anjali",shirt:0x665344,trousers:0x302c29,skin:0x9b7359,hair:0x27201b,accent:0x9d805f,role:"civilian"},
 devraj:{name:"Devraj",shirt:0x25282d,trousers:0x171a1e,skin:0x8e654d,hair:0x171513,accent:0xb28b58,role:"leader"}
};