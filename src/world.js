import * as THREE from "three";
const mat=(color,roughness=.85)=>new THREE.MeshStandardMaterial({color,roughness});
export function buildWorld(scene,{mobile=false}={}){
 scene.background=new THREE.Color(0x111923);scene.fog=new THREE.FogExp2(0x111923,.018);
 scene.add(new THREE.HemisphereLight(0x8b9cac,0x18120e,1.25));
 const sun=new THREE.DirectionalLight(0xe5d5bc,2);sun.position.set(-25,35,20);sun.castShadow=true;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);scene.add(sun);
 const floor=new THREE.Mesh(new THREE.PlaneGeometry(220,220),mat(0x292e30));floor.rotation.x=-Math.PI/2;floor.receiveShadow=true;scene.add(floor);
 const grid=new THREE.GridHelper(220,70,0x43494a,0x333a3c);grid.position.y=.01;grid.material.transparent=true;grid.material.opacity=.12;grid.material.depthWrite=false;scene.add(grid);
 function block(x,z,w,h,d,c){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat(c));m.position.set(x,h/2,z);m.castShadow=true;m.receiveShadow=true;scene.add(m);for(let y=2.5;y<h-1;y+=3)for(let xx=-w/2+1;xx<w/2-1;xx+=2.7){const win=new THREE.Mesh(new THREE.BoxGeometry(.95,1.15,.07),mat(0x1a2a35));win.position.set(x+xx,y,z-d/2-.05);scene.add(win)}}
 for(let i=0;i<9;i++){block(-28+i*7,-25,5,8+(i%3)*3,7,0x343a3e);block(-28+i*7,27,5,7+(i%4)*2,7,0x2c3338)}
 for(let i=0;i<6;i++){block(-35,-15+i*7,7,10,5,0x343a3e);block(35,-15+i*7,7,9+(i%2)*4,5,0x30363a)}
 for(let z=-20;z<=20;z+=10){const p=new THREE.Mesh(new THREE.CylinderGeometry(.09,.12,6,8),mat(0x252b30));p.position.set(-8,3,z);scene.add(p);const l=new THREE.PointLight(0xd2a66c,14,13);l.position.set(-8,5.4,z);scene.add(l)}
 for(let i=0;i<15;i++){const c=new THREE.Mesh(new THREE.BoxGeometry(1.2,1.2,1.2),mat(0x554432));c.position.set(-5+(i%5)*3,.6,-8+Math.floor(i/5)*4);c.castShadow=true;scene.add(c)}
}
export function makePerson(name,shirt=0x35485b,scale=1){
 const g=new THREE.Group();g.name=name;
 const body=new THREE.Mesh(new THREE.CapsuleGeometry(.4*scale,.8*scale,5,9),mat(shirt));body.position.y=1.05*scale;body.castShadow=true;g.add(body);
 const head=new THREE.Mesh(new THREE.SphereGeometry(.27*scale,16,12),mat(0x98745d));head.position.y=1.88*scale;head.castShadow=true;g.add(head);
 const legs=[];for(const x of [-.19,.19]){const l=new THREE.Mesh(new THREE.CapsuleGeometry(.12*scale,.58*scale,4,7),mat(0x20262b));l.position.set(x,.37*scale,0);g.add(l);legs.push(l)}
 g.userData.legs=legs;return g;
}