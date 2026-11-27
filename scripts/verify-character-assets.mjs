import fs from "node:fs";
import path from "node:path";

const root=path.resolve(process.argv[2]||process.cwd());
const characters=["Azeez","Ranvir","Ananya","Anjali","Devraj","Child_Azeez","Child_Ranvir","Child_Ananya"].map(n=>`public/assets/characters/${n}.glb`);
const gang=Array.from({length:12},(_,i)=>`public/assets/characters/Gang_Members/random_${101+i}.glb`);
const npcs=[
 "Civilian_Elderly_Man","Civilian_Elderly_Woman","Civilian_Man","Civilian_Woman",
 "Civilian_Young_Man","Civilian_Young_Woman","Guard_Armed","Guard_Female","Guard_Male",
 "Guard_Supervisor","MiniBoss_District_Captain","MiniBoss_Gang_Lieutenant",
 "MiniBoss_Protection_Collector","MiniBoss_Street_Scout","MiniBoss_Territory_Commander",
 "Worker_Construction","Worker_Mechanic","Worker_Shopkeeper","Worker_Warehouse"
].map(n=>`public/assets/npcs/${n}.glb`);
const required=[...characters,...gang,...npcs];
const missing=[],invalid=[];
for(const relative of required){
 const file=path.join(root,relative);
 if(!fs.existsSync(file)){missing.push(relative);continue}
 const size=fs.statSync(file).size;
 const fd=fs.openSync(file,"r");
 try{
  const header=Buffer.alloc(20),read=fs.readSync(fd,header,0,20,0);
  const jsonLength=read===20?header.readUInt32LE(12):0;
  const jsonType=read===20?header.readUInt32LE(16):0;
  // Reject Git LFS pointer/stub files as well as malformed or truncated GLBs.
  if(size<10_000||read!==20||header.toString("ascii",0,4)!=="glTF"||
     header.readUInt32LE(4)!==2||header.readUInt32LE(8)!==size||
     jsonType!==0x4E4F534A||jsonLength<2||jsonLength>size-20)invalid.push(relative);
 }finally{fs.closeSync(fd)}
}
if(missing.length||invalid.length){
 console.error("BROKEN OATH asset verification failed.");
 if(missing.length)console.error("Missing files:\n"+missing.map(x=>" - "+x).join("\n"));
 if(invalid.length)console.error("Invalid, truncated, or placeholder GLB files (minimum 10 KB, GLB v2 JSON header required):\n"+invalid.map(x=>" - "+x).join("\n"));
 process.exitCode=1;
}else console.log("Asset verification passed: 8 cast + 12 gang + 19 NPC GLBs (39 total; binary GLB v2 headers verified).");
