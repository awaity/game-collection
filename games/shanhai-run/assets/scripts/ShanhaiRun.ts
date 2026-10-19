import {_decorator,Component,KeyCode,Input,AudioClip,AudioSource,resources} from 'cc';
import {GameView} from 'db://assets/collection/runtime';
import {DT,AREAS,type Action,type Mode} from './core';
import {ShanhaiArt} from './art';
import {Journey} from './profile';
import {Session} from './session';
import {ShanhaiUI} from './hud';
const {ccclass}=_decorator;

@ccclass('ShanhaiRun')
export class ShanhaiRun extends Component {
  private ui!:GameView;
  private art!:ShanhaiArt;
  private hud!:ShanhaiUI;
  private session!:Session;
  private ready=false;
  private accumulator=0;
  private pointer:{x:number;y:number;id:number}|null=null;
  private held=new Set<number>();
  private idle=0;
  private noticeUntil=0;
  private audio!:AudioSource;
  private music!:AudioSource;
  private clips=new Map<string,AudioClip>();
  async start(){
    this.ui=new GameView('shanhai-run.save.v1','#bddbd5');
    this.session=new Session(new Journey(this.ui.platform.load(null),value=>this.ui.platform.save(value)));
    this.hud=new ShanhaiUI(this.ui,{start:(mode,trial)=>this.begin(mode,trial),action:a=>this.action(a),pause:()=>this.pause(),resume:()=>{this.session.resume();this.resetInput();},home:()=>{this.session.home();this.hud.close();this.resetInput();},rescue:()=>{this.session.rescue();this.resetInput();}});
    this.audio=this.node.addComponent(AudioSource);this.music=this.node.addComponent(AudioSource);this.music.loop=true;this.music.volume=.18;
    resources.loadDir('audio',AudioClip,(error,clips)=>{if(!error){for(const clip of clips)this.clips.set(clip.name,clip);this.music.clip=this.clips.get('music')??null;}});
    await this.ui.ready;this.art=await ShanhaiArt.create(this.ui);this.ready=true;
    this.ui.onHide=()=>{this.pause();this.held.clear();this.music.pause();this.audio.stop();};
    this.ui.onKey=(event,down)=>{
      if(!down){this.held.delete(event.keyCode);return;}if(this.held.has(event.keyCode))return;this.held.add(event.keyCode);
      const actions:Record<number,Action>={[KeyCode.ARROW_LEFT]:'left',[KeyCode.KEY_A]:'left',[KeyCode.ARROW_RIGHT]:'right',[KeyCode.KEY_D]:'right',[KeyCode.ARROW_UP]:'jump',[KeyCode.KEY_W]:'jump',[KeyCode.SPACE]:'jump',[KeyCode.ARROW_DOWN]:'slide',[KeyCode.KEY_S]:'slide',[KeyCode.KEY_F]:'wind'};
      if(actions[event.keyCode])this.action(actions[event.keyCode]);
      if(event.keyCode===KeyCode.ESCAPE||event.keyCode===KeyCode.KEY_P){if(this.hud.panel)this.hud.close();else if(this.session.run.phase==='paused'){this.session.resume();this.resetInput();}else this.pause();}
      if(event.keyCode===KeyCode.KEY_R&&!this.hud.panel&&this.session.run.phase!=='ready')this.begin(this.session.run.mode,this.session.run.trial);
    };
    this.ui.onTouch=(event,phase)=>{
      if(event.getType()===Input.EventType.TOUCH_CANCEL){this.pointer=null;return;}
      if(this.hud.panel||this.session.run.phase!=='running'){this.pointer=null;return;}
      const p=event.getUILocation();
      if(phase==='start'){
        const over=Array.from(this.ui.buttons.values()).some(b=>b.node.active&&Math.abs(p.x-this.ui.width/2-b.node.position.x)<b.width/2&&Math.abs(p.y-this.ui.height/2-b.node.position.y)<b.height/2);
        this.pointer=over?null:{x:p.x,y:p.y,id:event.getID()??0};
      }else if(this.pointer&&this.pointer.id===(event.getID()??0)){
        const dx=p.x-this.pointer.x,dy=p.y-this.pointer.y;
        if(Math.max(Math.abs(dx),Math.abs(dy))>=26){this.action(Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy>0?'jump':'slide');this.pointer=null;}
        if(phase==='end')this.pointer=null;
      }
    };
    const qa=globalThis as unknown as {__COLLECTION_TEST__?:boolean;__collectionAdvance?:(count:number)=>void;__shanhai?:unknown};
    if(qa.__COLLECTION_TEST__){
      qa.__collectionAdvance=count=>{for(let n=0;n<Math.min(200000,count);n++)this.session.step();this.update(0);};
      qa.__shanhai={input:(a:Action)=>this.action(a),play:(frames:number)=>{this.session.play(frames);this.update(0);return this.session.run.snapshot();},state:()=>this.session.run.snapshot()};
    }
  }
  private resetInput(){this.accumulator=0;this.pointer=null;}
  private action(a:Action){if(!this.hud.panel)this.session.input(a);}
  private pause(){this.session.pause();this.resetInput();}
  private begin(mode:Mode,trial=0){if(this.session.begin(mode,trial)){this.hud.close();this.hud.notice='';this.resetInput();}}
  update(delta:number){
    if(!this.ready)return;
    this.accumulator+=Math.min(.1,delta);while(this.accumulator>=DT){this.session.step();this.accumulator-=DT;}
    this.idle+=Math.min(.1,delta);
    const ui=this.ui,s=this.session.run,j=this.session.journey,settings=j.data.settings;
    const active=s.phase==='running'&&!this.session.waiting;
    if(active&&settings.music&&this.music.clip){if(!this.music.playing)this.music.play();}else this.music.pause();
    const sound=new Set<string>();
    for(const event of s.drainEvents()){
      sound.add(event.type);
      if(event.type==='area'){this.hud.notice=`步入${AREAS[s.area].name} · 灵玉 +100`;this.noticeUntil=this.idle+3;}
      if(event.type==='power'){this.hud.notice=({magnet:'引玉铃 · 灵玉自动靠近',shield:'玄龟符 · 抵挡一次碰撞',wind:'乘风翎 · 御风穿障',scroll:'寻回一片山海图',blocked:'玄龟符护住了你'} as Record<string,string>)[String(event.value)]??'';this.noticeUntil=this.idle+2.5;}
    }
    if(settings.sound)for(const type of sound){const clip=this.clips.get(type);if(clip)this.audio.playOneShot(clip,type==='jade'?.20:.55);}
    if(this.idle>this.noticeUntil)this.hud.notice='';
    this.hud.trainingHint=this.session.hint;
    ui.begin();this.art.draw(s,j.skin,delta,this.idle,settings.quality,!settings.motion||ui.services.reducedMotion);this.hud.draw(s,j);
    const phase=s.phase==='ready'?'menu':s.phase==='paused'?'paused':['dead','won'].includes(s.phase)?'result':'playing';
    ui.platform.state(phase);
    ui.end({slug:'shanhai-run',...s.snapshot(),phase,runPhase:s.phase,mode:s.mode,trial:s.trial,panel:this.hud.panel,lesson:this.session.lesson,waiting:this.session.waiting,coins:j.data.coins,skin:j.data.skin,unlocked:j.data.unlocked,stars:j.data.stars,lore:j.data.lore,settings:j.data.settings,upgrades:j.data.upgrades,tutorial:j.data.tutorial,revived:s.revived,profileSerial:j.data.serial,renderObjects:ui.objects.size,geometry:this.art.metrics()});
  }
  onDestroy(){this.session?.save();this.audio?.stop();this.music?.stop();this.art?.destroy();this.ui?.destroy();}
}
