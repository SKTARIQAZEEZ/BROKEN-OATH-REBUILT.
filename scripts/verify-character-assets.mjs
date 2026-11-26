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
 const fd=fs.openSync(file,"r");
 try{
  const header=Buffer.alloc(12),read=fs.readSync(fd,header,0,12,0);
  if(read!==12||header.toString("ascii",0,4)!=="glTF"||header.readUInt32LE(8)!==fs.statSync(file).size)invalid.push(relative);
 }finally{fs.closeSync(fd)}
}
if(missing.length||invalid.length){
 console.error("BROKEN OATH asset verification failed.");
 if(missing.length)console.error("Missing files:\n"+missing.map(x=>" - "+x).join("\n"));
 if(invalid.length)console.error("Invalid GLB files:\n"+invalid.map(x=>" - "+x).join("\n"));
 process.exitCode=1;
}else console.log("Asset verification passed: 8 cast + 12 gang + 19 NPC GLBs (39 total).");
