import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export async function inventory(dir, prefix = '') {
  const result = {};
  for (const item of (await readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
    const file = path.posix.join(prefix, item.name);
    if (item.isDirectory()) Object.assign(result, await inventory(path.join(dir, item.name), file));
    else if (item.isFile() && file !== 'creator-build.json') {
      const content = await readFile(path.join(dir, item.name));
      result[file] = { bytes: content.byteLength, sha256: createHash('sha256').update(content).digest('hex') };
    }
  }
  return result;
}

export async function verifyCreatorExport(dir, target) {
  const metadata = JSON.parse(await readFile(path.join(dir, 'creator-build.json'), 'utf8'));
  assert.equal(metadata.engine, 'Cocos Creator');
  assert.equal(metadata.version, '3.8.8');
  assert.match(metadata.sourceHash, /^[a-f0-9]{64}$/);
  assert.ok([0,36].includes(metadata.cliExitCode));
  const contents = await inventory(dir);
  assert.deepEqual(contents, metadata.files, 'Creator export inventory does not match its provenance');
  const entry = target === 'web' ? 'index.html' : 'game.js';
  assert.ok(contents[entry], `missing ${entry}`);
  assert.ok(contents['cocos-js/cc.js'], 'missing real Cocos engine');
  if (target === 'web') return;
  const project = JSON.parse(await readFile(path.join(dir, 'project.config.json'), 'utf8'));
  assert.equal(project.compileType, 'game');
  assert.equal(project.miniprogramRoot, './');
  const game = JSON.parse(await readFile(path.join(dir, 'game.json'), 'utf8'));
  assert.equal(game.deviceOrientation, 'portrait');
  assert.ok(contents['engine-adapter.js'] && contents['web-adapter.js'], 'missing Creator native adapters');
  const roots = (game.subpackages ?? game.subPackages ?? []).map(p => String(p.root).replace(/\/$/, '') + '/');
  const sizes = { main: 0, ...Object.fromEntries(roots.map(p => [p,0])) };
  for (const [name, file] of Object.entries(contents)) sizes[roots.find(p => name.startsWith(p)) ?? 'main'] += file.bytes;
  for (const [name, size] of Object.entries(sizes)) assert.ok(size < 4 * 1024 * 1024, `${target}/${name}: ${size} bytes exceeds 4 MiB package budget`);
  assert.ok(Object.values(sizes).reduce((a,b) => a+b, 0) < 20 * 1024 * 1024, 'total native package budget exceeded');
  console.log(`${path.basename(path.dirname(dir))}/${target}: official export files and package budgets verified`, sizes);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  for (const target of ['weixin', 'douyin']) await verifyCreatorExport(path.join(process.cwd(), 'dist', target), target);
}
