/** Fixed-step runner rules. No engine, browser or platform APIs belong here. */
export const DT = 1 / 60;
export const LANE_WIDTH = 1.55;
export const JUMP_TIME = .9;
export const SLIDE_TIME = .82;
export const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));
export type Action = 'left' | 'right' | 'jump' | 'slide' | 'wind';
export type Mode = 'endless' | 'trial' | 'daily' | 'training';
export type Phase = 'ready' | 'running' | 'paused' | 'dying' | 'dead' | 'won';
export type HazardKind = 'root' | 'lintel' | 'gap' | 'rock' | 'fire' | 'blade';
export type PickupKind = 'jade' | 'magnet' | 'shield' | 'wind' | 'scroll';

export const AREAS = [
  {name: '昆仑悬道', short: '昆仑', beast: '陆吾', copy: '云海之上，沿帝之下都的旧道奔行。', sky:'#bddbd5', fog:'#a8c9bd', stone:'#c9bd99', edge:'#617d67', leaf:'#477e6c', accent:'#e3b55f'},
  {name: '青丘古林', short: '青丘', beast: '九尾狐', copy: '狐鸣穿林，盘根与落花遮住前路。', sky:'#c2cedb', fog:'#c5c8d5', stone:'#b6aaa4', edge:'#625d81', leaf:'#b87892', accent:'#ecc5aa'},
  {name: '赤水丹崖', short: '赤水', beast: '毕方', copy: '赤水环山，跨过熔火与摇曳的残桥。', sky:'#df9e78', fog:'#ba7968', stone:'#9c6650', edge:'#563e43', leaf:'#a84336', accent:'#ffd082'},
  {name: '归墟海桥', short: '归墟', beast: '精卫', copy: '潮声不息，循着精卫的羽光越过海桥。', sky:'#91c8d2', fog:'#82b7c4', stone:'#bad3ce', edge:'#447d87', leaf:'#4d9c9d', accent:'#baf0e6'},
] as const;
export const TRIALS = [
  {name:'云门初行', area:0, distance:450, difficulty:0, description:'越过盘根与断桥，找到第一片山海图。'},
  {name:'悬道九折', area:0, distance:750, difficulty:1, description:'连续转弯，追兽会更快逼近。'},
  {name:'狐影穿林', area:1, distance:600, difficulty:1, description:'在低枝与石阵间穿行。'},
  {name:'青丘夜语', area:1, distance:850, difficulty:2, description:'避开移动石障，收集林中的古卷。'},
  {name:'赤水踏火', area:2, distance:650, difficulty:2, description:'跳过火障，穿过火鸟的石门。'},
  {name:'丹崖飞渡', area:2, distance:950, difficulty:3, description:'高处无护栏，接连越过断桥。'},
  {name:'精卫引路', area:3, distance:750, difficulty:2, description:'跟随羽光，穿越海上的浮桥。'},
  {name:'山海归途', area:3, distance:1100, difficulty:3, description:'完成最后的急转与险桥，补全山海图。'},
] as const;

export class Random {
  constructor(public state: number) { this.state = (state >>> 0) || 0x6d2b79f5; }
  next() { let x=this.state; x^=x<<13; x^=x>>>17; x^=x<<5; this.state=x>>>0; return this.state/4294967296; }
  int(max: number) { return Math.floor(this.next()*max); }
}
export interface Segment { id:number; start:number; length:number; x:number; z:number; heading:number; turn:-1|1; area:number; }
export interface Hazard { id:number; d:number; kind:HazardKind; lane:number; wide:boolean; half:number; phase:number; hit:boolean; passed:boolean; }
export interface Pickup { id:number; d:number; lane:number; height:number; kind:PickupKind; taken:boolean; }
export interface RunOptions {seed?:number; mode?:Mode; trial?:number; area?:number; upgrades?:Partial<Upgrades>;}
export interface Upgrades {magnet:number; shield:number; wind:number; fortune:number;}
export interface RunEvent {type:'jade'|'jump'|'slide'|'turn'|'hit'|'death'|'power'|'area'|'win'|'revive'; value?:string|number;}
export interface RunStats {coins:number; jumps:number; slides:number; turns:number; dodges:number; powers:number; stumbles:number; scrolls:number; areas:number;}

