import { test } from "node:test";
import assert from "node:assert/strict";
import { App } from "../src/app.ts";
import type { Platform } from "@game-collection/platform/types";
function host() {
  let now = 0,
    next = 0;
  const frames = new Map<number, Function>(),
    handlers = new Map<string, Function>(),
    storage = new Map<string, unknown>([["highScore", 1200]]);
  const ctx = new Proxy(
    { createRadialGradient: () => ({ addColorStop() {} }) },
    {
      get: (object, key) => (key in object ? (object as any)[key] : () => {}),
      set: (object, key, value) => {
        (object as any)[key] = value;
        return true;
      },
    },
  );
  const listen = (name: string) => (callback: Function) => {
    handlers.set(name, callback);
    return () => handlers.delete(name);
  };
  const platform = {
    canvas: { width: 390, height: 844, getContext: () => ctx },
    viewport: () => ({
      width: 390,
      height: 844,
      dpr: 2,
      safeTop: 78,
      safeBottom: 34,
    }),
    createCanvas: () => ({ width: 0, height: 0, getContext: () => ctx }),
    now: () => now,
    requestFrame: (fn: Function) => {
      frames.set(++next, fn);
      return next;
    },
    cancelFrame: (id: number) => frames.delete(id),
    onPointer: listen("pointer"),
    onKey: listen("key"),
    onResize: listen("resize"),
    onVisibility: listen("visibility"),
    read: (key: string) => storage.get(key),
    write: (key: string, value: unknown) => storage.set(key, value),
    unlockAudio() {},
    sound() {},
    setSound() {},
    vibrate() {},
    reducedMotion: false,
  } as Platform;
  return {
    platform,
    frames,
    handlers,
    storage,
    advance: (ms: number) => {
      now += ms;
      const pending = [...frames.values()];
      frames.clear();
      pending.forEach((callback) => callback(now));
    },
  };
}
test("background/restart never accumulate frames or controls; record migration runs once", () => {
  const h = host(),
    app = new App(h.platform);
  assert.equal(app.best, 1200);
  assert.equal(h.storage.get("highScore"), 1200);
  assert.equal(h.storage.get("plane.migrated.v1"), true);
  assert.equal(h.frames.size, 1);
  assert.equal(h.handlers.size, 4);
  app.action("start");
  h.advance(17);
  h.advance(17);
  assert.ok(app.game.tick > 0);
  h.handlers.get("visibility")!(false);
  const tick = app.game.tick;
  assert.equal(app.game.phase, "paused");
  assert.equal(h.frames.size, 0);
  h.advance(60000);
  h.handlers.get("visibility")!(true);
  assert.equal(app.game.phase, "paused");
  app.action("resume");
  h.advance(17);
  assert.equal(app.game.tick, tick);
  h.advance(17);
  assert.equal(app.game.tick, tick + 1);
  for (let i = 0; i < 8; i++) {
    app.action("retry");
    assert.equal(app.game.tick, 0);
    assert.equal(app.game.killsNeeded, 20);
    assert.equal(h.frames.size, 1);
    assert.equal(h.handlers.size, 4);
  }
  app.game.score = 1400;
  app.action("home");
  assert.equal(app.best, 1400);
  app.dispose();
  assert.equal(h.frames.size, 0);
  assert.equal(h.handlers.size, 0);
  h.storage.set("highScore", 99999);
  const next = new App(h.platform);
  assert.equal(next.best, 1400);
  next.dispose();
});
test("settings validate corrupt records and retained difficulty while returning to menu", () => {
  const h = host();
  h.storage.set("plane.settings.v1", {
    mode: "invalid",
    difficulty: "__proto__",
    sound: false,
  });
  h.storage.set("plane.records.v1", { bad: NaN, negative: -8 });
  const app = new App(h.platform);
  assert.equal(app.game.mode, "stage");
  assert.equal(app.game.difficulty, "normal");
  assert.equal(app.sound, false);
  app.action("mode-endless");
  app.action("difficulty-hard");
  app.action("start");
  assert.equal(app.game.player.lives, 2);
  app.action("pause");
  app.action("home");
  assert.equal(app.game.mode, "endless");
  assert.equal(app.game.difficulty, "hard");
  assert.equal(app.game.phase, "menu");
  app.dispose();
});
