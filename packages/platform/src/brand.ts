/** Original 开局游戏 gate/play mark. Coordinates also define the published SVG. */
export const BRAND={name:'开局游戏',purple:'#6254c7',ink:'#292943',paper:'#f5f5fb',orange:'#ffb46b',muted:'#77748d'};
export const GATE_PATHS=[[[22,22],[45,22],[45,33],[33,33],[33,74],[22,74]],[[53,22],[76,22],[76,74],[65,74],[65,33],[53,33]],[[46,44],[63,55],[46,66]]] as const;

/** A clock shared by all native renderers. Skip consumes the gesture, never starts a game. */
export class Entrance {
  private since:number|null=null;
  private requested=false;
  done=false;
  progress=0;
  reduced=false;
  constructor(){this.update(0,false);}
  update(now:number,ready=true){
    if(this.done)return false;
    if(!ready){this.publish(false);return true;}
    if(this.since===null)this.since=now;
    this.progress=Math.min(1,Math.max(0,(now-this.since)/(this.reduced?120:850)));
    this.done=this.requested||this.progress>=1;
    this.publish(ready);
    return !this.done;
  }
  skip(){this.requested=true;}
  private publish(ready:boolean){if((globalThis as {__COLLECTION_TEST__?:boolean}).__COLLECTION_TEST__)(globalThis as {__collectionEntrance?:unknown}).__collectionEntrance={ready,done:this.done,progress:this.progress};}
}

export function drawBrand(ctx:CanvasRenderingContext2D,w:number,h:number,progress:number,ready=true,dpr=1){
  const opening=Math.max(0,(progress-.62)/.38),reveal=opening*opening*(3-2*opening);
  ctx.save();ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=BRAND.paper;
  ctx.fillRect(-w/2*reveal,0,w/2+1,h);ctx.fillRect(w/2+w/2*reveal,0,w/2+1,h);ctx.globalAlpha=1-reveal;
  const size=Math.min(100,w*.25,h*.24),cx=w/2,cy=h*.42;
  ctx.save();ctx.translate(cx-size/2,cy-size/2);ctx.scale(size/96,size/96);
  ctx.fillStyle=BRAND.purple;ctx.beginPath();ctx.moveTo(22,0);ctx.lineTo(74,0);ctx.quadraticCurveTo(96,0,96,22);ctx.lineTo(96,74);ctx.quadraticCurveTo(96,96,74,96);ctx.lineTo(22,96);ctx.quadraticCurveTo(0,96,0,74);ctx.lineTo(0,22);ctx.quadraticCurveTo(0,0,22,0);ctx.fill();
  GATE_PATHS.forEach((path,i)=>{const shift=i<2?(i===0?-1:1)*Math.sin(Math.min(1,progress)*Math.PI)*3:0;ctx.fillStyle=i===2?BRAND.orange:'#ffffff';ctx.beginPath();path.forEach(([x,y],j)=>j?ctx.lineTo(x+shift,y):ctx.moveTo(x+shift,y));ctx.closePath();ctx.fill();});ctx.restore();
  ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=BRAND.ink;ctx.font='800 27px sans-serif';ctx.fillText(BRAND.name,cx,cy+size/2+38);
  ctx.fillStyle=BRAND.muted;ctx.font='14px sans-serif';ctx.fillText(ready?'准备好，开一局。':'正在准备游戏…',cx,cy+size/2+72);
  ctx.fillStyle=BRAND.purple;ctx.font='13px sans-serif';ctx.fillText(ready?'轻触跳过入场动画':'请稍候',cx,h-Math.max(48,h*.12));ctx.restore();
}
