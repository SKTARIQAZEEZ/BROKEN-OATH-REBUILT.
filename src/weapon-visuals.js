import * as THREE from "three";
const material=(color,metalness=.15,roughness=.55)=>new THREE.MeshStandardMaterial({color,metalness,roughness});
export function createWeaponVisuals(actor){
 const mount=new THREE.Group();mount.name="weapon-mount";mount.position.set(.48,1.05,-.18);actor.add(mount);
 const steel=material(0x858b8d,.82,.28),dark=material(0x25292b,.55,.48),grip=material(0x4b3025,.05,.9),brass=material(0x9b7442,.72,.38);
 const make=(name,parts)=>{const root=new THREE.Group();root.name="weapon-"+name;for(const [geometry,mat,x,y,z,rz=0] of parts){const m=new THREE.Mesh(geometry,mat);m.position.set(x,y,z);m.rotation.z=rz;m.castShadow=true;m.receiveShadow=true;root.add(m)}mount.add(root);return root};
 const baton=make("baton",[[new THREE.CylinderGeometry(.055,.065,.72,12),dark,0,.34,0],[new THREE.CylinderGeometry(.075,.075,.09,12),brass,0,.04,0],[new THREE.CylinderGeometry(.07,.07,.07,12),steel,0,.68,0]]);
 const knife=make("knife",[[new THREE.CylinderGeometry(.045,.05,.3,10),grip,0,.15,0],[new THREE.BoxGeometry(.055,.08,.09),brass,0,.33,0],[new THREE.ConeGeometry(.075,.42,4),steel,0,.57,0,Math.PI]]);
 const heavy=make("heavy",[[new THREE.CylinderGeometry(.07,.09,.5,12),grip,0,.25,0],[new THREE.CylinderGeometry(.14,.12,.48,8),dark,0,.72,0],[new THREE.TorusGeometry(.12,.025,6,12),brass,0,.49,0]]);
 const unarmed=new THREE.Group();unarmed.name="weapon-unarmed";mount.add(unarmed);
 const all={unarmed,baton,knife,heavy};
 function equip(name){if(!all[name])return false;for(const [key,obj] of Object.entries(all))obj.visible=key===name;mount.visible=name!=="unarmed";return true}
 equip("unarmed");
 return {mount,equip,dispose(){actor.remove(mount);mount.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose()})}};
}
