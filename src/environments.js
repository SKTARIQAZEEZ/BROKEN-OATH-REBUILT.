import * as THREE from "three";
import {decorateEnvironment} from "./environment-detail.js";
import {createSurfaceMaterial} from "./material-library.js";
const material=(c,r=.9,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
const CHAPTER_ZONES=[
 ["Childhood Neighbourhood",0x30383a,0x6b5a43,"homes"],["School & Football Ground",0x39413d,0x66714f,"sports"],["Rooftop & Departure",0x343b42,0x5a6063,"rooftop"],["Operation Perimeter",0x252c33,0x525b61,"industrial"],["Burned Family Home",0x292729,0x4d3930,"ruins"],["Devraj Compound",0x24272b,0x51473c,"compound"],["Controlled City",0x30373a,0x5b5548,"street"],["Evidence District",0x292f33,0x515b5d,"investigation"],["Memory Arena",0x30363a,0x6b604d,"arena"],["Warehouse Prison",0x20282d,0x555044,"warehouse"],["Broken Brotherhood",0x2d3034,0x625448,"arena"],["Records Archive",0x252d33,0x4b5660,"interior"],["Safehouse District",0x303b3c,0x555e4c,"safehouse"],["Devraj Headquarters",0x1c232a,0x5b4238,"fortress"],["Wedding Courtyard",0x343a38,0x88704d,"ceremony"]
];
const OBJECTIVE_ANCHORS=[
 [[0,-4],[4,-4],[-4,-4],[-8,-3]],[[4,-4],[8,2],[-4,-4]],[[-4,-4],[0,-20],[4,-4]],[[0,-20],[10,-20],[18,-25],[0,10]],[[0,-24],[10,-24],[18,-25]],[[0,-30],[5,-30],[10,-30]],[[0,5],[0,-12],[12,-20]],[[0,-12],[-12,-18],[0,-30],[4,-4]],[[-12,-18],[8,2],[0,5],[4,-4]],[[0,-30],[-12,-18],[0,-28],[0,-8]],[[4,-4],[0,-30],[-2,-8]],[[0,-30],[10,-30],[0,-18]],[[-2,-8],[4,-4],[0,-20]],[[0,-30],[0,-18],[0,-30],[4,-4]],[[4,-4],[0,5]]
];
function mesh(geo,mat,x,y,z,group,name){const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;if(name)o.name=name;group.add(o);return o}
function addLamp(group,x,z){const pole=mesh(new THREE.CylinderGeometry(.07,.1,4,8),material(0x34383b),x,2,z,group,"street-lamp");const lamp=new THREE.PointLight(0xd0a16b,5,12);lamp.position.set(x,4,z);group.add(lamp);return pole}
export function buildChapterEnvironment(scene,index){
 const [name,floorColor,accent,kind]=CHAPTER_ZONES[index]||CHAPTER_ZONES[0],group=new THREE.Group();
 group.name="CHAPTER_ENV_"+String(index+1).padStart(2,"0")+"_"+name;
 const floor=mesh(new THREE.PlaneGeometry(58,58),createSurfaceMaterial("asphalt",{color:floorColor,seed:index+1}),0,-.02,0,group,"walkable-ground");floor.rotation.x=-Math.PI/2;
 const wallMat=createSurfaceMaterial(kind==="ruins"?"burnt":"concrete",{color:accent,seed:index+11}),dark=createSurfaceMaterial("metal",{color:0x171d22,seed:index+31}),windowMat=material(0x182a35,.35),trim=material(0x77716a);
 const colliders=[],landmarks=[];
 const addBuilding=(x,z,w,h,d,label="building")=>{const b=mesh(new THREE.BoxGeometry(w,h,d),wallMat,x,h/2,z,group,label);colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});for(let yy=2.5;yy<h-1;yy+=3)for(let xx=-w/2+1.2;xx<w/2-1;xx+=3)mesh(new THREE.BoxGeometry(.9,1.1,.06),windowMat,x+xx,yy,z-d/2-.04,group,"window");return b};
 const addCover=(x,z,w=2.4,h=1.15,d=.8,label="cover")=>{const o=mesh(new THREE.BoxGeometry(w,h,d),dark,x,h/2,z,group,label);colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});return o};
 if(kind==="sports"){
  mesh(new THREE.BoxGeometry(28,.12,18),material(0x52634b),0,.04,-4,group,"football-pitch");
  for(const x of [-14,14])mesh(new THREE.BoxGeometry(.2,.12,18),trim,x,.12,-4,group,"pitch-line");
  for(const z of [-13,5])mesh(new THREE.BoxGeometry(28,.08,.12),trim,0,.13,z,group,"pitch-line");
  for(const x of [-13,13]){mesh(new THREE.BoxGeometry(.25,2.2,.25),trim,x,1,-4,group,"goal-post");mesh(new THREE.BoxGeometry(2.5,.2,.2),trim,x,2.1,-4,group,"goal-crossbar")}
  addBuilding(-19,-18,8,8,7,"school-building");addBuilding(19,-18,8,8,7,"classroom");
 }else if(kind==="ruins"){
  for(let i=0;i<15;i++){const h=1.1+(i%4)*.85,x=-12+(i%5)*6,z=-10+Math.floor(i/5)*9;addCover(x,z,3,h,2,"burned-rubble")}
  for(let i=0;i<8;i++)mesh(new THREE.ConeGeometry(.35,.9,6),material(0x171514),-14+i*4,.45,-17+(i%2)*3,group,"debris");
 }else if(kind==="warehouse"||kind==="industrial"||kind==="fortress"||kind==="compound"){
  for(let x=-18;x<=18;x+=9)addBuilding(x,-19,7,kind==="fortress"?13:kind==="compound"?11:9,6,"industrial-structure");
  for(let z=-12;z<=12;z+=8)addCover(-7,z,2.4,2,2,"crate-stack");
  addBuilding(0,-28,42,kind==="fortress"?8:6,2,"rear-perimeter-wall");
  for(let x=-20;x<=20;x+=10)addLamp(group,x,-5);
 }else if(kind==="rooftop"){
  for(let x=-24;x<=24;x+=8)addBuilding(x,-18,7,8+(Math.abs(x)%3),6,"rooftop-tower");
  mesh(new THREE.BoxGeometry(48,1,1),dark,0,.5,26,group,"parapet");
  for(let x=-20;x<=20;x+=10)addCover(x,8,2,1.2,1.2,"rooftop-vent");
 }else if(kind==="ceremony"){
  for(let x=-8;x<=8;x+=4){mesh(new THREE.CylinderGeometry(.13,.13,5,10),material(0x8c795f),x,2.5,-12,group,"ceremony-pillar");mesh(new THREE.SphereGeometry(.7,12,10),material(0x9b744f),x,5.3,-12,group,"floral-decoration")}
  mesh(new THREE.BoxGeometry(10,.4,4),material(0x76563e),0,.2,-18,group,"wedding-stage");
 }else{
  for(let x=-22;x<=22;x+=11){addBuilding(x,-21,8,9+(Math.abs(x)%3)*2,7,"street-building");addBuilding(x,21,8,8,7,"street-building")}
  for(let x=-15;x<=15;x+=10){addCover(x,-4,2.5,1.4,1,"street-cover");addLamp(group,x,12)}
  if(kind==="interior"){for(let z=-15;z<=12;z+=5)for(let x of [-10,10])addCover(x,z,2,2.4,1,"archive-shelf")}
 }
 if(["homes","safehouse","street"].includes(kind)){
  // Recognizable residential facades: pitched roof silhouette, recessed entry, porch and ground-floor windows.
  const houseXs=kind==="street"?[-18,0,18]:[-18,18];
  for(let i=0;i<houseXs.length;i++){
   const x=houseXs[i],z=kind==="street"?-9+(i%2)*18:kind==="homes"?-17: -17;
   const w=7.4,d=6.2,h=5.8;
   const facade=mesh(new THREE.BoxGeometry(w,h,d),createSurfaceMaterial("concrete",{color:i%2?0x4b4944:0x5a5147,seed:index*17+i}),x,h/2,z,group,"residential-house");
   colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});
   const roof=new THREE.Mesh(new THREE.ConeGeometry(w*.72,2.25,4),material(i%2?0x282b2d:0x39312d));roof.position.set(x,h+1.05,z);roof.rotation.y=Math.PI/4;roof.castShadow=true;roof.receiveShadow=true;roof.name="pitched-house-roof";group.add(roof);
   const door=new THREE.Mesh(new THREE.BoxGeometry(1.05,2.25,.12),material(0x34271f));door.position.set(x,.0+1.125,z+d/2+.07);door.castShadow=true;door.name="house-front-door";group.add(door);
   for(const wx of [-2.25,2.25]){
    const win=new THREE.Mesh(new THREE.BoxGeometry(1.25,1.15,.08),windowMat);win.position.set(x+wx,2.65,z+d/2+.08);win.name="house-front-window";group.add(win);
    const sill=new THREE.Mesh(new THREE.BoxGeometry(1.45,.1,.18),trim);sill.position.set(x+wx,2.02,z+d/2+.08);group.add(sill);
   }
   const porch=new THREE.Mesh(new THREE.BoxGeometry(3.2,.18,1.35),material(0x4a4239));porch.position.set(x,.18,z+d/2+.68);porch.name="house-porch";porch.castShadow=true;group.add(porch);
   for(const px of [-1.35,1.35]){const column=new THREE.Mesh(new THREE.BoxGeometry(.14,2.4,.14),trim);column.position.set(x+px,1.3,z+d/2+1.15);column.name="porch-column";group.add(column);colliders.push({x:x+px,z:z+d/2+1.15,halfX:.1,halfZ:.1,height:2.4})}
   const step=new THREE.Mesh(new THREE.BoxGeometry(1.8,.22,.55),material(0x4a4945));step.position.set(x,.11,z+d/2+1.5);step.name="house-entry-step";group.add(step);
  }
 }
 // Reusable authored interior rooms add navigable, furnished spaces to the blockout.
 if(["warehouse","interior","fortress","compound","safehouse","homes"].includes(kind)){
  const ix=17,iz=8,iw=10,id=8,wall=.35,roomMat=material(kind==="warehouse"||kind==="fortress"?0x34383a:0x49433c),floorMat=material(0x292d30);
  mesh(new THREE.BoxGeometry(iw,.12,id),floorMat,ix,.04,iz,group,"interior-floor");
  const wallPart=(x,z,w,d,label)=>{mesh(new THREE.BoxGeometry(w,3,d),roomMat,x,1.5,z,group,label);colliders.push({x,z,halfX:w/2,halfZ:d/2,height:3})};
  wallPart(ix-iw/2,iz,wall,id,"interior-west-wall");wallPart(ix+iw/2,iz,wall,id,"interior-east-wall");wallPart(ix,iz-id/2,iw,wall,"interior-rear-wall");
  wallPart(ix-iw*.32,iz+id/2,iw*.36,wall,"interior-front-wall-left");wallPart(ix+iw*.32,iz+id/2,iw*.36,wall,"interior-front-wall-right");
  for(let side=0;side<2;side++){const sx=ix+(side?3.1:-3.1);mesh(new THREE.BoxGeometry(2.4,2.1,.65),material(kind==="interior"?0x555b60:0x51483d),sx,1.05,iz-2.2,group,"interior-storage-shelf");colliders.push({x:sx,z:iz-2.2,halfX:1.2,halfZ:.33,height:2.1});for(let y=.55;y<1.8;y+=.6)mesh(new THREE.BoxGeometry(2.2,.06,.55),trim,sx,y,iz-2.2,group,"shelf-level")}
  mesh(new THREE.BoxGeometry(2.2,.18,1.1),material(0x554333),ix, .85,iz+.2,group,"interior-work-table");colliders.push({x:ix,z:iz+.2,halfX:1.1,halfZ:.55,height:1});
  for(const [dx,dz] of [[-2,2],[2,2]]){mesh(new THREE.BoxGeometry(1,.9,1),material(0x4b4035),ix+dx,.45,iz+dz,group,"interior-crate");colliders.push({x:ix+dx,z:iz+dz,halfX:.5,halfZ:.5,height:.9})}
  const ceiling=mesh(new THREE.BoxGeometry(iw,.18,id),dark,ix,3.05,iz,group,"interior-ceiling");ceiling.visible=false;
  const practical=new THREE.PointLight(0xc99b67,7,15);practical.position.set(ix,2.6,iz);group.add(practical);
 }
 const landmark=mesh(new THREE.BoxGeometry(5,3,1),material(accent),0,1.5,-19,group,"chapter-landmark");landmarks.push(landmark);
 const light=new THREE.PointLight(0xc99b67,kind==="interior"?12:18,38);light.position.set(0,8,0);group.add(light);
 decorateEnvironment(group,kind,colliders);
 const anchors=(OBJECTIVE_ANCHORS[index]||OBJECTIVE_ANCHORS[0]).map(([x,z])=>{
  const origin={x:THREE.MathUtils.clamp(x,-26.5,26.5),z:THREE.MathUtils.clamp(z,-26.5,26.5)};
  const clear=(px,pz)=>colliders.every(box=>Math.abs(px-box.x)>=box.halfX+.7||Math.abs(pz-box.z)>=box.halfZ+.7);
  if(clear(origin.x,origin.z))return new THREE.Vector3(origin.x,.12,origin.z);
  let best=null,bestDistance=Infinity;
  for(let px=-26.5;px<=26.5;px+=.5)for(let pz=-26.5;pz<=26.5;pz+=.5){
   if(!clear(px,pz))continue;
   const distance=(px-origin.x)**2+(pz-origin.z)**2;
   if(distance<bestDistance){bestDistance=distance;best={x:px,z:pz}}
  }
  return new THREE.Vector3(best?.x??0,.12,best?.z??8);
 });
 const spawn=new THREE.Vector3(0,0,8);
 scene.add(group);
 return {group,name,kind,spawn,objectiveAnchors:anchors,colliders,landmarks,walkableBounds:{minX:-28,maxX:28,minZ:-28,maxZ:28},resolvePosition(position,radius=.42){const p=position.clone();p.x=THREE.MathUtils.clamp(p.x,-28+radius,28-radius);p.z=THREE.MathUtils.clamp(p.z,-28+radius,28-radius);for(const box of colliders){const minX=box.x-box.halfX-radius,maxX=box.x+box.halfX+radius,minZ=box.z-box.halfZ-radius,maxZ=box.z+box.halfZ+radius;if(p.x>minX&&p.x<maxX&&p.z>minZ&&p.z<maxZ){const dx=Math.min(Math.abs(p.x-minX),Math.abs(maxX-p.x)),dz=Math.min(Math.abs(p.z-minZ),Math.abs(maxZ-p.z));if(dx<dz)p.x=p.x<box.x?minX:maxX;else p.z=p.z<box.z?minZ:maxZ}}return p},dispose(){scene.remove(group);group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>{m.map?.dispose();m.bumpMap?.dispose();m.dispose()});else{o.material.map?.dispose();o.material.bumpMap?.dispose();o.material.dispose()}}})}};
}
export const CHAPTER_ENVIRONMENT_NAMES=CHAPTER_ZONES.map(x=>x[0]);
export const CHAPTER_ENVIRONMENT_KINDS=CHAPTER_ZONES.map(x=>x[3]);
