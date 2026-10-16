import { build } from 'esbuild';
import { mkdir, writeFile, rm } from 'node:fs/promises';
import { SOUNDS, synth } from '../src/platform/synth.ts';

const target=process.argv[2];
if(target!=='weixin'&&target!=='douyin')throw new Error('Target must be weixin or douyin');
const out=new URL(`../dist/${target}/`,import.meta.url);
await rm(out,{recursive:true,force:true});await mkdir(new URL('audio/',out),{recursive:true});
await build({entryPoints:['src/mini.ts'],outfile:new URL('game.js',out).pathname,bundle:true,format:'iife',platform:'neutral',target:'es2018',minify:true,define:{__MINI_TARGET__:JSON.stringify(target)},legalComments:'none'});
for(const name of SOUNDS){
  const samples=synth(name),buffer=Buffer.alloc(44+samples.length*2);
  buffer.write('RIFF',0);buffer.writeUInt32LE(buffer.length-8,4);buffer.write('WAVEfmt ',8);buffer.writeUInt32LE(16,16);buffer.writeUInt16LE(1,20);buffer.writeUInt16LE(1,22);buffer.writeUInt32LE(22050,24);buffer.writeUInt32LE(44100,28);buffer.writeUInt16LE(2,32);buffer.writeUInt16LE(16,34);buffer.write('data',36);buffer.writeUInt32LE(samples.length*2,40);
  samples.forEach((sample,i)=>buffer.writeInt16LE(Math.max(-32768,Math.min(32767,Math.round(sample*32767))),44+i*2));
  await writeFile(new URL(`audio/${name}.wav`,out),buffer);
}
const appid=target==='weixin'?process.env.WEIXIN_APP_ID:process.env.DOUYIN_APP_ID;
await writeFile(new URL('game.json',out),JSON.stringify({deviceOrientation:'portrait',showStatusBar:false},null,2)+'\n');
const config=target==='weixin'?{description:'尸潮防线',compileType:'game',libVersion:'latest',appid:appid??'touristappid',projectname:'zombie-lane',setting:{es6:false,minified:true,urlCheck:true},condition:{}}:{description:'尸潮防线',appid:appid??'',projectname:'zombie-lane',miniprogramRoot:'./',compileType:'game',setting:{es6:false,minified:true},condition:{}};
await writeFile(new URL('project.config.json',out),JSON.stringify(config,null,2)+'\n');
console.log(`${target}: ${out.pathname} (${appid?'AppID supplied':'development placeholder; supply AppID before device testing'})`);
