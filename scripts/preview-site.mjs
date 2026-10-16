import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { siteDir, base } from "./site-config.mjs";
const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".glb": "model/gltf-binary",
  ".png": "image/png",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".wav": "audio/wav",
  ".txt": "text/plain; charset=utf-8",
};
export function createSiteServer(directory = siteDir) {
  return createServer(async (request, response) => {
    try {
      const url = new URL(request.url, "http://localhost");
      if (url.pathname === "/" || url.pathname === base.slice(0, -1)) {
        response.writeHead(302, { Location: base });
        response.end();
        return;
      }
      if (!url.pathname.startsWith(base)) throw new Error("outside base");
      const file = path.resolve(
        directory,
        decodeURIComponent(url.pathname.slice(base.length)) || ".",
      );
      if (file !== directory && !file.startsWith(directory + path.sep))
        throw new Error("outside root");
      const info = await stat(file);
      if (info.isDirectory() && !url.pathname.endsWith("/")) {
        response.writeHead(301, { Location: url.pathname + "/" + url.search });
        response.end();
        return;
      }
      const actual = info.isDirectory() ? path.join(file, "index.html") : file;
      const data = await readFile(actual);
      response.writeHead(200, {
        "Content-Type":
          mime[path.extname(actual)] || "application/octet-stream",
        "Cache-Control": "no-cache",
      });
      response.end(request.method === "HEAD" ? undefined : data);
    } catch {
      response.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      response.end(
        await readFile(path.join(directory, "404.html")).catch(
          () => "Not found",
        ),
      );
    }
  });
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const port = Number(process.env.PORT || 4191);
  createSiteServer().listen(port, "0.0.0.0", () =>
    console.log(`完整站点预览：http://localhost:${port}${base}`),
  );
}
