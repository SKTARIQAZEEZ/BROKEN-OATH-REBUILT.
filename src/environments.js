import * as THREE from "three";
import {GLTFLoader} from "three/addons/loaders/GLTFLoader.js";
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
function addLamp(group,x,z,colliders=[]){const pole=mesh(new THREE.CylinderGeometry(.07,.1,4,8),material(0x34383b),x,2,z,group,"street-lamp");colliders.push({x,z,halfX:.16,halfZ:.16,height:4});const lamp=new THREE.PointLight(0xd0a16b,5,12);lamp.position.set(x,4,z);group.add(lamp);return pole}
export function buildChapterEnvironment(scene,index){
 const [name,floorColor,accent,kind]=CHAPTER_ZONES[index]||CHAPTER_ZONES[0],group=new THREE.Group();
 group.name="CHAPTER_ENV_"+String(index+1).padStart(2,"0")+"_"+name;
 const floor=mesh(new THREE.PlaneGeometry(58,58),createSurfaceMaterial("asphalt",{color:floorColor,seed:index+1}),0,-.02,0,group,"walkable-ground");floor.rotation.x=-Math.PI/2;
 const wallMat=createSurfaceMaterial(kind==="ruins"?"burnt":"concrete",{color:accent,seed:index+11}),dark=createSurfaceMaterial("metal",{color:0x171d22,seed:index+31}),windowMat=material(0x182a35,.35),trim=material(0x77716a);
 const colliders=[],landmarks=[];let environmentDisposed=false;
 const addRoadNetwork=()=>{
  const asphalt=material(0x24292b,.94),lane=material(0xb7b3a4,.82),walk=material(0x555756,.95);
  const road=(x,z,w,d,label)=>mesh(new THREE.BoxGeometry(w,.07,d),asphalt,x,.035,z,group,label);
  const marking=(x,z,w,d)=>mesh(new THREE.BoxGeometry(w,.018,d),lane,x,.079,z,group,"road-lane-marking");
  road(0,16,56,7,"drivable-main-road");road(23,0,7,50,"drivable-connector-road");
  for(let x=-26;x<27;x+=6)marking(x,16,2.8,.10);
  for(let z=-24;z<25;z+=6)marking(23,z,.10,2.8);
  for(const z of [12.45,19.55])road(0,z,56,.16,"road-shoulder");
  for(const x of [19.45,26.55])road(x,0,.16,50,"road-shoulder");
  for(const z of [12.1,19.9])for(let x=-27;x<=27;x+=3)marking(x,z,.8,.055);
  for(const x of [19.1,26.9])for(let z=-24;z<=24;z+=3)marking(x,z,.055,.8);
  mesh(new THREE.BoxGeometry(56,.09,1.4),walk,0,.045,21.2,group,"roadside-sidewalk");
  mesh(new THREE.BoxGeometry(1.4,.09,50),walk,27.2,.045,0,group,"roadside-sidewalk");
 };
 const addBuilding=(x,z,w,h,d,label="building")=>{const b=mesh(new THREE.BoxGeometry(w,h,d),wallMat,x,h/2,z,group,label);colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});for(let yy=2.5;yy<h-1;yy+=3)for(let xx=-w/2+1.2;xx<w/2-1;xx+=3)mesh(new THREE.BoxGeometry(.9,1.1,.06),windowMat,x+xx,yy,z-d/2-.04,group,"window");return b};
 const addCover=(x,z,w=2.4,h=1.15,d=.8,label="cover")=>{const o=mesh(new THREE.BoxGeometry(w,h,d),dark,x,h/2,z,group,label);colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});return o};
 if(!["rooftop","interior","ceremony"].includes(kind))addRoadNetwork();
 if(kind==="sports"){
  // Load the supplied authored GLB assets; retain the procedural pitch and ball fallback if remote loading fails.
  const sportsLoader=new GLTFLoader();
  sportsLoader.load("https://tevy.dev/models/football-pitch/v1/lod0.glb",gltf=>{
   if(environmentDisposed){gltf.scene.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});return;}
   const model=gltf.scene;model.name="authored-football-pitch-glb";
   const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
   const fit=Math.min(30/Math.max(size.x,.001),20/Math.max(size.z,.001));
   model.scale.setScalar(fit);model.position.set(-center.x*fit,.16-center.y*fit,-4-center.z*fit);group.add(model);
  },undefined,()=>{});
  sportsLoader.load("https://tevy.dev/models/football/v1/lod0.glb",gltf=>{
   if(environmentDisposed){gltf.scene.traverse(o=>{o.geometry?.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material.dispose()}});return;}
   const ball=gltf.scene;ball.name="authored-football-glb";
   const bounds=new THREE.Box3().setFromObject(ball),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());
   const diameter=Math.max(size.x,size.y,size.z),fit=.44/Math.max(diameter,.001);
   ball.scale.setScalar(fit);ball.position.set(-center.x*fit,.22-center.y*fit,-4-center.z*fit);group.add(ball);
  },undefined,()=>{});
  // Full school football ground: maintained turf, pitch markings, goal frames and net grids.
  const turf=material(0x3e6040,.96),stripe=material(0xb8b7a8,.88),goalMat=material(0xd1d0c8,.48,.18),netMat=new THREE.MeshBasicMaterial({color:0xaaa99d,transparent:true,opacity:.42});
  mesh(new THREE.BoxGeometry(30,.16,20),turf,0,.04,-4,group,"football-pitch");
  for(let i=0;i<6;i++)mesh(new THREE.BoxGeometry(5,.012,19.7),material(i%2?0x466b46:0x3c5d3d,.98),-12.5+i*5,.126,-4,group,"pitch-mowing-stripe");
  const line=(x,z,w,d,label="pitch-line")=>mesh(new THREE.BoxGeometry(w,.025,d),stripe,x,.145,z,group,label);
  line(0,-13,28,.12);line(0,5,28,.12);line(-14,-4,.12,18);line(14,-4,.12,18);line(0,-4,.12,18);
  line(0,-13,10,.12,"penalty-box-line");line(0,-9,10,.12,"penalty-box-line");line(-5,-11,.12,4,"penalty-box-line");line(5,-11,.12,4,"penalty-box-line");
  line(0,5,10,.12,"penalty-box-line");line(0,1,10,.12,"penalty-box-line");line(-5,3,.12,4,"penalty-box-line");line(5,3,.12,4,"penalty-box-line");
  const circle=new THREE.Mesh(new THREE.TorusGeometry(2.2,.055,8,64),stripe);circle.rotation.x=Math.PI/2;circle.position.set(0,.17,-4);circle.name="centre-circle";group.add(circle);
  mesh(new THREE.CylinderGeometry(.11,.11,.025,16),stripe,0,.17,-4,group,"centre-spot");
  for(const z of [-10.8,2.8])mesh(new THREE.CylinderGeometry(.09,.09,.025,12),stripe,0,.17,z,group,"penalty-spot");
  for(const z of [-13,5]){
   const goalZ=z===-13?-14.15:6.15,backZ=z===-13?-15.2:7.2;
   for(const x of [-2.1,2.1]){mesh(new THREE.CylinderGeometry(.075,.075,2.35,12),goalMat,x,1.18,goalZ,group,"football-goal-post");colliders.push({x,z:goalZ,halfX:.1,halfZ:.1,height:2.35})}
   mesh(new THREE.CylinderGeometry(.075,.075,4.2,12),goalMat,0,2.35,goalZ,group,"football-goal-crossbar").rotation.z=Math.PI/2;
   for(let i=0;i<=8;i++){const x=-2.1+i*.525;mesh(new THREE.CylinderGeometry(.012,.012,2.3,5),netMat,x,1.15,backZ,group,"goal-net-vertical")}
   for(let y=0;y<=4;y++)mesh(new THREE.BoxGeometry(4.2,.012,.012),netMat,0,.12+y*.56,backZ,group,"goal-net-horizontal");
   for(const x of [-2.1,2.1])mesh(new THREE.BoxGeometry(.025,2.3,1.05),netMat,x,1.15,(goalZ+backZ)/2,group,"goal-net-side");
  }
  for(const x of [-15.8,15.8])for(let z=-13;z<=5;z+=3){mesh(new THREE.CylinderGeometry(.045,.055,2.1,8),dark,x,1.05,z,group,"ground-fence-post");colliders.push({x,z,halfX:.07,halfZ:.07,height:2.1})}
  for(const z of [-13,5])for(let x=-15.8;x<=15.8;x+=3){mesh(new THREE.CylinderGeometry(.045,.055,2.1,8),dark,x,1.05,z,group,"ground-fence-post");colliders.push({x,z,halfX:.07,halfZ:.07,height:2.1})}
  for(const x of [-17.2,17.2]){
   for(let tier=0;tier<3;tier++){mesh(new THREE.BoxGeometry(3.2,.35,12),material(tier%2?0x41494a:0x55534b),x,.45+tier*.55,-4,group,"spectator-bleacher");colliders.push({x,z:-4,halfX:1.6,halfZ:6,height:1.1+tier*.55})}
   for(const z of [-10,2])mesh(new THREE.BoxGeometry(3.4,.12,.18),trim,x,.2,z,group,"bleacher-step");
  }
  for(const [x,z] of [[-17,-17],[17,-17],[-17,9],[17,9]]){
   mesh(new THREE.CylinderGeometry(.11,.16,9,10),dark,x,4.5,z,group,"football-floodlight-pole");colliders.push({x,z,halfX:.2,halfZ:.2,height:9});
   const glow=new THREE.SpotLight(0xd5d1b9,18,30,.55,.5,1.2);glow.position.set(x,8.65,z);glow.target.position.set(0,0,-4);group.add(glow,glow.target);
  }
  addBuilding(-20,-22,8,8,7,"school-building");addBuilding(20,-22,8,8,7,"classroom");
  mesh(new THREE.BoxGeometry(4,1.7,.18),dark,0,3.2,-20,group,"school-scoreboard");
  for(const x of [-1.35,1.35])mesh(new THREE.BoxGeometry(1.1,.7,.08),material(0x263b3b),x,3.2,-19.88,group,"scoreboard-display");
 }else if(kind==="ruins"){
  // Burned family home: a traversable, partially collapsed structure rather than
  // a field of generic rubble boxes. The open front and broken roof preserve entry.
  const ash=material(0x242322,.98),charred=material(0x171615,.98),soot=material(0x292321,.98),burntBrick=material(0x40332e,.96),ember=material(0x7d351d,.7),wood=material(0x29201b,.98);
  mesh(new THREE.BoxGeometry(15,.16,11),ash,0,.02,-8,group,"burned-home-foundation");
  mesh(new THREE.BoxGeometry(14,.025,10),material(0x302c29),0,.115,-8,group,"ash-covered-interior-floor");
  const remnant=(x,y,z,w,h,d,label,mat=charred)=>{const o=mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z,group,label);colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});return o};
  // Rear wall and two fractured side walls; leave a broad, accessible front opening.
  remnant(0,2.25,-13.1,14,.45,.42,"burned-rear-wall-top",burntBrick);
  remnant(-6.75,1.35,-8, .5,2.7,10,"burned-west-wall",charred);
  remnant(6.75,1.8,-8,.5,3.6,10,"burned-east-wall-remnant",burntBrick);
  remnant(-3.9,1.15,-3.05,6.2,2.3,.42,"burned-front-wall-left",soot);
  remnant(4.9,.8,-3.05,4.2,1.6,.42,"burned-front-wall-right",charred);
  // Broken window lintels and blackened openings.
  for(const x of [-5.9,5.9]){
   mesh(new THREE.BoxGeometry(1.65,.16,.28),wood,x,2.2,-8.1,group,"charred-window-lintel");
   mesh(new THREE.BoxGeometry(.12,1.35,.18),charred,x-0.78,1.48,-8.08,group,"burned-window-frame");
   mesh(new THREE.BoxGeometry(.12,1.35,.18),charred,x+0.78,1.48,-8.08,group,"burned-window-frame");
  }
  // Collapsed roof: exposed, angled rafters and a fallen roof slab.
  for(let i=0;i<7;i++){
   const beam=mesh(new THREE.BoxGeometry(.22,5.8,.24),wood,-5.2+i*1.72,2.05,-8.2,group,"collapsed-charred-rafter");
   beam.rotation.z=(i%2?1:-1)*(.22+(i%3)*.09);beam.rotation.x=(i%2?1:-1)*.12;
  }
  const slab=mesh(new THREE.BoxGeometry(5.8,.32,3.2),material(0x302a27),1.2,.55,-7.1,group,"fallen-roof-section");
  slab.rotation.z=-.18;slab.rotation.x=.12;
  // Broken masonry, scorched furniture remains and scattered roof tiles.
  for(let i=0;i<22;i++){
   const x=-7.2+(i*7%15),z=-13.2+(i*11%11),w=.45+(i%4)*.28,h=.22+(i%3)*.22,d=.4+(i%3)*.25;
   const rubble=mesh(new THREE.BoxGeometry(w,h,d),i%3?burntBrick:charred,x,h/2,z,group,"burned-masonry-rubble");
   rubble.rotation.y=(i*1.7)%Math.PI;rubble.rotation.z=((i%5)-2)*.08;
   if(i%4===0)colliders.push({x,z,halfX:w/2,halfZ:d/2,height:h});
  }
  for(let i=0;i<9;i++){
   const tile=mesh(new THREE.BoxGeometry(1.1,.12,.62),material(0x292522),-6+(i%5)*2.8,.18,-14+Math.floor(i/5)*9,group,"fallen-roof-tile");
   tile.rotation.y=i*.43;tile.rotation.z=(i%3-1)*.16;
  }
  // Soot staining and extinguished ember pockets; no active fire obscures play.
  for(const [x,z] of [[-6,-12],[5,-12],[-5,-4],[4,-5]]){
   const stain=mesh(new THREE.CircleGeometry(1.2,16),soot,x,.13,z,group,"soot-and-ash-stain");stain.rotation.x=-Math.PI/2;
  }
  for(const [x,z] of [[-4,-10],[3,-6]]){
   const glow=new THREE.PointLight(0x9b3e1d,.65,3);glow.position.set(x,.45,z);group.add(glow);
   mesh(new THREE.SphereGeometry(.07,6,5),ember,x,.22,z,group,"faint-extinguished-ember");
  }
  // Burnt porch posts and a recognizable damaged family-home threshold.
  for(const x of [-2.2,2.2]){
   const post=mesh(new THREE.BoxGeometry(.18,2.2,.18),wood,x,1.1,-2.45,group,"burned-porch-post");
   post.rotation.z=x<0?.08:-.12;colliders.push({x,z:-2.45,halfX:.12,halfZ:.12,height:2.2});
  }
  mesh(new THREE.BoxGeometry(4.8,.18,1.5),material(0x39302b),0,.12,-1.7,group,"damaged-front-porch");
  for(let i=0;i<12;i++){
   const shard=mesh(new THREE.ConeGeometry(.18,.42,5),material(0x211d1a),-8+(i*1.43)%16,.21,-15+(i*2.1)%13,group,"charred-debris-shard");
   shard.rotation.z=Math.PI;
  }
 }else if(kind==="warehouse"||kind==="industrial"||kind==="fortress"||kind==="compound"){
  for(let x=-18;x<=18;x+=9)addBuilding(x,-19,7,kind==="fortress"?13:kind==="compound"?11:9,6,"industrial-structure");
  for(let z=-12;z<=12;z+=8)addCover(-7,z,2.4,2,2,"crate-stack");
  addBuilding(0,-28,42,kind==="fortress"?8:6,2,"rear-perimeter-wall");
  for(let x=-20;x<=20;x+=10)addLamp(group,x,-5,colliders);
 }else if(kind==="rooftop"){
  for(let x=-24;x<=24;x+=8)addBuilding(x,-18,7,8+(Math.abs(x)%3),6,"rooftop-tower");
  mesh(new THREE.BoxGeometry(48,1,1),dark,0,.5,26,group,"parapet");colliders.push({x:0,z:26,halfX:24,halfZ:.5,height:1});
  for(let x=-20;x<=20;x+=10)addCover(x,8,2,1.2,1.2,"rooftop-vent");
 }else if(kind==="ceremony"){
  for(let x=-8;x<=8;x+=4){mesh(new THREE.CylinderGeometry(.13,.13,5,10),material(0x8c795f),x,2.5,-12,group,"ceremony-pillar");colliders.push({x,z:-12,halfX:.16,halfZ:.16,height:5});mesh(new THREE.SphereGeometry(.7,12,10),material(0x9b744f),x,5.3,-12,group,"floral-decoration")}
  mesh(new THREE.BoxGeometry(10,.4,4),material(0x76563e),0,.2,-18,group,"wedding-stage");colliders.push({x:0,z:-18,halfX:5,halfZ:2,height:.4});
 }else{
  if(!["homes","safehouse","street"].includes(kind))for(let x=-22;x<=22;x+=11){addBuilding(x,-21,8,9+(Math.abs(x)%3)*2,7,"street-building");addBuilding(x,21,8,8,7,"street-building")}
  for(let x=-15;x<=15;x+=10){addCover(x,-4,2.5,1.4,1,"street-cover");addLamp(group,x,12,colliders)}
  if(kind==="interior"){for(let z=-15;z<=12;z+=5)for(let x of [-10,10])addCover(x,z,2,2.4,1,"archive-shelf")}
 }
 if(["homes","safehouse","street"].includes(kind)){
  // Recognizable residential facades: pitched roof silhouette, recessed entry, porch and ground-floor windows.
  const houseXs=kind==="street"?[-18,0,18]:[-18,18];
  for(let i=0;i<houseXs.length;i++){
   const x=houseXs[i],z=kind==="street"?-9+(i%2)*18:0;
   const w=7.4,d=6.2,h=5.8,house=new THREE.Group();house.name="residential-house";house.position.set(x,0,z);group.add(house);
   const facadeMat=createSurfaceMaterial("concrete",{color:i%2?0x4b4944:0x5a5147,seed:index*17+i});
   const wall=(wx,wy,wz,ww,wh,wd,label)=>{mesh(new THREE.BoxGeometry(ww,wh,wd),facadeMat,wx,wy,wz,house,label);colliders.push({x:x+wx,z:z+wz,halfX:ww/2,halfZ:wd/2,height:wh})};
   mesh(new THREE.BoxGeometry(w,.16,d),material(0x292b2a),0,.08,0,house,"house-interior-floor");
   // Structural walls leave a real front doorway instead of sealing the interior with a solid box.
   wall(-w/2+.15,h/2,0,.3,h,d,"house-west-wall");wall(w/2-.15,h/2,0,.3,h,d,"house-east-wall");
   wall(0,h/2,-d/2+.15,w,h,.3,"house-rear-wall");
   wall(-2.2,h/2,d/2-.15,3.0,h,.3,"house-front-wall-left");wall(2.2,h/2,d/2-.15,3.0,h,.3,"house-front-wall-right");
   mesh(new THREE.BoxGeometry(1.45,.32,.34),trim,0,2.4,d/2-.12,house,"house-door-lintel");
   const door=new THREE.Group();door.position.set(-.68,0,d/2-.12);door.rotation.y=-.95;house.add(door);
   mesh(new THREE.BoxGeometry(1.28,2.25,.1),material(0x34271f),.64,1.125,0,door,"house-front-door");
   for(const wx of [-2.2,2.2]){
    const win=new THREE.Mesh(new THREE.BoxGeometry(1.25,1.15,.08),windowMat);win.position.set(wx,2.65,d/2+.08);win.name="house-front-window";house.add(win);
    const sill=new THREE.Mesh(new THREE.BoxGeometry(1.45,.1,.18),trim);sill.position.set(wx,2.02,d/2+.08);house.add(sill);
   }
   const roof=new THREE.Mesh(new THREE.ConeGeometry(w*.72,2.25,4),material(i%2?0x282b2d:0x39312d));roof.position.set(0,h+1.05,0);roof.rotation.y=Math.PI/4;roof.castShadow=true;roof.receiveShadow=true;roof.name="pitched-house-roof";house.add(roof);
   const porch=new THREE.Mesh(new THREE.BoxGeometry(3.2,.18,1.35),material(0x4a4239));porch.position.set(0,.18,d/2+.68);porch.name="house-porch";porch.castShadow=true;house.add(porch);
   for(const px of [-1.35,1.35]){const column=new THREE.Mesh(new THREE.BoxGeometry(.14,2.4,.14),trim);column.position.set(px,1.3,d/2+1.15);column.name="porch-column";house.add(column);colliders.push({x:x+px,z:z+d/2+1.15,halfX:.1,halfZ:.1,height:2.4})}
   const step=new THREE.Mesh(new THREE.BoxGeometry(1.8,.22,.55),material(0x4a4945));step.position.set(0,.11,d/2+1.5);step.name="house-entry-step";house.add(step);
   const furniture=(fx,fz,fw,fh,fd,label,color=0x4b4035)=>{mesh(new THREE.BoxGeometry(fw,fh,fd),material(color),fx,fh/2,fz,house,label);colliders.push({x:x+fx,z:z+fz,halfX:fw/2,halfZ:fd/2,height:fh})};
   furniture(-2.25,-1.65,1.55,.95,1.15,"house-sofa",0x51463d);furniture(2.25,-1.65,1.55,1.05,1.15,"house-cabinet",0x4a3a2c);
   furniture(0,-.15,1.55,.72,.9,"house-coffee-table",0x594633);furniture(-2.2,1.55,1.6,.5,2.0,"house-bed",0x554c45);
   mesh(new THREE.BoxGeometry(2.2,.08,.12),trim,0,2.25,-d/2+.32,house,"interior-wall-shelf");
   const practical=new THREE.PointLight(0xc99b67,2.4,8);practical.position.set(0,2.5,0);house.add(practical);
  }
 }
 // Reusable authored interior rooms add navigable, furnished spaces to the blockout.
 if(["warehouse","interior","fortress","compound","safehouse"].includes(kind)){
  const ix=17,iz=8,iw=10,id=8,wall=.35,roomMat=material(kind==="warehouse"||kind==="fortress"?0x34383a:0x49433c),floorMat=material(0x292d30);
  mesh(new THREE.BoxGeometry(iw,.12,id),floorMat,ix,.04,iz,group,"interior-floor");
  const wallPart=(x,z,w,d,label)=>{mesh(new THREE.BoxGeometry(w,3,d),roomMat,x,1.5,z,group,label);colliders.push({x,z,halfX:w/2,halfZ:d/2,height:3})};
  wallPart(ix-iw/2,iz,wall,id,"interior-west-wall");wallPart(ix+iw/2,iz,wall,id,"interior-east-wall");wallPart(ix,iz-id/2,iw,wall,"interior-rear-wall");
  wallPart(ix-iw*.32,iz+id/2,iw*.36,wall,"interior-front-wall-left");wallPart(ix+iw*.32,iz+id/2,iw*.36,wall,"interior-front-wall-right");
  for(let side=0;side<2;side++){const sx=ix+(side?3.1:-3.1);mesh(new THREE.BoxGeometry(2.4,2.1,.65),material(kind==="interior"?0x555b60:0x51483d),sx,1.05,iz-2.2,group,"interior-storage-shelf");colliders.push({x:sx,z:iz-2.2,halfX:1.2,halfZ:.33,height:2.1});for(let y=.55;y<1.8;y+=.6)mesh(new THREE.BoxGeometry(2.2,.06,.55),trim,sx,y,iz-2.2,group,"shelf-level")}
  mesh(new THREE.BoxGeometry(2.2,.18,1.1),material(0x554333),ix, .85,iz+.2,group,"interior-work-table");colliders.push({x:ix,z:iz+.2,halfX:1.1,halfZ:.55,height:1});
  for(const [dx,dz] of [[-2,2],[2,2]]){mesh(new THREE.BoxGeometry(1,.9,1),material(0x4b4035),ix+dx,.45,iz+dz,group,"interior-crate");colliders.push({x:ix+dx,z:iz+dz,halfX:.5,halfZ:.5,height:.9})}
  const ceiling=mesh(new THREE.BoxGeometry(iw,.18,id),dark,ix,3.05,iz,group,"interior-ceiling");ceiling.visible=false;
  for(const cx of [ix-iw/2,ix+iw/2])for(const cz of [iz-id/2,iz+id/2])colliders.push({x:cx,z:cz,halfX:.18,halfZ:.18,height:3});
  const practical=new THREE.PointLight(0xc99b67,7,15);practical.position.set(ix,2.6,iz);group.add(practical);
 }
 const landmark=mesh(new THREE.BoxGeometry(5,3,1),material(accent),0,1.5,-19,group,"chapter-landmark");colliders.push({x:0,z:-19,halfX:2.5,halfZ:.5,height:3});landmarks.push(landmark);
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
 return {group,name,kind,spawn,objectiveAnchors:anchors,colliders,landmarks,walkableBounds:{minX:-28,maxX:28,minZ:-28,maxZ:28},resolvePosition(position,radius=.42){const p=position.clone();p.x=THREE.MathUtils.clamp(p.x,-28+radius,28-radius);p.z=THREE.MathUtils.clamp(p.z,-28+radius,28-radius);for(const box of colliders){const minX=box.x-box.halfX-radius,maxX=box.x+box.halfX+radius,minZ=box.z-box.halfZ-radius,maxZ=box.z+box.halfZ+radius;if(p.x>minX&&p.x<maxX&&p.z>minZ&&p.z<maxZ){const dx=Math.min(Math.abs(p.x-minX),Math.abs(maxX-p.x)),dz=Math.min(Math.abs(p.z-minZ),Math.abs(maxZ-p.z));if(dx<dz)p.x=p.x<box.x?minX:maxX;else p.z=p.z<box.z?minZ:maxZ}}return p},dispose(){environmentDisposed=true;scene.remove(group);group.traverse(o=>{if(o.geometry)o.geometry.dispose();if(o.material){if(Array.isArray(o.material))o.material.forEach(m=>{m.map?.dispose();m.bumpMap?.dispose();m.dispose()});else{o.material.map?.dispose();o.material.bumpMap?.dispose();o.material.dispose()}}})}};
}
export const CHAPTER_ENVIRONMENT_NAMES=CHAPTER_ZONES.map(x=>x[0]);
export const CHAPTER_ENVIRONMENT_KINDS=CHAPTER_ZONES.map(x=>x[3]);
