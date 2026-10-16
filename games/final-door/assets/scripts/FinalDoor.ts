import { _decorator, AudioClip, AudioSource, Component, KeyCode, Label, MeshRenderer, Rect, UITransform, Vec3, Vec4, resources, sys } from 'cc';
import { GameView } from 'db://assets/collection/runtime';
import { Assault, ROUTES, clamp, defaultInputs, exportReplay, importReplay } from './core';
import { SceneArt } from './art';
const { ccclass } = _decorator;
const smooth = (value: number) => { const x = clamp(value, 0, 1); return x * x * (3 - 2 * x); };
type Menu = '' | 'main' | 'settings' | 'replay' | 'report';
interface Save { version: 1; best: number[]; sound: boolean; quality: '精细' | '流畅'; reduced: boolean }

@ccclass('FinalDoor')
export class FinalDoor extends Component {
  private ui!: GameView;
  private art: SceneArt | null = null;
  private sim = new Assault();
  private running = false;
  private automatic = true;
  private menu: Menu = '';
  private menuPage = 0;
  private accumulator = 0;
  private recording = false;
  private held = new Set<number>();
  private pointer: {x: number; target: number} | null = null;
  private notice = '';
  private noticeTime = 0;
  private failure = '';
  private saved = false;
  private eventCursor = 0;
  private sound!: AudioSource;
  private clips = new Map<string, AudioClip>();
  private lastSound = 0;
  private save!: Save;

  async start() {
    this.ui = new GameView('final-door.save.v1', '#183550');
    const testHost=globalThis as unknown as {__COLLECTION_TEST__?:boolean;__collectionAdvance?:(ticks:number)=>void};
    if(testHost.__COLLECTION_TEST__)testHost.__collectionAdvance=(ticks:number)=>{
      if(!Number.isInteger(ticks)||ticks<0||ticks>2700)throw Error('推进步数必须为 0–2700。');
      this.pause();for(let i=0;i<ticks;i++)this.sim.step();this.update(0);
    };
    const raw = this.ui.platform.load<Partial<Save>>({});
    this.save = {version: 1, best: [0,1,2].map(i => Number.isFinite(raw.best?.[i]) ? clamp(raw.best![i],0,144) : 0), sound: raw.sound === true, quality: raw.quality === '流畅' ? '流畅' : '精细', reduced: typeof raw.reduced === 'boolean' ? raw.reduced : this.ui.services.reducedMotion};
    const query=this.ui.services.launchQuery(), seed=Number(query.seed??42), route=Number(query.route??0);
    this.automatic=query.mode!=='interactive';
    this.recording=query.mode==='capture';
    this.sim=new Assault(Number.isInteger(seed)&&seed>=0&&seed<=4294967295?seed:42,Number.isInteger(route)&&route>=0&&route<=2?route:0,this.automatic?defaultInputs(Number.isInteger(route)&&route>=0&&route<=2?route:0):[]);
    this.sound = this.node.addComponent(AudioSource);
    resources.loadDir('audio', AudioClip, (error, clips) => { if (!error) for (const clip of clips) this.clips.set(clip.name,clip); });
    this.ui.onHide = () => this.pause();
    this.ui.onKey = (e, down) => {
      if (down) this.held.add(e.keyCode); else this.held.delete(e.keyCode);
      if (down && e.keyCode === KeyCode.SPACE) this.toggle();
      if (down && e.keyCode === KeyCode.KEY_R) this.restart();
      if (down && e.keyCode === KeyCode.KEY_F && this.recording && !this.running && !this.menu) this.sim.step();
      if (down && e.keyCode === KeyCode.ESCAPE) { if (this.menu) this.menu = ''; else this.pause(); }
      if (down && [KeyCode.ARROW_LEFT,KeyCode.ARROW_RIGHT,KeyCode.KEY_A,KeyCode.KEY_D].includes(e.keyCode) && !this.menu) this.takeControl();
    };
    this.ui.onTouch = (e, phase) => {
      if (this.menu || !this.art || this.ended) return;
      const p = e.getUILocation();
      if (phase === 'end') { this.pointer = null; return; }
      if (phase === 'start' && p.y > 105 && p.y < this.ui.height - 155) {
        this.pointer = {x:p.x,target:this.sim.target}; this.takeControl();
      }
      if (phase === 'move' && this.pointer) this.sim.input('target', this.pointer.target + (p.x-this.pointer.x) / this.ui.width * (this.portrait ? 15 : 23));
    };
    try { this.art = await SceneArt.load(this.ui); this.running = !this.save.reduced && !this.recording; }
    catch (error) { this.failure = '场景加载失败，请重新载入。'; console.error(error); }
  }
  private get portrait() { return this.ui.width < 760 || this.ui.width < this.ui.height; }
  private get ended() { return this.sim.outcome !== '进行中' || this.sim.tick >= 2700; }
  private persist() { if (!this.ui.platform.save(this.save)) this.notify('本机存储不可用，本次对局仍可继续。'); }
  private notify(text: string) { this.notice = text; this.noticeTime = 4; }
  private pause() { this.running = false; this.accumulator = 0; this.held.clear(); this.pointer = null; this.sound?.stop(); }
  private toggle() { if (!this.ended && !this.menu) { this.running = !this.running; this.accumulator = 0; if(this.running)this.recording=false; } }
  private takeControl() {
    if (this.ended || this.menu) return;
    if (this.automatic) { this.sim.takeControl(); this.automatic = false; }
    this.running = true;
    this.recording = false;
  }
  private restart(route = this.sim.route, auto = this.automatic, seed = this.sim.seed) {
    this.sim = new Assault(seed, route, auto ? defaultInputs(route) : []);
    this.automatic = auto; this.running = true; this.menu = ''; this.accumulator = 0;
    this.saved = false; this.eventCursor = 0; this.held.clear(); this.pointer = null; this.sound.stop(); this.lastSound=0; this.recording=false;
  }
  private open(menu: Menu) { this.pause(); this.menu = menu; this.menuPage=0; }
  private async copyChallenge() {
    const copied=await this.ui.services.copy(this.ui.services.challengeUrl(this.sim.seed,this.sim.route));
    this.notify(copied?'挑战链接已复制。':'当前平台无法复制链接。');
  }
  private async shareResult() {
    const s=this.sim,text=`${ROUTES[s.route].name}：${s.outcome}，${s.crowd.count} 名队员，${s.kills} 次击杀。`;
    const status=await this.ui.services.share('最后一道门',text,this.ui.services.challengeUrl(s.seed,s.route),`seed=${s.seed}&route=${s.route}&mode=interactive`);
    this.notify(status==='opened'?'已打开分享入口。':status==='copied'?'结果与挑战链接已复制。':status==='cancelled'?'已取消分享。':'当前平台无法分享。');
  }
  private async seedPrompt() {
    const value = await this.ui.services.prompt('挑战种子（0–4294967295）', String(this.sim.seed));
    if (value === null) return;
    const seed = Number(value);
    if (!/^\d+$/.test(value) || !Number.isInteger(seed) || seed > 4294967295) return this.notify('请输入有效的整数种子。');
    this.restart(this.sim.route, this.automatic, seed);
  }
  private async export(report: boolean) {
    const data = report ? {作品:'最后一道门',...this.sim.snapshot(),校验:this.sim.hash()} : exportReplay(this.sim);
    const done = await this.ui.services.exportText(report ? 'final-door-report.json' : 'final-door-replay.json',JSON.stringify(data,null,2));
    this.notify(done ? (sys.isBrowser ? '已生成本次对局文件。' : '已复制到剪贴板。') : '当前平台无法导出，请稍后重试。');
  }
  private async import() {
    try {
      const data = await this.ui.services.importText(); if (data === null) return;
      if (data.length > 1024 * 1024) throw Error('回放文件过大。');
      const replay = importReplay(data);
      this.sim = new Assault(replay.seed,replay.route,replay.inputs);
      this.automatic = true; this.running = false; this.saved = false; this.menu = '';
      this.accumulator = 0; this.eventCursor = 0; this.notify('回放已导入，点击播放。');
    } catch (e) { this.notify(e instanceof Error ? e.message : '回放无法读取。'); }
  }

