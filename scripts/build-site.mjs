import { execFileSync } from "node:child_process";
import { cp, mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { root, siteDir, base, readCatalog } from "./site-config.mjs";
import { runPnpm } from './pnpm.mjs';

const { games, targets } = await readCatalog();
const run = (workspace) =>
  runPnpm(["--filter", workspace, "build"], {
    cwd: root,
    stdio: "inherit",
  });
run("@game-collection/portal");
for (const game of games) run(targets[game.slug].workspace);

// Assemble a complete release before replacing the previous successful output.
const staging = path.join(root, "dist/.site-staging");
await rm(staging, { recursive: true, force: true });
await mkdir(staging, { recursive: true });
await cp(path.join(root, "apps/portal/dist"), staging, { recursive: true });
await mkdir(path.join(staging, "assets"), { recursive: true });
await cp(
  path.join(root, "shared/browser-navigation.js"),
  path.join(staging, "assets/collection-navigation.js"),
);
for (const game of games) {
  const destination = path.join(staging, "games", game.slug);
  await cp(path.join(root, targets[game.slug].webDir), destination, {
    recursive: true,
  });
  const index = path.join(destination, "index.html");
  const html = await readFile(index, "utf8");
  if (!html.includes("</body>")) throw new Error(`${game.slug} 缺少 HTML body`);
  await writeFile(
    index,
    html.replace(
      "</body>",
      '  <script type="module" src="../../assets/collection-navigation.js"></script>\n</body>',
    ),
  );
}
await writeFile(path.join(staging, ".nojekyll"), "");
const revision = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: root,
  encoding: "utf8",
}).trim();
await writeFile(
  path.join(staging, "release.json"),
  JSON.stringify(
    {
      revision,
      builtAt: new Date().toISOString(),
      base,
      games: games.map((game) => ({
        slug: game.slug,
        path: `${base}games/${game.slug}/`,
      })),
    },
    null,
    2,
  ) + "\n",
);
await rm(siteDir, { recursive: true, force: true });
await rename(staging, siteDir);
console.log(`完整站点已生成：${siteDir}`);
