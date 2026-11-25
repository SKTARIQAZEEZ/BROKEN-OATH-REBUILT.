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
