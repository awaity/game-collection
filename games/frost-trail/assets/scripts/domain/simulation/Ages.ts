/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
/** 营地时代与地标：纯数据+纯函数，不依赖 Three.js / DOM，可用 node:test 直接测试。 */
export const MAX_ERA = 4;
export const ERA_NAMES = freeze({ 1: '篝火营', 2: '木屋营', 3: '集镇营', 4: '冰城营' });
/** 升代双门槛：资源储备 + 前置建筑数量。数值可调。
 * 时代 3/4 木材门槛对齐可支配上限（料仓 180 + 燃料垫 18 + 扩容背包 60 = 258）。 */
export const ERA_REQUIREMENTS = freeze({
    2: freeze({ wood: 200, cash: 500, buildings: freeze(['warehouse', 'belt']) }), // 可调
    3: freeze({ wood: 220, cash: 2000, buildings: freeze(['tradePost', 'lampline']) }), // 可调
    4: freeze({ wood: 240, cash: 6000, buildings: freeze(['stoneWall', 'watchPost']) }), // 可调
});
/** 地标二选一：每时代 2 座，各带 modifiers（加成）与 unlocks（解锁项）。数值可调。 */
export const LANDMARKS = freeze({
    sawTower: freeze({ era: 2, name: '伐木高塔', modifiers: freeze({ forestry: 0.20 }), unlocks: freeze(['fastAxe']) }),
    hunterLodge: freeze({ era: 2, name: '猎人长屋', modifiers: freeze({ hunting: 0.20, wolfDeterrence: 1 }), unlocks: freeze(['wolfWard']) }),
    caravanStation: freeze({ era: 3, name: '商队驿站', modifiers: freeze({ tradeRoutes: 0.25 }), unlocks: freeze(['sledgeConvoy']) }),
    watchTower: freeze({ era: 3, name: '警戒哨塔', modifiers: freeze({ nightDefense: 0.25 }), unlocks: freeze(['alarmBell']) }),
    crystalRefinery: freeze({ era: 4, name: '冰晶熔炉', modifiers: freeze({ cooking: 0.30 }), unlocks: freeze(['fastGrill']) }),
    emberCitadel: freeze({ era: 4, name: '炉火议事厅', modifiers: freeze({ morale: 0.20, prestige: 0.25 }), unlocks: freeze(['hegemonBanner']) }),
});
/** 施工期长度（游戏日）与脆弱窗口修饰符。可调。 */
export const UPGRADE_DAYS = 1; // 可调
export const VULNERABILITY_MODIFIERS = freeze({ productionHalted: true, raidIntensity: 1.5 }); // 可调
const buildingCount = (state: any, id: any) => {
    const b = state?.buildings;
    if (Array.isArray(b))
        return b.filter((x: any) => x === id).length;
    if (b && typeof b === 'object')
        return Number.isFinite(b[id]) ? Math.max(0, Math.floor(b[id])) : 0;
    return 0;
};
/** 权威时代状态：升代门槛、施工脆弱窗口、地标二选一与吞并夺回。 */
export class Ages {
    emitter: any;
    era: number;
    upgrading: ({ targetEra: number; remaining: number; [key: string]: any; } | { targetEra: any; remaining: number; [key: string]: any; }) | null;
    chosen: any[];
    lost: { [key: string]: any; };
    recovered: any[];
    /** @param emitter 可选事件发射器（emit(type, payload)），缺省则静默 */
    constructor({ emitter = null }: { emitter?: any; [key: string]: any; } = {}) {
        this.emitter = emitter;
        this.era = 1;
        this.upgrading = null; // { targetEra, remaining }（remaining 单位：游戏日）
        this.chosen = []; // 已建地标 id
        this.lost = {}; // 落选地标 id -> 持有它的敌营 factionId
        this.recovered = []; // 吞并后夺回的地标 id
    }
    emit(type: any, payload: any) { this.emitter?.emit(type, payload); }
    getEra() { return this.era; }
    getEraName() { return ERA_NAMES[this.era]; }
    isVulnerable() { return this.upgrading !== null; }
    /** 施工期修饰符：加工停产 + 夜袭强度上调，供生产/夜哨系统消费。 */
    getVulnerabilityModifiers() {
        return this.upgrading ? { ...VULNERABILITY_MODIFIERS } : { productionHalted: false, raidIntensity: 1 };
    }
    /** 门槛判定，返回 { ok, missing:[{kind,id,need,have}] } 供 UI 显示缺什么。 */
    canUpgrade(state: any) {
        const missing: {kind:string;id:string;need:number;have:number}[] = [];
        if (this.era >= MAX_ERA || this.upgrading)
            return { ok: false, missing };
        const req = ERA_REQUIREMENTS[this.era + 1];
        for (const res of ['wood', 'cash']) {
            const have = res === 'cash' ? (Number.isFinite(state?.cash) ? state.cash : 0)
                : (Number.isFinite(state?.camp?.stock?.wood) ? state.camp.stock.wood : 0);
            if (have < req[res])
                missing.push({ kind: 'resource', id: res, need: req[res], have });
        }
        for (const id of req.buildings) {
            const have = buildingCount(state, id);
            if (have < 1)
                missing.push({ kind: 'building', id, need: 1, have });
        }
        return { ok: missing.length === 0, missing };
    }
    /** 满足门槛后进入施工期；返回 false 表示不能开工。 */
    startUpgrade(state: any) {
        if (!this.canUpgrade(state).ok)
            return false;
        this.upgrading = { targetEra: this.era + 1, remaining: UPGRADE_DAYS };
        this.emit('era-upgrade-start', { era: this.upgrading.targetEra });
        return true;
    }
    /** 推进施工进度（单位：游戏日）；本调用内完工则返回 true。 */
    advance(days: number = 1) {
        if (!this.upgrading || !Number.isFinite(days) || days <= 0)
            return false;
        this.upgrading.remaining -= days;
        if (this.upgrading.remaining > 1e-8)
            return false;
        this.completeUpgrade();
        return true;
    }
    /** 结算升代；未在施工返回 false。 */
    completeUpgrade() {
        if (!this.upgrading)
            return false;
        this.era = this.upgrading.targetEra;
        this.upgrading = null;
        this.emit('era-upgraded', { era: this.era });
        return true;
    }
    /** 某时代的 2 座候选地标（含 id 与完整定义）。 */
    getLandmarkChoices(era: any) {
        return Object.entries(LANDMARKS).filter(([, l]: any) => l.era === era)
            .map(([id, l]: any) => ({ id, ...l }));
    }
    /** 已拥有（自建+夺回）的地标 id 列表。 */
    getOwnedLandmarks() { return [...this.chosen, ...this.recovered]; }
    /** 汇总已拥有地标的修饰符（同名相加），供各系统消费。 */
    getActiveModifiers() {
        const total: { [key: string]: any; } = {};
        for (const id of this.getOwnedLandmarks())
            for (const [k, v] of Object.entries(LANDMARKS[id].modifiers))
                total[k] = (total[k] ?? 0) + v;
        return total;
    }
    /** 已拥有地标提供的解锁项列表。 */
    getUnlocks() { return this.getOwnedLandmarks().flatMap((id: any) => LANDMARKS[id].unlocks); }
    /** 升代后二选一：选定 choice，另一座归敌营 factionId（供吞并夺回）。 */
    chooseLandmark(era: any, choice: any, factionId: any = null) {
        if (!Number.isInteger(era) || era < 2 || era > this.era || this.upgrading)
            return false;
        const candidates = this.getLandmarkChoices(era).map((c: any) => c.id);
        if (!candidates.includes(choice) || this.chosen.some((id: any) => LANDMARKS[id].era === era))
            return false;
        this.chosen.push(choice);
        const other = candidates.find((id: string) => id !== choice);
        this.lost[other] = factionId;
        this.emit('landmark-chosen', { id: choice, era });
        this.emit('landmark-lost', { id: other, factionId });
        return true;
    }
    /** 吞并敌营后夺回其持有的落选地标，并入我方加成。 */
    annexRecoverLandmark(landmarkId: any) {
        if (!Object.prototype.hasOwnProperty.call(this.lost, landmarkId))
            return false;
        const factionId = this.lost[landmarkId];
        delete this.lost[landmarkId];
        this.recovered.push(landmarkId);
        this.emit('landmark-recovered', { id: landmarkId, factionId });
        return true;
    }
    snapshot() {
        return { version: 1, era: this.era,
            upgrading: this.upgrading ? { ...this.upgrading } : null,
            chosen: [...this.chosen], lost: { ...this.lost }, recovered: [...this.recovered] };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return false;
        const era = Number.isInteger(data.era) && data.era >= 1 && data.era <= MAX_ERA ? data.era : 1;
        const known = (id: any) => typeof id === 'string' && Object.prototype.hasOwnProperty.call(LANDMARKS, id);
        this.era = era;
        this.chosen = (Array.isArray(data.chosen) ? data.chosen : []).filter(known)
            .filter((id: any, i: any, arr: any) => arr.indexOf(id) === i && LANDMARKS[id].era <= era);
        this.recovered = (Array.isArray(data.recovered) ? data.recovered : []).filter(known)
            .filter((id: any, i: any, arr: any) => arr.indexOf(id) === i && !this.chosen.includes(id) && LANDMARKS[id].era <= era);
        this.lost = {};
        for (const [id, fid] of Object.entries(data.lost && typeof data.lost === 'object' ? data.lost : {}))
            if (known(id) && LANDMARKS[id].era <= era && !this.chosen.includes(id) && !this.recovered.includes(id))
                this.lost[id] = typeof fid === 'string' ? fid : null;
        this.upgrading = null;
        const up = data.upgrading;
        if (up && Number.isInteger(up.targetEra) && up.targetEra === era + 1 && era < MAX_ERA)
            this.upgrading = { targetEra: up.targetEra,
                remaining: Number.isFinite(up.remaining) ? Math.max(0.001, Math.min(UPGRADE_DAYS, up.remaining)) : UPGRADE_DAYS };
        return true;
    }
}
