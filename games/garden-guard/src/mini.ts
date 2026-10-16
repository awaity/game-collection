import { GardenApp } from './app';
import { miniHost, type MiniAPI } from './platform/mini';
declare const wx: MiniAPI | undefined;
declare const tt: MiniAPI | undefined;
declare const __MINI_TARGET__: 'weixin' | 'douyin';
const api = __MINI_TARGET__ === 'weixin' ? typeof wx !== 'undefined' ? wx : null : typeof tt !== 'undefined' ? tt : null;
if (!api) throw new Error('请在对应平台的小游戏运行环境中启动');
new GardenApp(miniHost(api));
