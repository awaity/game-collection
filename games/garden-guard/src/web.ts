import { GardenApp } from './app';
import { webHost } from './platform/web';
import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('#game')!;
document.documentElement.dataset.collectionGame = 'garden-guard';
const app = new GardenApp(webHost(canvas));
if (new URLSearchParams(location.search).get('qa') === '1') Object.assign(window, { __GARDEN__: app });
window.addEventListener('pagehide', () => { /* The host pauses play; keep the app alive for the browser back/forward cache. */ });