export class Run {
  readonly seed:number;
  readonly mode:Mode;
  readonly trial:number;
  readonly initialArea:number;
  readonly upgrades:Upgrades;
  readonly random:Random;
  segments:Segment[]=[];
  hazards:Hazard[]=[];
  pickups:Pickup[]=[];
  events:RunEvent[]=[];
  stats:RunStats={coins:0,jumps:0,slides:0,turns:0,dodges:0,powers:0,stumbles:0,scrolls:0,areas:0};
  scrollAreas:number[]=[];
  phase:Phase='ready';
  tick=0;
  distance=0;
  x=0;
  targetLane=0;
  jumpAge=-1;
  slideRemaining=0;
  pressure=.28;
  stumbleRemaining=0;
  invincible=0;
  lastHit=-100;
  magnet=0;
  shield=0;
  wind=0;
  spirit=0;
  combo=0;
  bestCombo=0;
  comboRemaining=0;
  deathTime=0;
  deathReason='';
  deathKind='';
  revived=false;
  queuedTurn=false;
  currentSegment=0;
  area=0;
  private nextId=1;
  private generated=0;

  constructor(options:RunOptions={}) {
    this.seed=(options.seed??42)>>>0;
    this.mode=options.mode??'endless';
    this.trial=clamp(Math.floor(options.trial??0),0,TRIALS.length-1);
    this.initialArea=this.mode==='trial'?TRIALS[this.trial].area:clamp(Math.floor(options.area??0),0,3);
    this.area=this.initialArea;
    this.upgrades={magnet:0,shield:0,wind:0,fortune:0,...options.upgrades};
    for(const key of Object.keys(this.upgrades) as (keyof Upgrades)[])this.upgrades[key]=clamp(Math.floor(this.upgrades[key]||0),0,5);
    if(this.mode==='daily'||this.mode==='training')this.upgrades={magnet:0,shield:0,wind:0,fortune:0};
    this.random=new Random(this.seed);
    this.extend();
  }
  get time(){return this.tick*DT;}
  get speed(){
    const difficulty=this.mode==='trial'?TRIALS[this.trial].difficulty:0;
    const base=this.mode==='training'?8.5:Math.min(19.2,10.5+difficulty*.8+this.distance/350);
    return (base+(this.wind>0?5:0))*(this.stumbleRemaining>0?.70:1);
  }
  get height(){return this.jumpAge<0?0:Math.sin(clamp(this.jumpAge/JUMP_TIME,0,1)*Math.PI)*2.25;}
  get sliding(){return this.slideRemaining>0;}
  get segment(){return this.segments.find(s=>s.id===this.currentSegment)!;}
  get cornerDistance(){const s=this.segment;return s.start+s.length-this.distance;}
  get canTurn(){return this.cornerDistance<=this.speed*1.25+2&&this.cornerDistance>=-2;}
  get turnDirection(){return this.segment.turn;}
  get goal(){return this.mode==='trial'?TRIALS[this.trial].distance:this.mode==='training'?132:Infinity;}
  get score(){return Math.floor((this.distance+this.stats.coins*5+this.bestCombo*3)*(1+this.upgrades.fortune*.05));}
  start(){if(this.phase==='ready')this.phase='running';}
  pause(){if(this.phase==='running')this.phase='paused';}
  resume(){if(this.phase==='paused')this.phase='running';}
  drainEvents(){const result=this.events;this.events=[];return result;}

