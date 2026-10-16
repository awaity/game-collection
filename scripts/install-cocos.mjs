import { createHash } from 'node:crypto';
import { createReadStream, createWriteStream, existsSync } from 'node:fs';
import { mkdir, rm } from 'node:fs/promises';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { execFileSync } from 'node:child_process';
import os from 'node:os';
import path from 'node:path';
import { toolchain } from '../packages/build-tools/src/cocos.mjs';

const wsl = process.platform === 'linux' && /microsoft/i.test(os.release());
if (process.platform !== 'win32' && !wsl) throw Error('This installer uses the official Windows archive. On macOS install Creator 3.8.8 from Cocos Dashboard and set COCOS_CREATOR_PATH. See docs/COCOS.md.');
const cache = process.env.COCOS_DOWNLOAD_CACHE ?? path.join(os.homedir(), '.cache/game-collection-toolchain');
await mkdir(cache, { recursive: true });
const archive = path.join(cache, `CocosCreator-${toolchain.version}.zip`);
const checksum = async () => {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(archive)) hash.update(chunk);
  return hash.digest('hex');
};
if (!existsSync(archive)) {
  console.log(`Downloading official Cocos Creator ${toolchain.version} (~980 MiB)…`);
  const response = await fetch(toolchain.windows.url);
  if (!response.ok || !response.body) throw Error(`Download failed: ${response.status}`);
  await pipeline(Readable.fromWeb(response.body), createWriteStream(`${archive}.partial`));
  const { rename } = await import('node:fs/promises');
  await rename(`${archive}.partial`, archive);
}
if (await checksum() !== toolchain.windows.sha256) throw Error(`Checksum mismatch: remove ${archive} before retrying.`);
const windowsTemp = wsl
  ? execFileSync('wslpath', ['-u', execFileSync('/mnt/c/Windows/System32/cmd.exe', ['/c', 'echo', '%TEMP%'], { cwd: '/mnt/c', encoding: 'utf8' }).trim()], { encoding: 'utf8' }).trim()
  : os.tmpdir();
const destination = path.join(windowsTemp, `game-collection-cocos-${toolchain.version}`);
if (!existsSync(path.join(destination, 'CocosCreator.exe'))) {
  const stage = `${destination}.extracting`;
  await rm(stage, { recursive: true, force: true });
  await mkdir(stage, { recursive: true });
  const toNative = file => wsl ? execFileSync('wslpath', ['-w', file], { encoding: 'utf8' }).trim() : file;
  execFileSync(wsl ? '/mnt/c/Windows/System32/tar.exe' : 'tar.exe', ['-xf', toNative(archive), '-C', toNative(stage)], { stdio: 'inherit' });
  const { rename } = await import('node:fs/promises');
  await rename(stage, destination);
}
console.log(`Verified Creator installation: ${destination}`);
