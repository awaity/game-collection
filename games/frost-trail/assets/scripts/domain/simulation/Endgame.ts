/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
/**
 * 终局四路径模块：霸权 / 奇观 / 圣物 / 征服。
 * 纯逻辑、纯数据：不 import Three.js 或 DOM，外部世界（关系、天数、库存、势力名单）
 * 全部通过构造注入的查询函数读取；事件通过注入的 emitter 发射，缺省则静默。
 * 任一终局动作都会进入全图公开倒计时，并按关系值分档逼迫所有势力表态。
 */
export const ENDGAME_PATHS = ['hegemony', 'wonder', 'relics', 'conquest'];
export const ENDGAME_CONFIG: { secondsPerDay: number; finalPhaseSeconds: number; hegemony: { requiredDays: number; countdownSeconds: number; qualifyingRelations: string[]; [key: string]: any; }; wonder: { cost: { cash: number; wood: number; cooked: number; [key: string]: any; }; buildDays: number; countdownDays: number; buildThreatMultiplier: number; [key: string]: any; }; relics: { polarNightDays: number; list: { 'sun-emblem': { name: string; income: { cash: number; [key: string]: any; }; [key: string]: any; }; 'frost-antler': { name: string; income: { raw: number; [key: string]: any; }; [key: string]: any; }; 'ember-stone': { name: string; income: { cooked: number; [key: string]: any; }; [key: string]: any; }; 'tide-pearl': { name: string; income: { fish: number; [key: string]: any; }; [key: string]: any; }; 'star-compass': { name: string; income: { cash: number; wood: number; [key: string]: any; }; [key: string]: any; }; [key: string]: any; }; [key: string]: any; }; reactions: { aidMinValue: number; attackMaxValue: number; [key: string]: any; }; assault: { baseWaves: number; wavesPerAttacker: number; baseStrength: number; strengthPerAttacker: number; waveIntervalSeconds: number; [key: string]: any; }; [key: string]: any; } = {
    secondsPerDay: 120, // 可调：一个游戏日折合的现实秒数（天数制倒计时换算用）
    finalPhaseSeconds: 60, // 可调：倒计时剩余多少秒进入"最后一夜"阶段
    hegemony: {
        requiredDays: 10, // 可调：霸权线需连续维持多数友好关系的游戏日数
        countdownSeconds: 90, // 可调：霸权达标后的公开倒计时长（秒）
        qualifyingRelations: ['allied', 'dependent', 'merged'], // 计入"友好多数"的关系档
    },
    wonder: {
        cost: { cash: 8000, wood: 150, cooked: 40 }, // 可调：永恒篝火开工资源表
        buildDays: 5, // 可调：建造天数（期间袭击频率翻倍）
        countdownDays: 3, // 可调：建成后需守住的天数
        buildThreatMultiplier: 2, // 可调：建造期袭击频率倍率
    },
    relics: {
        polarNightDays: 2, // 可调：集齐后需守住的一个极夜周期（天数）
        list: {
            'sun-emblem': { name: '日轮徽记', income: { cash: 40 } },
            'frost-antler': { name: '霜枝鹿角', income: { raw: 4 } },
            'ember-stone': { name: '燧火石', income: { cooked: 2 } },
            'tide-pearl': { name: '冰湖潮珠', income: { fish: 3 } },
            'star-compass': { name: '星轨罗盘', income: { cash: 25, wood: 4 } },
        },
    },
    reactions: {
        aidMinValue: 50, // >= 此值：派工赶工（aid）
        attackMaxValue: -20, // <= 此值：集结进攻（attack）；介于两者之间：坐地起价（price-hike）
    },
    assault: {
        baseWaves: 2,
        wavesPerAttacker: 1,
        baseStrength: 10,
        strengthPerAttacker: 6,
        waveIntervalSeconds: 30,
    },
};
// 配置覆盖：逐节浅合并，relics.list 按遗物 id 逐条覆盖
const mergeConfig = (override: { [key: string]: any; } = {}) => {
    const cfg: { secondsPerDay: number; finalPhaseSeconds: number; hegemony: { requiredDays: number; countdownSeconds: number; qualifyingRelations: string[]; [key: string]: any; }; wonder: { cost: { cash: number; wood: number; cooked: number; [key: string]: any; }; buildDays: number; countdownDays: number; buildThreatMultiplier: number; [key: string]: any; }; relics: { polarNightDays: number; list: { 'sun-emblem': { name: string; income: { cash: number; [key: string]: any; }; [key: string]: any; }; 'frost-antler': { name: string; income: { raw: number; [key: string]: any; }; [key: string]: any; }; 'ember-stone': { name: string; income: { cooked: number; [key: string]: any; }; [key: string]: any; }; 'tide-pearl': { name: string; income: { fish: number; [key: string]: any; }; [key: string]: any; }; 'star-compass': { name: string; income: { cash: number; wood: number; [key: string]: any; }; [key: string]: any; }; [key: string]: any; }; [key: string]: any; }; reactions: { aidMinValue: number; attackMaxValue: number; [key: string]: any; }; assault: { baseWaves: number; wavesPerAttacker: number; baseStrength: number; strengthPerAttacker: number; waveIntervalSeconds: number; [key: string]: any; }; [key: string]: any; } = { ...ENDGAME_CONFIG };
    for (const key of ['hegemony', 'wonder', 'relics', 'reactions', 'assault'])
        cfg[key] = { ...ENDGAME_CONFIG[key], ...(override[key] ?? {}) };
    cfg.relics.list = { ...ENDGAME_CONFIG.relics.list, ...(override.relics?.list ?? {}) };
    if (Number.isFinite(override.secondsPerDay))
        cfg.secondsPerDay = override.secondsPerDay;
    if (Number.isFinite(override.finalPhaseSeconds))
        cfg.finalPhaseSeconds = override.finalPhaseSeconds;
    return cfg;
};
const bounded = (value: any, max: any, fallback: number = 0) => Number.isFinite(value) ? Math.max(0, Math.min(max, value)) : fallback;
export class Endgame {
    emitter: any;
    getFactions: Function;
    getRelation: Function;
    isFactionMerged: Function;
    getDay: Function;
    trySpendResources: Function;
    canCollectRelic: Function;
    config: { secondsPerDay: number; finalPhaseSeconds: number; hegemony: { requiredDays: number; countdownSeconds: number; qualifyingRelations: string[]; [key: string]: any; }; wonder: { cost: { cash: number; wood: number; cooked: number; [key: string]: any; }; buildDays: number; countdownDays: number; buildThreatMultiplier: number; [key: string]: any; }; relics: { polarNightDays: number; list: { 'sun-emblem': { name: string; income: { cash: number; [key: string]: any; }; [key: string]: any; }; 'frost-antler': { name: string; income: { raw: number; [key: string]: any; }; [key: string]: any; }; 'ember-stone': { name: string; income: { cooked: number; [key: string]: any; }; [key: string]: any; }; 'tide-pearl': { name: string; income: { fish: number; [key: string]: any; }; [key: string]: any; }; 'star-compass': { name: string; income: { cash: number; wood: number; [key: string]: any; }; [key: string]: any; }; [key: string]: any; }; [key: string]: any; }; reactions: { aidMinValue: number; attackMaxValue: number; [key: string]: any; }; assault: { baseWaves: number; wavesPerAttacker: number; baseStrength: number; strengthPerAttacker: number; waveIntervalSeconds: number; [key: string]: any; }; [key: string]: any; };
    victory: any | null;
    countdown: ({ path: any; remaining: any; total: any; [key: string]: any; } | { path: any; total: any; remaining: number; [key: string]: any; }) | null;
    hegemonyDays: number;
    lastDay: any;
    wonder: { started: boolean; built: boolean; buildProgress: number; [key: string]: any; };
    relics: Set<any>;
    reactions: { [key: string]: any; };
    finalAssaultTriggered: boolean;
    /**
     * @param {object} deps
     * @param {object} [deps.emitter]          事件发射器（emit(type, payload)），可选
     * @param {Function} [deps.getFactions]    () => [factionId] 全部势力名单
     * @param {Function} [deps.getRelation]    (id) => 'hostile'|'neutral'|'allied'|'dependent'|'merged'
     * @param {Function} [deps.isFactionMerged](id) => bool 该势力是否已合并（征服线判定）
     * @param {Function} [deps.getDay]         () => number 当前游戏日（可为小数）
     * @param {Function} [deps.trySpendResources] (cost) => bool 尝试扣除资源表（奇观开工）
     * @param {Function} [deps.canCollectRelic] (id) => bool 遗物是否已运回营地（圣物线前提）
     * @param {object} [deps.config]           配置覆盖，逐节浅合并到 ENDGAME_CONFIG
     */
    constructor({ emitter = null, getFactions = () => [], getRelation = () => 'neutral', isFactionMerged = () => false, getDay = () => 0, trySpendResources = () => false, canCollectRelic = () => true, config = {} }: { emitter?: any; getFactions?: Function; getRelation?: Function; isFactionMerged?: Function; getDay?: Function; trySpendResources?: Function; canCollectRelic?: Function; config?: any; [key: string]: any; } = {}) {
        this.emitter = emitter;
        this.getFactions = getFactions;
        this.getRelation = getRelation;
        this.isFactionMerged = isFactionMerged;
        this.getDay = getDay;
        this.trySpendResources = trySpendResources;
        this.canCollectRelic = canCollectRelic;
        this.config = mergeConfig(config);
        this.victory = null; // 获胜路径（'hegemony'|...|'conquest'），未分胜负为 null
        this.countdown = null; // 全图公开倒计时 { path, remaining, total }（秒）
        this.hegemonyDays = 0; // 霸权线已连续维持"友好多数"的游戏日数
        this.lastDay = this._day();
        this.wonder = { started: false, built: false, buildProgress: 0 }; // 永恒篝火
        this.relics = new Set(); // 已运回营地的遗物 id
        this.reactions = {}; // 最近一次全图表态表 { factionId: 'aid'|'price-hike'|'attack' }
        this.finalAssaultTriggered = false;
    }
    _day() { const d = this.getDay(); return Number.isFinite(d) ? d : 0; }
    _emit(type: any, payload: any) { this.emitter?.emit(type, payload); }
    _win(path: any) {
        if (this.victory || !ENDGAME_PATHS.includes(path))
            return;
        this.victory = path;
        this.countdown = null;
        this._emit('endgame-victory', path);
    }
    // 霸权线条件：过半数势力处于 allied/dependent/merged
    _hegemonyHolds() {
        const factions = this.getFactions();
        if (!Array.isArray(factions) || factions.length === 0)
            return false;
        const friendly = factions.filter((id: any) => this.config.hegemony.qualifyingRelations.includes(this.getRelation(id))).length;
        return friendly > factions.length / 2;
    }
    /**
     * 固定步长推进。dt 为现实秒；天数进度由注入的 getDay 差值驱动。
     * 本帧新启动的倒计时不在本帧消耗。
     */
    update(dt: number = 0) {
        if (this.victory || !Number.isFinite(dt) || dt < 0)
            return;
        // Revalidate the condition before the timer can award a victory.
        if (this.countdown?.path === 'hegemony' && !this._hegemonyHolds())
            this.cancelCountdown('hegemony');
        if (this.countdown) {
            this.countdown.remaining -= dt;
            if (!this.finalAssaultTriggered && this.countdown.remaining <= this.config.finalPhaseSeconds) {
                this.finalAssaultTriggered = true;
                this._emit('endgame-final-assault', this.finalNightAssault());
            }
            if (this.countdown.remaining <= 1e-9) {
                const path = this.countdown.path;
                this.countdown = null;
                this._win(path);
                return;
            }
        }
        const day = this._day(), dayDelta = Math.max(0, day - this.lastDay);
        this.lastDay = day;
        // 霸权线：多数友好按日累计；任一造反/降级立即清零并取消公开倒计时
        if (this._hegemonyHolds()) {
            this.hegemonyDays += dayDelta;
            if (this.hegemonyDays >= this.config.hegemony.requiredDays && this.countdown?.path !== 'hegemony')
                this.startCountdown('hegemony', this.config.hegemony.countdownSeconds);
        }
        else {
            this.hegemonyDays = 0;
            if (this.countdown?.path === 'hegemony')
                this.cancelCountdown('hegemony');
        }
        // 奇观线：建造期按日推进，完工即公开倒计时；倒计时被中断且篝火仍在则重新计时
        const w = this.wonder;
        if (w.started && !w.built) {
            w.buildProgress += dayDelta;
            if (w.buildProgress >= this.config.wonder.buildDays)
                w.built = true;
        }
        if (w.built && !this.countdown)
            this.startCountdown('wonder', this.config.wonder.countdownDays * this.config.secondsPerDay);
        // 圣物线：集齐即公开倒计时；被中断后只要遗物仍在手中便重新计时
        if (this.relics.size >= Object.keys(this.config.relics.list).length && !this.countdown)
            this.startCountdown('relics', this.config.relics.polarNightDays * this.config.secondsPerDay);
        // 征服线：全部势力合并，立即获胜（无需倒计时）
        const factions = this.getFactions();
        if (Array.isArray(factions) && factions.length > 0 && factions.every((id: any) => this.isFactionMerged(id)))
            this._win('conquest');
    }
    /** 启动全图公开倒计时；已有倒计时或已分胜负时拒绝。 */
    startCountdown(path: any, durationSeconds: any) {
        if (this.victory || this.countdown || !ENDGAME_PATHS.includes(path))
            return false;
        if (!Number.isFinite(durationSeconds) || durationSeconds <= 0)
            return false;
        this.countdown = { path, remaining: durationSeconds, total: durationSeconds };
        this.finalAssaultTriggered = false;
        this._emit('endgame-countdown-start', path);
        return true;
    }
    /** 中断倒计时；path 省略则取消当前任意倒计时。霸权线被中断时累计天数清零。 */
    cancelCountdown(path: any = null) {
        if (!this.countdown || (path && this.countdown.path !== path))
            return false;
        if (this.countdown.path === 'hegemony')
            this.hegemonyDays = 0;
        this.countdown = null;
        return true;
    }
    /** 返回获胜路径，未分胜负返回 null。 */
    isVictory() { return this.victory; }
    /** 奇观线：支付资源表开工永恒篝火。 */
    startWonder() {
        if (this.victory || this.wonder.started)
            return false;
        if (!this.trySpendResources({ ...this.config.wonder.cost }))
            return false;
        this.wonder.started = true;
        this.wonder.buildProgress = 0;
        return true;
    }
    /** 袭击频率修饰符：篝火建造期翻倍，其余时刻为 1。 */
    getThreatMultiplier() {
        return this.wonder.started && !this.wonder.built ? this.config.wonder.buildThreatMultiplier : 1;
    }
    /** 圣物线：遗物运回营地后登记入圣龛。 */
    collectRelic(id: any) {
        if (this.victory || !Object.prototype.hasOwnProperty.call(this.config.relics.list, id) || this.relics.has(id))
            return false;
        if (!this.canCollectRelic(id))
            return false;
        this.relics.add(id);
        return true;
    }
    /** 已收集遗物的被动日产出汇总 { 资源: 数量/日 }。 */
    getRelicIncome() {
        const income: { [key: string]: any; } = {};
        for (const id of this.relics)
            for (const [res, n] of Object.entries(this.config.relics.list[id].income ?? {}))
                income[res] = (income[res] ?? 0) + n;
        return income;
    }
    /**
     * 全图势力表态。factions 可为 { id: 关系值 } 映射或 [{ id, value }] 数组。
     * 返回并记录 { factionId: 'aid'|'price-hike'|'attack' }，同时发射 'endgame-reaction'。
     */
    onWorldReaction(factions: any) {
        const entries = Array.isArray(factions)
            ? factions.map((f: any) => [f?.id, f?.value])
            : Object.entries(factions ?? {});
        const { aidMinValue, attackMaxValue } = this.config.reactions;
        const table: { [key: string]: any; } = {};
        for (const [id, value] of entries) {
            if (typeof id !== 'string' || !id || !Number.isFinite(value))
                continue;
            table[id] = value >= aidMinValue ? 'aid' : value <= attackMaxValue ? 'attack' : 'price-hike';
        }
        this.reactions = table;
        this._emit('endgame-reaction', table);
        return table;
    }
    /**
     * 终局高潮：倒计时进入最后阶段时，输出全体势力联合夜袭参数（供夜守系统消费）。
     * 未到最后一夜或无进行中倒计时返回 null。
     */
    finalNightAssault() {
        if (this.victory || !this.countdown || this.countdown.remaining > this.config.finalPhaseSeconds)
            return null;
        const a = this.config.assault;
        const by = (reaction: any) => Object.entries(this.reactions).filter(([, r]: [string, any]) => r === reaction).map(([id]: [string, any]) => id);
        const attackers = by('attack');
        return {
            path: this.countdown.path,
            attackers,
            supporters: by('aid'),
            waveCount: a.baseWaves + attackers.length * a.wavesPerAttacker,
            strengthPerWave: a.baseStrength + attackers.length * a.strengthPerAttacker,
            waveIntervalSeconds: a.waveIntervalSeconds,
            threatMultiplier: this.getThreatMultiplier(),
            startsInSeconds: this.countdown.remaining,
        };
    }
    snapshot() {
        return {
            version: 1,
            victory: this.victory,
            countdown: this.countdown ? { ...this.countdown } : null,
            hegemonyDays: this.hegemonyDays,
            lastDay: this.lastDay,
            wonder: { ...this.wonder },
            relics: Array.from(this.relics),
            reactions: { ...this.reactions },
            finalAssaultTriggered: this.finalAssaultTriggered,
        };
    }
    /** 恢复序列化状态；脏数据安全降级为默认值。 */
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return;
        this.victory = ENDGAME_PATHS.includes(data.victory) ? data.victory : null;
        this.finalAssaultTriggered = data.finalAssaultTriggered === true;
        this.countdown = null;
        const cd = data.countdown;
        if (!this.victory && cd && ENDGAME_PATHS.includes(cd.path) && Number.isFinite(cd.total) && cd.total > 0)
            this.countdown = { path: cd.path, total: cd.total, remaining: bounded(cd.remaining, cd.total, cd.total) };
        this.hegemonyDays = bounded(data.hegemonyDays, this.config.hegemony.requiredDays);
        this.lastDay = Number.isFinite(data.lastDay) ? data.lastDay : this._day();
        const w = data.wonder ?? {};
        this.wonder = {
            started: w.started === true,
            built: w.started === true && w.built === true,
            buildProgress: bounded(w.buildProgress, this.config.wonder.buildDays),
        };
        this.relics = new Set((Array.isArray(data.relics) ? data.relics : [])
            .filter((id: any) => Object.prototype.hasOwnProperty.call(this.config.relics.list, id)));
        this.reactions = {};
        for (const [id, r] of Object.entries(data.reactions ?? {}))
            if (typeof r === 'string' && ['aid', 'price-hike', 'attack'].includes(r))
                this.reactions[id] = r;
    }
}
