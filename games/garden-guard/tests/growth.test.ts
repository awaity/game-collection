import {test} from 'node:test';import assert from 'node:assert/strict';import {Game,type Zombie} from '../src/core/game';import {challengeConfig,levelConfig,PLANTS} from '../src/core/content';
const enemy=(kind:Zombie['kind'],x=5,row=2):Zombie=>({id:500,kind,row,x,hp:430,maxHp:430,slow:0,flash:0,age:0,eating:false,freeze:0,thaw:0,ability:10,summons:0,vaulted:false});
const arena=()=>new Game({...challengeConfig('endless'),startSun:2000});
test('magnet removes metal, clover heals only living neighbours and pepper burns one full row',()=>{
 const m=arena();m.plant('magnet',2,4);m.zombies=[enemy('shield',6)];m.update(1);assert.equal(m.zombies[0].kind,'walker');assert.ok(m.zombies[0].hp<=165);
 const h=arena();h.plant('wallnut',2,4);h.plant('clover',2,3);h.plants[0].hp=100;h.update(1);assert.equal(h.plants[0].hp,175);assert.ok(h.plants.every(p=>p.hp<=p.maxHp));
 const f=arena();f.plant('pepper',2,2);f.zombies=[enemy('walker',8),{...enemy('walker',4,1),id:501}];f.update(1);assert.equal(f.kills,1);assert.equal(f.zombies[0].row,1);
});
test('cactus hits airborne enemies; roof blocks planting; upgrades affect plant HP and damage',()=>{
 const g=arena();g.plant('cactus',2,2);g.zombies=[enemy('balloon',5)];g.update(1);assert.equal(g.zombies[0].vaulted,true);assert.ok(g.zombies[0].hp<430);
 const roof=new Game(levelConfig(21));assert.ok(roof.canPlant('pea',0,4));
 const boosted=new Game({...challengeConfig('endless'),guardLevel:2,damageScale:1.24});boosted.plant('pea',0,0);assert.equal(boosted.plants[0].maxHp,PLANTS.pea.hp*1.3);assert.equal(boosted.damageMultiplier,1.24);
});
