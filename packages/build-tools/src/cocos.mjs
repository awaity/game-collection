import { spawn, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { createWriteStream, existsSync } from 'node:fs';
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import { gunzipSync } from 'node:zlib';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { inventory, verifyCreatorExport } from './cocos-verify.mjs';
import {brandHtml} from './brand.mjs';
import {build as bundle} from 'esbuild';

const root = fileURLToPath(new URL('../../../', import.meta.url));
export const toolchain = JSON.parse(await readFile(path.join(root, 'toolchains/cocos.json'), 'utf8'));
const wsl = process.platform === 'linux' && /microsoft/i.test(os.release());
const windowsPath = (file) => wsl ? execFileSync('wslpath', ['-w', file], { encoding: 'utf8' }).trim().replaceAll('\\', '/') : file;

export function creatorPath() {
  const configured = process.env.COCOS_CREATOR_PATH;
  if (configured) {
    if (!existsSync(configured)) throw Error('COCOS_CREATOR_PATH does not exist');
    return path.resolve(configured);
  }
  const candidates = process.platform === 'darwin'
    ? [`/Applications/Cocos/Creator/${toolchain.version}/CocosCreator.app/Contents/MacOS/CocosCreator`]
    : process.platform === 'win32'
      ? [path.join(os.tmpdir(), `game-collection-cocos-${toolchain.version}`, 'CocosCreator.exe')]
      : wsl
        ? [execFileSync('/mnt/c/Windows/System32/cmd.exe', ['/c', 'echo', '%TEMP%'], { cwd: '/mnt/c', encoding: 'utf8' }).trim()]
            .map(p => execFileSync('wslpath', ['-u', p], { encoding: 'utf8' }).trim())
            .map(p => path.join(p, `game-collection-cocos-${toolchain.version}`, 'CocosCreator.exe'))
        : [];
  const found = candidates.find(p => existsSync(p));
  if (!found) throw Error('Install official Cocos Creator 3.8.8 and set COCOS_CREATOR_PATH. See docs/COCOS.md; Linux builds need a Windows/macOS runner or WSL Windows interop.');
  return found;
}

// read/write also works across WSL DrvFS, where copy_file_range can return EPERM.
async function copy(source, destination) {
  if ((await stat(source)).isDirectory()) {
    await mkdir(destination, { recursive: true });
    for (const file of await readdir(source)) await copy(path.join(source, file), path.join(destination, file));
  } else {
    await mkdir(path.dirname(destination), { recursive: true });
    await writeFile(destination, await readFile(source));
  }
}

async function stableScriptMetadata(dir, key) {
  const id = createHash('sha256').update(`game-collection/${key}`).digest('hex');
  const uuid = `${id.slice(0,8)}-${id.slice(8,12)}-5${id.slice(13,16)}-a${id.slice(17,20)}-${id.slice(20,32)}`;
  const isDirectory = (await stat(dir)).isDirectory();
  await writeFile(`${dir}.meta`, JSON.stringify({ ver: isDirectory ? '1.2.0' : '4.0.24', importer: isDirectory ? 'directory' : 'typescript', imported: true, uuid, files: [], subMetas: {}, userData: {} }, null, 2));
  if (isDirectory) for (const item of await readdir(dir)) {
    if (item.endsWith('.meta')) continue;
    await stableScriptMetadata(path.join(dir, item), `${key}/${item}`);
  }
}

async function files(dir, prefix = '') {
  if (!existsSync(dir)) return [];
  const result = [];
  for (const entry of (await readdir(dir, { withFileTypes: true })).sort((a,b) => a.name.localeCompare(b.name))) {
    const rel = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) result.push(...await files(path.join(dir, entry.name), rel));
    else if (entry.isFile()) result.push(rel);
  }
  return result;
}

async function fingerprint(project, target, appId) {
  const h = createHash('sha256').update(JSON.stringify({ toolchain, target, appId }));
  for (const dir of [path.join(project, 'assets'), path.join(project, 'settings'), path.join(project, 'build-templates'), path.join(root, 'packages/cocos-runtime/src'), path.join(root, 'packages/cocos-runtime/assets'), path.join(root, 'packages/platform/src')]) {
    for (const file of await files(dir)) {
      if (file.startsWith('collection/')) continue;
      h.update(path.basename(dir) + '/' + file).update(await readFile(path.join(dir, file)));
    }
  }
  h.update(await readFile(path.join(project, 'package.json')));
  h.update(await readFile(fileURLToPath(import.meta.url)));
  h.update(await readFile(new URL('./cocos-verify.mjs', import.meta.url)));
  h.update(await readFile(new URL('./brand.mjs', import.meta.url)));
  for(const file of ['entrance.js','entrance.css','brand/mark.svg'])h.update(await readFile(path.join(root,'shared',file)));
  return h.digest('hex');
}

