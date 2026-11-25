import * as THREE from "three";

const VEHICLE_CHAPTERS=new Set([0,2,3,4,5,6,7,9,11,12,13,14]);
const VEHICLE_COLORS=[0x20262b,0x34383a,0x3b332d,0x29343b];

function makeVehicle(scene,color=VEHICLE_COLORS[0]){
 const root=new THREE.Group();root.name="BROKEN_OATH_DRIVABLE_VEHICLE";
 const paint=new THREE.MeshStandardMaterial({color,roughness:.38,metalness:.62});
 const dark=new THREE.MeshStandardMaterial({color:0x111519,roughness:.82});
 const rubber=new THREE.MeshStandardMaterial({color:0x090b0d,roughness:.96});
 const glass=new THREE.MeshStandardMaterial({color:0x172a34,roughness:.2,metalness:.25});
 const chrome=new THREE.MeshStandardMaterial({color:0x747b7c,roughness:.3,metalness:.8});
 const trim=new THREE.MeshStandardMaterial({color:0x252a2d,roughness:.55,metalness:.5});
 const lamp=new THREE.MeshStandardMaterial({color:0xd8d1b5,emissive:0x8b7954,emissiveIntensity:.45});
 const tailLamp=new THREE.MeshStandardMaterial({color:0x6d201a,emissive:0x3b0805,emissiveIntensity:.3});
 const reverseLamp=new THREE.MeshStandardMaterial({color:0xd7d3c5,emissive:0x7b786e,emissiveIntensity:.08});
 const add=(name,geometry,material,x,y,z,rx=0,ry=0,rz=0)=>{const mesh=new THREE.Mesh(geometry,material);mesh.name=name;mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,rz);mesh.castShadow=true;mesh.receiveShadow=true;root.add(mesh);return mesh};
 // Main body, bonnet and raised passenger cell.
 const body=add("vehicle-body",new THREE.BoxGeometry(2,.72,3.8),paint,0,.82,0);
 add("bonnet",new THREE.BoxGeometry(1.9,.28,1.05),paint,0,1.24,-1.22);
 add("roof",new THREE.BoxGeometry(1.72,.12,1.82),paint,0,2.02,.18);
 add("cabin",new THREE.BoxGeometry(1.72,.72,1.9),paint,0,1.58,.18);
 // Glazing, pillars and window seals make the cabin read as a vehicle rather than a solid box.
 add("front-windshield",new THREE.BoxGeometry(1.52,.62,.045),glass,0,1.59,-.79,-.18);
 add("rear-windshield",new THREE.BoxGeometry(1.5,.55,.045),glass,0,1.6,1.12,.18);
 for(const x of [-.89,.89]){
  for(const z of [-.45,.72])add("side-window",new THREE.BoxGeometry(.035,.58,.78),glass,x,1.58,z);
  for(const z of [-.78,.25,1.08])add("window-pillar",new THREE.BoxGeometry(.065,.78,.075),trim,x,1.58,z);
  add("door-skin",new THREE.BoxGeometry(.055,.48,1.42),paint,x,.91,.2);
  add("door-handle",new THREE.BoxGeometry(.045,.055,.2),chrome,x*1.035,1.08,.22);
  add("side-mirror-stem",new THREE.BoxGeometry(.22,.045,.06),trim,x*1.02,1.72,-.66,0,0,x*.12);
  add("side-mirror",new THREE.BoxGeometry(.13,.16,.22),dark,x*1.12,1.76,-.68);
  add("side-sill",new THREE.BoxGeometry(.12,.13,2.3),trim,x,.48,0);
 }
 // Wheels have rubber sidewalls, metal hubs and a visible arch surround.
 const wheels=[];
 for(const x of [-1.02,1.02])for(const z of [-1.25,1.25]){
  const wheel=add("rubber-wheel",new THREE.CylinderGeometry(.43,.43,.24,20),rubber,x,.48,z,0,0,Math.PI/2);wheels.push(wheel);
  add("wheel-hub",new THREE.CylinderGeometry(.19,.19,.255,16),chrome,x,.48,z,0,0,Math.PI/2);
  add("hub-center",new THREE.CylinderGeometry(.075,.075,.265,12),dark,x,.48,z,0,0,Math.PI/2);
  add("wheel-arch-trim",new THREE.TorusGeometry(.47,.045,8,24),trim,x*1.015,.48,z,0,Math.PI/2,0);
  add("brake-disc",new THREE.CylinderGeometry(.28,.28,.025,16),chrome,x*.89,.48,z,0,0,Math.PI/2);
 }
 // Front fascia: grille, bumper, registration plate and paired headlights.
 add("front-grille",new THREE.BoxGeometry(.72,.24,.055),dark,0,.91,-1.94);
 for(let i=0;i<5;i++)add("grille-slat",new THREE.BoxGeometry(.62,.018,.065),chrome,0,.82+i*.045,-1.98);
 for(const x of [-.68,.68]){
  add("headlight",new THREE.BoxGeometry(.42,.18,.08),lamp,x,1.02,-1.94);
  add("rear-light",new THREE.BoxGeometry(.4,.18,.08),tailLamp,x,1.02,1.94);
  add("reverse-light",new THREE.BoxGeometry(.16,.09,.05),reverseLamp,x*.52,.82,1.99);
  add("front-fog-lamp",new THREE.CylinderGeometry(.07,.07,.035,12),lamp,x,.72,-1.99,Math.PI/2);
  add("rear-reflector",new THREE.BoxGeometry(.18,.07,.045),tailLamp,x,.82,1.98);
 }
 add("front-bumper",new THREE.BoxGeometry(2.08,.2,.16),chrome,0,.62,-1.96);
 add("rear-bumper",new THREE.BoxGeometry(2.08,.2,.16),chrome,0,.62,1.96);
 add("front-number-plate",new THREE.BoxGeometry(.48,.12,.025),dark,0,.68,-2.045);
 add("rear-number-plate",new THREE.BoxGeometry(.48,.12,.025),dark,0,.68,2.045);
 // Bonnet creases, roof antenna, rear exhaust and discreet roof rails.
 for(const x of [-.58,.58])add("bonnet-crease",new THREE.BoxGeometry(.035,.018,.78),trim,x,1.39,-1.2);
 add("roof-antenna",new THREE.CylinderGeometry(.012,.018,.42,6),dark,.48,2.28,.72,0,0,-.12);
 for(const x of [-.72,.72])add("roof-rail",new THREE.BoxGeometry(.055,.055,1.35),chrome,x,2.12,.2);
 add("exhaust-tip",new THREE.CylinderGeometry(.065,.065,.18,10),chrome,.58,.35,1.92,Math.PI/2);
 root.userData.wheels=wheels;root.userData.speed=0;root.userData.paint=paint;root.userData.brakeMaterial=tailLamp;root.userData.reverseLights=root.children.filter(o=>o.name==="reverse-light");root.userData.reverseLights.forEach(light=>light.visible=false);
 scene.add(root);return root;
}

