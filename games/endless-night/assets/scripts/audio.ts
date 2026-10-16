import { assetManager, AudioClip, AudioSource, Node } from 'cc';
import type { NightSession } from './session';
/** Original synthesized sounds baked to local clips for all three runtimes. */
export class NightAudio {
 private clips=new Map<string,AudioClip>();private last=new Map<string,number>();private track='';private unlocked=false;
 private effects:AudioSource;private music:AudioSource;
 private constructor(node:Node,private session:NightSession){this.effects=node.addComponent(AudioSource);this.music=node.addComponent(AudioSource);this.music.loop=true}
 static async load(node:Node,session:NightSession){const audio=new NightAudio(node,session);const bundle=await new Promise<any>((resolve,reject)=>assetManager.loadBundle('night-audio',(e,b)=>e?reject(e):resolve(b)));const clips=await new Promise<AudioClip[]>((resolve,reject)=>bundle.loadDir('',AudioClip,(e:Error|null,c:AudioClip[])=>e?reject(e):resolve(c)));for(const clip of clips)audio.clips.set(clip.name,clip);return audio}
 unlock(){this.unlocked=true}
 play(id:string,variant=0){if(!this.unlocked)return;const now=Date.now();if(now-(this.last.get(id)??0)<45)return;this.last.set(id,now);const suffix=id==='gem'?Math.max(0,Math.min(24,Math.round(variant))):['whip','bow','thunder','kill','boom','chest'].includes(id)?Math.abs(Math.round(variant))%2:0;const clip=this.clips.get(id+(suffix?'-'+suffix:''))??this.clips.get(id),settings=this.session.settings;if(clip&&settings.master*settings.sfx>0)this.effects.playOneShot(clip,settings.master*settings.sfx)}
 update(hidden=false){const s=this.session,r=s.run,volume=s.settings.master*s.settings.music;for(const[id,variant]of r.sfx.splice(0))if(!hidden&&s.phase!=='paused')this.play(id,variant);if(hidden||s.phase==='paused'||!this.unlocked||!volume){this.music.pause();this.effects.stop();return}const base=s.phase==='menu'?'menu':s.phase==='result'?s.result?.won?'win':'menu':r.stage.look,intensity=r.bossSpawned?1:r.clock/(r.stage.bossAt*60)*.95,suffix=['menu','win'].includes(base)?0:intensity>.85?10:intensity>.35?6:0,key='music-'+base+(suffix?'-'+suffix:''),clip=this.clips.get(key);if(clip){if(this.track!==key){this.music.stop();this.music.clip=clip;this.track=key}this.music.volume=volume;if(!this.music.playing)this.music.play()}}
 stop(){this.music.stop();this.effects.stop()}
}
