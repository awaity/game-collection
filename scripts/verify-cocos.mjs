import {execFileSync} from 'node:child_process';
import {readCatalog,root} from './site-config.mjs';
const mode=process.argv[2]??'all';
if(!['web','native','all'].includes(mode))throw Error('Expected web, native or all');
const {games,targets}=await readCatalog();
for(const game of games){
 if(targets[game.slug].engine!=='cocos')continue;
 const args=game.slug==='final-door'?['scripts/verify-final-door.mjs',mode]:['scripts/verify-cocos-game.mjs',game.slug,mode];
 execFileSync(process.execPath,args,{cwd:root,stdio:'inherit'});
 if(game.slug==='endless-night')execFileSync(process.execPath,['scripts/verify-endless-content.mjs',mode],{cwd:root,stdio:'inherit'});
}
