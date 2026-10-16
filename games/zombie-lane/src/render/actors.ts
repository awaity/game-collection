import type { Platform, Surface } from '../platform/types';
import { ellipse, poly, rect } from './draw';
export type ActorKind = 'soldier' | 'walker' | 'runner' | 'brute' | 'boss';

/** Locally generated sprite atlas. No network assets, fonts or DOM canvases. */
export class Actors {
  private sprites = new Map<string, Surface>();
  constructor(private platform: Platform) {
    for (const kind of ['soldier','walker','runner','brute','boss'] as ActorKind[]) for(let frame=0;frame<8;frame++) this.sprites.set(`${kind}:${frame}`,this.make(kind,frame));
  }
  draw(ctx: CanvasRenderingContext2D, kind: ActorKind, x: number, y: number, scale: number, time: number, flash = false, moving = true) {
    const frame = moving ? Math.floor(time * (kind==='runner'?13:8))%8 : 0;
    const image = this.sprites.get(`${kind}:${frame}`)!;
    const size = kind==='boss'?2.65:kind==='brute'?1.45:1;
    const s = scale * size;
    ellipse(ctx,x+4*s,y+2*s,15*s,6*s,'#253f3730');
    ctx.drawImage(image as CanvasImageSource,x-32*s,y-77*s,64*s,80*s);
    if(flash){ctx.globalAlpha=.35;ellipse(ctx,x,y-36*s,15*s,21*s,'#fff8c2');ctx.globalAlpha=1;}
  }
  private make(kind: ActorKind, frame: number) {
    const canvas=this.platform.createCanvas(128,160),ctx=canvas.getContext('2d')!;
    ctx.scale(2,2);ctx.translate(32,77);
    const phase=frame/8*Math.PI*2,step=Math.sin(phase),bob=Math.abs(Math.cos(phase))*1.3;
    ctx.translate(0,-bob);
    const soldier=kind==='soldier',boss=kind==='boss',runner=kind==='runner';
    const skin=soldier?'#e5b98b':boss?'#a1b083':runner?'#b4bba1':'#9cb88b';
    const skinShadow=soldier?'#bd8562':boss?'#687c60':'#6e8e66';
    const shirt=soldier?'#e7a442':boss?'#694d58':runner?'#a77459':kind==='brute'?'#596c6d':'#777087';
    const shadow=soldier?'#b77328':boss?'#493747':runner?'#7f4c3e':'#4a4d62';
    // Offset boots and knees create a readable stride even at small sizes.
    for(const side of [-1,1]){
      const sy=step*side*3.1,sx=side*6;
      rect(ctx,sx-4,-20+sy,8,17,shadow,3);
      poly(ctx,[[sx-4,-7+sy],[sx+3,-7+sy],[sx+6,-1+sy],[sx-5,1+sy],[sx-6,-2+sy]],'#344847');
      rect(ctx,sx-3,-6+sy,5,2,'#52625b',1);
    }
    // Rounded body with directional light, pouches, seam and belt.
    rect(ctx,-13,-43,26,26,shadow,6);
    rect(ctx,-13,-44,21,23,shirt,6);
    poly(ctx,[[-12,-40],[-3,-44],[9,-42],[7,-31],[-11,-30]],soldier?'#f6bc52':skinShadow);
    if(soldier){
      rect(ctx,-9,-43,4,24,'#536a57',1);rect(ctx,6,-43,4,24,'#536a57',1);
      rect(ctx,-8,-38,16,15,'#6c7d5b',3);rect(ctx,-6,-36,12,4,'#8c9b68',1);rect(ctx,-11,-23,23,4,'#40584d',1);
      rect(ctx,-13,-29,6,8,'#c38e31',1);rect(ctx,9,-29,6,8,'#c38e31',1);
    }else{
      poly(ctx,[[-8,-40],[2,-34],[-3,-21],[-10,-26]],shirt);
      poly(ctx,[[6,-37],[11,-32],[9,-25],[4,-28]],skin);
      rect(ctx,-11,-21,23,4,'#3c4646',1);rect(ctx,-2,-21,5,4,'#aaa07b',1);
      rect(ctx,-8,-33,3,7,'#c1a69b',1);
    }
    // Arms: soldier carries a weapon; zombies reach toward the defense line.
    for(const side of [-1,1]){
      ctx.save();ctx.translate(side*14,-37);ctx.rotate(side*(soldier?-.18:.12)+step*side*.12);
      rect(ctx,-4,-2,8,soldier?17:13,shadow,3);rect(ctx,-4,-2,6,11,shirt,3);
      rect(ctx,-3,soldier?9:7,7,soldier?7:14,skinShadow,3);rect(ctx,-3,soldier?9:7,5,soldier?6:12,skin,2);
      if(!soldier)rect(ctx,-4,16,8,6,skin,2);
      ctx.restore();
    }
    // Neck, ears, broad faceted head.
    rect(ctx,-5,-48,11,8,skinShadow,2);rect(ctx,-18,-59,5,9,skinShadow,2);rect(ctx,13,-59,5,9,skinShadow,2);
    rect(ctx,-15,-69,30,25,skinShadow,7);rect(ctx,-15,-69,25,23,skin,7);
    poly(ctx,[[-12,-68],[8,-69],[13,-64],[-14,-62]],soldier?'#f0c79c':'#c0ccaa');
    if(soldier){
      rect(ctx,-17,-72,33,18,'#a57d2f',8);rect(ctx,-17,-73,29,17,'#e6bd4c',8);
      poly(ctx,[[-12,-72],[7,-74],[12,-69],[-15,-68]],'#ffdc72');
      rect(ctx,-18,-58,35,5,'#b58932',2);rect(ctx,-3,-72,6,17,'#6c7952',1);
      rect(ctx,-7,-55,16,5,'#586e59',2);rect(ctx,-4,-53,10,4,'#81946a',1);
    }else{
      // Ragged hair, sunken sockets, one tooth and the asymmetrical brow.
      poly(ctx,[[-14,-63],[-15,-69],[-9,-73],[-4,-70],[0,-73],[8,-71],[13,-66],[8,-65],[5,-68],[-7,-66]],boss?'#493f49':'#4e6156');
      rect(ctx,-11,-59,8,6,'#3c5047',2);rect(ctx,4,-59,8,6,'#3c5047',2);
      rect(ctx,-8,-57,3,2,boss?'#ff8563':'#f7df9a',1);rect(ctx,6,-57,3,2,boss?'#ff8563':'#f7df9a',1);
      poly(ctx,[[-3,-55],[1,-58],[3,-51],[-2,-51]],skinShadow);
      rect(ctx,-6,-49,13,4,'#52604b',1);rect(ctx,-3,-49,3,3,'#ece6bc');
      if(boss){rect(ctx,-17,-70,35,6,'#d9a448',1);poly(ctx,[[-15,-68],[-17,-78],[-8,-73],[0,-80],[7,-73],[16,-78],[14,-68]],'#e8b953');}
    }
    return canvas;
  }
}
