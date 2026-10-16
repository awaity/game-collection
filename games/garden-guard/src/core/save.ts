import { CHALLENGES, LEVELS, PERKS, type PerkId } from './content';
import type { Game } from './game';
export const SAVE_KEY = 'garden-guard.save.v1';
export interface Adventure { round: number; perks: PerkId[]; seed: number; awaitingPerk: boolean }
export interface Save {
  version: 1; levels: Record<string, number>; challenges: Record<string, { score: number; wave: number; cleared: number; wins: number }>;
  adventure: Adventure | null; adventuresWon: number;
  settings: { sound: boolean; autoSun: boolean; reducedMotion: boolean };
  totalKills: number;
}
export const newSave = (): Save => ({ version: 1, levels: {}, challenges: {}, adventure: null, adventuresWon: 0, settings: { sound: true, autoSun: false, reducedMotion: false }, totalKills: 0 });
const integer = (v: unknown, max = 1e8): number => typeof v === 'number' && Number.isFinite(v) ? Math.max(0, Math.min(max, Math.floor(v))) : 0;
export function parseSave(raw: unknown): Save {
  const save = newSave();
  try {
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (!v || v.version !== 1) return save;
    for (let id = 1; id <= LEVELS.length; id++) { const stars = integer(v.levels?.[String(id)], 3); if (stars) save.levels[String(id)] = stars; }
    for (const c of CHALLENGES) if (v.challenges?.[c.id]) { const s = v.challenges[c.id]; save.challenges[c.id] = { score: integer(s.score), wave: integer(s.wave), cleared: integer(s.cleared), wins: integer(s.wins) }; }
    for (const k of ['sound', 'autoSun', 'reducedMotion'] as const) if (typeof v.settings?.[k] === 'boolean') save.settings[k] = v.settings[k];
    save.totalKills = integer(v.totalKills);
    save.adventuresWon = integer(v.adventuresWon);
    const a = v.adventure;
    if (a && Number.isInteger(a.round) && a.round >= 1 && a.round <= 5 && Array.isArray(a.perks) && a.perks.length === a.round - 1 && a.perks.every((p: unknown) => PERKS.some(k => k.id === p)) && Number.isInteger(a.seed) && a.seed >= 0 && typeof a.awaitingPerk === 'boolean' && !(a.round === 5 && a.awaitingPerk)) save.adventure = { round: a.round, perks: a.perks, seed: a.seed, awaitingPerk: a.awaitingPerk };
  } catch { /* A damaged save must not prevent the game from starting. */ }
  return save;
}
export function unlockedLevel(save: Save): number {
  let next = 1;
  while (next <= LEVELS.length && save.levels[String(next)]) next++;
  return Math.min(LEVELS.length, next);
}
export function recordResult(save: Save, game: Game): void {
  save.totalKills += game.kills;
  const { mode, id } = game.config;
  if (mode === 'levels' && game.state === 'won') save.levels[id] = Math.max(save.levels[id] ?? 0, game.stars);
  if (mode === 'challenge') {
    const old = save.challenges[id] ?? { score: 0, wave: 0, cleared: 0, wins: 0 };
    save.challenges[id] = { score: Math.max(old.score, game.score), wave: Math.max(old.wave, game.wave), cleared: Math.max(old.cleared ?? 0, game.clearedWaves), wins: old.wins + (game.state === 'won' ? 1 : 0) };
  }
  if (mode === 'adventure' && game.state === 'won' && save.adventure) {
    if (save.adventure.round === 5) { save.adventuresWon++; save.adventure = null; }
    else save.adventure.awaitingPerk = true;
  }
}
