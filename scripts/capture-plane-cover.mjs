import { once } from "node:events";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { createSiteServer } from "./preview-site.mjs";
import { launchBrowser } from "./browser.mjs";
import { root } from "./site-config.mjs";
// A reachable boss-fight pose, rendered by the actual production game Canvas.
// No external artwork or alternate cover renderer.
const server = createSiteServer(path.join(root, "games/plane-battle/dist/web"));
server.listen(0, "127.0.0.1");
await once(server, "listening");
let browser;
try {
  browser = await launchBrowser();
  const page = await browser.newPage({
    viewport: { width: 393, height: 852 },
    deviceScaleFactor: 2,
  });
  await page.goto(
    `http://127.0.0.1:${server.address().port}/game-collection/?qa=1`,
  );
  await page.locator('[data-action="start"]').click();
  const data = await page.evaluate(() => {
    const app = __PLANE__.app,
      g = app.game;
    g.player.weapon = 4;
    g.player.shield = true;
    g.player.x = 115;
    g.player.y = 275;
    g.spawnBoss();
    g.boss.y = 100;
    app.advance(35);
    const source = document.querySelector("#game"),
      canvas = document.createElement("canvas");
    canvas.width = 840;
    canvas.height = 630;
    const scale = source.width / 420;
    canvas
      .getContext("2d")
      .drawImage(
        source,
        0,
        app.arena.y * scale,
        source.width,
        source.width * 0.75,
        0,
        0,
        840,
        630,
      );
    return canvas.toDataURL("image/webp", 0.93).split(",")[1];
  });
  await writeFile(
    path.join(root, "apps/portal/public/covers/plane-battle.webp"),
    Buffer.from(data, "base64"),
  );
} finally {
  await browser?.close();
  server.closeAllConnections();
  await new Promise((resolve) => server.close(resolve));
}
