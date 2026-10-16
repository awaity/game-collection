import {_decorator,Component,KeyCode,Vec3} from 'cc';import {GameView} from 'db://assets/collection/runtime';import {Camp,STATIONS} from './core';
const{ccclass}=_decorator;
@ccclass('FrostTrail')
export class FrostTrail extends Component{
 private ui!:GameView;private sim=new Camp();private ready=false;private accumulator=0;
 async start(){this.ui=new GameView('frost-trail.save.v1','#d4dce0');this.ui.onHide=()=>this.sim.paused=true;this.ui.onKey=(e,down)=>{if(down&&e.keyCode===KeyCode.SPACE)this.sim.paused=!this.sim.paused};await this.ui.ready;this.ready=true;const host=globalThis as unknown as{__COLLECTION_TEST__?:boolean;__collectionAdvance?:(n:number)=>void};if(host.__COLLECTION_TEST__)host.__collectionAdvance=n=>{if(!Number.isInteger(n)||n<0||n>7200)throw Error('Invalid steps');for(let i=0;i<n;i++)this.sim.step();this.update(0)}}
 update(dt:number){if(!this.ui)return;const u=this.ui,s=this.sim;u.begin();if(!this.ready){u.text('loading','正在铺好雪路…',0,0);u.end({slug:'frost-trail',phase:'loading'});return}this.accumulator+=Math.min(.1,dt);while(this.accumulator>=1/60){s.step();this.accumulator-=1/60}
  u.camera.node.setPosition(14,23,21);u.camera.node.lookAt(new Vec3(0,0,0));u.camera.fov=42;u.shape('snow','box','#e2e8ed',0,-.3,0,80,.4,80);u.shape('camp','box','#a76f58',0,-.03,0,14,.2,10);
  for(let i=0;i<18;i++){const x=-9-(i%3)*1.5,z=-6+Math.floor(i/3)*2;u.shape('trunk'+i,'cylinder','#936b43',x,.5,z,.3,1,.3);u.shape('tree'+i,'cone','#96c7ce',x,1.8,z,1.6,3,1.6)}for(let i=0;i<9;i++)u.shape('bear'+i,'sphere','#fff8ec',-4+(i%3)*3,.5,8+Math.floor(i/3)*2,1,1,1.7);
  u.shape('fire','cone','#ffae40',1.65,.4,.6,.8,1,.8);u.shape('counter','box','#e9c26b',0,.6,-5.3,5,1.2,1);u.shape('player','sphere','#18a6c9',s.x,.55,s.z,.65,1.1,.65);
  s.bag.slice(-10).forEach((r,i)=>u.shape('bag'+i,'box',r==='wood'?'#b97843':r==='raw'?'#ed5e66':'#a44927',s.x,.8+i*.18,s.z+.3,.55,.16,.45));
  const h=u.height/2;u.text('title','雪原小营',0,h-38,24,'#2b5363');u.panel('stats',0,h-86,Math.min(u.width-24,360),40,'#ffffffee');u.text('stats',`$ ${s.cash}   柜台 ${s.counter}   背包 ${s.bag.length}/36`,0,h-86,14,'#294d5a',u.width-30);
  [['forest','采集木材'],['hunt','获取食材'],['fire','烤制食物'],['market','供货收款']].forEach(([key,label],i)=>u.button(key,label,(i%2-.5)*150,-h+105-Math.floor(i/2)*52,140,()=>{const p=STATIONS[key as keyof typeof STATIONS];s.aim(p.x,p.z)},true));u.button('pause',s.paused?'继续':'暂停',u.width/2-48,h-135,72,()=>s.paused=!s.paused);u.platform.state(s.paused?'paused':'playing');u.end({slug:'frost-trail',phase:s.paused?'paused':'playing',bag:s.bag,cash:s.cash,sold:s.sold,cooking:s.cooking,time:s.time});
 }
 onDestroy(){this.ui?.destroy()}
}
