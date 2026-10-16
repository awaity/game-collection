/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
export const WORLD_BOUNDS = freeze({ minX: -20, maxX: 23, minZ: -18, maxZ: 22 });
// 五座邻近 AI 营地的世界坐标（可调）：外圈视觉地面，gate 为门口锚点（玩家交互/导航点，须在可行走区内）
export const AI_CAMPS = freeze({
    hunters: freeze({ x: -17.5, z: 8.5, gate: freeze({ x: -15.6, z: 7.2 }), color: 0xc0573f }),
    fishers: freeze({ x: 20.5, z: 7.5, gate: freeze({ x: 18.6, z: 6.2 }), color: 0x3f7fc0 }),
    merchants: freeze({ x: 9, z: -16.5, gate: freeze({ x: 7.8, z: -14.7 }), color: 0xc0a23f }),
    nomads: freeze({ x: -14.5, z: -15, gate: freeze({ x: -12.8, z: -13.4 }), color: 0x8a5fc0 }),
    bastion: freeze({ x: 2, z: 19.5, gate: freeze({ x: 2, z: 17.6 }), color: 0x5f7d8c }),
});
/** All tunable rules are centralized. Values are part of save schema v3. */
export const RESOURCE = freeze({
    wood: freeze({ name: '木材', height: 0.225, value: 6, color: '#b97843', icon: '▰' }),
    raw: freeze({ name: '生肉', height: 0.175, value: 0, tradeValue: 8, color: '#ed5e66', icon: '◒' }),
    cooked: freeze({ name: '烤肉', height: 0.18, value: 24, color: '#a44927', icon: '◒' }),
    cash: freeze({ name: '钞票', height: 0.125, value: 0, color: '#59e518', icon: '$' }),
    fish: freeze({ name: '鲜鱼', height: 0.18, value: 18, color: '#2796cc', icon: '◈' }),
    cookedFish: freeze({ name: '烤鱼', height: 0.18, value: 34, color: '#c88435', icon: '◈' }),
    berry: freeze({ name: '雪莓', height: 0.14, value: 3, color: '#8a5fc0', icon: '●' }),
});
export const BALANCE = freeze({
    capacity: 36, upgradedCapacity: 60, backpackCost: 120, pondCost: 200,
    speed: 4.5, playerRadius: 0.32, chopInterval: 0.36, huntInterval: 0.44,
    cookTime: 1, fuelPerWood: 3, saleInterval: 0.10, cashInterval: 0.08,
    fishInterval: 0.85, pickupRadius: 1.65, treeRespawn: 14, bearRespawn: 18,
    maxDrops: 120, maxStock: 180, maxFeed: 18, beltInterval: 0.45,
    beltTravel: 1.30, workerCapacity: 8, workerSpeed: 2.9, transferInterval: 0.10,
});
export const STATIONS = freeze({
    forest: { x: -8.4, z: 0 }, hunt: { x: 0, z: 8.6 },
    fire: { x: 1.65, z: 0.6 }, output: { x: -0.05, z: -1.60 },
    woodInput: { x: -1.95, z: 0.15 }, market: { x: 0, z: -4.45 },
    buy: { x: 5.65, z: 1.4 }, fish: { x: 8.3, z: 1.4 },
    woodcutters: { x: -4.85, z: 2.1 }, hunters: { x: -0.15, z: 4.20 },
    woodBelt: { x: -3.45, z: -1.65 }, rawBelt: { x: 3.3, z: 2.95 },
    woodStock: { x: -4.40, z: 0.15 }, rawStock: { x: 1.65, z: 3.9 },
    tradePost: { x: 4.9, z: -3.2 }, siegeEngine: { x: -5.25, z: -3.35 },
    lampPad: { x: -5.9, z: -4.6 }, stoneWallPad: { x: -2.2, z: 4.55 }, watchPostPad: { x: 5.9, z: 3.6 },
    corralPad: { x: -6.6, z: 7.0 }, corral: { x: -7.6, z: 8.4 }, // 围栏在北门外西侧
    corralInteraction: { x: -7.6, z: 6.6 },
    greenhousePad: { x: -3.3, z: -3.5 }, greenhouse: { x: -3.3, z: -4.5 },
    trapPad: { x: 9.0, z: 2.9 }, // 鱼陷阱垫在栈桥旁
});
// 驯鹿围栏（可调）：黎明概率吸引野鹿、增肥价值/出肉曲线（第 1 天 $30 → 第 5 天封顶 $120）、狼群袭栏
export const CORRAL_RULES = freeze({
    cost: 180, maxDeer: 4, attractChance: 0.7,
    valueCurve: freeze([30, 50, 75, 95, 120]), // 按栏内天数取值（封顶末位）
    meatCurve: freeze([3, 4, 6, 8, 10]), // 宰杀出肉（生肉入料仓）
    berryBoostDays: 0.5, // 投喂 1 颗雪莓，全栏加速 0.5 天
    wolfStrength: 4, // 灯网覆盖外时夜袭附加狼群袭栏强度
    coverSafe: 0.3, // 围栏处灯网覆盖 ≥ 此值则安全
});
// 温室（可调）：每日黎明耗 2 木产 2 烤肉，灯网 Lv≥2 补光增产 +50%
export const GREENHOUSE_RULES = freeze({ cost: 220, woodPerDay: 2, cookedPerDay: 2, lampLevelBoost: 2 });
// 鱼陷阱（可调）：$60/个，上限 2 个，每陷阱每天黎明产鲜鱼 ×3 入仓
export const FISHTRAP_RULES = freeze({ cost: 60, max: 2, fishPerDay: 3 });
// 雪莓丛（可调）：外圈 4 丛，驻留采 2 颗，枯萎 2 天再生
export const BERRY_BUSHES = freeze([
    freeze({ id: 'bush-nw', x: -18, z: 3 }),
    freeze({ id: 'bush-ne', x: 14, z: 12 }),
    freeze({ id: 'bush-sw', x: -9, z: -16.5 }),
    freeze({ id: 'bush-se', x: 16, z: -12 }),
]);
export const BERRY_RULES = freeze({ perHarvest: 2, regrowDays: 2 });
// 灯柱可选灯位（可调）：链内间距 ≤ LampNetwork.linkDistance(7.2)，全部可互联成网；13 号位覆盖围栏
export const LAMP_SLOTS = freeze([
    { x: -4.6, z: -4.3 }, { x: 4.6, z: -4.3 }, { x: -6.0, z: 2.6 }, { x: 6.0, z: 0.2 },
    { x: -2.8, z: 4.7 }, { x: 2.8, z: 4.7 }, { x: 8.1, z: 1.7 }, { x: -7.9, z: -1.1 },
    { x: 0.0, z: -3.6 }, { x: -2.7, z: 1.7 }, { x: 3.6, z: 2.0 }, { x: 0.6, z: 6.3 },
    { x: -5.6, z: 6.6 }, // 北门西侧，覆盖驯鹿围栏
    { x: -12.3, z: 7.2 }, { x: -18.0, z: 6.0 },
].map((entry: any) => freeze(entry)));
// 五件先民遗物摆放点（可调）：外圈雪原，靠近驻留收集
export const RELIC_SPOTS = freeze({
    'sun-emblem': freeze({ x: -19, z: -3, name: '日轮徽记' }),
    'frost-antler': freeze({ x: -6, z: 18.5, name: '霜枝鹿角' }),
    'ember-stone': freeze({ x: 12, z: 14, name: '燧火石' }),
    'tide-pearl': freeze({ x: 17, z: -6, name: '冰湖潮珠' }), // 冰湖对岸，解锁冰湖后可达
    'star-compass': freeze({ x: 3, z: -16.5, name: '星轨罗盘' }),
});
// 石墙实体段（可调）：北门两侧夹道，留出中门走道
export const STONE_WALL_SEGMENTS = freeze([
    freeze({ x: -2.9, z: 7.0, w: 2.6, d: 0.7 }),
    freeze({ x: 2.9, z: 7.0, w: 2.6, d: 0.7 }),
]);
export const PURCHASES = freeze({
    hunters: freeze({ name: '雇佣猎手', detail: '两名猎手采集并送回生肉', cost: 10, target: STATIONS.hunters }),
    woodcutters: freeze({ name: '雇佣伐木工', detail: '两名伐木工采集并送回木材', cost: 10, target: STATIONS.woodcutters }),
    rawBelt: freeze({ name: '食材传送带', detail: '把仓储生肉送入营火', cost: 25, target: STATIONS.rawBelt }),
    woodBelt: freeze({ name: '木材传送带', detail: '把仓储木材送入营火', cost: 25, target: STATIONS.woodBelt }),
    tradePost: freeze({ name: '贸易站', detail: '结盟营地可开通雪橇商路', cost: 150, target: STATIONS.tradePost }),
    siegeEngine: freeze({ name: '破冰橇车', detail: '对敌营发起总攻的攻城门票', cost: 300, target: STATIONS.siegeEngine }),
    stoneWall: freeze({ name: '石墙', detail: '北门夹道防线 · 夜袭防御 +8', cost: 250, target: STATIONS.stoneWallPad }),
    watchPost: freeze({ name: '警戒哨塔', detail: '自动警戒 · 夜袭防御 +12', cost: 200, target: STATIONS.watchPostPad }),
    corral: freeze({ name: '驯鹿围栏', detail: '时代Ⅱ · 黎明吸引驯鹿，养肥再宰', cost: 180, target: STATIONS.corralPad }),
    greenhouse: freeze({ name: '温室种植箱', detail: '时代Ⅱ · 每日耗 2 木产 2 烤肉', cost: 220, target: STATIONS.greenhousePad }),
});
// 时代门槛购买项（可调）：corral/greenhouse 需时代 2
export const ERA_GATED_PURCHASES = freeze({ corral: 2, greenhouse: 2 });
export const LAMP_COST = 40; // 可调：灯柱单价（摆放位见 LAMP_SLOTS，逐根购买）
// 资源枯竭梯度（可调）：内圈保底可再生不变；外圈高产但枯竭
export const DEPLETION_RULES = freeze({
    denseHp: 6, denseYield: 16, denseChopFactor: 0.8, // 密林树：HP6（2 倍）、倒地 16 份、节拍 ×0.8、砍完不重生
    rabbitHp: 2, rabbitYield: 3, rabbitRespawn: 60, // 雪兔：HP2 掉 3 份、60s 慢重生
    poachRange: 8, poachPenalty: -2, // 敌营 8m 内偷猎：关系 -2/次（不走 insult 翻脸硬规则）
});
// 深渔区（可调）：冰湖对岸 2 个深水冰洞，灯网 Lv2 解锁，储量耗尽永久枯竭
export const DEEP_FISHING_RULES = freeze({
    holes: freeze([freeze({ x: 19.3, z: 3.6 }), freeze({ x: 19.8, z: -1.0 })]),
    stock: 200, intervalFactor: 0.6, lampLevel: 2,
});
// 统一负荷池（可调）：工人 + 传送带 + 鱼陷阱共享上限，随时代提升
export const LOAD_RULES = freeze({
    byEra: freeze({ 1: 6, 2: 10, 3: 14, 4: 18 }),
    cost: freeze({ hunters: 2, woodcutters: 2, rawBelt: 1, woodBelt: 1, fishtrap: 1 }),
});
