import { execFileSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { readCatalog, root } from "./site-config.mjs";
const { games, targets } = await readCatalog(),
  task = process.argv[2];
if (!["test", "build:mini", "verify:mini"].includes(task))
  throw Error("Unknown game task");
const pnpm = process.platform === "win32" ? "pnpm.cmd" : "pnpm";
for (const game of games) {
  const target = targets[game.slug],
    pkg = JSON.parse(
      await readFile(
        path.join(root, "games", game.slug, "package.json"),
        "utf8",
      ),
    );
  const commands =
    task === "build:mini"
      ? target.miniTargets.map((name) => `build:${name}`)
      : task === "verify:mini" && !pkg.scripts[task]
        ? []
        : [task];
  for (const command of commands) {
    if (!pkg.scripts[command]) throw Error(`${game.slug} lacks ${command}`);
    execFileSync(pnpm, ["--filter", target.workspace, command], {
      cwd: root,
      stdio: "inherit",
    });
  }
}
