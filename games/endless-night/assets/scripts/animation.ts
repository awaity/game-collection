/** Faithful reference animation port using Creator transform adapters. */
import { Vec3 as T } from 'cc';
import { Euler as s, PoseMatrix as Pe, PoseColor as S, Transform as o, RenderNode as h, Surface } from './pose';
const Sa: any = .2, So: any = 10475775, Co: any = 120, ya: any = new T(1, 0, 0), ha: any = [5809919, 4176208, 16273737, 16765286], ga: any = { bread: 14721120, magnet: 7979263, flare: 16765286, hourglass: 10475775, chest: 16765286, ember: 16752704 };
const ma: any = (x?: any) => x >= 30 ? 3 : x >= 8 ? 2 : +(x >= 3);
function to(e3?: any, t2?: any): any {
    let n2: any = e3.a === `legL` || e3.a === `armR` ? 1 : -1;
    return (e3.b || 0) + n2 * Math.sin(t2) * (e3.k || 0);
}
function Fa(e3?: any, t2?: any, n2?: any, r2: any = true): any {
    let i2: any = t2.hero, a2: any = e3.anim, o2: any = a2.t < 0 ? 1 / 60 : Math.min(0.1, Math.max(0, n2 - a2.t));
    a2.t = n2;
    let s2: any = t2.phase === `dead` ? Math.min(1, t2.phaseT / 60) : 0;
    e3.g.position.set(i2.body.x, -i2.body.y, i2.dig > 0 ? -e3.u * 2.8 : 0);
    let c2: any = Math.atan2(Math.sin(i2.face - a2.face), Math.cos(i2.face - a2.face)), l2: any = r2 ? 1 - Math.exp(-o2 * 18) : 1;
    a2.face += c2 * l2, a2.turn += (c2 * 0.6 - a2.turn) * (1 - Math.exp(-o2 * 8)), e3.g.rotation.set(0, 0, -a2.face - Math.PI / 2);
    let u2: any = Math.min(1, i2.speedNow / 120), d2: any = i2.dist * 0.11;
    e3.legL.rotation.x = Math.sin(d2) * 0.9 * u2, e3.legR.rotation.x = -Math.sin(d2) * 0.9 * u2, e3.armL.rotation.x = -Math.sin(d2) * 0.7 * u2;
    let f2: any = i2.attackFlash > 0 ? 1 - i2.attackFlash / 6 : 1, p2: any = i2.attackFlash > 0 ? f2 < 0.25 ? f2 * 2.4 : -1.7 * Math.sin((f2 - 0.25) / 0.75 * Math.PI * 0.85) : 0;
    e3.armR.rotation.x = Math.sin(d2) * 0.7 * u2 + (r2 ? p2 : i2.attackFlash > 0 ? -1.2 * (i2.attackFlash / 6) : 0), e3.armL.rotation.y = r2 ? -0.25 * u2 : 0, e3.armR.rotation.y = r2 ? 0.25 * u2 : 0;
    let m2: any = r2 ? Math.sin(n2 * 2.2) * 0.5 * (1 - u2) : 0;
    e3.cape.rotation.x = -0.2 - u2 * 0.6 + Math.sin(n2 * 3) * 0.05 + (r2 ? Math.sin(n2 * 9.5) * 0.08 * u2 : 0), e3.cape.rotation.y = r2 ? -a2.turn * 0.6 : 0;
    let h2: any = Math.abs(Math.sin(d2));
    e3.body.position.z = h2 * 3.2 * u2 + m2;
    let g2: any = r2 ? (1 - h2) ** 3 * 0.09 * u2 - h2 * 0.04 * u2 + Math.sin(n2 * 2.2) * 0.012 * (1 - u2) : 0;
    e3.body.scale.set(1 + g2 * 0.6, 1 + g2 * 0.6, 1 - g2), e3.head.rotation.x = Sa + (r2 ? Math.sin(n2 * 2.2 + 0.6) * 0.05 * (1 - u2) : 0), e3.head.rotation.z = r2 ? Math.sin(d2) * 0.06 * u2 : 0;
    let _2: any = i2.hitFlash > 0;
    a2.blink -= o2, a2.blink < -0.13 && (a2.blink = 2.2 + Math.random() * 3);
    let v2: any = _2 ? 0.15 : a2.blink < 0 ? 0.12 : 1;
    for (let t3 of e3.eyes)
        t3.scale.z += (v2 - t3.scale.z) * Math.min(1, o2 * 40);
    let y2: any = r2 ? Math.max(0, i2.hitFlash) / 8 : 0;
    for (let t3 of e3.mats)
        t3.emissive.setRGB(y2 * 0.9, y2 * 0.2, y2 * 0.3);
    let b2: any = -u2 * 0.1 - s2 * 1.45 + y2 * 0.25, x2: any = r2 ? Math.max(-0.35, Math.min(0.35, a2.turn)) * u2 + Math.sin(d2) * 0.07 * u2 : 0;
    if (r2 && i2.tumble > 0 && (b2 -= (1 - i2.tumble / 12) * Math.PI * 2, x2 = 0), e3.body.rotation.set(b2, x2, 0), r2) {
        let t3: any = (i2.body.vx - a2.vx) / Math.max(o2, 1e-3), r3: any = (i2.body.vy - a2.vy) / Math.max(o2, 1e-3);
        a2.vx = i2.body.vx, a2.vy = i2.body.vy;
        let s3: any = Math.cos(a2.face), c3: any = Math.sin(a2.face), l3: any = (t3 * s3 + r3 * c3) / 2400, u3: any = (-t3 * c3 + r3 * s3) / 2400, d3: any = 5.5;
        a2.swingVX += (-60 * a2.swingX - d3 * a2.swingVX + l3 * 60) * o2, a2.swingVY += (-60 * a2.swingY - d3 * a2.swingVY - u3 * 60) * o2, a2.swingX = Math.max(-0.8, Math.min(0.8, a2.swingX + a2.swingVX * o2)), a2.swingY = Math.max(-0.8, Math.min(0.8, a2.swingY + a2.swingVY * o2)), e3.lanternAt.rotation.set(a2.swingX + Math.sin(n2 * 1.7) * 0.03, a2.swingY, 0);
    }
    e3.g.visible = !(i2.iframes > 0 && Math.floor(n2 * 20) % 2 && t2.phase === `play` && i2.sanct <= 0 && i2.ward <= 0), i2.dig > 0 && (e3.g.visible = false);
}
export const animateHero: any = Fa;
export class RigAnimation {
    lowGeo: any = false;
    simpleAnim: any = false;
    rigs: any = new Map();
    shadows: any;
    root: any = new Pe();
    pm: any = new Pe();
    am: any = new Pe();
    ar: any = new Pe();
    at: any = new Pe();
    tmpM: any = new Pe();
    part0: any = new Pe();
    tmpV: any = new T();
    eul: any = new s();
    col: any = new S();
    poses: any = new WeakMap();
    live: any = new Set();
    corpses: any = [];
    lastTime: any = 0;
    flashK: any = 1.8;
    constructor(private make: (id: string) => any) { this.shadows = new h(); this.shadows.instanced = true; }
    rig(id?: any): any { let r: any = this.rigs.get(id); if (!r) {
        r = this.make(id);
        this.rigs.set(id, r);
    } return r; }
    writeParts(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any, s2?: any, c2?: any): any {
        for (let l2 of e3.parts) {
            let e4: any = l2.mesh;
            if (l2.merged) {
                e4.setMatrixAt(t2, this.root), a2 && (o2 ? this.col.setRGB(this.flashK, this.flashK * 0.94, this.flashK) : s2 && !l2.emissive ? this.col.setRGB(0.75, 0.95, 1.35) : this.col.setRGB(1, 1, 1), c2 !== 1 && !o2 && this.col.multiplyScalar(c2), e4.setColorAt(t2, this.col), l2.dirty = true);
                continue;
            }
            let u2: any = l2.spec, d2: any = u2.rx || 0, f2: any = u2.ry || 0, p2: any = u2.rz || 0, m2: any = u2.p[2], h2: any = u2.s[0], g2: any = u2.s[1], _2: any = u2.s[2], v2: any = u2.k || 0;
            switch (u2.a) {
                case `legL`:
                    d2 = (u2.b || 0) + Math.sin(n2) * v2;
                    break;
                case `legR`:
                    d2 = (u2.b || 0) - Math.sin(n2) * v2;
                    break;
                case `armL`:
                    d2 = (u2.b || 0) - Math.sin(n2) * v2;
                    break;
                case `armR`:
                    d2 = (u2.b || 0) + Math.sin(n2) * v2;
                    break;
                case `wingL`:
                    p2 = Math.PI, f2 = Math.sin(n2 * 3) * 0.7 * (v2 || 1);
                    break;
                case `wingR`:
                    f2 = -Math.sin(n2 * 3) * 0.7 * (v2 || 1);
                    break;
                case `pulse`: {
                    let e5: any = 1 + Math.sin(n2 * 2) * v2;
                    h2 *= e5, g2 *= e5, _2 *= e5;
                    break;
                }
                case `flick`:
                    _2 *= 1 + Math.sin(i2 * 17 + r2) * v2 * 0.5;
                    break;
                case `tail`:
                    p2 = Math.sin(n2 * 1.5) * v2;
                    break;
                case `wiggle`:
                    p2 = Math.sin(n2 * 3) * v2;
                    break;
                case `jaw`:
                    d2 = Math.max(0, Math.sin(n2 * 0.7)) * 0.4;
                    break;
                case `hop`:
                    m2 += Math.abs(Math.sin(n2 * 1.2)) * v2 * 30;
            }
            let y2: any = this.part0;
            if (u2.quat ? y2.makeRotationFromQuaternion(u2.quat) : y2.makeRotationFromEuler(this.eul.set(d2, f2, p2)), y2.scale(this.tmpV.set(h2, g2, _2)), y2.setPosition(u2.p[0], u2.p[1], m2), u2.holdPart) {
                let e5: any = u2.holdPart;
                this.am.makeTranslation(e5.p[0], e5.p[1], e5.p[2]), this.am.multiply(this.ar.makeRotationX(to(e5, n2))), this.am.multiply(this.at.makeTranslation(0, 0, -e5.s[2])), this.am.multiply(y2), this.pm.multiplyMatrices(this.root, this.am);
            }
            else
                this.pm.multiplyMatrices(this.root, y2);
            e4.setMatrixAt(t2, this.pm), a2 && (o2 ? this.col.setRGB(this.flashK, this.flashK * 0.94, this.flashK) : this.col.setHex(s2 && !u2.e ? So : u2.c), c2 !== 1 && !o2 && this.col.multiplyScalar(c2), e4.setColorAt(t2, this.col), l2.dirty = true);
        }
    }
    sync(e3?: any, t2?: any, n2?: any): any {
        let r2: any = Math.min(0.1, Math.max(0, t2 - this.lastTime));
        this.lastTime = t2;
        for (let e4 of this.rigs.values()) {
            e4.count = 0;
            let t3: any = e4.touched;
            e4.touched = e4.touchedNext, e4.touchedNext = t3, t3.clear();
        }
        let i2: any = 0, a2: any = !!e3.eclipse, o2: any = e3.freeze > 0, s2: any = !this.simpleAnim, c2: any = 1 - Math.exp(-r2 * 12);
        if (s2)
            for (let e4 of this.live) {
                if (e4.alive || this.corpses.length >= Co)
                    continue;
                let t3: any = this.poses.get(e4);
                if (!t3)
                    continue;
                let n3: any = !!(e4.def.boss || e4.def.elite);
                this.corpses.push({ id: e4.id, pose: { ...t3 }, t: 0, T: e4.def.boss ? 1.4 : n3 ? 0.7 : e4.def.prop ? 0.25 : 0.42, dir: Math.atan2(e4.body.vy, e4.body.vx) || Math.random() * 6.28, r: e4.def.r, big: n3 });
            }
        this.live.clear();
        for (let r3 of e3.monsters) {
            if (!r3.alive)
                continue;
            let l2: any = r3.body.x, u2: any = r3.body.y;
            if (n2 && (l2 < n2.x0 || l2 > n2.x1 || u2 < n2.y0 || u2 > n2.y1) && !r3.def.boss && !r3.def.part)
                continue;
            let d2: any = this.rig(r3.id);
            if (d2.count >= d2.cap)
                continue;
            let f2: any = d2.count++, p2: any = r3.anim, m2: any = r3.def, h2: any = r3.wind > 0, g2: any = h2 ? (Math.random() - 0.5) * 4 : 0, _2: any = h2 ? (Math.random() - 0.5) * 4 : 0, v2: any = d2.fly + (d2.bobK ? Math.sin(p2 * 2 + r3.wobble) * d2.bobK : 0);
            r3.z >= 0 && (v2 = r3.z), r3.thrown > 0 && (v2 += Math.sin(r3.thrown / 36 * Math.PI) * 26);
            let y2: any = 1;
            if (r3.hidden > 0) {
                let e4: any = m2.ai === `king`;
                y2 = e4 ? Math.abs(r3.hidden - 20) / 20 : 0.05, v2 -= e4 ? 0 : m2.r * 1.2;
            }
            let b2: any = Math.min(1, (e3.frame - r3.born) / 20), x2: any = d2.sc * (m2.boss || m2.elite ? 1 : 0.4 + b2 * 0.6) * (m2.ai === `king` ? Math.max(0.05, y2) : 1);
            if (s2 && b2 < 1 && !d2.fly && !m2.boss && !m2.prop && !m2.part && (v2 -= (1 - b2) ** 2 * m2.r * 2.4), !r3.faceInit)
                r3.faceVis = r3.face, r3.faceInit = true;
            else {
                let e4: any = Math.atan2(Math.sin(r3.face - r3.faceVis), Math.cos(r3.face - r3.faceVis));
                r3.faceVis += e4 * Math.min(1, (m2.boss ? 0.08 : 0.18) * (r3.dash > 0 ? 3 : 1));
            }
            let S2: any = this.poses.get(r3);
            if (S2 || (S2 = { leanF: 0, leanS: 0, x: l2, y: u2, z: v2, face: r3.faceVis, scale: x2, ph: p2, wobble: r3.wobble }, this.poses.set(r3, S2)), s2 && !m2.prop) {
                let e4: any = Math.cos(r3.faceVis), t3: any = Math.sin(r3.faceVis), n3: any = Math.max(60, m2.speed) * 2.2, i3: any = (r3.body.vx * e4 + r3.body.vy * t3) / n3, a3: any = (-r3.body.vx * t3 + r3.body.vy * e4) / n3, o3: any = m2.boss ? 0.5 : 1;
                S2.leanF += (Math.max(-1, Math.min(1, i3)) * 0.26 * o3 - S2.leanF) * c2, S2.leanS += (Math.max(-1, Math.min(1, a3)) * (d2.fly ? 0.5 : 0.2) * o3 - S2.leanS) * c2;
            }
            let C2: any = 0, w2: any = 0;
            if (s2 && !d2.fly && !m2.prop && !m2.part && r3.hidden <= 0 && b2 >= 1) {
                let e4: any = Math.min(1, Math.hypot(r3.body.vx, r3.body.vy) / Math.max(40, m2.speed)), t3: any = Math.abs(Math.sin(p2)), n3: any = m2.boss ? 0.35 : 1;
                v2 += t3 * m2.r * 0.16 * e4 * n3, C2 = Math.sin(p2) * 0.13 * e4 * n3, w2 = (1 - t3) ** 4 * e4 * n3;
            }
            let T2: any = s2 ? Math.max(0, r3.hitFlash) / 6 : 0, ee2: any = x2 * (1 + 0.16 * T2 + 0.07 * w2), te2: any = x2 * (1 - 0.2 * T2 - 0.1 * w2);
            this.root.makeRotationZ(-r3.faceVis - Math.PI / 2), s2 && this.root.multiply(this.tmpM.makeRotationX(-S2.leanF)).multiply(this.tmpM.makeRotationY(S2.leanS + C2)), (r3.stun > 0 || o2) && this.root.multiply(this.tmpM.makeRotationX(Math.sin(t2 * 20) * 0.04)), this.root.scale(this.tmpV.set(ee2, ee2, te2)), this.root.setPosition(l2 + g2, -u2 + _2, v2), S2.x = l2 + g2, S2.y = u2 + _2, S2.z = v2, S2.face = r3.faceVis, S2.scale = x2, S2.ph = p2;
            let ne2: any = r3.hitFlash > 0, re2: any = o2 && !m2.boss, E2: any = Number(!!ne2) | (re2 ? 2 : 0) | (a2 ? 4 : 0), ie2: any = r3.colState !== E2 || r3.slotCheck !== f2 || d2.touched.has(f2);
            if (this.flashK = m2.boss ? 1.35 : 1.8, this.writeParts(d2, f2, p2, r3.wobble, t2, ie2, ne2, re2, a2 ? 0.7 : 1), r3.slotCheck = f2, r3.colState = E2, this.live.add(r3), m2.prop)
                continue;
            let ae2: any = m2.r * (d2.fly ? 1.7 : 2.3) * d2.sc * (r3.hidden > 0 && m2.ai !== `king` ? 1.6 : 1);
            this.part0.makeScale(ae2, ae2, 1).setPosition(l2, -u2, 0.5), i2 < this.shadows.instanceMatrix.count && this.shadows.setMatrixAt(i2++, this.part0);
        }
        for (let e4: any = this.corpses.length - 1; e4 >= 0; e4--) {
            let n3: any = this.corpses[e4];
            n3.t += r2;
            let a3: any = n3.t / n3.T;
            if (a3 >= 1) {
                this.corpses.splice(e4, 1);
                continue;
            }
            let o3: any = this.rig(n3.id);
            if (o3.count >= o3.cap)
                continue;
            let s3: any = o3.count++, c3: any = n3.pose, l2: any = a3 < 0.2 ? 1 : 1 - ((a3 - 0.2) / 0.8) ** 1.6, u2: any = c3.scale * l2 * (a3 < 0.12 ? 1 + a3 * 1.2 : 1.14 - a3 * 0.14), d2: any = Math.min(1, a3 * 1.6) ** 0.7 * (n3.big ? 1.45 : 1.25), f2: any = a3 * a3 * n3.r * (n3.big ? 1.6 : 1.1);
            this.root.makeRotationZ(-n3.dir), this.root.multiply(this.tmpM.makeRotationY(d2)), this.root.multiply(this.tmpM.makeRotationZ(n3.dir - c3.face - Math.PI / 2)), this.root.scale(this.tmpV.set(u2, u2, u2)), this.root.setPosition(c3.x, -c3.y, Math.max(c3.z - f2, -n3.r * 2));
            let p2: any = a3 < 0.12;
            if (this.flashK = n3.big ? 1.5 : 1.8, this.writeParts(o3, s3, c3.ph, c3.wobble, t2, true, p2, false, 1 - a3 * 0.6), o3.touchedNext.add(s3), i2 < this.shadows.instanceMatrix.count) {
                let e5: any = n3.r * 2.3 * l2;
                this.part0.makeScale(e5, e5, 1).setPosition(c3.x, -c3.y, 0.5), this.shadows.setMatrixAt(i2++, this.part0);
            }
        }
        for (let e4 of this.rigs.values())
            for (let t3 of e4.parts) {
                let n3: any = t3.mesh;
                n3.count = e4.count, n3.visible = e4.count > 0, n3.instanceMatrix.needsUpdate = true, t3.dirty && n3.instanceColor && (n3.instanceColor.needsUpdate = true, t3.dirty = false);
            }
        this.shadows.count = i2, this.shadows.instanceMatrix.needsUpdate = true;
    }
}
export class EffectsAnimation {
    d: any = new o();
    c: any = new S();
    dir: any = new T();
    eul: any = new s();
    owned: any = [];
    camPitch: any = 0;
    calm: any = false;
    gems: any;
    gemGlow: any;
    bolts: any;
    boltGlow: any;
    knives: any;
    spits: any;
    spitGlow: any;
    arrows: any;
    arrowTips: any;
    spades: any;
    spadeGlow: any;
    parts: any;
    wisps: any;
    wispGlow: any;
    sickles: any;
    sickleHafts: any;
    censers: any;
    censerCaps: any;
    censerGlow: any;
    links: any;
    ravenBody: any;
    ravenWing: any;
    ravenBeak: any;
    ravenEye: any;
    globs: any;
    pools: any;
    poolRings: any;
    scythes: any;
    pick: any;
    pickGlow: any;
    arcPool: any = [];
    ringPool: any = [];
    linePool: any = [];
    warnPool: any = [];
    aura: any;
    auraFill: any;
    dome: any;
    ward: any;
    heroRing: any;
    bossLight: any;
    scene: any = { add: () => { } };
    R: any;
    va: any;
    constructor(nodes: any, primitives: any, arc: any) { Object.assign(this, nodes); this.R = primitives; this.va = arc; this.bossLight = { visible: true, position: new T(), intensity: 0 }; }
    set(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any, o2?: any, s2?: any, c2?: any, l2: any = 0): any {
        this.d.position.set(n2, -r2, i2), this.d.rotation.set(l2, 0, a2), this.d.scale.set(o2, s2, c2), this.d.updateMatrix(), e3.setMatrixAt(t2, this.d.matrix);
    }
    glow(e3?: any, t2?: any, n2?: any, r2?: any, i2?: any, a2?: any): any {
        this.d.position.set(n2, -r2, i2), this.d.rotation.set(this.camPitch, 0, 0), this.d.scale.set(a2, a2, a2), this.d.updateMatrix(), e3.setMatrixAt(t2, this.d.matrix);
    }
    color(e3?: any, t2?: any, n2?: any): any {
        this.c.setHex(n2), e3.setColorAt(t2, this.c);
    }
    done(e3?: any, t2?: any): any {
        e3.count = t2, e3.visible = t2 > 0, e3.instanceMatrix.needsUpdate = true, e3.instanceColor && (e3.instanceColor.needsUpdate = true);
    }
    sync(e3?: any, t2?: any, n2?: any, r2?: any, i2: any = false): any {
        this.camPitch = n2, this.calm = i2;
        let a2: any = (e4?: any, t3?: any, n3: any = 60) => e4 > r2.x0 - n3 && e4 < r2.x1 + n3 && t3 > r2.y0 - n3 && t3 < r2.y1 + n3, o2: any = 0;
        for (let n3 of e3.gems) {
            if (o2 >= 460)
                break;
            if (!a2(n3.x, n3.y))
                continue;
            let e4: any = ma(n3.xp), r3: any = 4 + e4 * 1.6, i3: any = 7 + Math.sin(n3.bob + t2 * 5) * 2;
            this.set(this.gems, o2, n3.x, n3.y, i3, t2 * 2 + n3.bob, r3 * 0.7, r3 * 0.7, r3), this.color(this.gems, o2, ha[e4]), this.glow(this.gemGlow, o2, n3.x, n3.y, i3, r3 * 5), this.color(this.gemGlow, o2, ha[e4]), o2++;
        }
        this.done(this.gems, o2), this.done(this.gemGlow, o2);
        let s2: any = {}, c2: any = 0;
        for (let n3 of e3.pickups) {
            if (!a2(n3.x, n3.y))
                continue;
            let e4: any = this.pick[n3.kind], r3: any = s2[n3.kind] = (s2[n3.kind] ?? -1) + 1;
            if (r3 >= e4.instanceMatrix.count)
                continue;
            let i3: any = Math.sin(n3.t * 0.08) * 3, o3: any = (n3.kind === `chest` ? 10 : 12) + i3, l3: any = n3.kind === `chest` ? 14 : n3.kind === `ember` ? 5 + Math.min(4, (n3.v || 1) * 0.3) : 8, u3: any = n3.kind === `chest` ? 0.3 : t2 * 2 + n3.x;
            this.set(e4, r3, n3.x, n3.y, o3, u3, l3, l3, l3, n3.kind === `ember` ? Math.PI / 2 : n3.kind === `magnet` ? -Math.PI / 2 : 0), c2 < 240 && (this.glow(this.pickGlow, c2, n3.x, n3.y, o3, n3.kind === `chest` ? n3.relic ? 130 : 90 : n3.kind === `ember` ? 26 : 44), this.color(this.pickGlow, c2, n3.relic ? 11565823 : ga[n3.kind]), c2++);
        }
        for (let e4 of Object.keys(this.pick))
            this.done(this.pick[e4], (s2[e4] ?? -1) + 1);
        this.done(this.pickGlow, c2);
        let l2: any = 0, u2: any = 0, d2: any = 0, f2: any = 0;
        for (let n3 of e3.shots) {
            if (!n3.body)
                continue;
            let { x: e4, y: r3 }: any = n3.body;
            if (n3.kind === `wisp`) {
                if (d2 >= 120)
                    continue;
                let n4: any = 1 + Math.sin(t2 * 30 + d2) * 0.15;
                this.set(this.wisps, d2, e4, r3, 18, 0, 3.4 * n4, 3.4 * n4, 4.2 * n4), this.glow(this.wispGlow, d2, e4, r3, 18, 34 * n4), d2++;
            }
            else if (n3.kind === `sickle`) {
                if (f2 >= 40)
                    continue;
                let i3: any = -t2 * 16 - f2, a3: any = n3.r * 1.25;
                this.set(this.sickles, f2, e4, r3, 16, i3, a3, a3, a3), this.set(this.sickleHafts, f2, e4 - Math.cos(-i3) * a3 * 0.2, r3 + Math.sin(-i3) * a3 * 0.2, 16, i3 + Math.PI / 2, 2.4, a3 * 0.9, 2.4), f2++;
            }
            else if (n3.kind === `bolt`) {
                if (l2 >= 160)
                    continue;
                let t3: any = n3.blast ? 1.5 : 1;
                this.set(this.bolts, l2, e4, r3, 16, -n3.angle, 22 * t3, 3 * t3, 3 * t3), this.glow(this.boltGlow, l2, e4, r3, 16, 30 * t3), l2++;
            }
            else
                u2 < 200 && (this.set(this.knives, u2, e4, r3, 14, -n3.angle - Math.PI / 2, 2.4, 12, 1.4), u2++);
        }
        this.done(this.bolts, l2), this.done(this.boltGlow, l2), this.done(this.knives, u2), this.done(this.wisps, d2), this.done(this.wispGlow, d2), this.done(this.sickles, f2), this.done(this.sickleHafts, f2);
        let p2: any = 0, m2: any = 0, h2: any = e3.hero.body.x, g2: any = e3.hero.body.y;
        for (let n3 of e3.censers) {
            if (n3.hidden || p2 >= 4)
                continue;
            let { x: e4, y: r3 }: any = n3.body, i3: any = Math.sin(t2 * 9 + p2) * 0.3;
            this.set(this.censers, p2, e4, r3, 20, t2 * 3, 10, 10, 9), this.set(this.censerCaps, p2, e4, r3, 30, 0, 7, 7, 7), this.glow(this.censerGlow, p2, e4, r3, 22, 46);
            let a3: any = Math.hypot(e4 - h2, r3 - g2), o3: any = Math.min(18, Math.max(4, Math.round(a3 / 9)));
            for (let t3: any = 1; t3 < o3 && m2 < 80; t3++) {
                let n4: any = t3 / o3, a4: any = 26 - Math.sin(n4 * Math.PI) * 4;
                this.set(this.links, m2, h2 + (e4 - h2) * n4, g2 + (r3 - g2) * n4, a4, -Math.atan2(r3 - g2, e4 - h2), 3.2, 3.2, 3.2, t3 % 2 ? Math.PI / 2 + i3 : i3), m2++;
            }
            p2++;
        }
        this.done(this.censers, p2), this.done(this.censerCaps, p2), this.done(this.censerGlow, p2), this.done(this.links, m2);
        let _2: any = 0;
        for (let t3 of e3.ravens) {
            if (_2 >= 6)
                break;
            let e4: any = t3.face ?? 0, n3: any = t3.state === `dive` ? -0.9 : Math.sin(t3.fp) * 0.8, r3: any = t3.z;
            this.d.position.set(t3.x, -t3.y, r3), this.d.rotation.set(0, 0, -e4), this.d.scale.set(9, 5, 4.5), this.d.updateMatrix(), this.ravenBody.setMatrixAt(_2, this.d.matrix);
            let i3: any = Math.cos(e4), a3: any = Math.sin(e4);
            this.d.position.set(t3.x + i3 * 9, -(t3.y + a3 * 9), r3 + 2), this.d.rotation.set(0, 0, -e4 - Math.PI / 2), this.d.scale.set(1.6, 6, 1.6), this.d.updateMatrix(), this.ravenBeak.setMatrixAt(_2, this.d.matrix);
            for (let o3 of [-1, 1]) {
                let s3: any = _2 * 2 + +(o3 > 0);
                this.d.position.set(t3.x, -t3.y, r3 + 1), this.d.quaternion.setFromEuler(this.eul.set(o3 * n3, 0, -e4 - Math.PI / 2 + (o3 < 0 ? Math.PI : 0), `ZYX`)), this.d.scale.set(14, 6, 0.8), this.d.updateMatrix(), this.ravenWing.setMatrixAt(s3, this.d.matrix), this.d.quaternion.identity(), this.d.position.set(t3.x + i3 * 6 - a3 * o3 * 2.2, -(t3.y + a3 * 6 + i3 * o3 * 2.2), r3 + 3.2), this.d.scale.set(1.1, 1.1, 1.1), this.d.updateMatrix(), this.ravenEye.setMatrixAt(s3, this.d.matrix);
            }
            _2++;
        }
        this.done(this.ravenBody, _2), this.done(this.ravenBeak, _2), this.done(this.ravenWing, _2 * 2), this.done(this.ravenEye, _2 * 2);
        let v2: any = 0, y2: any = 0;
        for (let t3 of e3.spits) {
            if (!t3.body || v2 >= 260)
                continue;
            let { x: e4, y: n3 }: any = t3.body, r3: any = t3.r * (t3.big ? 1.3 : 1);
            t3.arrow && y2 < 120 ? (this.set(this.arrows, y2, e4, n3, 16, -t3.angle, 20, 1.4, 1.4), this.set(this.arrowTips, y2, e4 + Math.cos(t3.angle) * 11, n3 + Math.sin(t3.angle) * 11, 16, -t3.angle - Math.PI / 2, 2.2, 5, 2.2), y2++) : (this.set(this.spits, v2, e4, n3, 14, 0, r3, r3, r3), this.color(this.spits, v2, t3.color), this.glow(this.spitGlow, v2, e4, n3, 14, r3 * 7), this.color(this.spitGlow, v2, t3.color), v2++);
        }
        this.done(this.spits, v2), this.done(this.spitGlow, v2), this.done(this.arrows, y2), this.done(this.arrowTips, y2);
        let b2: any = 0;
        for (let n3 of e3.orbs) {
            if (n3.hidden)
                continue;
            let e4: any = n3.w.id === `halo` ? 1.3 : 1;
            this.set(this.spades, b2, n3.body.x, n3.body.y, 16, -n3.a - t2 * 8, 12 * e4, 3 * e4, 16 * e4, 0.5), this.glow(this.spadeGlow, b2, n3.body.x, n3.body.y, 16, 40 * e4), b2++;
        }
        this.done(this.spades, b2), this.done(this.spadeGlow, b2);
        let x2: any = 0;
        for (let n3 of e3.particles) {
            if (x2 >= 640)
                break;
            if (!a2(n3.x, n3.y, 20))
                continue;
            let e4: any = n3.life / n3.T, r3: any = n3.size * (0.4 + e4);
            this.set(this.parts, x2, n3.x, n3.y, 4 + n3.z, t2 * 3 + x2, r3, r3, r3), this.c.setHex(n3.color).multiplyScalar(0.5 + e4 * 0.8), this.parts.setColorAt(x2, this.c), x2++;
        }
        this.done(this.parts, x2);
        let S2: any = 0;
        for (let t3 of e3.globs) {
            if (t3.t < 0)
                continue;
            let e4: any = t3.t / t3.T, n3: any = t3.x0 + (t3.x1 - t3.x0) * e4, r3: any = t3.y0 + (t3.y1 - t3.y0) * e4, i3: any = 10 + Math.sin(e4 * Math.PI) * 120, a3: any = t3.friendly ? 5 : 9;
            this.set(this.globs, S2, n3, r3, i3, e4 * 8, a3, a3, t3.friendly ? 7 : 9), this.color(this.globs, S2, t3.color), S2++;
        }
        this.done(this.globs, S2);
        let C2: any = 0;
        for (let n3 of e3.zones) {
            if (n3.life === void 0 || C2 >= 80)
                continue;
            let e4: any = Math.min(1, n3.life / 30, ((n3.T ?? n3.life) - n3.life + 1) / 10), r3: any = n3.sun ? 16756800 : n3.earth ? 6965802 : n3.kind === `holy` ? 3844320 : n3.kind === `fire` ? 16738848 : n3.kind === `smoke` ? 9075354 : 3824170, i3: any = n3.r * (n3.kind === `holy` ? 0.9 + 0.1 * Math.sin(t2 * 6 + n3.x) : 1);
            this.set(this.pools, C2, n3.x, n3.y, 1.2 + C2 * 0.01, 0, i3, i3, 1), this.c.setHex(r3).multiplyScalar(e4 * (n3.kind === `mud` ? 0.6 : n3.kind === `smoke` ? 0.28 : 1)), this.pools.setColorAt(C2, this.c), this.set(this.poolRings, C2, n3.x, n3.y, 1.4, 0, i3, i3, 1);
            let a3: any = n3.sun ? 16773296 : n3.earth ? 3811864 : n3.kind === `holy` ? 5943520 : n3.kind === `fire` ? 16760944 : n3.kind === `smoke` ? 2761778 : 5929530;
            this.c.setHex(a3).multiplyScalar(e4), this.poolRings.setColorAt(C2, this.c), C2++;
        }
        this.done(this.pools, C2), this.done(this.poolRings, C2);
        let w2: any = 0;
        for (let n3 of e3.hazards)
            this.set(this.scythes, w2++, n3.x, n3.y, 20, -n3.a - t2 * 10, 20, 20, 20);
        this.done(this.scythes, w2), this.syncOneOffs(e3), this.syncHeroFx(e3, t2);
    }
    take(e3?: any, t2?: any, n2?: any): any {
        return e3[n2] || (e3[n2] = t2(), this.scene.add(e3[n2])), e3[n2].visible = true, e3[n2];
    }
    park(e3?: any, t2?: any): any {
        for (let n2: any = t2; n2 < e3.length; n2++)
            e3[n2].visible = false;
    }
    syncOneOffs(e3?: any): any {
        let t2: any = 0;
        for (let n3 of e3.arcs) {
            let e4: any = this.take(this.arcPool, () => new h(this.R.disc, new Surface({ side: 2 })), t2++), r2: any = n3.t / n3.T;
            e4.geometry = this.va(n3.arc), e4.position.set(n3.x, -n3.y, 14), e4.rotation.set(0, 0, -n3.a), e4.scale.set(n3.r * (0.7 + r2 * 0.3), n3.r * (0.7 + r2 * 0.3), 1);
            let i2: any = e4.material;
            i2.color.setHex(n3.color), i2.opacity = Math.sin(Math.min(1, r2 * 1.6) * Math.PI * 0.5) * (1 - r2) * (this.calm ? 0.28 : 0.55);
        }
        this.park(this.arcPool, t2), t2 = 0;
        for (let n3 of e3.rings) {
            let e4: any = this.take(this.ringPool, () => new h(this.R.ring, new Surface({ side: 2 })), t2++);
            e4.position.set(n3.x, -n3.y, 3), e4.scale.set(n3.r, n3.r, 1);
            let r2: any = e4.material;
            r2.color.setHex(n3.color), r2.opacity = (1 - n3.t / n3.T) * (this.calm ? 0.35 : 0.7);
        }
        this.park(this.ringPool, t2), t2 = 0;
        let n2: any = (e4?: any, n3?: any, r2?: any, i2?: any, a2?: any, o2?: any, s2?: any, c2?: any, l2?: any) => {
            let u2: any = this.take(this.linePool, () => new h(this.R.box, new Surface()), t2++), d2: any = i2 - e4, f2: any = -(a2 - n3), p2: any = o2 - r2, m2: any = Math.hypot(d2, f2, p2) || 1;
            u2.position.set((e4 + i2) / 2, -(n3 + a2) / 2, (r2 + o2) / 2), u2.quaternion.setFromUnitVectors(ya, this.dir.set(d2 / m2, f2 / m2, p2 / m2)), u2.scale.set(m2, s2, s2);
            let g2: any = u2.material;
            g2.color.setHex(c2), g2.opacity = l2;
        };
        for (let t3 of e3.bolts) {
            let e4: any = (1 - t3.t / t3.T) * (this.calm ? 0.4 : 0.85);
            for (let r2: any = 1; r2 < t3.pts.length; r2++) {
                let i2: any = t3.pts[r2 - 1], a2: any = t3.pts[r2];
                n2(i2.x, i2.y, i2.z, a2.x, a2.y, a2.z, 3.2, t3.color, e4), n2(i2.x, i2.y, i2.z, a2.x, a2.y, a2.z, 9, 9075455, e4 * 0.35);
            }
        }
        for (let t3 of e3.beams)
            n2(t3.x0, t3.y0, 20, t3.x1, t3.y1, 12, 2.4, t3.color, 1 - t3.t / t3.T);
        this.park(this.linePool, t2), t2 = 0;
        for (let n3 of e3.monsters) {
            if (!n3.alive || n3.wind <= 0 || !(n3.def.elite || n3.def.boss))
                continue;
            let r2: any = this.take(this.warnPool, () => new h(this.R.disc, new Surface({ color: 16726570 })), t2++), i2: any = n3.windKind === `slam` || n3.windKind === `sweep`;
            r2.position.set(n3.body.x, -n3.body.y, 1.6);
            let a2: any = i2 ? n3.def.ai === `stag` ? 170 : 240 : n3.def.r * 1.8;
            r2.scale.set(a2, a2, 1), r2.material.opacity = 0.15 + 0.12 * Math.sin(e3.frame * 0.5);
        }
        this.park(this.warnPool, t2);
    }
    syncHeroFx(e3?: any, t2?: any): any {
        let n2: any = e3.hero, r2: any = n2.body.x, i2: any = n2.body.y, a2: any = n2.weapons.find((e4?: any) => e4.id === `bell` || e4.id === `toll`);
        if (a2 && a2.radius && n2.dig <= 0) {
            this.aura.visible = this.auraFill.visible = true;
            let e4: any = a2.radius;
            this.aura.position.set(r2, -i2, 2.2), this.aura.scale.set(e4, e4, 1), this.auraFill.position.set(r2, -i2, 2), this.auraFill.scale.set(e4, e4, 1), this.aura.material.opacity = 0.25 + a2.pulse * 0.6, this.auraFill.material.opacity = 0.04 + a2.pulse * 0.12;
        }
        else
            this.aura.visible = this.auraFill.visible = false;
        if (this.heroRing.position.set(r2, -i2, 1.8), this.heroRing.scale.set(20, 20, 1), this.heroRing.visible = n2.dig <= 0 && e3.phase !== `dead` && !e3.title, this.dome.visible = n2.sanct > 0, n2.sanct > 0) {
            this.dome.position.set(r2, -i2, 0);
            let e4: any = 46 + Math.sin(t2 * 8) * 2;
            this.dome.scale.set(e4, e4, e4), this.dome.material.opacity = 0.14 + Math.min(1, n2.sanct / 30) * 0.1;
        }
        if (this.ward.visible = n2.ward > 0 && n2.dig <= 0, this.ward.visible) {
            this.ward.position.set(r2, -i2, 16);
            let e4: any = 30 + Math.sin(t2 * 6) * 1.5;
            this.ward.scale.set(e4, e4, e4), this.ward.material.opacity = n2.ward < 60 && Math.floor(t2 * 12) % 2 ? 0.05 : 0.16;
        }
        let o2: any = e3.boss;
        o2?.alive && o2.def.ai === `king` ? (this.bossLight.position.set(o2.body.x, -o2.body.y, 90), this.bossLight.intensity = 3e4 + Math.sin(t2 * 3) * 8e3) : this.bossLight.intensity = 0;
    }
}