/** Arcade-realistic, collision-aware vehicle handling shared by the campaign chapters. */
export class VehicleSystem{
 constructor({scene,onMessage=()=>{}}={}){this.scene=scene;this.onMessage=onMessage;this.vehicle=null;this.environment=null;this.collider=null;this.driving=false;this.speed=0;this.yaw=0;this.chapter=-1;}
 loadChapter(chapter,environment){
  const oldEnvironment=this.environment,oldCollider=this.collider;this.exit(false,this.playerRef);if(oldEnvironment&&oldCollider)oldEnvironment.colliders=oldEnvironment.colliders.filter(c=>c!==oldCollider);if(this.vehicle){this.scene.remove(this.vehicle);this.vehicle.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})}
  this.vehicle=null;this.environment=environment;this.chapter=chapter;this.collider=null;this.speed=0;
  if(!VEHICLE_CHAPTERS.has(chapter))return null;
  const car=makeVehicle(this.scene,VEHICLE_COLORS[chapter%VEHICLE_COLORS.length]);
  const candidates=[];for(let x=-24;x<=24;x+=4)for(let z=-24;z<=24;z+=4)candidates.push({x,z});
  const preferred={x:20,z:13};candidates.sort((a,b)=>(a.x-preferred.x)**2+(a.z-preferred.z)**2-((b.x-preferred.x)**2+(b.z-preferred.z)**2));
  const clear=p=>Math.abs(p.x)<=25&&Math.abs(p.z)<=25&&environment.colliders.every(c=>Math.abs(p.x-c.x)>=c.halfX+1.25||Math.abs(p.z-c.z)>=c.halfZ+2.15);
  const spawn=candidates.find(clear)||{x:23,z:23};car.position.set(spawn.x,0,spawn.z);car.rotation.y=0;this.vehicle=car;this.yaw=0;
  this.collider={x:spawn.x,z:spawn.z,halfX:1.05,halfZ:2.0,height:1.8};environment.colliders.push(this.collider);
  return car;
 }
 get position(){return this.vehicle?.position||null;}
 get cameraYaw(){return this.yaw;}
 toggle(player){
  if(!this.vehicle)return {ok:false,reason:"no-vehicle"};
  if(this.driving){this.exit(true,player);return {ok:true,driving:false}}
  if(player.position.distanceTo(this.vehicle.position)>4.2)return {ok:false,reason:"too-far"};
  this.driving=true;this.playerRef=player;this.speed=0;player.visible=false;this.onMessage("VEHICLE ENTERED · WASD TO DRIVE · V TO EXIT");return {ok:true,driving:true};
 }
 exit(showMessage=true,player=this.playerRef){
  if(!this.driving)return false;
  this.driving=false;this.speed=0;
  if(this.collider&&this.vehicle){this.collider.x=this.vehicle.position.x;this.collider.z=this.vehicle.position.z;}
  if(player&&this.vehicle){
   const offsets=[new THREE.Vector3(2.5,0,0),new THREE.Vector3(-2.5,0,0),new THREE.Vector3(0,0,3),new THREE.Vector3(0,0,-3)];
   let found=null;
   for(const off of offsets){const p=this.vehicle.position.clone().add(off);const resolved=p.clone();for(const c of this.environment.colliders){const minX=c.x-c.halfX+.0,maxX=c.x+c.halfX+.0,minZ=c.z-c.halfZ+.0,maxZ=c.z+c.halfZ+.0;if(resolved.x>minX&&resolved.x<maxX&&resolved.z>minZ&&resolved.z<maxZ){resolved.x=this.vehicle.position.x+off.x;resolved.z=this.vehicle.position.z+off.z;}}
    if(this.environment.colliders.every(c=>Math.abs(resolved.x-c.x)>=c.halfX+.5||Math.abs(resolved.z-c.z)>=c.halfZ+.5)){found=resolved;break}
   }
   player.position.copy(found||this.vehicle.position.clone().add(new THREE.Vector3(2.8,0,0)));player.visible=true;this.playerRef=null;
  }
  if(showMessage)this.onMessage("VEHICLE EXITED");return true;
 }
 brake(strength=.25){if(this.driving)this.speed*=Math.pow(.012,Math.max(.05,strength));}
 update(dt,input={},player=null){
  if(!this.driving||!this.vehicle)return;
  if(input.brake)this.brake(dt);
  const throttle=(input.forward?1:0)-(input.backward?1:0),steer=(input.right?1:0)-(input.left?1:0);
  if(throttle&&!input.brake)this.speed+=throttle*(throttle>0?13:9)*dt;else if(!input.brake)this.speed*=Math.pow(.18,dt);
  this.speed=THREE.MathUtils.clamp(this.speed,-7,17);
  if(Math.abs(this.speed)<.08)this.speed=0;
  const steerScale=Math.min(1,Math.abs(this.speed)/3);
  this.yaw+=steer*steerScale*Math.sign(this.speed||1)*1.55*dt;
  const travel=this.speed*dt,steps=Math.max(1,Math.ceil(Math.abs(travel)/.4)),stepTravel=travel/steps;
  let collided=false;
  // Sub-step movement prevents fast vehicles tunnelling through thin walls, crates or barriers.
  for(let step=0;step<steps;step++){
   const old=this.vehicle.position.clone();
   this.vehicle.position.x+=Math.sin(this.yaw)*stepTravel;
   this.vehicle.position.z-=Math.cos(this.yaw)*stepTravel;
   this.vehicle.position.x=THREE.MathUtils.clamp(this.vehicle.position.x,-26,26);
   this.vehicle.position.z=THREE.MathUtils.clamp(this.vehicle.position.z,-26,26);
   const probe={x:this.vehicle.position.x,z:this.vehicle.position.z};
   for(const c of this.environment.colliders){
    if(c===this.collider)continue;
    const minX=c.x-c.halfX-1.05,maxX=c.x+c.halfX+1.05,minZ=c.z-c.halfZ-1.95,maxZ=c.z+c.halfZ+1.95;
    if(probe.x>minX&&probe.x<maxX&&probe.z>minZ&&probe.z<maxZ){this.vehicle.position.copy(old);this.speed=0;collided=true;break}
   }
   if(collided)break;
  }
  if(collided)this.onMessage("VEHICLE COLLISION");
  if(this.collider){this.collider.x=this.vehicle.position.x;this.collider.z=this.vehicle.position.z;}
  this.vehicle.rotation.y=this.yaw;for(const wheel of this.vehicle.userData.wheels)wheel.rotation.x-=this.speed*dt*1.8;
  this.vehicle.userData.speed=this.speed;this.vehicle.userData.brakeMaterial.emissiveIntensity=input.brake?2.1:.3;for(const light of this.vehicle.userData.reverseLights)light.visible=this.speed<-.15;if(player)player.position.copy(this.vehicle.position);
 }
 dispose(){this.exit(false);if(this.environment&&this.collider)this.environment.colliders=this.environment.colliders.filter(c=>c!==this.collider);if(this.vehicle){this.scene.remove(this.vehicle);this.vehicle.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}})}this.vehicle=null;this.collider=null;this.environment=null;}
}
