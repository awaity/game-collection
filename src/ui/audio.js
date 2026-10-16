/** Self-contained synthesized effects/music. Audio starts only after a user gesture. */
export class AudioEngine{
 constructor(){this.enabled=true;this.ctx=null;this.lastShot=0;this.note=0;this.nextBeat=0;}
 unlock(){if(!this.ctx){this.ctx=new (window.AudioContext||window.webkitAudioContext)();this.master=this.ctx.createGain();this.master.gain.value=.32;this.master.connect(this.ctx.destination);const len=this.ctx.sampleRate*.16;this.noise=this.ctx.createBuffer(1,len,this.ctx.sampleRate);const data=this.noise.getChannelData(0);let s=21;for(let i=0;i<data.length;i++){s=(Math.imul(s,1664525)+1013904223)>>>0;data[i]=(s/4294967296)*2-1;}}if(this.ctx.state==='suspended')this.ctx.resume().catch(()=>{});}
 toggle(){this.enabled=!this.enabled;if(this.master)this.master.gain.setTargetAtTime(this.enabled?.32:0,this.ctx.currentTime,.025);return this.enabled;}
 tone(freq,duration=.1,type='sine',gain=.15,delay=0,end=freq){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime+delay,o=this.ctx.createOscillator(),g=this.ctx.createGain();o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(end,20),t+duration);g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+duration);o.connect(g);g.connect(this.master);o.start(t);o.stop(t+duration+.02);}
 hiss(gain=.07,frequency=1300){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime,s=this.ctx.createBufferSource(),f=this.ctx.createBiquadFilter(),g=this.ctx.createGain();s.buffer=this.noise;f.type='bandpass';f.frequency.value=frequency;f.Q.value=.8;g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.0001,t+.095);s.connect(f);f.connect(g);g.connect(this.master);s.start(t);s.stop(t+.11);}
 event(e){if(!this.ctx||!this.enabled)return;const t=this.ctx.currentTime;
  if(e.type==='shot'&&t-this.lastShot>.075){this.lastShot=t;this.tone(e.tier>0?480:760,.06,'triangle',.035,0,170);this.hiss(.045,3200);}
  if(e.type==='recruit'||e.type==='upgrade'||e.type==='pod-open'){[0,4,7,12].forEach((n,i)=>this.tone(392*2**(n/12),.22,'sine',.12,i*.075));}
  if(e.type==='loss'){this.tone(160,.16,'sawtooth',.055,0,60);}
  if(e.type==='strike'||e.type==='boss-kill'){this.tone(80,.45,'sine',.4,0,27);this.hiss(.4,500);}
  if(e.type==='victory'){[0,4,7,12,16].forEach((n,i)=>this.tone(392*2**(n/12),.4,'triangle',.15,i*.14));}
  if(e.type==='defeat'){[320,250,180].forEach((f,i)=>this.tone(f,.4,'triangle',.16,i*.2));}
 }
 music(active){if(!this.ctx||!this.enabled||!active){this.nextBeat=0;return;}const t=this.ctx.currentTime;if(t<this.nextBeat)return;this.nextBeat=t+.30;const scale=[0,0,7,0,3,3,10,7,5,5,12,7,3,7,10,7],n=scale[this.note%16];this.tone(98*2**(n/12),.24,'triangle',.09);if(this.note%4===0)this.tone(90,.14,'sine',.12,0,36);if(this.note%2)this.hiss(.02,6200);if(this.note%4===2)this.tone(392*2**(n/12),.16,'sine',.035);this.note++;}
}
