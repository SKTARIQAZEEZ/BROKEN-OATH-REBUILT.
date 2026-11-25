/** Lightweight procedural audio layer. Final recorded assets can replace these cue methods without changing gameplay callers. */
export class AudioDirector {
 constructor(){this.context=null;this.master=null;this.enabled=true;this.ambienceNodes=[];this.ambienceKind=null;this.lastStep=0}
 async start(){if(!this.enabled)return;const Ctx=globalThis.AudioContext||globalThis.webkitAudioContext;if(!Ctx)return;this.context??=new Ctx();if(this.context.state==="suspended")await this.context.resume();if(!this.master){this.master=this.context.createGain();this.master.gain.value=.18;this.master.connect(this.context.destination)}}
 tone({frequency=180,duration=.12,type="sine",gain=.08,pan=0,delay=0}={}){if(!this.context||!this.master||!this.enabled)return;const start=this.context.currentTime+Math.max(0,delay),osc=this.context.createOscillator(),amp=this.context.createGain(),panner=this.context.createStereoPanner();osc.type=type;osc.frequency.setValueAtTime(frequency,start);amp.gain.setValueAtTime(.0001,start);amp.gain.exponentialRampToValueAtTime(Math.max(.0002,gain),start+.012);amp.gain.exponentialRampToValueAtTime(.001,start+duration);panner.pan.value=pan;osc.connect(amp);amp.connect(panner);panner.connect(this.master);osc.start(start);osc.stop(start+duration+.02)}
 setEnabled(value){this.enabled=!!value;if(this.master)this.master.gain.value=this.enabled?.18:0}
 playUI(){this.tone({frequency:520,duration:.06,type:"triangle",gain:.035})}
 playHit(){this.tone({frequency:95,duration:.1,type:"sawtooth",gain:.055});this.tone({frequency:58,duration:.12,type:"triangle",gain:.025,delay:.025})}
 playFootstep(){this.tone({frequency:68+Math.random()*20,duration:.055,type:"triangle",gain:.018})}
 playObjectiveComplete(){this.tone({frequency:440,duration:.13,type:"triangle",gain:.035});this.tone({frequency:660,duration:.18,type:"sine",gain:.03,delay:.11})}
 playFailure(){this.tone({frequency:190,duration:.22,type:"sawtooth",gain:.04});this.tone({frequency:130,duration:.3,type:"triangle",gain:.035,delay:.13})}
 playChapterTransition(){this.tone({frequency:110,duration:.5,type:"sine",gain:.025});this.tone({frequency:165,duration:.55,type:"sine",gain:.018,delay:.16})}
 playBossPhase(){this.tone({frequency:72,duration:.32,type:"sawtooth",gain:.05});this.tone({frequency:146,duration:.25,type:"triangle",gain:.03,delay:.1})}
 playBossDefeat(){this.tone({frequency:220,duration:.35,type:"sine",gain:.04});this.tone({frequency:165,duration:.5,type:"sine",gain:.03,delay:.18});this.tone({frequency:110,duration:.7,type:"sine",gain:.025,delay:.38})}
 startAmbience(kind="industrial"){if(!this.context||!this.master)return;if(this.ambienceNodes.length&&this.ambienceKind===kind)return;if(this.ambienceNodes.length)this.stopAmbience();this.ambienceKind=kind;const base=kind==="outdoor"?55:kind==="interior"?42:kind==="ceremony"?72:48;for(let i=0;i<2;i++){const osc=this.context.createOscillator(),gain=this.context.createGain(),filter=this.context.createBiquadFilter();osc.type=i?"triangle":"sawtooth";osc.frequency.value=base*(i?1.51:1);filter.type="lowpass";filter.frequency.value=kind==="industrial"?180:kind==="ceremony"?420:110;gain.gain.value=kind==="ceremony"?.006:.012;osc.connect(filter);filter.connect(gain);gain.connect(this.master);osc.start();this.ambienceNodes.push(osc,gain,filter)}}
 stopAmbience(){for(const n of this.ambienceNodes){try{if(n.stop)n.stop()}catch{}}this.ambienceNodes=[];this.ambienceKind=null}
 dispose(){this.stopAmbience();if(this.context){this.context.close?.();this.context=null;this.master=null}}
}
