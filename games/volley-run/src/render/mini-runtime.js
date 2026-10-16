/** Canvas-local compatibility for Three; no window/document shim. */
export function miniRuntime(platform, onContext) {
  const native = platform.canvas,
    listeners = new Map();
  const canvas = {
    get width() {
      return native.width;
    },
    set width(value) {
      native.width = value;
    },
    get height() {
      return native.height;
    },
    set height(value) {
      native.height = value;
    },
    style: {},
    getContext: (...args) => native.getContext(...args),
    addEventListener(type, callback) {
      if (native.addEventListener) native.addEventListener(type, callback);
      else {
        const list = listeners.get(type) ?? [];
        list.push(callback);
        listeners.set(type, list);
      }
    },
    removeEventListener(type, callback) {
      native.removeEventListener?.(type, callback);
      listeners.set(
        type,
        (listeners.get(type) ?? []).filter((fn) => fn !== callback),
      );
    },
    setAttribute() {},
  };
  return {
    canvas,
    quality: "low",
    reducedMotion: platform.reducedMotion,
    createCanvas: (w, h) => platform.createCanvas(w, h),
    viewport: () => platform.viewport(),
    onResize: (fn) => platform.onResize(fn),
    readAsset: (path) => platform.readAsset(path),
    emit: onContext,
  };
}
