export class CinematicDirector {
 constructor({onCaption=()=>{},onLetterbox=()=>{},onShot=()=>{},onSequenceEnd=()=>{}}={}){this.onCaption=onCaption;this.onLetterbox=onLetterbox;this.onShot=onShot;this.onSequenceEnd=onSequenceEnd;this.queue=[];this.active=null;this.elapsed=0;this.sequenceName=null}
 play(sequence,{name="story"}={}){if(!Array.isArray(sequence)||!sequence.length)return false;this.queue.push(...sequence.map((beat)=>({...beat})));this.sequenceName=name;this.onLetterbox(true);if(!this.active)this.next();return true}
 next(){this.active=this.queue.shift()||null;this.elapsed=0;if(this.active){this.onCaption(this.active.caption||"",this.active.speaker||"");this.onShot(this.active.shot||"medium",this.active)}else{this.onCaption("","");this.onLetterbox(false);this.onSequenceEnd(this.sequenceName);this.sequenceName=null}}
 update(dt){if(!this.active)return;this.elapsed+=Math.max(0,dt);if(this.elapsed>=Math.max(.1,this.active.duration||2))this.next()}
 skip(){this.queue=[];this.active=null;this.elapsed=0;this.onCaption("","");this.onLetterbox(false);this.onSequenceEnd(this.sequenceName);this.sequenceName=null}
 get playing(){return !!this.active}
}
