import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { root, siteDir, base, readCatalog } from "./site-config.mjs";

export async function verifySite(directory = siteDir) {
  const { games, targets } = await readCatalog();
  const release = JSON.parse(
    await readFile(path.join(directory, "release.json"), "utf8"),
  );
  assert.equal(release.base, base);
  assert.deepEqual(
    release.games.map((g) => g.slug).sort(),
    games.map((g) => g.slug).sort(),
  );
  const expected = [
    "index.html",
    "404.html",
    ".nojekyll",
    "assets/collection-navigation.js",
  ];
  for (const game of games) {
    expected.push(
      game.cover,
      `games/${game.slug}/index.html`,
      ...targets[game.slug].requiredAssets.map(
        (asset) => `games/${game.slug}/${asset}`,
      ),
    );
    const html = await readFile(
      path.join(directory, `games/${game.slug}/index.html`),
      "utf8",
    );
    assert.ok(
      html.includes("../../assets/collection-navigation.js"),
      `${game.slug}: 缺少返回大厅入口`,
    );
  }
  for (const file of expected) await access(path.join(directory, file));
  const files = await readdir(directory, { recursive: true });
  let references = 0;
  for (const relative of files.filter((file) => /\.(html|css)$/.test(file))) {
    const content = await readFile(path.join(directory, relative), "utf8");
    const refs = relative.endsWith(".html")
      ? [...content.matchAll(/(?:src|href)=["']([^"']+)["']/g)].map((m) => m[1])
      : [...content.matchAll(/url\(\s*["']?([^\s"')]+)["']?\s*\)/g)].map(
          (m) => m[1],
        );
    for (const ref of refs) {
      if (/^(?:data:|https?:|mailto:|#)/.test(ref)) continue;
      const url = new URL(
        ref,
        `https://example.test${base}${relative.split(path.sep).join("/")}`,
      );
      assert.ok(
        url.pathname.startsWith(base),
        `${relative}: 路径脱离项目子目录 ${ref}`,
      );
      let resolved = path.join(
        directory,
        decodeURIComponent(url.pathname.slice(base.length)),
      );
      if ((await stat(resolved)).isDirectory())
        resolved = path.join(resolved, "index.html");
      await access(resolved);
      references++;
    }
  }
  for (const game of games) {
    const pkg = JSON.parse(
      await readFile(
        path.join(root, "games", game.slug, "package.json"),
        "utf8",
      ),
    );
    assert.ok(!pkg.scripts?.deploy, `${game.slug}: 子游戏不能独立发布`);
    assert.ok(
      !Object.values(pkg.scripts).some((script) => /\bnpm\s/.test(script)),
      `${game.slug}: 仍有 npm 命令`,
    );
  }
  console.log(
    `站点检查通过：${games.length} 款游戏，${references} 个静态资源引用，完整子路径与返回入口。`,
  );
  return { games: games.length, references };
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await verifySite();
