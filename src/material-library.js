import * as THREE from "three";
const SIZE=96;
const PALETTES={
 concrete:[.58,.57,.53],asphalt:[.25,.27,.27],metal:[.38,.4,.4],wood:[.35,.27,.19],burnt:[.18,.16,.14],fabric:[.3,.32,.34],stone:[.42,.4,.36]
};
function hash(x,y,seed){let n=(x*374761393+y*668265263+seed*1442695041)|0;n=(n^(n>>>13))*1274126177;return ((n^(n>>>16))>>>0)/4294967295}
export function createSurfaceMaterial(kind="concrete",{color=null,roughness=.86,metalness=0,seed=1}={}){
 const base=color===null?(PALETTES[kind]||PALETTES.concrete):[(color>>16&255)/255,(color>>8&255)/255,(color&255)/255];
 const data=new Uint8Array(SIZE*SIZE*4),bump=new Uint8Array(SIZE*SIZE*4);
 for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
  const i=(y*SIZE+x)*4,n=hash(x,y,seed),grain=hash(x>>2,y>>2,seed+19)-.5,noise=(n-.5)*.16+grain*.11;
  let pattern=0;
  if(kind==="wood")pattern=Math.sin(y*.32+grain*5)*.08;
  if(kind==="metal")pattern=Math.sin(x*.72)*.025;
  if(kind==="asphalt")pattern=(n>.94?.13:0);
  if(kind==="burnt")pattern=(n>.965?.2:-.025);
  for(let k=0;k<3;k++)data[i+k]=Math.max(0,Math.min(255,Math.round((base[k]+noise+pattern)*255)));
  data[i+3]=255;const h=Math.max(0,Math.min(255,Math.round((n*.55+grain*.3+.3)*255)));
  bump[i]=bump[i+1]=bump[i+2]=h;bump[i+3]=255;
 }
 const map=new THREE.DataTexture(data,SIZE,SIZE,THREE.RGBAFormat);map.wrapS=map.wrapT=THREE.RepeatWrapping;map.repeat.set(3,3);map.colorSpace=THREE.SRGBColorSpace;map.needsUpdate=true;
 const bumpMap=new THREE.DataTexture(bump,SIZE,SIZE,THREE.RGBAFormat);bumpMap.wrapS=bumpMap.wrapT=THREE.RepeatWrapping;bumpMap.repeat.set(3,3);bumpMap.needsUpdate=true;
 const mat=new THREE.MeshStandardMaterial({color:0xffffff,map,bumpMap,bumpScale:kind==="metal"?.025:.055,roughness,metalness});mat.userData.proceduralSurface=kind;return mat;
}