  update(dt: number) {
    if (!this.ui) return;
    const ui = this.ui; ui.begin();
    this.noticeTime = Math.max(0,this.noticeTime-dt);
    if (!this.art) {
      ui.platform.state('menu'); ui.text('loading',this.failure || '正在铺好海桥…',0,0,20);
      ui.end({slug:'final-door',phase:'loading'}); return;
    }
    if (this.running && !this.menu && !this.ended) {
      const left = this.held.has(KeyCode.ARROW_LEFT) || this.held.has(KeyCode.KEY_A);
      const right = this.held.has(KeyCode.ARROW_RIGHT) || this.held.has(KeyCode.KEY_D);
      const axis = Number(right) - Number(left);
      if (!this.automatic && this.sim.axis !== axis && !this.pointer) this.sim.input('axis',axis);
      this.accumulator += Math.min(.1,Math.max(0,dt));
      while (this.accumulator >= 1/60 && !this.ended) { this.sim.step(); this.accumulator -= 1/60; }
    }
    if (this.ended) {
      this.running = false;
      if (!this.saved) {
        if (!this.automatic && this.sim.outcome === '胜利') { this.save.best[this.sim.route] = Math.max(this.save.best[this.sim.route],this.sim.crowd.count); this.persist(); }
        this.saved = true;
      }
    }
    for (;this.eventCursor < this.sim.events.length;this.eventCursor++) {
      const event = this.sim.events[this.eventCursor];
      if (this.save.sound && this.running && this.sim.time - this.lastSound > .1 && ['装备升级','首领重击','命中'].includes(event.type)) {
        const clip = this.clips.get(event.type === '装备升级' ? 'upgrade' : event.type === '首领重击' ? 'impact' : 'hit');
        if (clip) this.sound.playOneShot(clip,.22); this.lastSound = this.sim.time;
      }
    }
    ui.platform.state(this.menu==='main'?'menu':this.menu || (!this.running && this.sim.tick > 0 && !this.ended) ? 'paused' : this.ended ? 'result' : this.automatic && this.sim.tick === 0 ? 'menu' : 'playing');
    this.renderWorld(); this.renderHud();
    if (this.menu) this.renderMenu(); else if (this.ended) this.renderResult();
    const recent=this.sim.events.slice(-400).reverse().find(e=>['过门','装备升级','首领重击','容量拒绝'].includes(e.type)&&this.sim.tick-e.tick<100);
    if(recent&&!this.ended&&!this.menu&&this.noticeTime<=0){
      const value=recent.type==='过门'?`实际${recent.value>=0?'增加':'减少'} ${Math.abs(recent.value)} 人`:recent.type==='装备升级'?'装备升级 · 弹丸伤害与外形同时改变':recent.type==='首领重击'?`重击造成 ${recent.value} 人损失`:this.sim.warning;
      const x=this.portrait?0:ui.width*.125,y=-ui.height*.32+24,w=Math.min(ui.width-28,value.length*14+32);
      ui.panel('event-toast',x,y,w,34,'#0b2446b8');ui.text('event-toast',value,x,y,12,'#e9f5ff',w-16).isBold=true;
    }
    if (this.noticeTime > 0) {
      ui.panel('notice',0,-ui.height/2+132,Math.min(360,ui.width-24),58,'#0d2c47ef');
      ui.text('notice-text',this.notice,0,-ui.height/2+132,13,'#e6f5ff',Math.min(340,ui.width-42));
    }
    ui.end({slug:'final-door',phase:this.menu ? 'menu' : this.ended ? 'result' : this.running ? 'playing' : 'paused',menu:this.menu,automatic:this.automatic,tick:this.sim.tick,count:this.sim.crowd.count,shots:this.sim.shots,hits:this.sim.hits,route:this.sim.route,outcome:this.sim.outcome,bossHP:this.sim.boss.hp,checksum:(globalThis as unknown as {__COLLECTION_TEST__?:boolean}).__COLLECTION_TEST__?this.sim.hash():undefined,sound:this.save.sound,quality:this.save.quality});
  }

