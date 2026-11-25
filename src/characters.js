import * as THREE from "three";
const mat=(c,r=.75,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
export function createCharacter({name,shirt=0x35485b,trousers=0x20252a,skin=0x98745d,hair=0x211b18,scale=1,role="civilian"}={}){
 const root=new THREE.Group();root.name=name;
 const torso=new THREE.Mesh(new THREE.CapsuleGeometry(.39*scale,.78*scale,6,12),mat(shirt));torso.position.y=1.12*scale;torso.castShadow=true;root.add(torso);
 const neck=new THREE.Mesh(new THREE.CylinderGeometry(.105*scale,.12*scale,.2*scale,10),mat(skin));neck.position.y=1.72*scale;root.add(neck);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.27*scale,20,16),mat(skin));head.position.y=1.96*scale;head.castShadow=true;root.add(head);
 const hairCap=new THREE.Mesh(new THREE.SphereGeometry(.275*scale,16,8,0,Math.PI*2,0,Math.PI*.48),mat(hair));hairCap.position.y=2.07*scale;root.add(hairCap);
 const eyes=new THREE.Mesh(new THREE.BoxGeometry(.17*scale,.035*scale,.025*scale),mat(0x17191b));eyes.position.set(0,1.99*scale,-.245*scale);root.add(eyes);
 const limbs={legs:[],arms:[]};
 for(const x of [-1,1]){
  const leg=new THREE.Group();leg.position.set(x*.17*scale,.72*scale,0);
  const thigh=new THREE.Mesh(new THREE.CapsuleGeometry(.13*scale,.48*scale,5,8),mat(trousers));thigh.position.y=-.28*scale;thigh.castShadow=true;leg.add(thigh);root.add(leg);limbs.legs.push(leg);
  const arm=new THREE.Group();arm.position.set(x*.46*scale,1.45*scale,0);
  const upper=new THREE.Mesh(new THREE.CapsuleGeometry(.105*scale,.42*scale,5,8),mat(shirt));upper.rotation.z=x*-.12;upper.position.y=-.22*scale;upper.castShadow=true;arm.add(upper);
  const hand=new THREE.Mesh(new THREE.SphereGeometry(.09*scale,10,8),mat(skin));hand.position.y=-.48*scale;arm.add(hand);root.add(arm);limbs.arms.push(arm);
 }
 if(role==="gang"||role==="soldier"){const vest=new THREE.Mesh(new THREE.BoxGeometry(.66*scale,.56*scale,.43*scale),mat(0x292d2c));vest.position.y=1.2*scale;root.add(vest)}
 if(role==="leader"){const coat=new THREE.Mesh(new THREE.CapsuleGeometry(.44*scale,.92*scale,5,10),mat(0x1c2228));coat.position.y=1.08*scale;root.add(coat)}
 root.userData={name,limbs,animation:"idle",animate(dt,time,moving=false){this.animation=moving?"walk":"idle";const swing=moving?Math.sin(time*9)*.55:0;limbs.legs[0].rotation.x=swing;limbs.legs[1].rotation.x=-swing;limbs.arms[0].rotation.x=-swing*.7;limbs.arms[1].rotation.x=swing*.7}};
 return root;
}
export const CHARACTER_PRESETS={
 azeez:{name:"Azeez",shirt:0x354d66,trousers:0x20252a,role:"hero"},
 ranvir:{name:"Ranvir",shirt:0x6d4032,trousers:0x282626,role:"leader"},
 ananya:{name:"Ananya",shirt:0x76566a,trousers:0x29252a,role:"civilian"},
 anjali:{name:"Anjali",shirt:0x665344,trousers:0x302c29,role:"civilian"},
 devraj:{name:"Devraj",shirt:0x25282d,trousers:0x171a1e,role:"leader"}
};
