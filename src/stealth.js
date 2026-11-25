export class StealthSystem {
  constructor({visionRange=10,hearingRange=5,fieldOfView=Math.PI*.62,searchDuration=7,alarmThreshold=3}={}) {
    this.visionRange=visionRange;this.hearingRange=hearingRange;this.fieldOfView=fieldOfView;
    this.searchDuration=searchDuration;this.alarmThreshold=alarmThreshold;this.states=new WeakMap();
    this.alarmLevel=0;this.alarmActive=false;
  }
  stateFor(guard) {
    let state=this.states.get(guard);
    if(!state){state={state:"patrol",lastKnown:null,searchRemaining:0,alertTime:0,alarmRaised:false};this.states.set(guard,state)}
    return state;
  }
  evaluate(guard,player,{crouched=false,moving=false,noise=0,dt=0,obstacleTest=()=>false}={}) {
    const data=this.stateFor(guard),delta=player.position.clone().sub(guard.position),distance=delta.length();
    const forward=new player.position.constructor(0,0,1).applyQuaternion(guard.quaternion);
    const angle=distance>1e-6?forward.angleTo(delta.clone().normalize()):0;
    const visible=distance<=this.visionRange*(crouched?.62:1)&&angle<=this.fieldOfView/2&&!obstacleTest(guard,player);
    const heard=(moving||noise>0)&&distance<=this.hearingRange+noise;
    if(visible){
      data.state="combat";data.lastKnown=player.position.clone();data.searchRemaining=this.searchDuration;
      data.alertTime+=dt;
      if(!data.alarmRaised&&data.alertTime>=this.alarmThreshold){data.alarmRaised=true;this.alarmLevel++;this.alarmActive=true}
    } else if(heard){
      data.state="investigate";data.lastKnown=player.position.clone();data.searchRemaining=this.searchDuration;
    } else if(data.state==="combat"||data.state==="investigate"){
      data.state="search";data.searchRemaining=this.searchDuration;
    } else if(data.state==="search"){
      data.searchRemaining=Math.max(0,data.searchRemaining-dt);
      if(data.searchRemaining===0){data.state="patrol";data.alertTime=0;data.alarmRaised=false}
    }
    return {state:data.state,distance,visible,heard,lastKnown:data.lastKnown,searchRemaining:data.searchRemaining,alarmLevel:this.alarmLevel,alarmActive:this.alarmActive};
  }
  getState(guard){return this.stateFor(guard).state}
  getLastKnownPosition(guard){return this.stateFor(guard).lastKnown?.clone()||null}
  resetGuard(guard){this.states.delete(guard)}
  resetAlarm(){this.alarmLevel=0;this.alarmActive=false}
  getSnapshot(){return {alarmLevel:this.alarmLevel,alarmActive:this.alarmActive}}
}
