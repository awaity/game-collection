/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
/** 商路与商队：AoE 式跑商距离定价 + 实物载货。纯逻辑，无渲染/DOM 依赖。 */
export const CARAVAN_BALANCE = freeze({
    basePayout: 12, // 可调：单趟固定收益基数，payout = base × distance^指数
    distanceExponent: 1.3, // 可调：距离收益指数，>1 让远方盟友更值钱
    sellTime: 2, // 可调：抵达后卸货售卖耗时（秒）
    maxRoutes: 8, // 可调：同时开通的商路上限
    maxCaravans: 3, // 可调：同时在途商队上限
    maxCargo: 60, // 可调：单支商队最大载货量
    maxGuards: 4, // 可调：单队护卫上限
    guardCost: 30, // 可调：每名护卫单次雇佣费
    baseAmbushChance: 0.05, // 可调：基础遇袭概率
    nightAmbushBonus: 0.15, // 可调：夜间出发附加遇袭概率
    unlitAmbushBonus: 0.12, // 可调：无灯网路段附加概率（按 1-覆盖率 缩放）
    guardChanceReduction: 0.05, // 可调：每名护卫降低遇袭概率
    ambushLossRatio: 0.5, // 可调：遇袭基础损失比例
    guardLossReduction: 0.2, // 可调：每名护卫降低损失比例
    ambushRollPoint: 0.5, // 可调：途中掷判遇袭的进度点
    tributeBaseLoss: 0.05, // 可调：朝贡基础运输损耗 5%
    tributeDistanceLoss: 0.002, // 可调：朝贡每单位距离附加损耗
    tributeMaxLoss: 0.6, // 可调：朝贡损耗上限
    speedLevels: freeze([
        freeze({ speed: 2, cost: 0 }),
        freeze({ speed: 2.6, cost: 60 }),
        freeze({ speed: 3.4, cost: 140 }),
    ]),
});
const BAL = CARAVAN_BALANCE;
const ROUTE_TYPES = ['trade', 'tribute'];
const LEG_PHASES = ['outbound', 'returning']; // 在路上的段，tribute 无 selling 段
const bounded = (value: any, max: any, fallback: number = 0) => {
    const n = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
    return Number.isFinite(n) ? Math.max(0, Math.min(max, n)) : fallback;
};
const integer = (value: any, max: any, fallback: number = 0) => Math.floor(bounded(value, max, fallback));
export class Caravans {
    emitter: any;
    isAlliedFn: any;
    priceFn: any;
    specialtyFn: any;
    isNightFn: any;
    lampCoverageFn: any;
    deliverFn: any;
    rng: any;
    creditFn: any;
    spendFn: any;
    cash: number;
    speedLevel: number;
    nextRouteId: number;
    routes: any[];
    stockpile: { [key: string]: any; };
    /** 集成层通过 options 注入世界查询与钱包回调，全部可选。
     * isAlliedFn(factionId) 是否结盟；priceFn(type, factionId) 货物单价；
     * specialtyFn(factionId) 返程特产 {type,count}|null；isNightFn() 是否夜晚；
     * lampCoverageFn(factionId) 商路灯网覆盖 0..1；creditFn/spendFn 接管现金（缺省用内部账本）；
     * deliverFn(factionId, cargo, kind) 交付特产/朝贡（缺省入 stockpile）；rng() 随机源。 */
    constructor(options: { [key: string]: any; } = {}, data: any = null) {
        const o = options || {};
        this.emitter = o.emitter ?? null;
        this.isAlliedFn = typeof o.isAlliedFn === 'function' ? o.isAlliedFn : () => false;
        this.priceFn = typeof o.priceFn === 'function' ? o.priceFn : () => 0;
        this.specialtyFn = typeof o.specialtyFn === 'function' ? o.specialtyFn : () => null;
        this.isNightFn = typeof o.isNightFn === 'function' ? o.isNightFn : () => false;
        this.lampCoverageFn = typeof o.lampCoverageFn === 'function' ? o.lampCoverageFn : () => 0;
        this.deliverFn = typeof o.deliverFn === 'function' ? o.deliverFn : null;
        this.rng = typeof o.rng === 'function' ? o.rng : Math.random;
        this.creditFn = typeof o.creditFn === 'function' ? o.creditFn : null;
        this.spendFn = typeof o.spendFn === 'function' ? o.spendFn : null;
        this.cash = Number.isFinite(o.cash) ? Math.max(0, Math.floor(o.cash)) : 0;
        this.speedLevel = 0;
        this.nextRouteId = 1;
        this.routes = [];
        this.stockpile = {};
        if (data)
            this.restore(data);
    }
    get speed() { return BAL.speedLevels[this.speedLevel].speed; }
    _emit(type: any, payload: any) { if (this.emitter && typeof this.emitter.emit === 'function')
        this.emitter.emit(type, payload); }
    _route(routeId: any) { return this.routes.find((r: any) => r.id === routeId) ?? null; }
    _credit(amount: any) { if (this.creditFn)
        this.creditFn(amount);
    else
        this.cash += amount; }
    _spend(amount: any) {
        if (this.spendFn)
            return this.spendFn(amount);
        if (this.cash < amount)
            return false;
        this.cash -= amount;
        return true;
    }
    _deliver(factionId: any, cargo: any, kind: any) {
        if (this.deliverFn) {
            this.deliverFn(factionId, cargo, kind);
            return;
        }
        this.stockpile[cargo.type] = (this.stockpile[cargo.type] ?? 0) + cargo.count;
    }
    _payout(distance: any) { return Math.round(BAL.basePayout * Math.pow(distance, BAL.distanceExponent)); }
    _segmentDuration(route: any, phase: any) { return phase === 'selling' ? BAL.sellTime : route.distance / this.speed; }
    /** 开通商路：需已结盟，距离由集成层提供。返回 routeId，失败返回 null。 */
    openRoute(factionId: any, distance: any, { type = 'trade' }: { type?: string; [key: string]: any; } = {}) {
        if (typeof factionId !== 'string' || !factionId)
            return null;
        if (!Number.isFinite(distance) || distance <= 0)
            return null;
        if (!ROUTE_TYPES.includes(type))
            return null;
        if (!this.isAlliedFn(factionId))
            return null;
        if (this.routes.length >= BAL.maxRoutes)
            return null;
        if (this.routes.some((r: any) => r.factionId === factionId && r.type === type))
            return null;
        const route: { id: string; factionId: string; type: string; distance: any; caravan: any; [key: string]: any; } = { id: `route-${this.nextRouteId++}`, factionId, type, distance, caravan: null };
        this.routes.push(route);
        return route.id;
    }
    /** 路线摘要列表：状态 + 距离固定收益。 */
    listRoutes() {
        return this.routes.map((r: any) => ({
            id: r.id, factionId: r.factionId, type: r.type, distance: r.distance,
            status: r.caravan ? r.caravan.phase : 'idle', estimate: this._payout(r.distance),
        }));
    }
    /** 预计收益与耗时：payout 为固定收益，载货价值取决于 dispatch 时的货物。 */
    estimate(routeId: any) {
        const r = this._route(routeId);
        if (!r)
            return null;
        const oneWay = r.distance / this.speed;
        return { payout: this._payout(r.distance), oneWay,
            roundTrip: oneWay * 2 + (r.type === 'trade' ? BAL.sellTime : 0) };
    }
    /** 商队载货出发：cargo = {type, count}；guards 名护卫先收雇佣费。 */
    dispatch(routeId: any, cargo: any, { guards = 0, freeGuards = false }: { guards?: number; freeGuards?: boolean; [key: string]: any; } = {}) {
        const route = this._route(routeId);
        if (!route || route.caravan)
            return null;
        if (!this.isAlliedFn(route.factionId))
            return null;
        if (this.routes.filter((r: any) => r.caravan).length >= BAL.maxCaravans)
            return null;
        if (!cargo || typeof cargo.type !== 'string' || !cargo.type)
            return null;
        const count = Number(cargo.count);
        if (!Number.isSafeInteger(count) || count < 1 || count > BAL.maxCargo)
            return null;
        if (!Number.isSafeInteger(guards) || guards < 0 || guards > BAL.maxGuards)
            return null;
        if (guards > 0 && !freeGuards && !this._spend(guards * BAL.guardCost))
            return null;
        const coverage = Math.max(0, Math.min(1, Number(this.lampCoverageFn(route.factionId)) || 0));
        const chance = Math.max(0, Math.min(0.95, BAL.baseAmbushChance
            + (this.isNightFn() ? BAL.nightAmbushBonus : 0)
            + (1 - coverage) * BAL.unlitAmbushBonus
            - guards * BAL.guardChanceReduction));
        route.caravan = { cargo: { type: cargo.type, count }, phase: 'outbound', progress: 0,
            guards, ambushChance: chance, rolled: { outbound: false, returning: false },
            pendingEarnings: 0, delivered: 0, returns: null };
        this._emit('caravan-dispatch', { routeId, factionId: route.factionId, cargo: { ...route.caravan.cargo }, guards });
        return routeId;
    }
    /** 途中遇袭判定：去程损货、返程损现金，护卫降低概率与损失。返回损失或 null（平安/不可判）。 */
    resolveAmbush(routeId: any, rng: any = this.rng) {
        const route = this._route(routeId), cv = route?.caravan;
        if (!cv || !LEG_PHASES.includes(cv.phase) || cv.rolled[cv.phase])
            return null;
        cv.rolled[cv.phase] = true;
        if (rng() >= cv.ambushChance)
            return null;
        const ratio = Math.min(1, BAL.ambushLossRatio
            * Math.max(0, 1 - cv.guards * BAL.guardLossReduction)
            * (0.8 + rng() * 0.4));
        let loss;
        if (cv.phase === 'outbound') {
            const lost = Math.min(cv.cargo.count, Math.round(cv.cargo.count * ratio));
            cv.cargo.count -= lost;
            loss = { cargo: lost, cash: 0 };
        }
        else {
            const lost = Math.min(cv.pendingEarnings, Math.round(cv.pendingEarnings * ratio));
            cv.pendingEarnings -= lost;
            loss = { cargo: 0, cash: lost };
        }
        this._emit('caravan-ambushed', { routeId, factionId: route.factionId, loss });
        return loss;
    }
    /** 固定步长推进所有在途商队：outbound → selling → returning → arrived。 */
    update(dt: any) {
        if (!Number.isFinite(dt) || dt <= 0)
            return;
        for (const route of this.routes) {
            let remaining = dt;
            while (remaining > 1e-12 && route.caravan) {
                const cv = route.caravan, dur = this._segmentDuration(route, cv.phase);
                const left = (1 - cv.progress) * dur;
                if (remaining < left) {
                    cv.progress += remaining / dur;
                    remaining = 0;
                }
                else {
                    remaining -= left;
                    this._advance(route);
                }
                if (route.caravan && LEG_PHASES.includes(route.caravan.phase)
                    && route.caravan.progress >= BAL.ambushRollPoint)
                    this.resolveAmbush(route.id);
            }
        }
    }
    _advance(route: any) {
        const cv = route.caravan;
        cv.progress = 0;
        if (cv.phase === 'outbound') {
            if (route.type === 'trade') {
                cv.phase = 'selling';
                const unit = Math.max(0, Number(this.priceFn(cv.cargo.type, route.factionId)) || 0);
                cv.pendingEarnings = cv.cargo.count > 0 ? Math.round(unit * cv.cargo.count) + this._payout(route.distance) : 0;
                const gift = this.specialtyFn(route.factionId);
                cv.returns = gift && typeof gift?.type === 'string' && Number.isFinite(gift.count) && gift.count > 0
                    ? { type: gift.type, count: Math.floor(gift.count) } : null;
            }
            else {
                cv.phase = 'returning';
                const loss = Math.min(BAL.tributeMaxLoss, BAL.tributeBaseLoss + route.distance * BAL.tributeDistanceLoss);
                cv.delivered = Math.round(cv.cargo.count * (1 - loss));
            }
        }
        else if (cv.phase === 'selling') {
            cv.phase = 'returning';
        }
        else { // returning → arrived：现金入账、特产/朝贡交付、路线回归空闲
            const earnings = cv.pendingEarnings;
            if (earnings > 0)
                this._credit(earnings);
            if (cv.returns)
                this._deliver(route.factionId, cv.returns, 'specialty');
            if (route.type === 'tribute' && cv.delivered > 0)
                this._deliver(route.factionId, { type: cv.cargo.type, count: cv.delivered }, 'tribute');
            this._emit('caravan-arrived', { routeId: route.id, factionId: route.factionId,
                earnings, delivered: cv.delivered, returns: cv.returns ? { ...cv.returns } : null });
            route.caravan = null;
        }
    }
    /** 升级雪橇速度（逐级购买），成功返回 true。 */
    upgradeSpeed() {
        const next = BAL.speedLevels[this.speedLevel + 1];
        if (!next || !this._spend(next.cost))
            return false;
        this.speedLevel++;
        return true;
    }
    snapshot() {
        return { version: 1, cash: this.cash, speedLevel: this.speedLevel, nextRouteId: this.nextRouteId,
            stockpile: { ...this.stockpile },
            routes: this.routes.map((r: any) => ({ id: r.id, factionId: r.factionId, type: r.type, distance: r.distance,
                caravan: r.caravan ? { cargo: { ...r.caravan.cargo }, phase: r.caravan.phase, progress: r.caravan.progress,
                    guards: r.caravan.guards, ambushChance: r.caravan.ambushChance, rolled: { ...r.caravan.rolled },
                    pendingEarnings: r.caravan.pendingEarnings, delivered: r.caravan.delivered,
                    returns: r.caravan.returns ? { ...r.caravan.returns } : null } : null })) };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return false;
        this.cash = integer(data.cash, 99999999);
        this.speedLevel = integer(data.speedLevel, BAL.speedLevels.length - 1);
        this.nextRouteId = Math.max(1, integer(data.nextRouteId, 1e6, 1));
        this.stockpile = {};
        if (data.stockpile && typeof data.stockpile === 'object') {
            for (const [k, v] of Object.entries(data.stockpile)) {
                if (k === '__proto__' || typeof k !== 'string')
                    continue;
                const n = integer(v, 1e9);
                if (n > 0)
                    this.stockpile[k] = n;
            }
        }
        this.routes = [];
        const routes = Array.isArray(data.routes) ? data.routes.slice(0, BAL.maxRoutes) : [];
        for (const r of routes) {
            if (typeof r?.id !== 'string' || typeof r?.factionId !== 'string' || !ROUTE_TYPES.includes(r?.type))
                continue;
            if (!Number.isFinite(r.distance) || r.distance <= 0)
                continue;
            if (this.routes.some((x: any) => x.id === r.id))
                continue;
            const route: { id: any; factionId: any; type: any; distance: any; caravan: any; [key: string]: any; } = { id: r.id, factionId: r.factionId, type: r.type, distance: r.distance, caravan: null };
            const c = r.caravan;
            if (c && ['outbound', 'selling', 'returning'].includes(c.phase) && typeof c.cargo?.type === 'string') {
                route.caravan = { cargo: { type: c.cargo.type, count: integer(c.cargo.count, BAL.maxCargo) },
                    phase: c.phase, progress: bounded(c.progress, 1), guards: integer(c.guards, BAL.maxGuards),
                    ambushChance: Math.max(0, Math.min(0.95, Number(c.ambushChance) || 0)),
                    rolled: { outbound: c.rolled?.outbound === true, returning: c.rolled?.returning === true },
                    pendingEarnings: integer(c.pendingEarnings, 99999999), delivered: integer(c.delivered, BAL.maxCargo),
                    returns: c.returns && typeof c.returns?.type === 'string'
                        ? { type: c.returns.type, count: integer(c.returns.count, BAL.maxCargo) } : null };
            }
            const m = /^route-(\d+)$/.exec(r.id);
            if (m)
                this.nextRouteId = Math.max(this.nextRouteId, Number(m[1]) + 1);
            this.routes.push(route);
        }
        return true;
    }
}
