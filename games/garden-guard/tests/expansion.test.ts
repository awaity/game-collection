import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CHALLENGES, PLANT_ORDER, ZOMBIES, challengeConfig, type ZombieKind } from '../src/core/content';
import { Game, type Zombie } from '../src/core/game';
import { parseSave, recordResult, unlockedLevel } from '../src/core/save';
import { GardenApp } from '../src/app';
import { mockHost } from './harness';
import { defend, play } from './strategy';

let id = 10000;
const enemy = (kind: ZombieKind, row = 0, x = 4, hp = 1000): Zombie => ({id:id++,kind,row,x,hp,maxHp:hp,slow:0,flash:0,age:0,eating:false,freeze:0,thaw:0,ability:10,summons:0,vaulted:false});
const arena = () => new Game({...challengeConfig('endless'),startSun:5000});

test('ice immediately stops movement and biting, then thaws with a recovery interval', () => {
  const g=arena();g.plant('ice',0,0);g.plant('wallnut',0,4);
  const z=enemy('walker',0,4.9);g.zombies=[z];g.update(1);
  assert(z.freeze>0);const x=z.x,hp=g.plants.find(p=>p.kind==='wallnut')!.hp;
  g.update(.4);assert.equal(z.x,x);assert.equal(g.plants.find(p=>p.kind==='wallnut')!.hp,hp);
  g.update(.9);assert.equal(z.freeze,0);assert(z.thaw>0);
  g.update(.6);assert.equal(z.freeze,0,'repeat ice shots cannot permanently freeze a target');
  assert(g.plants.find(p=>p.kind==='wallnut')!.hp<hp);
});

test('icebloom freezes all lanes; frost armour and giants resist the duration', () => {
  const g=arena();g.plant('icebloom',2,2);
  g.zombies=[enemy('walker',0),enemy('frost',2),enemy('giant',4)];g.update(1);
  const [normal,frost,giant]=g.zombies;
  assert(normal.freeze>2.5);assert(frost.freeze>0&&frost.freeze<1);assert(giant.freeze>1&&giant.freeze<normal.freeze);
  assert.equal(g.plants.length,0);assert(g.effects.some(e=>e.kind==='freeze'));
});

test('torch fire melts ice for bonus damage and splashes nearby enemies', () => {
  const g=arena();g.plant('pea',0,0);g.plant('torch',0,1);
  const first=enemy('walker',0,3),second=enemy('walker',0,3.5);first.freeze=3;first.slow=4;
  g.zombies=[first,second];g.update(.9);
  assert.equal(first.hp,1000-44-45);assert.equal(first.freeze,0);assert(first.thaw>0);
  assert(second.hp<1000);assert(g.effects.some(e=>e.kind==='shatter'));
});

test('corn bypasses shields and boomerangs hit once on each leg', () => {
  const corn=arena();corn.plant('corn',0,0);corn.zombies=[enemy('shield',0,3),enemy('walker',0,3.4)];corn.update(1.5);
  assert.equal(corn.zombies[0].hp,945);assert.equal(corn.zombies[1].hp,945);
  const leaf=arena();leaf.plant('boomerang',0,0);leaf.zombies=[enemy('shield',0,2),enemy('walker',0,3)];leaf.update(2.25);
  assert.equal(leaf.zombies[0].hp,952);assert.equal(leaf.zombies[1].hp,952);
  const pea=arena();pea.plant('pea',0,0);pea.zombies=[enemy('shield',0,3)];pea.update(.9);
  assert.equal(pea.zombies[0].hp,1000-22*.4);
});

test('threepeater covers adjacent lanes and lightning chains to distinct nearby targets', () => {
  const g=arena();g.plant('threepeater',2,0);g.zombies=[enemy('walker',1,3),enemy('walker',2,3),enemy('walker',3,3),enemy('walker',4,3)];g.update(.9);
  assert.deepEqual(g.zombies.map(z=>z.hp),[978,978,978,1000]);
  const chain=arena();chain.plant('lightning',1,0);chain.zombies=[enemy('shield',1,2),enemy('walker',2,3),enemy('medic',2,4),enemy('walker',4,9)];chain.update(.3);
  assert(chain.zombies.slice(0,3).every(z=>z.hp<1000));assert.equal(chain.zombies[3].hp,1000);
  const arcs=chain.effects.filter(e=>e.kind==='lightning');assert.equal(arcs.length,3);assert.equal(new Set(arcs.map(e=>`${e.toX}:${e.toRow}`)).size,3);
});

