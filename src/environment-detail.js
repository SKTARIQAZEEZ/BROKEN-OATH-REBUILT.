import * as THREE from "three";
const mat=(color,roughness=.82,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function prop(group,geometry,material,x,y,z,name,rotation=null){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);if(rotation)o.rotation.set(...rotation);o.name=name;o.castShadow=true;o.receiveShadow=true;group.add(o);return o}
function light(group,x,y,z,color=0xc99b67,intensity=2,range=8){const l=new THREE.PointLight(color,intensity,range);l.position.set(x,y,z);group.add(l);return l}

/** Adds reusable set-dressing kits; gameplay collision remains explicit and testable. */
export function decorateEnvironment(group,kind,colliders=[]){
 const metal=mat(0x343a3e,.42,.72),rust=mat(0x654334,.88),rubber=mat(0x171a1d),wood=mat(0x51402f),warning=mat(0x9b7441,.5),glass=mat(0x263c43,.22,.25),concrete=mat(0x424444);
 const addCollider=(x,z,w,d,h)=>colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});
 if(["warehouse","industrial","fortress","compound","interior"].includes(kind)){
  // Industrial pipe runs, cable trays and structural beams break up large flat walls.
  for(let x=-20;x<=20;x+=10){
   prop(group,new THREE.CylinderGeometry(.12,.12,42,10),metal,x,5,-7,"overhead-pipe",[Math.PI/2,0,0]);
   prop(group,new THREE.BoxGeometry(.18,.18,42),rubber,x+.35,6.2,-7,"cable-tray");
   for(let z=-22;z<=18;z+=10)prop(group,new THREE.BoxGeometry(.6,.08,.3),warning,x,4.5,z,"hazard-stripe");
  }
  for(let z=-18;z<=18;z+=12){
   prop(group,new THREE.CylinderGeometry(.55,.55,1.25,12),rust,-20,.63,z,"oil-drum");
   prop(group,new THREE.CylinderGeometry(.55,.55,1.25,12),metal,20,.63,z,"steel-drum");
   prop(group,new THREE.BoxGeometry(1.7,.16,1.25),wood,-14,.12,z+2,"wooden-pallet");
   prop(group,new THREE.BoxGeometry(1.6,1.5,1.2),wood,-14,.9,z+2,"shipping-crate");addCollider(-14,z+2,1.6,1.2,1.5);
  }
  for(const x of [-22,22]){prop(group,new THREE.BoxGeometry(.25,5,.25),metal,x,2.5,-24,"support-column");prop(group,new THREE.BoxGeometry(1.2,.18,.8),warning,x,4.5,-23.8,"warning-sign");}
  for(const x of [-16,0,16]){prop(group,new THREE.BoxGeometry(3,.35,.4),concrete,x,.18,14,"concrete-barricade");addCollider(x,14,3,.4,.35)}
 }else if(["street","homes","safehouse","sports","rooftop"].includes(kind)){
  // Power poles and sagging cables establish a lived-in neighbourhood silhouette.
  for(const x of [-23,-7,9,23]){
   prop(group,new THREE.CylinderGeometry(.12,.17,8,8),wood,x,4,16,"utility-pole");
   for(let h=5.4;h<=6.4;h+=.5)prop(group,new THREE.BoxGeometry(1.4,.08,.08),metal,x,h,16,"crossarm");
  }
  for(let i=0;i<3;i++)prop(group,new THREE.CylinderGeometry(.025,.025,48,6),rubber,0,6.1+i*.3,16,[ "overhead-wire"],[0,0,Math.PI/2]);
  for(const [x,z] of [[-18,5],[17,8],[-10,-12],[12,-10]]){
   prop(group,new THREE.BoxGeometry(1.3,.8,.8),metal,x,.4,z,"street-bin");addCollider(x,z,1.3,.8,.8);
   prop(group,new THREE.BoxGeometry(2.4,.12,.7),wood,x+2,.8,z+2,"street-bench");
  }
 }else if(kind==="ruins"){
  for(let i=0;i<24;i++){
   const x=-20+(i*7%40),z=-20+(i*11%38),h=.15+(i%4)*.12;
   prop(group,new THREE.DodecahedronGeometry(.35+(i%3)*.12,0),i%3?concrete:rust,x,h/2,z,"burned-masonry");
  }
  for(const x of [-13,13]){prop(group,new THREE.BoxGeometry(.3,3,.3),rust,x,1.5,-12,"charred-beam",[0,0,x<0?-.18:.18]);prop(group,new THREE.ConeGeometry(.35,1.2,7),rubber,x,.6,-10,"ash-pile")}
 }else if(kind==="ceremony"){
  // Restrained warm practicals: the wedding remains cinematic, not brightly saturated.
  for(let x=-9;x<=9;x+=3){light(group,x,4.8,-12,0xe0ad72,1.1,6);prop(group,new THREE.SphereGeometry(.12,10,8),warning,x,4.8,-12,"warm-string-light")}
  for(const x of [-10,10])for(const z of [-15,-7]){prop(group,new THREE.CylinderGeometry(.75,.85,.7,12),wood,x,.35,z,"ceremony-planter");prop(group,new THREE.SphereGeometry(.7,12,8),warning,x,1,z,"flower-arrangement")}
 }
 if(kind==="interior"||kind==="safehouse"){
  for(const x of [-18,18])for(const z of [-16,-6,4,14]){prop(group,new THREE.BoxGeometry(.12,3,.12),metal,x,1.5,z,"interior-column");light(group,x,2.8,z,0xc99b67,.8,5)}
 }
 return {props:group.children.filter(o=>o.name&&!["walkable-ground"].includes(o.name)).length};
}
