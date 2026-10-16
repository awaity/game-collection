/** Browser-only surface and local assets for the shared Three scene. */
export function webRuntime(container) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-label", "弹幕小队三维战场");
  return {
    canvas,
    reducedMotion: matchMedia("(prefers-reduced-motion: reduce)").matches,
    createCanvas: (width, height) => {
      const c = document.createElement("canvas");
      c.width = width;
      c.height = height;
      return c;
    },
    viewport: () => ({
      ...container.getBoundingClientRect().toJSON(),
      dpr: devicePixelRatio || 1,
    }),
    attach: (canvas) => container.prepend(canvas),
    onResize: (callback) => {
      const observer = new ResizeObserver(callback);
      observer.observe(container);
      return () => observer.disconnect();
    },
    emit: (name) => container.dispatchEvent(new CustomEvent(name)),
    readAsset: async (path) => {
      const response = await fetch(`./${path}`);
      if (!response.ok) throw Error(`Asset ${path}: ${response.status}`);
      return response.arrayBuffer();
    },
  };
}
