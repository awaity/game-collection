import {Point3} from '../utils/Point3';
import { TriggerZone } from '../world/TriggerZone';
import { BALANCE, STATIONS, PURCHASES, RELIC_SPOTS, LAMP_COST, LAMP_SLOTS, BERRY_BUSHES, FISHTRAP_RULES, CORRAL_RULES, DEEP_FISHING_RULES } from '../simulation/Balance';
/** Zone contacts request authoritative state operations. Effects never settle transactions. */
export class InteractionSystem {
    state: any;
    player: any;
    inventory: any;
    map: any;
    effects: any;
    audio: any;
    notify: any;
    rawStoreOperation: any;
    pondDwell: any;
    cashTarget: any;
    purchaseDwell: any;
    saleTimer: any;
    cashTimer: any;
    cashDelay: any;
    fishTimer: any;
    transferTimer: any;
    prompt: any;
    fire: any;
    market: any;
    buy: any;
    fishing: any;
    woodInput: any;
    output: any;
    woodStock: any;
    rawStock: any;
    upgradeZones: any;
    lampDwell: any;
    lampPad: any;
    relicDwell: any;
    relicZones: any;
    corral: any;
    berryDwell: any;
    berryZones: any;
    deepTimer: any;
    deepZones: any;
    trapDwell: any;
    trapPad: any;
    unsubscribers: any;
    constructor({ state, player, inventory, map, effects, audio, notify }: any) {
        Object.assign(this, { state, player, inventory, map, effects, audio, notify });
        this.rawStoreOperation = null;
        this.pondDwell = 0;
        this.cashTarget = new Point3();
        this.purchaseDwell = {};
        this.saleTimer = 0;
        this.cashTimer = 0;
        this.cashDelay = 0;
        this.fishTimer = 0;
        this.transferTimer = 0;
        this.prompt = '';
        this.fire = new TriggerZone({ ...STATIONS.fire, width: 1.4, depth: 1.48, onStay: () => state.startCooking('backpack') });
        this.market = new TriggerZone({ ...STATIONS.market, width: 3.1, depth: 1.08, onEnter: () => { this.saleTimer = 0; }, onStay: (dt: any) => this.sell(dt) });
        this.buy = new TriggerZone({ ...STATIONS.buy, width: .83, depth: .85, onEnter: () => { this.pondDwell = 0; if (!state.unlockedPond && state.cash < BALANCE.pondCost)
                notify(`解锁冰湖还需要 $${BALANCE.pondCost - state.cash}`); }, onExit: () => { this.pondDwell = 0; }, onStay: (dt: any) => { this.pondDwell = player.moving ? 0 : this.pondDwell + dt; if (this.pondDwell >= .4)
                this.purchasePond(); } });
        this.fishing = new TriggerZone({ ...STATIONS.fish, width: .95, depth: .9, onEnter: () => { this.fishTimer = 0; }, onStay: (dt: any) => this.catchFish(dt) });
        this.woodInput = new TriggerZone({ ...STATIONS.woodInput, width: 1.1, depth: .86, onStay: () => this.transfer('wood', 'feed', 'deposit') });
        this.output = new TriggerZone({ ...STATIONS.output, width: .98, depth: .86, onStay: () => { const t = this.state.camp.stock.cooked > 0 ? 'cooked' : this.state.camp.stock.fish > 0 ? 'fish' : 'cooked'; this.transfer(t, 'stock', 'withdraw'); } });
        this.woodStock = new TriggerZone({ ...STATIONS.woodStock, width: 1.06, depth: .94, onStay: () => this.transfer('wood', 'stock', 'withdraw') });
        this.rawStock = new TriggerZone({ ...STATIONS.rawStock, width: 1.06, depth: .94,
            onEnter: () => { this.rawStoreOperation = state.count('raw') > 0 ? 'deposit' : 'withdraw'; },
            onExit: () => { this.rawStoreOperation = null; },
            onStay: () => { if (!player.moving)
                this.transfer('raw', 'stock', this.rawStoreOperation); } });
        this.upgradeZones = Object.entries(PURCHASES).map(([key, definition]: any) => ({ key, zone: new TriggerZone({
                ...definition.target, width: .78, depth: .78,
                onEnter: () => { this.purchaseDwell[key] = 0; if (!state.camp.purchases[key] && state.cash < definition.cost)
                    notify(`${definition.name}还需要 $${definition.cost - state.cash}`); },
                onStay: (dt: any) => {
                    this.purchaseDwell[key] = player.moving ? 0 : (this.purchaseDwell[key] || 0) + dt;
                    if (this.purchaseDwell[key] < .4 || !state.purchase(key))
                        return;
                    audio.play('unlock');
                    notify(`${definition.name}已启用`);
                    effects.burst({ x: definition.target.x, y: .45, z: definition.target.z }, 0xd4ff93, 24, 3.8);
                },
            }) }));
        // 灯柱垫：可重复驻留架设（$40/根，按灯位表顺序放置）
        this.lampDwell = 0;
        this.lampPad = new TriggerZone({ ...STATIONS.lampPad, width: .9, depth: .9,
            onEnter: () => { this.lampDwell = 0; if (state.cash < LAMP_COST)
                notify(`灯柱还需要 $${LAMP_COST - state.cash}`); },
            onExit: () => { this.lampDwell = 0; },
            onStay: (dt: any) => {
                this.lampDwell = player.moving ? 0 : this.lampDwell + dt;
                if (this.lampDwell < .4)
                    return;
                this.lampDwell = 0;
                if (state.buyLamp()) {
                    audio.play('unlock');
                    notify(`灯柱已竖起（${state.lampNetwork.lamps.length} 根）· 灯网等级 ${state.lampNetwork.getNetworkLevel()}`);
                    effects.burst({ x: STATIONS.lampPad.x, y: .6, z: STATIONS.lampPad.z }, 0xffd98a, 22, 3.2);
                }
                else if (state.cash < LAMP_COST)
                    notify(`灯柱还需要 $${LAMP_COST - state.cash}`);
            },
        });
        // 先民遗物：驻留 0.6s 收集（collectRelic 内部幂等，已收集不再触发）
        this.relicDwell = {};
        this.relicZones = Object.entries(RELIC_SPOTS).map(([id, spot]: any) => ({ id, zone: new TriggerZone({
                x: spot.x + 1.0, z: spot.z + 1.0, width: 2.0, depth: 2.0,
                onStay: (dt: any) => {
                    if (player.moving || state.endgame.relics.has(id))
                        return;
                    this.relicDwell[id] = (this.relicDwell[id] ?? 0) + dt;
                    if (this.relicDwell[id] < .6)
                        return;
                    if (state.collectRelic(id)) {
                        audio.play('unlock');
                        notify(`先民遗物「${spot.name}」已运回圣龛 · 日产出已生效`);
                        effects.burst({ x: spot.x, y: 1.1, z: spot.z }, 0xffe9a3, 30, 3.4);
                    }
                },
            }) }));
        // 驯鹿围栏交互区（宰杀/投喂走 HUD 浮动按钮；栏体南侧留路）
        this.corral = new TriggerZone({ ...STATIONS.corralInteraction, width: 1.6, depth: 1.2 });
        // 雪莓丛：驻留 0.5s 采集 2 颗，枯萎 2 天再生
        this.berryDwell = {};
        this.berryZones = BERRY_BUSHES.map((b: any) => ({ id: b.id, zone: new TriggerZone({ x: b.x, z: b.z, width: 1.5, depth: 1.5,
                onStay: (dt: any) => {
                    if (player.moving || !state.berryBushes[b.id].ready)
                        return;
                    this.berryDwell[b.id] = (this.berryDwell[b.id] ?? 0) + dt;
                    if (this.berryDwell[b.id] < .5)
                        return;
                    if (state.harvestBerry(b.id)) {
                        audio.play('pickup');
                        effects.burst({ x: b.x, y: .5, z: b.z }, 0x9a6fd0, 12, 1.8);
                    }
                    else if (state.freeSlots < 2)
                        notify('背包已满 · 至少留 2 个空位采莓');
                },
            }) }));
        // 深水冰洞（深渔区）：灯网 Lv2 解锁，储量耗尽永久枯竭
        this.deepTimer = 0;
        this.deepZones = DEEP_FISHING_RULES.holes.map((h: any, i: any) => ({ id: `hole-${i}`, zone: new TriggerZone({ x: h.x, z: h.z, width: 1.2, depth: 1.2,
                onEnter: () => { this.deepTimer = 0; },
                onExit: () => { this.deepTimer = 0; },
            }) }));
        // 鱼陷阱垫：需解锁冰湖，$60/个上限 2 个，可重复驻留放置
        this.trapDwell = 0;
        this.trapPad = new TriggerZone({ ...STATIONS.trapPad, width: .95, depth: .95,
            onEnter: () => { this.trapDwell = 0; if (state.unlockedPond && state.camp.fishtraps < FISHTRAP_RULES.max && state.cash < FISHTRAP_RULES.cost)
                notify(`鱼陷阱还需要 $${FISHTRAP_RULES.cost - state.cash}`); },
            onExit: () => { this.trapDwell = 0; },
            onStay: (dt: any) => {
                if (!state.unlockedPond)
                    return;
                this.trapDwell = player.moving ? 0 : this.trapDwell + dt;
                if (this.trapDwell < .4)
                    return;
                this.trapDwell = 0;
                if (state.buyFishtrap()) {
                    audio.play('unlock');
                    notify(`鱼陷阱已下水（${state.camp.fishtraps} / ${FISHTRAP_RULES.max}）· 每天黎明产鲜鱼`);
                    effects.burst({ x: STATIONS.trapPad.x, y: .3, z: STATIONS.trapPad.z }, 0x8bdad8, 18, 2.4);
                }
            },
        });
        this.unsubscribers = [
            state.events.on('cook-start', ({ input, source }: any) => {
                audio.play('cook');
                const from = source === 'backpack' ? inventory.getTopWorldPosition() : new Point3(1.73, .50, .65);
                effects.fly(input, from, new Point3(-.05, 1.16, -.45), { arc: .95, duration: .35 });
            }),
            state.events.on('cook-end', ({ output, destination }: any) => {
                audio.play('ready');
                effects.burst({ x: 0, y: 1.3, z: -.4 }, 0xffbf42, 14, 1.9);
                const to = destination === 'backpack' ? () => inventory.getTopWorldPosition() : new Point3(STATIONS.output.x, .46, STATIONS.output.z);
                effects.fly(output, new Point3(0, 1.15, -.4), to, { arc: 1.05, duration: .36, scale: 1.15 });
            }),
        ];
    }
    /** 深渔区钓鱼：灯网 Lv2 照亮冰路才可用；节拍 ×0.6，每洞 200 条耗尽枯竭。 */
    deepFish(dt: any) {
        const i = this.deepZones.findIndex((z: any) => z.zone.inside);
        if (i < 0)
            return;
        const s = this.state, hole = s.deepFishing[`hole-${i}`];
        if (s.lampNetwork.getNetworkLevel() < DEEP_FISHING_RULES.lampLevel) {
            this.prompt = '深水冰洞 · 需要灯网 Lv.2 照亮冰路';
            return;
        }
        if (hole.stock <= 0) {
            this.prompt = '深渔区已枯竭';
            return;
        }
        if (s.freeSlots < 1) {
            this.prompt = '背包已满 · 回柜台出售';
            return;
        }
        if (this.player.moving) {
            this.deepTimer = 0;
            return;
        }
        this.player.fishing = true;
        this.player.aim(DEEP_FISHING_RULES.holes[i].x, DEEP_FISHING_RULES.holes[i].z);
        this.deepTimer += dt;
        const interval = BALANCE.fishInterval * DEEP_FISHING_RULES.intervalFactor / (s.getGatherMultiplier('fish') * s.getGatherBuffFactor());
        if (this.deepTimer < interval)
            return;
        this.deepTimer = 0;
        if (s.catchDeepFish(`hole-${i}`)) {
            this.effects.fly('fish', new Point3(DEEP_FISHING_RULES.holes[i].x, .25, DEEP_FISHING_RULES.holes[i].z), () => this.inventory.getTopWorldPosition(), { duration: .5, arc: 2.0 });
            this.effects.burst({ x: DEEP_FISHING_RULES.holes[i].x, y: .16, z: DEEP_FISHING_RULES.holes[i].z }, 0xe0f8ff, 12, 1.9);
            this.audio.play('pickup');
            this.player.swing();
        }
        this.prompt = `深水冰洞 · 剩余 ${hole.stock} 条`;
    }
    transfer(type: any, store: any, operation: any) {
        if (this.player.moving || this.transferTimer > 0)
            return;
        const before = this.inventory.getTopWorldPosition();
        if (!this.state[operation](type, store))
            return;
        this.transferTimer = BALANCE.transferInterval;
        const point = store === 'feed' ? STATIONS.woodInput : type === 'wood' ? STATIONS.woodStock : type === 'raw' ? STATIONS.rawStock : STATIONS.output;
        const at = new Point3(point.x, .48, point.z);
        this.effects.fly(type, operation === 'deposit' ? before : at, operation === 'deposit' ? at : () => this.inventory.getTopWorldPosition(), { duration: .28, arc: .65 });
        this.audio.play('pickup');
    }
    sell(dt: any) {
        this.saleTimer -= dt;
        this.cashTimer -= dt;
        if (this.saleTimer <= 0) {
            const before = this.inventory.getTopWorldPosition(), sold = this.state.sellOne();
            this.saleTimer = BALANCE.saleInterval;
            if (sold) {
                this.cashDelay = .40;
                const lane = (this.state.stats.sold % 9 - 4) * .55;
                this.effects.fly(sold.item.type, before, new Point3(lane, 1.55, -6.25), { arc: 1.7, duration: .43 });
                for (let i = 0; i < 3; i++)
                    this.effects.fly('cash', new Point3(lane + (i - 1) * .2, 1.42, -6.65 - i * .30), new Point3(lane * .65, .99, -5.65), { duration: .55 + i * .04, arc: 1.50 + i * .24, scale: .88 });
                this.audio.play('sell');
            }
        }
        if (this.cashDelay <= 0 && this.cashTimer <= 0 && this.state.counterCash > 0) {
            const amount = this.state.collectCash(24);
            this.cashTimer = BALANCE.cashInterval;
            if (amount) {
                this.effects.fly('cash', new Point3(-.4, 1.14, -5.6), () => this.player.getCashPickupPosition(this.cashTarget), { duration: .35, arc: 1.25 });
                this.audio.play('pickup');
            }
        }
    }
    purchasePond() {
        if (!this.state.buyPond())
            return;
        this.effects.burst({ x: 6.7, y: .8, z: 1.4 }, 0xf8faff, 50, 5);
        this.audio.play('unlock');
        this.notify('冰湖已解锁！走上栈桥，鱼群正在等你');
    }
    catchFish(dt: any) {
        if (!this.state.unlockedPond || this.map.opening)
            return;
        this.player.fishing = true;
        this.player.aim(10, 1.7);
        this.fishTimer += dt;
        if (this.fishTimer < BALANCE.fishInterval / this.state.getGatherMultiplier('fish') / this.state.getGatherBuffFactor() || this.state.freeSlots < 1)
            return;
        this.fishTimer = 0;
        if (this.inventory.add('fish', { collected: true })) {
            this.effects.fly('fish', new Point3(9.9, .25, 1.7), () => this.inventory.getTopWorldPosition(), { duration: .53, arc: 2.3 });
            this.effects.burst({ x: 9.9, y: .16, z: 1.7 }, 0xe0f8ff, 15, 2.1);
            this.audio.play('pickup');
            this.player.swing();
        }
    }
    update(dt: any) {
        this.state.tickCooking(dt);
        this.prompt = '';
        this.player.fishing = false;
        this.transferTimer = Math.max(0, this.transferTimer - dt);
        this.cashDelay = Math.max(0, this.cashDelay - dt);
        for (const zone of [this.fire, this.market, this.buy, this.fishing, this.woodInput, this.output, this.woodStock, this.rawStock, this.lampPad, this.corral, this.trapPad])
            zone.update(this.player.position, dt);
        for (const { zone } of this.upgradeZones)
            zone.update(this.player.position, dt);
        for (const { zone } of this.relicZones)
            zone.update(this.player.position, dt);
        for (const { zone } of this.berryZones)
            zone.update(this.player.position, dt);
        for (const { zone } of this.deepZones)
            zone.update(this.player.position, dt);
        this.deepFish(dt);
        if (this.fire.inside && !this.player.moving)
            this.player.aim(-.05, -.40);
        if (this.market.inside && !this.player.moving)
            this.player.aim(0, -5.60);
        if (this.fire.inside)
            this.prompt = this.state.ages.isVulnerable() ? '升代施工中 · 加工暂停，原料与进度保留' : this.state.cooking ? `正在烤制 · ${this.state.getCookTime().toFixed(2)} 秒 / 份` : !this.state.canFuel(true) ? (this.state.freeSlots === 0 && this.state.count('raw') ? '背包已满且缺燃料 · 先到食材料仓存放生肉' : '营火缺木材 · 去左侧补充燃料') : '带生肉或鲜鱼来烤制';
        if (this.woodInput.inside)
            this.prompt = this.state.count('wood') ? '正在补充木材' : '1 份木材可以烤 3 份食物';
        if (this.rawStock.inside)
            this.prompt = this.rawStoreOperation === 'deposit' ? (this.state.camp.stock.raw >= BALANCE.maxStock ? '食材料仓已满 · 可在菜单丢弃一份生肉腾位' : this.state.count('raw') ? '正在存放生肉 · 腾出背包位置' : '生肉已存好 · 离开后可重新取用') : (this.state.freeSlots === 0 ? '背包已满' : '正在取用仓储生肉');
        if (this.output.inside && (this.state.camp.stock.cooked || this.state.camp.stock.fish))
            this.prompt = '正在收取成品与渔获';
        if (this.market.inside)
            this.prompt = this.state.inventory.some((i: any) => ['wood', 'cooked', 'fish', 'cookedFish'].includes(i.type)) ? '供货中 · 现金留在柜台' : this.state.counterCash ? (this.state.cash >= 99999999 ? '钱包已满 · 消费后再收取柜台现金' : '正在收取现金') : '柜台已清空 · 带食物回来吧';
        if (this.fishing.inside && this.state.unlockedPond)
            this.prompt = this.state.freeSlots ? '正在钓鱼…' : '背包已满 · 回柜台出售';
        if (this.lampPad.inside)
            this.prompt = this.state.lampNetwork.lamps.length < LAMP_SLOTS.length ? `灯柱 $${LAMP_COST} · 驻留架设（已立 ${this.state.lampNetwork.lamps.length} / ${LAMP_SLOTS.length} 根 · 灯网 Lv.${this.state.lampNetwork.getNetworkLevel()}）` : '灯位已全部立满';
        if (this.corral.inside)
            this.prompt = this.state.camp.purchases.corral ? (this.state.corralDeer.length ? `围栏 ${this.state.corralDeer.length} 头驯鹿 · 下方按钮宰杀/投喂` : '围栏已建好 · 黎明会有野鹿被吸引过来') : '先踩旁边垫子建围栏（时代Ⅱ）';
        for (const { id, zone } of this.berryZones)
            if (zone.inside) {
                const b = this.state.berryBushes[id];
                this.prompt = b.ready ? '雪莓丛 · 驻留采集（2 颗）' : `雪莓丛枯萎中 · 第 ${b.regrowDay} 天再生`;
            }
        if (this.trapPad.inside && this.state.unlockedPond)
            this.prompt = this.state.camp.fishtraps >= FISHTRAP_RULES.max ? '鱼陷阱已全部下水' : !this.state.canAffordLoad(1) ? `负荷已满 ${this.state.getLoad()} / ${this.state.getLoadCap()} · 升代后可放鱼陷阱` : `鱼陷阱 $${FISHTRAP_RULES.cost} · 驻留放置（${this.state.camp.fishtraps} / ${FISHTRAP_RULES.max}）`;
    }
    dispose() { this.unsubscribers.forEach((fn: any) => fn()); }
}
