// Test host only. Runs the shipped native bundle in a DOM-free worker using real
// Canvas2D/WebGL; this is not a substitute for official developer tools/devices.
const network = fetch.bind(globalThis),
  send = postMessage.bind(globalThis);
let display,
  contexts = [],
  callbacks = {},
  frames = new Map(),
  frameId = 0,
  time = 0,
  storage = new Map(),
  root,
  errors = [],
  reads = [],
  audioPlays = 0,
  webglVersion;
console.error = (...args) => errors.push(args.map(String).join(" "));
addEventListener("unhandledrejection", (e) =>
  errors.push(String(e.reason?.stack ?? e.reason)),
);
addEventListener("error", (e) => errors.push(e.message));
function canvas(surface) {
  const get = surface.getContext.bind(surface),
    seen = new Map();
  surface.getContext = (type, ...args) => {
    if (type === "webgl2" && webglVersion === 1) return null;
    const ctx = get(type, ...args);
    if (!ctx || seen.has(type)) return ctx;
    seen.set(type, ctx);
    const record = { ctx, surface, type, texts: [] };
    contexts.push(record);
    if (type === "2d") {
      const fill = ctx.fillText.bind(ctx),
        rect = ctx.fillRect.bind(ctx),
        clear = ctx.clearRect.bind(ctx);
      ctx.fillText = (label, x, y, ...args) => {
        const t = ctx.getTransform();
        record.texts.push({
          label: String(label),
          x: ((x * t.a + y * t.c + t.e) / surface.width) * 390,
          y: ((x * t.b + y * t.d + t.f) / surface.height) * 844,
        });
        fill(label, x, y, ...args);
      };
      const reset = (x, y, w, h) => {
        const t = ctx.getTransform();
        if (
          x <= 0 &&
          y <= 0 &&
          w * t.a >= surface.width &&
          h * t.d >= surface.height
        )
          record.texts = [];
      };
      ctx.fillRect = (x, y, w, h) => {
        reset(x, y, w, h);
        rect(x, y, w, h);
      };
      ctx.clearRect = (x, y, w, h) => {
        reset(x, y, w, h);
        clear(x, y, w, h);
      };
    }
    return ctx;
  };
  return surface;
}
function snapshot() {
  let graphics = null;
  const record = contexts.find((r) => r.surface === display && r.type !== "2d");
  if (record) {
    const gl = record.ctx,
      pixels = new Uint8Array(390 * 844 * 4);
    gl.readPixels(0, 0, 390, 844, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    const colours = new Set();
    for (let i = 0; i < pixels.length; i += 148)
      colours.add(pixels.slice(i, i + 3).join(","));
    graphics = {
      error: gl.getError(),
      colours: colours.size,
      version: gl.getParameter(gl.VERSION),
    };
  }
  return {
    texts: contexts.flatMap((r) => r.texts),
    frames: frames.size,
    errors,
    reads,
    audioPlays,
    storage: Object.fromEntries(storage),
    graphics,
    entrance:globalThis.__collectionEntrance,
    domAbsent: typeof document === "undefined" && typeof window === "undefined",
  };
}
onmessage = async ({ data }) => {
  try {
    if (data.type === "boot") {
      globalThis.__COLLECTION_TEST__=true;
      root = data.root;
      for (const [key,value] of Object.entries(data.initialStorage ?? {})) storage.set(key,value);
      webglVersion = data.webglVersion;
      display = canvas(data.canvas);
      let first = true;
      const api = {
        createCanvas: () =>
          first
            ? ((first = false), display)
            : canvas(new OffscreenCanvas(1, 1)),
        getSystemInfoSync: () => ({
          windowWidth: 390,
          windowHeight: 844,
          pixelRatio: 1,
          safeArea: { top: 44, bottom: 810 },
        }),
        getMenuButtonBoundingClientRect: () => ({ bottom: 78 }),
        getStorageSync: (key) => storage.get(key),
        setStorageSync: (key, value) => storage.set(key, value),
        getFileSystemManager: () => ({
          readFile: ({ filePath, success, fail }) => {
            reads.push(filePath);
            network(root + filePath)
              .then(async (r) => {
                if (!r.ok) throw Error("Asset " + r.status);
                success({ data: await r.arrayBuffer() });
              })
              .catch(fail);
          },
        }),
        createInnerAudioContext: () => ({
          src: "",
          volume: 1,
          play() {
            audioPlays++;
          },
          stop() {},
          seek() {},
          destroy() {},
          onError() {},
        }),
        vibrateShort() {},
        showModal: (options) =>
          errors.push(options.title + ": " + options.content),
      };
      for (const name of [
        "TouchStart",
        "TouchMove",
        "TouchEnd",
        "TouchCancel",
        "Hide",
        "Show",
        "WindowResize",
      ]) {
        api["on" + name] = (fn) => (callbacks[name] ??= []).push(fn);
        api["off" + name] = (fn) => {
          callbacks[name] = callbacks[name]?.filter((cb) => cb !== fn);
        };
      }
      globalThis[data.target === "weixin" ? "wx" : "tt"] = api;
      globalThis.requestAnimationFrame = (fn) => {
        frames.set(++frameId, fn);
        return frameId;
      };
      globalThis.cancelAnimationFrame = (id) => frames.delete(id);
      Object.defineProperty(globalThis, "performance", {
        value: { now: () => time },
      });
      // Enforce native asset loading; remove accidental browser-only escape routes.
      globalThis.fetch = undefined;
      globalThis.XMLHttpRequest = undefined;
      Object.defineProperty(globalThis, "navigator", { value: undefined });
      importScripts(root + "game.js");
    } else if (data.type === "frames") {
      for (let i = 0; i < data.count; i++) {
        time += 1000 / 60;
        const pending = [...frames.values()];
        frames.clear();
        for (const fn of pending) fn(time);
      }
    } else if (data.type === "event") {
      for (const fn of callbacks[data.name] ?? []) fn(data.event);
    }
    send({ id: data.id, value: snapshot() });
  } catch (error) {
    errors.push(String(error.stack ?? error));
    send({ id: data.id, value: snapshot() });
  }
};
