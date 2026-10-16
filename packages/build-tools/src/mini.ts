import { build } from "esbuild";
import { mkdir, writeFile, rm, cp, readdir, stat } from "node:fs/promises";
import { resolve, join } from "node:path";
import { SOUNDS, synth } from "@game-collection/platform/synth";

export async function buildMini(options: {
  slug: string;
  title: string;
  entry?: string;
  assets?: { from: string; to: string }[];
  banner?: string;
}) {
  const target = process.argv[2];
  if (target !== "weixin" && target !== "douyin")
    throw new Error("Target must be weixin or douyin");
  const out = resolve("dist", target);
  await rm(out, { recursive: true, force: true });
  await mkdir(join(out, "audio"), { recursive: true });
  await build({
    entryPoints: [options.entry ?? "src/mini.ts"],
    outfile: join(out, "game.js"),
    bundle: true,
    format: "iife",
    platform: "neutral",
    target: "es2018",
    minify: true,
    define: { __MINI_TARGET__: JSON.stringify(target) },
    banner: options.banner ? { js: options.banner } : undefined,
    legalComments: "inline",
  });
  for (const name of SOUNDS) {
    const samples = synth(name),
      buffer = Buffer.alloc(44 + samples.length * 2);
    buffer.write("RIFF", 0);
    buffer.writeUInt32LE(buffer.length - 8, 4);
    buffer.write("WAVEfmt ", 8);
    buffer.writeUInt32LE(16, 16);
    buffer.writeUInt16LE(1, 20);
    buffer.writeUInt16LE(1, 22);
    buffer.writeUInt32LE(22050, 24);
    buffer.writeUInt32LE(44100, 28);
    buffer.writeUInt16LE(2, 32);
    buffer.writeUInt16LE(16, 34);
    buffer.write("data", 36);
    buffer.writeUInt32LE(samples.length * 2, 40);
    samples.forEach((sample, i) =>
      buffer.writeInt16LE(
        Math.max(-32768, Math.min(32767, Math.round(sample * 32767))),
        44 + i * 2,
      ),
    );
    await writeFile(join(out, "audio", `${name}.wav`), buffer);
  }
  for (const asset of options.assets ?? [])
    await cp(asset.from, join(out, asset.to), { recursive: true });
  // Per-game IDs avoid accidentally releasing different games under one identity.
  const envKey = `${options.slug.replaceAll("-", "_").toUpperCase()}_${target === "weixin" ? "WEIXIN" : "DOUYIN"}_APP_ID`;
  const appid = process.env[envKey];
  await writeFile(
    join(out, "game.json"),
    JSON.stringify(
      { deviceOrientation: "portrait", showStatusBar: false },
      null,
      2,
    ) + "\n",
  );
  const config = {
    description: options.title,
    appid: appid ?? (target === "weixin" ? "touristappid" : ""),
    projectname: options.slug,
    compileType: "game",
    ...(target === "weixin"
      ? { libVersion: "latest" }
      : { miniprogramRoot: "./" }),
    setting: { es6: false, minified: true, urlCheck: true },
    condition: {},
  };
  await writeFile(
    join(out, "project.config.json"),
    JSON.stringify(config, null, 2) + "\n",
  );
  const size = async (dir: string): Promise<number> => {
    let n = 0;
    for (const name of await readdir(dir)) {
      const path = join(dir, name),
        info = await stat(path);
      n += info.isDirectory() ? await size(path) : info.size;
    }
    return n;
  };
  const bytes = await size(out);
  // Conservative common main-package budget; add subpackages before exceeding it.
  if (bytes > 4 * 1024 * 1024)
    throw new Error(
      `${options.slug}/${target}: main package exceeds 4 MiB (${bytes})`,
    );
  await writeFile(
    join(out, "build-info.json"),
    JSON.stringify(
      {
        slug: options.slug,
        target,
        bytes,
        appIdConfigured: !!appid,
        appIdEnvironment: envKey,
        validation: "build-only",
      },
      null,
      2,
    ) + "\n",
  );
  console.log(
    `${options.slug}/${target}: ${(bytes / 1024).toFixed(0)} KiB; ${appid ? "AppID supplied" : `placeholder — set ${envKey} for device testing`}`,
  );
}
