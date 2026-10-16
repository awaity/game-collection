import assert from "node:assert/strict";
import { readFile, readdir, stat, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { readCatalog, root } from "./site-config.mjs";
import { createMiniHost } from "./mini-host.mjs";
import { launchBrowser } from "./browser.mjs";
const controls = {
  "garden-guard": {
    start: "开始守卫",
    confirm: "开始种植",
    pause: [352, 108],
    resume: "继续守卫",
    home: "返回花园",
    confirmHome: "返回花园",
    playing: "准备种植",
    soundSettings: [344, 110],
    soundCount: 9,
  },
  "plane-battle": {
    start: "即刻起飞  →",
    pause: "暂停",
    resume: "继续飞行",
    home: "返回机库",
    playing: "拖动飞机 · 自动开火",
  },
  "zombie-lane": {
    start: "开始守线    ›",
    pause: "Ⅱ",
    resume: "继续守线",
    home: "返回营地",
    playing: "呼叫空袭",
  },
  "volley-run": {
    start: "全员出击 →",
    pause: "暂停",
    resume: "继续突击",
    home: "返回集合点",
    playing: "左右拖动，自动射击",
  },
};
const { games, targets } = await readCatalog(),
  report = [];
const host = await createMiniHost();
let browser;
const artifacts = path.join(root, "artifacts/native");
await mkdir(artifacts, { recursive: true });
try {
  browser = await launchBrowser();
  for (const game of games.filter(game => targets[game.slug].engine !== 'cocos'))
    for (const target of targets[game.slug].miniTargets) {
      const dir = path.join(root, "games", game.slug, "dist", target),
        config = JSON.parse(
          await readFile(path.join(dir, "project.config.json"), "utf8"),
        );
      assert.equal(config.compileType, "game");
      assert.equal(config.projectname, game.slug);
      assert.equal(
        JSON.parse(await readFile(path.join(dir, "game.json"), "utf8"))
          .deviceOrientation,
        "portrait",
      );
      const total = async (dir) => {
        let bytes = 0;
        for (const entry of await readdir(dir)) {
          const file = path.join(dir, entry),
            info = await stat(file);
          bytes += info.isDirectory() ? await total(file) : info.size;
        }
        return bytes;
      };
      const bytes = await total(dir);
      assert.ok(bytes < 4 * 1024 * 1024, `${game.slug}: package budget`);
      const sounds = await readdir(path.join(dir, "audio"));
      assert.equal(sounds.length, controls[game.slug]?.soundCount ?? 8);
      for (const name of sounds) {
        const wav = await readFile(path.join(dir, "audio", name));
        assert.equal(wav.toString("ascii", 0, 4), "RIFF");
        assert.equal(wav.readUInt32LE(4), wav.length - 8);
      }
      const page = await browser.newPage({
        viewport: { width: 390, height: 844 },
      });
      page.setDefaultTimeout(30000);
      const pageErrors = [];
      page.on("pageerror", (error) => pageErrors.push(String(error)));
      try {
        await page.goto(host.url);
        let state = await page.evaluate(
          ({ slug, target }) => boot(slug, target, target === "weixin" ? 1 : 2),
          { slug: game.slug, target },
        );
        const c = controls[game.slug];
        assert.ok(c, `${game.slug}: add a native interaction scenario`);
        for (
          let attempt = 0;
          attempt < 80 && !state.texts.some((t) => t.label === c.start);
          attempt++
        ) {
          assert.deepEqual(state.errors, []);
          await page.waitForTimeout(100);
          state = await page.evaluate(() => call({ type: "frames", count: 2 }));
        }
        const has = (label) => state.texts.some((text) => text.label === label);
        const frames = async (count = 2) => {
          state = await page.evaluate(
            (count) => call({ type: "frames", count }),
            count,
          );
          assert.deepEqual(state.errors, []);
          assert.deepEqual(pageErrors, []);
          return state;
        };
        const event = async (name, x = 0, y = 0) => {
          state = await page.evaluate(
            ({ name, x, y }) =>
              call({
                type: "event",
                name,
                event: {
                  changedTouches: [{ identifier: 1, clientX: x, clientY: y }],
                },
              }),
            { name, x, y },
          );
        };
        const tap = async (label) => {
          const button = Array.isArray(label) ? { x: label[0], y: label[1] } : state.texts.find((t) => t.label === label);
          assert.ok(button, `${game.slug}/${target}: missing ${label}`);
          await event("TouchStart", button.x, button.y);
          await event("TouchEnd", button.x, button.y);
          await frames();
        };
        assert.ok(has(c.start), `${game.slug}/${target}: loaded menu`);
        assert.equal(state.domAbsent, true);
        await page.screenshot({
          path: path.join(artifacts, `${game.slug}-${target}-menu.png`),
        });
        if (c.soundSettings) {
          await tap(c.soundSettings);
          assert.ok(has('游戏音效'));
          await tap('游戏音效');
          await tap('游戏音效');
          await tap('保存并返回');
        } else {
        const isSoundOn = has("声音：开");
        assert.ok(isSoundOn);
        await tap("声音：开");
        assert.ok(has("声音：关"));
        await tap("声音：关");
        }
        await tap(c.start);
        if (c.confirm) await tap(c.confirm);
        await frames(12);
        assert.ok(has(c.playing));
        if (game.slug === "volley-run") {
          assert.equal(new Set(state.reads).size, 5);
          assert.equal(state.graphics.error, 0);
          assert.ok(
            state.graphics.colours > 100,
            "real WebGL must draw the battlefield",
          );
        }
        assert.ok(
          state.audioPlays > 0,
          "actions must reach native sound playback",
        );
        await event("TouchStart", 195, 650);
        await event("TouchMove", 50, 480);
        await frames(12);
        await event("TouchCancel", 50, 480);
        await page.screenshot({
          path: path.join(artifacts, `${game.slug}-${target}-play.png`),
        });
        await event("Hide");
        await event("Show");
        await frames();
        assert.ok(
          has(c.resume),
          "backgrounding must pause and require explicit resume",
        );
        await frames(3);
        assert.ok(has(c.resume));
        await tap(c.resume);
        assert.ok(has(c.playing));
        await tap(c.pause);
        assert.ok(has(c.resume));
        await tap(c.home);
        if (c.confirmHome) await tap(c.confirmHome);
        assert.ok(has(c.start));
        await tap(c.start);
        if (c.confirm) await tap(c.confirm);
        await frames(4);
        assert.ok(has(c.playing), "restart must remain playable");
        assert.deepEqual(state.errors, []);
        assert.deepEqual(pageErrors, []);
        report.push({
          slug: game.slug,
          target,
          bytes,
          domAbsent: state.domAbsent,
          localAssets: state.reads.length,
          realWebGL: game.slug === "volley-run",
          webglVersion: state.graphics?.version,
          validation: "simulated-host",
          flows: [
            "menu",
            "sound",
            "start",
            "drag",
            "touch-cancel",
            "hide/show",
            "explicit-resume",
            "pause",
            "home",
            "restart",
          ],
        });
        console.log(
          `✓ ${game.slug}/${target}: ${(bytes / 1024).toFixed(0)} KiB, native input/lifecycle${game.slug === "volley-run" ? ", real WebGL + 5 local GLBs" : ""}`,
        );
      } finally {
        await page.close();
      }
    }
  await writeFile(
    path.join(artifacts, "report.json"),
    JSON.stringify(
      {
        checkedAt: new Date().toISOString(),
        officialDeviceValidation: false,
        results: report,
      },
      null,
      2,
    ) + "\n",
  );
} finally {
  await browser?.close();
  await host.close();
}
console.log(
  "Native verification host closed. Official tools/device verification remains separate.",
);
