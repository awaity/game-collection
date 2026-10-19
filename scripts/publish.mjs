import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import ghpages from "gh-pages";
import { root, siteDir } from "./site-config.mjs";
import { verifySite } from "./verify-site.mjs";
import {createGitHubPublisher} from './github-git.mjs';

await verifySite();
const git = (args) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8" }).trim();
if (git(["status", "--porcelain"]))
  throw new Error("发布前请提交源代码；构建产物需对应可追溯的提交。");
const revision = git(["rev-parse", "HEAD"]);
const release = JSON.parse(await readFile(`${siteDir}/release.json`, "utf8"));
if (release.revision !== revision)
  throw new Error("产物对应的提交已过期，请重新执行 pnpm run deploy。");
if (
  git(["remote", "get-url", "origin"]) !==
  "https://github.com/awaity/game-collection.git"
)
  throw new Error("origin 与预期仓库不符。");
const apiTransport=process.argv.includes('--transport=api');
if(process.argv.slice(2).some(arg=>arg!=='--transport=api'))throw new Error('Unknown publication argument');
if(apiTransport){
  const publisher=await createGitHubPublisher();
  await publisher.publishMain(revision);
  const published=await publisher.publishSite(siteDir,revision);
  console.log('gh-pages 已核对：'+published.revision);
}else await new Promise((resolve, reject) =>
  ghpages.publish(
    siteDir,
    {
      branch: "gh-pages",
      dotfiles: true,
      history: true,
      message: `chore(pages): 发布游戏合集 ${revision.slice(0, 8)}`,
    },
    (error) => (error ? reject(error) : resolve()),
  ),
);
console.log(
  `已发布完整站点，源码版本 ${revision.slice(0, 8)}。请检查 https://awaity.github.io/game-collection/`,
);
