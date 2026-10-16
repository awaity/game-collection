import { readFile } from "node:fs/promises";
import { buildMini } from "@game-collection/build-tools/mini";
const vendor = await readFile("public/vendor/three-r140.bundle.js", "utf8");
// Scope browser capability probes to the pinned library, not the game host.
// Bundled GLBs contain no images/URIs; parsing uses binary data exclusively.
const banner = `(function(){const module=undefined,exports=undefined,define=undefined;
const navigator={userAgent:''};const self=globalThis;
const TextDecoder=globalThis.TextDecoder||class {decode(bytes){let encoded='';for(const b of bytes)encoded+='%'+b.toString(16).padStart(2,'0');return decodeURIComponent(encoded);}};
${vendor}
})();`;
await buildMini({
  slug: "volley-run",
  title: "弹幕小队",
  entry: "src/mini.js",
  banner,
  assets: [
    { from: "public/assets", to: "assets" },
    { from: "public/vendor/THREE-LICENSE.txt", to: "THREE-LICENSE.txt" },
  ],
});
