import * as THREE from "three";

const makeMat=(color,roughness=.72,metalness=0)=>new THREE.MeshStandardMaterial({color,roughness,metalness});
function add(parent,geometry,material,position,rotation=null,name="detail"){
 const mesh=new THREE.Mesh(geometry,material);mesh.position.set(...position);if(rotation)mesh.rotation.set(...rotation);mesh.name=name;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;
}

/** Adds authored silhouette, clothing and face details to the procedural base rig. */
export function dressCharacter(root,{name="",role="civilian",scale=1,accent=0x9b805b,skin=0x98745d,hair=0x211b18}={}){
 const s=scale,front=-1;
 const trim=makeMat(accent,.48,.22),dark=makeMat(0x171a1d,.84),leather=makeMat(0x30251f,.78),skinMat=makeMat(skin,.82),hairMat=makeMat(hair,.92),metal=makeMat(0x77736b,.32,.72);
 const eyeWhite=makeMat(0xb9b1a3,.55),iris=makeMat(0x33251c,.4),stitch=makeMat(0x9a8a72,.9);
 // Eyes, irises and eyelids are separate readable forms rather than painted dots.
 const head=root.children.find(o=>o.type==="Group"&&o.position.y>1.7*s);
 if(head){
  for(const x of [-.095,.095]){
   add(head,new THREE.SphereGeometry(.043*s,12,10),eyeWhite,[x*s,.205*s,-.235*s],null,"eye-sclera");
   add(head,new THREE.SphereGeometry(.021*s,10,8),iris,[x*s,.205*s,-.273*s],null,"eye-iris");
   add(head,new THREE.SphereGeometry(.009*s,8,8),dark,[x*s,.205*s,-.29*s],null,"eye-pupil");
   add(head,new THREE.TorusGeometry(.046*s,.008*s,6,12,Math.PI),skinMat,[x*s,.205*s,-.245*s],[0,0,Math.PI],"eyelid");
  }
  // Hair cap receives a rear mass and swept locks to define the profile.
  add(head,new THREE.SphereGeometry(.255*s,16,12),hairMat,[0,.19*s,.07*s],null,"rear-hair");
  for(let i=0;i<5;i++)add(head,new THREE.CapsuleGeometry(.025*s,.19*s,4,6),hairMat,[(i-2)*.085*s,.31*s,-.025*s],[0,0,(i-2)*-.12],"hair-strand");
  if(role==="civilian"&&name==="Ananya"){
   add(head,new THREE.SphereGeometry(.13*s,12,10),hairMat,[0,.08*s,.27*s],null,"hair-bun");
   add(head,new THREE.BoxGeometry(.09*s,.3*s,.07*s),trim,[.24*s,.04*s,.02*s],[0,0,-.12],"hair-ornament");
  }
 }
 // Layered collar, shoulder seams, chest panels and fasteners.
 add(root,new THREE.TorusGeometry(.19*s,.035*s,8,20),trim,[0,1.58*s,0],[Math.PI/2,0,0],"collar-piping");
 for(const x of [-1,1]){
  add(root,new THREE.SphereGeometry(.17*s,12,10),role==="gang"||role==="soldier"?dark:trim,[x*.43*s,1.43*s,0],null,"shoulder-pad");
  add(root,new THREE.BoxGeometry(.035*s,.48*s,.035*s),stitch,[x*.31*s,1.18*s,-.355*s],[0,0,x*.08],"seam-stitch");
  // Hands have knuckles and fingers, making held-object silhouettes possible.
  const hand=add(root,new THREE.SphereGeometry(.095*s,10,8),skinMat,[x*.46*s,.96*s,-.015*s],null,"hand-detail");
  for(let f=0;f<4;f++)add(hand,new THREE.CapsuleGeometry(.012*s,.075*s,3,5),skinMat,[(f-1.5)*.032*s,-.055*s,-.025*s],null,"finger");
  add(root,new THREE.BoxGeometry(.25*s,.12*s,.42*s),dark,[x*.17*s,.12*s,-.13*s],[0,0,0],"boot-sole");
  add(root,new THREE.BoxGeometry(.2*s,.17*s,.3*s),leather,[x*.17*s,.19*s,-.1*s],null,"boot-upper");
  for(let lace=0;lace<3;lace++)add(root,new THREE.BoxGeometry(.12*s,.012*s,.018*s),stitch,[x*.17*s,.22*s+lace*.035*s,-.25*s],null,"boot-lace");
 }
 // Cross-body strap and central clasp add visual separation to combat silhouettes.
 if(role==="hero"||role==="gang"||role==="soldier"||role==="leader"){
  add(root,new THREE.BoxGeometry(.13*s,1.12*s,.045*s),leather,[-.2*s,1.16*s,-.37*s],[0,0,-.27],"chest-strap");
  add(root,new THREE.BoxGeometry(.16*s,.11*s,.055*s),metal,[-.2*s,1.13*s,-.405*s],[0,0,-.27],"strap-buckle");
  add(root,new THREE.BoxGeometry(.56*s,.44*s,.07*s),role==="leader"?leather:dark,[0,1.18*s,-.36*s],null,"chest-panel");
  for(const x of [-.2,.2])for(const y of [1.02,1.28])add(root,new THREE.SphereGeometry(.025*s,8,8),metal,[x*s,y*s,-.405*s],null,"panel-rivet");
 }
 if(role==="leader"){
  add(root,new THREE.BoxGeometry(.16*s,.65*s,.07*s),trim,[.31*s,1.2*s,-.24*s],[0,0,-.12],"leader-insignia");
  add(root,new THREE.BoxGeometry(.68*s,.18*s,.12*s),dark,[0,.54*s,.03*s],null,"coat-hem");
 }
 if(name==="Anjali"||name==="Ananya"){
  add(root,new THREE.CapsuleGeometry(.22*s,.52*s,4,8),trim,[.34*s,1.16*s,-.05*s],[0,0,-.2],"shawl-fold");
  for(let i=0;i<5;i++)add(root,new THREE.BoxGeometry(.018*s,.42*s,.02*s),stitch,[.18*s+i*.07*s,1.12*s,-.34*s],null,"shawl-stitch");
 }
 return {materials:[trim,dark,leather,skinMat,hairMat,metal,eyeWhite,iris,stitch]};
}
