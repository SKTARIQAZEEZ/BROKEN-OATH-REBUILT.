export class AudioDirector {
  constructor(){this.context=null;this.master=null;this.enabled=true}
  async start(){if(!this.enabled)return;const Ctx=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Ctx)return;this.context??=new Ctx();if(this.context.state==="suspended")await this.context.resume();if(!this.master){this.master=this.context.createGain();this.master.gain.value=.18;this.master.connect(this.context.destination)}}
  tone({frequency=180,duration=.12,type="sine",gain=.08}={}){if(!this.context||!this.master||!this.enabled)return;const osc=this.context.createOscillator(),amp=this.context.createGain();osc.type=type;osc.frequency.value=frequency;amp.gain.setValueAtTime(gain,this.context.currentTime);amp.gain.exponentialRampToValueAtTime(.001,this.context.currentTime+duration);osc.connect(amp);amp.connect(this.master);osc.start();osc.stop(this.context.currentTime+duration)}
  setEnabled(value){this.enabled=!!value;if(this.master)this.master.gain.value=this.enabled?.18:0}
  playUI(){this.tone({frequency:520,duration:.06,type:"triangle",gain:.035})}
  playHit(){this.tone({frequency:95,duration:.1,type:"sawtooth",gain:.055})}
}
