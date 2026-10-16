/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
import { STATIONS, AI_CAMPS } from '../simulation/Balance';
import { getQuestGuidance } from './QuestGuidance';
// 序章（原 11 步线性新手链，保留不动）+ 章节目标链（每章 3-4 目标，计数挂 GameState.stats/扩展键）
export const QUESTS = [
    { title: '收集木材', detail: '去松林停下，自动挥斧采集', target: STATIONS.forest, key: 'wood', total: 6, reward: 20 },
    { title: '获取新鲜食材', detail: '从南门出去，靠近白熊停下', target: STATIONS.hunt, key: 'raw', total: 5, reward: 20 },
    { title: '在营火旁烤制', detail: '带木材站到红垫：1 木材烤 3 份', target: STATIONS.fire, key: 'cooked', total: 5, reward: 20 },
    { title: '为旅人供货', detail: '柜台前出售，停留收取现金', target: STATIONS.market, key: 'sold', total: 5, reward: 20 },
    { title: '雇佣两名猎手', detail: '踩南门旁的 $10 雇佣区', target: STATIONS.hunters, key: 'hunters', total: 1, reward: 0 },
    { title: '雇佣两名伐木工', detail: '踩松林入口旁的 $10 雇佣区', target: STATIONS.woodcutters, key: 'woodcutters', total: 1, reward: 0 },
    { title: '接上食材传送带', detail: '支付 $25，让生肉自动送入营火', target: STATIONS.rawBelt, key: 'rawBelt', total: 1, reward: 0 },
    { title: '接上木材传送带', detail: '支付 $25，补齐自动生产链', target: STATIONS.woodBelt, key: 'woodBelt', total: 1, reward: 0 },
    { title: '收取自动烤肉', detail: '等工人送货，到营火后方收取成品', target: STATIONS.output, key: 'autoCollected', total: 3, reward: 40 },
    { title: '把冰湖变成新钓场', detail: '攒够 $200，踩营地东侧解锁区', target: STATIONS.buy, key: 'pond', total: 1, reward: 0 },
    { title: '今天也有鲜鱼', detail: '沿栈桥向前，停下自动钓鱼', target: STATIONS.fish, key: 'fish', total: 3, reward: 40 },
    // 一章 · 第一个邻居
    { chapter: 'c1', title: '递上第一份心意', detail: '暂停菜单 → 邻近势力 → 送礼 $50', target: STATIONS.market, key: 'gifts', total: 1, reward: 30 },
    { chapter: 'c1', title: '缔结首个同盟', detail: '持续送礼，把任一营地关系推进到「结盟」', target: STATIONS.market, key: 'allyAny', total: 1, reward: 50 },
    { chapter: 'c1', title: '开通第一条商路', detail: '东南角建贸易站（$150），结盟后开通商路', target: STATIONS.tradePost, key: 'routeAny', total: 1, reward: 60 },
    // 二章 · 商路繁荣
    { chapter: 'c2', title: '商队满载而归', detail: '派出商队并等它回来 ×3', target: STATIONS.market, key: 'caravanRuns', total: 3, reward: 80 },
    { chapter: 'c2', title: '互市两笔', detail: '势力面板「互市」直接成交 ×2', target: STATIONS.market, key: 'barters', total: 2, reward: 80 },
    { chapter: 'c2', title: '点亮灯网', detail: '西南角灯柱垫架灯柱，连通 3 根升到 Lv.2', target: STATIONS.lampPad, key: 'lampLevel2', total: 1, reward: 100 },
    // 三章 · 第一次吞并
    { chapter: 'c3', title: '第一次吞并', detail: '围困 / 收购 / 武力，任选一路吞并一座邻营', target: AI_CAMPS.nomads.gate, key: 'annexed', total: 1, reward: 200 },
    // 四章 · 绞杀与反扑
    { chapter: 'c4', title: '榨取朝贡', detail: '围困压力 ≥ 50 后，签一份朝贡契约', target: AI_CAMPS.fishers.gate, key: 'tributes', total: 1, reward: 100 },
    { chapter: 'c4', title: '守住报复夜袭', detail: '翻脸或突袭会招来报复波次，击退一次', target: STATIONS.fire, key: 'revengeRepelled', total: 1, reward: 120 },
    // 终章 · 雪原霸主
    { chapter: 'c5', title: '雪原霸主', detail: '霸权 / 奇观 / 圣物 / 征服，任一路线登顶（终局面板）', target: STATIONS.fire, key: 'victory', total: 1, reward: 0 },
];
/** 章节元数据（first = 该章第一个目标在 QUESTS 的下标） */
export const CHAPTERS = [
    { id: 'prologue', name: '序章 · 营地开工', first: 0 },
    { id: 'c1', name: '一章 · 第一个邻居', first: 11 },
    { id: 'c2', name: '二章 · 商路繁荣', first: 14 },
    { id: 'c3', name: '三章 · 第一次吞并', first: 17 },
    { id: 'c4', name: '四章 · 绞杀与反扑', first: 18 },
    { id: 'c5', name: '终章 · 雪原霸主', first: 20 },
];
export const chapterOf = (index: any) => { let c = CHAPTERS[0]; for (const ch of CHAPTERS)
    if (index >= ch.first)
        c = ch; return c; };
