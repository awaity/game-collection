/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
import { WORLD_BOUNDS } from '../simulation/Balance';
/** Flat-world AABB collision, swept substeps and verified-grid A* routing. */
export class CollisionWorld {
    obstacles: Map<any, any>;
    bounds: { minX: number; maxX: number; minZ: number; maxZ: number; [key: string]: any; };
    cell: number;
    radius: number;
    constructor() {
        this.obstacles = new Map();
        this.bounds = { ...WORLD_BOUNDS };
        this.cell = .55;
        this.radius = .33;
    }
    add(id: any, x: any, z: any, width: any, depth: any) {
        this.obstacles.set(id, { minX: x - width / 2, maxX: x + width / 2, minZ: z - depth / 2, maxZ: z + depth / 2 });
    }
    remove(id: any) { this.obstacles.delete(id); }
    blocked(x: any, z: any, r: number = this.radius) {
        if (!Number.isFinite(x) || !Number.isFinite(z))
            return true;
        const b = this.bounds;
        if (x < b.minX + r || x > b.maxX - r || z < b.minZ + r || z > b.maxZ - r)
            return true;
        for (const o of this.obstacles.values())
            if (x > o.minX - r && x < o.maxX + r && z > o.minZ - r && z < o.maxZ + r)
                return true;
        return false;
    }
    move(position: any, dx: any, dz: any) {
        if (!position || !Number.isFinite(dx) || !Number.isFinite(dz))
            return;
        const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / .16));
        for (let i = 0; i < steps; i++) {
            if (!this.blocked(position.x + dx / steps, position.z))
                position.x += dx / steps;
            if (!this.blocked(position.x, position.z + dz / steps))
                position.z += dz / steps;
        }
    }
    lineClear(a: any, b: any) {
        if (!a || !b || this.blocked(a.x, a.z) || this.blocked(b.x, b.z))
            return false;
        const n = Math.ceil(Math.hypot(b.x - a.x, b.z - a.z) / .12);
        for (let i = 1; i < n; i++)
            if (this.blocked(a.x + (b.x - a.x) * i / n, a.z + (b.z - a.z) * i / n))
                return false;
        return true;
    }
    nearestFree(p: any) {
        if (!p || !Number.isFinite(p.x) || !Number.isFinite(p.z))
            return null;
        if (!this.blocked(p.x, p.z))
            return { x: p.x, z: p.z };
        for (let r = .3; r < 4; r += .25)
            for (let a = 0; a < Math.PI * 2; a += Math.PI / 10) {
                const q: { x: any; z: any; [key: string]: any; } = { x: p.x + Math.cos(a) * r, z: p.z + Math.sin(a) * r };
                if (!this.blocked(q.x, q.z))
                    return q;
            }
        return null;
    }
    gridAnchor(point: any) {
        const s = this.cell, ix = Math.round(point.x / s), iz = Math.round(point.z / s), candidates = [];
        // Both endpoints need visible, walkable grid anchors. Rounding a free position
        // directly into an obstacle otherwise creates an unwalkable first path segment.
        for (let dx = -2; dx <= 2; dx++)
            for (let dz = -2; dz <= 2; dz++) {
                const x = ix + dx, z = iz + dz, p: { x: number; z: number; [key: string]: any; } = { x: x * s, z: z * s };
                if (this.lineClear(point, p))
                    candidates.push({ x, z, distance: Math.hypot(p.x - point.x, p.z - point.z) });
            }
        candidates.sort((a: { x: number; z: number; distance: number; [key: string]: any; }, b: { x: number; z: number; distance: number; [key: string]: any; }) => a.distance - b.distance);
        return candidates[0] || null;
    }
    findPath(start: any, goal: any) {
        if (!start || this.blocked(start.x, start.z))
            return [];
        const end = this.nearestFree(goal);
        if (!end)
            return [];
        if (this.lineClear(start, end))
            return [end];
        const from = this.gridAnchor(start), to = this.gridAnchor(end);
        if (!from || !to)
            return [];
        const s = this.cell, key = (x: any, z: any) => `${x},${z}`, h = (x: any, z: any) => Math.hypot(x - to.x, z - to.z);
        const first: { x: number; z: number; g: number; f: number; parent: any; [key: string]: any; } = { x: from.x, z: from.z, g: 0, f: h(from.x, from.z), parent: null };
        const open = [first], best = new Map([[key(first.x, first.z), 0]]);
        let target = null;
        for (let iter = 0; open.length && iter < 9000; iter++) {
            let min = 0;
            for (let i = 1; i < open.length; i++)
                if (open[i].f < open[min].f)
                    min = i;
            const q = open.splice(min, 1)[0];
            if (q.g > (best.get(key(q.x, q.z)) ?? Infinity))
                continue;
            if (q.x === to.x && q.z === to.z) {
                target = q;
                break;
            }
            for (const [dx, dz] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]) {
                const x = q.x + dx, z = q.z + dz;
                if (this.blocked(x * s, z * s) || (dx && dz &&
                    (this.blocked(x * s, q.z * s) || this.blocked(q.x * s, z * s))))
                    continue;
                if (!this.lineClear({ x: q.x * s, z: q.z * s }, { x: x * s, z: z * s }))
                    continue;
                const g = q.g + Math.hypot(dx, dz), k = key(x, z);
                if (g >= (best.get(k) ?? Infinity))
                    continue;
                best.set(k, g);
                open.push({ x, z, g, f: g + h(x, z), parent: q });
            }
        }
        if (!target)
            return [];
        const raw = [end];
        for (let q = target; q; q = q.parent)
            raw.push({ x: q.x * s, z: q.z * s });
        raw.reverse();
        const path = [];
        let at = start;
        for (let i = 0; i < raw.length;) {
            if (!this.lineClear(at, raw[i]))
                return [];
            let j = i;
            while (j + 1 < raw.length && this.lineClear(at, raw[j + 1]))
                j++;
            path.push(raw[j]);
            at = raw[j];
            i = j + 1;
        }
        return path;
    }
}
