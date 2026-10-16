/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
/** 灯网（领地涂色）：灯柱互联成网，按最大连通子网规模分 1–5 级，
 * 输出覆盖度（商路护航/夜袭压制）与采集加成。纯逻辑，无 Three.js/DOM 依赖。
 * 事件（emitter 缺省静默）：'lamp-added' {id, x, z, level}
 */
/** 可调数值表 */
export const LAMP_RULES = freeze({
    linkDistance: 7.2, // 灯柱间距 ≤ 此值自动互联成网
    coverageRadius: 4.5, // 单灯覆盖半径（线性衰减到 0）
    maxLamps: 24, // 灯柱总数上限
    minSpacing: 1.0, // 灯柱最小间距
    levels: freeze([
        freeze({ min: 1, gatherSpeed: 0.05, wolfRepelRadius: 3, caravanGuard: 0.2 }),
        freeze({ min: 3, gatherSpeed: 0.08, wolfRepelRadius: 4, caravanGuard: 0.4 }),
        freeze({ min: 6, gatherSpeed: 0.12, wolfRepelRadius: 5.5, caravanGuard: 0.6 }),
        freeze({ min: 10, gatherSpeed: 0.16, wolfRepelRadius: 7, caravanGuard: 0.8 }),
        freeze({ min: 15, gatherSpeed: 0.20, wolfRepelRadius: 9, caravanGuard: 1.0 }),
    ]),
});
const clamp01 = (n: any) => Math.max(0, Math.min(1, n));
export class LampNetwork {
    emitter: any;
    lamps: any[];
    nextId: number;
    constructor({ emitter = null }: { emitter?: any; [key: string]: any; } = {}) {
        this.emitter = emitter;
        this.lamps = [];
        this.nextId = 1;
    }
    /** 放置灯柱；位置非法/超上限/贴太近返回 null。 */
    addLamp(x: any, z: any) {
        if (!Number.isFinite(x) || !Number.isFinite(z))
            return null;
        if (this.lamps.length >= LAMP_RULES.maxLamps)
            return null;
        if (this.lamps.some((l: any) => Math.hypot(l.x - x, l.z - z) < LAMP_RULES.minSpacing))
            return null;
        const lamp: { id: string; x: any; z: any; [key: string]: any; } = { id: `lamp-${this.nextId++}`, x, z };
        this.lamps.push(lamp);
        this.emitter?.emit('lamp-added', { id: lamp.id, x, z, level: this.getNetworkLevel() });
        return lamp.id;
    }
    /** 并查集：按 linkDistance 求连通子网规模列表。 */
    _componentSizes() {
        const parent = this.lamps.map((_: any, i: number) => i);
        const find = (i: any) => { while (parent[i] !== i) {
            parent[i] = parent[parent[i]];
            i = parent[i];
        } return i; };
        for (let i = 0; i < this.lamps.length; i++)
            for (let j = i + 1; j < this.lamps.length; j++)
                if (Math.hypot(this.lamps[i].x - this.lamps[j].x, this.lamps[i].z - this.lamps[j].z) <= LAMP_RULES.linkDistance)
                    parent[find(i)] = find(j);
        const sizes = new Map();
        for (let i = 0; i < this.lamps.length; i++) {
            const r = find(i);
            sizes.set(r, (sizes.get(r) ?? 0) + 1);
        }
        return [...Array.from(sizes.values())];
    }
    /** 最大连通子网的灯柱数。 */
    getConnectedCount() {
        if (!this.lamps.length)
            return 0;
        return Math.max(...this._componentSizes());
    }
    /** 网络等级 0–5（0 = 无灯）。 */
    getNetworkLevel() {
        const n = this.getConnectedCount();
        let level = 0;
        for (let i = 0; i < LAMP_RULES.levels.length; i++)
            if (n >= LAMP_RULES.levels[i].min)
                level = i + 1;
        return level;
    }
    /** 某点覆盖度 0..1：取最近灯柱的线性衰减。 */
    getCoverageAt(x: any, z: any) {
        if (!Number.isFinite(x) || !Number.isFinite(z) || !this.lamps.length)
            return 0;
        let best = 0;
        for (const l of this.lamps) {
            const c = 1 - Math.hypot(l.x - x, l.z - z) / LAMP_RULES.coverageRadius;
            if (c > best)
                best = c;
        }
        return clamp01(best);
    }
    /** 当前网络等级的加成汇总（未联网时全 0）。 */
    getBonuses() {
        const level = this.getNetworkLevel();
        if (!level)
            return { level: 0, gatherSpeed: 0, wolfRepelRadius: 0, caravanGuard: 0 };
        const l = LAMP_RULES.levels[level - 1];
        return { level, gatherSpeed: l.gatherSpeed, wolfRepelRadius: l.wolfRepelRadius, caravanGuard: l.caravanGuard };
    }
    hasLamps() { return this.lamps.length > 0; }
    snapshot() { return { version: 1, nextId: this.nextId, lamps: this.lamps.map((l: any) => ({ ...l })) }; }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return false;
        const lamps = Array.isArray(data.lamps) ? data.lamps : [];
        this.lamps = [];
        this.nextId = Math.max(1, Math.floor(Number(data.nextId) || 1));
        for (const l of lamps.slice(0, LAMP_RULES.maxLamps)) {
            if (typeof l?.id !== 'string' || !Number.isFinite(l.x) || !Number.isFinite(l.z))
                continue;
            if (this.lamps.some((o: any) => o.id === l.id))
                continue;
            if (this.lamps.some((o: any) => Math.hypot(o.x - l.x, o.z - l.z) < LAMP_RULES.minSpacing))
                continue;
            this.lamps.push({ id: l.id, x: l.x, z: l.z });
            const m = /^lamp-(\d+)$/.exec(l.id);
            if (m)
                this.nextId = Math.max(this.nextId, Number(m[1]) + 1);
        }
        return true;
    }
}
