import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

/** Reuse pnpm's real entry point; Windows cannot exec a .cmd file directly. */
export function runPnpm(args, options = {}) {
  const entry = process.env.npm_execpath;
  if (entry && existsSync(entry) && /\.[cm]?js$/i.test(entry))
    return execFileSync(process.execPath, [entry, ...args], options);
  if (entry && existsSync(entry) && /\.exe$/i.test(entry))
    return execFileSync(entry, args, options);
  if (process.platform !== 'win32') return execFileSync('pnpm', args, options);
  // Only our catalog slugs and fixed script names enter the cmd fallback.
  if (args.some(arg => !/^[a-zA-Z0-9@/_.:-]+$/.test(arg))) throw Error('Unsafe pnpm argument');
  return execFileSync('pnpm.cmd', args, { ...options, shell: true });
}
