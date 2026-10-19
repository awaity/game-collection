import {_decorator,Component,Vec3,KeyCode,Input,LabelOutline,UITransform,Graphics,Color} from 'cc';
import {GameView} from 'db://assets/collection/runtime';
import {Run,pilot,DT,AREAS,type Action} from './core';
const {ccclass}=_decorator;

@ccclass('ShanhaiRun')
export class ShanhaiRun extends Component {
  private ui!:GameView;
  private run=new Run();
  private ready=false;
  private accumulator=0;
  private yaw=0;
  private pointer:{x:number;y:number;id:number}|null=null;
  private held=new Set<number>();
  private idle=0;

  async start(){
    this.ui=new GameView('shanhai-run.save.v1','#bddbd5');
    await this.ui.ready;this.ready=true;
    this.ui.onHide=()=>{this.run.pause();this.pointer=null;this.held.clear();this.accumulator=0;};
    this.ui.onKey=(event,down)=>{
      if(!down){this.held.delete(event.keyCode);return;}if(this.held.has(event.keyCode))return;this.held.add(event.keyCode);
      const actions:Record<number,Action>={[KeyCode.ARROW_LEFT]:'left',[KeyCode.KEY_A]:'left',[KeyCode.ARROW_RIGHT]:'right',[KeyCode.KEY_D]:'right',[KeyCode.ARROW_UP]:'jump',[KeyCode.KEY_W]:'jump',[KeyCode.SPACE]:'jump',[KeyCode.ARROW_DOWN]:'slide',[KeyCode.KEY_S]:'slide',[KeyCode.KEY_F]:'wind'};
      if(actions[event.keyCode])this.run.input(actions[event.keyCode]);
      if(event.keyCode===KeyCode.ESCAPE||event.keyCode===KeyCode.KEY_P){if(this.run.phase==='paused')this.run.resume();else this.run.pause();}
      if(event.keyCode===KeyCode.KEY_R)this.begin();
    };
    this.ui.onTouch=(event,phase)=>{
      if(event.getType()===Input.EventType.TOUCH_CANCEL){this.pointer=null;return;}
      const p=event.getUILocation();
      if(phase==='start'){
        const over=Array.from(this.ui.buttons.values()).some(b=>b.node.active&&Math.abs(p.x-this.ui.width/2-b.node.position.x)<b.width/2&&Math.abs(p.y-this.ui.height/2-b.node.position.y)<b.height/2);
        this.pointer=over?null:{x:p.x,y:p.y,id:event.getID()??0};
      }else if(this.pointer&&this.pointer.id===(event.getID()??0)){
        const dx=p.x-this.pointer.x,dy=p.y-this.pointer.y;
        if(Math.max(Math.abs(dx),Math.abs(dy))>=26){this.run.input(Math.abs(dx)>Math.abs(dy)?dx<0?'left':'right':dy>0?'jump':'slide');this.pointer=null;}
        if(phase==='end')this.pointer=null;
      }
    };
    const qa=globalThis as unknown as {__COLLECTION_TEST__?:boolean;__collectionAdvance?:(count:number)=>void;__shanhai?:unknown};
    if(qa.__COLLECTION_TEST__){qa.__collectionAdvance=count=>{for(let n=0;n<Math.min(200000,count);n++)this.run.step();this.update(0);};qa.__shanhai={input:(a:Action)=>this.run.input(a),play:(frames:number)=>{for(let n=0;n<Math.min(frames,200000)&&this.run.phase==='running';n++){pilot(this.run);this.run.step();}this.update(0);return this.run.snapshot();},state:()=>this.run.snapshot()};}
  }
  private begin(){this.run=new Run({seed:42});this.run.start();this.accumulator=0;this.yaw=0;this.pointer=null;}
  update(delta:number){
    if(!this.ready)return;
    this.accumulator+=Math.min(.1,delta);while(this.accumulator>=DT){this.run.step();this.accumulator-=DT;}
    this.idle+=delta;
    const ui=this.ui,s=this.run;ui.begin();
    const heading=s.segment.heading;this.yaw+=(heading-this.yaw)*Math.min(1,Math.max(delta,DT)*8);
    const origin=s.sample(s.distance,s.x),cos=Math.cos(this.yaw),sin=Math.sin(this.yaw);
    const world=(d:number,lane=0)=>{const p=s.sample(d,lane),x=p.x-origin.x,z=p.z-origin.z;return {x:x*cos+z*sin,z:-x*sin+z*cos,heading:(p.heading-this.yaw)*180/Math.PI};};
    ui.camera.fov=55;ui.camera.node.setPosition(0,5.2,9.5);ui.camera.node.lookAt(new Vec3(0,1,-11));
    for(let n=0;n<54;n++){
      const d=Math.floor(s.distance/2)*2-12+n*2,p=world(d),gap=s.hazards.some(h=>h.kind==='gap'&&Math.abs(h.d-d)<h.half+.5);
      if(!gap)ui.shape('road'+n,'box',n%2?'#c9bd99':'#d5c8a7',p.x,-.22,p.z,5.8,.44,2.06).setRotationFromEuler(0,-p.heading,0);
      if(n%3===0)for(const lane of [-1.85,1.85]){const q=world(d,lane);ui.shape('post'+n+lane,'box','#617d67',q.x,.35,q.z,.42,1.05,.42);}
    }
    let index=0;
    for(const h of s.hazards){if(h.d<s.distance-8||h.d>s.distance+95||h.kind==='gap')continue;const p=world(h.d,s.hazardLane(h)),low=h.kind==='lintel',wide=h.wide;
      ui.shape('obstacle'+index++,'box',low?'#466e5b':h.kind==='fire'?'#ce6549':'#6d6253',p.x,low?2.2:.65,p.z,wide?5.7:1.4,low?.6:1.3,1.1).setRotationFromEuler(0,-p.heading,0);
    }
    index=0;for(const item of s.pickups){if(item.taken||item.d<s.distance-2||item.d>s.distance+80)continue;const p=world(item.d,item.lane);ui.shape('pickup'+index++,'sphere',item.kind==='jade'?'#f5c45b':'#68d7d1',p.x,item.height,p.z,.32,.42,.32);}
    for(let n=0;n<10;n++){const side=n%2?1:-1;ui.shape('mountain'+n,'cone',n%2?'#5b9285':'#80ab97',side*(13+n*2),-8,-24-n*9,16+n,24+n*2,20+n);}
    const y=s.height,slide=s.sliding,scale=slide?.4:1;
    ui.shape('shadow','cylinder','#335f5148',0,.02,0,1.1,.02,.75);
    ui.shape('body','box','#315e55',0,y+.95*scale,0,.65,1.05*scale,.42);
    ui.shape('head','sphere','#efd0aa',0,y+1.7*scale,-.02,.52,.55,.5);
    ui.shape('hair','sphere','#283832',0,y+1.86*scale,.06,.54,.34,.48);
    for(const side of [-1,1]){const stride=s.phase==='running'?Math.sin(s.time*15)*side:0;ui.shape('leg'+side,'box','#3d4c43',side*.18,y+.35*scale,stride*.22,.23,.65*scale,.24).setRotationFromEuler(stride*28,0,0);ui.shape('arm'+side,'box','#ae5f47',side*.43,y+1.1*scale,-stride*.16,.22,.72*scale,.23).setRotationFromEuler(-stride*30,0,0);}
    ui.shape('scarf','box','#b75d49',.12,y+1.35*scale,.46,.24,.12,.9).setRotationFromEuler(Math.sin(this.idle*4)*10,0,8);
    const safeTop=Math.max(ui.insets.top,ui.insets.menuBottom),top=ui.height/2-safeTop,bottom=-ui.height/2+ui.insets.bottom;
    if(s.phase==='ready'){
      const title=ui.text('title','山 海 逃 亡',0,top-94,44,'#173f37',Math.min(ui.width-24,530));title.isBold=true;
      ui.text('intro','携照夜玉，踏失落古道。',0,top-143,15,'#335c4f',ui.width-24);
      ui.button('start','开始逃亡',0,bottom+115,Math.min(ui.width-48,320),()=>this.begin(),true,54);
      ui.text('guide','左右转向 / 变道　上滑跳跃　下滑滑铲',0,bottom+60,12,'#24483d',ui.width-20);
    }else{
      ui.text('distance',`${Math.floor(s.distance)} 米`,-Math.min(ui.width*.32,400),top-37,22,'#173f37',130).isBold=true;
      ui.text('jade',`灵玉 ${s.stats.coins}`,0,top-37,17,'#294d40',120);
      ui.button('pause','暂停',Math.min(ui.width*.35,480),top-37,62,()=>s.pause(),false,40);
      ui.text('area',AREAS[s.area].name,0,top-72,12,'#355d51',200);
      if(s.canTurn)ui.text('corner',`${s.turnDirection<0?'← 左转':'右转 →'}  ${Math.max(0,Math.ceil(s.cornerDistance))}米`,0,ui.height*.13,27,'#9e3b25',ui.width-30).isBold=true;
      if(s.phase==='running')(['left','jump','slide','right'] as const).forEach((action,i)=>ui.button(action,['←','跳跃','滑铲','→'][i],(i-1.5)*66,bottom+36,58,()=>s.input(action),false,44));
      if(s.phase==='paused'||s.phase==='dead'||s.phase==='won'){
        const width=Math.min(ui.width-32,360);ui.panel('overlay',0,0,width,270,'#183e39ed');
        ui.text('result-title',s.phase==='paused'?'山风暂歇':s.phase==='won'?'已抵达山门':'此行暂歇',0,82,28,'#f1dfb1',width-20);
        ui.text('result-copy',s.phase==='paused'?'准备好后，继续赶路。':s.deathReason||'新的山海正在前方。',0,35,14,'#d8ddc8',width-24);
        ui.button('resume',s.phase==='paused'?'继续逃亡':'再来一次',0,-24,width-48,()=>s.phase==='paused'?s.resume():this.begin(),true,48);
        ui.button('home','返回山门',0,-83,width-48,()=>{this.run=new Run();this.yaw=0;},false,42);
      }
    }
    ui.platform.state(s.phase==='ready'?'menu':s.phase==='paused'?'paused':['dead','won'].includes(s.phase)?'result':'playing');
    ui.end({slug:'shanhai-run',...s.snapshot(),phase:s.phase==='ready'?'menu':s.phase==='running'?'playing':s.phase});
  }
  onDestroy(){this.ui?.destroy();}
}
