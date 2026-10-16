/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
/** 昼夜时钟：白天(运营期)与夜晚(值守期)交替，纯逻辑，无 Three.js 与 DOM。
 * 事件（通过构造注入的 emitter 发射，缺省静默）：
 *   'daynight-phase' {day, phase:'day'|'night'} 阶段切换时发射
 *   'daynight-day'   {day}                      夜晚结束、进入新一天时发射
 */
const DEFAULTS: { dayLength: number; nightLength: number; [key: string]: any; } = { dayLength: 210, nightLength: 90 }; // 可调：一昼夜 300s = 白天 210s + 夜晚 90s
const MAX_THREATS = 64; // 可调：夜袭预告上限，防存档膨胀
// 灯光关键帧（可调）：按当前阶段内进度 p∈[0,1] 线性插值，阶段边界处取值连续。
// 白天亮 → 黄昏过渡 → 夜晚暗+灯光权重升 → 黎明回亮。纯数据，渲染层自行消费。
const LIGHTING_KEYS: { day: { p: number; sun: number; ambient: number; sky: number[]; lamp: number; [key: string]: any; }[]; night: { p: number; sun: number; ambient: number; sky: number[]; lamp: number; [key: string]: any; }[]; [key: string]: any; } = {
    day: [
        { p: 0.00, sun: 0.45, ambient: 0.35, sky: [0.55, 0.42, 0.38], lamp: 0.55 }, // 黎明
        { p: 0.12, sun: 1.00, ambient: 0.65, sky: [0.55, 0.75, 0.95], lamp: 0.00 }, // 白昼
        { p: 0.86, sun: 1.00, ambient: 0.65, sky: [0.55, 0.75, 0.95], lamp: 0.00 }, // 白昼保持
        { p: 1.00, sun: 0.12, ambient: 0.25, sky: [0.35, 0.22, 0.30], lamp: 0.80 }, // 黄昏
    ],
    night: [
        { p: 0.00, sun: 0.12, ambient: 0.25, sky: [0.35, 0.22, 0.30], lamp: 0.80 }, // 入夜
        { p: 0.10, sun: 0.03, ambient: 0.15, sky: [0.05, 0.07, 0.14], lamp: 1.00 }, // 深夜
        { p: 0.90, sun: 0.03, ambient: 0.15, sky: [0.05, 0.07, 0.14], lamp: 1.00 }, // 深夜保持
        { p: 1.00, sun: 0.45, ambient: 0.35, sky: [0.55, 0.42, 0.38], lamp: 0.55 }, // 黎明前
    ],
};
const PHASES = ['day', 'night'];
const clamp01 = (n: any) => Math.max(0, Math.min(1, n));
const copyThreat = (t: any) => t && typeof t === 'object' ? { ...t } : t;
export class DayNight {
    dayLength: number;
    nightLength: number;
    emitter: any;
    onAdvance: (...args: any[]) => void;
    day: number;
    phase: string;
    timeInPhase: number;
    threats: any[];
    constructor({ dayLength = DEFAULTS.dayLength, nightLength = DEFAULTS.nightLength, emitter = null, onAdvance = () => { } }: { dayLength?: number; nightLength?: number; emitter?: any; onAdvance?: (...args: any[]) => void; [key: string]: any; } = {}) {
        this.dayLength = Number.isFinite(dayLength) && dayLength > 0 ? dayLength : DEFAULTS.dayLength;
        this.nightLength = Number.isFinite(nightLength) && nightLength > 0 ? nightLength : DEFAULTS.nightLength;
        this.emitter = emitter ?? null;
        this.onAdvance = onAdvance;
        this.day = 1;
        this.phase = 'day';
        this.timeInPhase = 0;
        this.threats = [];
    }
    phaseLength() { return this.phase === 'day' ? this.dayLength : this.nightLength; }
    emit(type: any, payload: any) { this.emitter?.emit(type, payload); }
    update(dtSeconds: any) {
        if (!Number.isFinite(dtSeconds) || dtSeconds <= 0)
            return;
        let rest = dtSeconds;
        while (rest > 1e-9) {
            const remain = this.phaseLength() - this.timeInPhase;
            if (rest < remain) {
                this.timeInPhase += rest;
                this.onAdvance(rest);
                return;
            }
            this.onAdvance(remain);
            rest -= remain;
            this.advancePhase();
        }
    }
    advancePhase() {
        this.timeInPhase = 0;
        if (this.phase === 'day') {
            this.phase = 'night';
            this.emit('daynight-phase', { day: this.day, phase: 'night' });
        }
        else {
            this.day++;
            this.phase = 'day';
            this.threats = this.threats.filter((t: any) => t.day >= this.day); // 已到期的预告不再保留
            this.emit('daynight-day', { day: this.day });
            this.emit('daynight-phase', { day: this.day, phase: 'day' });
        }
    }
    getPhase() { return this.phase; }
    getDay() { return this.day; }
    getTimeInPhase() { return this.timeInPhase; }
    getProgress() { return clamp01(this.timeInPhase / this.phaseLength()); }
    isNight() { return this.phase === 'night'; }
    /** 注册未来夜袭预告：day 为袭击抵达的夜晚所属天数（须不小于当前天）。 */
    scheduleThreat(day: any, threat: any) {
        if (!Number.isInteger(day) || day < this.day || threat === undefined || threat === null
            || this.threats.length >= MAX_THREATS)
            return false;
        this.threats.push({ day, threat: copyThreat(threat) });
        return true;
    }
    /** 预告列表，按抵达天排序；nightsAway 为"几夜后抵达"（0 = 今夜）。 */
    getUpcomingThreats() {
        return this.threats.filter((t: any) => t.day >= this.day)
            .sort((a: any, b: any) => a.day - b.day)
            .map((t: any) => ({ day: t.day, nightsAway: t.day - this.day, threat: copyThreat(t.threat) }));
    }
    getLighting() {
        const keys = LIGHTING_KEYS[this.phase], p = this.getProgress();
        let i = 0;
        while (i < keys.length - 2 && keys[i + 1].p < p)
            i++;
        const a = keys[i], b = keys[i + 1], f = clamp01((p - a.p) / (b.p - a.p));
        const lerp = (x: any, y: any) => x + (y - x) * f;
        return {
            sunIntensity: lerp(a.sun, b.sun),
            ambientIntensity: lerp(a.ambient, b.ambient),
            skyColor: [lerp(a.sky[0], b.sky[0]), lerp(a.sky[1], b.sky[1]), lerp(a.sky[2], b.sky[2])],
            lampGlow: lerp(a.lamp, b.lamp),
        };
    }
    snapshot() {
        return { version: 1, day: this.day, phase: this.phase, timeInPhase: this.timeInPhase,
            dayLength: this.dayLength, nightLength: this.nightLength,
            threats: this.threats.map((t: any) => ({ day: t.day, threat: copyThreat(t.threat) })) };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return;
        if (Number.isFinite(data.dayLength) && data.dayLength > 0)
            this.dayLength = data.dayLength;
        if (Number.isFinite(data.nightLength) && data.nightLength > 0)
            this.nightLength = data.nightLength;
        this.day = Number.isInteger(data.day) && data.day >= 1 ? data.day : 1;
        this.phase = PHASES.includes(data.phase) ? data.phase : 'day';
        this.timeInPhase = Number.isFinite(data.timeInPhase)
            ? Math.max(0, Math.min(this.phaseLength(), data.timeInPhase)) : 0;
        const threats = Array.isArray(data.threats) ? data.threats : [];
        this.threats = threats.slice(0, MAX_THREATS)
            .filter((t: any) => Number.isInteger(t?.day) && t.day >= 1 && t.threat !== undefined && t.threat !== null)
            .map((t: any) => ({ day: t.day, threat: copyThreat(t.threat) }));
    }
}
