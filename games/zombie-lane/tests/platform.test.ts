import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MiniPlatform } from '../src/platform/mini.ts';
import type { MiniAPI } from '../src/platform/mini.ts';
function mock(){
  const handlers:Record<string,Function>={},storage=new Map<string,unknown>();let stopped=0;
  const api={createCanvas:()=>({width:0,height:0,getContext:()=>({})}),getSystemInfoSync:()=>({windowWidth:390,windowHeight:844,pixelRatio:3,safeArea:{top:44,bottom:810}}),getMenuButtonBoundingClientRect:()=>({bottom:78}),getStorageSync:(key:string)=>storage.get(key),setStorageSync:(key:string,value:unknown)=>storage.set(key,value),createInnerAudioContext:()=>({play(){},stop(){stopped++;},seek(){},src:'',volume:0})} as unknown as MiniAPI;
  for(const event of ['TouchStart','TouchMove','TouchEnd','TouchCancel','Show','Hide','WindowResize']){(api as any)['on'+event]=(fn:Function)=>handlers[event]=fn;(api as any)['off'+event]=()=>delete handlers[event];}
  return{api,handlers,storage,stopped:()=>stopped};
}
test('native adapter routes touch coordinates, safe area, hide/show and cleanup without DOM',()=>{
  const m=mock(),platform=new MiniPlatform(m.api);assert.deepEqual(platform.viewport(),{width:390,height:844,dpr:2,safeTop:78,safeBottom:34});
  const inputs:unknown[]=[],visibility:boolean[]=[];const off=platform.onPointer(e=>inputs.push(e)),offVisibility=platform.onVisibility(v=>visibility.push(v));
  m.handlers.TouchStart({changedTouches:[{identifier:7,clientX:123,clientY:456}]});m.handlers.TouchCancel({changedTouches:[{identifier:7,x:123,y:456}]});assert.deepEqual(inputs,[{type:'down',x:123,y:456,id:7},{type:'cancel',x:123,y:456,id:7}]);
  platform.sound('shot');m.handlers.Hide();m.handlers.Show();assert.deepEqual(visibility,[false,true]);assert.ok(m.stopped()>0);off();offVisibility();assert.equal(m.handlers.TouchStart,undefined);assert.equal(m.handlers.Hide,undefined);
});
test('native storage persists structured records and tolerates restricted storage',()=>{
  const m=mock(),p=new MiniPlatform(m.api);p.write('record',{normal:3000});assert.deepEqual(p.read('record'),{normal:3000});m.api.getStorageSync=()=>{throw Error('denied');};m.api.setStorageSync=()=>{throw Error('full');};assert.equal(p.read('record'),null);assert.doesNotThrow(()=>p.write('record',{}));
});
