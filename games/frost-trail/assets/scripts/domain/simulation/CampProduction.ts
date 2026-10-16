/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
import { BALANCE } from './Balance';
/** Pure, frame-rate independent stock -> conveyor -> feed buffer simulation.
 * Transit items are serialized and own their resources until they reach the buffer.
 * There is only one grill job, shared by hand-carried and automated recipes.
 */
export class CampProduction {
    state: any;
    constructor(state: any) { this.state = state; }
    update(dt: any, { manualPriority = false }: { manualPriority?: boolean; [key: string]: any; } = {}) {
        if (!Number.isFinite(dt) || dt <= 0)
            return;
        const s = this.state, c = s.camp;
        let changed = false;
        for (let i = c.transit.length - 1; i >= 0; i--) {
            const item = c.transit[i];
            item.progress += dt / BALANCE.beltTravel;
            if (item.progress >= 1) {
                c.feed[item.type]++;
                c.transit.splice(i, 1);
                changed = true;
                s.changed('belt-arrive', item.type);
            }
        }
        for (const type of ['wood', 'raw']) {
            const enabled = c.purchases[type === 'wood' ? 'woodBelt' : 'rawBelt'];
            c.beltTimers[type] = Math.max(0, c.beltTimers[type] - dt);
            const occupied = c.feed[type] + c.transit.filter((t: any) => t.type === type).length;
            if (!enabled || c.beltTimers[type] > 0 || c.stock[type] <= 0 || occupied >= BALANCE.maxFeed)
                continue;
            c.stock[type]--;
            const item: { id: number; type: string; progress: number; [key: string]: any; } = { id: c.nextTransitId++, type, progress: 0 };
            c.transit.push(item);
            c.beltTimers[type] = BALANCE.beltInterval;
            s.changed('belt-start', item);
            changed = true;
        }
        if (!manualPriority && !s.cooking)
            s.startCooking('camp');
        if (changed)
            s.changed('camp');
    }
}
