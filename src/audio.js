export class AudioDirector {
 constructor(){this.context=null;this.master=null;this.enabled=true;this.ambienceNodes=[];this.lastStep=0}
 async start(){if(!this.enabled)return;const Ctx=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Ctx)return;this.context??=new Ctx();if(this.context.state==="suspended")await this.context.resume();if(!this.master){this.master=this.context.createGain();this.master.gain.value=.18;this.master.connect(this.context.destination)}}
 tone({frequency=180,duration=.12,type="sine",gain=.08,pan=0}={}){if(!this.context||!this.master||!this.enabled)return;const osc=this.context.createOscillator(),amp=this.context.createGain(),panner=this.context.createStereoPanner();osc.type=type;osc.frequency.value=frequency;amp.gain.setValueAtTime(gain,this.context.currentTime);amp.gain.exponentialRampToValueAtTime(.001,this.context.currentTime+duration);panner.pan.value=pan;osc.connect(amp);amp.connect(panner);panner.connect(this.master);osc.start();osc.stop(this.context.currentTime+duration)}
 setEnabled(value){this.enabled=!!value;if(this.master)this.master.gain.value=this.enabled?.18:0}
 playUI(){this.tone({frequency:520,duration:.06,type:"triangle",gain:.035})}
 playHit(){this.tone({frequency:95,duration:.1,type:"sawtooth",gain:.055})}
 playFootstep(){this.tone({frequency:68+Math.random()*20,duration:.055,type:"triangle",gain:.018})}
 startAmbience(kind="industrial"){if(!this.context||!this.master||this.ambienceNodes.length)return;const base=kind==="outdoor"?55:kind==="interior"?42:48;for(let i=0;i<2;i++){const osc=this.context.createOscillator(),gain=this.context.createGain(),filter=this.context.createBiquadFilter();osc.type="sawtooth";osc.frequency.value=base*(i?1.51:1);filter.type="lowpass";filter.frequency.value=kind==="industrial"?180:110;gain.gain.value=.012;osc.connect(filter);filter.connect(gain);gain.connect(this.master);osc.start();this.ambienceNodes.push(osc,gain,filter)}}
 stopAmbience(){for(const n of this.ambienceNodes){try{if(n.stop)n.stop()}catch{}}this.ambienceNodes=[]}
}
