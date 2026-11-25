import * as THREE from "three";
const material=(c,r=.9)=>new THREE.MeshStandardMaterial({color:c,roughness:r});
const CHAPTER_ZONES=[
 ["Childhood Neighbourhood",0x30383a,0x6b5a43,"homes"],["School & Football Ground",0x39413d,0x66714f,"sports"],["Rooftop & Departure",0x343b42,0x5a6063,"rooftop"],["Operation Perimeter",0x252c33,0x525b61,"industrial"],["Burned Family Home",0x292729,0x4d3930,"ruins"],["Devraj Compound",0x24272b,0x51473c,"compound"],["Controlled City",0x30373a,0x5b5548,"street"],["Evidence District",0x292f33,0x515b5d,"investigation"],["Memory Arena",0x30363a,0x6b604d,"arena"],["Warehouse Prison",0x20282d,0x555044,"warehouse"],["Broken Brotherhood",0x2d3034,0x625448,"arena"],["Records Archive",0x252d33,0x4b5660,"interior"],["Safehouse District",0x303b3c,0x555e4c,"safehouse"],["Devraj Headquarters",0x1c232a,0x5b4238,"fortress"],["Wedding Courtyard",0x343a38,0x88704d,"ceremony"]
];
function mesh(geo,mat,x,y,z,group){const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o}
export function buildChapterEnvironment(scene,index){
 const [name,floorColor,accent,kind]=CHAPTER_ZONES[index]||CHAPTER_ZONES[0];
 const group=new THREE.Group();group.name="CHAPTER_ENV_"+String(index+1).padStart(2,"0")+"_"+name;
 const floor=mesh(new THREE.PlaneGeometry(58,58),material(floorColor),0,-.02,0,group);floor.rotation.x=-Math.PI/2;
 const wallMat=material(accent),dark=material(0x171d22),windowMat=material(0x182a35,.35);
 const addBuilding=(x,z,w,h,d)=>{const b=mesh(new THREE.BoxGeometry(w,h,d),wallMat,x,h/2,z,group);for(let yy=2.5;yy<h-1;yy+=3)for(let xx=-w/2+1.2;xx<w/2-1;xx+=3){mesh(new THREE.BoxGeometry(.9,1.1,.06),windowMat,x+xx,yy,z-d/2-.04,group)}return b};
 if(kind==="sports"){mesh(new THREE.BoxGeometry(28,.12,18),material(0x52634b),0,.04,-4,group);for(let x of [-14,14])mesh(new THREE.BoxGeometry(.2,.12,18),material(0xc8c1a6),x,.12,-4,group)}
 else if(kind==="ruins"){for(let i=0;i<13;i++){const h=1.5+(i%4)*1.1;mesh(new THREE.BoxGeometry(3,h,2),dark,-12+(i%5)*6,h/2,-10+Math.floor(i/5)*9,group)}}
 else if(kind==="warehouse"||kind==="industrial"||kind==="fortress"){for(let x=-18;x<=18;x+=9)addBuilding(x,-17,7,kind==="fortress"?13:9,5);for(let z=-12;z<=12;z+=8)mesh(new THREE.BoxGeometry(2,2,2),dark,-7,1,z,group)}
 else if(kind==="rooftop"){for(let x=-24;x<=24;x+=8)addBuilding(x,-18,7,8+(x%3),6);mesh(new THREE.BoxGeometry(48,1,1),dark,0,.5,26,group)}
 else if(kind==="ceremony"){for(let x=-8;x<=8;x+=4){mesh(new THREE.CylinderGeometry(.13,.13,5,10),material(0x8c795f),x,2.5,-12,group);mesh(new THREE.SphereGeometry(.7,12,10),material(0x9b744f),x,5.3,-12,group)}}
 else {for(let x=-22;x<=22;x+=11){addBuilding(x,-21,8,9+(Math.abs(x)%3)*2,7);addBuilding(x,21,8,8,7)}}
 // Each chapter receives a distinct landmark and readable central play space.
 const landmark=mesh(new THREE.BoxGeometry(5,3,1),material(accent),0,1.5,-19,group);landmark.name="chapter-landmark";
 const light=new THREE.PointLight(0xc99b67,22,34);light.position.set(0,8,0);group.add(light);
 scene.add(group);return {group,name,spawn:new THREE.Vector3(0,0,8),objective:new THREE.Vector3(0,0,-15)};
}
export const CHAPTER_ENVIRONMENT_NAMES=CHAPTER_ZONES.map(x=>x[0]);
