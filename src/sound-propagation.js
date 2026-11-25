/**
 * Lightweight gameplay sound field. Emits gameplay stimuli (not audio playback)
 * so guards can investigate footsteps, impacts and deliberate distractions.
 */
export class SoundPropagationSystem {
  constructor({defaultRadius=8,decay=1,obstacleAttenuation=.45,maxEvents=32}={}) {
    this.defaultRadius=defaultRadius;this.decay=decay;this.obstacleAttenuation=obstacleAttenuation;
    this.maxEvents=maxEvents;this.events=[];this.sequence=0;
  }
  emit({position,radius=this.defaultRadius,intensity=1,type="noise",source=null,ttl=4}={}) {
    if(!position||![position.x,position.y,position.z].every(Number.isFinite))throw new TypeError("Sound position must be a finite 3D point");
    if(!(radius>0)||!(intensity>0)||!(ttl>0))throw new RangeError("Sound radius, intensity and ttl must be positive");
    const event={id:++this.sequence,position:{x:position.x,y:position.y,z:position.z},radius,intensity,type,source,remaining:ttl};
    this.events.push(event);if(this.events.length>this.maxEvents)this.events.shift();return event.id;
  }
  update(dt){this.events=this.events.filter(e=>(e.remaining-=Math.max(0,dt))>0)}
  hear(listener,{hearingRange=this.defaultRadius,obstacleTest=()=>false}={}) {
    const heard=[];
    for(const event of this.events){
      if(event.source===listener)continue;
      const dx=listener.position.x-event.position.x,dy=listener.position.y-event.position.y,dz=listener.position.z-event.position.z;
      const distance=Math.hypot(dx,dy,dz),blocked=obstacleTest(listener,event);
      const effective=event.radius*(blocked?this.obstacleAttenuation:1)*event.intensity;
      if(distance<=Math.min(hearingRange,effective))heard.push({...event,distance,blocked,stimulus:Math.max(0,1-distance/Math.max(effective,.001))});
    }
    return heard.sort((a,b)=>b.stimulus-a.stimulus);
  }
  clear(){this.events.length=0}
}

/** Reusable world prop that creates a non-lethal investigation stimulus. */
export class DistractionObject {
  constructor({id,position,radius=12,type="impact",cooldown=5,intensity=1}={}) {
    if(!id)throw new TypeError("Distraction object requires an id");
    this.id=id;this.position={...position};this.radius=radius;this.type=type;this.cooldown=cooldown;this.intensity=intensity;this.remaining=0;
  }
  activate(soundSystem,source=null) {
    if(this.remaining>0)return false;
    soundSystem.emit({position:this.position,radius:this.radius,intensity:this.intensity,type:this.type,source});
    this.remaining=this.cooldown;return true;
  }
  update(dt){this.remaining=Math.max(0,this.remaining-Math.max(0,dt))}
}