  private renderWorld() {
    const ui=this.ui, a=this.art!, s=this.sim, scroll=s.progress;
    const t=s.outcome==='进行中'?s.time:s.endedAt/60;
    const combat=smooth((scroll-93)/19),extra=Math.max(0,s.crowd.radius()-3)*1.45;
    ui.camera.rect = this.portrait ? new Rect(0,0,1,1) : new Rect(.25,0,.75,1);
    ui.camera.node.setPosition(0,(this.portrait?21.4:22.5)-combat*2+extra,(this.portrait?20.3:23.8)-combat*(this.portrait?1.8:2.2)+extra);
    ui.camera.node.lookAt(new Vec3(0,0,(this.portrait?-7.1:-6.8)+combat*(this.portrait?3:2.9)));
    let fov=this.portrait?.758:.63;
    const foot=new Vec3(),head=new Vec3();
    // Original framing contract: every active member's feet and head must fit.
    for(let attempt=0;attempt<18;attempt++){
      ui.camera.fov=fov*180/Math.PI;ui.camera.camera.update(true);
      let safe=true;
      for(let i=0;i<s.crowd.count&&safe;i++){
        const m=s.member(i),z=scroll-m.s;
        for(const offset of [-.43,.43]){
          foot.set(m.x+offset,.03,z+.26);head.set(m.x+offset,1.7,z-.26);
          const p=ui.camera.convertToUINode(foot,ui.canvas),q=ui.camera.convertToUINode(head,ui.canvas);
          if(p.x*2/ui.width<(this.portrait?-.963:-.20)||p.x*2/ui.width>.973||p.y*2/ui.height<-.77||q.y*2/ui.height>.70){safe=false;break;}
        }
      }
      if(safe)break;
      fov+=.018;
    }
    ui.shape('sea','box','#183452',0,-.78,-45,350,.1,350);
    ui.shape('road','box','#737f96',0,-.19,-61,13.25,.32,220).getComponent(MeshRenderer)!.setSharedMaterial(a.roadMaterial,0);
    a.roadMaterial.setProperty('roadParams',new Vec4(scroll,0,0,0));
    for (let k=-4;k<17;k++) {
      const z=scroll%6-k*6;
      for (const side of [-1,1]) {
        ui.shape(`curb${k}/${side}`,'box','#8fa1b8',side*6.82,-.05,z,.4,.5,6);
        ui.shape(`rail${k}/${side}`,'box','#496380',side*6.82,.51,z,.16,.14,6.02);
        ui.shape(`rail2${k}/${side}`,'box','#496380',side*6.82,.91,z,.16,.14,6.02);
        ui.shape(`post${k}/${side}`,'box','#243851',side*6.82,.47,z-1.5,.21,.95,.17);
        ui.shape(`post2${k}/${side}`,'box','#243851',side*6.82,.47,z+1.5,.21,.95,.17);
        ui.shape(`seam${k}/${side}`,'box','#53677e',side*6.3,.02,z-1.3,.59,.015,.39);
        if (k%3===0) {
          const lamp=ui.meshNode(`lamp${k}/${side}`,a.models.get('lampGeometry')!,a.modelMaterial,side*7.02,0,z);
          lamp.setRotationFromEuler(0,side===1?180:0,0);
          if(this.save.quality==='精细')ui.meshNode(`lamp-shadow${k}/${side}`,a.models.get('lampGeometry')!,a.projectionMaterial,side*7.02,0,z).setRotation(lamp.rotation);
        }
      }
    }
    for(const gate of s.gates) {
      const z=scroll-gate.s; if(z< -58 || z>9)continue;
      const label = ui.camera.convertToUINode(new Vec3(gate.x,.88,z),ui.canvas);
      const visibleLabel = z>=-43&&z<=6&&!gate.collected&&label.y<ui.height/2-(this.portrait?143:72)-ui.insets.top&&label.y> -ui.height/2+70;
      if(gate.kind==='门' && !(gate.collected && z>.5)) {
        ui.meshNode(`gate${gate.id}`,a.models.get('gateGeometry')!,gate.value<0?a.gateRed:a.gateBlue,gate.x,0,z,gate.half/1.92,1,1);
        const p=ui.camera.convertToUINode(new Vec3(gate.x-gate.half,1,z),ui.canvas), q=ui.camera.convertToUINode(new Vec3(gate.x+gate.half,1,z),ui.canvas);
        if(visibleLabel)ui.worldText(`gate-label${gate.id}`,gate.op==='乘'?`×${gate.value}`:gate.value>=0?`+${gate.value}`:String(gate.value),new Vec3(gate.x,.88,z),clamp(Math.abs(p.x-q.x)*.31,22,72));
      }else if(gate.kind==='补给') {
        if(gate.hp>0) ui.meshNode(`crate${gate.id}`,a.models.get('supplyGeometry')!,a.modelMaterial,gate.x,0,z);
        if(!gate.collected&&!gate.passed) {
          const prop=ui.meshNode(`weapon${gate.id}`,a.models.get(gate.level===3?'droneGeometry':'rifleGeometry')!,a.modelMaterial,gate.x,gate.hp>0?2.62:.72,z,.73,.73,.73);
          prop.setRotationFromEuler(0,14+Math.sin(t*1.8+gate.id)*3,0);
          a.fx(ui,`supply-ring${gate.id}`,2,gate.x,gate.hp>0?1.74:.035,z,2.67,1.67,[.28,.86,1,.72]);
          if(visibleLabel)ui.worldText(`crate-label${gate.id}`,gate.hp>0?String(gate.hp):'拾取',new Vec3(gate.x,.83,z),26);
          const p=ui.camera.convertToUINode(new Vec3(gate.x,gate.hp>0?3.1:1.36,z),ui.canvas);
          if(visibleLabel&&p.y<ui.height/2-(this.portrait?153:82))ui.text(`caption${gate.id}`,gate.level===3?'装甲补给':'脉冲步枪',p.x,p.y,8,'#d0eeff',100);
        }
      }else if(gate.kind==='障碍') ui.meshNode(`spike${gate.id}`,a.models.get('spikeGeometry')!,a.modelMaterial,gate.x,0,z,gate.half/1.15,1,1);
    }
    const boss=s.boss,bz=scroll-boss.s;
    if(bz>-43){
      const charge=boss.phase==='蓄力'?smooth((s.tick-boss.windupAt-36)/12):0;
      const slam=boss.phase==='重击'?1-smooth((s.tick-boss.impactAt-5)/19):charge;
      const wind=boss.phase==='蓄力'?smooth((s.tick-boss.windupAt)/30)*(1-charge*.44):boss.phase==='重击'?.56*slam:0;
      a.bossMaterial.setProperty('bossParams',new Vec4(wind,boss.deathAt>=0?smooth((s.tick-boss.deathAt)/42):0,boss.phase==='追击'?1:0,slam));
      a.bossMaterial.setProperty('animationParams',new Vec4(s.time,0,0,0));
      a.bossMaterial.setProperty('flashParams',new Vec4(s.tick-boss.hitAt<2?.38:0,0,0,0));
      ui.meshNode('boss',a.models.get('bossGeometry')!,a.bossMaterial,boss.x,0,bz);
    }
    if(boss.phase==='蓄力')a.fx(ui,'warning',2,boss.attackX,.033,scroll-boss.attackS,4.25,4.25,[1,.16,.20,.55+.20*Math.sin(t*22)]);
    const members=Array.from({length:s.crowd.count},(_,i)=>s.member(i)).sort((x,y)=>y.s-x.s);
    for(const m of members){
      const frame=(s.level===1?0:16)+Math.floor(((t*10+m.id*.73)%(Math.PI*2))/(Math.PI*2)*16);
      a.actor(ui,`member${m.id}`,frame,m.x,scroll-m.s);
    }
    for(const e of s.enemies){
      const z=scroll-e.s;if(e.hp<=0||z<-47||z>9)continue;
      const frame=32+Math.floor(((t*9+e.id*.41)%(Math.PI*2))/(Math.PI*2)*16);
      a.actor(ui,`enemy${e.id}`,frame,e.x,z,2,s.tick-e.hitAt<3);
    }
    let impact=0,ring=0,corpse=0,debris=0;
    for(let i=s.events.length-1;i>=0;i--){
      const e=s.events[i],age=(s.tick-e.tick)/60,z=scroll-e.s;if(age>2.2)break;
      if(z<-45||z>11)continue;
      if(this.save.quality==='精细'&&(e.type==='队员倒地'||e.type==='敌人倒地')&&age<1.7&&corpse<200){
        const player=e.type==='队员倒地',heavy=player&&s.events.some(up=>up.type==='装备升级'&&up.value===2&&up.tick<=e.tick);
        const base=player?(heavy?52:48):56,n=player?4:8;
        a.actor(ui,`fallen${corpse++}`,base+Math.min(n-1,Math.floor(age/.3*(n-1))),e.x,z,3.8);
      }
      if(e.type==='命中'&&age<.13&&impact<(this.save.quality==='精细'?460:80)){
        const size=.30+(1-age/.13)*.61;
        a.fx(ui,`impact${impact++}`,1,e.x,e.detail==='首领'?1.05:.86,z,size,size,s.level===1?[.20,.74,1,(1-age/.13)*.9]:[1,.66,.20,1-age/.13],true);
      }
      if(e.type==='补给击破'&&age<1.05&&this.save.quality==='精细')for(let k=0;k<14;k++){
        const angle=k*.79+e.id,spread=age*2.6;
        ui.shape(`debris${debris++}`,'box',k%3===0?'#476581':'#cb926c',e.x+Math.cos(angle)*spread,Math.max(.035,.9+age*3-age*age*6),z+Math.sin(angle)*spread,.22,.14,.36).setRotationFromEuler(age*90,angle*180/Math.PI+age*230,0);
      }
      if(e.type==='补给击破'&&age<.36){const size=2.3+age*3;a.fx(ui,`impact${impact++}`,1,e.x,.90,z,size,size,[1,.58,.1,(1-age/.36)*.87],true);}
      if(e.type==='首领重击'&&age<.38){const size=2+age*5;a.fx(ui,`impact${impact++}`,1,e.x,.20,z,size,size*.35,[1,.36,.08,(1-age/.38)*.63],true);}
      if(e.type==='过门'&&age<.55)a.fx(ui,`event-ring${ring++}`,2,s.x,.045,0,2+age*8,2+age*8,[.24,.78,1,(1-age/.55)*.67]);
      if(e.type==='装备升级'&&age<.65)a.fx(ui,`event-ring${ring++}`,2,s.x,.10,0,2+age*8,2+age*8,[1,.69,.2,(1-age/.65)*.85]);
      if(e.type==='首领重击'&&age<.65)a.fx(ui,`event-ring${ring++}`,2,e.x,.045,z,3.4+age*8,3.4+age*8,[1,.35,.16,(1-age/.65)*.72]);
    }
    if(s.outcome==='进行中')for(let i=0;i<s.bullets.count;i++){
      const p=s.bullets,z=scroll-p.s[i];if(z<-46||z>9)continue;
      a.fx(ui,`bullet${i}`,0,p.x[i],.815,z,s.level===1?.235:.295,s.level===1?1.55:1.85,s.level===1?[.075,.63,1,.96]:[1,.63,.065,.98]);
      if(s.tick-p.born[i]<3&&impact<720){const owner=members.find(m=>m.id===p.owner[i]);if(owner)a.fx(ui,`impact${impact++}`,1,owner.x+.235,.815,scroll-owner.s-.88,.39,.39,s.level===1?[.35,.8,1,.8]:[1,.78,.25,.88],true);}
    }
  }

