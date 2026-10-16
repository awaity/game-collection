/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
/** 声望（第四资源）+ 补给卡组 + 祖灵大招：AoE3 船运 / AoM 神力的雪原本地化。
 * 纯逻辑，无 Three.js/DOM 依赖；payload 落地由集成层（GameState）执行。
 * 事件（emitter 缺省静默）：
 *   'prestige'       {points, delta, reason}  声望变动
 *   'supply-called'  {cardId, cost}           呼叫补给卡成功
 *   'power-used'     {powerId, cost}          祖灵大招发动成功
 */
/** 可调：声望产出表（经营行为高权重，军事行为低权重） */
export const PRESTIGE_RULES = freeze({
    gains: freeze({
        sell: 2, // 柜台成交每一份
        cook: 1, // 烤制完成
        workerDelivery: 0.5, // 工人送回
        raidRepelled: 8, // 击退夜袭
        quest: 10, // 完成邻营委托
        gift: 3, // 送礼
        caravan: 4, // 商队归来
        annex: 15, // 吞并
    }),
    max: 999999,
    supplyBaseCost: 30, // 首次呼叫补给点数（前密后疏）
    supplyGrowth: 1.55, // 每次呼叫后阈值倍率
    powerGrowth: 1.5, // 大招复用声望倍率（首次免费）
});
/** 可调：补给手册（payload 由 GameState.applySupplyCard 解释） */
export const SUPPLY_CARDS = freeze({
    foodCrate: freeze({ name: '食材箱', desc: '生肉 ×12 入料仓', payload: freeze({ stock: { raw: 12 } }) }),
    woodCrate: freeze({ name: '木材箱', desc: '木材 ×16 入料仓', payload: freeze({ stock: { wood: 16 } }) }),
    cookedCrate: freeze({ name: '熟食箱', desc: '烤肉 ×8 入料仓', payload: freeze({ stock: { cooked: 8 } }) }),
    fishCrate: freeze({ name: '鲜鱼箱', desc: '鲜鱼 ×8 入仓，可在成品区领取', payload: freeze({ fish: 8 }) }),
    cashPacket: freeze({ name: '银两包', desc: '$60 入柜台托管', payload: freeze({ counter: 60 }) }),
    workGang: freeze({ name: '短工队', desc: '木×10 + 生肉×10 即结', payload: freeze({ stock: { wood: 10, raw: 10 } }) }),
    fuelBundle: freeze({ name: '燃料捆', desc: '燃料垫木材 +8', payload: freeze({ feedWood: 8 }) }),
    beltCoupon: freeze({ name: '传送带折扣券', desc: '下一条传送带免费', payload: freeze({ couponBelt: 1 }) }),
    hasteDay: freeze({ name: '加工提速', desc: '今天烤制提速 ×1.5', payload: freeze({ cookHaste: 1.5 }) }),
    guardVoucher: freeze({ name: '护卫免费券', desc: '下次商队护卫免佣', payload: freeze({ couponGuards: 1 }) }),
    sledRush: freeze({ name: '商路加急', desc: '在途商队进度 +50%', payload: freeze({ rushCaravans: 0.5 }) }),
    envoy: freeze({ name: '安抚使节', desc: '全体友好势力关系 +4', payload: freeze({ envoyGift: 4 }) }),
    nightwatchPay: freeze({ name: '夜防津贴', desc: '下次夜袭防御 +6', payload: freeze({ nightwatch: 6 }) }),
    harvestPrayer: freeze({ name: '丰收祈祷', desc: '今明两日采集 ×1.25', payload: freeze({ gatherBuff: freeze({ mult: 1.25, days: 2 }) }) }),
    marketProp: freeze({ name: '市场护盘', desc: '市价全部复位基准价', payload: freeze({ marketReset: 1 }) }),
    reliefCrate: freeze({ name: '应急粮援', desc: '烤肉×6 + $20', payload: freeze({ stock: { cooked: 6 }, counter: 20 }) }),
});
/** 可调：吞并解锁特产卡（每势力一张，annex-complete 后永久加入手册） */
export const ANNEX_CARDS = freeze({
    reindeerMilk: freeze({ name: '驯鹿奶', faction: 'hunters', desc: '烤肉×10 + 生肉×6', payload: freeze({ stock: { cooked: 10, raw: 6 } }) }),
    fishJerky: freeze({ name: '冰湖鱼干', faction: 'fishers', desc: '鲜鱼 ×12 入仓', payload: freeze({ fish: 12 }) }),
    guardCharter: freeze({ name: '商队护卫证', faction: 'merchants', desc: '护卫免费券 ×2', payload: freeze({ couponGuards: 2 }) }),
    migrantWhistle: freeze({ name: '迁徙警哨', faction: 'nomads', desc: '下次夜袭强度 -40%', payload: freeze({ nightEase: 0.4 }) }),
    stoneBlueprint: freeze({ name: '石垒图纸', faction: 'bastion', desc: '夜袭防御永久 +4', payload: freeze({ permaDefense: 4 }) }),
});
/** 可调：祖灵大招（首次免费，复用 ×1.5 递增） */
export const POWERS = freeze({
    blizzard: freeze({ name: '暴风雪', base: 100, desc: '下次夜袭强度清零（每晚限一次）' }),
    harvest: freeze({ name: '大丰收', base: 80, desc: '今明两日采集/渔获 ×2' }),
    militia: freeze({ name: '全民皆兵', base: 120, desc: '下次夜袭防御 ×1.5' }),
});
const integer = (v: any, max: any, fallback: number = 0) => {
    const n = Number(v);
    return Number.isFinite(n) ? Math.max(0, Math.min(max, Math.floor(n))) : fallback;
};
export class Prestige {
    emitter: any;
    points: number;
    totalEarned: number;
    calls: number;
    unlocked: Set<any>;
    powerUses: { [key: string]: any; };
    constructor({ emitter = null, data = null }: { emitter?: any; data?: any; [key: string]: any; } = {}) {
        this.emitter = emitter;
        this.points = 0;
        this.totalEarned = 0;
        this.calls = 0; // 已呼叫补给次数（阈值递增）
        this.unlocked = new Set(); // 已解锁特产卡 id
        this.powerUses = {}; // powerId → 已用次数
        if (data)
            this.restore(data);
    }
    _emit(type: any, payload: any) { this.emitter?.emit(type, payload); }
    /** 经营/军事行为产出声望。 */
    gain(amount: any, reason: string = 'misc') {
        if (!Number.isFinite(amount) || amount <= 0)
            return false;
        const accepted = Math.min(amount, PRESTIGE_RULES.max - this.points);
        if (accepted <= 0)
            return false;
        this.points += accepted;
        this.totalEarned = Math.min(1e12, this.totalEarned + accepted);
        this._emit('prestige', { points: this.points, delta: accepted, reason });
        return true;
    }
    spend(amount: any) {
        if (!Number.isFinite(amount) || amount <= 0 || this.points < amount)
            return false;
        this.points -= amount;
        this._emit('prestige', { points: this.points, delta: -amount, reason: 'spend' });
        return true;
    }
    // —— 补给卡组 ——
    /** 下一次呼叫所需声望（前密后疏）。 */
    supplyCost() { return Math.round(PRESTIGE_RULES.supplyBaseCost * Math.pow(PRESTIGE_RULES.supplyGrowth, this.calls)); }
    /** 手册全表：基础卡 + 特产卡（带解锁标记与势力名）。 */
    cardList() {
        return [
            ...Object.entries(SUPPLY_CARDS).map(([id, c]: any) => ({ id, ...c, annex: null, unlocked: true })),
            ...Object.entries(ANNEX_CARDS).map(([id, c]: any) => ({ id, ...c, annex: c.faction, unlocked: this.unlocked.has(id) })),
        ];
    }
    /** 吞并解锁特产卡（幂等）。 */
    unlockCard(id: any) {
        if (!Object.prototype.hasOwnProperty.call(ANNEX_CARDS, id) || this.unlocked.has(id))
            return false;
        this.unlocked.add(id);
        return true;
    }
    /** 呼叫补给卡：校验解锁与声望，扣点并返回 {cardId, cost, payload}；失败返回 null。 */
    callCard(id: any) {
        const card = SUPPLY_CARDS[id] ?? ANNEX_CARDS[id];
        if (!card)
            return null;
        if (ANNEX_CARDS[id] && !this.unlocked.has(id))
            return null;
        const cost = this.supplyCost();
        if (this.points < cost)
            return null;
        this.points -= cost;
        this.calls++;
        this._emit('prestige', { points: this.points, delta: -cost, reason: 'supply' });
        this._emit('supply-called', { cardId: id, cost });
        return { cardId: id, cost, payload: card.payload };
    }
    // —— 祖灵大招 ——
    /** 大招当前价：首次免费，之后 base × 1.5^(已用-1)。 */
    powerCost(id: any) {
        if (!Object.prototype.hasOwnProperty.call(POWERS, id))
            return null;
        const uses = this.powerUses[id] ?? 0;
        return uses === 0 ? 0 : Math.round(POWERS[id].base * Math.pow(PRESTIGE_RULES.powerGrowth, uses - 1));
    }
    /** 发动大招：扣声望（首次 0），返回 {powerId, cost}；失败 null。 */
    usePower(id: any) {
        const cost = this.powerCost(id);
        if (cost === null || this.points < cost)
            return null;
        if (cost > 0) {
            this.points -= cost;
            this._emit('prestige', { points: this.points, delta: -cost, reason: 'power' });
        }
        this.powerUses[id] = (this.powerUses[id] ?? 0) + 1;
        this._emit('power-used', { powerId: id, cost });
        return { powerId: id, cost };
    }
    snapshot() {
        return { version: 1, points: Math.floor(this.points), totalEarned: Math.floor(this.totalEarned),
            calls: this.calls, unlocked: Array.from(this.unlocked), powerUses: { ...this.powerUses } };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return false;
        this.points = integer(data.points, PRESTIGE_RULES.max);
        this.totalEarned = integer(data.totalEarned, 1e12);
        this.calls = integer(data.calls, 1000);
        this.unlocked = new Set((Array.isArray(data.unlocked) ? data.unlocked : [])
            .filter((id: any) => Object.prototype.hasOwnProperty.call(ANNEX_CARDS, id)));
        this.powerUses = {};
        for (const [id, n] of Object.entries(data.powerUses && typeof data.powerUses === 'object' ? data.powerUses : {}))
            if (Object.prototype.hasOwnProperty.call(POWERS, id))
                this.powerUses[id] = integer(n, 100);
        return true;
    }
}