  input(action:Action):boolean {
    if(this.phase!=='running')return false;
    if(action==='left'||action==='right') {
      const direction=action==='left'?-1:1;
      if(this.canTurn) {
        if(this.queuedTurn)return true;
        if(direction!==this.turnDirection){this.fatal('turn','转错了方向，前方没有古道');return false;}
        this.queuedTurn=true;return true;
      }
      this.targetLane=clamp(this.targetLane+direction,-1,1);return true;
    }
    if(action==='jump') {
      if(this.jumpAge>=0||this.sliding)return false;
      this.jumpAge=0;this.stats.jumps++;this.events.push({type:'jump'});return true;
    }
    if(action==='slide') {
      if(this.jumpAge>=0||this.sliding)return false;
      this.slideRemaining=SLIDE_TIME;this.stats.slides++;this.events.push({type:'slide'});return true;
    }
    if(action==='wind'&&this.spirit>=100&&this.wind<=0) {
      this.spirit=0;this.activate('wind');return true;
    }
    return false;
  }

  step() {
    if(this.phase==='dying') {this.deathTime+=DT;if(this.deathTime>=1.05)this.phase='dead';return;}
    if(this.phase!=='running')return;
    this.tick++;
    this.events=this.events.slice(-80);
    this.x+=(this.targetLane-this.x)*Math.min(1,DT*14);
    if(this.jumpAge>=0){this.jumpAge+=DT;if(this.jumpAge>=JUMP_TIME)this.jumpAge=-1;}
    const wasFlying=this.wind>0;
    if(wasFlying&&this.canTurn)this.queuedTurn=true;
    for(const field of ['slideRemaining','stumbleRemaining','invincible','magnet','shield','wind','comboRemaining'] as const)this[field]=Math.max(0,this[field]-DT);
    if(wasFlying&&this.wind<=0){this.jumpAge=JUMP_TIME*.3;this.invincible=1.1;}
    if(!this.comboRemaining)this.combo=0;
    if(this.time-this.lastHit>2)this.pressure=Math.max(.08,this.pressure-DT*.07);
    const before=this.distance;
    this.distance+=this.speed*DT;
    this.extend();
    const segment=this.segment;
    if(this.distance>=segment.start+segment.length) {
      if(this.queuedTurn||this.wind>0) {
        this.currentSegment++;this.queuedTurn=false;this.stats.turns++;
        this.events.push({type:'turn',value:segment.turn});
        this.targetLane=0;
        const next=this.segment;
        if(next.area!==this.area){this.area=next.area;this.stats.areas++;this.events.push({type:'area',value:this.area});}
      }else if(this.distance>=segment.start+segment.length+1.3){this.fatal('fall','错过路口，坠入云海');return;}
    }
    for(const hazard of this.hazards) {
      if(hazard.passed)continue;
      if(hazard.d-hazard.half<=this.distance&&hazard.d+hazard.half>=before&&!hazard.hit) {
        const lane=this.hazardLane(hazard);
        const crosses=hazard.wide||Math.abs(this.x-lane)<.65;
        if(crosses&&this.wind<=0) {
          const hits=hazard.kind==='gap'?this.height<.35:
            hazard.kind==='lintel'?!this.sliding:
            hazard.kind==='root'||hazard.kind==='fire'?this.height<.95:
            hazard.kind==='blade'?this.height<1.6:this.height<1.95;
          if(hits) {
            if(hazard.kind==='gap'){this.fatal('fall','没有越过断桥');return;}
            if(this.invincible<=0){hazard.hit=true;this.hit();if(this.phase!=='running')return;}
          }
        }
      }
      if(this.distance>hazard.d+hazard.half){hazard.passed=true;if(!hazard.hit){this.stats.dodges++;this.combo++;this.comboRemaining=4;this.bestCombo=Math.max(this.bestCombo,this.combo);}}
    }
    for(const pickup of this.pickups) {
      if(pickup.taken||pickup.d<before-1||pickup.d>this.distance+(this.magnet>0?10:1.2))continue;
      const attracts=pickup.kind==='jade'&&(this.magnet>0||this.wind>0);
      if(attracts||(Math.abs(pickup.lane-this.x)<.65&&Math.abs(pickup.height-(this.height+.95))<1.25&&pickup.d<=this.distance+1.2)) {
        pickup.taken=true;
        if(pickup.kind==='jade'){this.stats.coins++;this.spirit=Math.min(100,this.spirit+3);this.events.push({type:'jade'});}
        else if(pickup.kind==='scroll'){this.stats.scrolls++;const area=this.sample(pickup.d).area;if(!this.scrollAreas.includes(area))this.scrollAreas.push(area);this.events.push({type:'power',value:'scroll'});}
        else this.activate(pickup.kind);
      }
    }
    if(this.distance>=this.goal){this.distance=this.goal;this.phase='won';this.events.push({type:'win'});}
    this.hazards=this.hazards.filter(h=>h.d>this.distance-15);
    this.pickups=this.pickups.filter(p=>p.d>this.distance-8);
    this.segments=this.segments.filter(s=>s.id>=this.currentSegment-2);
  }

