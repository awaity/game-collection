import { test } from "node:test";
import assert from "node:assert/strict";
import { FixedClock } from "../src/loop.ts";
import { MiniPlatform } from "../src/mini.ts";
import type { MiniAPI } from "../src/mini.ts";
test("clock resets discard background time and negative/nonfinite timestamps", () => {
  const clock = new FixedClock();
  let ticks = 0;
  const step = () => ticks++;
  clock.advance(500, true, step);
  clock.advance(400, true, step);
  assert.equal(ticks, 0);
  clock.advance(500, true, step);
  assert.equal(ticks, 6);
  clock.reset();
  clock.advance(60000, true, step);
  assert.equal(ticks, 6);
  clock.advance(NaN, true, step);
  clock.advance(60000 + 1000 / 60, true, step);
  assert.equal(ticks, 7);
  clock.advance(60100, false, step);
  clock.advance(60100 + 1000 / 60, true, step);
  assert.equal(ticks, 8);
});
test("native binary assets, zero touch coordinates, cancellation and audio disposal", async () => {
  const handlers: Record<string, Function> = {};
  let destroyed = 0;
  const bytes = new Uint8Array([1, 2, 3]).buffer;
  const api = {
    createCanvas: () => ({ width: 0, height: 0, getContext: () => ({}) }),
    getSystemInfoSync: () => ({
      windowWidth: 390,
      windowHeight: 844,
      pixelRatio: 3,
    }),
    getStorageSync: () => null,
    setStorageSync() {},
    createInnerAudioContext: () => ({
      play() {},
      stop() {},
      destroy() {
        destroyed++;
      },
      onError() {},
    }),
    getFileSystemManager: () => ({
      readFile(options: any) {
        assert.equal(options.filePath, "assets/test.glb");
        options.success({ data: bytes });
      },
    }),
  } as unknown as MiniAPI;
  for (const event of ["TouchStart", "TouchMove", "TouchEnd", "TouchCancel"]) {
    (api as any)["on" + event] = (fn: Function) => (handlers[event] = fn);
    (api as any)["off" + event] = () => delete handlers[event];
  }
  const p = new MiniPlatform(api),
    inputs: unknown[] = [];
  const off = p.onPointer((e) => inputs.push(e));
  handlers.TouchStart({
    changedTouches: [{ identifier: 0, clientX: 0, clientY: 0, x: 9, y: 9 }],
  });
  handlers.TouchCancel({ changedTouches: [{ identifier: 0, x: 0, y: 0 }] });
  assert.deepEqual(inputs, [
    { type: "down", x: 0, y: 0, id: 0 },
    { type: "cancel", x: 0, y: 0, id: 0 },
  ]);
  off();
  assert.equal(handlers.TouchCancel, undefined);
  assert.deepEqual(await p.readAsset("./assets/test.glb"), bytes);
  p.sound("shot");
  p.dispose();
  assert.equal(destroyed, 2);
  api.getFileSystemManager = () => ({
    readFile: (options) => options.fail(Error("missing")),
  });
  await assert.rejects(p.readAsset("bad.glb"), /missing/);
});
