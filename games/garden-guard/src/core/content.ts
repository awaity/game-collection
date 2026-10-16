export type PlantKind = 'sunflower' | 'pea' | 'wallnut' | 'cherry' | 'ice' | 'repeater' | 'mine' | 'mushroom' | 'threepeater' | 'torch' | 'corn' | 'lightning' | 'icebloom' | 'boomerang';
export type ZombieKind = 'walker' | 'cone' | 'bucket' | 'runner' | 'paper' | 'giant' | 'shield' | 'vaulter' | 'dancer' | 'frost' | 'medic';
export type Biome = 'day' | 'night' | 'fog';
export type Mode = 'levels' | 'adventure' | 'challenge';
export interface PlantInfo { name: string; cost: number; cooldown: number; hp: number; interval: number; damage: number; color: string; role: string; description: string }
export const PLANTS: Record<PlantKind, PlantInfo> = {
  sunflower: { name: '向日葵', cost: 50, cooldown: 5, hp: 280, interval: 11, damage: 0, color: '#f6c84f', role: '生产阳光', description: '每 11 秒生产 25 阳光。先种两株，让花园持续生长。' },
  pea: { name: '豌豆射手', cost: 100, cooldown: 5, hp: 300, interval: 1.35, damage: 22, color: '#8bc857', role: '直线攻击', description: '向前发射豌豆。每一行都需要可靠的射手守卫。' },
  wallnut: { name: '坚果墙', cost: 50, cooldown: 16, hp: 2400, interval: 0, damage: 0, color: '#c6965f', role: '坚实防御', description: '拥有 2400 生命，挡住僵尸，为后方射手争取时间。' },
  cherry: { name: '樱桃炸弹', cost: 150, cooldown: 28, hp: 9999, interval: 0.8, damage: 1600, color: '#e76e68', role: '九宫格爆破', description: '种下后引爆，清除附近三行三列范围内的僵尸。' },
  ice: { name: '寒冰射手', cost: 175, cooldown: 7, hp: 300, interval: 1.7, damage: 22, color: '#84d5db', role: '命中冰封', description: '命中立即冰封 1.3 秒，停止移动与啃食，并施加 4 秒减速。解冻后有 2 秒抗冻间隔；冰甲僵尸冰封时间较短。' },
  repeater: { name: '双发射手', cost: 200, cooldown: 7, hp: 300, interval: 1.35, damage: 44, color: '#58a958', role: '双倍火力', description: '每轮发射两颗豌豆，是对抗铁桶与巨人的主力。' },
  mine: { name: '土豆地雷', cost: 25, cooldown: 12, hp: 240, interval: 9, damage: 1800, color: '#c5a571', role: '伏击陷阱', description: '埋下 9 秒后就绪。僵尸靠近时引爆，对同一行造成重创。' },
  mushroom: { name: '小喷菇', cost: 0, cooldown: 9, hp: 200, interval: 1.6, damage: 18, color: '#ba9acf', role: '近程免费', description: '攻击前方三格。白天也能作战，夜晚伤害额外增加 35%。' },
  threepeater: { name: '三线射手', cost: 275, cooldown: 9, hp: 300, interval: 1.5, damage: 22, color: '#72b964', role: '三行覆盖', description: '同时守卫本行和相邻两行。种在中间三行，让每颗豌豆都发挥作用。' },
  torch: { name: '火炬树桩', cost: 150, cooldown: 10, hp: 650, interval: 0, damage: 0, color: '#ef9355', role: '火球与融冰', description: '经过的普通豌豆变成双倍伤害火球，并溅射附近敌人。火球命中冰封敌人额外造成 45 点融冰伤害；冰豌豆不受影响。' },
  corn: { name: '玉米投手', cost: 150, cooldown: 7, hp: 300, interval: 2.4, damage: 55, color: '#eac656', role: '抛射破盾', description: '抛出玉米，越过盾牌造成小范围伤害。命中附带 1 秒减速，适合密集队伍。' },
  lightning: { name: '闪电芦苇', cost: 225, cooldown: 9, hp: 260, interval: 2, damage: 34, color: '#b5a1e5', role: '跨行连锁', description: '攻击前方四格内的敌人，闪电在附近两格内连续跳跃，最多命中四个不同敌人。穿透盾牌。' },
  icebloom: { name: '冰晶菇', cost: 125, cooldown: 28, hp: 9999, interval: .9, damage: 35, color: '#a6e5ec', role: '全场冰封', description: '一次性植物。展开寒潮，对全场造成伤害并冰封 3 秒，可突破普通抗冻间隔。冰甲和巨人的冰封时间较短。' },
  boomerang: { name: '回旋叶', cost: 175, cooldown: 8, hp: 300, interval: 2.2, damage: 24, color: '#7fc6a5', role: '往返穿透', description: '回旋叶穿透同一行多个敌人，飞行五格后返回。去程、回程各命中一次，能穿过盾牌。' },
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
  shield: { name: '铁盾僵尸', hp: 430, speed: .115, bite: 80, description: '铁盾减免 60% 正面豌豆伤害。玉米抛射、回旋叶、闪电与爆炸可以穿透盾牌。' },
  vaulter: { name: '撑杆僵尸', hp: 250, speed: .21, bite: 70, description: '跨过遇到的第一株普通植物，落地后减速。坚果墙会拦下撑杆跳，冰封也能打断接近。' },
  dancer: { name: '舞王僵尸', hp: 400, speed: .12, bite: 70, description: '每 10 秒召唤相邻两行的普通僵尸，最多两次。冰封会暂停召唤，尽早用范围攻击消灭它。' },
  frost: { name: '冰甲僵尸', hp: 520, speed: .14, bite: 90, description: '耐寒护甲使冰封和减速时间缩短。火球对它额外造成 30% 伤害，冰火搭配更有效。' },
  medic: { name: '药箱僵尸', hp: 290, speed: .12, bite: 60, description: '每 4 秒为附近两格内的其他僵尸恢复 26 生命。冻结会中断治疗，连锁闪电可以一起打到它。' },
};
export interface Level { id: number; name: string; biome: Biome; waves: number; intro: string; unlock?: PlantKind }
export const LEVELS: Level[] = [
  { id: 1, name: '第一缕阳光', biome: 'day', waves: 2, intro: '先种向日葵，再用豌豆射手守住每一行。' },
  { id: 2, name: '不速之客', biome: 'day', waves: 3, intro: '路障僵尸来了，坚果墙是你的好帮手。', unlock: 'mine' },
  { id: 3, name: '午后的疾跑', biome: 'day', waves: 3, intro: '首次命中就能冰封！用寒冰射手拦住疾跑，再补上火力。', unlock: 'ice' },
  { id: 4, name: '庭院保卫战', biome: 'day', waves: 4, intro: '守住最后一波！樱桃炸弹可以化解危机。' },
  { id: 5, name: '月亮升起来', biome: 'night', waves: 3, intro: '夜晚没有天降阳光，向日葵依然可以生产。', unlock: 'repeater' },
  { id: 6, name: '蘑菇的秘密', biome: 'night', waves: 3, intro: '免费的近程小喷菇，在夜晚拥有更强火力。', unlock: 'mushroom' },
  { id: 7, name: '三行协奏曲', biome: 'night', waves: 3, intro: '中央三行轮番来袭。把三线射手种在中间，让相邻防线互相照应。', unlock: 'threepeater' },
  { id: 8, name: '火光与铁桶', biome: 'night', waves: 4, intro: '在射手前方种火炬树桩。穿过火焰的豌豆能灼烧成群铁桶。', unlock: 'torch' },
  { id: 9, name: '盾牌背后', biome: 'fog', waves: 3, intro: '铁盾挡住直射豌豆，玉米投手的抛射可以越过盾牌。', unlock: 'corn' },
  { id: 10, name: '跃过花篱', biome: 'fog', waves: 4, intro: '撑杆会跳过第一株植物！坚果墙可以拦下它，回旋叶穿透整行。', unlock: 'boomerang' },
  { id: 11, name: '巨人的脚步', biome: 'fog', waves: 4, intro: '巨人带着药箱队友来了，用闪电同时打击附近的多个敌人。', unlock: 'lightning' },
  { id: 12, name: '冰封舞会', biome: 'fog', waves: 4, intro: '舞王不断召唤同伴。冰晶菇能暂时冻结全场，抓住窗口清理队伍。', unlock: 'icebloom' },
  { id: 13, name: '冰火交响', biome: 'day', waves: 4, intro: '冰甲不怕严寒，却怕火球。寒冰控制普通敌人，火炬对付冰甲。' },
  { id: 14, name: '两翼来袭', biome: 'day', waves: 4, intro: '上下两路承受重点进攻。波次预告会提示方向，别把火力都放中间。' },
  { id: 15, name: '月夜巡诊', biome: 'night', waves: 4, intro: '药箱与盾牌相互掩护。用抛射、闪电和爆破打破治疗阵。' },
  { id: 16, name: '花园大合奏', biome: 'fog', waves: 5, intro: '全植物集结，五波不同主题的联合进攻。最后一波迎战双巨人！' },
];
export const CHAPTERS = ['初晴庭院', '月光花圃', '薄雾林地', '四季合奏'];
export interface Challenge { id: string; name: string; subtitle: string; description: string; plant: PlantKind; biome: Biome }
export const CHALLENGES: Challenge[] = [
  { id: 'drought', name: '阳光精算师', subtitle: '1,200 阳光，一次机会', description: '不再生产阳光，也没有向日葵。精打细算，守住三波进攻。', plant: 'sunflower', biome: 'day' },
  { id: 'rush', name: '极速尸潮', subtitle: '跑得更快，来得更密', description: '僵尸速度提高 40%，四波快速攻势。用寒冰和坚果稳住局面。', plant: 'ice', biome: 'day' },
  { id: 'fortress', name: '坚果保卫队', subtitle: '五颗坚果，寸土不让', description: '前排自带五颗坚果，但没有割草机。守住四波铁桶进攻。', plant: 'wallnut', biome: 'night' },
  { id: 'endless', name: '无尽守卫', subtitle: '全植物开放 · 特殊波次 · 波间补给', description: '无需通关，全部 14 种植物直接可用。清空一波后获得阳光和修复，休整 8 秒再迎战；每五波巨人登场，挑战最高完成波次。', plant: 'threepeater', biome: 'fog' },
  { id: 'frostfire', name: '冰火连奏', subtitle: '先冰封，再融冰爆发', description: '寒冰封住敌人，火炬把普通豌豆变成火球。融冰额外造成 120 伤害，迎战冰甲与疾跑的混合队伍。', plant: 'torch', biome: 'day' },
  { id: 'explosives', name: '爆破工坊', subtitle: '禁用直射 · 冷却减半', description: '只带向日葵、坚果、樱桃、地雷、玉米和冰晶菇。种子冷却减半，用范围爆破解决成群僵尸。', plant: 'corn', biome: 'day' },
  { id: 'compact', name: '十株小花圃', subtitle: '最多十株 · 每个位置都重要', description: '场上最多同时存在十株植物，种子冷却缩短。试试三线覆盖与连锁闪电，及时铲除调整阵容。', plant: 'lightning', biome: 'day' },
  { id: 'harvest', name: '阳光丰收节', subtitle: '金色阳光雨 · 热闹舞王潮', description: '每 2.5 秒落下 50 阳光，种子冷却缩短 35%。尽情尝试全植物组合，对付舞王和疾跑者。', plant: 'sunflower', biome: 'day' },
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
  enemyPool?: ZombieKind[]; focus?: ZombieKind[]; pattern?: 'balanced' | 'center' | 'flanks';
  plantLimit?: number; cooldownScale?: number; sunInterval?: number; sunValue?: number;
}
const base: GameConfig = { mode: 'levels', id: '1', title: '', biome: 'day', difficulty: 1, waves: 3, startSun: 300, skySun: true, production: true, allowed: [...PLANT_ORDER], speed: 1, waveGap: 40, endless: false, mowers: true, fortress: false, perks: [], seed: 1309 };
export function levelConfig(id: number): GameConfig {
  const level = LEVELS[Math.max(0, Math.min(LEVELS.length - 1, Math.floor(id || 1) - 1))];
  const at: Partial<Record<PlantKind, number>> = { mine: 2, ice: 3, repeater: 5, mushroom: 6, threepeater: 7, torch: 8, corn: 9, boomerang: 10, lightning: 11, icebloom: 12 };
  const available = PLANT_ORDER.filter(p => level.id >= (at[p] ?? 1));
  const focuses: ZombieKind[][] = [[], ['cone'], ['runner'], ['cone', 'runner'], ['bucket'], ['paper'], ['paper'], ['bucket'], ['shield'], ['vaulter'], ['giant', 'medic'], ['dancer'], ['frost'], ['vaulter', 'runner'], ['medic', 'shield'], ['shield', 'dancer', 'frost', 'medic', 'giant']];
  const pool: ZombieKind[] = ['walker'];
  if (level.id >= 2) pool.push('cone'); if (level.id >= 3) pool.push('runner');
  if (level.id >= 5) pool.push('bucket'); if (level.id >= 6) pool.push('paper');
  if (level.id >= 9) pool.push('shield'); if (level.id >= 10) pool.push('vaulter');
  if (level.id >= 11) pool.push('medic'); if (level.id >= 12) pool.push('dancer'); if (level.id >= 13) pool.push('frost');
  return { ...base, id: String(level.id), title: `${Math.ceil(level.id / 4)}-${(level.id - 1) % 4 + 1} ${level.name}`, biome: level.biome, difficulty: Math.min(12, level.id), waves: level.waves, allowed: available, startSun: level.id === 1 ? 350 : level.id >= 9 ? 500 : level.biome === 'night' ? 400 : 300, skySun: level.biome !== 'night', seed: level.id * 1309, enemyPool: pool, focus: focuses[level.id - 1], pattern: level.id === 7 ? 'center' : level.id === 14 ? 'flanks' : 'balanced', waveGap: level.id >= 9 ? 44 : 40 };
}
export function adventureConfig(round: number, perks: PerkId[], seed: number): GameConfig {
  const biome: Biome = round < 3 ? 'day' : round < 5 ? 'night' : 'fog';
  return { ...base, mode: 'adventure', id: String(round), title: `冒险 ${round} / 5 · ${['出发的清晨', '林间小路', '月夜营地', '星光深处', '守护古树'][round - 1]}`, difficulty: round * 2, waves: round === 5 ? 4 : 3, biome, skySun: biome !== 'night', startSun: 400 + perks.filter(p => p === 'bank').length * 100, perks: [...perks], seed: seed + round * 1741 };
}
export function challengeConfig(id: string): GameConfig {
  const c = CHALLENGES.find(c => c.id === id) ?? CHALLENGES[0];
  id = c.id;
  const config: GameConfig = { ...base, mode: 'challenge', id, title: c.name, biome: c.biome, difficulty: id === 'rush' ? 5 : id === 'endless' ? 3 : 7, waves: id === 'drought' ? 3 : 4, startSun: id === 'drought' ? 1200 : id === 'endless' ? 600 : 450, skySun: id !== 'drought' && c.biome !== 'night', production: id !== 'drought', allowed: id === 'drought' ? PLANT_ORDER.filter(p => p !== 'sunflower') : [...PLANT_ORDER], speed: id === 'rush' ? 1.4 : 1, waveGap: id === 'rush' ? 28 : 42, endless: id === 'endless', mowers: id !== 'fortress', fortress: id === 'fortress', seed: 5207 };
  if (id === 'frostfire') Object.assign(config, { focus: ['frost', 'runner'], startSun: 650, allowed: ['sunflower', 'pea', 'wallnut', 'cherry', 'ice', 'repeater', 'torch', 'icebloom'] });
  if (id === 'explosives') Object.assign(config, { startSun: 650, allowed: ['sunflower', 'wallnut', 'cherry', 'mine', 'corn', 'icebloom'], cooldownScale: .5, focus: ['shield', 'cone'], pattern: 'center' });
  if (id === 'compact') Object.assign(config, { startSun: 600, plantLimit: 10, cooldownScale: .65, difficulty: 5, focus: ['shield'], waveGap: 46 });
  if (id === 'harvest') Object.assign(config, { sunInterval: 2.5, sunValue: 50, cooldownScale: .65, focus: ['dancer', 'runner'], waveGap: 34 });
  return config;
}

export const ENDLESS_EVENTS = ['常规攻势', '疾跑追逐', '冰甲来袭', '铁盾方阵', '巨人之夜'];
