import type { GameConfig, PlantKind } from './core/content';
import type { Game } from './core/game';
import type { Save } from './core/save';
import type { Rect } from './render/draw';
export type Screen = 'home' | 'levels' | 'adventure' | 'challenges' | 'almanac' | 'playing' | 'result' | 'perks';
export type Modal = 'settings' | 'help' | 'pause' | 'brief' | 'leave' | 'new-adventure' | 'detail' | null;
export interface View {
  coins?:number; w: number; h: number; safeTop: number; safeBottom: number; time: number;
  screen: Screen; modal: Modal; save: Save; game: Game | null; brief: GameConfig | null;
  selected: PlantKind | null; shovel: boolean; speed: number; chapter: number; almanac: 'plants' | 'zombies';
  seedPage: number; challengePage: number; almanacPage: number;
  detail: string; cursor: { row: number; col: number } | null; toast: string;
}
export interface Hit extends Rect { id: string; label: string; disabled?: boolean }