test('vaulters jump one ordinary plant, while walls and freezing stop the jump', () => {
  for(const kind of ['pea','wallnut'] as const){const g=arena();g.plant(kind,0,3);const z=enemy('vaulter',0,3.9);g.zombies=[z];g.update(.1);assert(z.vaulted);assert.equal(z.x<3.5,kind==='pea');}
  const g=arena();g.plant('pea',0,3);const z=enemy('vaulter',0,3.9);z.freeze=1;g.zombies=[z];g.update(.1);assert(!z.vaulted);assert.equal(z.x,3.9);
});

test('medics heal other living enemies only; dancers have finite summons and freeze pauses abilities', () => {
  const g=arena(),medic=enemy('medic',1,5),ally=enemy('walker',1,4.6,100);medic.ability=.05;medic.hp=700;ally.hp=90;g.zombies=[medic,ally];g.update(.1);
  assert.equal(ally.hp,100);assert.equal(medic.hp,700);
  medic.freeze=1;medic.ability=.05;ally.hp=50;g.update(.2);assert.equal(ally.hp,50);
  const dancer=enemy('dancer',2,8);dancer.ability=.05;const d=arena();d.zombies=[dancer];d.update(.1);assert.equal(dancer.summons,1);assert.equal(d.zombies.length,3);
  dancer.freeze=1;const timer=dancer.ability;d.update(.2);assert.equal(dancer.ability,timer);
  d.update(30);assert.equal(dancer.summons,2);assert(d.zombies.length<=80);
});

test('all seven finite challenges can be won by legal tactics', t => {
  for(const c of CHALLENGES.filter(c=>c.id!=='endless')){
    const g=play(new Game(challengeConfig(c.id)),800);
    t.diagnostic(`${c.id}: ${g.state}, ${g.kills} kills, ${g.planted} placements`);
    assert.equal(g.state,'won',c.id);if(c.id==='compact')assert(g.plants.length<=10);
  }
});

test('endless opens every plant, rewards a cleared wave once, and has no finite victory', () => {
  const g=new Game(challengeConfig('endless'));assert.deepEqual(g.config.allowed,PLANT_ORDER);
  let before=0;
  for(let n=0;n<2400&&!g.intermission&&g.state==='playing';n++){defend(g);before=g.sun;g.update(.25);}
  assert(g.intermission);assert.equal(g.clearedWaves,1);assert.equal(g.sun,before+110);
  const sun=g.sun;g.update(2);assert.equal(g.sun,sun);assert.equal(g.clearedWaves,1);assert.equal(g.wave,1);
  g.update(6.5);assert.equal(g.wave,2);assert(!g.intermission);
  const long=play(new Game(challengeConfig('endless')),700);assert(long.wave>=6);assert.notEqual(long.state,'won');assert(long.zombies.length<=80);assert(long.projectiles.length<=160);
});

test('old saves keep stars and scores, unlock chapter four, and record cleared endless waves separately', () => {
  const save=parseSave({version:1,levels:Object.fromEntries(Array.from({length:12},(_,i)=>[i+1,3])),challenges:{endless:{score:9000,wave:9,wins:0}},settings:{sound:false}});
  assert.equal(unlockedLevel(save),13);assert.equal(save.challenges.endless.score,9000);assert.equal(save.challenges.endless.cleared,0);
  const g=arena();g.wave=4;g.clearedWaves=3;g.state='lost';recordResult(save,g);
  const loaded=parseSave(JSON.stringify(save));assert.equal(loaded.challenges.endless.wave,9);assert.equal(loaded.challenges.endless.cleared,3);assert.equal(loaded.challenges.endless.score,9000);
});

test('fresh players can page through all seeds and challenges with touch and keyboard', () => {
  const h=mockHost(),app=new GardenApp(h.host);app.action('challenges');app.action('challenge-page:next');
  assert(app.hits.some(h=>h.id==='challenge:compact'));app.action('challenge:endless');app.action('start');
  assert.equal(app.view.game!.config.allowed.length,14);h.key('e');assert.equal(app.view.seedPage,1);assert(app.hits.some(h=>h.id==='seed:icebloom'));
  h.key('1');assert.equal(app.view.selected,'threepeater');h.key('q');assert.equal(app.view.seedPage,0);
  app.action('pause');const t=app.view.game!.elapsed;app.advance(8);assert.equal(app.view.game!.elapsed,t);app.destroy();
  assert.equal(Object.keys(ZOMBIES).length,11);
});