  private hit() {
    if(this.shield>0){this.shield=0;this.invincible=1;this.events.push({type:'power',value:'blocked'});return;}
    this.stats.stumbles++;this.pressure+=.62;this.lastHit=this.time;
    this.stumbleRemaining=1.2;this.invincible=.9;this.combo=0;this.events.push({type:'hit'});
    if(this.pressure>=1)this.fatal('caught','连续失误，被守山兽追上了');
  }
  private fatal(kind:string,reason:string) {
    this.phase='dying';this.deathReason=reason;this.deathKind=kind;this.deathTime=0;
    this.events.push({type:'death',value:kind});
  }
  activate(kind:'magnet'|'shield'|'wind') {
    if(kind==='magnet')this.magnet=6+this.upgrades.magnet*1.5;
    if(kind==='shield')this.shield=10+this.upgrades.shield*2;
    if(kind==='wind'){this.wind=3+this.upgrades.wind*.6;this.jumpAge=-1;this.slideRemaining=0;}
    this.stats.powers++;this.events.push({type:'power',value:kind});
  }
  revive() {
    if(this.phase!=='dead'||this.revived||this.mode==='daily'||this.mode==='training')return false;
    this.revived=true;this.phase='running';this.pressure=.08;this.invincible=3;this.wind=2;
    this.jumpAge=-1;this.slideRemaining=0;this.distance+=8;
    while(this.distance>=this.segment.start+this.segment.length)this.currentSegment++;
    this.queuedTurn=false;this.targetLane=0;this.x=0;this.extend();this.area=this.segment.area;
    this.events.push({type:'revive'});return true;
  }
  hazardLane(hazard:Hazard,at=this.time){return hazard.kind==='blade'?Math.sin(at*1.65+hazard.phase)*1.05:hazard.lane;}

  sample(d:number,lane=0) {
    const segment=this.segments.find(s=>d>=s.start&&d<s.start+s.length)??(d<this.segments[0].start?this.segments[0]:this.segments[this.segments.length-1]);
    const along=d-segment.start;
    return {x:segment.x+Math.sin(segment.heading)*along+Math.cos(segment.heading)*lane*LANE_WIDTH,z:segment.z-Math.cos(segment.heading)*along+Math.sin(segment.heading)*lane*LANE_WIDTH,heading:segment.heading,area:segment.area};
  }

