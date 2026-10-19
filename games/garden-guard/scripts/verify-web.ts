import { chromium, type Browser, type Page } from 'playwright';
import { build } from 'esbuild';
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
import type { GardenApp } from '../src/app';
import type { defend } from '../tests/strategy';

declare global { interface Window { __GARDEN__: GardenApp; GardenStrategy: { defend: typeof defend } } }
const port = 4292, base = `http://127.0.0.1:${port}`, artifacts = 'artifacts';
await mkdir(artifacts, { recursive: true });
const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { stdio: ['ignore', 'pipe', 'pipe'] });
let serverError = ''; server.stderr.on('data', d => { serverError += String(d); });
let browser: Browser | null = null;
const checks: string[] = [], errors: string[] = [];
const strategy = await build({ entryPoints: ['tests/strategy.ts'], bundle: true, format: 'iife', globalName: 'GardenStrategy', write: false, minify: false });
const click = (page: Page, id: string) => page.locator(`[data-action="${id}"]`).click();
async function validateBounds(page: Page) {
  const invalid = await page.evaluate(() => [...document.querySelectorAll<HTMLButtonElement>('#controls button')].filter(b => { const r = b.getBoundingClientRect(); return r.left < -1 || r.top < -1 || r.right > innerWidth + 1 || r.bottom > innerHeight + 1; }).map(b => b.dataset.action));
  assert.deepEqual(invalid, []);
}
async function playToResult(page: Page, seconds = 650) {
  await page.addScriptTag({ content: strategy.outputFiles[0].text });
  return page.evaluate(seconds => {
    const app = window.__GARDEN__;
    for (let i = 0; i < seconds * 4 && app.view.screen === 'playing'; i++) { window.GardenStrategy.defend(app.view.game!); app.advance(.25); }
    const g = app.view.game!;
    return { state: g.state, wave: g.wave, kills: g.kills, stars: g.stars, score: g.score };
  }, seconds);
}
try {
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, args: ['--no-sandbox'] });
  let ready = false;
  for (let i = 0; i < 80; i++) { if (server.exitCode !== null) throw new Error(serverError || `Preview exited with ${server.exitCode}`); try { if ((await fetch(base)).ok) { ready = true; break; } } catch { /* Wait for the local server. */ } await new Promise(resolve => setTimeout(resolve, 100)); }
  assert(ready, 'Production preview did not start');
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }, { width: 320, height: 568 }, { width: 844, height: 390 }]) {
    const mobile = viewport.width < 700 || viewport.height < 500, tag = `${viewport.width}x${viewport.height}`;
    const context = await browser.newContext({ viewport, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile, hasTouch: mobile });
    const page = await context.newPage(); page.on('pageerror', e => errors.push(`${tag}: ${e.message}`)); page.on('console', m => { if (m.type() === 'error') errors.push(`${tag}: ${m.text()}`); });
    await page.goto(`${base}/?qa=1`); await page.waitForSelector('[data-action="continue-level"]');
    await page.screenshot({ path: `${artifacts}/home-${tag}.png` }); await validateBounds(page);
    for (const mode of ['levels', 'adventure', 'challenges', 'almanac']) {
      await click(page, mode); await validateBounds(page);
      if (viewport.width === 390) await page.screenshot({ path: `${artifacts}/${mode}-${tag}.png` });
      if (mode === 'challenges' || mode === 'almanac') {
        await click(page, mode === 'challenges' ? 'challenge-page:next' : 'almanac-page:next');await validateBounds(page);
        await page.screenshot({path:`${artifacts}/${mode}-expanded-${tag}.png`});
        if(mode==='almanac'){await click(page,'inspect:icebloom');await validateBounds(page);await click(page,'close');await click(page,'almanac:zombies');await click(page,'almanac-page:next');await validateBounds(page);await page.screenshot({path:`${artifacts}/zombies-expanded-${tag}.png`});}
      }
      await click(page, 'home');
    }
    await click(page, 'continue-level'); await validateBounds(page); await click(page, 'start');
    if (mobile) { await page.locator('[data-action="cell:2:0"]').tap(); await page.locator('[data-action="seed:pea"]').tap(); await page.locator('[data-action="cell:2:2"]').tap(); }
    else { await click(page, 'seed:pea'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter'); }
    assert(await page.evaluate(() => window.__GARDEN__.view.game!.plants.some(p => p.kind === 'pea')));
    await page.evaluate(() => window.__GARDEN__.advance(7)); await click(page, 'collect');
    await click(page, 'pause'); const paused = await page.evaluate(() => window.__GARDEN__.view.game!.elapsed); await page.evaluate(() => window.__GARDEN__.advance(5)); assert.equal(await page.evaluate(() => window.__GARDEN__.view.game!.elapsed), paused);
    await click(page, 'settings'); await click(page, 'setting:autoSun'); await click(page, 'close'); assert.equal(await page.evaluate(() => window.__GARDEN__.view.modal), 'pause'); await click(page, 'close');
    await page.evaluate(() => window.dispatchEvent(new Event('blur'))); assert.equal(await page.evaluate(() => window.__GARDEN__.view.modal), 'pause'); await click(page, 'close');
    await validateBounds(page); await page.screenshot({ path: `${artifacts}/battle-${tag}.png` });
    await click(page, 'pause'); await validateBounds(page); await page.screenshot({ path: `${artifacts}/pause-${tag}.png` }); await click(page, 'retry');
    // Capture a populated battlefield, then complete the real simulation.
    await playToResult(page, 52); await page.screenshot({ path: `${artifacts}/battle-active-${tag}.png` });
    const result = await playToResult(page); assert.equal(result.state, 'won', `${tag} first level`); assert(result.kills > 0);
    assert.equal(await page.evaluate(()=>window.__GARDEN__.career.data.totals.waves),0,'campaign waves must not count as endless task progress');
    await validateBounds(page); await page.screenshot({ path: `${artifacts}/victory-${tag}.png` });
    await click(page, 'next'); assert.equal(await page.evaluate(() => window.__GARDEN__.view.brief?.id), '2');
    await page.reload(); await page.waitForSelector('[data-action="continue-level"]'); assert((await page.evaluate(() => window.__GARDEN__.view.save.levels['1'])) > 0);
    await click(page, 'levels'); assert.equal(await page.locator('[data-action="level:2"]').isDisabled(), false); assert.equal(await page.locator('[data-action="level:3"]').isDisabled(), true); await click(page, 'home');
    if (viewport.width === 390) {
      await click(page, 'adventure'); await click(page, 'adventure:continue'); await click(page, 'start'); assert.equal(await page.evaluate(() => window.__GARDEN__.view.game?.config.mode), 'adventure');
      assert.equal((await playToResult(page)).state, 'won'); await click(page, 'next'); await page.screenshot({ path: `${artifacts}/adventure-upgrade.png` }); await click(page, 'perk:damage');
      assert.deepEqual(await page.evaluate(() => window.__GARDEN__.view.save.adventure?.perks), ['damage']); await page.reload(); await click(page, 'adventure'); await click(page, 'adventure:continue'); assert.equal(await page.evaluate(() => window.__GARDEN__.view.brief?.id), '2'); await click(page, 'close'); await click(page, 'home');
      await click(page, 'challenges'); await click(page, 'challenge:drought'); await click(page, 'start'); assert.equal((await playToResult(page)).state, 'won'); await click(page, 'result:back');
      assert((await page.evaluate(() => window.__GARDEN__.view.save.challenges.drought.score)) > 0);
      for (const id of ['rush', 'fortress', 'endless', 'frostfire', 'explosives', 'compact', 'harvest', 'monsoon', 'airshow', 'recycling', 'roofline']) {
        for(let n=0;n<3&&!(await page.locator(`[data-action="challenge:${id}"]`).count());n++)await click(page,'challenge-page:next');
        await click(page, `challenge:${id}`); await click(page, 'start'); const config = await page.evaluate(() => window.__GARDEN__.view.game!.config); assert.equal(config.id, id);
        await page.screenshot({ path: `${artifacts}/challenge-${id}.png` });
        if (id === 'endless') {
          assert.equal(config.allowed.length,18);await click(page,'seeds:next');await click(page,'seeds:next');assert(await page.locator('[data-action="seed:cactus"]').count());await click(page,'seeds:prev');await validateBounds(page);await page.screenshot({path:`${artifacts}/all-plants-${tag}.png`});
          await click(page,'seed:threepeater');await click(page,'cell:2:2');await click(page,'seeds:prev');await click(page,'seed:ice');await click(page,'cell:4:2');
          await page.addScriptTag({content:strategy.outputFiles[0].text});
          const frozen=await page.evaluate(()=>{const app=window.__GARDEN__;for(let n=0;n<1600&&app.view.screen==='playing';n++){window.GardenStrategy.defend(app.view.game!);app.advance(.1);if(app.view.game!.zombies.some(z=>z.freeze>.9&&z.x<8.5))return true;}return false;});
          assert(frozen,'real ice projectile freezes a naturally spawned zombie');await page.screenshot({path:`${artifacts}/ice-freeze-${tag}.png`});
          const endless = await playToResult(page, 400); assert(endless.wave >= 5); assert.notEqual(endless.state, 'won');
          assert(await page.evaluate(()=>window.__GARDEN__.career.data.totals.waves>=1));
        } else if(['frostfire','explosives','compact','harvest','monsoon','airshow','recycling','roofline'].includes(id)) {assert.equal((await playToResult(page)).state,'won',id);await page.screenshot({path:`${artifacts}/result-${id}.png`});}
        if(await page.evaluate(()=>window.__GARDEN__.view.screen==='playing')){await click(page,'pause');await click(page,'leave');await click(page,'leave:confirm');}else{await click(page,'result:back');await click(page,'home');}await click(page,'challenges');
      }
    }
    checks.push(`${tag}: rendered all menus, placed plants with ${mobile ? 'touch' : 'keyboard'}, collected sun, paused/resumed, won a battle, verified saved level unlocks`);
    await context.close();
  }
  const normal = await browser.newPage(); await normal.goto(base); assert.equal(await normal.evaluate(() => '__GARDEN__' in window), false); await normal.close();
  assert.deepEqual(errors, []);
  await writeFile(`${artifacts}/web-verification.json`, JSON.stringify({ date: new Date().toISOString(), checks, errors, extra: ['Adventure upgrade and reload', 'Challenge start and result records', 'All 18 plants available in endless', 'Actual frozen-zombie screenshot', 'Eleven finite challenge entries and eight specialist challenge victories', 'Expanded almanac and seed pages', 'Endless wave progression', 'QA interface absent from normal URL'] }, null, 2));
  console.log(checks.join('\n')); console.log('Browser checks passed; screenshots and report are in artifacts/.');
} finally { await browser?.close(); server.kill('SIGTERM'); }
