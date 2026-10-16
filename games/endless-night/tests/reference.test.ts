import test from 'node:test';import assert from 'node:assert/strict';import{readFile}from'node:fs/promises';import{createHash}from'node:crypto';import{gunzipSync}from'node:zlib';import*as physics from'../assets/scripts/vendor/physics.js';import*as domain from'../assets/scripts/domain';
const {playScenario}=await import('./scenarios.mjs');
await physics.initRapier(gunzipSync(await readFile(new URL('../assets/resources/physics.bin',import.meta.url))),async(bytes:Uint8Array,imports:WebAssembly.Imports)=>(await WebAssembly.instantiate(bytes,imports)).instance.exports);domain.configurePhysics(physics);
const api={createRun:domain.createRun,pick:domain.pickCard,chest:domain.closeChest,step:domain.stepRun,active:domain.requestActive,item:domain.requestItem};
const golden=JSON.parse(await readFile(new URL('./reference-golden.json',import.meta.url),'utf8'));
for(const g of golden)test(`original physics and simulation: stage ${g.options.stageIndex}, ${g.options.heroId}`,()=>{const values=playScenario(api,g.options);const hashes=values.map((v:unknown)=>createHash('sha256').update(JSON.stringify(v)).digest('hex'));assert.deepEqual(hashes,g.hashes)});
