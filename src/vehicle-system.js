import * as THREE from "three";

const VEHICLE_CHAPTERS=new Set([0,2,3,4,5,6,7,9,11,12,13,14]);
const VEHICLE_COLORS=[0x20262b,0x34383a,0x3b332d,0x29343b];

function makeVehicle(scene,color=VEHICLE_COLORS[0]){
 const root=new THREE.Group();root.name="BROKEN_OATH_DRIVABLE_VEHICLE";
 const paint=new THREE.MeshStandardMaterial({color,roughness:.38,metalness:.62});
 const dark=new THREE.MeshStandardMaterial({color:0x111519,roughness:.82});
 const glass=new THREE.MeshStandardMaterial({color:0x172a34,roughness:.2,metalness:.25});
 const chrome=new THREE.MeshStandardMaterial({color:0x747b7c,roughness:.3,metalness:.8});
 const body=new THREE.Mesh(new THREE.BoxGeometry(2,0.72,3.8),paint);body.position.y=.82;body.castShadow=true;body.receiveShadow=true;root.add(body);
 const hood=new THREE.Mesh(new THREE.BoxGeometry(1.9,.28,1.05),paint);hood.position.set(0,1.24,-1.22);hood.castShadow=true;root.add(hood);
 const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.72,.85,1.9),paint);cabin.position.set(0,1.55,.18);cabin.castShadow=true;root.add(cabin);
 const windshield=new THREE.Mesh(new THREE.BoxGeometry(1.52,.62,.045),glass);windshield.position.set(0,1.59,-.79);windshield.rotation.x=-.18;root.add(windshield);
 const rearGlass=new THREE.Mesh(new THREE.BoxGeometry(1.5,.55,.045),glass);rearGlass.position.set(0,1.6,1.12);rearGlass.rotation.x=.18;root.add(rearGlass);
 for(const x of [-.89,.89])for(const z of [-.45,.72]){
  const window=new THREE.Mesh(new THREE.BoxGeometry(.035,.58,.78),glass);window.position.set(x,1.58,z);root.add(window);
 }
 const wheels=[];
 for(const x of [-1.02,1.02])for(const z of [-1.25,1.25]){
  const wheel=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.24,16),dark);wheel.rotation.z=Math.PI/2;wheel.position.set(x,.48,z);wheel.castShadow=true;root.add(wheel);wheels.push(wheel);
  const hub=new THREE.Mesh(new THREE.CylinderGeometry(.17,.17,.25,12),chrome);hub.rotation.z=Math.PI/2;hub.position.copy(wheel.position);root.add(hub);
 }
 for(const x of [-.68,.68]){
  const headlight=new THREE.Mesh(new THREE.BoxGeometry(.42,.18,.08),new THREE.MeshStandardMaterial({color:0xd8d1b5,emissive:0x8b7954,emissiveIntensity:.45}));headlight.position.set(x,1.02,-1.94);root.add(headlight);
  const rear=new THREE.Mesh(new THREE.BoxGeometry(.4,.18,.08),new THREE.MeshStandardMaterial({color:0x6d201a,emissive:0x3b0805,emissiveIntensity:.3}));rear.position.set(x,1.02,1.94);root.add(rear);
 }
 const bumper=new THREE.Mesh(new THREE.BoxGeometry(2.08,.2,.16),chrome);bumper.position.set(0,.62,-1.96);root.add(bumper);
 root.userData.wheels=wheels;root.userData.speed=0;root.userData.paint=paint;scene.add(root);return root;
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
  const old=this.vehicle.position.clone();
  this.vehicle.position.x+=Math.sin(this.yaw)*this.speed*dt;
  this.vehicle.position.z-=Math.cos(this.yaw)*this.speed*dt;
  this.vehicle.position.x=THREE.MathUtils.clamp(this.vehicle.position.x,-26,26);
  this.vehicle.position.z=THREE.MathUtils.clamp(this.vehicle.position.z,-26,26);
  const probe={x:this.vehicle.position.x,z:this.vehicle.position.z};
  for(const c of this.environment.colliders){
   if(c===this.collider)continue;
   const minX=c.x-c.halfX-1.05,maxX=c.x+c.halfX+1.05,minZ=c.z-c.halfZ-1.95,maxZ=c.z+c.halfZ+1.95;
   if(probe.x>minX&&probe.x<maxX&&probe.z>minZ&&probe.z<maxZ){this.vehicle.position.copy(old);this.speed=0;this.onMessage("VEHICLE COLLISION");break}
  }
  if(this.collider){this.collider.x=this.vehicle.position.x;this.collider.z=this.vehicle.position.z;}
  this.vehicle.rotation.y=this.yaw;for(const wheel of this.vehicle.userData.wheels)wheel.rotation.x-=this.speed*dt*1.8;
  this.vehicle.userData.speed=this.speed;if(player)player.position.copy(this.vehicle.position);
 }
 dispose(){this.exit(false);if(this.vehicle)this.scene.remove(this.vehicle);this.vehicle=null;}
}