  private renderBossHud(){
    const u=this.ui,s=this.sim,b=s.boss;if(s.progress<=98||s.outcome!=='进行中')return;
    const width=clamp(u.width*(this.portrait?.27:.13),115,280),height=62,safeTop=this.portrait?(u.width<500?132:158):90;
    const head=u.camera.convertToUINode(new Vec3(b.x,5.69,s.progress-b.s),u.canvas),headTop=u.height/2-head.y;
    const edge=headTop-height-12<safeTop,top=edge?safeTop:Math.min(headTop-height-12,u.height*.53);
    const x=edge?u.width/2-width/2-12:clamp(head.x,-u.width/2+12+width/2,u.width/2-width/2-12),y=u.height/2-top-height/2;
    u.text('boss-title',String(b.hp),x,y+17,this.portrait?27:26,'#f2f7ff',width-14).isBold=true;
    u.panel('boss-bar',x,y-1,width,9,'#152540');u.panel('boss-inner',x,y-1,width-4,5,'#0c1b31');const fill=(width-4)*clamp(b.hp/b.maxHp,0,1);
    if(fill>0)u.panel('boss-fill',x-(width-4-fill)/2,y-1,fill,5,'#f64b75');
    u.text('boss-state',b.phase==='蓄力'?'红圈锁定 · 立即侧移':b.phase==='重击'?'重击落地':s.progress<108?'即将交锋':'持续射击 · 保住队伍',x,y-20,10,'#ffc6d1',width+70);

  }

