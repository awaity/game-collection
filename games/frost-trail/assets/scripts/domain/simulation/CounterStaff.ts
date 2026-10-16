/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
const freeze = <T>(value: T): Readonly<T> & Record<string, any> => Object.freeze(value);
import { BALANCE, WORLD_BOUNDS } from './Balance';
export const STAFF_ROLES = freeze({
    seller: freeze({ name: '售货员', cost: 60, x: -1.25, z: -4.45 }),
    cashier: freeze({ name: '收银员', cost: 40, x: 1.7, z: -4.45 }),
});
export const STAFF_RULES = freeze({
    capacity: 6, speed: 2.9, saleInterval: .45, cashInterval: .8, cashBatch: 48,
    pickup: freeze({ x: -.8, z: -1.65 }),
    goods: freeze(['cooked', 'fish']),
});
export const STAFF_STATUS = freeze({
    unhired: '未雇佣', paused: '已停工', fetching: '前往成品区', delivering: '运货到柜台',
    selling: '正在售卖', 'waiting-stock': '等待成品', 'counter-full': '柜台现金已满',
    collecting: '正在收银', 'waiting-cash': '等待柜台收入', 'wallet-full': '钱包已满', blocked: '等待通路',
});
export function createCounterStaff(): {reserve:number;[role:string]:any} {
    return { reserve: 0, ...Object.fromEntries(Object.entries(STAFF_ROLES).map(([role, config]: [string, Readonly<{ name: "售货员"; cost: 60; x: -1.25; z: -4.45; [key: string]: any; }> | Readonly<{ name: "收银员"; cost: 40; x: 1.7; z: -4.45; [key: string]: any; }>]) => [role, {
                hired: false, enabled: true, x: config.x, z: config.z, timer: 0,
                cargo: null, status: 'unhired',
            }])) };
}
function bounded(value: any, max: any) {
    return typeof value === 'number' && Number.isFinite(value) ? Math.max(0, Math.min(max, value)) : 0;
}
export function restoreCounterStaff(saved: any) {
    const staff = createCounterStaff();
    staff.reserve = Math.floor(bounded(saved?.reserve, BALANCE.maxStock));
    for (const role of Object.keys(STAFF_ROLES)) {
        const input = saved?.[role], worker = staff[role];
        if (input?.hired !== true)
            continue;
        worker.hired = true;
        worker.enabled = input.enabled !== false;
        for (const axis of ['x', 'z']) {
            const min = WORLD_BOUNDS[axis === 'x' ? 'minX' : 'minZ'] + .33;
            const max = WORLD_BOUNDS[axis === 'x' ? 'maxX' : 'maxZ'] - .33;
            if (typeof input[axis] === 'number' && Number.isFinite(input[axis]))
                worker[axis] = Math.max(min, Math.min(max, input[axis]));
        }
        worker.timer = bounded(input.timer, role === 'seller' ? STAFF_RULES.saleInterval : STAFF_RULES.cashInterval);
        if (role === 'seller' && STAFF_RULES.goods.includes(input.cargo?.type)) {
            const count = Math.floor(bounded(input.cargo.count, STAFF_RULES.capacity));
            if (count)
                worker.cargo = { type: input.cargo.type, count };
        }
        worker.status = !worker.enabled ? 'paused' : role === 'cashier' ? 'waiting-cash' : worker.cargo ? 'delivering' : 'fetching';
    }
    return staff;
}
export function snapshotCounterStaff(staff: any) {
    return { reserve: staff.reserve, ...Object.fromEntries(Object.keys(STAFF_ROLES).map((role: string) => [role, {
                ...staff[role], cargo: staff[role].cargo ? { ...staff[role].cargo } : null,
            }])) };
}
/** Saved cargo owns the stock until it is sold; paths are disposable derived state. */
export class CounterStaff {
    state: any;
    collision: any;
    routes: Map<any, any>;
    constructor(state: any, collision: any) {
        this.state = state;
        this.collision = collision;
        this.routes = new Map();
        for (const role of Object.keys(STAFF_ROLES)) {
            const worker = state.camp.staff[role];
            if (!worker.hired)
                continue;
            const safe = collision.nearestFree(worker) ?? collision.nearestFree(STAFF_ROLES[role]);
            if (safe)
                Object.assign(worker, safe);
        }
    }
    status(worker: any, status: any) {
        if (worker.status === status)
            return;
        worker.status = status;
        this.state.changed('staff-status');
    }
    move(role: any, target: any, dt: any) {
        const worker = this.state.camp.staff[role];
        if (Math.hypot(worker.x - target.x, worker.z - target.z) < .1)
            return true;
        let route = this.routes.get(role);
        if (!route || route.target !== target) {
            route = { target, path: [], retry: 0 };
            this.routes.set(role, route);
        }
        route.retry = Math.max(0, route.retry - dt);
        if (!route.path.length && !route.retry) {
            route.path = this.collision.findPath(worker, target);
            route.retry = .5;
        }
        const point = route.path[0];
        if (!point) {
            this.status(worker, 'blocked');
            return false;
        }
        const dx = point.x - worker.x, dz = point.z - worker.z, distance = Math.hypot(dx, dz);
        if (distance < .06) {
            route.path.shift();
            return false;
        }
        const step = Math.min(distance, STAFF_RULES.speed * dt), before: { x: any; z: any; [key: string]: any; } = { x: worker.x, z: worker.z };
        this.collision.move(worker, dx / distance * step, dz / distance * step);
        if (Math.hypot(worker.x - before.x, worker.z - before.z) < .001) {
            route.path = [];
            this.status(worker, 'blocked');
        }
        else
            this.status(worker, role === 'cashier' ? 'collecting' : worker.cargo ? 'delivering' : target === STAFF_RULES.pickup ? 'fetching' : 'waiting-stock');
        return false;
    }
    tick(dt: any) {
        const s = this.state, staff = s.camp.staff, seller = staff.seller, cashier = staff.cashier;
        if (seller.hired && seller.enabled) {
            seller.timer = Math.max(0, seller.timer - dt);
            const type = STAFF_RULES.goods.find((good: string) => s.camp.stock[good] > staff.reserve);
            const target = seller.cargo || !type ? STAFF_ROLES.seller : STAFF_RULES.pickup;
            if (this.move('seller', target, dt)) {
                if (seller.cargo) {
                    if (seller.timer <= 1e-9) {
                        const sold = s.sellOne('staff');
                        seller.timer = STAFF_RULES.saleInterval;
                        this.status(seller, sold ? 'selling' : 'counter-full');
                    }
                }
                else {
                    if (type) {
                        const count = Math.min(STAFF_RULES.capacity, s.camp.stock[type] - staff.reserve);
                        s.camp.stock[type] -= count;
                        seller.cargo = { type, count };
                        this.status(seller, 'delivering');
                        s.changed('staff-load', { type, count });
                    }
                    else
                        this.status(seller, 'waiting-stock');
                }
            }
        }
        if (cashier.hired && cashier.enabled) {
            cashier.timer = Math.max(0, cashier.timer - dt);
            if (!this.move('cashier', STAFF_ROLES.cashier, dt))
                return;
            this.status(cashier, !s.counterCash ? 'waiting-cash' : s.cash >= 99999999 ? 'wallet-full' : 'collecting');
            if (cashier.timer > 1e-9 || !s.counterCash || s.cash >= 99999999)
                return;
            cashier.timer = STAFF_RULES.cashInterval;
            const amount = s.collectCash(STAFF_RULES.cashBatch);
            if (amount)
                s.changed('staff-collected', { amount });
        }
    }
    update(dt: any) {
        if (!Number.isFinite(dt) || dt <= 0)
            return;
        for (let left = dt; left > 1e-9; left -= 1 / 60)
            this.tick(Math.min(left, 1 / 60));
    }
}
