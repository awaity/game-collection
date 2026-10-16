export type PlantKind = 'sunflower' | 'pea' | 'wallnut' | 'cherry' | 'ice' | 'repeater' | 'mine' | 'mushroom';
export type ZombieKind = 'walker' | 'cone' | 'bucket' | 'runner' | 'paper' | 'giant';
export type Biome = 'day' | 'night' | 'fog';
export type Mode = 'levels' | 'adventure' | 'challenge';
export interface PlantInfo { name: string; cost: number; cooldown: number; hp: number; interval: number; damage: number; color: string; role: string; description: string }
export const PLANTS: Record<PlantKind, PlantInfo> = {
  sunflower: { name: '向日葵', cost: 50, cooldown: 5, hp: 280, interval: 11, damage: 0, color: '#f6c84f', role: '生产阳光', description: '每 11 秒生产 25 阳光。先种两株，让花园持续生长。' },
  pea: { name: '豌豆射手', cost: 100, cooldown: 5, hp: 300, interval: 1.35, damage: 22, color: '#8bc857', role: '直线攻击', description: '向前发射豌豆。每一行都需要可靠的射手守卫。' },
  wallnut: { name: '坚果墙', cost: 50, cooldown: 16, hp: 2400, interval: 0, damage: 0, color: '#c6965f', role: '坚实防御', description: '拥有 2400 生命，挡住僵尸，为后方射手争取时间。' },
  cherry: { name: '樱桃炸弹', cost: 150, cooldown: 28, hp: 9999, interval: 0.8, damage: 1600, color: '#e76e68', role: '九宫格爆破', description: '种下后引爆，清除附近三行三列范围内的僵尸。' },
  ice: { name: '寒冰射手', cost: 175, cooldown: 7, hp: 300, interval: 1.7, damage: 22, color: '#84d5db', role: '减速攻击', description: '冰豌豆让僵尸减速 50%，持续 4 秒。适合对付疾跑者。' },
  repeater: { name: '双发射手', cost: 200, cooldown: 7, hp: 300, interval: 1.35, damage: 44, color: '#58a958', role: '双倍火力', description: '每轮发射两颗豌豆，是对抗铁桶与巨人的主力。' },
  mine: { name: '土豆地雷', cost: 25, cooldown: 12, hp: 240, interval: 9, damage: 1800, color: '#c5a571', role: '伏击陷阱', description: '埋下 9 秒后就绪。僵尸靠近时引爆，对同一行造成重创。' },
  mushroom: { name: '小喷菇', cost: 0, cooldown: 9, hp: 200, interval: 1.6, damage: 18, color: '#ba9acf', role: '近程免费', description: '攻击前方三格。白天也能作战，夜晚伤害额外增加 35%。' },
};
export const PLANT_ORDER = Object.keys(PLANTS) as PlantKind[];
export interface ZombieInfo { name: string; hp: number; speed: number; bite: number; description: string }
export const ZOMBIES: Record<ZombieKind, ZombieInfo> = {
  walker: { name: '普通僵尸', hp: 165, speed: 0.14, bite: 70, description: '慢悠悠地走进花园。一株豌豆射手就能守住它。' },
  cone: { name: '路障僵尸', hp: 350, speed: 0.135, bite: 75, description: '头顶路障，生命更高。搭配坚果墙消耗它。' },
  bucket: { name: '铁桶僵尸', hp: 660, speed: 0.12, bite: 85, description: '厚重铁桶抵挡大量伤害，双发射手与爆炸很有效。' },
  runner: { name: '疾跑僵尸', hp: 200, speed: 0.25, bite: 70, description: '速度很快，寒冰射手能让它冷静下来。' },
  paper: { name: '读报僵尸', hp: 310, speed: 0.12, bite: 80, description: '生命低于一半时丢下报纸，移动和啃食速度大幅提高。' },
  giant: { name: '花园巨人', hp: 1200, speed: 0.095, bite: 170, description: '高生命、强力攻击。集中火力，留一颗樱桃炸弹。' },
};
export interface Level { id: number; name: string; biome: Biome; waves: number; intro: string; unlock?: PlantKind }
export const LEVELS: Level[] = [
  { id: 1, name: '第一缕阳光', biome: 'day', waves: 2, intro: '先种向日葵，再用豌豆射手守住每一行。' },
  { id: 2, name: '不速之客', biome: 'day', waves: 3, intro: '路障僵尸来了，坚果墙是你的好帮手。', unlock: 'mine' },
  { id: 3, name: '午后的疾跑', biome: 'day', waves: 3, intro: '寒冰射手可以减缓疾跑僵尸的脚步。', unlock: 'ice' },
  { id: 4, name: '庭院保卫战', biome: 'day', waves: 4, intro: '守住最后一波！樱桃炸弹可以化解危机。' },
  { id: 5, name: '月亮升起来', biome: 'night', waves: 3, intro: '夜晚没有天降阳光，向日葵依然可以生产。', unlock: 'repeater' },
  { id: 6, name: '蘑菇的秘密', biome: 'night', waves: 3, intro: '免费的近程小喷菇，在夜晚拥有更强火力。', unlock: 'mushroom' },
  { id: 7, name: '深夜读报人', biome: 'night', waves: 4, intro: '报纸被打破后，读报僵尸会愤怒加速。' },
  { id: 8, name: '月光协奏曲', biome: 'night', waves: 4, intro: '搭配寒冰与双发射手，挡住铁桶军团。' },
  { id: 9, name: '迷雾来信', biome: 'fog', waves: 3, intro: '薄雾笼罩右侧草坪，提前铺好各行防线。' },
  { id: 10, name: '铁桶游行', biome: 'fog', waves: 4, intro: '厚重的铁桶需要持续火力，也可以交给地雷。' },
  { id: 11, name: '巨人的脚步', biome: 'fog', waves: 4, intro: '巨人出现了！用坚果拖延，集火守住前线。' },
  { id: 12, name: '我们的花园', biome: 'fog', waves: 5, intro: '最后的花园保卫战，让所有植物一起出力。' },
];
export const CHAPTERS = ['初晴庭院', '月光花圃', '薄雾林地'];
export interface Challenge { id: string; name: string; subtitle: string; description: string; plant: PlantKind; biome: Biome }
export const CHALLENGES: Challenge[] = [
  { id: 'drought', name: '阳光精算师', subtitle: '1,200 阳光，一次机会', description: '不再生产阳光，也没有向日葵。精打细算，守住三波进攻。', plant: 'sunflower', biome: 'day' },
  { id: 'rush', name: '极速尸潮', subtitle: '跑得更快，来得更密', description: '僵尸速度提高 40%，四波快速攻势。用寒冰和坚果稳住局面。', plant: 'ice', biome: 'day' },
  { id: 'fortress', name: '坚果保卫队', subtitle: '五颗坚果，寸土不让', description: '前排自带五颗坚果，但没有割草机。守住四波铁桶进攻。', plant: 'wallnut', biome: 'night' },
  { id: 'endless', name: '无尽守卫', subtitle: '你的花园能坚持多久', description: '每波敌人都会更强。阳光与阵容持续保留，挑战最高波次。', plant: 'repeater', biome: 'fog' },
];
export type PerkId = 'damage' | 'sun' | 'health' | 'bank' | 'cooldown';
export const PERKS: { id: PerkId; name: string; description: string; plant: PlantKind }[] = [
  { id: 'damage', name: '饱满豌豆', description: '所有植物伤害增加 20%', plant: 'pea' },
  { id: 'sun', name: '光合作用', description: '向日葵每次多产 10 阳光', plant: 'sunflower' },
  { id: 'health', name: '扎根生长', description: '所有植物生命增加 30%', plant: 'wallnut' },
  { id: 'bank', name: '阳光储蓄', description: '之后每场初始阳光增加 100', plant: 'sunflower' },
  { id: 'cooldown', name: '快速发芽', description: '种子卡冷却缩短 15%', plant: 'mushroom' },
];
export interface GameConfig {
  mode: Mode; id: string; title: string; biome: Biome; difficulty: number; waves: number;
  startSun: number; skySun: boolean; production: boolean; allowed: PlantKind[];
  speed: number; waveGap: number; endless: boolean; mowers: boolean; fortress: boolean;
  perks: PerkId[]; seed: number;
}
const base: GameConfig = { mode: 'levels', id: '1', title: '', biome: 'day', difficulty: 1, waves: 3, startSun: 300, skySun: true, production: true, allowed: [...PLANT_ORDER], speed: 1, waveGap: 40, endless: false, mowers: true, fortress: false, perks: [], seed: 1309 };
export function levelConfig(id: number): GameConfig {
  const level = LEVELS[Math.max(0, Math.min(11, id - 1))];
  const available = PLANT_ORDER.filter(p => p !== 'mine' || level.id >= 2).filter(p => p !== 'ice' || level.id >= 3).filter(p => p !== 'repeater' || level.id >= 5).filter(p => p !== 'mushroom' || level.id >= 6);
  return { ...base, id: String(level.id), title: `${Math.ceil(level.id / 4)}-${(level.id - 1) % 4 + 1} ${level.name}`, biome: level.biome, difficulty: level.id, waves: level.waves, allowed: available, startSun: level.id === 1 ? 350 : level.biome === 'night' ? 400 : 300, skySun: level.biome !== 'night', seed: level.id * 1309 };
}
export function adventureConfig(round: number, perks: PerkId[], seed: number): GameConfig {
  const biome: Biome = round < 3 ? 'day' : round < 5 ? 'night' : 'fog';
  return { ...base, mode: 'adventure', id: String(round), title: `冒险 ${round} / 5 · ${['出发的清晨', '林间小路', '月夜营地', '星光深处', '守护古树'][round - 1]}`, difficulty: round * 2, waves: round === 5 ? 4 : 3, biome, skySun: biome !== 'night', startSun: 400 + perks.filter(p => p === 'bank').length * 100, perks: [...perks], seed: seed + round * 1741 };
}
export function challengeConfig(id: string): GameConfig {
  const c = CHALLENGES.find(c => c.id === id) ?? CHALLENGES[0];
  return { ...base, mode: 'challenge', id: c.id, title: c.name, biome: c.biome, difficulty: id === 'rush' ? 5 : 7, waves: id === 'drought' ? 3 : 4, startSun: id === 'drought' ? 1200 : 400, skySun: id !== 'drought' && c.biome !== 'night', production: id !== 'drought', allowed: id === 'drought' ? PLANT_ORDER.filter(p => p !== 'sunflower') : [...PLANT_ORDER], speed: id === 'rush' ? 1.4 : 1, waveGap: id === 'rush' ? 28 : 40, endless: id === 'endless', mowers: id !== 'fortress', fortress: id === 'fortress', seed: 5207 };
}