  private renderDesktopHud() {
    const u=this.ui,s=this.sim,half=u.height/2,large=u.width>=1300,small=u.width<=1000;
    const left=-u.width/2+(large?56:small?20:40),brandTop=large?42:22;
    const line=(id:string,value:string,x:number,y:number,size=14,hex='#e9f5ff',width=270,bold=false)=>{
      const label=u.text(id,value,x+width/2,half-y,size,hex,width);label.horizontalAlign=Label.HorizontalAlign.LEFT;label.isBold=bold;return label;
    };
    for(let i=0;i<3;i++)u.panel(`brand${i}`,left+4+i*11,half-brandTop-25,7,i===1?47:35,'#38bcf1');
    line('title','最后一道门',left+43,brandTop+20,small?20:25,'#f1f7ff',250,true);
    line('subtitle','蓝焰突围 / 深蓝破阵',left+43,brandTop+51,11,'#aed5f3',230);
    line('mode',`${this.recording?'逐帧录制':this.automatic?'自动演示':'手动战斗'}  |  种子 ${s.seed}`,u.width/2-220,large?54:30,12,'#c3def3',190);
    const journey=large?129:95,journeyWidth=large?250:small?168:233;
    line('route-no',`0${s.route+1}`,left,journey+10,20,'#79cff7',38,true);
    line('route',ROUTES[s.route].name,left+41,journey+10,14,'#c3def3',190,true);
    u.panel('progress-track',left+journeyWidth/2,half-journey-41,journeyWidth,3,'#5f86a444');
    const progress=journeyWidth*clamp(s.progress/112,0,1);
    if(progress>0)u.panel('progress-fill',left+progress/2,half-journey-41,progress,3,'#4dc1ff');
    line('journey',s.progress<20?'射击增员门':s.progress<84?'争夺补给':'迎击赤潮统领',left,journey+57,10,'#9ac5e6',160);
    line('clock',`00:${String(Math.floor(s.time)).padStart(2,'0')}`,left+journeyWidth-39,journey+57,10,'#9ac5e6',40);
    const crewTop=large?209:small?152:157,crewSize=large?99:small?55:84;
    line('crew-caption','真 实 队 伍',left+51,crewTop+12,12,'#92bedf',150);
    line('crew',String(s.crowd.count),left+51,crewTop+crewSize*.72,crewSize,'#ffffff',210,true);
    line('equipment',s.level>1?'脉冲重装兵':'轻装步兵',left+62,crewTop+crewSize*1.43,12,'#7de0ff',190);
    u.panel('equipment-mark',left+52,half-crewTop-crewSize*1.43,2,18,'#49c2ed');
    for(let i=0;i<3;i++){
      const x=left+4+i*11,y=half-crewTop-crewSize*.72+(i===1?6:0);
      u.panel(`crew-body${i}`,x,y,9,20,'#40a5ec');u.panel(`crew-head${i}`,x,y+16,9,9,'#a4e5ff');
    }
    if(!small&&!this.ended){
      const story=large?429:350,late=s.entryAt>=0,upgraded=s.level>1;
      line('eyebrow',late?'先看落点，再移动':upgraded?'火力升级 · 队伍还在前进':'每一发，都改变局面',left,story+20,11,'#75d4fd',280);
      const headline=late?'别站在红圈里。\n带活着的人过桥。':upgraded?'火力已经就位，\n轮到你突围。':'先壮大队伍，\n再杀出重围。';
      const label=line('story',headline,left,story+92,large?33:30,'#e8f6ff',280,true);label.lineHeight=(large?33:30)*1.5;label.node.getComponent(UITransform)!.setContentSize(280,110);
      const detail=line('story-detail',late?'预警锁定的是旧位置。\n侧移躲避，再回来集火。':'瞄准蓝门增加人数。\n击破木箱，获得更强火力。',left,story+182,13,'#b2c6de',280);detail.lineHeight=25;detail.node.getComponent(UITransform)!.setContentSize(280,60);
      u.panel('story-rule',left+17,half-story-230,34,2,'#57bcea');
      line('stats',`击败 ${s.kills}    损失 ${s.losses}`,left,story+262,12,'#aac7e3',270);
    }
    this.renderBossHud();
    if(this.menu)return;
    const bottom=large?34:18,y=-half+bottom+23,width=small?106:133;
    u.button('takeover','接管战斗',left+width/2,y,width,()=>this.takeControl(),true);
    let x=left+width+9;
    for(const [id,label,action] of [['play',this.running?'暂停':'播放',()=>this.toggle()],['restart','重开',()=>this.restart()],['more','更多',()=>this.open('main')]] as const){u.button(id,label,x+33,y,66,action);x+=75;}
    if(!small)u.text('hint',this.save.reduced&&s.tick===0?'已按减少动态效果偏好停止预览 · 点击播放开始':this.running?'左右拖动，自动射击 · A / D 移动':'战斗已暂停 · 点击播放继续',u.width/2-220,-half+bottom+10,11,'#c7d9ed',400);
    if(this.recording)u.button('next-frame','推进一帧',left+60,y+70,120,()=>this.sim.step());
  }

