import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

export const root = fileURLToPath(new URL("../", import.meta.url));
export const siteDir = path.join(root, "dist/site");
export const base = "/game-collection/";
export async function readCatalog() {
  const games = JSON.parse(
    await readFile(path.join(root, "catalog/games.json"), "utf8"),
  );
  const targets = JSON.parse(
    await readFile(path.join(root, "catalog/build-targets.json"), "utf8"),
  );
  validateCatalog(games, targets);
  return { games, targets };
}
export function validateCatalog(games, targets) {
  if (!Array.isArray(games) || !games.length)
    throw new Error("游戏目录不能为空");
  const seen = new Set();
  for (const game of games) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(game.slug) || seen.has(game.slug))
      throw new Error(`无效或重复的 slug: ${game.slug}`);
    seen.add(game.slug);
    for (const key of [
      "title",
      "subtitle",
      "description",
      "cover",
      "coverAlt",
      "duration",
      "tip",
    ])
      if (typeof game[key] !== "string" || !game[key].trim())
        throw new Error(`${game.slug} 缺少 ${key}`);
    if (!/^covers\/[a-z0-9-]+\.(webp|png|jpg)$/.test(game.cover))
      throw new Error(`${game.slug} 封面路径无效`);
    if (
      !game.controls?.touch ||
      !game.controls?.keyboard ||
      !Array.isArray(game.tags)
    )
      throw new Error(`${game.slug} 缺少操作说明或标签`);
    const target = targets[game.slug];
    if (
      !target?.workspace ||
      typeof target.webDir !== "string" ||
      !target.webDir.startsWith(`games/${game.slug}/dist/`) ||
      target.webDir.includes("..") ||
      !Array.isArray(target.miniTargets) ||
      target.miniTargets.length !== 2 ||
      !["weixin", "douyin"].every((name) => target.miniTargets.includes(name))
    )
      throw new Error(`${game.slug} 构建配置无效`);
  }
  if (Object.keys(targets).some((slug) => !seen.has(slug)))
    throw new Error("构建目标中存在未登记游戏");
}
