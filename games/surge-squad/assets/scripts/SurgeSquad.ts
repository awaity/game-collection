import {_decorator,Component,KeyCode,Vec3} from 'cc';
import {GameView} from 'db://assets/collection/runtime';
import {Surge} from './core';
const{ccclass}=_decorator;
@ccclass('SurgeSquad')
export class SurgeSquad extends Component{
 private ui!:GameView;private sim=new Surge();private ready=false;private accumulator=0;
 async start(){
  this.ui=new GameView('surge-squad.save.v1','#091623');this.ui.onHide=()=>this.sim.pause();
  this.ui.onKey=(event,down)=>{if(!down)return;const key=event.keyCode;if(key===KeyCode.SPACE)this.sim.phase==='paused'?this.sim.resume():this.sim.pause();if([KeyCode.KEY_A,KeyCode.ARROW_LEFT].includes(key))this.sim.aim(-3.12);if([KeyCode.KEY_D,KeyCode.ARROW_RIGHT].includes(key))this.sim.aim(3.18);if([KeyCode.KEY_W,KeyCode.ARROW_UP].includes(key))this.sim.aim(0);};
  this.ui.onTouch=(event,phase)=>{if(phase!=='end'&&this.sim.phase==='playing'){const p=event.getUILocation();if(p.y>120&&p.y<this.ui.height-100)this.sim.aim((p.x/this.ui.width-.5)*10.8)}};
  await this.ui.ready;this.ready=true;
 }
 private begin(demo=false){this.sim=new Surge();this.sim.start(demo);this.accumulator=0;}
 update(dt:number){
  if(!this.ui)return;const u=this.ui,s=this.sim;u.begin();
  if(!this.ready){u.text('loading','正在接通电能…',0,0);u.end({slug:'surge-squad',phase:'loading'});return}
  this.accumulator+=Math.min(.1,dt);while(this.accumulator>=1/60){s.step();this.accumulator-=1/60;}
  u.camera.node.setPosition(1.5+s.x*.7,21.5,26.8);u.camera.node.lookAt(new Vec3(s.x*.7,0,3.1));u.camera.fov=32;
  u.shape('road','box','#85818c',0,-.2,-45,10.8,.4,180);
  for(const side of [-1,1])u.shape('rail'+side,'box','#9da3b4',side*5.4,.1,-45,.2,.4,180);
  for(let i=0;i<25;i++){const z=6-i*2+s.distance%2;u.shape('cell'+i,'box','#64d9ff',0,.12,z,1.1,.24,1.7);u.shape('recruit'+i,'cylinder','#f7c729',3.18,.75,z,1.2,1.5,1.2);for(let k=0;k<4;k++)u.shape(`enemy${i}/${k}`,'sphere','#de3653',-4.2+k*.6,.45,z-8,.55,.9,.55)}
  for(let i=0;i<Math.min(20,s.troops);i++)u.shape('player'+i,'sphere','#16a6ed',s.x+(i%5-2)*.42,.5,6+Math.floor(i/5)*.6,.65,1,.65);
  if(s.laser)u.shape('laser','box','#a3ffff',s.x,.7,-12,.2,.2,36);
  for(let i=0;i<2;i++)if(s.boss[i]>0){const z=6-([70,143][i]-s.distance)*.55;if(z<8){u.shape('boss'+i,'sphere','#eb9f91',-3.12,2,z,3.8,4,3.8);u.worldText('boss-hp'+i,String(Math.ceil(s.boss[i])),new Vec3(-3.12,4.4,z),23)}}
  u.platform.state(s.phase==='ready'?'menu':s.phase==='victory'||s.phase==='defeat'?'result':s.phase);
  const h=u.height/2;
  if(s.phase==='ready'){
   u.panel('intro',0,-h+195,Math.min(370,u.width-20),350,'#091623e8');u.text('title','电涌小队',0,-h+300,40);u.text('tagline','蓄满电能，击穿整条防线。',0,-h+235,14,'#b7d4e7');u.button('start','开始行动 →',0,-h+142,Math.min(320,u.width-40),()=>this.begin(),true);u.button('demo','观看实机演示 ↗',0,-h+78,260,()=>this.begin(true));
  }else{
   u.text('stats',`${s.troops} 人    电能 ${s.energy.toFixed(1)} / 12    击破 ${s.kills}`,0,h-50-u.insets.top,15,'#e8f7ff',u.width-24);
   u.button('charge','充能',0,-h+60+u.insets.bottom,100,()=>s.aim(0),true);u.button('attack','清场',-116,-h+60+u.insets.bottom,100,()=>s.aim(-3.12));u.button('recruit','扩编',116,-h+60+u.insets.bottom,100,()=>s.aim(3.18));
   u.button('pause',s.phase==='paused'?'继续':'暂停',u.width/2-48,h-110-u.insets.top,72,()=>s.phase==='paused'?s.resume():s.pause());
   if(s.phase==='paused'||s.phase==='victory'||s.phase==='defeat'){
    u.panel('result',0,0,Math.min(340,u.width-24),280,'#102a46f5');u.text('result-title',s.phase==='paused'?'电流暂歇':s.phase==='victory'?'防线已击穿':'突围未成',0,85,28);u.text('score',`真实得分 ${s.score}`,0,38,16);u.button('retry','重新开始',0,-28,260,()=>this.begin(),true);u.button('home','返回主菜单',0,-90,260,()=>{this.sim=new Surge()});
   }
  }
  u.end({slug:'surge-squad',phase:s.phase,tick:s.tick,energy:s.energy,troops:s.troops,boss:s.boss,laser:s.laser});
 }
 onDestroy(){this.ui?.destroy()}
}
