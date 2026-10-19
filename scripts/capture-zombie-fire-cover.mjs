import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {createSiteServer} from './preview-site.mjs';
import {launchBrowser} from './browser.mjs';
import {presentCocos} from './cocos-browser.mjs';

const server=createSiteServer(process.cwd());
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser=await launchBrowser();
  const p=await browser.newPage({viewport:{width:840,height:630}});
  await p.addInitScript(()=>window.__COLLECTION_TEST__=true);
  await p.goto(`http://127.0.0.1:${server.address().port}/game-collection/games/zombie-fire/dist/web/`);
  await p.waitForFunction(()=>window.__collectionSnapshot?.controls?.length,null,{timeout:90000});
  await p.waitForFunction(()=>!document.querySelector('#collection-entrance'));
  await presentCocos(p);
  await p.getByRole('button',{name:'无尽挑战',exact:true}).click();
  await presentCocos(p);
  let state,source;
  // Advance normal fixed-step combat and choose only offered cards through the
  // existing legal-play driver. No currency, enemies or equipment are injected.
  for(let n=0;n<160;n++){
    await p.evaluate(()=>__zombieFire.play(120));
    state=await presentCocos(p);
    if(state.battlePhase==='choice')continue;
    if(state.battlePhase!=='playing')break;
    if(state.enemies.length>=6&&state.enemies.some(enemy=>enemy.y<560)){
      source=await p.screenshot();break;
    }
  }
  assert.ok(source,`Normal combat must produce the photographed scene (${state?.battlePhase}, wave ${state?.wave})`);
  const webp=await p.evaluate(async data=>{
    const image=new Image();image.src=data;await image.decode();
    const canvas=document.createElement('canvas');canvas.width=840;canvas.height=630;
    canvas.getContext('2d').drawImage(image,0,0);
    return canvas.toDataURL('image/webp',.94).split(',')[1];
  },'data:image/png;base64,'+source.toString('base64'));
  await mkdir('artifacts/zombie-fire-preview',{recursive:true});
  await writeFile('artifacts/zombie-fire-preview/cover.png',source);
  await writeFile('artifacts/zombie-fire-preview/cover-state.json',JSON.stringify(state,null,2)+'\n');
  await writeFile(new URL('../apps/portal/public/covers/zombie-fire.webp',import.meta.url),Buffer.from(webp,'base64'));
  console.log('Captured actual endless combat at tick',state.tick,'wave',state.wave,'enemies',state.enemies.length);
}finally{
  await browser?.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));
}
