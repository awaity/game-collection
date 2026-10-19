import {AudioClip,AudioSource,Node,resources} from 'cc';
import type {Fx,Phase} from './core';
import type {Profile} from './profile';

export class BattleAudio {
 readonly ready:Promise<void>;
 private effects:AudioSource;
 private music:AudioSource;
 private clips=new Map<string,AudioClip>();
 private unlocked=false;
 private shotClock=0;
 constructor(node:Node){
  this.effects=node.addComponent(AudioSource);this.music=node.addComponent(AudioSource);this.music.loop=true;
  this.ready=new Promise((resolve,reject)=>resources.loadDir('audio',AudioClip,(error,clips)=>{
   if(error){reject(error);return;}for(const clip of clips)this.clips.set(clip.name,clip);this.music.clip=this.clips.get('music')??null;resolve();
  }));
 }
 activate(){this.unlocked=true;}
 pause(){this.music.pause();this.effects.stop();}
 update(events:Fx[],phase:Phase,settings:Profile['settings'],delta:number){
  this.shotClock=Math.max(0,this.shotClock-delta);this.music.volume=.26*settings.volume;
  const music=this.unlocked&&settings.music&&settings.volume>0&&phase!=='paused';
  if(music&&!this.music.playing)this.music.play();else if(!music&&this.music.playing)this.music.pause();
  if(!this.unlocked||!settings.sound||!settings.volume)return;
  const names=new Set<string>();
  for(const event of events){
   if(event.type==='shot'&&event.skill==='rifle'&&this.shotClock<=0){names.add('shot');this.shotClock=.12;}
   if(event.type==='burst')names.add(event.skill==='frost'?'ice':event.skill==='fuel'?'':event.skill==='electro'?'electric':'blast');
   if(event.type==='beam'||event.type==='chain')names.add('electric');
   if(['level','win','lose','wall','reload'].includes(event.type))names.add(event.type);
  }
  for(const name of [...names].filter(Boolean).slice(-4)){const clip=this.clips.get(name);if(clip)this.effects.playOneShot(clip,(name==='shot'?.2:.44)*settings.volume);}
 }
 destroy(){this.pause();this.clips.clear();}
}
