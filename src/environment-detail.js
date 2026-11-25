import * as THREE from "three";
const mat=(color,roughness=.82,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function prop(group,geometry,material,x,y,z,name,rotation=null){const o=new THREE.Mesh(geometry,material);o.position.set(x,y,z);if(rotation)o.rotation.set(...rotation);o.name=name;o.castShadow=true;o.receiveShadow=true;group.add(o);return o}
function light(group,x,y,z,color=0xc99b67,intensity=2,range=8){const l=new THREE.PointLight(color,intensity,range);l.position.set(x,y,z);group.add(l);return l}

/** Adds reusable set-dressing kits; gameplay collision remains explicit and testable. */
export function decorateEnvironment(group,kind,colliders=[]){
 const metal=mat(0x343a3e,.42,.72),rust=mat(0x654334,.88),rubber=mat(0x171a1d),wood=mat(0x51402f),warning=mat(0x9b7441,.5),glass=mat(0x263c43,.22,.25),concrete=mat(0x424444);
 // Every chapter receives small grounded service details, even when its set has a unique kit.
 prop(group,new THREE.BoxGeometry(1.1,.08,.7),metal,-25,.04,24,"service-floor-hatch");
 prop(group,new THREE.CylinderGeometry(.06,.08,2.2,8),metal,25,1.1,24,"service-pipe");
 const addCollider=(x,z,w,d,h)=>colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});
 if(["warehouse","industrial","fortress","compound","interior"].includes(kind)){
  // Industrial pipe runs, cable trays and structural beams break up large flat walls.
  for(let x=-20;x<=20;x+=10){
   prop(group,new THREE.CylinderGeometry(.12,.12,42,10),metal,x,5,-7,"overhead-pipe",[Math.PI/2,0,0]);
   prop(group,new THREE.BoxGeometry(.18,.18,42),rubber,x+.35,6.2,-7,"cable-tray");
   for(let z=-22;z<=18;z+=10)prop(group,new THREE.BoxGeometry(.6,.08,.3),warning,x,4.5,z,"hazard-stripe");
  }
  for(let z=-18;z<=18;z+=12){
   prop(group,new THREE.CylinderGeometry(.55,.55,1.25,12),rust,-20,.63,z,"oil-drum");addCollider(-20,z,1.15,1.15,1.25);
   prop(group,new THREE.CylinderGeometry(.55,.55,1.25,12),metal,20,.63,z,"steel-drum");addCollider(20,z,1.15,1.15,1.25);
   prop(group,new THREE.BoxGeometry(1.7,.16,1.25),wood,-14,.12,z+2,"wooden-pallet");
   prop(group,new THREE.BoxGeometry(1.6,1.5,1.2),wood,-14,.9,z+2,"shipping-crate");addCollider(-14,z+2,1.6,1.2,1.5);
  }
  for(const x of [-22,22]){prop(group,new THREE.BoxGeometry(.25,5,.25),metal,x,2.5,-24,"support-column");addCollider(x,-24,.3,.3,5);prop(group,new THREE.BoxGeometry(1.2,.18,.8),warning,x,4.5,-23.8,"warning-sign");}
  for(const x of [-16,0,16]){prop(group,new THREE.BoxGeometry(3,.35,.4),concrete,x,.18,14,"concrete-barricade");addCollider(x,14,3,.4,.35)}
 }else if(["street","homes","safehouse","sports","rooftop"].includes(kind)){
  // Power poles and sagging cables establish a lived-in neighbourhood silhouette.
  for(const x of [-23,-7,9,23]){
   prop(group,new THREE.CylinderGeometry(.12,.17,8,8),wood,x,4,16,"utility-pole");addCollider(x,16,.35,.35,8);
   for(let h=5.4;h<=6.4;h+=.5)prop(group,new THREE.BoxGeometry(1.4,.08,.08),metal,x,h,16,"crossarm");
  }
  for(let i=0;i<3;i++)prop(group,new THREE.CylinderGeometry(.025,.025,48,6),rubber,0,6.1+i*.3,16,"overhead-wire",[0,0,Math.PI/2]);
  for(const [x,z] of [[-18,5],[17,8],[-10,-12],[12,-10]]){
   prop(group,new THREE.BoxGeometry(1.3,.8,.8),metal,x,.4,z,"street-bin");addCollider(x,z,1.3,.8,.8);
   prop(group,new THREE.BoxGeometry(2.4,.12,.7),wood,x+2,.8,z+2,"street-bench");
  }
 }else if(kind==="ruins"){
  for(let i=0;i<24;i++){
   const x=-20+(i*7%40),z=-20+(i*11%38),h=.15+(i%4)*.12;
   prop(group,new THREE.DodecahedronGeometry(.35+(i%3)*.12,0),i%3?concrete:rust,x,h/2,z,"burned-masonry");addCollider(x,z,.8,.8,h);
  }
  for(const x of [-13,13]){prop(group,new THREE.BoxGeometry(.3,3,.3),rust,x,1.5,-12,"charred-beam",[0,0,x<0?-.18:.18]);prop(group,new THREE.ConeGeometry(.35,1.2,7),rubber,x,.6,-10,"ash-pile")}
 }else if(kind==="ceremony"){
  // Restrained warm practicals: the wedding remains cinematic, not brightly saturated.
  for(let x=-9;x<=9;x+=3){light(group,x,4.8,-12,0xe0ad72,1.1,6);prop(group,new THREE.SphereGeometry(.12,10,8),warning,x,4.8,-12,"warm-string-light")}
  for(const x of [-10,10])for(const z of [-15,-7]){prop(group,new THREE.CylinderGeometry(.75,.85,.7,12),wood,x,.35,z,"ceremony-planter");addCollider(x,z,1.6,1.6,.7);prop(group,new THREE.SphereGeometry(.7,12,8),warning,x,1,z,"flower-arrangement")}
 }else if(kind==="investigation"){
  // Azeez returns to a damaged home district: evidence is staged as physical scene detail.
  for(let i=0;i<8;i++){const x=-15+(i%4)*10,z=-12+Math.floor(i/4)*13;prop(group,new THREE.ConeGeometry(.16,.42,6),warning,x,.21,z,"evidence-marker");prop(group,new THREE.BoxGeometry(.55,.08,.4),glass,x,.46,z,"evidence-tray");addCollider(x,z,.6,.5,.5)}
  for(const x of [-17,17]){prop(group,new THREE.BoxGeometry(1.5,2.1,.7),metal,x,1.05,-5,"records-cabinet");addCollider(x,-5,1.5,.7,2.1);prop(group,new THREE.BoxGeometry(2.2,1.1,.12),wood,x,2.4,-5.42,"evidence-board");for(let i=0;i<5;i++)prop(group,new THREE.BoxGeometry(.22,.28,.025),warning,x-.75+i*.36,2.42,-5.34,"pinned-evidence")}
  for(let z=-18;z<=12;z+=6)prop(group,new THREE.CylinderGeometry(.018,.018,28,5),warning,0,.9,z,"crime-scene-tape",[0,0,Math.PI/2]);
  light(group,0,4,-4,0xc99b67,1.4,12);
 }else if(kind==="arena"){
  // Memory and brotherhood arenas carry worn training equipment rather than generic crates.
  for(const x of [-10,10]){prop(group,new THREE.BoxGeometry(3,.18,.8),wood,x,.45,-8,"training-bench");addCollider(x,-8,3,.8,.9);prop(group,new THREE.CylinderGeometry(.32,.38,1.8,12),rubber,x,1.2,3,"punching-bag");addCollider(x,3,.8,.8,2.4);prop(group,new THREE.CylinderGeometry(.06,.06,2.1,8),metal,x,2.5,3,"bag-chain")}
  for(let i=0;i<6;i++){const x=-12+i*4;prop(group,new THREE.BoxGeometry(1.2,.55,.8),wood,x,.275,12,"training-sandbag");addCollider(x,12,1.2,.8,.55)}
  prop(group,new THREE.TorusGeometry(5,.07,8,48),warning,0,.08,-2,"sparring-circle").rotation.x=Math.PI/2;
  for(const x of [-14,14]){prop(group,new THREE.BoxGeometry(.18,2.4,.18),metal,x,1.2,-19,"goal-post");addCollider(x,-19,.2,.2,2.4);prop(group,new THREE.BoxGeometry(2.8,.16,.18),metal,x,2.35,-19,"goal-crossbar")}
 }
 if(kind==="rooftop"){
  for(const [x,z] of [[-15,-10],[13,-12]]){prop(group,new THREE.CylinderGeometry(1.35,1.45,2.2,16),metal,x,1.1,z,"rooftop-water-tank");addCollider(x,z,2.8,2.8,2.2)}
  for(const [x,z] of [[-7,8],[8,10]]){prop(group,new THREE.BoxGeometry(2.4,1.1,1.6),metal,x,.55,z,"rooftop-hvac");addCollider(x,z,2.4,1.6,1.1)}
  prop(group,new THREE.CylinderGeometry(.9,.9,.08,16),glass,18,2.4,-2,"satellite-dish",[.35,0,0]);addCollider(18,-2,1.8,1.8,2.5);
  for(let i=0;i<4;i++)prop(group,new THREE.CylinderGeometry(.018,.018,34,5),rubber,-17+i*.35,3.8,12,"rooftop-clothesline",[0,0,Math.PI/2]);
 }
 if(kind==="interior"||kind==="safehouse"){
  for(const x of [-18,18])for(const z of [-16,-6,4,14]){prop(group,new THREE.BoxGeometry(.12,3,.12),metal,x,1.5,z,"interior-column");addCollider(x,z,.18,.18,3);light(group,x,2.8,z,0xc99b67,.8,5)}
 }
 return {props:group.children.filter(o=>o.name&&!["walkable-ground"].includes(o.name)).length};
}
