import {_decorator,AudioClip,AudioSource,Color,Component,Graphics,KeyCode,Label,Layers,Node,Rect,Sprite,SpriteFrame,Texture2D,UITransform,Vec3,resources} from 'cc';
import {GameView} from 'db://assets/collection/runtime';
import {CHAPTERS,CONFIG,Game,Save,SurgeEvent,clamp,normalizeSave,recordVictory} from './core';
import {SurgeArt} from './art';
const{ccclass}=_decorator;
@ccclass('SurgeSquad')
export class SurgeSquad extends Component{
 private ui!:GameView;private sim=new Game();private art:SurgeArt|null=null;private accumulator=0;private idle=0;private selected=0;private clean=false;
 private titleShade:SpriteFrame|null=null;private frozen=false;private pauseSettings=false;private save!:Save;private held=new Set<number>();private drag:{x:number;origin:number}|null=null;private toast='';private toastUntil=0;private failure='';
 private audio!:AudioSource;private music!:AudioSource;private clips=new Map<string,AudioClip>();private lastShot=-1;
 private get width(){return this.ui.width<=600?this.ui.width:Math.min(this.ui.width,this.ui.height*.5625,760)}
 async start(){
  this.ui=new GameView('surge-squad.save.v1','#081320');this.save=normalizeSave(this.ui.platform.load({}));this.save.settings.reducedMotion ||= this.ui.services.reducedMotion;
  this.audio=this.node.addComponent(AudioSource);this.music=this.node.addComponent(AudioSource);this.music.loop=true;this.music.volume=.20;
  resources.loadDir('audio',AudioClip,(e,clips)=>{if(!e){for(const c of clips)this.clips.set(c.name,c);this.music.clip=this.clips.get('music')??null}});
  resources.load('title-shade/texture',Texture2D,(e,t)=>{if(!e){this.titleShade=new SpriteFrame();this.titleShade.texture=t}});
  this.ui.onHide=()=>this.pause();
  this.ui.onKey=(e,down)=>{
   if(!down){this.held.delete(e.keyCode);return}this.held.add(e.keyCode);
   if([KeyCode.ESCAPE,KeyCode.KEY_P,KeyCode.SPACE].includes(e.keyCode))this.sim.phase==='paused'?this.resume():this.pause();
   if(e.keyCode===KeyCode.KEY_R&&this.sim.phase!=='ready')this.begin(this.sim.level.index,this.sim.demo);
   if(e.keyCode===KeyCode.KEY_M){this.save.settings.sound=!this.save.settings.sound;this.persist()}
   if(e.keyCode===KeyCode.KEY_H&&this.sim.phase!=='ready')this.clean=!this.clean;
   if([KeyCode.KEY_A,KeyCode.KEY_D,KeyCode.ARROW_LEFT,KeyCode.ARROW_RIGHT].includes(e.keyCode)&&this.sim.phase==='playing')this.sim.demo=false;
  };
  this.ui.onTouch=(e,phase)=>{
   if(phase==='end'){this.drag=null;return}if(this.sim.phase!=='playing')return;const p=e.getUILocation();
   if(phase==='start'&&p.y>150&&p.y<this.ui.height-90&&Math.abs(p.x-this.ui.width/2)<this.width/2){this.drag={x:p.x,origin:this.sim.player.x};this.sim.demo=false}
   if(phase==='move'&&this.drag)this.aim(this.drag.origin+(p.x-this.drag.x)/this.width*CONFIG.roadWidth*1.27);
  };
  const host=globalThis as unknown as{__COLLECTION_TEST__?:boolean;__collectionAdvance?:(ticks:number)=>void};
  if(host.__COLLECTION_TEST__)host.__collectionAdvance=(ticks:number)=>{if(!Number.isInteger(ticks)||ticks<0||ticks>10800)throw Error('推进步数必须为 0–10800');this.frozen=true;for(let i=0;i<ticks;i++)this.step();this.update(0)};
  try{this.art=await SurgeArt.load(this.ui)}catch(e){this.failure='场景暂时无法启动，请重新载入。';console.error(e)}
 }
 private persist(){if(!this.ui.platform.save(this.save))this.message('本机存储不可用，本次行动仍可继续。',4);this.syncMusic()}
 private message(text:string,duration=1.8){this.toast=text;this.toastUntil=this.sim.time+duration}
 private begin(chapter=this.selected,demo=false){this.art?.feedback.clear();this.frozen=false;this.sim=new Game(chapter);this.sim.demo=demo;this.sim.start();this.selected=chapter;this.accumulator=0;this.idle=0;this.clean=false;this.clearInput();this.lastShot=-1;this.syncMusic();this.events()}
 private home(){this.art?.feedback.clear();this.selected=this.sim.level.index;this.sim=new Game(this.selected);this.clearInput();this.clean=false;this.syncMusic()}
 private clearInput(){this.held.clear();this.drag=null;this.accumulator=0}
 private pause(){this.pauseSettings=false;this.sim.pause();this.clearInput();this.syncMusic()}
 private resume(){this.frozen=false;this.sim.resume();this.clearInput();this.syncMusic()}
 private aim(x:number){this.frozen=false;if(this.sim.phase==='playing'){this.sim.demo=false;this.sim.aim(x)}}
 private syncMusic(){const active=this.sim.phase==='playing'&&this.save.settings.sound&&this.save.settings.music;if(active&&!this.music.playing&&this.music.clip)this.music.play();if(!active)this.music.pause();if(this.sim.phase!=='playing'||!this.save.settings.sound)this.audio.stop()}
 private events(){
  for(const e of this.sim.drainEvents()){
   this.art?.feedback.event(e,this.sim);
   const messages:Record<string,string|undefined>={start:'中央蓝带蓄能，横移自动放电',recruit:`+${e.value} 队员加入`,overcharge:'金色电能 +99 · 超载强化',arena:'巨兽封锁前路 · 躲开致命重击',warning:e.bossType==='titan'?'终局重击 · 立刻离开红色区域':undefined,combo:`${e.value} 连破`,victory:'防线突破',defeat:'重新集结，再来一次','missed-gate':`错过 +${e.value} 补给`};
   if(messages[e.type])this.message(messages[e.type]!,e.type==='start'?4:1.8);
   if(e.type==='victory'&&!this.sim.demo){this.save=recordVictory(this.save,this.sim.level.index,this.sim.stats.score);this.persist()}
   if(this.save.settings.sound){const name=e.type==='overcharge'?'recruit':e.type==='cell'?(e.gold?'gold':'cell'):e.type;const clip=this.clips.get(name);if(clip&&(name!=='shot'||this.sim.time-this.lastShot>.10)){this.audio.playOneShot(clip,.35);if(name==='shot')this.lastShot=this.sim.time;}}
  }
 }
 private step(){const s=this.sim;if(s.phase!=='playing')return;const left=this.held.has(KeyCode.KEY_A)||this.held.has(KeyCode.ARROW_LEFT),right=this.held.has(KeyCode.KEY_D)||this.held.has(KeyCode.ARROW_RIGHT);if(left!==right)this.aim(s.player.targetX+(right?1:-1)*7.4/60);s.step();this.events();this.art?.feedback.update(1/60)}
 update(dt:number){
  if(!this.ui)return;const u=this.ui,s=this.sim;u.begin();
  if(!this.art){u.text('loading',this.failure||'正在接通电源…',0,0,18);u.end({slug:'surge-squad',phase:'loading'});return}
  if(s.phase==='playing'&&!this.frozen){this.accumulator+=Math.min(.08,Math.max(0,dt));while(this.accumulator>=1/60){this.step();this.accumulator-=1/60}this.idle=0}else if(s.phase!=='paused'&&!this.save.settings.reducedMotion)this.idle+=dt;
  this.syncMusic();const w=this.width,ratio=w/u.height,pan=s.player.x*.70;
  u.camera.rect=new Rect((u.width-w)/2/u.width,0,w/u.width,1);u.camera.fov=ratio<.5?2*Math.atan(Math.tan(32*Math.PI/360)*(.50/ratio))*180/Math.PI:32;
  u.camera.node.setPosition(1.5+pan,21.5,26.8);u.camera.node.lookAt(new Vec3(pan*1.03,0,3.1));u.camera.camera.update(true);
  this.art.draw(s,s.time+this.idle,this.save.settings.quality);this.desktop();this.bossLabels();
  if(s.phase==='ready')this.menu();else{
   if(!this.clean)this.hud();else u.button('restore-hud','显示界面',w/2-54,-u.height/2+38,88,()=>this.clean=false);
   if(s.phase==='paused')this.pauseMenu();if(s.phase==='victory'||s.phase==='defeat')this.result();
  }
  u.platform.state(s.phase==='ready'?'menu':s.phase==='victory'||s.phase==='defeat'?'result':s.phase);
  u.end({slug:'surge-squad',phase:s.phase,tick:Math.round(s.time*60),chapter:s.level.index,energy:s.player.energy,troops:s.player.troops,boss:s.level.bosses.map(b=>b.hp),gates:s.level.gates.map(g=>g.state),laser:s.player.laser,kills:s.stats.kills,score:s.stats.score,demo:s.demo,unlocked:this.save.unlocked,sound:this.save.settings.sound,music:this.save.settings.music,quality:this.save.settings.quality,reducedMotion:this.save.settings.reducedMotion,clean:this.clean});
 }
 private desktop(){const u=this.ui;if(u.width<=1050)return;const left=-this.width/2-130,right=this.width/2+125;
  u.text('desktop-mark','S / S',left,u.height*.36,14,'#88b9d0',180);u.text('desktop-title','SURGE\nSQUAD',left,u.height*.22,30,'#8ba9be',180).node.getComponent(UITransform)!.setContentSize(180,100);u.text('desktop-chinese','电涌小队',left,u.height*.12,11,'#5d7e97',180);u.text('desktop-small','CHARGE.\nRECRUIT.\nBREAK THROUGH.',left,u.height*.035,9,'#36576e',180).node.getComponent(UITransform)!.setContentSize(180,60);u.text('desktop-guide','中央蓄能\n两侧突破',right,-u.height*.24,14,'#7192ac',160).node.getComponent(UITransform)!.setContentSize(160,70);u.text('desktop-input','拖动鼠标 / 方向键\n自动射击 · 自动放电',right,-u.height*.33,9,'#385b73',160);
 }
 private bossLabels(){const u=this.ui,s=this.sim;if(this.clean)return;s.level.bosses.forEach((b,i)=>{const gap=b.d-s.distance;if(b.hp<=0||gap>160)return;const p=u.camera.convertToUINode(new Vec3(b.x,2.04*b.size+.24,6-gap*.55),u.canvas);if(Math.abs(p.y)>u.height*.65)return;const scale=clamp(1.2-gap*.0065,.60,1.15),width=(i?82:62)*scale;u.text('boss-hp'+i,String(Math.ceil(b.hp)),p.x,p.y+15*scale,(i?16:14)*scale,'#ffffff',width+20).isBold=true;u.panel('boss-bar'+i,p.x,p.y,width,7*scale,'#13152be6');const fill=width*b.hp/b.maxHp;if(fill>0)u.panel('boss-fill'+i,p.x-(width-fill)/2,p.y,fill,5*scale,'#f5334d')})}
 private button(id:string,label:string,x:number,y:number,width:number,action:()=>void,accent=false,height=46){
  const node=this.ui.button(id,label,x,y,width,action,accent,height),b=this.ui.buttons.get(id)!,g=node.getComponent(Graphics)!;
  const lane=['attack','charge','recruit'].includes(id),chapter=id.startsWith('chapter'),primary=accent&&!lane&&!chapter&&!id.startsWith('quality-'),textOnly=['demo','home','clean','restore-hud'].includes(id);
  const fill=primary?'#55c7f8':textOnly?'#00000000':accent?'#31618355':'#1b2c3b70';
  g.clear();g.fillColor=new Color().fromHEX(fill);g.strokeColor=new Color().fromHEX(primary?'#c7f6ff88':textOnly?'#00000000':accent?'#aff1ff99':'#88a6bd38');g.roundRect(-width/2,-height/2,width,height,Math.min(10,height/2));g.fill();g.stroke();
  b.label.color=new Color().fromHEX(primary?'#063353':chapter&&!accent?'#7f9bb1':'#c4d8e6');b.label.fontSize=primary?15:chapter?10:lane?11:12;b.label.isBold=primary;b.label.lineHeight=20;
  return node;
 }
 private menu(){const u=this.ui,w=this.width,h=u.height/2,small=u.height<650,base=-h+(small?38:84)+u.insets.bottom;
  u.panel('title-shade',0,0,w,u.height,'#00000000');const shade=u.objects.get('panel:title-shade')!;shade.getComponent(Graphics)!.clear();
  if(this.titleShade){let overlay=shade.getChildByName('gradient');if(!overlay){overlay=new Node('gradient');overlay.parent=shade;overlay.layer=Layers.Enum.UI_2D;overlay.addComponent(UITransform);overlay.addComponent(Sprite)}const sprite=overlay.getComponent(Sprite)!;sprite.sizeMode=Sprite.SizeMode.CUSTOM;sprite.spriteFrame=this.titleShade;overlay.getComponent(UITransform)!.setContentSize(w,u.height)}
  u.text('eyebrow','•  O R I G I N A L   3 D   R U N N E R',0,base+(small?265:295),9,'#90b8d3',w-30);
  u.text('title','电涌小队',0,base+(small?222:250),small?35:Math.min(59,u.height*.050),'#f4f7fb',w-24).isBold=true;
  u.text('english','S U R G E   S Q U A D',0,base+(small?187:210),11,'#c1dbed',w-30);
  u.text('tagline','蓄满电能，击穿整条防线。',0,base+(small?155:176),11,'#96aec5',w-30);
  CHAPTERS.forEach((c,i)=>{const unlocked=i<this.save.unlocked;this.button('chapter'+i,`0${i+1} ${unlocked?c.name:'· 锁定'}`,(i-1)*81,base+(small?120:133),75,()=>{if(unlocked){this.selected=i;this.sim=new Game(i)}},i===this.selected,31);this.ui.buttons.get('chapter'+i)!.label.fontSize=9});
  this.button('start','开始行动      →',0,base+73,w*.82,()=>this.begin(this.selected,false),true,52);
  this.button('demo','观看实机演示  ↗',0,base+18,210,()=>this.begin(this.selected,true),false,32);
  u.text('instruction','拖动 / A D 横移　 ·　 自动开火',0,base-15,9,'#557088',w-20);
  u.text('version','OFFLINE READY                              V 1.2.0',0,-h+22+u.insets.bottom,8,'#53748c',w*.83);
 }
 private hud(){const u=this.ui,s=this.sim,p=s.player,w=this.width,h=u.height/2,bottom=-h+u.insets.bottom;
  this.button('sound',this.save.settings.sound?'♪':'∅',w*.44-58,h-35-u.insets.top,34,()=>{this.save.settings.sound=!this.save.settings.sound;this.persist()},false,34);
  this.button('pause','Ⅱ',w*.44-16,h-35-u.insets.top,34,()=>this.pause(),false,34);
  const progress=w*.28;u.panel('progress',w*.30,h-63-u.insets.top,progress,3,'#c4d7f12d');if(s.progress>0)u.panel('progress-fill',w*.16+progress*s.progress/2,h-63-u.insets.top,progress*s.progress,3,'#79d6f6');
  u.text('troops',`${p.troops} 小队`,-w*.31,bottom+152,19,'#ecf7ff',w*.35);u.text('kills',`击破  ${s.stats.kills}`,w*.30,bottom+152,15,'#dfe9f8',w*.40);
  if(s.demo)u.text('demo','实机演示 · 操作即可接管',0,bottom+178,8,'#c9e7f4',w*.80);
  const energy=w*.47;u.text('energy-caption',p.laser?(p.boost>0?'超载放电':'激光放电'):p.charging?'正在充能':p.energy>11.4?'蓄能就绪':'电能储备',-energy*.25,bottom+123,10,'#ecf7ff',energy*.7);u.text('energy-number',`${Math.round(p.energy/12*100)}%`,energy*.4,bottom+123,10,'#9be9ff',energy*.30);
  u.panel('energy-track',0,bottom+105,energy,8,'#081b3999');const fill=energy*p.energy/12;if(fill>0)u.panel('energy-fill',-(energy-fill)/2,bottom+105,fill,6,'#6ce8ff');
  u.text('hint',s.level.gates[1].state==='taken'&&s.level.bosses[0].hp>0&&p.x>1.8?'先击破左侧守关者 · 解锁金色电站':s.time<9?'左右拖动 · 自动射击':p.charging?'充能中 · 横移释放激光':'回到中央补充电能',0,bottom+76,10,'#d7e5f3',w-26);
  [['attack','⌁ 清场',-3.12],['charge','ϟ 充能',0],['recruit','+ 扩编',3.18]].forEach(([id,label,lane],i)=>{this.button(String(id),String(label),(i-1)*w*.26,bottom+37,w*.24,()=>this.aim(Number(lane)),Math.abs(p.x-Number(lane))<1.2,38);u.buttons.get(String(id))!.label.fontSize=11});
  if(this.toast&&s.time<this.toastUntil)u.text('toast',this.toast,0,h-u.height*.34,13,'#fff0bd',w*.85).isBold=true;
  if(s.combo>=60&&s.comboTimer>0)u.text('combo',`${s.combo}\n连破`,w*.35,u.height*.02,24,'#ffda7b',100);
 }
 private pauseMenu(){if(this.ui.height<490){this.compactPause();return}const u=this.ui,w=Math.min(this.width*.84,390),height=Math.min(510,u.height-60-u.insets.top-u.insets.bottom),top=height/2,compact=height<490,step=compact?42:48;
  u.panel('overlay',0,0,this.width,u.height,'#06111dc9');u.panel('pause-card',0,0,w,height,'#102437fa');
  u.text('pause-kicker','TAKE A BREATH',0,top-28,9,'#90b8d3',w-30);u.text('pause-title','电流暂歇',0,top-61,compact?23:29,'#f4f7fb',w-30);u.text('pause-copy','队伍正在等你。',0,top-94,11,'#8faec3',w-30);
  this.button('resume','继续行动 →',0,top-133,w-42,()=>this.resume(),true,40);this.button('retry','重新开始',0,top-133-step,w-42,()=>this.begin(this.sim.level.index,this.sim.demo),false,36);
  const y=top-133-step*2;(['low','medium','high']as const).forEach((q,i)=>{this.button('quality-'+q,['流畅','均衡','精细'][i],(i-1)*(w-42)/3,y,(w-54)/3,()=>{this.save.settings.quality=q;this.persist()},q===this.save.settings.quality,32)});
  this.button('music',`背景音乐：${this.save.settings.music?'开':'关'}`,0,y-step,w-42,()=>{this.save.settings.music=!this.save.settings.music;this.persist()},false,32);
  this.button('motion',`减少震动 / 闪烁：${this.save.settings.reducedMotion?'开':'关'}`,0,y-step*2,w-42,()=>{this.save.settings.reducedMotion=!this.save.settings.reducedMotion;this.persist()},false,32);
  this.button('clean','净画面模式 H',0,y-step*3,w-42,()=>{this.clean=true;this.resume()},false,32);this.button('home','返回主菜单',0,y-step*4,w-42,()=>this.home(),false,32);
 }
 private result(){if(this.ui.height<490){this.compactResult();return}const u=this.ui,s=this.sim,win=s.phase==='victory',w=Math.min(this.width*.84,400),height=Math.min(530,u.height-52),top=height/2,small=height<510;
  u.panel('overlay',0,0,this.width,u.height,'#06111dc9');u.panel('result',0,0,w,height,'#102437fa');u.text('result-kicker',win?'MISSION COMPLETE':'REGROUP & RETURN',0,top-31,8,'#90b8d3',w-30);
  const stars=win?(s.stats.kills>1800&&s.stats.bosses===2?3:s.stats.kills>800?2:1):0;u.text('stars',win?[0,1,2].map(i=>i<stars?'✦':'✧').join(' '):'ϟ',0,top-73,30,win?'#f7cf70':'#fa7782',w-30);
  u.text('result-title',win?'防线已突破':'电涌暂时熄灭',0,top-115,small?23:27,'#f4f7fb',w-26).isBold=true;
  u.text('result-copy',win?(s.level.index===2?'三段防线已全部打通。':'小队已抵达下一座电站。'):'先在中央蓄能，再横移清场与扩编。',0,top-150,11,'#8faec3',w-30);
  u.text('score-caption','本次得分',0,top-184,9,'#688ba6',w-30);u.text('score',String(s.stats.score),0,top-221,small?31:39,'#f4f7fb',w-30).isBold=true;
  [['敌人击破',String(s.stats.kills)],['队员存活',String(s.player.troops)],['行动用时',s.time.toFixed(1)+'s']].forEach(([title,value],i)=>{u.text('metric'+i,value,(i-1)*w*.28,top-274,18,'#d6e6f1',w*.27);u.text('metric-caption'+i,title,(i-1)*w*.28,top-299,8,'#61819c',w*.28)});
  let y=top-345;if(win){this.button('next',s.level.index===2?'重返海堤 ↻':'下一段防线 →',0,y,w-44,()=>this.begin((s.level.index+1)%3,false),true,44);y-=54}
  this.button('retry','再来一次',0,y,w-44,()=>this.begin(s.level.index,s.demo),!win,40);this.button('home','返回主菜单',0,y-48,w-44,()=>this.home(),false,34);
 }
 private compactPause(){
  const u=this.ui,w=Math.min(this.width-24,360),height=u.height-48,top=height/2;
  u.panel('overlay',0,0,this.width,u.height,'#06111dc9');u.panel('pause-card',0,0,w,height,'#102437fa');u.text('pause-title',this.pauseSettings?'画面与声音':'电流暂歇',0,top-30,21,'#f4f7fb',w-16).isBold=true;
  if(this.pauseSettings){
   (['low','medium','high'] as const).forEach((q,i)=>this.button('quality-'+q,['流畅','均衡','精细'][i],(i-1)*(w-18)/3,top-77,(w-24)/3,()=>{this.save.settings.quality=q;this.persist()},q===this.save.settings.quality,32));
   this.button('music',`背景音乐：${this.save.settings.music?'开':'关'}`,0,top-125,w-24,()=>{this.save.settings.music=!this.save.settings.music;this.persist()},false,34);
   this.button('motion',`减少闪烁：${this.save.settings.reducedMotion?'开':'关'}`,0,top-173,w-24,()=>{this.save.settings.reducedMotion=!this.save.settings.reducedMotion;this.persist()},false,34);
   this.button('sound-setting',`声音：${this.save.settings.sound?'开':'关'}`,0,top-221,w-24,()=>{this.save.settings.sound=!this.save.settings.sound;this.persist()},false,34);
   this.button('settings-back','返回暂停',0,top-269,w-24,()=>this.pauseSettings=false,false,34);
  }else{
   const choices:[string,string,()=>void][]=[['resume','继续行动 →',()=>this.resume()],['retry','重新开始',()=>this.begin(this.sim.level.index,this.sim.demo)],['settings','画面与声音',()=>this.pauseSettings=true],['clean','净画面模式',()=>{this.clean=true;this.resume()}],['home','返回主菜单',()=>this.home()]];
   choices.forEach(([id,label,action],i)=>this.button(id,label,0,top-78-i*48,w-24,action,i===0,36));
  }
 }
 private compactResult(){
  const u=this.ui,s=this.sim,win=s.phase==='victory',w=Math.min(this.width-24,380),height=u.height-42,top=height/2;
  u.panel('overlay',0,0,this.width,u.height,'#06111dc9');u.panel('result',0,0,w,height,'#102437fa');u.text('result-title',win?'防线已突破':'电涌暂时熄灭',0,top-28,20,'#f4f7fb',w-16).isBold=true;
  u.text('score-caption',`击破 ${s.stats.kills} · 存活 ${s.player.troops}`,0,top-67,11,'#90b8d3',w-16);u.text('score',String(s.stats.score),0,top-110,31,'#f7cf70',w-20);u.text('time',`行动用时 ${s.time.toFixed(1)}s`,0,top-149,11,'#90b8d3',w-16);
  let y=top-194;if(win){this.button('next',s.level.index===2?'重返海堤':'下一段防线',0,y,w-24,()=>this.begin((s.level.index+1)%3,false),true,36);y-=44}
  this.button('retry','再来一次',0,y,w-24,()=>this.begin(s.level.index,s.demo),!win,36);this.button('home','返回主菜单',0,y-44,w-24,()=>this.home(),false,34);
 }
 onDestroy(){this.audio?.stop();this.music?.stop();this.art?.destroy();this.ui?.destroy()}
}
