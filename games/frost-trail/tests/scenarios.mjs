/** Shared scripted inputs; fixture outputs are captured from the unmodified reference. */
export function runEconomy({GameState,CampProduction,CounterStaff,CollisionWorld},mode){
 const s=new GameState();s.seedCode='ABC234';const p=new CampProduction(s),staff=new CounterStaff(s,new CollisionWorld()),checks=[];
 const checkpoint=name=>checks.push({name,state:s.snapshot()});
 const advance=seconds=>{for(let i=0;i<seconds*60;i++){const dt=1/60;s.elapsed+=dt;s.dayNight.update(dt);s.aiCamps.update(dt);s.annexation.update(dt);s.caravans.update(dt);s.tickSieges(dt);s.endgame.update(dt);s.tickCooking(dt);p.update(dt);staff.update(dt)}};
 checkpoint('fresh');
 if(mode==='manual'){
  s.add('wood',{collected:true});for(let i=0;i<3;i++)s.add('raw',{collected:true});checkpoint('gather');
  for(let i=0;i<3;i++){s.startCooking();advance(2)}checkpoint('cook');
  while(s.sellOne()){}checkpoint('counter-escrow');while(s.collectCash()){}checkpoint('collect');
  const saved=s.snapshot();s.restore(saved);checkpoint('restore');
 }else if(mode==='automation'){
  s.credit(3000);for(const key of['hunters','woodcutters','rawBelt','woodBelt'])s.purchase(key);
  s.camp.stock.wood=60;s.camp.stock.raw=100;s.hireStaff('seller');s.hireStaff('cashier');s.setStaffReserve(5);checkpoint('built');
  for(const seconds of[15,45,120]){advance(seconds);checkpoint('run-'+seconds)}
  s.restore(s.snapshot());checkpoint('restore');
 }else{
  s.credit(50000);s.ages.restore({version:1,era:4});s.camp.stock.wood=180;s.camp.stock.cooked=150;s.camp.stock.raw=100;s.camp.stock.fish=100;
  for(const key of['tradePost','siegeEngine','stoneWall','watchPost','corral','greenhouse'])s.purchase(key);
  for(let i=0;i<12;i++){s.giftFaction('merchants');s.giftFaction('fishers')}
  for(let i=0;i<6;i++)s.buyLamp();s.buyPond();s.buyFishtrap();s.buyFishtrap();s.prestige.gain(900,'scenario');s.callSupplyCard('foodCrate');s.usePower('harvest');
  s.openRoute('merchants');s.dispatchCaravan('merchants');checkpoint('trade-start');
  for(const seconds of[60,120,180]){advance(seconds);checkpoint('world-'+seconds)}
  s.restore(s.snapshot());checkpoint('restore');
 }
 return checks;
}
export function runEndgame(Endgame,path){let day=1;const events=[];const e=new Endgame({getFactions:()=>['a','b','c','d','e'],getRelation:()=>path==='hegemony'?'allied':'neutral',isFactionMerged:()=>path==='conquest',getDay:()=>day,trySpendResources:()=>true,canCollectRelic:()=>true,emitter:{emit:(type,data)=>events.push({type,data})}});
 if(path==='wonder')e.startWonder();if(path==='relics')for(const id of Object.keys(e.config.relics.list))e.collectRelic(id);
 for(let i=0;i<120000&&!e.isVictory();i++){day=1+Math.floor(i/7200);e.update(1/60)}return{state:e.snapshot(),events};
}
