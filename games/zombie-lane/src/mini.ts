import { App } from './app';
import { MiniPlatform } from './platform/mini';
import type { MiniAPI } from './platform/mini';
declare const wx:MiniAPI;
declare const tt:MiniAPI;
declare const __MINI_TARGET__:'weixin'|'douyin';
const platform=new MiniPlatform(__MINI_TARGET__==='weixin'?wx:tt,{entrance:true});
new App(platform);
