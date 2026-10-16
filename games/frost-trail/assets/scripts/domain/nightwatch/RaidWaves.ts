/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
/** 夜袭波次：夜晚来袭强度合成与自动结算（低操作：防御 ≥ 来袭则击退，否则按比例损失）。
 * 纯逻辑，无 Three.js/DOM 依赖。事件（emitter 缺省静默）：'raid-report' {战报}
 */
/** 可调数值表 */
export const RAID_RULES = freeze({
    wolfBase: 4, // 狼群基础强度
    wolfPerDay: 0.8, // 狼群每天递增
    hostileCamp: 5, // 每个敌对营地派出的斥候强度
    defenseBase: 6, // 营地基础防御（营火光圈）
    defensePerWorker: 1.5, // 每名工人驻扎加成
    defenseWatchPost: 12, // 警戒哨塔
    defenseStoneWall: 8, // 石墙
    defensePerLampLevel: 2, // 灯网每级
    lossStockPct: 0.10, // 破防基础库存损失比例
    lossCashPct: 0.06, // 破防基础柜台现金损失比例
    lossPctCap: 0.25, // 单次夜袭损失总上限
    winCash: 12, // 击退奖励现金基数（按来袭强度缩放）
    winWood: 3, // 击退奖励木材基数
});
const round1 = (n: any) => Math.round(n * 10) / 10;
export class RaidWaves {
    emitter: any;
    lastReport: ({ day: number; waves: any[]; strength: number; defense: number; repelled: boolean; stockLossPct: number; cashLossPct: number; rewardCash: number; rewardWood: number; [key: string]: any; } | { day: any; waves: any; strength: any; defense: any; repelled: boolean; stockLossPct: number; cashLossPct: number; rewardCash: number; rewardWood: number; [key: string]: any; }) | null;
    nights: number;
    constructor({ emitter = null }: { emitter?: any; [key: string]: any; } = {}) {
        this.emitter = emitter;
        this.lastReport = null;
        this.nights = 0;
    }
    /** 合成当夜来袭波次列表：狼群（野生） + 敌对斥候 + 预告报复 + 终局联合夜袭。
     * threatMultiplier：奇观建造期 ×2；raidIntensity：升代脆弱窗口 ×1.5。 */
    planNight({ day = 1, hostileCamps = 0, threatMultiplier = 1, raidIntensity = 1, threats = [], finalAssault = null }: { day?: number; hostileCamps?: number; threatMultiplier?: number; raidIntensity?: number; threats?: any[]; finalAssault?: any; [key: string]: any; } = {}) {
        const mult = Math.max(0, threatMultiplier) * Math.max(0, raidIntensity);
        const waves = [];
        const wolves = (RAID_RULES.wolfBase + day * RAID_RULES.wolfPerDay) * mult;
        if (wolves > 0)
            waves.push({ source: '狼群', strength: round1(wolves) });
        if (hostileCamps > 0)
            waves.push({ source: '敌对斥候', strength: round1(hostileCamps * RAID_RULES.hostileCamp * mult) });
        for (const t of threats) {
            const s = Number(t?.threat?.strength);
            if (Number.isFinite(s) && s > 0)
                waves.push({ source: t.threat.source ?? '报复', strength: round1(s) });
        }
        if (finalAssault && Number.isInteger(finalAssault.waveCount) && finalAssault.waveCount > 0)
            for (let i = 0; i < finalAssault.waveCount; i++)
                waves.push({ source: '联合夜袭', strength: round1(finalAssault.strengthPerWave) });
        return waves;
    }
    /** 营地防御力：基础 + 工人驻扎 + 哨塔 + 石墙 + 灯网等级。 */
    computeDefense({ workers = 0, watchPost = false, stoneWall = false, lampLevel = 0 }: { workers?: number; watchPost?: boolean; stoneWall?: boolean; lampLevel?: number; [key: string]: any; } = {}) {
        return RAID_RULES.defenseBase + workers * RAID_RULES.defensePerWorker
            + (watchPost ? RAID_RULES.defenseWatchPost : 0) + (stoneWall ? RAID_RULES.defenseStoneWall : 0)
            + lampLevel * RAID_RULES.defensePerLampLevel;
    }
    /** 结算当夜：防御 ≥ 来袭总量则击退（有奖），否则按差额比例损失（封顶）。纯计算，损失由集成层应用。 */
    resolveNight(waves: any, defense: any, { day = 1 }: { day?: number; [key: string]: any; } = {}) {
        const list = (Array.isArray(waves) ? waves : []).filter((w: any) => Number.isFinite(w?.strength) && w.strength > 0);
        const total = list.reduce((n: any, w: any) => n + w.strength, 0);
        const held = defense >= total;
        const breach = held ? 0 : Math.min(RAID_RULES.lossPctCap, (total - defense) / Math.max(1, total));
        const report: { day: number; waves: any[]; strength: number; defense: number; repelled: boolean; stockLossPct: number; cashLossPct: number; rewardCash: number; rewardWood: number; [key: string]: any; } = {
            day, waves: list.map((w: any) => ({ ...w })), strength: round1(total), defense: round1(defense),
            repelled: held,
            stockLossPct: held ? 0 : Math.min(RAID_RULES.lossPctCap, RAID_RULES.lossStockPct + breach),
            cashLossPct: held ? 0 : Math.min(RAID_RULES.lossPctCap, RAID_RULES.lossCashPct + breach * 0.6),
            rewardCash: held ? Math.round(RAID_RULES.winCash * (1 + total / 10)) : 0,
            rewardWood: held ? Math.round(RAID_RULES.winWood * (1 + total / 10)) : 0,
        };
        this.lastReport = report;
        this.nights++;
        this.emitter?.emit('raid-report', report);
        return report;
    }
    snapshot() {
        return { version: 1, nights: this.nights,
            lastReport: this.lastReport ? { ...this.lastReport, waves: this.lastReport.waves.map((w: any) => ({ ...w })) } : null };
    }
    restore(data: any) {
        if (!data || typeof data !== 'object' || data.version !== 1)
            return false;
        this.nights = Number.isInteger(data.nights) && data.nights >= 0 ? Math.min(data.nights, 1e6) : 0;
        const r = data.lastReport;
        this.lastReport = r && typeof r === 'object' && Number.isFinite(r.strength) && Number.isFinite(r.defense)
            ? { day: Number.isInteger(r.day) && r.day >= 1 ? r.day : 1,
                waves: (Array.isArray(r.waves) ? r.waves : []).filter((w: any) => Number.isFinite(w?.strength))
                    .map((w: any) => ({ source: typeof w.source === 'string' ? w.source : '袭击', strength: w.strength })),
                strength: r.strength, defense: r.defense, repelled: r.repelled === true,
                stockLossPct: Math.max(0, Math.min(1, Number(r.stockLossPct) || 0)),
                cashLossPct: Math.max(0, Math.min(1, Number(r.cashLossPct) || 0)),
                rewardCash: Math.max(0, Math.floor(Number(r.rewardCash) || 0)),
                rewardWood: Math.max(0, Math.floor(Number(r.rewardWood) || 0)) }
            : null;
        return true;
    }
}
