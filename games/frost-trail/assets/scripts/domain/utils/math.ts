/** Ported reference rules v2.0.0; platform and rendering remain outside this module. */
export const clamp = (x: any, lo: any, hi: any) => Math.max(lo, Math.min(hi, x));
export const damp = (rate: any, dt: any) => 1 - Math.exp(-rate * Math.max(0, dt));
export const easeOutCubic = (t: any) => 1 - (1 - clamp(t, 0, 1)) ** 3;
export const easeInOutCubic = (t: any) => t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
export const distance = (a: any, b: any) => Math.hypot(a.x - b.x, a.z - b.z);
export function seededRandom(seed: number = 20260916) {
    return () => {
        seed |= 0;
        seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export function findLastIndex<T>(items: T[], matches: (item: T) => boolean): number {
    for(let i=items.length-1;i>=0;i--) if(matches(items[i])) return i;
    return -1;
}
