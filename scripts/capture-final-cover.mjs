import {once} from 'node:events';
import {writeFile} from 'node:fs/promises';
import {launchBrowser} from './browser.mjs';
import {createSiteServer} from './preview-site.mjs';
import {root} from './site-config.mjs';
const server=createSiteServer(root.replace(/[\\/]$/,''));server.listen(0,'127.0.0.1');await once(server,'listening');
const browser=await launchBrowser();
try{
 const p=await browser.newPage({viewport:{width:800,height:1000},reducedMotion:'reduce'});
 await p.addInitScript(()=>window.__COLLECTION_TEST__=true);
 await p.goto(`http://127.0.0.1:${server.address().port}/game-collection/games/final-door/dist/web/?mode=capture`);
 await p.waitForFunction(()=>window.__collectionSnapshot?.controls?.some(b=>b.id==='more'));
 // A genuine state reached by the original deterministic route, with no grants or forced actors.
 await p.evaluate(()=>window.__collectionAdvance(420));await p.waitForTimeout(300);
 const source=await p.screenshot();
 const result=await p.evaluate(async data=>{const img=new Image();img.src=data;await img.decode();const c=document.createElement('canvas');c.width=840;c.height=630;c.getContext('2d').drawImage(img,0,205,800,600,0,0,840,630);return c.toDataURL('image/webp',.93).split(',')[1]},'data:image/png;base64,'+source.toString('base64'));
 await writeFile(new URL('../apps/portal/public/covers/final-door.webp',import.meta.url),Buffer.from(result,'base64'));
}finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r))}
