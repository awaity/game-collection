import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { once } from "node:events";
import test from "node:test";
import path from "node:path";
import {
  root,
  base,
  readCatalog,
  validateCatalog,
} from "../scripts/site-config.mjs";
import { createSiteServer } from "../scripts/preview-site.mjs";
import { verifySite } from "../scripts/verify-site.mjs";

test("catalog rejects duplicate games, traversal and missing build targets", async () => {
  const { games, targets } = await readCatalog();
  assert.throws(() => validateCatalog([...games, games[0]], targets), /重复/);
  assert.throws(
    () => validateCatalog([{ ...games[0], slug: "../outside" }], targets),
    /无效/,
  );
  assert.throws(() => validateCatalog(games, {}), /构建配置/);
  assert.throws(
    () => validateCatalog(games, { ...targets, ghost: {} }),
    /未登记/,
  );
});

test("the complete release contains both games, real assets and a return path", async () => {
  const verified = await verifySite();
  assert.equal(verified.games, 2);
  assert.ok(verified.references >= 10);
});

test("root and child projects use pnpm with one shared lockfile", async () => {
  await access(path.join(root, "pnpm-lock.yaml"));
  for (const folder of [
    "",
    "apps/portal",
    "games/volley-run",
    "games/zombie-lane",
  ]) {
    const pkg = JSON.parse(
      await readFile(path.join(root, folder, "package.json"), "utf8"),
    );
    assert.equal(pkg.packageManager, "pnpm@11.23.0");
    assert.ok(
      !Object.values(pkg.scripts).some((value) => /\bnpm\s/.test(value)),
    );
    await assert.rejects(access(path.join(root, folder, "package-lock.json")));
    if (folder)
      await assert.rejects(access(path.join(root, folder, "pnpm-lock.yaml")));
  }
});

test("the deployed subpath supports direct navigation, refresh, all covers and actual 404s", async () => {
  const server = createSiteServer();
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  try {
    const rootResponse = await fetch(origin + "/", { redirect: "manual" });
    assert.equal(rootResponse.status, 302);
    assert.equal(rootResponse.headers.get("location"), base);
    const { games } = await readCatalog();
    for (const pathname of [
      base,
      ...games.map((game) => `${base}games/${game.slug}/`),
    ]) {
      for (let attempt = 0; attempt < 2; attempt++) {
        const response = await fetch(origin + pathname);
        assert.equal(response.status, 200, pathname);
        assert.match(await response.text(), /<html lang="zh-CN">/);
      }
    }
    for (const game of games) {
      const response = await fetch(`${origin}${base}${game.cover}`);
      assert.equal(response.status, 200);
      assert.equal(response.headers.get("content-type"), "image/webp");
      assert.ok((await response.arrayBuffer()).byteLength > 5000);
    }
    const slash = await fetch(`${origin}${base}games/zombie-lane?qa=1`, {
      redirect: "manual",
    });
    assert.equal(slash.status, 301);
    assert.equal(
      slash.headers.get("location"),
      `${base}games/zombie-lane/?qa=1`,
    );
    for (const pathname of [
      `${base}missing.js`,
      `${base}games/missing/`,
      "/package.json",
    ])
      assert.equal((await fetch(origin + pathname)).status, 404);
    const missing = await fetch(`${origin}${base}missing/`);
    assert.match(await missing.text(), /href="\/game-collection\/"/);
  } finally {
    server.closeAllConnections();
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
