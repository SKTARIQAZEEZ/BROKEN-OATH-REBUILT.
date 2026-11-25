export class MissionManager {
 constructor(campaign,{onChange=()=>{},onComplete=()=>{},onFailure=()=>{}}={}){
  this.campaign=campaign;this.onChange=onChange;this.onComplete=onComplete;this.onFailure=onFailure;
  this.chapter=0;this.objective=0;this.status="active";this.flags={};this.evidence=[];this.checkpoint=null;this.unlocked=new Set([0]);this.completed=new Set();
 }
 get current(){return this.campaign[this.chapter]}
 get objectiveData(){return this.current?.objectives[this.objective]??null}
 snapshot(){return {schema:2,chapter:this.chapter,objective:this.objective,status:this.status,flags:{...this.flags},evidence:[...this.evidence],checkpoint:this.checkpoint?{...this.checkpoint}:null,unlocked:[...this.unlocked],completed:[...this.completed]}}
 restore(data){
  if(!data||![1,2].includes(data.schema))return false;
  const chapter=Math.max(0,Math.min(this.campaign.length-1,Number(data.chapter)||0));
  this.chapter=chapter;this.objective=Math.max(0,Math.min(this.campaign[chapter].objectives.length-1,Number(data.objective)||0));
  this.status=data.status==="failed"?"failed":"active";this.flags={...(data.flags||{})};this.evidence=[...(data.evidence||[])];
  this.checkpoint=data.checkpoint?{...data.checkpoint}:null;this.unlocked=new Set([0,...(data.unlocked||[]).filter(n=>Number.isInteger(n)&&n>=0&&n<this.campaign.length)]);
  this.completed=new Set((data.completed||[]).filter(n=>Number.isInteger(n)&&n>=0&&n<this.campaign.length));
  for(let i=0;i<=chapter;i++)this.unlocked.add(i);
  this.onChange(this.snapshot());return true;
 }
 activateChapter(index){if(!this.unlocked.has(index))return false;this.chapter=index;this.objective=0;this.status="active";this.onChange(this.snapshot());return true}
 setCheckpoint(data={}){this.checkpoint={chapter:this.chapter,objective:this.objective,...data};this.onChange(this.snapshot());return this.checkpoint}
 completeObjective(payload={}){
  if(this.status!=="active"||!this.objectiveData)return false;
  const req=this.objectiveData;
  if(req.type==="collect"&&payload.item!==req.target)return false;
  if(req.type==="defeat"&&payload.target!==req.target)return false;
  if(req.type==="interact"&&payload.target!==req.target)return false;
  if(req.type==="reach"&&payload.zone!==req.target)return false;
  if(req.type==="stealth"&&payload.alerted===true)return false;
  if(req.type==="survive"&&payload.elapsed<(req.duration||0))return false;
  if(req.type==="rescue"&&payload.target!==req.target)return false;
  if(req.type==="evidence"&&!this.evidence.includes(req.target))return false;
  this.objective++;
  if(this.objective>=this.current.objectives.length){this.completed.add(this.chapter);this.onComplete(this.chapter,this.current);if(this.chapter<this.campaign.length-1){this.chapter++;this.unlocked.add(this.chapter);this.objective=0;this.status="active"}else{this.objective=this.current.objectives.length-1;this.status="complete"}}
  this.onChange(this.snapshot());return true;
 }
 collectEvidence(id){if(!this.evidence.includes(id))this.evidence.push(id);this.onChange(this.snapshot())}
 setFlag(id,value=true){this.flags[id]=value;this.onChange(this.snapshot())}
 fail(reason="Mission failed"){this.status="failed";this.onFailure(reason,this.checkpoint);this.onChange(this.snapshot())}
 retry(){if(this.checkpoint){this.chapter=this.checkpoint.chapter;this.objective=this.checkpoint.objective}this.status="active";this.onChange(this.snapshot())}
}