  private extend() {
    while(!this.segments.length||this.segments[this.segments.length-1].start+this.segments[this.segments.length-1].length<this.distance+360) {
      const prior=this.segments[this.segments.length-1],id=this.generated++;
      const turn=(id===0?-1:this.random.int(2)?1:-1) as -1|1;
      const length=id===0?116:82+this.random.int(4)*12;
      const area=this.mode==='trial'||this.mode==='training'?this.initialArea:(this.initialArea+Math.floor(id/4))%4;
      const segment:Segment={id,start:prior?prior.start+prior.length:0,length,x:prior?prior.x+Math.sin(prior.heading)*prior.length:0,z:prior?prior.z-Math.cos(prior.heading)*prior.length:0,heading:prior?prior.heading+prior.turn*Math.PI/2:0,turn,area};
      this.segments.push(segment);this.populate(segment);
    }
  }
  private populate(segment:Segment) {
    const {start,length,id,area}=segment;
    const types:HazardKind[][]=[['root','lintel','rock','gap'],['lintel','root','blade','rock'],['fire','gap','rock','lintel'],['gap','blade','lintel','root']];
    const first:HazardKind[]=['root','lintel','rock','gap'];
    let ordinal=0;
    for(let offset=id===0?31:20;offset<length-24;offset+=22+this.random.int(3)*2) {
      const kind=id===0&&(this.mode==='training'||area===0)?first[ordinal%first.length]:types[area][this.random.int(types[area].length)];
      const lane=id===0&&kind==='rock'?0:this.random.int(3)-1;
      this.hazards.push({id:this.nextId++,d:start+offset,kind,lane,wide:['root','lintel','gap','fire'].includes(kind),half:kind==='gap'?2.1:kind==='lintel'?1.1:.75,phase:this.random.next()*Math.PI*2,hit:false,passed:false});ordinal++;
    }
    const lane=id===0?0:this.random.int(3)-1;
    for(let offset=12;offset<length-18;offset+=2.5) {
      const d=start+offset,near=this.hazards.find(h=>Math.abs(h.d-d)<4&&(h.kind==='gap'||h.kind==='root'||h.kind==='fire'));
      const height=near?1+Math.cos((d-near.d)/4*Math.PI/2)*1.5:1;
      this.pickups.push({id:this.nextId++,d,lane,height,kind:'jade',taken:false});
    }
    if(id%3===1)this.pickups.push({id:this.nextId++,d:start+12,lane:0,height:1,kind:(['magnet','shield','wind'] as const)[Math.floor(id/3)%3],taken:false});
    if(id%4===2)this.pickups.push({id:this.nextId++,d:start+length-18,lane:0,height:1,kind:'scroll',taken:false});
  }
  snapshot(){return {phase:this.phase,tick:this.tick,distance:Math.round(this.distance*100)/100,x:Math.round(this.x*1000)/1000,area:this.area,segment:this.currentSegment,turn:this.turnDirection,corner:Math.round(this.cornerDistance*100)/100,queued:this.queuedTurn,score:this.score,pressure:Math.round(this.pressure*1000)/1000,stats:{...this.stats},powers:{magnet:this.magnet,shield:this.shield,wind:this.wind},seed:this.seed,entities:{segments:this.segments.length,hazards:this.hazards.length,pickups:this.pickups.length}};}
}

/** Drives public player inputs only; used for legal playthrough verification. */
export function pilot(run:Run) {
  if(run.phase!=='running')return;
  if(run.canTurn) {if(!run.queuedTurn&&run.cornerDistance<run.speed*.8)run.input(run.turnDirection<0?'left':'right');return;}
  const hazard=run.hazards.find(h=>!h.passed&&!h.hit&&h.d+h.half>run.distance);
  if(hazard&&hazard.d-run.distance<run.speed*.52) {
    if(['root','fire','gap'].includes(hazard.kind)&&run.jumpAge<0&&!run.sliding)run.input('jump');
    else if(hazard.kind==='lintel'&&!run.sliding&&run.jumpAge<0)run.input('slide');
    else if(['rock','blade'].includes(hazard.kind)) {
      const lane=run.hazardLane(hazard,run.time+Math.max(0,hazard.d-run.distance)/run.speed);
      const safe=lane>=0?-1:1;
      if(run.targetLane!==safe)run.input(run.targetLane<safe?'right':'left');
    }
  } else if(!hazard||hazard.d-run.distance>run.speed*1.25) {
    const coin=run.pickups.find(p=>!p.taken&&p.d>run.distance+2&&p.d<run.distance+12);
    if(coin&&run.targetLane!==coin.lane)run.input(run.targetLane<coin.lane?'right':'left');
  }
}
