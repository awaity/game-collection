import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
for(const target of ['weixin','douyin'])test(`${target} production bundle boots and plays in a host with no window/document/HTMLCanvasElement`,async()=>{
  const code=await readFile(`dist/${target}/game.js`,'utf8'),callbacks:Record<string,Function>={},texts:string[]=[];let frame:Function|undefined,now=0,draws=0;
  const ctx=new Proxy({createLinearGradient:()=>({addColorStop(){}}),drawImage:()=>draws++,fillText:(text:string)=>texts.push(text),ellipse:(_x:number,_y:number,rx:number,ry:number)=>assert.ok(rx>=0&&ry>=0)},{get:(object,key)=>key in object?(object as any)[key]:()=>{},set:(object,key,value)=>{(object as any)[key]=value;return true;}});
  const api:any={createCanvas:()=>({width:390,height:844,getContext:()=>ctx}),getSystemInfoSync:()=>({windowWidth:390,windowHeight:844,pixelRatio:1}),getStorageSync:()=>null,setStorageSync(){},createInnerAudioContext:()=>({play(){},stop(){},seek(){},onError(){}})};
  for(const event of ['TouchStart','TouchMove','TouchEnd','TouchCancel','Show','Hide','WindowResize'])api['on'+event]=(fn:Function)=>callbacks[event]=fn;
  const host={console,performance:{now:()=>now},requestAnimationFrame:(cb:Function)=>{frame=cb;return 1;},cancelAnimationFrame(){},[target==='weixin'?'wx':'tt']:api};
  assert.doesNotThrow(()=>runInNewContext(code,host));assert.ok(draws>0);assert.ok(callbacks.TouchStart);assert.ok(frame);
  // Start with a touch at the shared Canvas menu button, then drag and background.
  callbacks.TouchStart({changedTouches:[{identifier:1,clientX:190,clientY:731}]});callbacks.TouchEnd({changedTouches:[{identifier:1,clientX:190,clientY:731}]});
  for(let i=0;i<120;i++){now+=1000/60;frame!();}
  assert.ok(texts.includes('呼叫空袭'),'the start touch must enter the playable HUD');
  callbacks.TouchStart({changedTouches:[{identifier:2,clientX:195,clientY:500}]});callbacks.TouchMove({changedTouches:[{identifier:2,clientX:40,clientY:500}]});callbacks.TouchCancel({changedTouches:[{identifier:2,clientX:40,clientY:500}]});callbacks.Hide();callbacks.Show();assert.ok(draws>100);
  let total=0;for(const name of await readdir(`dist/${target}/audio`)){const info=await stat(`dist/${target}/audio/${name}`);total+=info.size;const wav=await readFile(`dist/${target}/audio/${name}`);assert.equal(wav.toString('ascii',0,4),'RIFF');}assert.ok(total+code.length<1024*1024);
});