export async function buildCocos(project, target = 'web') {
  project = path.resolve(project);
  const manifest = JSON.parse(await readFile(path.join(project, 'package.json'), 'utf8'));
  if (manifest.creator?.version !== toolchain.version) throw Error('Project Creator version must match toolchains/cocos.json');
  if (!toolchain.targets[target]) throw Error(`Unsupported Creator target: ${target}`);
  const slug = manifest.name, envPrefix = slug.toUpperCase().replaceAll('-', '_');
  const appId = process.env[`${envPrefix}_${target.toUpperCase()}_APP_ID`] ?? '';
  if (target === 'weixin' && appId && !/^wx[a-zA-Z0-9]{16}$/.test(appId)) throw Error('Invalid WeChat AppID');
  if (target === 'douyin' && appId && !/^tt[a-zA-Z0-9]+$/.test(appId)) throw Error('Invalid Douyin AppID');
  const hash = await fingerprint(project, target, appId), destination = path.join(project, 'dist', target);
  const provenanceFile = path.join(destination, 'creator-build.json');
  if (process.env.COCOS_FORCE_BUILD !== '1' && existsSync(provenanceFile)) {
    const prior = JSON.parse(await readFile(provenanceFile, 'utf8'));
    if (prior.sourceHash === hash && prior.files) {
      try {
        await verifyCreatorExport(destination, target);
        console.log(`${slug}/${target}: verified Creator export cache ${hash.slice(0,12)}`);
        return destination;
      } catch { console.log(`${slug}/${target}: incomplete export cache; rebuilding`); }
    }
  }
  const executable = creatorPath();
  const engineDir = process.platform === 'darwin'
    ? path.resolve(executable, '../../Resources/resources/3d/engine')
    : path.join(path.dirname(executable), 'resources/resources/3d/engine');
  const installed = JSON.parse(await readFile(path.join(engineDir, 'package.json'), 'utf8'));
  if (installed.version !== toolchain.version) throw Error(`Expected Creator ${toolchain.version}, found ${installed.version}`);
  const stageRoot = process.env.COCOS_BUILD_CACHE ?? (wsl ? path.join(path.dirname(executable), '../game-collection-cocos-projects') : path.join(os.tmpdir(), 'game-collection-cocos-projects'));
  const stage = path.resolve(stageRoot, slug);
  await mkdir(stage, { recursive: true });
  for (const name of ['assets', 'settings', 'build-templates']) {
    await rm(path.join(stage, name), { recursive: true, force: true });
    if (existsSync(path.join(project, name))) await copy(path.join(project, name), path.join(stage, name));
  }
  if (target !== 'web') for (const wasm of manifest.collection?.nativeWasm ?? []) {
    await rm(path.join(stage, wasm.source), { force: true });
    await rm(path.join(stage, wasm.source + '.meta'), { force: true });
  }
  // Stage workspace modules as Creator assets. No npm installation inside Creator projects.
  await mkdir(path.join(stage, 'assets/collection/platform'), { recursive: true });
  await copy(path.join(root, 'packages/cocos-runtime/src'), path.join(stage, 'assets/collection'));
  for (const name of ['cocos-host.ts', 'cocos-services.ts', 'web-state.ts', 'wasm.ts', 'progression.ts', 'progression-panel.ts','brand.ts']) await copy(path.join(root, 'packages/platform/src', name), path.join(stage, 'assets/collection/platform', name));
  await stableScriptMetadata(path.join(stage, 'assets/collection'), `${slug}/collection`);
  await copy(path.join(root, 'packages/cocos-runtime/assets'), path.join(stage, 'assets/resources/collection'));
  await writeFile(path.join(stage, 'package.json'), JSON.stringify({ name: slug, type: 'module', uuid: manifest.uuid, version: '3.0.0', creator: manifest.creator }, null, 2));
  const scene = JSON.parse(await readFile(path.join(stage, 'assets/main.scene.meta'), 'utf8')).uuid;
  const config = {
    name: slug, platform: toolchain.targets[target], buildPath: 'project://dist', outputName: target,
    debug: false, sourceMaps: false, md5Cache: false, inlineEnum: true, customPipeline: true,
    renderPipeline: '',
    startScene: scene, scenes: [{ url: 'db://assets/main.scene', uuid: scene }],
    bundleConfigs: manifest.collection?.bundles ? [{ name: 'resources', root: 'db://assets/resources', priority: 8, compressionType: 'merge_dep', isRemote: false }, ...manifest.collection.bundles.map(name => ({ name, root: `db://assets/${name}`, compressionType: target === 'web' ? 'merge_dep' : 'subpackage', isRemote: false, priority: 1 }))] : undefined,
    orientation: 'portrait', polyfills: { asyncFunctions: false },
    packages: {
      [toolchain.targets[target]]: { appid: appId, orientation: 'portrait' },
    },
  };
  const configFile = path.join(stage, `build-${target}.json`);
  await writeFile(configFile, JSON.stringify(config, null, 2));
  await rm(path.join(stage, 'dist', target), { recursive: true, force: true });
  const logDir = path.join(project, 'artifacts/creator');
  await mkdir(logDir, { recursive: true });
  const logFile = path.join(logDir, `${target}.log`), log = createWriteStream(logFile);
  console.log(`${slug}/${target}: official Creator ${toolchain.version} CLI (${toolchain.targets[target]})`);
  const code = await new Promise((resolve, reject) => {
    const child = spawn(executable, ['--project', windowsPath(stage), '--build', `configPath=${windowsPath(configFile)}`], { cwd: path.dirname(executable), stdio: ['ignore', 'pipe', 'pipe'] });
    child.stdout.pipe(log, { end: false }); child.stderr.pipe(log, { end: false });
    child.on('error', reject);
    child.on('exit', code => { log.end(); resolve(code); });
  });
  if (code !== 0 && code !== 36) throw Error(`Creator failed (exit ${code}), inspect ${logFile}`);
  const buildLog = await readFile(logFile, 'utf8');
  if (/Missing class:|attached to .* is missing or invalid|Unresolved import|Failed to resolve import/.test(buildLog)) throw Error(`Creator exported an invalid project, inspect ${logFile}`);
  const output = path.join(stage, 'dist', target);
  if (!existsSync(path.join(output, target === 'web' ? 'index.html' : 'game.js'))) throw Error(`Creator produced no ${target} entry, inspect ${logFile}`);
  await rm(destination, { recursive: true, force: true });
  await mkdir(path.dirname(destination), { recursive: true });
  await copy(output, destination);
  // All targets use the collection entrance. Keep the official engine itself intact.
  const settingsFile=path.join(destination,'src/settings.json');
  const exportedSettings=JSON.parse(await readFile(settingsFile,'utf8'));
  exportedSettings.splashScreen={...exportedSettings.splashScreen,totalTime:0,logo:{type:'none'},background:{type:'color',color:{x:245/255,y:245/255,z:251/255,w:1}}};
  await writeFile(settingsFile,JSON.stringify(exportedSettings));
  if (target === 'web') {
    const entry = path.join(destination, 'index.html');
    const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
    const title = escape(manifest.displayName ?? slug);
    const html = (await readFile(entry, 'utf8')).replace(/<!--[\s\S]*?-->/g, '').replace('<html>', '<html lang="zh-CN">')
      .replace(/<title>[^<]*<\/title>/, `<title>${title} · 游戏合集</title>`)
      .replace('</head>', `<meta name="description" content="${escape(manifest.description ?? title)}"><link rel="icon" href="favicon.svg"></head>`);
    await writeFile(entry, await brandHtml(html,manifest.displayName??slug));
    await copy(path.join(root, 'apps/portal/public/favicon.svg'), path.join(destination, 'favicon.svg'));
  }
  if (target !== 'web') {
    // Creator's native bootstrap has its own pre-engine screen, independent of
    // settings.splashScreen. Replace that generated module with the same brand.
    await bundle({entryPoints:[path.join(root,'packages/platform/src/cocos-entrance.ts')],outfile:path.join(destination,'first-screen.js'),bundle:true,format:'cjs',platform:'neutral',target:'es2019',minify:true});
    await Promise.all(['logo.png','slogan.png'].map(file=>rm(path.join(destination,file),{force:true})));
    if(target==='douyin'){
      const entryPath=path.join(destination,'game.js');let entry=await readFile(entryPath,'utf8');
      if(!entry.includes("require('./web-adapter');")||!entry.includes('return application.start();'))throw Error('Unexpected Creator native bootstrap');
      entry=entry.replace("require('./web-adapter');","require('./web-adapter');\nconst firstScreen=require('./first-screen');firstScreen.start('default','default','false');").replace('return application.start();','return firstScreen.end().then(()=>application.start());');
      await writeFile(entryPath,entry);
    }
    const gamePath = path.join(destination, 'game.json');
    const gameConfig = JSON.parse(await readFile(gamePath, 'utf8'));
    // Creator 3.8.8's CLI can leave explicitly selected Asset Bundles in assets/
    // despite compressionType=subpackage. Normalize the official exports to the
    // layout consumed by its native AssetManager, without recompiling any assets.
    if (manifest.collection?.bundles?.length) {
      const settingsPath = path.join(destination, 'src/settings.json');
      const settings = JSON.parse(await readFile(settingsPath, 'utf8'));
      for (const name of manifest.collection.bundles) {
        if (!/^[a-z0-9-]+$/.test(name)) throw Error('Invalid native bundle name');
        const packageRoot = 'subpackages/' + name;
        const exported = path.join(destination, 'assets', name);
        const packaged = path.join(destination, packageRoot);
        if (existsSync(exported)) {
          await mkdir(path.dirname(packaged), { recursive: true });
          await rename(exported, packaged);
          await rename(path.join(packaged, 'index.js'), path.join(packaged, 'game.js'));
        }
        if (!existsSync(path.join(packaged, 'config.json')) || !existsSync(path.join(packaged, 'game.js'))) throw Error(`Incomplete native bundle: ${name}`);
        const subpackages = gameConfig.subpackages ?? gameConfig.subPackages ?? (gameConfig.subpackages = []);
        if (!subpackages.some(p => p.name === name)) subpackages.push({ name, root: packageRoot });
        const bundles = settings.assets.subpackages ?? (settings.assets.subpackages = []);
        if (!bundles.includes(name)) bundles.push(name);
      }
      await writeFile(settingsPath, JSON.stringify(settings));
    }
    for (const wasm of manifest.collection?.nativeWasm ?? []) {
      if (!/^[a-z0-9-]+$/.test(wasm.subpackage) || !/^[a-z0-9-]+\.wasm$/.test(wasm.file)) throw Error('Invalid native WASM package');
      const packageRoot = 'subpackages/' + wasm.subpackage;
      await mkdir(path.join(destination, packageRoot), { recursive: true });
      const bytes = gunzipSync(await readFile(path.join(project, wasm.source)));
      if (!bytes.subarray(0, 4).equals(Buffer.from([0,97,115,109]))) throw Error('Invalid WASM binary');
      await writeFile(path.join(destination, packageRoot, wasm.file), bytes);
      await writeFile(path.join(destination, packageRoot, 'game.js'), '"use strict";\n');
      (gameConfig.subpackages ?? gameConfig.subPackages ?? (gameConfig.subpackages = [])).push({ name: wasm.subpackage, root: packageRoot });
    }
    await writeFile(gamePath, JSON.stringify(gameConfig, null, 2) + '\n');
    const configPath = path.join(destination, 'project.config.json');
    const native = existsSync(configPath) ? JSON.parse(await readFile(configPath, 'utf8')) : {};
    Object.assign(native, { projectname: slug, compileType: 'game', miniprogramRoot: './', appid: appId || (target === 'weixin' ? 'touristappid' : '') });
    await writeFile(configPath, JSON.stringify(native, null, 2) + '\n');
  }
  await writeFile(provenanceFile, JSON.stringify({ engine: 'Cocos Creator', version: toolchain.version, target: toolchain.targets[target], sourceHash: hash, builtAt: new Date().toISOString(), cliExitCode: code, appIdConfigured: Boolean(appId), files: await inventory(destination) }, null, 2) + '\n');
  await verifyCreatorExport(destination, target);
  // Use the installed official declarations for type checking; generated files are ignored.
  await mkdir(path.join(project, 'temp/declarations'), { recursive: true });
  await copy(path.join(stage, 'temp/declarations'), path.join(project, 'temp/declarations'));
  await copy(path.join(engineDir, 'bin/.declarations/cc.d.ts'), path.join(project, 'temp/declarations/cc.d.ts'));
  console.log(`${slug}/${target}: exported to ${destination}`);
  return destination;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await buildCocos(process.cwd(), process.argv[2]);
