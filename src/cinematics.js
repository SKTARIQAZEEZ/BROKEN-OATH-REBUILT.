export class CinematicDirector {
  constructor({onCaption=()=>{},onLetterbox=()=>{}}={}){this.onCaption=onCaption;this.onLetterbox=onLetterbox;this.queue=[];this.active=null;this.elapsed=0}
  play(sequence){this.queue.push(...sequence);this.onLetterbox(true);if(!this.active)this.next()}
  next(){this.active=this.queue.shift()||null;this.elapsed=0;if(this.active)this.onCaption(this.active.caption||"",this.active.speaker||"")}
  update(dt){if(!this.active)return;this.elapsed+=dt;if(this.elapsed>=Math.max(.1,this.active.duration||2)){this.next()}if(!this.active)this.onLetterbox(false)}
  skip(){this.queue=[];this.active=null;this.elapsed=0;this.onCaption("","");this.onLetterbox(false)}
  get playing(){return !!this.active}
}
