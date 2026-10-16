/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
import { BALANCE, LAMP_COST, PURCHASES, RESOURCE, STATIONS } from '../simulation/Balance';
const world = (id: any, title: any, target: any, detail: any) => ({ id, kind: 'world' as const, title, target, detail, actionLabel: '点击带路' });
const faction = (id: any, title: any, factionId: any, control: any, detail: any) => ({ id, kind: 'faction' as const, title, factionId, control, detail, actionLabel: '打开并定位操作' });
const panel = (id: any, title: any, panelId: any, detail: any) => ({ id, kind: 'panel' as const, title, panelId, detail, actionLabel: '查看操作面板' });
const resume = (id: any, title: any, detail: any) => ({ id, kind: 'resume' as const, title, detail, actionLabel: '继续经营' });
const isAllied = (state: any, id: any) => ['allied', 'dependent'].includes(state.factions.getStance(id));
const neighbors = (state: any) => state.factions.list().filter((f: any) => state.factions.getStance(f.id) !== 'merged')
    .sort((a: any, b: any) => state.factions.getRelationship(b.id) - state.factions.getRelationship(a.id));
function earnCash(state: any, amount: any, purpose: any) {
    if (state.cash >= amount)
        return null;
    const missing = `还差 $${amount - state.cash} 才能${purpose}`;
    if (state.counterCash > 0)
        return world('collect-cash', '领取柜台现金', STATIONS.market, `${missing}；在柜台前停留收款。`);
    if (state.inventory.some((item: any) => RESOURCE[item.type]?.value > 0))
        return world('sell-cargo', '出售背包资源', STATIONS.market, `${missing}；到柜台出售并收款。`);
    if (state.freeSlots === 0)
        return world('store-raw', '先腾出背包位置', STATIONS.rawStock, '到食材料仓存放生肉，再领取成品出售。');
    if (state.camp.stock.cooked > 0 || state.camp.stock.fish > 0)
        return world('collect-for-sale', '领取成品卖钱', STATIONS.output, `${missing}；先领取烤肉或鲜鱼，再去柜台。`);
    return world('gather-for-sale', '采集木材卖钱', STATIONS.forest, `${missing}；采木后再次点击任务卡去出售。`);
}
function allyGuidance(state: any, target: any = neighbors(state)[0]) {
    if (!target)
        return panel('all-merged', '查看终局进度', 'endgame-panel', '邻营已全部并入营地，继续经营结算胜利。');
    return earnCash(state, 50, '送礼') ?? faction(`gift-${target.id}`, `与${target.name}增进关系`, target.id, 'gift', `点击「送礼 $50」，直到状态显示「结盟」；当前关系 ${Math.round(state.factions.getRelationship(target.id))}。`);
}
function tradeGuidance(state: any) {
    const ally = neighbors(state).find((f: any) => isAllied(state, f.id));
    const built = state.camp.purchases.tradePost;
    const progressLabel = `${built ? '✓' : '○'} 贸易站 · ${ally ? '✓' : '○'} 结盟 · ○ 开通商路`;
    let next;
    if (!built) {
        next = earnCash(state, PURCHASES.tradePost.cost, '建贸易站') ?? world('build-trade-post', '建造贸易站 · $150', STATIONS.tradePost, '跟随标记到贸易站购买垫，停下自动建造。');
    }
    else if (!ally)
        next = allyGuidance(state);
    else
        next = faction(`open-route-${ally.id}`, `开通与${ally.name}的商路`, ally.id, 'openRoute', '贸易站已建好；到势力面板点击「开通商路」，无需额外花费。');
    return { ...next, progressLabel };
}
/** Derive the next useful action from authoritative state without changing game progress. */
export function getQuestGuidance(state: any, quest: any, progress: any) {
    if (quest.total > 0 && progress >= quest.total)
        return resume('quest-complete', '这一步已完成', '点击继续经营，领取奖励并显示下一个目标。');
    const active = neighbors(state), allies = active.filter((f: any) => isAllied(state, f.id));
    switch (quest.key) {
        case 'gifts':
        case 'allyAny': return allyGuidance(state);
        case 'routeAny': return tradeGuidance(state);
        case 'caravanRuns': {
            const routes = state.caravans.listRoutes().filter((r: any) => r.type === 'trade' && isAllied(state, r.factionId));
            if (!routes.length)
                return tradeGuidance(state);
            const route = routes.find((r: any) => r.status === 'idle');
            if (!route)
                return resume('wait-caravan', '等待商队返程', '商队正在路上；保持游戏运行，返程会自动计入任务。');
            if (!state.camp.purchases.woodcutters)
                return earnCash(state, PURCHASES.woodcutters.cost, '雇佣伐木工') ?? world('hire-lumber', '雇佣伐木工', STATIONS.woodcutters, '伐木工会往料仓补充商队货物。');
            if (state.camp.stock.wood < 20)
                return resume('wait-cargo', `等待料仓备齐木材 · ${state.camp.stock.wood}/20`, '伐木工会自动补货；继续经营后再派出商队。');
            return faction(`dispatch-${route.factionId}`, '派出一支商队', route.factionId, 'dispatch', '料仓木材已备齐；点击「派出商队」，返程后可再次派出。');
        }
        case 'barters': {
            if (!allies.length)
                return allyGuidance(state);
            for (const f of allies) {
                const ledger = state.aiCamps.get(f.id), demand = ledger?.getDemands()[0], offer = ledger?.getOffers()[0];
                if (demand && (state.camp.stock[demand.resource] ?? 0) >= demand.amount)
                    return faction(`sell-demand-${f.id}`, `向${f.name}供货`, f.id, 'sellDemand', '点击「卖给需求」，直接使用料仓资源成交。');
                if (offer && state.cash >= offer.amount * offer.unitPrice && BALANCE.maxStock - (state.camp.stock[offer.resource] ?? 0) >= offer.amount)
                    return faction(`buy-offer-${f.id}`, `向${f.name}购货`, f.id, 'buyOffer', '点击「买对方报价」，货物直接进入料仓。');
            }
            return faction('review-barter', '查看互市缺口', allies[0].id, 'barter', '查看需求和报价；备齐对应料仓资源或现金后成交。');
        }
        case 'lampLevel2': return earnCash(state, LAMP_COST, '架灯柱') ?? world('build-lamps', '前往灯柱购买垫', STATIONS.lampPad, `每根 $${LAMP_COST}；停留连续建造，连通 3 根达到 Lv.2。当前 ${state.lampNetwork.lamps.length} 根。`);
        case 'annexed': {
            const target = active.find((f: any) => f.id === 'nomads') ?? active[0];
            return target ? faction(`annex-${target.id}`, `查看${target.name}的吞并方式`, target.id, 'paths', '展开后可选围困、收购或武力；各项条件和进度会显示在按钮旁。')
                : panel('conquest', '查看征服进度', 'endgame-panel', '所有邻营已经并入，继续经营结算胜利。');
        }
        case 'tributes': {
            const candidates = active.filter((f: any) => !state.factions.getTribute(f.id)?.active)
                .sort((a: any, b: any) => state.annexation.getProgress(b.id).siege.pressure - state.annexation.getProgress(a.id).siege.pressure);
            const target = candidates[0];
            if (!target)
                return panel('tribute-status', '查看邻营状态', 'faction-list', '当前没有可新签约的邻营，查看已有契约与吞并进度。');
            const pressure = state.annexation.getProgress(target.id).siege.pressure;
            if (pressure >= 50)
                return faction(`tribute-${target.id}`, '签订朝贡契约', target.id, 'tribute', '围困压力已达 50；点击「签朝贡契约」。');
            if (state.sieges[target.id])
                return resume('wait-siege', `等待围困压力 · ${Math.floor(pressure)}/50`, '继续经营让围困推进；达到 50 后任务卡会定位签约按钮。');
            const hostile = state.factions.getStance(target.id) === 'hostile';
            return faction(`prepare-tribute-${target.id}`, hostile ? '开始围困' : '先选择宣战', target.id, hostile ? 'siege' : 'declareWar', hostile ? '围困每日消耗 $40；压力达到 50 后可签朝贡契约。' : '宣战会使关系转为敌对并可能招来报复；随后才能围困。');
        }
        case 'revengeRepelled': return panel('raid-defense', '准备夜袭防御', 'power-row', '查看夜防技能；建设石墙、哨塔后继续经营，等待并击退报复。');
        case 'victory': return panel('endgame', '查看四条胜利路线', 'endgame-panel', '选择霸权、奇观、圣物或征服；面板显示各路线条件与进度。');
    }
    const purchase = PURCHASES[quest.key];
    if (purchase)
        return earnCash(state, purchase.cost, purchase.name) ?? world(`buy-${quest.key}`, `${purchase.name} · $${purchase.cost}`, purchase.target, '跟随目标标记，停在购买垫上即可完成。');
    if (quest.key === 'pond')
        return earnCash(state, BALANCE.pondCost, '解锁冰湖') ?? world('unlock-pond', '解锁冰湖 · $200', STATIONS.buy, '走到高亮购买垫，停留解锁冰湖。');
    return world(`quest-${quest.key}`, quest.title, quest.target, quest.detail);
}
