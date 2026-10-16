export function playScenario(core,options,frames=3600){
 const out=[];let random=1729;const original=Math.random;Math.random=()=>{random=(Math.imul(random,1664525)+1013904223)>>>0;return random/4294967296};const g=core.createRun(options);
 try{for(let i=0;i<frames;i++){
  if(g.phase==='levelup')core.pick(g,i%g.cards.length);if(g.phase==='chest')core.chest(g);
  if(i%600===90)core.active(g);if(i%420===120)core.item(g,['tonic_s','ward','draught','firebomb','lodestone'][Math.floor(i/420)%5]);
  core.step(g,{mx:Math.cos(i/300),my:Math.sin(i/300)});
  if((i+1)%600===0)out.push(snapshot(g));
 }
 return out;}finally{g.phys.dispose();Math.random=original}
 function snapshot(s){const seen=new Set();const encode=v=>{if(typeof v==='number')return Number.isFinite(v)?Math.round(v*1e6)/1e6:null;if(typeof v==='function'||v===undefined)return undefined;if(!v||typeof v!=='object')return v;if(v instanceof Set)return Array.from(v).map(encode);if(v instanceof Map)return Array.from(v).map(encode);if(seen.has(v))return '[shared]';seen.add(v);if(Array.isArray(v))return v.map(encode);const o={};for(const k of Object.keys(v).sort())if(!['phys','rb','col','collider','worldHandle','bodies','colliders','rng','world'].includes(k)){const x=encode(v[k]);if(x!==undefined)o[k]=x}return o};return encode(s)}
}
export const scenarios=[{stageIndex:0,heroId:'wren',seed:7},{stageIndex:1,heroId:'mira',seed:231},{stageIndex:2,heroId:'oskar',seed:832},{stageIndex:3,heroId:'sable',seed:723},{stageIndex:4,heroId:'wren',seed:732,blood:true},{stageIndex:5,heroId:'mira',seed:66,hearth:{might:10,vitality:10,armor:5,headstart:3,reroll:5,banish:5}}].map(s=>({...s,items:{tonic_s:2,ward:2,draught:2,firebomb:2,lodestone:2}}));