  private renderHud() {
    if(!this.portrait){this.renderDesktopHud();return;}
    const u=this.ui,s=this.sim,h=u.height/2,top=h-u.insets.top,left=-u.width/2;
    const leftText=(id:string,text:string,x:number,y:number,size:number,hex:string,width:number)=>{const label=u.text(id,text,x+width/2,y,size,hex,width);label.horizontalAlign=Label.HorizontalAlign.LEFT;return label;};
    leftText('title','最后一道门',left+50,top-38,u.width<=440?16:18,'#f1f7ff',180).isBold=true;
    leftText('subtitle','蓝焰突围 / 深蓝破阵',left+50,top-59,8,'#aed5f3',180);
    [30,37,30].forEach((height,i)=>u.panel(`brand${i}`,left+21+i*7,top-43,4,height,'#46ceff'));
    leftText('mode',`${this.recording?'逐帧录制':this.automatic?'自动演示':'手动战斗'}  |  种子 ${s.seed}`,left+22,top-88,10,'#c3def3',180);
    leftText('route',`0${s.route+1}  ${ROUTES[s.route].name}`,left+22,top-113,11,'#80d6ff',180).isBold=true;
    u.panel('progress-track',left+88.5,top-128,133,2,'#5f86a444');const progress=133*clamp(s.progress/112,0,1);
    if(progress>0)u.panel('progress-fill',left+22+progress/2,top-128,progress,2,'#4dc1ff');
    leftText('journey',s.progress<20?'射击增员门':s.progress<84?'争夺补给':'首领交锋',left+22,top-139,8,'#acd1e8',90);
    leftText('clock',`${Math.floor(s.time/60).toString().padStart(2,'0')}:${Math.floor(s.time%60).toString().padStart(2,'0')}`,left+130,top-139,8,'#acd1e8',40);
    const hudX=this.portrait?u.width/2-63:left+105,hudY=this.portrait?h-Math.max(53+u.insets.top,u.insets.menuBottom+39):top-225;
    u.panel('crew',hudX,hudY,this.portrait?94:168,this.portrait?58:128,'#163855d9');
    const countX=hudX+(this.portrait?14:0);
    u.text('crew-caption','真实队伍',countX,hudY+(this.portrait?17:39),10,'#9ccde8',this.portrait?56:120);
    const crew=u.text('crew',String(s.crowd.count),countX,hudY-(this.portrait?5:9),this.portrait?32:72,'#ffffff',this.portrait?60:150);crew.isBold=true;
    if(this.portrait)for(let i=0;i<3;i++){
      const x=hudX-31+i*7,y=hudY-(i===1?-3:2);
      u.panel(`crew-body${i}`,x,y,5,15,'#40a5ec');u.panel(`crew-head${i}`,x,y+12,6,6,'#a4e5ff');
    }
    if(!this.portrait) {
      u.text('story','先增员，再升级。\n把火力带到最后。',left+165,h-375,25,'#e8f6ff',280);
      u.text('stats',`击杀 ${s.kills}    损失 ${s.losses}`,left+165,h-440,14,'#aac7e3',270);
      u.text('best',`本机最佳 ${this.save.best[s.route]} 名队员突围`,left+165,h-480,12,'#80ccec',280);
    }
    this.renderBossHud();
    if(this.menu)return;
    const x=this.portrait?10:left+204,y=-h+40+u.insets.bottom;
    u.button('takeover','接管战斗',x-88,y,106,()=>this.takeControl(),true);
    u.button('play',this.running?'暂停':'播放',x-1,y,52,()=>this.toggle());
    u.button('restart','重开',x+57,y,52,()=>this.restart());
    u.button('more','更多',x+115,y,52,()=>this.open('main'));
    if(this.recording)u.button('next-frame','推进一帧',0,-h+136+u.insets.bottom,120,()=>this.sim.step());
    u.text('hint',this.running?(sys.isBrowser?'左右拖动，自动射击 · A / D 移动':'左右拖动，自动射击'):this.save.reduced&&s.tick===0?'已按减少动态效果偏好停止预览 · 点击播放开始':'战斗已暂停 · 点击播放继续',this.portrait?0:u.width/2-205,-h+85+u.insets.bottom,11,'#c7d9ed',this.portrait?365:370);
  }

