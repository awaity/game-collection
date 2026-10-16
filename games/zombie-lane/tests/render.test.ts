import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World } from '../src/render/world.ts';
import { Game } from '../src/core/game.ts';
import type { Platform } from '../src/platform/types.ts';
test('upgrade and longer victory effects never produce a negative Canvas ellipse radius',()=>{
  let ellipseCount=0;
  const context=new Proxy({createLinearGradient:()=>({addColorStop(){}}),ellipse:(_x:number,_y:number,rx:number,ry:number)=>{assert.ok(rx>=0&&ry>=0,`invalid ellipse radius ${rx}, ${ry}`);ellipseCount++;}},{get:(object,key)=>key in object?(object as any)[key]:()=>{},set:(object,key,value)=>{(object as any)[key]=value;return true;}}) as unknown as CanvasRenderingContext2D;
  const platform={createCanvas:()=>({width:128,height:160,getContext:()=>context}),reducedMotion:false} as unknown as Platform;
  const world=new World(platform),game=new Game();game.phase='won';
  world.events([{kind:'win',x:2,z:10}]);for(let i=0;i<200;i++){world.draw(context,game,900,i/60);world.animate(1/60);}
  world.events([{kind:'upgrade',x:2,z:0}]);for(let i=0;i<90;i++){world.draw(context,game,700,i/60);world.animate(1/60);}
  assert.ok(ellipseCount>100);
});
