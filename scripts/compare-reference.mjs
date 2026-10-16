import {readFileSync, writeFileSync, existsSync} from 'node:fs';
import path from 'node:path';
import {PNG} from 'pngjs';

const root = path.resolve(process.argv[2] || '../.research/volley-run');
const results = [];
for (const name of ['desktop','mobile','help','mobile-help','settings','gameplay','pause','victory','defeat','route2','route3']) {
  const source = path.join(root, `reference-${name}.png`);
  const implementation = path.join(root, `implementation-${name}.png`);
  if (!existsSync(source) || !existsSync(implementation)) continue;
  const a = PNG.sync.read(readFileSync(source));
  const b = PNG.sync.read(readFileSync(implementation));
  if (a.width !== b.width || a.height !== b.height) throw Error(`Viewport mismatch: ${name}`);
  const combined = new PNG({width:a.width*2+8,height:a.height,fill:true});
  PNG.bitblt(a,combined,0,0,a.width,a.height,0,0);
  PNG.bitblt(b,combined,0,0,b.width,b.height,a.width+8,0);
  writeFileSync(path.join(root,`comparison-${name}.png`),PNG.sync.write(combined));
  let changedPixels=0,totalDelta=0,maxDelta=0;
  for(let i=0;i<a.data.length;i+=4){
    let changed=false;
    for(let c=0;c<3;c++){
      const delta=Math.abs(a.data[i+c]-b.data[i+c]);
      if(delta)changed=true;
      totalDelta+=delta;maxDelta=Math.max(maxDelta,delta);
    }
    if(changed)changedPixels++;
  }
  results.push({name,width:a.width,height:a.height,changedPixels,changedPercent:+(changedPixels/(a.width*a.height)*100).toFixed(4),meanChannelDelta:+(totalDelta/(a.width*a.height*3)).toFixed(5),maxDelta});
  if(name==='desktop'||name==='gameplay'){
    const crop={x:455,y:18,width:556,height:964};
    const focused=new PNG({width:crop.width*2+8,height:crop.height,fill:true});
    PNG.bitblt(a,focused,crop.x,crop.y,crop.width,crop.height,0,0);
    PNG.bitblt(b,focused,crop.x,crop.y,crop.width,crop.height,crop.width+8,0);
    writeFileSync(path.join(root,`comparison-${name}-focused.png`),PNG.sync.write(focused));
  }
}
writeFileSync(path.join(root,'pixel-comparison.json'),JSON.stringify(results,null,2)+'\n');
console.log(JSON.stringify(results,null,2));
