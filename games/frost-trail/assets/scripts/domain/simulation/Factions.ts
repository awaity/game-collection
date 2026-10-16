/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
/** 势力与外交：5 个邻近 AI 营地势力的关系档位、吞并继承、朝贡契约与背信标签。
 * 纯数据 + 纯函数，不依赖 Three.js / DOM；事件经构造注入的 emitter 发射（缺省静默）。
 */
// —— 可调数值表 ——
const RELATION_MIN = -100, RELATION_MAX = 100; // 关系值域
const THRESHOLD: { hostile: number; allied: number; dependent: number; [key: string]: any; } = { hostile: -30, allied: 60, dependent: 85 }; // 档位阈值（merged 由吞并标记决定）
const JITTER = 0.1; // 阈值 ±10% 种子化扰动（可调）
const GIFT_FACTOR: { martial: number; suspicious: number; greedy: number; mobile: number; arrogant: number; [key: string]: any; } = { martial: 1.0, suspicious: 0.6, greedy: 1.5, mobile: 1.0, arrogant: 0.8 }; // 送礼性格加成（可调）
const QUEST_BONUS = 15; // 完成委托的关系奖励（可调）
const INSULT_PENALTY = 8; // 每次误伤的关系扣减（可调）
const INSULT_HOSTILE_HITS = 2; // 误伤翻脸所需次数（可调）
const FORCED_HOSTILE_RELATION = -50; // 强制敌对的关系落点（可调，须低于扰动后阈值）
const DECAY_PER_DAY: { martial: number; suspicious: number; greedy: number; mobile: number; arrogant: number; [key: string]: any; } = { martial: 1.2, suspicious: 2.0, greedy: 1.5, mobile: 1.8, arrogant: 1.0 }; // 每日向 0 衰减（可调）
const STANCE_ANCHOR: { hostile: number; neutral: number; allied: number; dependent: number; [key: string]: any; } = { hostile: -50, neutral: 0, allied: 70, dependent: 96 }; // setStance 落点（可调，须盖过 ±10% 扰动）
const BETRAYAL_PENALTY = 25; // 同盟期偷袭的关系扣减（可调）
const TRUST_PENALTY_PER_BETRAYAL = 10; // 每个背信标签对他营初始信任的扣减（可调）
const TRIBUTE_MIN = 0.1, TRIBUTE_MAX = 0.2; // 朝贡每日上缴产出比例区间
const REVOKE_BASE = 0.4; // 玩家最弱时的基础撕毁概率（可调）
const REVOKE_FACTOR: { martial: number; suspicious: number; greedy: number; mobile: number; arrogant: number; [key: string]: any; } = { martial: 1.2, suspicious: 1.3, greedy: 1.5, mobile: 1.4, arrogant: 1.1 }; // 撕毁倾向（可调）
const REVOKE_RELATION_PENALTY = 20; // 撕毁契约的关系惩罚（可调）
// 五势力定义：签名加成以结构化 modifier 描述，吞并后由 getInheritedModifiers() 汇总继承。
const FACTIONS: { hunters: { name: string; personality: string; personalityLabel: string; modifier: { kind: string; target: string; multiplier: number; description: string; [key: string]: any; }; weakness: { id: string; description: string; [key: string]: any; }; [key: string]: any; }; fishers: { name: string; personality: string; personalityLabel: string; modifier: { kind: string; target: string; description: string; [key: string]: any; }; weakness: { id: string; description: string; [key: string]: any; }; [key: string]: any; }; merchants: { name: string; personality: string; personalityLabel: string; modifier: { kind: string; target: string; rate: number; description: string; [key: string]: any; }; weakness: { id: string; description: string; [key: string]: any; }; [key: string]: any; }; nomads: { name: string; personality: string; personalityLabel: string; modifier: { kind: string; target: string; raidsCaravans: boolean; description: string; [key: string]: any; }; weakness: { id: string; description: string; [key: string]: any; }; [key: string]: any; }; bastion: { name: string; personality: string; personalityLabel: string; modifier: { kind: string; target: string; immuneToBasicAttack: boolean; description: string; [key: string]: any; }; weakness: { id: string; description: string; [key: string]: any; }; [key: string]: any; }; [key: string]: any; } = {
    hunters: { name: '猎户帮', personality: 'martial', personalityLabel: '尚武',
        modifier: { kind: 'production', target: 'hunt', multiplier: 1.25, description: '狩猎产量+25%' },
        weakness: { id: 'noFishing', description: '不会钓鱼' } },
    fishers: { name: '冰湖渔会', personality: 'suspicious', personalityLabel: '多疑',
        modifier: { kind: 'exclusive', target: 'lakeCenterFishing', description: '独占湖心渔场' },
        weakness: { id: 'woodShortage', description: '缺木材' } },
    merchants: { name: '雪口商会', personality: 'greedy', personalityLabel: '贪婪',
        modifier: { kind: 'tax', target: 'tradeRoute', rate: 0.08, description: '商路抽税8%' },
        weakness: { id: 'noHunters', description: '无猎手' } },
    nomads: { name: '游牧毡帐帮', personality: 'mobile', personalityLabel: '机动',
        modifier: { kind: 'ability', target: 'migrate', raidsCaravans: true, description: '可迁徙，会劫商队' },
        weakness: { id: 'noWalls', description: '无墙' } },
    bastion: { name: '石垒寨', personality: 'arrogant', personalityLabel: '傲慢',
        modifier: { kind: 'defense', target: 'stoneWall', immuneToBasicAttack: true, description: '石墙免疫普攻' },
        weakness: { id: 'weakWhileUpgrading', description: '升级中防御弱' } },
};
const clamp = (v: any, lo: any, hi: any) => Math.max(lo, Math.min(hi, v));
export class Factions {
    emitter: { emit(type: any, payload: any): any; } | null;
    rng: (...args: any[]) => number;
    state: { [key: string]: any; };
    /** @param {{ emitter?: {emit(type,payload)}, rng?: () => number, data?: object }} opts */
    constructor({ emitter = null, rng = Math.random, data = null }: { emitter?: { emit(type: any, payload: any): any; } | null; rng?: (...args: any[]) => number; data?: any; [key: string]: any; } = {}) {
        this.emitter = emitter;
        this.rng = rng;
        this.state = {};
        for (const id of Object.keys(FACTIONS)) {
            this.state[id] = { relationship: 0, insults: 0, betrayed: false, merged: false,
                tribute: null, jitter: (this.rng() * 2 - 1) * JITTER };
        }
        if (data)
            this.restore(data);
    }
    _valid(id: any) { return Object.prototype.hasOwnProperty.call(FACTIONS, id); }
    _diplomatic(id: any) { return this._valid(id) && !this.state[id].merged; } // 已合并势力不再参与外交
    /** 静态势力定义（id/中文名/性格/签名加成/缺口），返回拷贝。 */
    list() {
        return Object.entries(FACTIONS).map(([id, d]: any) => ({ id, name: d.name,
            personality: d.personality, personalityLabel: d.personalityLabel,
            modifier: { ...d.modifier }, weakness: { ...d.weakness } }));
    }
    getRelationship(id: any) { return this._valid(id) ? this.state[id].relationship : null; }
    /** 扰动后的有效阈值：每势力创建时用种子化 rng 固定一次，避免档位闪烁。 */
    _thresholds(id: any) {
        const j = 1 + this.state[id].jitter;
        return { hostile: THRESHOLD.hostile * j, allied: THRESHOLD.allied * j, dependent: THRESHOLD.dependent * j };
    }
    getStance(id: any) {
        if (!this._valid(id))
            return null;
        const st = this.state[id];
        if (st.merged)
            return 'merged';
        const t = this._thresholds(id), r = st.relationship;
        if (r > t.dependent)
            return 'dependent';
        if (r > t.allied)
            return 'allied';
        if (r < t.hostile)
            return 'hostile';
        return 'neutral';
    }
    /** 写关系并钳制值域；档位变化时发射 'faction-stance'。 */
    _setRelation(id: any, value: any) {
        const st = this.state[id], before = this.getStance(id);
        st.relationship = clamp(value, RELATION_MIN, RELATION_MAX);
        const after = this.getStance(id);
        if (after !== before)
            this.emitter?.emit('faction-stance', { id, stance: after });
    }
    /** 手动定档（merged 只能走 annex）。 */
    setStance(id: any, stance: any) {
        if (!this._diplomatic(id) || !Object.prototype.hasOwnProperty.call(STANCE_ANCHOR, stance))
            return false;
        this._setRelation(id, STANCE_ANCHOR[stance]);
        return true;
    }
    gift(id: any, value: any) {
        if (!this._diplomatic(id) || !Number.isFinite(value))
            return false;
        this._setRelation(id, this.state[id].relationship + value * GIFT_FACTOR[FACTIONS[id].personality]);
        return true;
    }
    completeQuest(id: any) {
        if (!this._diplomatic(id))
            return false;
        this._setRelation(id, this.state[id].relationship + QUEST_BONUS);
        return true;
    }
    /** 误伤 n 次；累计达到翻脸次数即强制敌对。 */
    insult(id: any, n: number = 1) {
        if (!this._diplomatic(id) || !Number.isFinite(n) || n < 1)
            return false;
        n = Math.floor(n);
        const st = this.state[id];
        st.insults += n;
        const next = st.relationship - INSULT_PENALTY * n;
        this._setRelation(id, st.insults >= INSULT_HOSTILE_HITS ? Math.min(next, FORCED_HOSTILE_RELATION) : next);
        return true;
    }
    /** 长期不往来向 0 衰减，性格影响速率；已合并势力跳过。 */
    decay(dtDays: any) {
        if (!Number.isFinite(dtDays) || dtDays <= 0)
            return;
        for (const [id, st] of Object.entries(this.state)) {
            if (st.merged || st.relationship === 0)
                continue;
            const d = DECAY_PER_DAY[FACTIONS[id].personality] * dtDays;
            this._setRelation(id, st.relationship > 0 ? Math.max(0, st.relationship - d) : Math.min(0, st.relationship + d));
        }
    }
    /** 吞并：标记 merged、终结朝贡，返回该势力签名加成（拷贝）；重复吞并返回 null。 */
    annex(id: any) {
        if (!this._valid(id) || this.state[id].merged)
            return null;
        const st = this.state[id], before = this.getStance(id);
        st.merged = true;
        st.tribute = null;
        if (before !== 'merged')
            this.emitter?.emit('faction-stance', { id, stance: 'merged' });
        this.emitter?.emit('faction-annexed', { id });
        return { factionId: id, ...FACTIONS[id].modifier };
    }
    /** 汇总所有已吞并势力的签名加成（每次调用返回新拷贝）。 */
    getInheritedModifiers() {
        return Object.keys(FACTIONS).filter((id: string) => this.state[id].merged)
            .map((id: string) => ({ factionId: id, ...FACTIONS[id].modifier }));
    }
    setTribute(id: any, rate: any) {
        if (!this._diplomatic(id) || !Number.isFinite(rate) || rate < TRIBUTE_MIN || rate > TRIBUTE_MAX)
            return false;
        this.state[id].tribute = { rate, active: true };
        return true;
    }
    getTribute(id: any) {
        if (!this._valid(id))
            return null;
        const t = this.state[id].tribute;
        return t ? { ...t } : null;
    }
    /** 玩家衰弱时朝贡方概率撕毁契约。playerStrength ∈ [0,1]。返回 true = 契约仍有效。 */
    evaluateTributeLoyalty(id: any, playerStrength: any) {
        if (!this._valid(id))
            return false;
        const st = this.state[id], t = st.tribute;
        if (!t || !t.active)
            return false;
        const s = Number.isFinite(playerStrength) ? clamp(playerStrength, 0, 1) : 0;
        const chance = clamp(REVOKE_BASE * (1 - s) * REVOKE_FACTOR[FACTIONS[id].personality], 0, 0.95);
        if (this.rng() >= chance)
            return true;
        t.active = false;
        this._setRelation(id, st.relationship - REVOKE_RELATION_PENALTY);
        return false;
    }
    /** 同盟期偷袭：打背信标签并扣关系；非同盟/已合并不成立。 */
    betray(id: any) {
        if (!this._diplomatic(id))
            return false;
        const stance = this.getStance(id);
        if (stance !== 'allied' && stance !== 'dependent')
            return false;
        this.state[id].betrayed = true;
        this._setRelation(id, this.state[id].relationship - BETRAYAL_PENALTY);
        this.emitter?.emit('faction-betrayal', { id });
        return true;
    }
    /** 背信者标签对他营初始信任的累计扣减。 */
    getTrustPenalty() {
        return Object.values(this.state).filter((st: any) => st.betrayed).length * TRUST_PENALTY_PER_BETRAYAL;
    }
    snapshot() {
        return { version: 1, factions: Object.fromEntries(Object.entries(this.state).map(([id, st]: [string, any]) => [id, {
                    relationship: st.relationship, insults: st.insults, betrayed: st.betrayed, merged: st.merged,
                    jitter: st.jitter, tribute: st.tribute ? { ...st.tribute } : null
                }])) };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1 || !data.factions || typeof data.factions !== 'object')
            return;
        for (const id of Object.keys(FACTIONS)) {
            const d = data.factions[id];
            if (!d || typeof d !== 'object')
                continue;
            const st = this.state[id];
            st.relationship = Number.isFinite(d.relationship) ? clamp(d.relationship, RELATION_MIN, RELATION_MAX) : 0;
            st.insults = Number.isFinite(d.insults) ? Math.max(0, Math.floor(d.insults)) : 0;
            st.betrayed = d.betrayed === true;
            st.merged = d.merged === true;
            st.jitter = Number.isFinite(d.jitter) ? clamp(d.jitter, -JITTER, JITTER) : 0;
            st.tribute = d.tribute && typeof d.tribute === 'object' && Number.isFinite(d.tribute.rate)
                ? { rate: clamp(d.tribute.rate, TRIBUTE_MIN, TRIBUTE_MAX), active: d.tribute.active !== false } : null;
        }
    }
}
