import * as THREE from "three";
const mats={metal:new THREE.MeshStandardMaterial({color:0x424a50,metalness:.65,roughness:.42}),wood:new THREE.MeshStandardMaterial({color:0x594331,roughness:.9}),glow:new THREE.MeshStandardMaterial({color:0xc99b5e,emissive:0x67421c,emissiveIntensity:.65}),evidence:new THREE.MeshStandardMaterial({color:0x8a9ca3,metalness:.25,roughness:.5}),danger:new THREE.MeshStandardMaterial({color:0x5a2925,roughness:.8})};
export function createMissionObject(scene,objective,position){
 const group=new THREE.Group();group.position.copy(position);group.name="MISSION_OBJECT_"+objective.id;
 const add=(geo,mat,x,y,z)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o};
 const type=objective.type;
 if(type==="collect"||type==="evidence"){
  add(new THREE.BoxGeometry(.9,.55,.65),type==="evidence"?mats.evidence:mats.wood,0,.3,0);
  add(new THREE.BoxGeometry(.62,.06,.46),mats.metal,0,.61,0);
  add(new THREE.BoxGeometry(.15,.12,.08),mats.glow,0,.7,-.03);
 }else if(type==="rescue"){
  for(const x of [-.8,.8])for(const z of [-.65,.65])add(new THREE.CylinderGeometry(.045,.045,2.3,8),mats.metal,x,1.15,z);
  for(const y of [.25,.7,1.15,1.6,2.05]){add(new THREE.BoxGeometry(1.65,.045,.045),mats.metal,0,y,-.65);add(new THREE.BoxGeometry(1.65,.045,.045),mats.metal,0,y,.65)}
  add(new THREE.BoxGeometry(.5,.7,.35),mats.danger,0,.55,0);
 }else if(type==="interact"){
  add(new THREE.BoxGeometry(1.1,1.1,.65),mats.metal,0,.55,0);
  add(new THREE.BoxGeometry(.55,.35,.08),mats.glow,0,1.25,-.35);
  add(new THREE.CylinderGeometry(.08,.08,.14,12),mats.glow,0,1.42,-.35);
 }else if(type==="defeat"){
  add(new THREE.CylinderGeometry(.65,.65,.16,16),mats.danger,0,.08,0);
  add(new THREE.TorusGeometry(.48,.055,8,24),mats.glow,0,.2,0).rotation.x=Math.PI/2;
 }else{
  add(new THREE.CylinderGeometry(.8,.8,.08,24),mats.glow,0,.04,0);
  add(new THREE.CylinderGeometry(.45,.45,.05,24),mats.metal,0,.1,0);
 }
 scene.add(group);
 return {group,objective,position:group.position,dispose(){scene.remove(group);group.traverse(o=>{if(o.geometry)o.geometry.dispose()})}};
}
