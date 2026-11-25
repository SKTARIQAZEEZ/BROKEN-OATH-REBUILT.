export function resolveCircleAgainstAABBs(position,colliders,radius=.38){
 let x=position.x,z=position.z;
 for(const box of colliders){
  const minX=box.x-box.halfX-radius,maxX=box.x+box.halfX+radius,minZ=box.z-box.halfZ-radius,maxZ=box.z+box.halfZ+radius;
  if(x>minX&&x<maxX&&z>minZ&&z<maxZ){
   const dx=Math.min(x-minX,maxX-x),dz=Math.min(z-minZ,maxZ-z);
   if(dx<dz)x=(x-box.x)<0?minX:maxX;else z=(z-box.z)<0?minZ:maxZ;
  }
 }
 position.x=x;position.z=z;return position;
}

export function lineBlockedByAABBs(start,end,colliders){
 const dx=end.x-start.x,dz=end.z-start.z;
 for(const box of colliders){
  let tMin=0,tMax=1;
  for(const [origin,delta,min,max] of [
   [start.x,dx,box.x-box.halfX,box.x+box.halfX],
   [start.z,dz,box.z-box.halfZ,box.z+box.halfZ]
  ]){
   if(Math.abs(delta)<1e-9){if(origin<min||origin>max){tMin=2;break}}
   else{
    let a=(min-origin)/delta,b=(max-origin)/delta;if(a>b)[a,b]=[b,a];
    tMin=Math.max(tMin,a);tMax=Math.min(tMax,b);
    if(tMin>tMax)break;
   }
  }
  if(tMin<=tMax&&tMax>0.04&&tMin<.96)return true;
 }
 return false;
}
