import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {Armory} from '../assets/scripts/profile';
import {Session} from '../assets/scripts/session';
import {STAGES} from '../assets/scripts/content';

// Progression audit from an empty profile. Only public purchases, choices, and
// simulation steps are used. A failure earns only the normal checkpoint reward.
const armory=new Armory(null,()=>true,()=> '2026-10-19'),session=new Session(armory),report:unknown[]=[];
armory.checkin();armory.chest(true);const gem=armory.data.gems[0];armory.equip('weapon',0,gem.id);
for(const stage of STAGES){
 let won=false;
 for(let attempt=0;attempt<5;attempt++){
  while(armory.data.weapon<Math.min(30,3+stage.id)&&armory.upgradeBase('weapon')){}
  while(armory.data.wall<Math.min(30,1+Math.floor(stage.id/2))&&armory.upgradeBase('wall')){}
  if(armory.data.coins>800){if(!armory.data.mercs.storm)armory.mercenary('storm');if(armory.data.mercs.storm&&!armory.data.team.includes('storm'))armory.mercenary('storm',true);}
  for(const skill of ['thermo','frost','ray','electron'] as const)if((armory.data.research[skill]??0)<Math.ceil((stage.id+1)/8)&&armory.data.coins>400)armory.research(skill);
  assert.equal(session.begin(stage.id,'campaign',1000+stage.id*11+attempt),true);
  session.play(120000);
  const row={stage:stage.id+1,map:stage.map,attempt:attempt+1,phase:session.battle.phase,seconds:Math.round(session.battle.time),hp:Math.ceil(session.battle.hp),kills:session.battle.kills,bosses:session.battle.bossKills,weapon:armory.data.weapon,wall:armory.data.wall,coins:armory.data.coins};report.push(row);console.log(JSON.stringify(row));
  if(session.battle.phase==='won'){won=true;armory.claim('first-victory');break;}
 }
 if(!won){await save();throw Error(`Campaign balance failed at stage ${stage.id+1}`);}
}
assert.equal(armory.data.unlocked,STAGES.length);assert.ok(armory.data.stars.every(s=>s>0));
await save();console.log('All 36 locally configured stages cleared through legal progression.');
async function save(){await mkdir('artifacts',{recursive:true});await writeFile('artifacts/campaign-audit.json',JSON.stringify({verifiedAt:new Date().toISOString(),source:'local-stage-configurations',runs:report,profile:armory.data},null,2)+'\n');}