export const chapterSize = (id: any) => QUESTS.filter((q: any) => chapterOf(QUESTS.indexOf(q)).id === id).length;
// 章节扩展计数键：无法从 stats 直读的派生指标
const EXTENDED_KEYS: { allyAny: (s: any) => 1 | 0; routeAny: (s: any) => 1 | 0; lampLevel2: (s: any) => 1 | 0; victory: (s: any) => 1 | 0; [key: string]: any; } = {
    allyAny: (s: any) => s.factions.list().some((f: any) => ['allied', 'dependent', 'merged'].includes(s.factions.getStance(f.id))) ? 1 : 0,
    routeAny: (s: any) => s.caravans.routes.length > 0 ? 1 : 0,
    lampLevel2: (s: any) => s.lampNetwork.getNetworkLevel() >= 2 ? 1 : 0,
    victory: (s: any) => s.endgame.isVictory() ? 1 : 0,
};
export class QuestSystem {
    state: any;
    notify: any;
    audio: any;
    constructor(state: any, notify: any, audio: any) { Object.assign(this, { state, notify, audio }); }
    get current() { return QUESTS[this.state.quest] ?? { title: '营地生产线已开工', detail: '收取烤肉、钓鱼、供货，继续扩容背包', target: STATIONS.output, key: 'sold', total: 0, reward: 0 }; }
    get chapter() { return chapterOf(Math.min(this.state.quest, QUESTS.length - 1)); }
    get guidance() { return getQuestGuidance(this.state, this.current, this.progress); }
    get progress() {
        const key = this.current.key;
        if (Object.prototype.hasOwnProperty.call(EXTENDED_KEYS, key))
            return EXTENDED_KEYS[key](this.state);
        return key === 'pond' ? (this.state.unlockedPond ? 1 : 0) : Object.prototype.hasOwnProperty.call(this.state.camp.purchases, key) ? (this.state.camp.purchases[key] ? 1 : 0) : this.state.stats[key] ?? 0;
    }
    update() {
        if (this.state.endgame.isVictory() && this.state.quest < QUESTS.length) {
            this.state.quest = QUESTS.length;
            this.state.changed('quest');
            this.notify('雪原霸主已达成 · 自由经营开启');
            return;
        }
        const q = QUESTS[this.state.quest];
        if (!q || this.progress < q.total)
            return;
        const before = chapterOf(this.state.quest);
        this.state.quest++;
        if (q.reward)
            this.state.credit(q.reward);
        this.state.changed('quest');
        this.audio.play('quest');
        const after = chapterOf(Math.min(this.state.quest, QUESTS.length - 1));
        if (after.id !== before.id)
            this.notify(`${before.name}完成！${this.state.quest < QUESTS.length ? `新章节开启 · ${after.name}` : '全部章节完成'}`);
        else
            this.notify(q.reward ? `目标完成 · 奖励 $${q.reward}` : '目标完成 · 营地更进一步');
    }
}
