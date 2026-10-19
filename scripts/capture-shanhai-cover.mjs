import {writeFile} from 'node:fs/promises';
import {createSiteServer} from './preview-site.mjs';
import {launchBrowser} from './browser.mjs';
import {presentCocos} from './cocos-browser.mjs';
const server=createSiteServer(process.cwd());await new Promise(r=>server.listen(0,'127.0.0.1',r));
const browser=await launchBrowser();
try{
 const p=await browser.newPage({viewport:{width:840,height:630}});
 await p.addInitScript(()=>window.__COLLECTION_TEST__=true);
 await p.goto(`http://127.0.0.1:${server.address().port}/game-collection/games/shanhai-run/dist/web/`);
 await p.waitForFunction(()=>window.__collectionSnapshot?.controls?.length,null,{timeout:90000});await p.waitForFunction(()=>!document.querySelector('#collection-entrance'));await presentCocos(p);
 await p.getByRole('button',{name:'开始逃亡',exact:true}).click();await presentCocos(p);
 await p.evaluate(()=>__shanhai.play(540));
 // Photograph the actual running world, with only the HUD hidden for the cover.
 await p.evaluate(async()=>{const {director}=await System.import('cc');director.getScene().getChildByName('HUD').active=false;});await presentCocos(p);
 const source=await p.screenshot();
 const webp=await p.evaluate(async data=>{const img=new Image();img.src=data;await img.decode();const c=document.createElement('canvas');c.width=840;c.height=630;c.getContext('2d').drawImage(img,0,0);return c.toDataURL('image/webp',.94).split(',')[1];},'data:image/png;base64,'+source.toString('base64'));
 await writeFile(new URL('../apps/portal/public/covers/shanhai-run.webp',import.meta.url),Buffer.from(webp,'base64'));
 await writeFile('artifacts/shanhai-cover.png',source);
}finally{await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