  private renderMenu() {
    const u=this.ui,w=Math.min(this.portrait?352:720,u.width-28),height=Math.min(740,u.height-68-u.insets.top-u.insets.bottom),top=height/2;
    u.panel('menu-backdrop',0,0,u.width+32,u.height+32,'#061322bb');
    u.panel('menu',0,0,w,height,'#102c48ff');
    if(this.menu==='main'&&height>=720){this.renderFullMenu(w,height);return;}
    u.text('menu-title',this.menu==='main'?'下一次，换个打法。':this.menu==='settings'?'画面与声音':this.menu==='replay'?'输入与实际结果':'本次真实战报',0,top-42,23,'#eaf6ff',w-28);
    if(height<540){this.renderCompactMenu(w,height);return;}
    if(this.menu==='main') {
      ROUTES.forEach((r,i)=>u.button(`route${i}`,`0${i+1}  ${r.name}  ·  ${r.tag}`,0,top-104-i*55,w-44,()=>this.restart(i,false),i===this.sim.route));
      u.button('seed',`挑战种子：${this.sim.seed}`,0,top-278,w-44,()=>void this.seedPrompt());
      u.button('demo','观看 45 秒演示',-w/4+9,top-334,w/2-28,()=>this.restart(this.sim.route,true));
      u.button('manual','手动开始',w/4-9,top-334,w/2-28,()=>this.restart(this.sim.route,false),true);
      u.button('settings','画面与声音',-w/4+9,top-390,w/2-28,()=>this.open('settings'));
      u.button('replays','回放与战报',w/4-9,top-390,w/2-28,()=>this.open('replay'));
      u.text('local-best',`本机最佳：${this.save.best[this.sim.route]} 名队员突围`,0,top-440,12,'#9bc7e5',w-30);
    } else if(this.menu==='settings') {
      u.button('quality',`画质：${this.save.quality}`,0,top-112,w-44,()=>{this.save.quality=this.save.quality==='精细'?'流畅':'精细';this.persist()});
      u.button('sound',`声音：${this.save.sound?'开启':'关闭'}`,0,top-174,w-44,()=>{this.save.sound=!this.save.sound;this.sound.stop();this.persist()});
      u.button('motion',`减少动态效果：${this.save.reduced?'开启':'关闭'}`,0,top-236,w-44,()=>{this.save.reduced=!this.save.reduced;this.persist()});
      u.text('settings-note','流畅画质减少落地效果和火花，\n每名队员和每颗弹丸仍保留真实仿真。',0,top-314,13,'#adcbe4',w-44);
    } else if(this.menu==='replay') {
      u.button('export-replay',sys.isBrowser?'导出种子回放':'复制种子回放',0,top-110,w-44,()=>void this.export(false));
      u.button('import-replay',sys.isBrowser?'导入输入回放':'导入剪贴板回放',0,top-174,w-44,()=>void this.import());
      u.button('report','查看真实战报',0,top-238,w-44,()=>this.open('report'));
      u.button('export-report',sys.isBrowser?'导出真实战报':'复制真实战报',0,top-302,w-44,()=>void this.export(true));
      u.button('copy-link','复制挑战链接',0,top-364,w-44,()=>void this.copyChallenge());
      u.button('share-result','分享真实结果',0,top-426,w-44,()=>void this.shareResult());
    } else {
      u.text('report-body',`${ROUTES[this.sim.route].name} · 种子 ${this.sim.seed}\n\n真实队伍 ${this.sim.crowd.count}    损失 ${this.sim.losses}\n\n击杀 ${this.sim.kills}    射击 ${this.sim.shots}\n\n命中 ${this.sim.hits}    装备升级 ${this.sim.upgrades}\n\n首领剩余耐久 ${this.sim.boss.hp}\n\n${this.sim.outcome} · ${this.sim.time.toFixed(1)} 秒`,0,top-235,16,'#d8edff',w-36).node.getComponent(UITransform)!.setContentSize(w-36,350);
    }
    if(this.menu!=='main')u.button('menu-back','返回更多',0,-top+98,w-44,()=>this.open('main'));
    u.button('close-menu','关闭',0,-top+42,w-44,()=>this.menu='');
  }
  private renderFullMenu(width: number, height: number) {
    const u=this.ui,top=height/2,left=-width/2+20,content=width-40;
    const text=(id:string,value:string,x:number,y:number,size=12,hex='#a9cce4',w=content)=>{
      const label=u.text(id,value,x+w/2,y,size,hex,w);label.horizontalAlign=Label.HorizontalAlign.LEFT;return label;
    };
    const button=(id:string,label:string,x:number,y:number,w:number,action:()=>void,h=44)=>{
      const node=u.button(id,label,x,y,w,action,false,h);const b=u.buttons.get(id)!;b.label.fontSize=12;b.label.lineHeight=20;return node;
    };
    text('menu-kicker','蓝焰突围 · 一点五版',left,top-38,11,'#78b8df',230);
    text('menu-title','下一次，换个打法。',left,top-72,20,'#e9f5ff',content-72).isBold=true;
    button('close-menu','关闭',width/2-53,top-41,68,()=>this.menu='');
    const card=(content-12)/3;
    ROUTES.forEach((route,i)=>{
      const x=left+card/2+i*(card+6);
      button(`route${i}`,`0${i+1} ${route.name}`,x,top-149,card,()=>this.restart(i,false),86);
      const b=u.buttons.get(`route${i}`)!;b.label.node.active=false;
      text(`route-number${i}`,`0${i+1}`,x-card/2+8,top-129,21,'#7ad2fe',card-16).isBold=true;
      text(`route-name${i}`,route.name,x-card/2+8,top-153,13,'#e9f5ff',card-16).isBold=true;
      text(`route-note${i}`,['先增员，再升级','火力与闪避的考验','高压前线挑战'][i],x-card/2+8,top-174,10,'#8db2d0',card-16);
    });
    text('seed-caption','挑战种子',left,top-220,11);
    button('seed',String(this.sim.seed),left+71,top-256,142,()=>void this.seedPrompt());
    button('new-seed','开始挑战',left+192,top-256,86,()=>this.restart(this.sim.route,false));
    button('quality',`画质：${this.save.quality}`,left+44,top-308,88,()=>{this.save.quality=this.save.quality==='精细'?'流畅':'精细';this.persist()});
    button('sound',`声音：${this.save.sound?'开启':'关闭'}`,left+139,top-308,86,()=>{this.save.sound=!this.save.sound;this.sound.stop();this.persist()});
    button('settings','更多设置',left+244,top-308,112,()=>this.open('settings'));
    u.panel('menu-line1',0,top-354,content,1,'#8bb6cf25');
    text('control-caption','同一套规则，三种控制方式',left,top-379,12);
    button('demo','观看45秒演示',left+52,top-420,104,()=>this.restart(this.sim.route,true));
    button('manual','手动开始',left+157,top-420,86,()=>this.restart(this.sim.route,false));
    button('record','录制模式：停在零帧',left+82,top-473,164,()=>{this.restart(this.sim.route,true);this.recording=true;this.pause()});
    u.panel('menu-line2',0,top-522,content,1,'#8bb6cf25');
    text('replay-caption','输入与实际结果',left,top-547,12);
    button('export-replay',sys.isBrowser?'导出种子回放':'复制种子回放',left+52,top-590,104,()=>void this.export(false));
    button('import-replay',sys.isBrowser?'导入输入回放':'导入剪贴板回放',left+161,top-590,104,()=>void this.import());
    button('export-report',sys.isBrowser?'导出真实战报':'复制真实战报',left+52,top-642,104,()=>void this.export(true));
    button('copy-link','复制挑战链接',left+161,top-642,104,()=>void this.copyChallenge());
    button('share-result','分享真实结果',left+52,top-694,104,()=>void this.shareResult());
    button('report','查看真实战报',left+161,top-694,104,()=>this.open('report'));
    text('menu-foot','仅保存本机最佳，点击分享不等于分享成功。',left,top-733,10,'#8eaec8');
  }
  private renderCompactMenu(width: number, height: number) {
    const u=this.ui,s=this.sim,top=height/2;
    type Option={id: string; label: string; action(): void; accent?: boolean};
    let options: Option[]=[];
    if(this.menu==='main') options=[...ROUTES.map((r,i)=>({id:`route${i}`,label:`0${i+1} ${r.name}`,action:()=>this.restart(i,false),accent:i===s.route})),
      {id:'seed',label:`挑战种子：${s.seed}`,action:()=>void this.seedPrompt()},
      {id:'demo',label:'观看 45 秒演示',action:()=>this.restart(s.route,true)},
      {id:'manual',label:'手动开始',action:()=>this.restart(s.route,false),accent:true},
      {id:'settings',label:'画面与声音',action:()=>this.open('settings')},
      {id:'replays',label:'回放与战报',action:()=>this.open('replay')}];
    else if(this.menu==='settings') options=[
      {id:'quality',label:`画质：${this.save.quality}`,action:()=>{this.save.quality=this.save.quality==='精细'?'流畅':'精细';this.persist()}},
      {id:'sound',label:`声音：${this.save.sound?'开启':'关闭'}`,action:()=>{this.save.sound=!this.save.sound;this.sound.stop();this.persist()}},
      {id:'motion',label:`减少动态效果：${this.save.reduced?'开启':'关闭'}`,action:()=>{this.save.reduced=!this.save.reduced;this.persist()}}];
    else if(this.menu==='replay') options=[
      {id:'export-replay',label:sys.isBrowser?'导出种子回放':'复制种子回放',action:()=>void this.export(false)},
      {id:'import-replay',label:sys.isBrowser?'导入输入回放':'导入剪贴板回放',action:()=>void this.import()},
      {id:'report',label:'查看真实战报',action:()=>this.open('report')},
      {id:'export-report',label:sys.isBrowser?'导出真实战报':'复制真实战报',action:()=>void this.export(true)},
      {id:'copy-link',label:'复制挑战链接',action:()=>void this.copyChallenge()},
      {id:'share-result',label:'分享真实结果',action:()=>void this.shareResult()}];
    else u.text('compact-report',`${ROUTES[s.route].name} · ${s.outcome}\n种子 ${s.seed} · ${s.time.toFixed(1)} 秒\n队伍 ${s.crowd.count} · 损失 ${s.losses}\n射击 ${s.shots} · 命中 ${s.hits}\n击杀 ${s.kills} · 首领耐久 ${s.boss.hp}`,0,5,14,'#d8edff',width-36).node.getComponent(UITransform)!.setContentSize(width-36,height-150);
    const count=Math.max(2,Math.floor((height-150)/54)),pages=Math.max(1,Math.ceil(options.length/count));
    this.menuPage=clamp(this.menuPage,0,pages-1);
    options.slice(this.menuPage*count,(this.menuPage+1)*count).forEach((option,i)=>u.button(option.id,option.label,0,top-102-i*54,width-40,option.action,option.accent));
    const navigation:Option[]=[];
    if(this.menuPage>0)navigation.push({id:'prev-page',label:'上一页',action:()=>this.menuPage--});
    if(this.menuPage<pages-1)navigation.push({id:'next-page',label:'下一页',action:()=>this.menuPage++});
    if(this.menu!=='main')navigation.push({id:'menu-back',label:'返回',action:()=>this.open('main')});
    navigation.push({id:'close-menu',label:'关闭',action:()=>this.menu=''});
    const cell=(width-32)/navigation.length;
    navigation.forEach((option,i)=>u.button(option.id,option.label,(i-(navigation.length-1)/2)*cell,-top+40,cell-8,option.action));
  }
  private renderResult() {
    const u=this.ui,s=this.sim,large=u.width>=1300;
    const w=this.portrait?Math.min(u.width-54,u.width>=700?470:u.width<=440?320:370):(large?306:300);
    const top=this.portrait?(u.width>=700?222:u.width<=440?135:166):Math.min(large?405:345,u.height-300);
    const height=224,x=this.portrait?0:-u.width/2+(large?56:40)+w/2,y=u.height/2-top-height/2;
    const line=(id:string,value:string,dy:number,size=12,hex='#aacbe4')=>{const label=u.text(id,value,x,y+height/2-dy,size,hex,w-38);label.horizontalAlign=Label.HorizontalAlign.LEFT;return label;};
    u.panel('result',x,y,w,height,'#0d2a44f2');
    line('result-kicker',s.outcome==='胜利'?'真实突破':'真实战报',24,10,'#80c5ec');
    line('result-title',s.outcome==='胜利'?'突破封锁':s.outcome==='失败'?'队伍全灭':'尚未突破',54,24,'#ecf8ff').isBold=true;
    line('result-summary',s.outcome==='胜利'?`统领倒下，${s.crowd.count} 名队员活着抵达。`:s.outcome==='失败'?`队伍已耗尽，统领剩余 ${s.boss.hp} 点耐久。`:`四十五秒内尚未击败统领，剩余耐久 ${s.boss.hp}。`,91,12);
    u.panel('result-line',x,y+height/2-110,w-38,1,'#6a83933b');
    line('result-detail',`击败 ${s.kills} 人　损失 ${s.losses} 人　${s.level===2?'已获得脉冲装备':'未获得脉冲装备'}`,126,10);
    line('result-best',this.save.best[s.route]?`本地最佳：${this.save.best[s.route]} 人幸存`:'本地最佳：尚无手动通关记录',151,10,'#87b4d4');
    u.button('retry','同种子再战',x,y-height/2+37,w-38,()=>this.restart(s.route,false),true,40);
  }
  onDestroy() { this.art?.destroy(); this.ui?.destroy(); }
}
