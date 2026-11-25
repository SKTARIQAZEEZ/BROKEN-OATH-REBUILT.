export class StealthSystem {
  constructor({visionRange=10,hearingRange=5,fieldOfView=Math.PI*.62}={}) {
    this.visionRange=visionRange;this.hearingRange=hearingRange;this.fieldOfView=fieldOfView;
    this.states=new WeakMap();
  }
  evaluate(guard,player,{crouched=false,moving=false,obstacleTest=()=>false}={}) {
    const delta=player.position.clone().sub(guard.position);const distance=delta.length();
    const forward=new (player.position.constructor)(0,0,1).applyQuaternion(guard.quaternion);
    const angle=forward.angleTo(delta.clone().normalize());
    const visible=distance<=this.visionRange*(crouched?.62:1)&&angle<=this.fieldOfView/2&&!obstacleTest(guard,player);
    const heard=moving&&!crouched&&distance<=this.hearingRange;
    const previous=this.states.get(guard)||"patrol";
    const next=visible?"combat":heard?"investigate":previous==="combat"||previous==="investigate"?"search":"patrol";
    this.states.set(guard,next);
    return {state:next,distance,visible,heard};
  }
  getState(guard){return this.states.get(guard)||"patrol"}
}
