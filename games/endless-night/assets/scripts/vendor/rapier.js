// Adapted generated Rapier bindings from the reference build; see THIRD-PARTY.md.
function e(defs){const out={};for(const key in defs)Object.defineProperty(out,key,{get:defs[key],enumerable:true});return out}
function utf8(bytes){if(!bytes)return '';let result='';for(let i=0;i<bytes.length;){let c=bytes[i++];if(c<128)result+=String.fromCharCode(c);else if(c<224)result+=String.fromCharCode((c&31)<<6|bytes[i++]&63);else if(c<240){const b=bytes[i++];result+=String.fromCharCode((c&15)<<12|(b&63)<<6|bytes[i++]&63)}else{const b=bytes[i++],d=bytes[i++];let n=((c&7)<<18|(b&63)<<12|(d&63)<<6|bytes[i++]&63)-65536;result+=String.fromCharCode(55296+(n>>10),56320+(n&1023))}}return result}
function decoder(){return typeof TextDecoder==='function'?new TextDecoder('utf-8',{ignoreBOM:true,fatal:true}):{decode:utf8}}
var a = class e2 {
  static __wrap(t2) {
    let n2 = Object.create(e2.prototype);
    return n2.__wbg_ptr = t2, We.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, We.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawbroadphase_free(e51, 0);
  }
  castRayAndGetNormal(e51, t2, n2, r2, i2, a2, o2, s2, l2, u2, d2, f2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M), P(i2, M);
      let p2 = K.rawbroadphase_castRayAndGetNormal(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2, o2, s2, V(l2) ? 2 ** 53 - 1 : l2 >>> 0, !V(u2), V(u2) ? 0 : u2, !V(d2), V(d2) ? 0 : d2, F(f2));
      return p2 === 0 ? void 0 : ae.__wrap(p2);
    } finally {
      B[W++] = void 0;
    }
  }
  castRay(e51, t2, n2, r2, i2, a2, o2, s2, l2, u2, d2, f2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M), P(i2, M);
      let p2 = K.rawbroadphase_castRay(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2, o2, s2, V(l2) ? 2 ** 53 - 1 : l2 >>> 0, !V(u2), V(u2) ? 0 : u2, !V(d2), V(d2) ? 0 : d2, F(f2));
      return p2 === 0 ? void 0 : ie.__wrap(p2);
    } finally {
      B[W++] = void 0;
    }
  }
  castShape(e51, t2, n2, r2, i2, a2, o2, s2, u2, d2, f2, p2, m2, h2, g2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M), P(i2, E), P(a2, M), P(o2, D);
      let _2 = K.rawbroadphase_castShape(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2.__wbg_ptr, s2, u2, d2, f2, V(p2) ? 2 ** 53 - 1 : p2 >>> 0, !V(m2), V(m2) ? 0 : m2, !V(h2), V(h2) ? 0 : h2, F(g2));
      return _2 === 0 ? void 0 : l.__wrap(_2);
    } finally {
      B[W++] = void 0;
    }
  }
  collidersWithAabbIntersectingAabb(e51, t2, n2, r2, i2, a2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M), P(i2, M), K.rawbroadphase_collidersWithAabbIntersectingAabb(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, F(a2));
    } finally {
      B[W++] = void 0;
    }
  }
  intersectionWithShape(e51, t2, n2, r2, i2, a2, o2, s2, l2, u2, d2) {
    try {
      let m2 = K.__wbindgen_add_to_stack_pointer(-16);
      P(e51, C), P(t2, T), P(n2, c), P(r2, M), P(i2, E), P(a2, D), K.rawbroadphase_intersectionWithShape(m2, this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2, V(s2) ? 2 ** 53 - 1 : s2 >>> 0, !V(l2), V(l2) ? 0 : l2, !V(u2), V(u2) ? 0 : u2, F(d2));
      var f2 = R().getInt32(m2 + 0, true), p2 = R().getFloat64(m2 + 8, true);
      return f2 === 0 ? void 0 : p2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16), B[W++] = void 0;
    }
  }
  intersectionsWithPoint(e51, t2, n2, r2, i2, a2, o2, s2, l2, u2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M), K.rawbroadphase_intersectionsWithPoint(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, F(i2), a2, V(o2) ? 2 ** 53 - 1 : o2 >>> 0, !V(s2), V(s2) ? 0 : s2, !V(l2), V(l2) ? 0 : l2, F(u2));
    } finally {
      B[W++] = void 0, B[W++] = void 0;
    }
  }
  intersectionsWithRay(e51, t2, n2, r2, i2, a2, o2, s2, l2, u2, d2, f2, p2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M), P(i2, M), K.rawbroadphase_intersectionsWithRay(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2, o2, F(s2), l2, V(u2) ? 2 ** 53 - 1 : u2 >>> 0, !V(d2), V(d2) ? 0 : d2, !V(f2), V(f2) ? 0 : f2, F(p2));
    } finally {
      B[W++] = void 0, B[W++] = void 0;
    }
  }
  intersectionsWithShape(e51, t2, n2, r2, i2, a2, o2, s2, l2, u2, d2, f2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M), P(i2, E), P(a2, D), K.rawbroadphase_intersectionsWithShape(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, F(o2), s2, V(l2) ? 2 ** 53 - 1 : l2 >>> 0, !V(u2), V(u2) ? 0 : u2, !V(d2), V(d2) ? 0 : d2, F(f2));
    } finally {
      B[W++] = void 0, B[W++] = void 0;
    }
  }
  constructor() {
    let e51 = K.rawbroadphase_new();
    return this.__wbg_ptr = e51, We.register(this, this.__wbg_ptr, this), this;
  }
  projectPointAndGetFeature(e51, t2, n2, r2, i2, a2, o2, s2, l2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M);
      let u2 = K.rawbroadphase_projectPointAndGetFeature(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2, V(a2) ? 2 ** 53 - 1 : a2 >>> 0, !V(o2), V(o2) ? 0 : o2, !V(s2), V(s2) ? 0 : s2, F(l2));
      return u2 === 0 ? void 0 : ne.__wrap(u2);
    } finally {
      B[W++] = void 0;
    }
  }
  projectPoint(e51, t2, n2, r2, i2, a2, o2, s2, l2, u2) {
    try {
      P(e51, C), P(t2, T), P(n2, c), P(r2, M);
      let d2 = K.rawbroadphase_projectPoint(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2, a2, V(o2) ? 2 ** 53 - 1 : o2 >>> 0, !V(s2), V(s2) ? 0 : s2, !V(l2), V(l2) ? 0 : l2, F(u2));
      return d2 === 0 ? void 0 : ne.__wrap(d2);
    } finally {
      B[W++] = void 0;
    }
  }
};
Symbol.dispose && (a.prototype[Symbol.dispose] = a.prototype.free);
var o = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ge.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawccdsolver_free(e51, 0);
  }
  constructor() {
    let e51 = K.rawccdsolver_new();
    return this.__wbg_ptr = e51, Ge.register(this, this.__wbg_ptr, this), this;
  }
};
Symbol.dispose && (o.prototype[Symbol.dispose] = o.prototype.free);
var s = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ke.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawcharactercollision_free(e51, 0);
  }
  handle() {
    return K.rawcharactercollision_handle(this.__wbg_ptr);
  }
  constructor() {
    let e51 = K.rawcharactercollision_new();
    return this.__wbg_ptr = e51, Ke.register(this, this.__wbg_ptr, this), this;
  }
  toi() {
    return K.rawcharactercollision_toi(this.__wbg_ptr);
  }
  translationDeltaApplied(e51) {
    try {
      K.rawcharactercollision_translationDeltaApplied(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  translationDeltaRemaining(e51) {
    try {
      K.rawcharactercollision_translationDeltaRemaining(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  worldNormal1(e51) {
    try {
      K.rawcharactercollision_worldNormal1(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  worldNormal2(e51) {
    try {
      K.rawcharactercollision_worldNormal2(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  worldWitness1(e51) {
    try {
      K.rawcharactercollision_worldWitness1(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  worldWitness2(e51) {
    try {
      K.rawcharactercollision_worldWitness2(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
};
Symbol.dispose && (s.prototype[Symbol.dispose] = s.prototype.free);
var c = class e3 {
  static __wrap(t2) {
    let n2 = Object.create(e3.prototype);
    return n2.__wbg_ptr = t2, qe.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, qe.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawcolliderset_free(e51, 0);
  }
  coActiveCollisionTypes(e51) {
    return K.rawcolliderset_coActiveCollisionTypes(this.__wbg_ptr, e51);
  }
  coActiveEvents(e51) {
    return K.rawcolliderset_coActiveEvents(this.__wbg_ptr, e51) >>> 0;
  }
  coActiveHooks(e51) {
    return K.rawcolliderset_coActiveHooks(this.__wbg_ptr, e51) >>> 0;
  }
  coCastCollider(e51, t2, n2, r2, i2, a2, o2) {
    P(t2, M), P(r2, M);
    let s2 = K.rawcolliderset_coCastCollider(this.__wbg_ptr, e51, t2.__wbg_ptr, n2, r2.__wbg_ptr, i2, a2, o2);
    return s2 === 0 ? void 0 : l.__wrap(s2);
  }
  coCastRayAndGetNormal(e51, t2, n2, r2, i2) {
    P(t2, M), P(n2, M);
    let a2 = K.rawcolliderset_coCastRayAndGetNormal(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2, i2);
    return a2 === 0 ? void 0 : oe.__wrap(a2);
  }
  coCastRay(e51, t2, n2, r2, i2) {
    return P(t2, M), P(n2, M), K.rawcolliderset_coCastRay(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2, i2);
  }
  coCastShape(e51, t2, n2, r2, i2, a2, o2, s2, c2) {
    P(t2, M), P(n2, D), P(r2, M), P(i2, E), P(a2, M);
    let l2 = K.rawcolliderset_coCastShape(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2, s2, c2);
    return l2 === 0 ? void 0 : ce.__wrap(l2);
  }
  coCollisionGroups(e51) {
    return K.rawcolliderset_coCollisionGroups(this.__wbg_ptr, e51) >>> 0;
  }
  coCombineVoxelStates(e51, t2, n2, r2) {
    K.rawcolliderset_coCombineVoxelStates(this.__wbg_ptr, e51, t2, n2, r2);
  }
  coCompoundFlags(e51) {
    let t2 = K.rawcolliderset_coCompoundFlags(this.__wbg_ptr, e51);
    return t2 === 2 ** 53 - 1 ? void 0 : t2;
  }
  coContactCollider(e51, t2, n2) {
    let r2 = K.rawcolliderset_coContactCollider(this.__wbg_ptr, e51, t2, n2);
    return r2 === 0 ? void 0 : le.__wrap(r2);
  }
  coContactForceEventThreshold(e51) {
    return K.rawcolliderset_coContactForceEventThreshold(this.__wbg_ptr, e51);
  }
  coContactShape(e51, t2, n2, r2, i2) {
    P(t2, D), P(n2, M), P(r2, E);
    let a2 = K.rawcolliderset_coContactShape(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2);
    return a2 === 0 ? void 0 : le.__wrap(a2);
  }
  coContactSkin(e51) {
    return K.rawcolliderset_coContactSkin(this.__wbg_ptr, e51);
  }
  coContainsPoint(e51, t2) {
    return P(t2, M), K.rawcolliderset_coContainsPoint(this.__wbg_ptr, e51, t2.__wbg_ptr) !== 0;
  }
  coDensity(e51) {
    return K.rawcolliderset_coDensity(this.__wbg_ptr, e51);
  }
  coFrictionCombineRule(e51) {
    return K.rawcolliderset_coFrictionCombineRule(this.__wbg_ptr, e51) >>> 0;
  }
  coFriction(e51) {
    return K.rawcolliderset_coFriction(this.__wbg_ptr, e51);
  }
  coHalfExtents(e51, t2) {
    try {
      return K.rawcolliderset_coHalfExtents(this.__wbg_ptr, e51, F(t2)) !== 0;
    } finally {
      B[W++] = void 0;
    }
  }
  coHalfHeight(e51) {
    let t2 = K.rawcolliderset_coHalfHeight(this.__wbg_ptr, e51);
    return t2 === 2 ** 53 - 1 ? void 0 : t2;
  }
  coHalfspaceNormal(e51, t2) {
    try {
      return K.rawcolliderset_coHalfspaceNormal(this.__wbg_ptr, e51, F(t2)) !== 0;
    } finally {
      B[W++] = void 0;
    }
  }
  coHeightfieldHeights(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawcolliderset_coHeightfieldHeights(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getInt32(r2 + 4, true);
      let i2;
      return t2 !== 0 && (i2 = I(t2, n2).slice(), K.__wbindgen_export2(t2, n2 * 4, 4)), i2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coHeightfieldScale(e51, t2) {
    try {
      return K.rawcolliderset_coHeightfieldScale(this.__wbg_ptr, e51, F(t2)) !== 0;
    } finally {
      B[W++] = void 0;
    }
  }
  coIndices(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawcolliderset_coIndices(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getInt32(r2 + 4, true);
      let i2;
      return t2 !== 0 && (i2 = L(t2, n2).slice(), K.__wbindgen_export2(t2, n2 * 4, 4)), i2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coIntersectsRay(e51, t2, n2, r2) {
    return P(t2, M), P(n2, M), K.rawcolliderset_coIntersectsRay(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2) !== 0;
  }
  coIntersectsShape(e51, t2, n2, r2) {
    return P(t2, D), P(n2, M), P(r2, E), K.rawcolliderset_coIntersectsShape(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr) !== 0;
  }
  coIsDeformable(e51) {
    return K.rawcolliderset_coIsDeformable(this.__wbg_ptr, e51) !== 0;
  }
  coIsEnabled(e51) {
    return K.rawcolliderset_coIsEnabled(this.__wbg_ptr, e51) !== 0;
  }
  coIsSensor(e51) {
    return K.rawcolliderset_coIsSensor(this.__wbg_ptr, e51) !== 0;
  }
  coMass(e51) {
    return K.rawcolliderset_coMass(this.__wbg_ptr, e51);
  }
  coParent(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawcolliderset_coParent(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getFloat64(r2 + 8, true);
      return t2 === 0 ? void 0 : n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coPolylineFlags(e51) {
    let t2 = K.rawcolliderset_coPolylineFlags(this.__wbg_ptr, e51);
    return t2 === 2 ** 53 - 1 ? void 0 : t2;
  }
  coProjectPoint(e51, t2, n2) {
    P(t2, M);
    let r2 = K.rawcolliderset_coProjectPoint(this.__wbg_ptr, e51, t2.__wbg_ptr, n2);
    return re.__wrap(r2);
  }
  coPropagateVoxelChange(e51, t2, n2, r2, i2, a2) {
    K.rawcolliderset_coPropagateVoxelChange(this.__wbg_ptr, e51, t2, n2, r2, i2, a2);
  }
  coRadius(e51) {
    let t2 = K.rawcolliderset_coRadius(this.__wbg_ptr, e51);
    return t2 === 2 ** 53 - 1 ? void 0 : t2;
  }
  coRestitutionCombineRule(e51) {
    return K.rawcolliderset_coRestitutionCombineRule(this.__wbg_ptr, e51) >>> 0;
  }
  coRestitution(e51) {
    return K.rawcolliderset_coRestitution(this.__wbg_ptr, e51);
  }
  coRotationWrtParent(e51) {
    return K.rawcolliderset_coRotationWrtParent(this.__wbg_ptr, e51);
  }
  coRotation(e51) {
    return K.rawcolliderset_coRotation(this.__wbg_ptr, e51);
  }
  coRoundRadius(e51) {
    let t2 = K.rawcolliderset_coRoundRadius(this.__wbg_ptr, e51);
    return t2 === 2 ** 53 - 1 ? void 0 : t2;
  }
  coSetActiveCollisionTypes(e51, t2) {
    K.rawcolliderset_coSetActiveCollisionTypes(this.__wbg_ptr, e51, t2);
  }
  coSetActiveEvents(e51, t2) {
    K.rawcolliderset_coSetActiveEvents(this.__wbg_ptr, e51, t2);
  }
  coSetActiveHooks(e51, t2) {
    K.rawcolliderset_coSetActiveHooks(this.__wbg_ptr, e51, t2);
  }
  coSetCollisionGroups(e51, t2) {
    K.rawcolliderset_coSetCollisionGroups(this.__wbg_ptr, e51, t2);
  }
  coSetContactForceEventThreshold(e51, t2) {
    K.rawcolliderset_coSetContactForceEventThreshold(this.__wbg_ptr, e51, t2);
  }
  coSetContactSkin(e51, t2) {
    K.rawcolliderset_coSetContactSkin(this.__wbg_ptr, e51, t2);
  }
  coSetDensity(e51, t2) {
    K.rawcolliderset_coSetDensity(this.__wbg_ptr, e51, t2);
  }
  coSetEnabled(e51, t2) {
    K.rawcolliderset_coSetEnabled(this.__wbg_ptr, e51, t2);
  }
  coSetFrictionCombineRule(e51, t2) {
    K.rawcolliderset_coSetFrictionCombineRule(this.__wbg_ptr, e51, t2);
  }
  coSetFriction(e51, t2) {
    K.rawcolliderset_coSetFriction(this.__wbg_ptr, e51, t2);
  }
  coSetHalfExtents(e51, t2) {
    P(t2, M), K.rawcolliderset_coSetHalfExtents(this.__wbg_ptr, e51, t2.__wbg_ptr);
  }
  coSetHalfHeight(e51, t2) {
    K.rawcolliderset_coSetHalfHeight(this.__wbg_ptr, e51, t2);
  }
  coSetMassProperties(e51, t2, n2, r2) {
    P(n2, M), K.rawcolliderset_coSetMassProperties(this.__wbg_ptr, e51, t2, n2.__wbg_ptr, r2);
  }
  coSetMass(e51, t2) {
    K.rawcolliderset_coSetMass(this.__wbg_ptr, e51, t2);
  }
  coSetRadius(e51, t2) {
    K.rawcolliderset_coSetRadius(this.__wbg_ptr, e51, t2);
  }
  coSetRestitutionCombineRule(e51, t2) {
    K.rawcolliderset_coSetRestitutionCombineRule(this.__wbg_ptr, e51, t2);
  }
  coSetRestitution(e51, t2) {
    K.rawcolliderset_coSetRestitution(this.__wbg_ptr, e51, t2);
  }
  coSetRotationWrtParent(e51, t2) {
    K.rawcolliderset_coSetRotationWrtParent(this.__wbg_ptr, e51, t2);
  }
  coSetRotation(e51, t2) {
    K.rawcolliderset_coSetRotation(this.__wbg_ptr, e51, t2);
  }
  coSetRoundRadius(e51, t2) {
    K.rawcolliderset_coSetRoundRadius(this.__wbg_ptr, e51, t2);
  }
  coSetSensor(e51, t2) {
    K.rawcolliderset_coSetSensor(this.__wbg_ptr, e51, t2);
  }
  coSetShape(e51, t2) {
    P(t2, D), K.rawcolliderset_coSetShape(this.__wbg_ptr, e51, t2.__wbg_ptr);
  }
  coSetSolverGroups(e51, t2) {
    K.rawcolliderset_coSetSolverGroups(this.__wbg_ptr, e51, t2);
  }
  coSetTranslationWrtParent(e51, t2, n2) {
    K.rawcolliderset_coSetTranslationWrtParent(this.__wbg_ptr, e51, t2, n2);
  }
  coSetTranslation(e51, t2, n2) {
    K.rawcolliderset_coSetTranslation(this.__wbg_ptr, e51, t2, n2);
  }
  coSetVoxel(e51, t2, n2, r2) {
    K.rawcolliderset_coSetVoxel(this.__wbg_ptr, e51, t2, n2, r2);
  }
  coShapeType(e51) {
    return K.rawcolliderset_coShapeType(this.__wbg_ptr, e51);
  }
  coShape(e51) {
    let t2 = K.rawcolliderset_coShape(this.__wbg_ptr, e51);
    return D.__wrap(t2);
  }
  coSoftBody(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawcolliderset_coSoftBody(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getFloat64(r2 + 8, true);
      return t2 === 0 ? void 0 : n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coSolverGroups(e51) {
    return K.rawcolliderset_coSolverGroups(this.__wbg_ptr, e51) >>> 0;
  }
  coTranslationWrtParent(e51, t2) {
    try {
      return K.rawcolliderset_coTranslationWrtParent(this.__wbg_ptr, e51, F(t2)) !== 0;
    } finally {
      B[W++] = void 0;
    }
  }
  coTranslation(e51, t2) {
    try {
      K.rawcolliderset_coTranslation(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  coTriMeshFlags(e51) {
    let t2 = K.rawcolliderset_coTriMeshFlags(this.__wbg_ptr, e51);
    return t2 === 2 ** 53 - 1 ? void 0 : t2;
  }
  coVertices(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawcolliderset_coVertices(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getInt32(r2 + 4, true);
      let i2;
      return t2 !== 0 && (i2 = I(t2, n2).slice(), K.__wbindgen_export2(t2, n2 * 4, 4)), i2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coVolume(e51) {
    return K.rawcolliderset_coVolume(this.__wbg_ptr, e51);
  }
  coVoxelData(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawcolliderset_coVoxelData(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getInt32(r2 + 4, true);
      let i2;
      return t2 !== 0 && (i2 = At(t2, n2).slice(), K.__wbindgen_export2(t2, n2 * 4, 4)), i2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  coVoxelSize(e51) {
    let t2 = K.rawcolliderset_coVoxelSize(this.__wbg_ptr, e51);
    return t2 === 0 ? void 0 : M.__wrap(t2);
  }
  contains(e51) {
    return K.rawcolliderset_contains(this.__wbg_ptr, e51) !== 0;
  }
  createCollider(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2, m2, h2, g2, _2, v2, y2, b2, x2, ee2, S2) {
    try {
      let w2 = K.__wbindgen_add_to_stack_pointer(-16);
      P(t2, D), P(n2, M), P(r2, E), P(o2, M), P(S2, T), K.rawcolliderset_createCollider(w2, this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2, a2, o2.__wbg_ptr, s2, c2, l2, u2, d2, f2, p2, m2, h2, g2, _2, v2, y2, b2, x2, ee2, S2.__wbg_ptr);
      var C2 = R().getInt32(w2 + 0, true), te2 = R().getFloat64(w2 + 8, true);
      return C2 === 0 ? void 0 : te2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  createDeformableCollider(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2, m2, h2, g2, _2, v2, y2, b2, x2, ee2, S2, C2, te2, w2, ne2) {
    try {
      let ae2 = K.__wbindgen_add_to_stack_pointer(-16);
      P(t2, D), P(n2, M), P(r2, E), P(o2, M);
      let oe2 = H(ee2, K.__wbindgen_export3), se2 = G;
      P(w2, T), P(ne2, j), K.rawcolliderset_createDeformableCollider(ae2, this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2, a2, o2.__wbg_ptr, s2, c2, l2, u2, d2, f2, p2, m2, h2, g2, _2, v2, y2, b2, x2, oe2, se2, S2, C2, te2, w2.__wbg_ptr, ne2.__wbg_ptr);
      var re2 = R().getInt32(ae2 + 0, true), ie2 = R().getFloat64(ae2 + 8, true);
      return re2 === 0 ? void 0 : ie2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  forEachColliderHandle(e51) {
    try {
      K.rawcolliderset_forEachColliderHandle(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  isHandleValid(e51) {
    return K.rawcolliderset_isHandleValid(this.__wbg_ptr, e51) !== 0;
  }
  len() {
    return K.rawcolliderset_len(this.__wbg_ptr) >>> 0;
  }
  constructor() {
    let e51 = K.rawcolliderset_new();
    return this.__wbg_ptr = e51, qe.register(this, this.__wbg_ptr, this), this;
  }
  remove(e51, t2, n2, r2, i2) {
    P(t2, y), P(n2, T), P(r2, j), K.rawcolliderset_remove(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2);
  }
};
Symbol.dispose && (c.prototype[Symbol.dispose] = c.prototype.free);
var l = class e4 {
  static __wrap(t2) {
    let n2 = Object.create(e4.prototype);
    return n2.__wbg_ptr = t2, Je.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Je.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawcollidershapecasthit_free(e51, 0);
  }
  colliderHandle() {
    return K.rawcollidershapecasthit_colliderHandle(this.__wbg_ptr);
  }
  getComponents(e51) {
    try {
      K.rawcollidershapecasthit_getComponents(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
};
Symbol.dispose && (l.prototype[Symbol.dispose] = l.prototype.free);
var u = class e5 {
  static __wrap(t2) {
    let n2 = Object.create(e5.prototype);
    return n2.__wbg_ptr = t2, Ye.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ye.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawcontactforceevent_free(e51, 0);
  }
  collider1() {
    return K.rawcontactforceevent_collider1(this.__wbg_ptr);
  }
  collider2() {
    return K.rawcontactforceevent_collider2(this.__wbg_ptr);
  }
  max_force_direction(e51) {
    try {
      K.rawcontactforceevent_max_force_direction(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  max_force_magnitude() {
    return K.rawcontactforceevent_max_force_magnitude(this.__wbg_ptr);
  }
  total_force(e51) {
    try {
      K.rawcontactforceevent_total_force(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  total_force_magnitude() {
    return K.rawcontactforceevent_total_force_magnitude(this.__wbg_ptr);
  }
};
Symbol.dispose && (u.prototype[Symbol.dispose] = u.prototype.free);
var d = class e6 {
  static __wrap(t2) {
    let n2 = Object.create(e6.prototype);
    return n2.__wbg_ptr = t2, Xe.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Xe.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawcontactmanifold_free(e51, 0);
  }
  contact_dist(e51) {
    return K.rawcontactmanifold_contact_dist(this.__wbg_ptr, e51);
  }
  contact_fid1(e51) {
    return K.rawcontactmanifold_contact_fid1(this.__wbg_ptr, e51) >>> 0;
  }
  contact_fid2(e51) {
    return K.rawcontactmanifold_contact_fid2(this.__wbg_ptr, e51) >>> 0;
  }
  contact_impulse(e51) {
    return K.rawcontactmanifold_contact_impulse(this.__wbg_ptr, e51);
  }
  contact_local_p1(e51, t2) {
    try {
      return K.rawcontactmanifold_contact_local_p1(this.__wbg_ptr, e51, F(t2)) !== 0;
    } finally {
      B[W++] = void 0;
    }
  }
  contact_local_p2(e51, t2) {
    try {
      return K.rawcontactmanifold_contact_local_p2(this.__wbg_ptr, e51, F(t2)) !== 0;
    } finally {
      B[W++] = void 0;
    }
  }
  contact_tangent_impulse(e51) {
    return K.rawcontactmanifold_contact_tangent_impulse(this.__wbg_ptr, e51);
  }
  friction() {
    return K.rawcontactmanifold_friction(this.__wbg_ptr);
  }
  local_n1(e51) {
    try {
      K.rawcontactmanifold_local_n1(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  local_n2(e51) {
    try {
      K.rawcontactmanifold_local_n2(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  normal(e51) {
    try {
      K.rawcontactmanifold_normal(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  num_contacts() {
    return K.rawcontactmanifold_num_contacts(this.__wbg_ptr) >>> 0;
  }
  num_solver_contacts() {
    return K.rawcontactmanifold_num_solver_contacts(this.__wbg_ptr) >>> 0;
  }
  restitution() {
    return K.rawcontactmanifold_restitution(this.__wbg_ptr);
  }
  solver_contact_dist(e51) {
    return K.rawcontactmanifold_solver_contact_dist(this.__wbg_ptr, e51);
  }
  solver_contact_point(e51, t2, n2) {
    try {
      return P(e51, T), K.rawcontactmanifold_solver_contact_point(this.__wbg_ptr, e51.__wbg_ptr, t2, F(n2)) !== 0;
    } finally {
      B[W++] = void 0;
    }
  }
  solver_contact_tangent_velocity(e51, t2) {
    try {
      K.rawcontactmanifold_solver_contact_tangent_velocity(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  subshape1() {
    return K.rawcontactmanifold_subshape1(this.__wbg_ptr) >>> 0;
  }
  subshape2() {
    return K.rawcontactmanifold_subshape2(this.__wbg_ptr) >>> 0;
  }
};
Symbol.dispose && (d.prototype[Symbol.dispose] = d.prototype.free);
var f = class e7 {
  static __wrap(t2) {
    let n2 = Object.create(e7.prototype);
    return n2.__wbg_ptr = t2, Ze.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ze.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawcontactpair_free(e51, 0);
  }
  collider1() {
    return K.rawcontactpair_collider1(this.__wbg_ptr);
  }
  collider2() {
    return K.rawcontactpair_collider2(this.__wbg_ptr);
  }
  contactManifold(e51) {
    let t2 = K.rawcontactpair_contactManifold(this.__wbg_ptr, e51);
    return t2 === 0 ? void 0 : d.__wrap(t2);
  }
  numContactManifolds() {
    return K.rawcontactpair_numContactManifolds(this.__wbg_ptr) >>> 0;
  }
};
Symbol.dispose && (f.prototype[Symbol.dispose] = f.prototype.free);
var p = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Qe.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawdebugrenderpipeline_free(e51, 0);
  }
  colors() {
    return qt(K.rawdebugrenderpipeline_colors(this.__wbg_ptr));
  }
  constructor() {
    let e51 = K.rawdebugrenderpipeline_new();
    return this.__wbg_ptr = e51, Qe.register(this, this.__wbg_ptr, this), this;
  }
  render(e51, t2, n2, r2, i2, a2, o2, s2) {
    try {
      P(e51, T), P(t2, c), P(n2, j), P(r2, _), P(i2, S), P(a2, C), K.rawdebugrenderpipeline_render(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2, F(s2));
    } finally {
      B[W++] = void 0;
    }
  }
  vertices() {
    return qt(K.rawdebugrenderpipeline_vertices(this.__wbg_ptr));
  }
};
Symbol.dispose && (p.prototype[Symbol.dispose] = p.prototype.free);
var m = class e8 {
  static __wrap(t2) {
    let n2 = Object.create(e8.prototype);
    return n2.__wbg_ptr = t2, $e.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, $e.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawdeserializedworld_free(e51, 0);
  }
  takeBodies() {
    let e51 = K.rawdeserializedworld_takeBodies(this.__wbg_ptr);
    return e51 === 0 ? void 0 : T.__wrap(e51);
  }
  takeBroadPhase() {
    let e51 = K.rawdeserializedworld_takeBroadPhase(this.__wbg_ptr);
    return e51 === 0 ? void 0 : a.__wrap(e51);
  }
  takeColliders() {
    let e51 = K.rawdeserializedworld_takeColliders(this.__wbg_ptr);
    return e51 === 0 ? void 0 : c.__wrap(e51);
  }
  takeGravity() {
    let e51 = K.rawdeserializedworld_takeGravity(this.__wbg_ptr);
    return e51 === 0 ? void 0 : M.__wrap(e51);
  }
  takeImpulseJoints() {
    let e51 = K.rawdeserializedworld_takeImpulseJoints(this.__wbg_ptr);
    return e51 === 0 ? void 0 : _.__wrap(e51);
  }
  takeIntegrationParameters() {
    let e51 = K.rawdeserializedworld_takeIntegrationParameters(this.__wbg_ptr);
    return e51 === 0 ? void 0 : v.__wrap(e51);
  }
  takeIslandManager() {
    let e51 = K.rawdeserializedworld_takeIslandManager(this.__wbg_ptr);
    return e51 === 0 ? void 0 : y.__wrap(e51);
  }
  takeMultibodyJoints() {
    let e51 = K.rawdeserializedworld_takeMultibodyJoints(this.__wbg_ptr);
    return e51 === 0 ? void 0 : S.__wrap(e51);
  }
  takeNarrowPhase() {
    let e51 = K.rawdeserializedworld_takeNarrowPhase(this.__wbg_ptr);
    return e51 === 0 ? void 0 : C.__wrap(e51);
  }
  takeSoftBodies() {
    let e51 = K.rawdeserializedworld_takeSoftBodies(this.__wbg_ptr);
    return e51 === 0 ? void 0 : j.__wrap(e51);
  }
};
Symbol.dispose && (m.prototype[Symbol.dispose] = m.prototype.free);
var h = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, et.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_raweventqueue_free(e51, 0);
  }
  clear() {
    K.raweventqueue_clear(this.__wbg_ptr);
  }
  drainCollisionEvents(e51) {
    try {
      K.raweventqueue_drainCollisionEvents(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  drainContactForceEvents(e51) {
    try {
      K.raweventqueue_drainContactForceEvents(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  drainSoftBodyTearEvents(e51) {
    try {
      K.raweventqueue_drainSoftBodyTearEvents(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  constructor(e51) {
    let t2 = K.raweventqueue_new(e51);
    return this.__wbg_ptr = t2, et.register(this, this.__wbg_ptr, this), this;
  }
};
Symbol.dispose && (h.prototype[Symbol.dispose] = h.prototype.free), Object.freeze({ Vertex: 0, 0: `Vertex`, Face: 1, 1: `Face`, Unknown: 2, 2: `Unknown` });
var g = class e9 {
  static __wrap(t2) {
    let n2 = Object.create(e9.prototype);
    return n2.__wbg_ptr = t2, tt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, tt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawgenericjoint_free(e51, 0);
  }
  static fixed(t2, n2, r2, i2) {
    P(t2, M), P(n2, E), P(r2, M), P(i2, E);
    let a2 = K.rawgenericjoint_fixed(t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr);
    return e9.__wrap(a2);
  }
  static prismatic(t2, n2, r2, i2, a2, o2) {
    P(t2, M), P(n2, M), P(r2, M);
    let s2 = K.rawgenericjoint_prismatic(t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2, a2, o2);
    return s2 === 0 ? void 0 : e9.__wrap(s2);
  }
  static revolute(t2, n2) {
    P(t2, M), P(n2, M);
    let r2 = K.rawgenericjoint_revolute(t2.__wbg_ptr, n2.__wbg_ptr);
    return r2 === 0 ? void 0 : e9.__wrap(r2);
  }
  static rope(t2, n2, r2) {
    P(n2, M), P(r2, M);
    let i2 = K.rawgenericjoint_rope(t2, n2.__wbg_ptr, r2.__wbg_ptr);
    return e9.__wrap(i2);
  }
  static spring(t2, n2, r2, i2, a2) {
    P(i2, M), P(a2, M);
    let o2 = K.rawgenericjoint_spring(t2, n2, r2, i2.__wbg_ptr, a2.__wbg_ptr);
    return e9.__wrap(o2);
  }
};
Symbol.dispose && (g.prototype[Symbol.dispose] = g.prototype.free);
var _ = class e10 {
  static __wrap(t2) {
    let n2 = Object.create(e10.prototype);
    return n2.__wbg_ptr = t2, nt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, nt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawimpulsejointset_free(e51, 0);
  }
  contains(e51) {
    return K.rawimpulsejointset_contains(this.__wbg_ptr, e51) !== 0;
  }
  createJoint(e51, t2, n2, r2) {
    return P(e51, g), K.rawimpulsejointset_createJoint(this.__wbg_ptr, e51.__wbg_ptr, t2, n2, r2);
  }
  forEachJointAttachedToRigidBody(e51, t2) {
    try {
      K.rawimpulsejointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  forEachJointHandle(e51) {
    try {
      K.rawimpulsejointset_forEachJointHandle(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  jointAnchor1(e51, t2) {
    try {
      K.rawimpulsejointset_jointAnchor1(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  jointAnchor2(e51, t2) {
    try {
      K.rawimpulsejointset_jointAnchor2(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  jointBodyHandle1(e51) {
    return K.rawimpulsejointset_jointBodyHandle1(this.__wbg_ptr, e51);
  }
  jointBodyHandle2(e51) {
    return K.rawimpulsejointset_jointBodyHandle2(this.__wbg_ptr, e51);
  }
  jointConfigureMotorModel(e51, t2, n2) {
    K.rawimpulsejointset_jointConfigureMotorModel(this.__wbg_ptr, e51, t2, n2);
  }
  jointConfigureMotorPosition(e51, t2, n2, r2, i2) {
    K.rawimpulsejointset_jointConfigureMotorPosition(this.__wbg_ptr, e51, t2, n2, r2, i2);
  }
  jointConfigureMotorVelocity(e51, t2, n2, r2) {
    K.rawimpulsejointset_jointConfigureMotorVelocity(this.__wbg_ptr, e51, t2, n2, r2);
  }
  jointConfigureMotor(e51, t2, n2, r2, i2, a2) {
    K.rawimpulsejointset_jointConfigureMotor(this.__wbg_ptr, e51, t2, n2, r2, i2, a2);
  }
  jointContactsEnabled(e51) {
    return K.rawimpulsejointset_jointContactsEnabled(this.__wbg_ptr, e51) !== 0;
  }
  jointLimitsEnabled(e51, t2) {
    return K.rawimpulsejointset_jointLimitsEnabled(this.__wbg_ptr, e51, t2) !== 0;
  }
  jointLimitsMax(e51, t2) {
    return K.rawimpulsejointset_jointLimitsMax(this.__wbg_ptr, e51, t2);
  }
  jointLimitsMin(e51, t2) {
    return K.rawimpulsejointset_jointLimitsMin(this.__wbg_ptr, e51, t2);
  }
  jointSetAnchor1(e51, t2) {
    P(t2, M), K.rawimpulsejointset_jointSetAnchor1(this.__wbg_ptr, e51, t2.__wbg_ptr);
  }
  jointSetAnchor2(e51, t2) {
    P(t2, M), K.rawimpulsejointset_jointSetAnchor2(this.__wbg_ptr, e51, t2.__wbg_ptr);
  }
  jointSetContactsEnabled(e51, t2) {
    K.rawimpulsejointset_jointSetContactsEnabled(this.__wbg_ptr, e51, t2);
  }
  jointSetFrameX1(e51, t2) {
    P(t2, E), K.rawimpulsejointset_jointSetFrameX1(this.__wbg_ptr, e51, t2.__wbg_ptr);
  }
  jointSetFrameX2(e51, t2) {
    P(t2, E), K.rawimpulsejointset_jointSetFrameX2(this.__wbg_ptr, e51, t2.__wbg_ptr);
  }
  jointSetLimits(e51, t2, n2, r2) {
    K.rawimpulsejointset_jointSetLimits(this.__wbg_ptr, e51, t2, n2, r2);
  }
  jointSetLocalFrame1(e51, t2, n2) {
    P(t2, M), P(n2, E), K.rawimpulsejointset_jointSetLocalFrame1(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr);
  }
  jointSetLocalFrame2(e51, t2, n2) {
    P(t2, M), P(n2, E), K.rawimpulsejointset_jointSetLocalFrame2(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr);
  }
  jointSetMotorMaxForce(e51, t2, n2) {
    K.rawimpulsejointset_jointSetMotorMaxForce(this.__wbg_ptr, e51, t2, n2);
  }
  jointType(e51) {
    return K.rawimpulsejointset_jointType(this.__wbg_ptr, e51);
  }
  len() {
    return K.rawimpulsejointset_len(this.__wbg_ptr) >>> 0;
  }
  constructor() {
    let e51 = K.rawimpulsejointset_new();
    return this.__wbg_ptr = e51, nt.register(this, this.__wbg_ptr, this), this;
  }
  remove(e51, t2) {
    K.rawimpulsejointset_remove(this.__wbg_ptr, e51, t2);
  }
};
Symbol.dispose && (_.prototype[Symbol.dispose] = _.prototype.free);
var v = class e11 {
  static __wrap(t2) {
    let n2 = Object.create(e11.prototype);
    return n2.__wbg_ptr = t2, rt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, rt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawintegrationparameters_free(e51, 0);
  }
  get contact_erp() {
    return K.rawintegrationparameters_contact_erp(this.__wbg_ptr);
  }
  get dt() {
    return K.rawintegrationparameters_dt(this.__wbg_ptr);
  }
  get lengthUnit() {
    return K.rawintegrationparameters_lengthUnit(this.__wbg_ptr);
  }
  get maxCcdSubsteps() {
    return K.rawintegrationparameters_maxCcdSubsteps(this.__wbg_ptr) >>> 0;
  }
  constructor() {
    let e51 = K.rawintegrationparameters_new();
    return this.__wbg_ptr = e51, rt.register(this, this.__wbg_ptr, this), this;
  }
  get normalizedAllowedLinearError() {
    return K.rawintegrationparameters_normalizedAllowedLinearError(this.__wbg_ptr);
  }
  get normalizedPredictionDistance() {
    return K.rawintegrationparameters_normalizedPredictionDistance(this.__wbg_ptr);
  }
  get numInternalPgsIterations() {
    return K.rawintegrationparameters_numInternalPgsIterations(this.__wbg_ptr) >>> 0;
  }
  get numSolverIterations() {
    return K.rawintegrationparameters_numSolverIterations(this.__wbg_ptr) >>> 0;
  }
  set contact_natural_frequency(e51) {
    K.rawintegrationparameters_set_contact_natural_frequency(this.__wbg_ptr, e51);
  }
  set dt(e51) {
    K.rawintegrationparameters_set_dt(this.__wbg_ptr, e51);
  }
  set lengthUnit(e51) {
    K.rawintegrationparameters_set_lengthUnit(this.__wbg_ptr, e51);
  }
  set maxCcdSubsteps(e51) {
    K.rawintegrationparameters_set_maxCcdSubsteps(this.__wbg_ptr, e51);
  }
  set normalizedAllowedLinearError(e51) {
    K.rawintegrationparameters_set_normalizedAllowedLinearError(this.__wbg_ptr, e51);
  }
  set normalizedPredictionDistance(e51) {
    K.rawintegrationparameters_set_normalizedPredictionDistance(this.__wbg_ptr, e51);
  }
  set numInternalPgsIterations(e51) {
    K.rawintegrationparameters_set_numInternalPgsIterations(this.__wbg_ptr, e51);
  }
  set numSolverIterations(e51) {
    K.rawintegrationparameters_set_numSolverIterations(this.__wbg_ptr, e51);
  }
  set softBodiesContactStiffening(e51) {
    K.rawintegrationparameters_set_softBodiesContactStiffening(this.__wbg_ptr, e51);
  }
  set softBodiesFemLinearTolerance(e51) {
    K.rawintegrationparameters_set_softBodiesFemLinearTolerance(this.__wbg_ptr, e51);
  }
  set softBodiesFemMaxDenseDofs(e51) {
    K.rawintegrationparameters_set_softBodiesFemMaxDenseDofs(this.__wbg_ptr, e51);
  }
  set softBodiesFemMaxLinearIterations(e51) {
    K.rawintegrationparameters_set_softBodiesFemMaxLinearIterations(this.__wbg_ptr, e51);
  }
  set softBodiesMaxExtraSubsteps(e51) {
    K.rawintegrationparameters_set_softBodiesMaxExtraSubsteps(this.__wbg_ptr, e51);
  }
  set softBodiesRecovery(e51) {
    P(e51, de), K.rawintegrationparameters_set_softBodiesRecovery(this.__wbg_ptr, e51.__wbg_ptr);
  }
  set softBodiesResweepStrain(e51) {
    K.rawintegrationparameters_set_softBodiesResweepStrain(this.__wbg_ptr, e51);
  }
  get softBodiesContactStiffening() {
    return K.rawintegrationparameters_softBodiesContactStiffening(this.__wbg_ptr);
  }
  get softBodiesFemLinearTolerance() {
    return K.rawintegrationparameters_softBodiesFemLinearTolerance(this.__wbg_ptr);
  }
  get softBodiesFemMaxDenseDofs() {
    return K.rawintegrationparameters_softBodiesFemMaxDenseDofs(this.__wbg_ptr) >>> 0;
  }
  get softBodiesFemMaxLinearIterations() {
    return K.rawintegrationparameters_softBodiesFemMaxLinearIterations(this.__wbg_ptr) >>> 0;
  }
  get softBodiesMaxExtraSubsteps() {
    return K.rawintegrationparameters_softBodiesMaxExtraSubsteps(this.__wbg_ptr) >>> 0;
  }
  get softBodiesRecovery() {
    let e51 = K.rawintegrationparameters_softBodiesRecovery(this.__wbg_ptr);
    return de.__wrap(e51);
  }
  get softBodiesResweepStrain() {
    return K.rawintegrationparameters_softBodiesResweepStrain(this.__wbg_ptr);
  }
};
Symbol.dispose && (v.prototype[Symbol.dispose] = v.prototype.free);
var y = class e12 {
  static __wrap(t2) {
    let n2 = Object.create(e12.prototype);
    return n2.__wbg_ptr = t2, it.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, it.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawislandmanager_free(e51, 0);
  }
  forEachActiveRigidBodyHandle(e51) {
    try {
      K.rawislandmanager_forEachActiveRigidBodyHandle(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  constructor() {
    let e51 = K.rawislandmanager_new();
    return this.__wbg_ptr = e51, it.register(this, this.__wbg_ptr, this), this;
  }
};
Symbol.dispose && (y.prototype[Symbol.dispose] = y.prototype.free);
var b = Object.freeze({ LinX: 0, 0: `LinX`, LinY: 1, 1: `LinY`, AngX: 2, 2: `AngX` }), x = Object.freeze({ Revolute: 0, 0: `Revolute`, Fixed: 1, 1: `Fixed`, Prismatic: 2, 2: `Prismatic`, Rope: 3, 3: `Rope`, Spring: 4, 4: `Spring`, Generic: 5, 5: `Generic` }), ee = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, at.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawkinematiccharactercontroller_free(e51, 0);
  }
  autostepEnabled() {
    return K.rawkinematiccharactercontroller_autostepEnabled(this.__wbg_ptr) !== 0;
  }
  autostepIncludesDynamicBodies() {
    let e51 = K.rawkinematiccharactercontroller_autostepIncludesDynamicBodies(this.__wbg_ptr);
    return e51 === 16777215 ? void 0 : e51 !== 0;
  }
  autostepMaxHeight() {
    let e51 = K.rawkinematiccharactercontroller_autostepMaxHeight(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  autostepMinWidth() {
    let e51 = K.rawkinematiccharactercontroller_autostepMinWidth(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  computeColliderMovement(e51, t2, n2, r2, i2, o2, s2, l2, u2, d2, f2, p2) {
    try {
      P(t2, a), P(n2, C), P(r2, T), P(i2, c), P(s2, M), K.rawkinematiccharactercontroller_computeColliderMovement(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, o2, s2.__wbg_ptr, l2, V(u2) ? 2 ** 53 - 1 : Math.fround(u2), d2, V(f2) ? 2 ** 53 - 1 : f2 >>> 0, F(p2));
    } finally {
      B[W++] = void 0;
    }
  }
  computedCollision(e51, t2) {
    return P(t2, s), K.rawkinematiccharactercontroller_computedCollision(this.__wbg_ptr, e51, t2.__wbg_ptr) !== 0;
  }
  computedGrounded() {
    return K.rawkinematiccharactercontroller_computedGrounded(this.__wbg_ptr) !== 0;
  }
  computedMovement(e51) {
    try {
      K.rawkinematiccharactercontroller_computedMovement(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  disableAutostep() {
    K.rawkinematiccharactercontroller_disableAutostep(this.__wbg_ptr);
  }
  disableSnapToGround() {
    K.rawkinematiccharactercontroller_disableSnapToGround(this.__wbg_ptr);
  }
  enableAutostep(e51, t2, n2) {
    K.rawkinematiccharactercontroller_enableAutostep(this.__wbg_ptr, e51, t2, n2);
  }
  enableSnapToGround(e51) {
    K.rawkinematiccharactercontroller_enableSnapToGround(this.__wbg_ptr, e51);
  }
  maxSlopeClimbAngle() {
    return K.rawkinematiccharactercontroller_maxSlopeClimbAngle(this.__wbg_ptr);
  }
  minSlopeSlideAngle() {
    return K.rawkinematiccharactercontroller_minSlopeSlideAngle(this.__wbg_ptr);
  }
  constructor(e51) {
    let t2 = K.rawkinematiccharactercontroller_new(e51);
    return this.__wbg_ptr = t2, at.register(this, this.__wbg_ptr, this), this;
  }
  normalNudgeFactor() {
    return K.rawkinematiccharactercontroller_normalNudgeFactor(this.__wbg_ptr);
  }
  numComputedCollisions() {
    return K.rawkinematiccharactercontroller_numComputedCollisions(this.__wbg_ptr) >>> 0;
  }
  offset() {
    return K.rawkinematiccharactercontroller_offset(this.__wbg_ptr);
  }
  setMaxSlopeClimbAngle(e51) {
    K.rawkinematiccharactercontroller_setMaxSlopeClimbAngle(this.__wbg_ptr, e51);
  }
  setMinSlopeSlideAngle(e51) {
    K.rawkinematiccharactercontroller_setMinSlopeSlideAngle(this.__wbg_ptr, e51);
  }
  setNormalNudgeFactor(e51) {
    K.rawkinematiccharactercontroller_setNormalNudgeFactor(this.__wbg_ptr, e51);
  }
  setOffset(e51) {
    K.rawkinematiccharactercontroller_setOffset(this.__wbg_ptr, e51);
  }
  setSlideEnabled(e51) {
    K.rawkinematiccharactercontroller_setSlideEnabled(this.__wbg_ptr, e51);
  }
  setUp(e51) {
    P(e51, M), K.rawkinematiccharactercontroller_setUp(this.__wbg_ptr, e51.__wbg_ptr);
  }
  slideEnabled() {
    return K.rawkinematiccharactercontroller_slideEnabled(this.__wbg_ptr) !== 0;
  }
  snapToGroundDistance() {
    let e51 = K.rawkinematiccharactercontroller_snapToGroundDistance(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  snapToGroundEnabled() {
    return K.rawkinematiccharactercontroller_snapToGroundEnabled(this.__wbg_ptr) !== 0;
  }
  up() {
    let e51 = K.rawkinematiccharactercontroller_up(this.__wbg_ptr);
    return M.__wrap(e51);
  }
};
Symbol.dispose && (ee.prototype[Symbol.dispose] = ee.prototype.free), Object.freeze({ AccelerationBased: 0, 0: `AccelerationBased`, ForceBased: 1, 1: `ForceBased` });
var S = class e13 {
  static __wrap(t2) {
    let n2 = Object.create(e13.prototype);
    return n2.__wbg_ptr = t2, ot.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ot.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawmultibodyjointset_free(e51, 0);
  }
  contains(e51) {
    return K.rawmultibodyjointset_contains(this.__wbg_ptr, e51) !== 0;
  }
  createJoint(e51, t2, n2, r2) {
    return P(e51, g), K.rawmultibodyjointset_createJoint(this.__wbg_ptr, e51.__wbg_ptr, t2, n2, r2);
  }
  forEachJointAttachedToRigidBody(e51, t2) {
    try {
      K.rawmultibodyjointset_forEachJointAttachedToRigidBody(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  forEachJointHandle(e51) {
    try {
      K.rawmultibodyjointset_forEachJointHandle(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  jointAnchor1(e51) {
    let t2 = K.rawmultibodyjointset_jointAnchor1(this.__wbg_ptr, e51);
    return M.__wrap(t2);
  }
  jointAnchor2(e51) {
    let t2 = K.rawmultibodyjointset_jointAnchor2(this.__wbg_ptr, e51);
    return M.__wrap(t2);
  }
  jointContactsEnabled(e51) {
    return K.rawmultibodyjointset_jointContactsEnabled(this.__wbg_ptr, e51) !== 0;
  }
  jointFrameX1(e51) {
    let t2 = K.rawmultibodyjointset_jointFrameX1(this.__wbg_ptr, e51);
    return E.__wrap(t2);
  }
  jointFrameX2(e51) {
    let t2 = K.rawmultibodyjointset_jointFrameX2(this.__wbg_ptr, e51);
    return E.__wrap(t2);
  }
  jointLimitsEnabled(e51, t2) {
    return K.rawmultibodyjointset_jointLimitsEnabled(this.__wbg_ptr, e51, t2) !== 0;
  }
  jointLimitsMax(e51, t2) {
    return K.rawmultibodyjointset_jointLimitsMax(this.__wbg_ptr, e51, t2);
  }
  jointLimitsMin(e51, t2) {
    return K.rawmultibodyjointset_jointLimitsMin(this.__wbg_ptr, e51, t2);
  }
  jointSetContactsEnabled(e51, t2) {
    K.rawmultibodyjointset_jointSetContactsEnabled(this.__wbg_ptr, e51, t2);
  }
  jointType(e51) {
    return K.rawmultibodyjointset_jointType(this.__wbg_ptr, e51);
  }
  constructor() {
    let e51 = K.rawmultibodyjointset_new();
    return this.__wbg_ptr = e51, ot.register(this, this.__wbg_ptr, this), this;
  }
  remove(e51, t2) {
    K.rawmultibodyjointset_remove(this.__wbg_ptr, e51, t2);
  }
};
Symbol.dispose && (S.prototype[Symbol.dispose] = S.prototype.free);
var C = class e14 {
  static __wrap(t2) {
    let n2 = Object.create(e14.prototype);
    return n2.__wbg_ptr = t2, st.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, st.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawnarrowphase_free(e51, 0);
  }
  contact_pair(e51, t2) {
    let n2 = K.rawnarrowphase_contact_pair(this.__wbg_ptr, e51, t2);
    return n2 === 0 ? void 0 : f.__wrap(n2);
  }
  contact_pairs_with(e51, t2) {
    K.rawnarrowphase_contact_pairs_with(this.__wbg_ptr, e51, N(t2));
  }
  intersection_pair(e51, t2) {
    return K.rawnarrowphase_intersection_pair(this.__wbg_ptr, e51, t2) !== 0;
  }
  intersection_pairs_with(e51, t2) {
    K.rawnarrowphase_intersection_pairs_with(this.__wbg_ptr, e51, N(t2));
  }
  constructor() {
    let e51 = K.rawnarrowphase_new();
    return this.__wbg_ptr = e51, st.register(this, this.__wbg_ptr, this), this;
  }
};
Symbol.dispose && (C.prototype[Symbol.dispose] = C.prototype.free);
var te = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ct.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawphysicspipeline_free(e51, 0);
  }
  is_profiler_enabled() {
    return K.rawphysicspipeline_is_profiler_enabled(this.__wbg_ptr) !== 0;
  }
  constructor() {
    let e51 = K.rawphysicspipeline_new();
    return this.__wbg_ptr = e51, ct.register(this, this.__wbg_ptr, this), this;
  }
  set_profiler_enabled(e51) {
    K.rawphysicspipeline_set_profiler_enabled(this.__wbg_ptr, e51);
  }
  stepWithEvents(e51, t2, n2, r2, i2, s2, l2, u2, d2, f2, p2, m2, g2, b2, x2) {
    P(e51, M), P(t2, v), P(n2, y), P(r2, a), P(i2, C), P(s2, T), P(l2, c), P(u2, j), P(d2, _), P(f2, S), P(p2, o), P(m2, h), K.rawphysicspipeline_stepWithEvents(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, s2.__wbg_ptr, l2.__wbg_ptr, u2.__wbg_ptr, d2.__wbg_ptr, f2.__wbg_ptr, p2.__wbg_ptr, m2.__wbg_ptr, N(g2), N(b2), N(x2));
  }
  step(e51, t2, n2, r2, i2, s2, l2, u2, d2, f2, p2) {
    P(e51, M), P(t2, v), P(n2, y), P(r2, a), P(i2, C), P(s2, T), P(l2, c), P(u2, j), P(d2, _), P(f2, S), P(p2, o), K.rawphysicspipeline_step(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, s2.__wbg_ptr, l2.__wbg_ptr, u2.__wbg_ptr, d2.__wbg_ptr, f2.__wbg_ptr, p2.__wbg_ptr);
  }
  timing_broad_phase() {
    return K.rawphysicspipeline_timing_broad_phase(this.__wbg_ptr);
  }
  timing_ccd_broad_phase() {
    return K.rawphysicspipeline_timing_ccd_broad_phase(this.__wbg_ptr);
  }
  timing_ccd() {
    return K.rawphysicspipeline_timing_ccd(this.__wbg_ptr);
  }
  timing_ccd_narrow_phase() {
    return K.rawphysicspipeline_timing_ccd_narrow_phase(this.__wbg_ptr);
  }
  timing_ccd_solver() {
    return K.rawphysicspipeline_timing_ccd_solver(this.__wbg_ptr);
  }
  timing_ccd_toi_computation() {
    return K.rawphysicspipeline_timing_ccd_toi_computation(this.__wbg_ptr);
  }
  timing_collision_detection() {
    return K.rawphysicspipeline_timing_collision_detection(this.__wbg_ptr);
  }
  timing_island_construction() {
    return K.rawphysicspipeline_timing_island_construction(this.__wbg_ptr);
  }
  timing_narrow_phase() {
    return K.rawphysicspipeline_timing_narrow_phase(this.__wbg_ptr);
  }
  timing_solver() {
    return K.rawphysicspipeline_timing_solver(this.__wbg_ptr);
  }
  timing_step() {
    return K.rawphysicspipeline_timing_step(this.__wbg_ptr);
  }
  timing_user_changes() {
    return K.rawphysicspipeline_timing_user_changes(this.__wbg_ptr);
  }
  timing_velocity_assembly() {
    return K.rawphysicspipeline_timing_velocity_assembly(this.__wbg_ptr);
  }
  timing_velocity_resolution() {
    return K.rawphysicspipeline_timing_velocity_resolution(this.__wbg_ptr);
  }
  timing_velocity_update() {
    return K.rawphysicspipeline_timing_velocity_update(this.__wbg_ptr);
  }
  timing_velocity_writeback() {
    return K.rawphysicspipeline_timing_velocity_writeback(this.__wbg_ptr);
  }
};
Symbol.dispose && (te.prototype[Symbol.dispose] = te.prototype.free);
var w = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, lt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawpidcontroller_free(e51, 0);
  }
  angular_correction(e51, t2, n2, r2, i2) {
    return P(t2, T), K.rawpidcontroller_angular_correction(this.__wbg_ptr, e51, t2.__wbg_ptr, n2, r2, i2);
  }
  apply_angular_correction(e51, t2, n2, r2, i2) {
    P(t2, T), K.rawpidcontroller_apply_angular_correction(this.__wbg_ptr, e51, t2.__wbg_ptr, n2, r2, i2);
  }
  apply_linear_correction(e51, t2, n2, r2, i2) {
    P(t2, T), P(r2, M), P(i2, M), K.rawpidcontroller_apply_linear_correction(this.__wbg_ptr, e51, t2.__wbg_ptr, n2, r2.__wbg_ptr, i2.__wbg_ptr);
  }
  linear_correction(e51, t2, n2, r2, i2, a2) {
    try {
      P(t2, T), P(r2, M), P(i2, M), K.rawpidcontroller_linear_correction(this.__wbg_ptr, e51, t2.__wbg_ptr, n2, r2.__wbg_ptr, i2.__wbg_ptr, F(a2));
    } finally {
      B[W++] = void 0;
    }
  }
  constructor(e51, t2, n2, r2) {
    let i2 = K.rawpidcontroller_new(e51, t2, n2, r2);
    return this.__wbg_ptr = i2, lt.register(this, this.__wbg_ptr, this), this;
  }
  reset_integrals() {
    K.rawpidcontroller_reset_integrals(this.__wbg_ptr);
  }
  set_axes_mask(e51) {
    K.rawpidcontroller_set_axes_mask(this.__wbg_ptr, e51);
  }
  set_kd(e51, t2) {
    K.rawpidcontroller_set_kd(this.__wbg_ptr, e51, t2);
  }
  set_ki(e51, t2) {
    K.rawpidcontroller_set_ki(this.__wbg_ptr, e51, t2);
  }
  set_kp(e51, t2) {
    K.rawpidcontroller_set_kp(this.__wbg_ptr, e51, t2);
  }
};
Symbol.dispose && (w.prototype[Symbol.dispose] = w.prototype.free);
var ne = class e15 {
  static __wrap(t2) {
    let n2 = Object.create(e15.prototype);
    return n2.__wbg_ptr = t2, ut.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ut.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawpointcolliderprojection_free(e51, 0);
  }
  colliderHandle() {
    return K.rawpointcolliderprojection_colliderHandle(this.__wbg_ptr);
  }
  featureId() {
    let e51 = K.rawpointcolliderprojection_featureId(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  featureType() {
    return K.rawpointcolliderprojection_featureType(this.__wbg_ptr);
  }
  isInside() {
    return K.rawpointcolliderprojection_isInside(this.__wbg_ptr) !== 0;
  }
  point(e51) {
    try {
      K.rawpointcolliderprojection_point(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
};
Symbol.dispose && (ne.prototype[Symbol.dispose] = ne.prototype.free);
var re = class e16 {
  static __wrap(t2) {
    let n2 = Object.create(e16.prototype);
    return n2.__wbg_ptr = t2, dt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, dt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawpointprojection_free(e51, 0);
  }
  isInside() {
    return K.rawpointprojection_isInside(this.__wbg_ptr) !== 0;
  }
  point(e51) {
    try {
      K.rawpointprojection_point(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
};
Symbol.dispose && (re.prototype[Symbol.dispose] = re.prototype.free);
var ie = class e17 {
  static __wrap(t2) {
    let n2 = Object.create(e17.prototype);
    return n2.__wbg_ptr = t2, ft.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ft.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawraycolliderhit_free(e51, 0);
  }
  colliderHandle() {
    return K.rawraycolliderhit_colliderHandle(this.__wbg_ptr);
  }
  timeOfImpact() {
    return K.rawraycolliderhit_timeOfImpact(this.__wbg_ptr);
  }
};
Symbol.dispose && (ie.prototype[Symbol.dispose] = ie.prototype.free);
var ae = class e18 {
  static __wrap(t2) {
    let n2 = Object.create(e18.prototype);
    return n2.__wbg_ptr = t2, pt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, pt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawraycolliderintersection_free(e51, 0);
  }
  colliderHandle() {
    return K.rawraycolliderintersection_colliderHandle(this.__wbg_ptr);
  }
  featureId() {
    let e51 = K.rawraycolliderintersection_featureId(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  featureType() {
    return K.rawraycolliderintersection_featureType(this.__wbg_ptr);
  }
  normal(e51) {
    try {
      K.rawraycolliderintersection_normal(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  time_of_impact() {
    return K.rawraycolliderintersection_time_of_impact(this.__wbg_ptr);
  }
};
Symbol.dispose && (ae.prototype[Symbol.dispose] = ae.prototype.free);
var oe = class e19 {
  static __wrap(t2) {
    let n2 = Object.create(e19.prototype);
    return n2.__wbg_ptr = t2, mt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, mt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawrayintersection_free(e51, 0);
  }
  featureId() {
    let e51 = K.rawrayintersection_featureId(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  featureType() {
    return K.rawrayintersection_featureType(this.__wbg_ptr);
  }
  normal(e51) {
    try {
      K.rawrayintersection_normal(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  time_of_impact() {
    return K.rawrayintersection_time_of_impact(this.__wbg_ptr);
  }
};
Symbol.dispose && (oe.prototype[Symbol.dispose] = oe.prototype.free);
var T = class e20 {
  static __wrap(t2) {
    let n2 = Object.create(e20.prototype);
    return n2.__wbg_ptr = t2, ht.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, ht.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawrigidbodyset_free(e51, 0);
  }
  contains(e51) {
    return K.rawrigidbodyset_contains(this.__wbg_ptr, e51) !== 0;
  }
  createRigidBody(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2, m2, h2, g2, _2, v2, y2, b2, x2, ee2) {
    return P(t2, M), P(n2, E), P(o2, M), P(s2, M), K.rawrigidbodyset_createRigidBody(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2, i2, a2, o2.__wbg_ptr, s2.__wbg_ptr, c2, l2, u2, d2, f2, p2, m2, h2, g2, _2, v2, y2, b2, x2, ee2);
  }
  forEachRigidBodyHandle(e51) {
    try {
      K.rawrigidbodyset_forEachRigidBodyHandle(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  len() {
    return K.rawrigidbodyset_len(this.__wbg_ptr) >>> 0;
  }
  constructor() {
    let e51 = K.rawrigidbodyset_new();
    return this.__wbg_ptr = e51, ht.register(this, this.__wbg_ptr, this), this;
  }
  propagateModifiedBodyPositionsToColliders(e51) {
    P(e51, c), K.rawrigidbodyset_propagateModifiedBodyPositionsToColliders(this.__wbg_ptr, e51.__wbg_ptr);
  }
  rbAddForceAtPoint(e51, t2, n2, r2) {
    P(t2, M), P(n2, M), K.rawrigidbodyset_rbAddForceAtPoint(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2);
  }
  rbAddForce(e51, t2, n2) {
    P(t2, M), K.rawrigidbodyset_rbAddForce(this.__wbg_ptr, e51, t2.__wbg_ptr, n2);
  }
  rbAddTorque(e51, t2, n2) {
    K.rawrigidbodyset_rbAddTorque(this.__wbg_ptr, e51, t2, n2);
  }
  rbAdditionalPgsIterations(e51) {
    return K.rawrigidbodyset_rbAdditionalPgsIterations(this.__wbg_ptr, e51) >>> 0;
  }
  rbAdditionalSolverIterations(e51) {
    return K.rawrigidbodyset_rbAdditionalSolverIterations(this.__wbg_ptr, e51) >>> 0;
  }
  rbAngularDamping(e51) {
    return K.rawrigidbodyset_rbAngularDamping(this.__wbg_ptr, e51);
  }
  rbAngvel(e51) {
    return K.rawrigidbodyset_rbAngvel(this.__wbg_ptr, e51);
  }
  rbApplyImpulseAtPoint(e51, t2, n2, r2) {
    P(t2, M), P(n2, M), K.rawrigidbodyset_rbApplyImpulseAtPoint(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2);
  }
  rbApplyImpulse(e51, t2, n2) {
    P(t2, M), K.rawrigidbodyset_rbApplyImpulse(this.__wbg_ptr, e51, t2.__wbg_ptr, n2);
  }
  rbApplyTorqueImpulse(e51, t2, n2) {
    K.rawrigidbodyset_rbApplyTorqueImpulse(this.__wbg_ptr, e51, t2, n2);
  }
  rbBodyType(e51) {
    return K.rawrigidbodyset_rbBodyType(this.__wbg_ptr, e51);
  }
  rbCollider(e51, t2) {
    return K.rawrigidbodyset_rbCollider(this.__wbg_ptr, e51, t2);
  }
  rbDominanceGroup(e51) {
    return K.rawrigidbodyset_rbDominanceGroup(this.__wbg_ptr, e51);
  }
  rbEffectiveAngularInertia(e51) {
    return K.rawrigidbodyset_rbEffectiveAngularInertia(this.__wbg_ptr, e51);
  }
  rbEffectiveInvMass(e51, t2) {
    try {
      K.rawrigidbodyset_rbEffectiveInvMass(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  rbEffectiveWorldInvInertia(e51) {
    return K.rawrigidbodyset_rbEffectiveWorldInvInertia(this.__wbg_ptr, e51);
  }
  rbEnableCcd(e51, t2) {
    K.rawrigidbodyset_rbEnableCcd(this.__wbg_ptr, e51, t2);
  }
  rbGravityScale(e51) {
    return K.rawrigidbodyset_rbGravityScale(this.__wbg_ptr, e51);
  }
  rbInvMass(e51) {
    return K.rawrigidbodyset_rbInvMass(this.__wbg_ptr, e51);
  }
  rbInvPrincipalInertia(e51) {
    return K.rawrigidbodyset_rbInvPrincipalInertia(this.__wbg_ptr, e51);
  }
  rbIsCcdEnabled(e51) {
    return K.rawrigidbodyset_rbIsCcdEnabled(this.__wbg_ptr, e51) !== 0;
  }
  rbIsDynamic(e51) {
    return K.rawrigidbodyset_rbIsDynamic(this.__wbg_ptr, e51) !== 0;
  }
  rbIsEnabled(e51) {
    return K.rawrigidbodyset_rbIsEnabled(this.__wbg_ptr, e51) !== 0;
  }
  rbIsFixed(e51) {
    return K.rawrigidbodyset_rbIsFixed(this.__wbg_ptr, e51) !== 0;
  }
  rbIsKinematic(e51) {
    return K.rawrigidbodyset_rbIsKinematic(this.__wbg_ptr, e51) !== 0;
  }
  rbIsMoving(e51) {
    return K.rawrigidbodyset_rbIsMoving(this.__wbg_ptr, e51) !== 0;
  }
  rbIsSleeping(e51) {
    return K.rawrigidbodyset_rbIsSleeping(this.__wbg_ptr, e51) !== 0;
  }
  rbIsSoftFrame(e51) {
    return K.rawrigidbodyset_rbIsSoftFrame(this.__wbg_ptr, e51) !== 0;
  }
  rbLinearDamping(e51) {
    return K.rawrigidbodyset_rbLinearDamping(this.__wbg_ptr, e51);
  }
  rbLinvel(e51, t2) {
    try {
      K.rawrigidbodyset_rbLinvel(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  rbLocalCom(e51, t2) {
    try {
      K.rawrigidbodyset_rbLocalCom(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  rbLockRotations(e51, t2, n2) {
    K.rawrigidbodyset_rbLockRotations(this.__wbg_ptr, e51, t2, n2);
  }
  rbLockTranslations(e51, t2, n2) {
    K.rawrigidbodyset_rbLockTranslations(this.__wbg_ptr, e51, t2, n2);
  }
  rbMass(e51) {
    return K.rawrigidbodyset_rbMass(this.__wbg_ptr, e51);
  }
  rbNextRotation(e51) {
    return K.rawrigidbodyset_rbNextRotation(this.__wbg_ptr, e51);
  }
  rbNextTranslation(e51, t2) {
    try {
      K.rawrigidbodyset_rbNextTranslation(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  rbNumColliders(e51) {
    return K.rawrigidbodyset_rbNumColliders(this.__wbg_ptr, e51) >>> 0;
  }
  rbPrincipalInertia(e51) {
    return K.rawrigidbodyset_rbPrincipalInertia(this.__wbg_ptr, e51);
  }
  rbRecomputeMassPropertiesFromColliders(e51, t2) {
    P(t2, c), K.rawrigidbodyset_rbRecomputeMassPropertiesFromColliders(this.__wbg_ptr, e51, t2.__wbg_ptr);
  }
  rbResetForces(e51, t2) {
    K.rawrigidbodyset_rbResetForces(this.__wbg_ptr, e51, t2);
  }
  rbResetTorques(e51, t2) {
    K.rawrigidbodyset_rbResetTorques(this.__wbg_ptr, e51, t2);
  }
  rbRotation(e51) {
    return K.rawrigidbodyset_rbRotation(this.__wbg_ptr, e51);
  }
  rbSetAdditionalMassProperties(e51, t2, n2, r2, i2) {
    P(n2, M), K.rawrigidbodyset_rbSetAdditionalMassProperties(this.__wbg_ptr, e51, t2, n2.__wbg_ptr, r2, i2);
  }
  rbSetAdditionalMass(e51, t2, n2) {
    K.rawrigidbodyset_rbSetAdditionalMass(this.__wbg_ptr, e51, t2, n2);
  }
  rbSetAdditionalPgsIterations(e51, t2) {
    K.rawrigidbodyset_rbSetAdditionalPgsIterations(this.__wbg_ptr, e51, t2);
  }
  rbSetAdditionalSolverIterations(e51, t2) {
    K.rawrigidbodyset_rbSetAdditionalSolverIterations(this.__wbg_ptr, e51, t2);
  }
  rbSetAngularDamping(e51, t2) {
    K.rawrigidbodyset_rbSetAngularDamping(this.__wbg_ptr, e51, t2);
  }
  rbSetAngvel(e51, t2, n2) {
    K.rawrigidbodyset_rbSetAngvel(this.__wbg_ptr, e51, t2, n2);
  }
  rbSetBodyType(e51, t2, n2) {
    K.rawrigidbodyset_rbSetBodyType(this.__wbg_ptr, e51, t2, n2);
  }
  rbSetDominanceGroup(e51, t2) {
    K.rawrigidbodyset_rbSetDominanceGroup(this.__wbg_ptr, e51, t2);
  }
  rbSetEnabledTranslations(e51, t2, n2, r2) {
    K.rawrigidbodyset_rbSetEnabledTranslations(this.__wbg_ptr, e51, t2, n2, r2);
  }
  rbSetEnabled(e51, t2) {
    K.rawrigidbodyset_rbSetEnabled(this.__wbg_ptr, e51, t2);
  }
  rbSetGravityScale(e51, t2, n2) {
    K.rawrigidbodyset_rbSetGravityScale(this.__wbg_ptr, e51, t2, n2);
  }
  rbSetLinearDamping(e51, t2) {
    K.rawrigidbodyset_rbSetLinearDamping(this.__wbg_ptr, e51, t2);
  }
  rbSetLinvel(e51, t2, n2) {
    P(t2, M), K.rawrigidbodyset_rbSetLinvel(this.__wbg_ptr, e51, t2.__wbg_ptr, n2);
  }
  rbSetNextKinematicRotation(e51, t2) {
    K.rawrigidbodyset_rbSetNextKinematicRotation(this.__wbg_ptr, e51, t2);
  }
  rbSetNextKinematicTranslation(e51, t2, n2) {
    K.rawrigidbodyset_rbSetNextKinematicTranslation(this.__wbg_ptr, e51, t2, n2);
  }
  rbSetRotation(e51, t2, n2) {
    K.rawrigidbodyset_rbSetRotation(this.__wbg_ptr, e51, t2, n2);
  }
  rbSetSoftCcdPrediction(e51, t2) {
    K.rawrigidbodyset_rbSetSoftCcdPrediction(this.__wbg_ptr, e51, t2);
  }
  rbSetTranslation(e51, t2, n2, r2) {
    K.rawrigidbodyset_rbSetTranslation(this.__wbg_ptr, e51, t2, n2, r2);
  }
  rbSetUserData(e51, t2) {
    K.rawrigidbodyset_rbSetUserData(this.__wbg_ptr, e51, t2);
  }
  rbSleep(e51) {
    K.rawrigidbodyset_rbSleep(this.__wbg_ptr, e51);
  }
  rbSoftBody(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawrigidbodyset_rbSoftBody(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getFloat64(r2 + 8, true);
      return t2 === 0 ? void 0 : n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  rbSoftCcdPrediction(e51) {
    return K.rawrigidbodyset_rbSoftCcdPrediction(this.__wbg_ptr, e51);
  }
  rbSoftCluster(e51) {
    let t2 = K.rawrigidbodyset_rbSoftCluster(this.__wbg_ptr, e51);
    return t2 === 2 ** 53 - 1 ? void 0 : t2;
  }
  rbTranslation(e51, t2) {
    try {
      K.rawrigidbodyset_rbTranslation(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  rbUserData(e51) {
    return K.rawrigidbodyset_rbUserData(this.__wbg_ptr, e51) >>> 0;
  }
  rbUserForce(e51, t2) {
    try {
      K.rawrigidbodyset_rbUserForce(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  rbUserTorque(e51) {
    return K.rawrigidbodyset_rbUserTorque(this.__wbg_ptr, e51);
  }
  rbVelocityAtPoint(e51, t2, n2) {
    try {
      P(t2, M), K.rawrigidbodyset_rbVelocityAtPoint(this.__wbg_ptr, e51, t2.__wbg_ptr, F(n2));
    } finally {
      B[W++] = void 0;
    }
  }
  rbWakeUp(e51) {
    K.rawrigidbodyset_rbWakeUp(this.__wbg_ptr, e51);
  }
  rbWorldCom(e51, t2) {
    try {
      K.rawrigidbodyset_rbWorldCom(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  remove(e51, t2, n2, r2, i2, a2) {
    P(t2, y), P(n2, c), P(r2, j), P(i2, _), P(a2, S), K.rawrigidbodyset_remove(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr);
  }
};
Symbol.dispose && (T.prototype[Symbol.dispose] = T.prototype.free), Object.freeze({ Dynamic: 0, 0: `Dynamic`, Fixed: 1, 1: `Fixed`, KinematicPositionBased: 2, 2: `KinematicPositionBased`, KinematicVelocityBased: 3, 3: `KinematicVelocityBased`, SoftFrame: 4, 4: `SoftFrame` });
var E = class e21 {
  static __wrap(t2) {
    let n2 = Object.create(e21.prototype);
    return n2.__wbg_ptr = t2, gt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, gt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawrotation_free(e51, 0);
  }
  get angle() {
    return K.rawrotation_angle(this.__wbg_ptr);
  }
  static fromAngle(t2) {
    let n2 = K.rawrotation_fromAngle(t2);
    return e21.__wrap(n2);
  }
  static identity() {
    let t2 = K.rawrotation_identity();
    return e21.__wrap(t2);
  }
  get im() {
    return K.rawrotation_im(this.__wbg_ptr);
  }
  get re() {
    return K.rawrotation_re(this.__wbg_ptr);
  }
};
Symbol.dispose && (E.prototype[Symbol.dispose] = E.prototype.free);
var se = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, _t.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawserializationpipeline_free(e51, 0);
  }
  deserializeAll(e51) {
    let t2 = K.rawserializationpipeline_deserializeAll(this.__wbg_ptr, N(e51));
    return t2 === 0 ? void 0 : m.__wrap(t2);
  }
  constructor() {
    let e51 = K.rawserializationpipeline_new();
    return this.__wbg_ptr = e51, _t.register(this, this.__wbg_ptr, this), this;
  }
  serializeAll(e51, t2, n2, r2, i2, o2, s2, l2, u2, d2) {
    return P(e51, M), P(t2, v), P(n2, y), P(r2, a), P(i2, C), P(o2, T), P(s2, c), P(l2, j), P(u2, _), P(d2, S), qt(K.rawserializationpipeline_serializeAll(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, o2.__wbg_ptr, s2.__wbg_ptr, l2.__wbg_ptr, u2.__wbg_ptr, d2.__wbg_ptr));
  }
};
Symbol.dispose && (se.prototype[Symbol.dispose] = se.prototype.free);
var D = class e22 {
  static __wrap(t2) {
    let n2 = Object.create(e22.prototype);
    return n2.__wbg_ptr = t2, vt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  static __unwrap(t2) {
    return t2 instanceof e22 ? t2.__destroy_into_raw() : 0;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, vt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawshape_free(e51, 0);
  }
  static ball(t2) {
    let n2 = K.rawshape_ball(t2);
    return e22.__wrap(n2);
  }
  static capsule(t2, n2) {
    let r2 = K.rawshape_capsule(t2, n2);
    return e22.__wrap(r2);
  }
  castRayAndGetNormal(e51, t2, n2, r2, i2, a2) {
    P(e51, M), P(t2, E), P(n2, M), P(r2, M);
    let o2 = K.rawshape_castRayAndGetNormal(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2, a2);
    return o2 === 0 ? void 0 : oe.__wrap(o2);
  }
  castRay(e51, t2, n2, r2, i2, a2) {
    return P(e51, M), P(t2, E), P(n2, M), P(r2, M), K.rawshape_castRay(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2, a2);
  }
  castShape(t2, n2, r2, i2, a2, o2, s2, c2, l2, u2) {
    P(t2, M), P(n2, E), P(r2, M), P(i2, e22), P(a2, M), P(o2, E), P(s2, M);
    let d2 = K.rawshape_castShape(this.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2.__wbg_ptr, s2.__wbg_ptr, c2, l2, u2);
    return d2 === 0 ? void 0 : ce.__wrap(d2);
  }
  compoundFlags() {
    let e51 = K.rawshape_compoundFlags(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  compoundLen() {
    let e51 = K.rawshape_compoundLen(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  compoundRotation(e51) {
    let t2 = K.rawshape_compoundRotation(this.__wbg_ptr, e51);
    return t2 === 0 ? void 0 : E.__wrap(t2);
  }
  compoundShape(t2) {
    let n2 = K.rawshape_compoundShape(this.__wbg_ptr, t2);
    return n2 === 0 ? void 0 : e22.__wrap(n2);
  }
  compoundTranslation(e51) {
    let t2 = K.rawshape_compoundTranslation(this.__wbg_ptr, e51);
    return t2 === 0 ? void 0 : M.__wrap(t2);
  }
  static compound(t2, n2, r2, i2) {
    let a2 = Kt(t2, K.__wbindgen_export3), o2 = G, s2 = U(n2, K.__wbindgen_export3), c2 = G, l2 = U(r2, K.__wbindgen_export3), u2 = G, d2 = K.rawshape_compound(a2, o2, s2, c2, l2, u2, i2);
    return e22.__wrap(d2);
  }
  contactShape(t2, n2, r2, i2, a2, o2) {
    P(t2, M), P(n2, E), P(r2, e22), P(i2, M), P(a2, E);
    let s2 = K.rawshape_contactShape(this.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2);
    return s2 === 0 ? void 0 : le.__wrap(s2);
  }
  containsPoint(e51, t2, n2) {
    return P(e51, M), P(t2, E), P(n2, M), K.rawshape_containsPoint(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr) !== 0;
  }
  static convexDecompositionWithParams(t2, n2, r2, i2) {
    let a2 = U(t2, K.__wbindgen_export3), o2 = G, s2 = H(n2, K.__wbindgen_export3), c2 = G;
    P(r2, fe);
    let l2 = K.rawshape_convexDecompositionWithParams(a2, o2, s2, c2, r2.__wbg_ptr, i2);
    return l2 === 0 ? void 0 : e22.__wrap(l2);
  }
  static convexDecomposition(t2, n2, r2) {
    let i2 = U(t2, K.__wbindgen_export3), a2 = G, o2 = H(n2, K.__wbindgen_export3), s2 = G, c2 = K.rawshape_convexDecomposition(i2, a2, o2, s2, r2);
    return c2 === 0 ? void 0 : e22.__wrap(c2);
  }
  static convexHull(t2) {
    let n2 = U(t2, K.__wbindgen_export3), r2 = G, i2 = K.rawshape_convexHull(n2, r2);
    return i2 === 0 ? void 0 : e22.__wrap(i2);
  }
  static convexPolyline(t2) {
    let n2 = U(t2, K.__wbindgen_export3), r2 = G, i2 = K.rawshape_convexPolyline(n2, r2);
    return i2 === 0 ? void 0 : e22.__wrap(i2);
  }
  static cuboid(t2, n2) {
    let r2 = K.rawshape_cuboid(t2, n2);
    return e22.__wrap(r2);
  }
  halfExtents() {
    let e51 = K.rawshape_halfExtents(this.__wbg_ptr);
    return e51 === 0 ? void 0 : M.__wrap(e51);
  }
  halfHeight() {
    let e51 = K.rawshape_halfHeight(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  halfspaceNormal() {
    let e51 = K.rawshape_halfspaceNormal(this.__wbg_ptr);
    return e51 === 0 ? void 0 : M.__wrap(e51);
  }
  static halfspace(t2) {
    P(t2, M);
    let n2 = K.rawshape_halfspace(t2.__wbg_ptr);
    return e22.__wrap(n2);
  }
  heightfieldHeights() {
    try {
      let n2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawshape_heightfieldHeights(n2, this.__wbg_ptr);
      var e51 = R().getInt32(n2 + 0, true), t2 = R().getInt32(n2 + 4, true);
      let r2;
      return e51 !== 0 && (r2 = I(e51, t2).slice(), K.__wbindgen_export2(e51, t2 * 4, 4)), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  heightfieldScale() {
    let e51 = K.rawshape_heightfieldScale(this.__wbg_ptr);
    return e51 === 0 ? void 0 : M.__wrap(e51);
  }
  static heightfield(t2, n2) {
    let r2 = U(t2, K.__wbindgen_export3), i2 = G;
    P(n2, M);
    let a2 = K.rawshape_heightfield(r2, i2, n2.__wbg_ptr);
    return e22.__wrap(a2);
  }
  indices() {
    try {
      let n2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawshape_indices(n2, this.__wbg_ptr);
      var e51 = R().getInt32(n2 + 0, true), t2 = R().getInt32(n2 + 4, true);
      let r2;
      return e51 !== 0 && (r2 = L(e51, t2).slice(), K.__wbindgen_export2(e51, t2 * 4, 4)), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  intersectsRay(e51, t2, n2, r2, i2) {
    return P(e51, M), P(t2, E), P(n2, M), P(r2, M), K.rawshape_intersectsRay(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2) !== 0;
  }
  intersectsShape(t2, n2, r2, i2, a2) {
    return P(t2, M), P(n2, E), P(r2, e22), P(i2, M), P(a2, E), K.rawshape_intersectsShape(this.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr) !== 0;
  }
  polylineFlags() {
    let e51 = K.rawshape_polylineFlags(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  static polyline(t2, n2, r2) {
    let i2 = U(t2, K.__wbindgen_export3), a2 = G, o2 = H(n2, K.__wbindgen_export3), s2 = G, c2 = K.rawshape_polyline(i2, a2, o2, s2, r2);
    return e22.__wrap(c2);
  }
  projectPoint(e51, t2, n2, r2) {
    P(e51, M), P(t2, E), P(n2, M);
    let i2 = K.rawshape_projectPoint(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr, r2);
    return re.__wrap(i2);
  }
  radius() {
    let e51 = K.rawshape_radius(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  static roundConvexHull(t2, n2) {
    let r2 = U(t2, K.__wbindgen_export3), i2 = G, a2 = K.rawshape_roundConvexHull(r2, i2, n2);
    return a2 === 0 ? void 0 : e22.__wrap(a2);
  }
  static roundConvexPolyline(t2, n2) {
    let r2 = U(t2, K.__wbindgen_export3), i2 = G, a2 = K.rawshape_roundConvexPolyline(r2, i2, n2);
    return a2 === 0 ? void 0 : e22.__wrap(a2);
  }
  static roundCuboid(t2, n2, r2) {
    let i2 = K.rawshape_roundCuboid(t2, n2, r2);
    return e22.__wrap(i2);
  }
  roundRadius() {
    let e51 = K.rawshape_roundRadius(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  static roundTriangle(t2, n2, r2, i2) {
    P(t2, M), P(n2, M), P(r2, M);
    let a2 = K.rawshape_roundTriangle(t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2);
    return e22.__wrap(a2);
  }
  static segment(t2, n2) {
    P(t2, M), P(n2, M);
    let r2 = K.rawshape_segment(t2.__wbg_ptr, n2.__wbg_ptr);
    return e22.__wrap(r2);
  }
  shapeType() {
    return K.rawshape_shapeType(this.__wbg_ptr);
  }
  triMeshFlags() {
    let e51 = K.rawshape_triMeshFlags(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  static triangle(t2, n2, r2) {
    P(t2, M), P(n2, M), P(r2, M);
    let i2 = K.rawshape_triangle(t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr);
    return e22.__wrap(i2);
  }
  static trimesh(t2, n2, r2) {
    let i2 = U(t2, K.__wbindgen_export3), a2 = G, o2 = H(n2, K.__wbindgen_export3), s2 = G, c2 = K.rawshape_trimesh(i2, a2, o2, s2, r2);
    return c2 === 0 ? void 0 : e22.__wrap(c2);
  }
  vertices() {
    try {
      let n2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawshape_vertices(n2, this.__wbg_ptr);
      var e51 = R().getInt32(n2 + 0, true), t2 = R().getInt32(n2 + 4, true);
      let r2;
      return e51 !== 0 && (r2 = I(e51, t2).slice(), K.__wbindgen_export2(e51, t2 * 4, 4)), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  voxelData() {
    try {
      let n2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawshape_voxelData(n2, this.__wbg_ptr);
      var e51 = R().getInt32(n2 + 0, true), t2 = R().getInt32(n2 + 4, true);
      let r2;
      return e51 !== 0 && (r2 = At(e51, t2).slice(), K.__wbindgen_export2(e51, t2 * 4, 4)), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  voxelSize() {
    let e51 = K.rawshape_voxelSize(this.__wbg_ptr);
    return e51 === 0 ? void 0 : M.__wrap(e51);
  }
  static voxelsFromPoints(t2, n2) {
    P(t2, M);
    let r2 = U(n2, K.__wbindgen_export3), i2 = G, a2 = K.rawshape_voxelsFromPoints(t2.__wbg_ptr, r2, i2);
    return e22.__wrap(a2);
  }
  static voxels(t2, n2) {
    P(t2, M);
    let r2 = H(n2, K.__wbindgen_export3), i2 = G, a2 = K.rawshape_voxels(t2.__wbg_ptr, r2, i2);
    return e22.__wrap(a2);
  }
};
Symbol.dispose && (D.prototype[Symbol.dispose] = D.prototype.free);
var ce = class e23 {
  static __wrap(t2) {
    let n2 = Object.create(e23.prototype);
    return n2.__wbg_ptr = t2, yt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, yt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawshapecasthit_free(e51, 0);
  }
  getComponents(e51) {
    try {
      K.rawshapecasthit_getComponents(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
};
Symbol.dispose && (ce.prototype[Symbol.dispose] = ce.prototype.free);
var le = class e24 {
  static __wrap(t2) {
    let n2 = Object.create(e24.prototype);
    return n2.__wbg_ptr = t2, bt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, bt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawshapecontact_free(e51, 0);
  }
  getComponents(e51) {
    try {
      K.rawshapecontact_getComponents(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
};
Symbol.dispose && (le.prototype[Symbol.dispose] = le.prototype.free);
var O = Object.freeze({ Ball: 0, 0: `Ball`, Cuboid: 1, 1: `Cuboid`, Capsule: 2, 2: `Capsule`, Segment: 3, 3: `Segment`, Polyline: 4, 4: `Polyline`, Triangle: 5, 5: `Triangle`, TriMesh: 6, 6: `TriMesh`, HeightField: 7, 7: `HeightField`, Compound: 8, 8: `Compound`, ConvexPolygon: 9, 9: `ConvexPolygon`, RoundCuboid: 10, 10: `RoundCuboid`, RoundTriangle: 11, 11: `RoundTriangle`, RoundConvexPolygon: 12, 12: `RoundConvexPolygon`, HalfSpace: 13, 13: `HalfSpace`, Voxels: 14, 14: `Voxels` }), k = class e25 {
  static __wrap(t2) {
    let n2 = Object.create(e25.prototype);
    return n2.__wbg_ptr = t2, xt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, xt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawsoftbodybuilder_free(e51, 0);
  }
  addEdges(e51) {
    let t2 = H(e51, K.__wbindgen_export3), n2 = G;
    K.rawsoftbodybuilder_addEdges(this.__wbg_ptr, t2, n2);
  }
  append(t2) {
    P(t2, e25), K.rawsoftbodybuilder_append(this.__wbg_ptr, t2.__wbg_ptr);
  }
  cellEdges() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodybuilder_cellEdges(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = L(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  static disk(t2, n2, r2) {
    P(t2, M);
    let i2 = K.rawsoftbodybuilder_disk(t2.__wbg_ptr, n2, r2);
    return e25.__wrap(i2);
  }
  static grid(t2, n2, r2, i2) {
    P(t2, M), P(n2, M);
    let a2 = K.rawsoftbodybuilder_grid(t2.__wbg_ptr, n2.__wbg_ptr, r2, i2);
    return e25.__wrap(a2);
  }
  material() {
    let e51 = K.rawsoftbodybuilder_material(this.__wbg_ptr);
    return A.__wrap(e51);
  }
  constructor(e51) {
    let t2 = U(e51, K.__wbindgen_export3), n2 = G, r2 = K.rawsoftbodybuilder_new(t2, n2);
    return this.__wbg_ptr = r2, xt.register(this, this.__wbg_ptr, this), this;
  }
  numParticles() {
    return K.rawsoftbodybuilder_numParticles(this.__wbg_ptr) >>> 0;
  }
  particlePositions() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodybuilder_particlePositions(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = I(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  static polygon(t2) {
    let n2 = U(t2, K.__wbindgen_export3), r2 = G, i2 = K.rawsoftbodybuilder_polygon(n2, r2);
    return e25.__wrap(i2);
  }
  static polyline(t2, n2) {
    let r2 = U(t2, K.__wbindgen_export3), i2 = G, a2 = H(n2, K.__wbindgen_export3), o2 = G, s2 = K.rawsoftbodybuilder_polyline(r2, i2, a2, o2);
    return s2 === 0 ? void 0 : e25.__wrap(s2);
  }
  static rope(t2, n2, r2) {
    P(t2, M), P(n2, M);
    let i2 = K.rawsoftbodybuilder_rope(t2.__wbg_ptr, n2.__wbg_ptr, r2);
    return e25.__wrap(i2);
  }
  setAdditionalPgsIterations(e51) {
    K.rawsoftbodybuilder_setAdditionalPgsIterations(this.__wbg_ptr, e51);
  }
  setAdditionalSolverIterations(e51) {
    K.rawsoftbodybuilder_setAdditionalSolverIterations(this.__wbg_ptr, e51);
  }
  setBendEdges(e51) {
    let t2 = H(e51, K.__wbindgen_export3), n2 = G;
    K.rawsoftbodybuilder_setBendEdges(this.__wbg_ptr, t2, n2);
  }
  setCanSleep(e51) {
    K.rawsoftbodybuilder_setCanSleep(this.__wbg_ptr, e51);
  }
  setCellModel(e51) {
    K.rawsoftbodybuilder_setCellModel(this.__wbg_ptr, e51);
  }
  setCells(e51) {
    let t2 = H(e51, K.__wbindgen_export3), n2 = G;
    K.rawsoftbodybuilder_setCells(this.__wbg_ptr, t2, n2);
  }
  setDominanceGroup(e51) {
    K.rawsoftbodybuilder_setDominanceGroup(this.__wbg_ptr, e51);
  }
  setEdgeSoftness(e51, t2, n2) {
    let r2 = H(e51, K.__wbindgen_export3), i2 = G, a2 = U(t2, K.__wbindgen_export3), o2 = G, s2 = U(n2, K.__wbindgen_export3), c2 = G;
    K.rawsoftbodybuilder_setEdgeSoftness(this.__wbg_ptr, r2, i2, a2, o2, s2, c2);
  }
  setEdgeTearResistance(e51, t2) {
    let n2 = H(e51, K.__wbindgen_export3), r2 = G, i2 = U(t2, K.__wbindgen_export3), a2 = G;
    K.rawsoftbodybuilder_setEdgeTearResistance(this.__wbg_ptr, n2, r2, i2, a2);
  }
  setEdges(e51) {
    let t2 = H(e51, K.__wbindgen_export3), n2 = G;
    K.rawsoftbodybuilder_setEdges(this.__wbg_ptr, t2, n2);
  }
  setGravityScale(e51) {
    K.rawsoftbodybuilder_setGravityScale(this.__wbg_ptr, e51);
  }
  setLinearDamping(e51) {
    K.rawsoftbodybuilder_setLinearDamping(this.__wbg_ptr, e51);
  }
  setMass(e51) {
    K.rawsoftbodybuilder_setMass(this.__wbg_ptr, e51);
  }
  setMasses(e51) {
    let t2 = U(e51, K.__wbindgen_export3), n2 = G;
    K.rawsoftbodybuilder_setMasses(this.__wbg_ptr, t2, n2);
  }
  setMaterial(e51) {
    P(e51, A), K.rawsoftbodybuilder_setMaterial(this.__wbg_ptr, e51.__wbg_ptr);
  }
  setNoSurfaceCollider() {
    K.rawsoftbodybuilder_setNoSurfaceCollider(this.__wbg_ptr);
  }
  setOriented(e51) {
    K.rawsoftbodybuilder_setOriented(this.__wbg_ptr, e51);
  }
  setParticleMass(e51) {
    K.rawsoftbodybuilder_setParticleMass(this.__wbg_ptr, e51);
  }
  setParticleRadius(e51) {
    K.rawsoftbodybuilder_setParticleRadius(this.__wbg_ptr, e51);
  }
  setPinnedParticles(e51) {
    let t2 = H(e51, K.__wbindgen_export3), n2 = G;
    K.rawsoftbodybuilder_setPinnedParticles(this.__wbg_ptr, t2, n2);
  }
  setPositions(e51) {
    let t2 = U(e51, K.__wbindgen_export3), n2 = G;
    K.rawsoftbodybuilder_setPositions(this.__wbg_ptr, t2, n2);
  }
  setSelfContacts(e51) {
    K.rawsoftbodybuilder_setSelfContacts(this.__wbg_ptr, e51);
  }
  setShapeMatching(e51) {
    K.rawsoftbodybuilder_setShapeMatching(this.__wbg_ptr, e51);
  }
  setSkinCollision(e51) {
    K.rawsoftbodybuilder_setSkinCollision(this.__wbg_ptr, e51);
  }
  setSkin(e51, t2) {
    let n2 = U(e51, K.__wbindgen_export3), r2 = G, i2 = H(t2, K.__wbindgen_export3), a2 = G;
    K.rawsoftbodybuilder_setSkin(this.__wbg_ptr, n2, r2, i2, a2);
  }
  setSoftness(e51, t2) {
    K.rawsoftbodybuilder_setSoftness(this.__wbg_ptr, e51, t2);
  }
  setSolver(e51) {
    K.rawsoftbodybuilder_setSolver(this.__wbg_ptr, e51);
  }
  setSurfaceCollider(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2) {
    K.rawsoftbodybuilder_setSurfaceCollider(this.__wbg_ptr, e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2);
  }
  setSurface(e51) {
    let t2 = H(e51, K.__wbindgen_export3), n2 = G;
    K.rawsoftbodybuilder_setSurface(this.__wbg_ptr, t2, n2);
  }
  setTensionOnly() {
    K.rawsoftbodybuilder_setTensionOnly(this.__wbg_ptr);
  }
  setVolumeFactor(e51) {
    K.rawsoftbodybuilder_setVolumeFactor(this.__wbg_ptr, e51);
  }
  setVolumePreservation(e51) {
    K.rawsoftbodybuilder_setVolumePreservation(this.__wbg_ptr, e51);
  }
  surfaceEdges() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodybuilder_surfaceEdges(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = L(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  translated(e51) {
    P(e51, M), K.rawsoftbodybuilder_translated(this.__wbg_ptr, e51.__wbg_ptr);
  }
  static volumetric(t2, n2, r2, i2) {
    let a2 = U(t2, K.__wbindgen_export3), o2 = G, s2 = H(n2, K.__wbindgen_export3), c2 = G, l2 = K.rawsoftbodybuilder_volumetric(a2, o2, s2, c2, r2, i2);
    return l2 === 0 ? void 0 : e25.__wrap(l2);
  }
};
Symbol.dispose && (k.prototype[Symbol.dispose] = k.prototype.free), Object.freeze({ Volume: 0, 0: `Volume`, Corotational: 1, 1: `Corotational`, NeoHookean: 2, 2: `NeoHookean` });
var A = class e26 {
  static __wrap(t2) {
    let n2 = Object.create(e26.prototype);
    return n2.__wbg_ptr = t2, St.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, St.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawsoftbodymaterial_free(e51, 0);
  }
  get bendDampingRatio() {
    return K.rawsoftbodymaterial_bendDampingRatio(this.__wbg_ptr);
  }
  get bendFrequency() {
    return K.rawsoftbodymaterial_bendFrequency(this.__wbg_ptr);
  }
  get deformationDamping() {
    return K.rawsoftbodymaterial_deformationDamping(this.__wbg_ptr);
  }
  get edgeDampingRatio() {
    return K.rawsoftbodymaterial_edgeDampingRatio(this.__wbg_ptr);
  }
  get edgeFrequency() {
    return K.rawsoftbodymaterial_edgeFrequency(this.__wbg_ptr);
  }
  get edgePlasticCreep() {
    return K.rawsoftbodymaterial_edgePlasticCreep(this.__wbg_ptr);
  }
  get edgePlasticFlow() {
    return K.rawsoftbodymaterial_edgePlasticFlow(this.__wbg_ptr);
  }
  get edgePlasticMax() {
    return K.rawsoftbodymaterial_edgePlasticMax(this.__wbg_ptr);
  }
  get edgePlasticYield() {
    return K.rawsoftbodymaterial_edgePlasticYield(this.__wbg_ptr);
  }
  get elasticDampingRatio() {
    return K.rawsoftbodymaterial_elasticDampingRatio(this.__wbg_ptr);
  }
  get interiorStrength() {
    return K.rawsoftbodymaterial_interiorStrength(this.__wbg_ptr);
  }
  get maxTearsPerStep() {
    return K.rawsoftbodymaterial_maxTearsPerStep(this.__wbg_ptr) >>> 0;
  }
  get minPiece() {
    let e51 = K.rawsoftbodymaterial_minPiece(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  constructor() {
    let e51 = K.rawsoftbodymaterial_new();
    return this.__wbg_ptr = e51, St.register(this, this.__wbg_ptr, this), this;
  }
  get plasticCreep() {
    return K.rawsoftbodymaterial_plasticCreep(this.__wbg_ptr);
  }
  get plasticMax() {
    return K.rawsoftbodymaterial_plasticMax(this.__wbg_ptr);
  }
  get plasticYield() {
    return K.rawsoftbodymaterial_plasticYield(this.__wbg_ptr);
  }
  get poissonRatio() {
    return K.rawsoftbodymaterial_poissonRatio(this.__wbg_ptr);
  }
  set bendDampingRatio(e51) {
    K.rawsoftbodymaterial_set_bendDampingRatio(this.__wbg_ptr, e51);
  }
  set bendFrequency(e51) {
    K.rawsoftbodymaterial_set_bendFrequency(this.__wbg_ptr, e51);
  }
  set deformationDamping(e51) {
    K.rawsoftbodymaterial_set_deformationDamping(this.__wbg_ptr, e51);
  }
  set edgeDampingRatio(e51) {
    K.rawsoftbodymaterial_set_edgeDampingRatio(this.__wbg_ptr, e51);
  }
  set edgeFrequency(e51) {
    K.rawsoftbodymaterial_set_edgeFrequency(this.__wbg_ptr, e51);
  }
  set edgePlasticCreep(e51) {
    K.rawsoftbodymaterial_set_edgePlasticCreep(this.__wbg_ptr, e51);
  }
  set edgePlasticFlow(e51) {
    K.rawsoftbodymaterial_set_edgePlasticFlow(this.__wbg_ptr, e51);
  }
  set edgePlasticMax(e51) {
    K.rawsoftbodymaterial_set_edgePlasticMax(this.__wbg_ptr, e51);
  }
  set edgePlasticYield(e51) {
    K.rawsoftbodymaterial_set_edgePlasticYield(this.__wbg_ptr, e51);
  }
  set elasticDampingRatio(e51) {
    K.rawsoftbodymaterial_set_elasticDampingRatio(this.__wbg_ptr, e51);
  }
  set interiorStrength(e51) {
    K.rawsoftbodymaterial_set_interiorStrength(this.__wbg_ptr, e51);
  }
  set maxTearsPerStep(e51) {
    K.rawsoftbodymaterial_set_maxTearsPerStep(this.__wbg_ptr, e51);
  }
  set minPiece(e51) {
    K.rawsoftbodymaterial_set_minPiece(this.__wbg_ptr, V(e51) ? 2 ** 53 - 1 : e51 >>> 0);
  }
  set plasticCreep(e51) {
    K.rawsoftbodymaterial_set_plasticCreep(this.__wbg_ptr, e51);
  }
  set plasticMax(e51) {
    K.rawsoftbodymaterial_set_plasticMax(this.__wbg_ptr, e51);
  }
  set plasticYield(e51) {
    K.rawsoftbodymaterial_set_plasticYield(this.__wbg_ptr, e51);
  }
  set poissonRatio(e51) {
    K.rawsoftbodymaterial_set_poissonRatio(this.__wbg_ptr, e51);
  }
  set shapeMatchingDampingRatio(e51) {
    K.rawsoftbodymaterial_set_shapeMatchingDampingRatio(this.__wbg_ptr, e51);
  }
  set shapeMatchingFrequency(e51) {
    K.rawsoftbodymaterial_set_shapeMatchingFrequency(this.__wbg_ptr, e51);
  }
  set tearForce(e51) {
    K.rawsoftbodymaterial_set_tearForce(this.__wbg_ptr, V(e51) ? 2 ** 53 - 1 : Math.fround(e51));
  }
  set tearSmoothing(e51) {
    K.rawsoftbodymaterial_set_tearSmoothing(this.__wbg_ptr, e51);
  }
  set tearStrain(e51) {
    K.rawsoftbodymaterial_set_tearStrain(this.__wbg_ptr, V(e51) ? 2 ** 53 - 1 : Math.fround(e51));
  }
  set volumeDampingRatio(e51) {
    K.rawsoftbodymaterial_set_volumeDampingRatio(this.__wbg_ptr, e51);
  }
  set volumeFrequency(e51) {
    K.rawsoftbodymaterial_set_volumeFrequency(this.__wbg_ptr, e51);
  }
  set youngModulus(e51) {
    K.rawsoftbodymaterial_set_youngModulus(this.__wbg_ptr, e51);
  }
  get shapeMatchingDampingRatio() {
    return K.rawsoftbodymaterial_shapeMatchingDampingRatio(this.__wbg_ptr);
  }
  get shapeMatchingFrequency() {
    return K.rawsoftbodymaterial_shapeMatchingFrequency(this.__wbg_ptr);
  }
  get tearForce() {
    let e51 = K.rawsoftbodymaterial_tearForce(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  get tearSmoothing() {
    return K.rawsoftbodymaterial_tearSmoothing(this.__wbg_ptr);
  }
  get tearStrain() {
    let e51 = K.rawsoftbodymaterial_tearStrain(this.__wbg_ptr);
    return e51 === 2 ** 53 - 1 ? void 0 : e51;
  }
  tears() {
    return K.rawsoftbodymaterial_tears(this.__wbg_ptr) !== 0;
  }
  static uniform(t2, n2) {
    let r2 = K.rawsoftbodymaterial_uniform(t2, n2);
    return e26.__wrap(r2);
  }
  get volumeDampingRatio() {
    return K.rawsoftbodymaterial_volumeDampingRatio(this.__wbg_ptr);
  }
  get volumeFrequency() {
    return K.rawsoftbodymaterial_volumeFrequency(this.__wbg_ptr);
  }
  get youngModulus() {
    return K.rawsoftbodymaterial_youngModulus(this.__wbg_ptr);
  }
};
Symbol.dispose && (A.prototype[Symbol.dispose] = A.prototype.free);
var j = class e27 {
  static __wrap(t2) {
    let n2 = Object.create(e27.prototype);
    return n2.__wbg_ptr = t2, Ct.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Ct.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawsoftbodyset_free(e51, 0);
  }
  addCluster(e51, t2, n2, r2) {
    let i2 = H(t2, K.__wbindgen_export3), a2 = G;
    P(n2, T), P(r2, c);
    let o2 = K.rawsoftbodyset_addCluster(this.__wbg_ptr, e51, i2, a2, n2.__wbg_ptr, r2.__wbg_ptr);
    return o2 === 2 ** 53 - 1 ? void 0 : o2;
  }
  contains(e51) {
    return K.rawsoftbodyset_contains(this.__wbg_ptr, e51) !== 0;
  }
  cut(e51, t2, n2, r2, i2, a2, o2) {
    let s2 = U(t2, K.__wbindgen_export3), l2 = G;
    P(n2, y), P(r2, T), P(i2, c), P(a2, _), P(o2, S);
    let u2 = K.rawsoftbodyset_cut(this.__wbg_ptr, e51, s2, l2, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2.__wbg_ptr);
    return u2 === 0 ? void 0 : ue.__wrap(u2);
  }
  forEachSoftBodyHandle(e51) {
    try {
      K.rawsoftbodyset_forEachSoftBodyHandle(this.__wbg_ptr, F(e51));
    } finally {
      B[W++] = void 0;
    }
  }
  insert(e51, t2, n2) {
    return P(e51, k), P(t2, T), P(n2, c), K.rawsoftbodyset_insert(this.__wbg_ptr, e51.__wbg_ptr, t2.__wbg_ptr, n2.__wbg_ptr);
  }
  len() {
    return K.rawsoftbodyset_len(this.__wbg_ptr) >>> 0;
  }
  constructor() {
    let e51 = K.rawsoftbodyset_new();
    return this.__wbg_ptr = e51, Ct.register(this, this.__wbg_ptr, this), this;
  }
  removeCluster(e51, t2, n2, r2, i2, a2, o2) {
    return P(n2, y), P(r2, T), P(i2, c), P(a2, _), P(o2, S), K.rawsoftbodyset_removeCluster(this.__wbg_ptr, e51, t2, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2.__wbg_ptr) !== 0;
  }
  remove(e51, t2, n2, r2, i2, a2) {
    P(t2, y), P(n2, T), P(r2, c), P(i2, _), P(a2, S), K.rawsoftbodyset_remove(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr);
  }
  sbAddForce(e51, t2, n2) {
    P(t2, M), K.rawsoftbodyset_sbAddForce(this.__wbg_ptr, e51, t2.__wbg_ptr, n2);
  }
  sbAddParticleForce(e51, t2, n2, r2) {
    P(n2, M), K.rawsoftbodyset_sbAddParticleForce(this.__wbg_ptr, e51, t2, n2.__wbg_ptr, r2);
  }
  sbApplyImpulseAtPoint(e51, t2, n2, r2, i2) {
    P(t2, M), P(n2, M), K.rawsoftbodyset_sbApplyImpulseAtPoint(this.__wbg_ptr, e51, t2.__wbg_ptr, n2.__wbg_ptr, r2, i2);
  }
  sbApplyImpulse(e51, t2, n2) {
    P(t2, M), K.rawsoftbodyset_sbApplyImpulse(this.__wbg_ptr, e51, t2.__wbg_ptr, n2);
  }
  sbApplyParticleImpulse(e51, t2, n2, r2) {
    P(n2, M), K.rawsoftbodyset_sbApplyParticleImpulse(this.__wbg_ptr, e51, t2, n2.__wbg_ptr, r2);
  }
  sbApplyRadialImpulse(e51, t2, n2, r2, i2) {
    P(t2, M), K.rawsoftbodyset_sbApplyRadialImpulse(this.__wbg_ptr, e51, t2.__wbg_ptr, n2, r2, i2);
  }
  sbAttachParticle(e51, t2, n2, r2) {
    P(r2, T), K.rawsoftbodyset_sbAttachParticle(this.__wbg_ptr, e51, t2, n2, r2.__wbg_ptr);
  }
  sbAttachmentBody(e51, t2) {
    return K.rawsoftbodyset_sbAttachmentBody(this.__wbg_ptr, e51, t2);
  }
  sbAttachmentParticle(e51, t2) {
    return K.rawsoftbodyset_sbAttachmentParticle(this.__wbg_ptr, e51, t2) >>> 0;
  }
  sbBoundary(e51) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbBoundary(i2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(i2 + 0, true), n2 = R().getInt32(i2 + 4, true), r2 = L(t2, n2).slice();
      return K.__wbindgen_export2(t2, n2 * 4, 4), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbCellModel(e51) {
    return K.rawsoftbodyset_sbCellModel(this.__wbg_ptr, e51);
  }
  sbCellRestVolume(e51, t2) {
    return K.rawsoftbodyset_sbCellRestVolume(this.__wbg_ptr, e51, t2);
  }
  sbCellStiffnessScale(e51, t2) {
    return K.rawsoftbodyset_sbCellStiffnessScale(this.__wbg_ptr, e51, t2);
  }
  sbCellStress(e51, t2) {
    return K.rawsoftbodyset_sbCellStress(this.__wbg_ptr, e51, t2);
  }
  sbCellTearResistance(e51, t2) {
    return K.rawsoftbodyset_sbCellTearResistance(this.__wbg_ptr, e51, t2);
  }
  sbCells(e51) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbCells(i2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(i2 + 0, true), n2 = R().getInt32(i2 + 4, true), r2 = L(t2, n2).slice();
      return K.__wbindgen_export2(t2, n2 * 4, 4), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbCenterOfMass(e51, t2) {
    try {
      K.rawsoftbodyset_sbCenterOfMass(this.__wbg_ptr, e51, F(t2));
    } finally {
      B[W++] = void 0;
    }
  }
  sbClusterParticles(e51, t2) {
    try {
      let a2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbClusterParticles(a2, this.__wbg_ptr, e51, t2);
      var n2 = R().getInt32(a2 + 0, true), r2 = R().getInt32(a2 + 4, true), i2 = L(n2, r2).slice();
      return K.__wbindgen_export2(n2, r2 * 4, 4), i2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbClusterProxy(e51, t2) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbClusterProxy(i2, this.__wbg_ptr, e51, t2);
      var n2 = R().getInt32(i2 + 0, true), r2 = R().getFloat64(i2 + 8, true);
      return n2 === 0 ? void 0 : r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbClusterShapeMatchingEnabled(e51, t2) {
    return K.rawsoftbodyset_sbClusterShapeMatchingEnabled(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbDetachParticle(e51, t2) {
    return K.rawsoftbodyset_sbDetachParticle(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbEdgeImpulse(e51, t2) {
    return K.rawsoftbodyset_sbEdgeImpulse(this.__wbg_ptr, e51, t2);
  }
  sbEdgeIsBend(e51, t2) {
    return K.rawsoftbodyset_sbEdgeIsBend(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbEdgePlasticStrain(e51, t2) {
    return K.rawsoftbodyset_sbEdgePlasticStrain(this.__wbg_ptr, e51, t2);
  }
  sbEdgeRestLength(e51, t2) {
    return K.rawsoftbodyset_sbEdgeRestLength(this.__wbg_ptr, e51, t2);
  }
  sbEdgeStress(e51, t2) {
    return K.rawsoftbodyset_sbEdgeStress(this.__wbg_ptr, e51, t2);
  }
  sbEdgeTearResistance(e51, t2) {
    return K.rawsoftbodyset_sbEdgeTearResistance(this.__wbg_ptr, e51, t2);
  }
  sbEdges(e51) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbEdges(i2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(i2 + 0, true), n2 = R().getInt32(i2 + 4, true), r2 = L(t2, n2).slice();
      return K.__wbindgen_export2(t2, n2 * 4, 4), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbEnableClusterShapeMatching(e51, t2, n2) {
    K.rawsoftbodyset_sbEnableClusterShapeMatching(this.__wbg_ptr, e51, t2, n2);
  }
  sbEnableVolumePreservation(e51, t2) {
    K.rawsoftbodyset_sbEnableVolumePreservation(this.__wbg_ptr, e51, t2);
  }
  sbGravityScale(e51) {
    return K.rawsoftbodyset_sbGravityScale(this.__wbg_ptr, e51);
  }
  sbHasPendingTears(e51) {
    return K.rawsoftbodyset_sbHasPendingTears(this.__wbg_ptr, e51) !== 0;
  }
  sbIsClusterLive(e51, t2) {
    return K.rawsoftbodyset_sbIsClusterLive(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbIsEnabled(e51) {
    return K.rawsoftbodyset_sbIsEnabled(this.__wbg_ptr, e51) !== 0;
  }
  sbIsParticleDamaged(e51, t2) {
    return K.rawsoftbodyset_sbIsParticleDamaged(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbIsParticleOnSurface(e51, t2) {
    return K.rawsoftbodyset_sbIsParticleOnSurface(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbIsParticlePinned(e51, t2) {
    return K.rawsoftbodyset_sbIsParticlePinned(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbIsSleeping(e51) {
    return K.rawsoftbodyset_sbIsSleeping(this.__wbg_ptr, e51) !== 0;
  }
  sbLinearDamping(e51) {
    return K.rawsoftbodyset_sbLinearDamping(this.__wbg_ptr, e51);
  }
  sbMass(e51) {
    return K.rawsoftbodyset_sbMass(this.__wbg_ptr, e51);
  }
  sbMaterial(e51) {
    let t2 = K.rawsoftbodyset_sbMaterial(this.__wbg_ptr, e51);
    return A.__wrap(t2);
  }
  sbMeshCluster(e51, t2) {
    let n2 = K.rawsoftbodyset_sbMeshCluster(this.__wbg_ptr, e51, t2);
    return n2 === 2 ** 53 - 1 ? void 0 : n2;
  }
  sbMeshCollider(e51, t2) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbMeshCollider(i2, this.__wbg_ptr, e51, t2);
      var n2 = R().getInt32(i2 + 0, true), r2 = R().getFloat64(i2 + 8, true);
      return n2 === 0 ? void 0 : r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbMeshCollisionEnabled(e51, t2) {
    return K.rawsoftbodyset_sbMeshCollisionEnabled(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbMeshIndices(e51, t2) {
    try {
      let a2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbMeshIndices(a2, this.__wbg_ptr, e51, t2);
      var n2 = R().getInt32(a2 + 0, true), r2 = R().getInt32(a2 + 4, true), i2 = L(n2, r2).slice();
      return K.__wbindgen_export2(n2, r2 * 4, 4), i2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbMeshIsOriented(e51, t2) {
    return K.rawsoftbodyset_sbMeshIsOriented(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbMeshIsSkinned(e51, t2) {
    return K.rawsoftbodyset_sbMeshIsSkinned(this.__wbg_ptr, e51, t2) !== 0;
  }
  sbMeshOfCollider(e51, t2) {
    let n2 = K.rawsoftbodyset_sbMeshOfCollider(this.__wbg_ptr, e51, t2);
    return n2 === 2 ** 53 - 1 ? void 0 : n2;
  }
  sbMeshVertices(e51, t2) {
    try {
      let a2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbMeshVertices(a2, this.__wbg_ptr, e51, t2);
      var n2 = R().getInt32(a2 + 0, true), r2 = R().getInt32(a2 + 4, true), i2 = I(n2, r2).slice();
      return K.__wbindgen_export2(n2, r2 * 4, 4), i2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbNumAttachments(e51) {
    return K.rawsoftbodyset_sbNumAttachments(this.__wbg_ptr, e51) >>> 0;
  }
  sbNumCells(e51) {
    return K.rawsoftbodyset_sbNumCells(this.__wbg_ptr, e51) >>> 0;
  }
  sbNumClusters(e51) {
    return K.rawsoftbodyset_sbNumClusters(this.__wbg_ptr, e51) >>> 0;
  }
  sbNumEdges(e51) {
    return K.rawsoftbodyset_sbNumEdges(this.__wbg_ptr, e51) >>> 0;
  }
  sbNumMeshes(e51) {
    return K.rawsoftbodyset_sbNumMeshes(this.__wbg_ptr, e51) >>> 0;
  }
  sbNumParticles(e51) {
    return K.rawsoftbodyset_sbNumParticles(this.__wbg_ptr, e51) >>> 0;
  }
  sbOrigin(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbOrigin(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getFloat64(r2 + 8, true);
      return t2 === 0 ? void 0 : n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbParticleMass(e51, t2) {
    return K.rawsoftbodyset_sbParticleMass(this.__wbg_ptr, e51, t2);
  }
  sbParticlePosition(e51, t2, n2) {
    try {
      K.rawsoftbodyset_sbParticlePosition(this.__wbg_ptr, e51, t2, F(n2));
    } finally {
      B[W++] = void 0;
    }
  }
  sbParticlePositions(e51) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbParticlePositions(i2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(i2 + 0, true), n2 = R().getInt32(i2 + 4, true), r2 = I(t2, n2).slice();
      return K.__wbindgen_export2(t2, n2 * 4, 4), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbParticleRadius(e51) {
    return K.rawsoftbodyset_sbParticleRadius(this.__wbg_ptr, e51);
  }
  sbParticleRestPosition(e51, t2, n2) {
    try {
      K.rawsoftbodyset_sbParticleRestPosition(this.__wbg_ptr, e51, t2, F(n2));
    } finally {
      B[W++] = void 0;
    }
  }
  sbParticleVelocities(e51) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbParticleVelocities(i2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(i2 + 0, true), n2 = R().getInt32(i2 + 4, true), r2 = I(t2, n2).slice();
      return K.__wbindgen_export2(t2, n2 * 4, 4), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbParticleVelocity(e51, t2, n2) {
    try {
      K.rawsoftbodyset_sbParticleVelocity(this.__wbg_ptr, e51, t2, F(n2));
    } finally {
      B[W++] = void 0;
    }
  }
  sbPieces(e51) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodyset_sbPieces(i2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(i2 + 0, true), n2 = R().getInt32(i2 + 4, true), r2 = kt(t2, n2).slice();
      return K.__wbindgen_export2(t2, n2 * 8, 8), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  sbResetForces(e51, t2) {
    K.rawsoftbodyset_sbResetForces(this.__wbg_ptr, e51, t2);
  }
  sbResetPlasticity(e51) {
    K.rawsoftbodyset_sbResetPlasticity(this.__wbg_ptr, e51);
  }
  sbRestVolume(e51) {
    return K.rawsoftbodyset_sbRestVolume(this.__wbg_ptr, e51);
  }
  sbRootBody(e51) {
    return K.rawsoftbodyset_sbRootBody(this.__wbg_ptr, e51);
  }
  sbSetAdditionalPgsIterations(e51, t2) {
    K.rawsoftbodyset_sbSetAdditionalPgsIterations(this.__wbg_ptr, e51, t2);
  }
  sbSetClusterEdgeSoftness(e51, t2, n2, r2) {
    K.rawsoftbodyset_sbSetClusterEdgeSoftness(this.__wbg_ptr, e51, t2, V(n2) ? 2 ** 53 - 1 : Math.fround(n2), V(r2) ? 2 ** 53 - 1 : Math.fround(r2));
  }
  sbSetClusterKinematicTarget(e51, t2, n2, r2) {
    P(n2, M), P(r2, E), K.rawsoftbodyset_sbSetClusterKinematicTarget(this.__wbg_ptr, e51, t2, n2.__wbg_ptr, r2.__wbg_ptr);
  }
  sbSetClusterPinned(e51, t2, n2) {
    K.rawsoftbodyset_sbSetClusterPinned(this.__wbg_ptr, e51, t2, n2);
  }
  sbSetClusterStiffnessScale(e51, t2, n2) {
    K.rawsoftbodyset_sbSetClusterStiffnessScale(this.__wbg_ptr, e51, t2, n2);
  }
  sbSetClusterTearResistance(e51, t2, n2) {
    K.rawsoftbodyset_sbSetClusterTearResistance(this.__wbg_ptr, e51, t2, n2);
  }
  sbSetEnabled(e51, t2) {
    K.rawsoftbodyset_sbSetEnabled(this.__wbg_ptr, e51, t2);
  }
  sbSetMaterial(e51, t2) {
    P(t2, A), K.rawsoftbodyset_sbSetMaterial(this.__wbg_ptr, e51, t2.__wbg_ptr);
  }
  sbSetParticleKinematicTarget(e51, t2, n2) {
    P(n2, M), K.rawsoftbodyset_sbSetParticleKinematicTarget(this.__wbg_ptr, e51, t2, n2.__wbg_ptr);
  }
  sbSetParticlePinned(e51, t2, n2) {
    K.rawsoftbodyset_sbSetParticlePinned(this.__wbg_ptr, e51, t2, n2);
  }
  sbSetParticlePosition(e51, t2, n2) {
    P(n2, M), K.rawsoftbodyset_sbSetParticlePosition(this.__wbg_ptr, e51, t2, n2.__wbg_ptr);
  }
  sbSetParticleVelocity(e51, t2, n2) {
    P(n2, M), K.rawsoftbodyset_sbSetParticleVelocity(this.__wbg_ptr, e51, t2, n2.__wbg_ptr);
  }
  sbSetSolver(e51, t2) {
    K.rawsoftbodyset_sbSetSolver(this.__wbg_ptr, e51, t2);
  }
  sbSetUserData(e51, t2) {
    K.rawsoftbodyset_sbSetUserData(this.__wbg_ptr, e51, t2);
  }
  sbSetVolumeFactor(e51, t2) {
    K.rawsoftbodyset_sbSetVolumeFactor(this.__wbg_ptr, e51, t2);
  }
  sbSolver(e51) {
    return K.rawsoftbodyset_sbSolver(this.__wbg_ptr, e51);
  }
  sbTearCell(e51, t2) {
    K.rawsoftbodyset_sbTearCell(this.__wbg_ptr, e51, t2);
  }
  sbTearEdge(e51, t2) {
    K.rawsoftbodyset_sbTearEdge(this.__wbg_ptr, e51, t2);
  }
  sbTopologyVersion(e51) {
    return K.rawsoftbodyset_sbTopologyVersion(this.__wbg_ptr, e51) >>> 0;
  }
  sbUserData(e51) {
    return K.rawsoftbodyset_sbUserData(this.__wbg_ptr, e51);
  }
  sbVolumeFactor(e51) {
    return K.rawsoftbodyset_sbVolumeFactor(this.__wbg_ptr, e51);
  }
  sbVolumePreservationEnabled(e51) {
    return K.rawsoftbodyset_sbVolumePreservationEnabled(this.__wbg_ptr, e51) !== 0;
  }
  sbVolume(e51) {
    return K.rawsoftbodyset_sbVolume(this.__wbg_ptr, e51);
  }
  sbWakeUp(e51) {
    K.rawsoftbodyset_sbWakeUp(this.__wbg_ptr, e51);
  }
  tear(e51, t2, n2, r2, i2, a2, o2, s2) {
    let l2 = H(t2, K.__wbindgen_export3), u2 = G, d2 = H(n2, K.__wbindgen_export3), f2 = G;
    P(r2, y), P(i2, T), P(a2, c), P(o2, _), P(s2, S);
    let p2 = K.rawsoftbodyset_tear(this.__wbg_ptr, e51, l2, u2, d2, f2, r2.__wbg_ptr, i2.__wbg_ptr, a2.__wbg_ptr, o2.__wbg_ptr, s2.__wbg_ptr);
    return p2 === 0 ? void 0 : ue.__wrap(p2);
  }
  wakeUp(e51, t2, n2) {
    P(t2, T), K.rawsoftbodyset_wakeUp(this.__wbg_ptr, e51, t2.__wbg_ptr, n2);
  }
};
Symbol.dispose && (j.prototype[Symbol.dispose] = j.prototype.free), Object.freeze({ Constraints: 0, 0: `Constraints`, Fem: 1, 1: `Fem` });
var ue = class e28 {
  static __wrap(t2) {
    let n2 = Object.create(e28.prototype);
    return n2.__wbg_ptr = t2, wt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, wt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawsoftbodytearevent_free(e51, 0);
  }
  clusterSplitCluster(e51) {
    return K.rawsoftbodytearevent_clusterSplitCluster(this.__wbg_ptr, e51) >>> 0;
  }
  clusterSplitKeepsProxy(e51) {
    return K.rawsoftbodytearevent_clusterSplitKeepsProxy(this.__wbg_ptr, e51) !== 0;
  }
  clusterSplitProxy(e51) {
    return K.rawsoftbodytearevent_clusterSplitProxy(this.__wbg_ptr, e51);
  }
  clusterSplitSoftBody(e51) {
    return K.rawsoftbodytearevent_clusterSplitSoftBody(this.__wbg_ptr, e51);
  }
  clusterSplitSource(e51) {
    return K.rawsoftbodytearevent_clusterSplitSource(this.__wbg_ptr, e51) >>> 0;
  }
  insertedParticles() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_insertedParticles(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = L(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  movedJointFrom(e51) {
    return K.rawsoftbodytearevent_movedJointFrom(this.__wbg_ptr, e51);
  }
  movedJointTo(e51) {
    return K.rawsoftbodytearevent_movedJointTo(this.__wbg_ptr, e51);
  }
  movedJoint(e51) {
    return K.rawsoftbodytearevent_movedJoint(this.__wbg_ptr, e51);
  }
  numClusterSplits() {
    return K.rawsoftbodytearevent_numClusterSplits(this.__wbg_ptr) >>> 0;
  }
  numMovedJoints() {
    return K.rawsoftbodytearevent_numMovedJoints(this.__wbg_ptr) >>> 0;
  }
  numPieces() {
    return K.rawsoftbodytearevent_numPieces(this.__wbg_ptr) >>> 0;
  }
  particleDestinationBody(e51) {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_particleDestinationBody(r2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(r2 + 0, true), n2 = R().getFloat64(r2 + 8, true);
      return t2 === 0 ? void 0 : n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  particleDestinationIndex(e51) {
    let t2 = K.rawsoftbodytearevent_particleDestinationIndex(this.__wbg_ptr, e51);
    return t2 === 2 ** 53 - 1 ? void 0 : t2;
  }
  pieceClusters(e51) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_pieceClusters(i2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(i2 + 0, true), n2 = R().getInt32(i2 + 4, true), r2 = L(t2, n2).slice();
      return K.__wbindgen_export2(t2, n2 * 4, 4), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  pieceParticles(e51) {
    try {
      let i2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_pieceParticles(i2, this.__wbg_ptr, e51);
      var t2 = R().getInt32(i2 + 0, true), n2 = R().getInt32(i2 + 4, true), r2 = L(t2, n2).slice();
      return K.__wbindgen_export2(t2, n2 * 4, 4), r2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  pieceSoftBody(e51) {
    return K.rawsoftbodytearevent_pieceSoftBody(this.__wbg_ptr, e51);
  }
  removedEdges() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_removedEdges(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = L(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  seeds() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_seeds(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = L(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  softBody() {
    return K.rawsoftbodytearevent_softBody(this.__wbg_ptr);
  }
  splitParticles() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_splitParticles(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = L(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  tornCells() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_tornCells(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = L(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
  tornEdges() {
    try {
      let r2 = K.__wbindgen_add_to_stack_pointer(-16);
      K.rawsoftbodytearevent_tornEdges(r2, this.__wbg_ptr);
      var e51 = R().getInt32(r2 + 0, true), t2 = R().getInt32(r2 + 4, true), n2 = L(e51, t2).slice();
      return K.__wbindgen_export2(e51, t2 * 4, 4), n2;
    } finally {
      K.__wbindgen_add_to_stack_pointer(16);
    }
  }
};
Symbol.dispose && (ue.prototype[Symbol.dispose] = ue.prototype.free), Object.freeze({ Both: 0, 0: `Both`, Compression: 1, 1: `Compression`, Tension: 2, 2: `Tension` }), Object.freeze({ Direct: 0, 0: `Direct`, DirectByPosition: 1, 1: `DirectByPosition`, Skinned: 2, 2: `Skinned` }), Object.freeze({ Keep: 0, 0: `Keep`, StandDown: 1, 1: `StandDown`, AlongNormal: 2, 2: `AlongNormal` });
var de = class e29 {
  static __wrap(t2) {
    let n2 = Object.create(e29.prototype);
    return n2.__wbg_ptr = t2, Tt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Tt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawsoftrecoverysettings_free(e51, 0);
  }
  get authoredVelocityMargin() {
    return K.rawsoftrecoverysettings_authoredVelocityMargin(this.__wbg_ptr) !== 0;
  }
  get crossBodyDetection() {
    return K.rawsoftrecoverysettings_crossBodyDetection(this.__wbg_ptr) !== 0;
  }
  get crossBodyExpelGate() {
    return K.rawsoftrecoverysettings_crossBodyExpelGate(this.__wbg_ptr) !== 0;
  }
  get crossingRepulsionGuide() {
    return K.rawsoftrecoverysettings_crossingRepulsionGuide(this.__wbg_ptr) !== 0;
  }
  get crossingRepulsionSelfGuide() {
    return K.rawsoftrecoverysettings_crossingRepulsionSelfGuide(this.__wbg_ptr) !== 0;
  }
  get crossingRepulsion() {
    return K.rawsoftrecoverysettings_crossingRepulsion(this.__wbg_ptr) !== 0;
  }
  get detectionMotionGating() {
    return K.rawsoftrecoverysettings_detectionMotionGating(this.__wbg_ptr) !== 0;
  }
  get edgeSpeculation() {
    return K.rawsoftrecoverysettings_edgeSpeculation(this.__wbg_ptr) !== 0;
  }
  get edgeStandDown() {
    return K.rawsoftrecoverysettings_edgeStandDown(this.__wbg_ptr) !== 0;
  }
  get invertedCellDetection() {
    return K.rawsoftrecoverysettings_invertedCellDetection(this.__wbg_ptr) !== 0;
  }
  constructor() {
    let e51 = K.rawsoftrecoverysettings_new();
    return this.__wbg_ptr = e51, Tt.register(this, this.__wbg_ptr, this), this;
  }
  get overlapConstraintPace() {
    return K.rawsoftrecoverysettings_overlapConstraintPace(this.__wbg_ptr);
  }
  get overlapConstraints() {
    return K.rawsoftrecoverysettings_overlapConstraints(this.__wbg_ptr) !== 0;
  }
  get overlapEdgeStandDown() {
    return K.rawsoftrecoverysettings_overlapEdgeStandDown(this.__wbg_ptr) !== 0;
  }
  get overlapKeptDepth() {
    return K.rawsoftrecoverysettings_overlapKeptDepth(this.__wbg_ptr);
  }
  get overlapMultiVolume() {
    return K.rawsoftrecoverysettings_overlapMultiVolume(this.__wbg_ptr) !== 0;
  }
  get overlapNormalPush() {
    return K.rawsoftrecoverysettings_overlapNormalPush(this.__wbg_ptr) !== 0;
  }
  get overlapPatchConstraints() {
    return K.rawsoftrecoverysettings_overlapPatchConstraints(this.__wbg_ptr);
  }
  get overlapPatience() {
    return K.rawsoftrecoverysettings_overlapPatience(this.__wbg_ptr) >>> 0;
  }
  get overlapProgressMargin() {
    return K.rawsoftrecoverysettings_overlapProgressMargin(this.__wbg_ptr);
  }
  get overlapRigid() {
    return K.rawsoftrecoverysettings_overlapRigid(this.__wbg_ptr) !== 0;
  }
  get overlapSelfRegions() {
    return K.rawsoftrecoverysettings_overlapSelfRegions(this.__wbg_ptr) !== 0;
  }
  get overlapSkinVolume() {
    return K.rawsoftrecoverysettings_overlapSkinVolume(this.__wbg_ptr) !== 0;
  }
  get overlapSkipSelfTangled() {
    return K.rawsoftrecoverysettings_overlapSkipSelfTangled(this.__wbg_ptr) !== 0;
  }
  get overlapSplit() {
    return K.rawsoftrecoverysettings_overlapSplit(this.__wbg_ptr) >>> 0;
  }
  get recoveryPace() {
    return K.rawsoftrecoverysettings_recoveryPace(this.__wbg_ptr);
  }
  get selfCrossingDetection() {
    return K.rawsoftrecoverysettings_selfCrossingDetection(this.__wbg_ptr) !== 0;
  }
  get selfStandDown() {
    return K.rawsoftrecoverysettings_selfStandDown(this.__wbg_ptr) !== 0;
  }
  set authoredVelocityMargin(e51) {
    K.rawsoftrecoverysettings_set_authoredVelocityMargin(this.__wbg_ptr, e51);
  }
  set crossBodyDetection(e51) {
    K.rawsoftrecoverysettings_set_crossBodyDetection(this.__wbg_ptr, e51);
  }
  set crossBodyExpelGate(e51) {
    K.rawsoftrecoverysettings_set_crossBodyExpelGate(this.__wbg_ptr, e51);
  }
  set crossingRepulsionGuide(e51) {
    K.rawsoftrecoverysettings_set_crossingRepulsionGuide(this.__wbg_ptr, e51);
  }
  set crossingRepulsionSelfGuide(e51) {
    K.rawsoftrecoverysettings_set_crossingRepulsionSelfGuide(this.__wbg_ptr, e51);
  }
  set crossingRepulsion(e51) {
    K.rawsoftrecoverysettings_set_crossingRepulsion(this.__wbg_ptr, e51);
  }
  set detectionMotionGating(e51) {
    K.rawsoftrecoverysettings_set_detectionMotionGating(this.__wbg_ptr, e51);
  }
  set edgeSpeculation(e51) {
    K.rawsoftrecoverysettings_set_edgeSpeculation(this.__wbg_ptr, e51);
  }
  set edgeStandDown(e51) {
    K.rawsoftrecoverysettings_set_edgeStandDown(this.__wbg_ptr, e51);
  }
  set invertedCellDetection(e51) {
    K.rawsoftrecoverysettings_set_invertedCellDetection(this.__wbg_ptr, e51);
  }
  set overlapConstraintPace(e51) {
    K.rawsoftrecoverysettings_set_overlapConstraintPace(this.__wbg_ptr, e51);
  }
  set overlapConstraints(e51) {
    K.rawsoftrecoverysettings_set_overlapConstraints(this.__wbg_ptr, e51);
  }
  set overlapEdgeStandDown(e51) {
    K.rawsoftrecoverysettings_set_overlapEdgeStandDown(this.__wbg_ptr, e51);
  }
  set overlapKeptDepth(e51) {
    K.rawsoftrecoverysettings_set_overlapKeptDepth(this.__wbg_ptr, e51);
  }
  set overlapMultiVolume(e51) {
    K.rawsoftrecoverysettings_set_overlapMultiVolume(this.__wbg_ptr, e51);
  }
  set overlapNormalPush(e51) {
    K.rawsoftrecoverysettings_set_overlapNormalPush(this.__wbg_ptr, e51);
  }
  set overlapPatchConstraints(e51) {
    K.rawsoftrecoverysettings_set_overlapPatchConstraints(this.__wbg_ptr, e51);
  }
  set overlapPatience(e51) {
    K.rawsoftrecoverysettings_set_overlapPatience(this.__wbg_ptr, e51);
  }
  set overlapProgressMargin(e51) {
    K.rawsoftrecoverysettings_set_overlapProgressMargin(this.__wbg_ptr, e51);
  }
  set overlapRigid(e51) {
    K.rawsoftrecoverysettings_set_overlapRigid(this.__wbg_ptr, e51);
  }
  set overlapSelfRegions(e51) {
    K.rawsoftrecoverysettings_set_overlapSelfRegions(this.__wbg_ptr, e51);
  }
  set overlapSkinVolume(e51) {
    K.rawsoftrecoverysettings_set_overlapSkinVolume(this.__wbg_ptr, e51);
  }
  set overlapSkipSelfTangled(e51) {
    K.rawsoftrecoverysettings_set_overlapSkipSelfTangled(this.__wbg_ptr, e51);
  }
  set overlapSplit(e51) {
    K.rawsoftrecoverysettings_set_overlapSplit(this.__wbg_ptr, e51);
  }
  set recoveryPace(e51) {
    K.rawsoftrecoverysettings_set_recoveryPace(this.__wbg_ptr, e51);
  }
  set selfCrossingDetection(e51) {
    K.rawsoftrecoverysettings_set_selfCrossingDetection(this.__wbg_ptr, e51);
  }
  set selfStandDown(e51) {
    K.rawsoftrecoverysettings_set_selfStandDown(this.__wbg_ptr, e51);
  }
};
Symbol.dispose && (de.prototype[Symbol.dispose] = de.prototype.free);
var fe = class {
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Et.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawvhacdparameters_free(e51, 0);
  }
  get alpha() {
    return K.rawvhacdparameters_alpha(this.__wbg_ptr);
  }
  get beta() {
    return K.rawvhacdparameters_beta(this.__wbg_ptr);
  }
  get concavity() {
    return K.rawvhacdparameters_concavity(this.__wbg_ptr);
  }
  get convex_hull_approximation() {
    return K.rawvhacdparameters_convex_hull_approximation(this.__wbg_ptr) !== 0;
  }
  get convex_hull_downsampling() {
    return K.rawvhacdparameters_convex_hull_downsampling(this.__wbg_ptr) >>> 0;
  }
  get max_convex_hulls() {
    return K.rawvhacdparameters_max_convex_hulls(this.__wbg_ptr) >>> 0;
  }
  constructor() {
    let e51 = K.rawvhacdparameters_new();
    return this.__wbg_ptr = e51, Et.register(this, this.__wbg_ptr, this), this;
  }
  get plane_downsampling() {
    return K.rawvhacdparameters_plane_downsampling(this.__wbg_ptr) >>> 0;
  }
  get resolution() {
    return K.rawvhacdparameters_resolution(this.__wbg_ptr) >>> 0;
  }
  set alpha(e51) {
    K.rawvhacdparameters_set_alpha(this.__wbg_ptr, e51);
  }
  set beta(e51) {
    K.rawvhacdparameters_set_beta(this.__wbg_ptr, e51);
  }
  set concavity(e51) {
    K.rawvhacdparameters_set_concavity(this.__wbg_ptr, e51);
  }
  set convex_hull_approximation(e51) {
    K.rawvhacdparameters_set_convex_hull_approximation(this.__wbg_ptr, e51);
  }
  set convex_hull_downsampling(e51) {
    K.rawvhacdparameters_set_convex_hull_downsampling(this.__wbg_ptr, e51);
  }
  set max_convex_hulls(e51) {
    K.rawvhacdparameters_set_max_convex_hulls(this.__wbg_ptr, e51);
  }
  set plane_downsampling(e51) {
    K.rawvhacdparameters_set_plane_downsampling(this.__wbg_ptr, e51);
  }
  set resolution(e51) {
    K.rawvhacdparameters_set_resolution(this.__wbg_ptr, e51);
  }
};
Symbol.dispose && (fe.prototype[Symbol.dispose] = fe.prototype.free);
var M = class e30 {
  static __wrap(t2) {
    let n2 = Object.create(e30.prototype);
    return n2.__wbg_ptr = t2, Dt.register(n2, n2.__wbg_ptr, n2), n2;
  }
  __destroy_into_raw() {
    let e51 = this.__wbg_ptr;
    return this.__wbg_ptr = 0, Dt.unregister(this), e51;
  }
  free() {
    let e51 = this.__destroy_into_raw();
    K.__wbg_rawvector_free(e51, 0);
  }
  constructor(e51, t2) {
    let n2 = K.rawvector_new(e51, t2);
    return this.__wbg_ptr = n2, Dt.register(this, this.__wbg_ptr, this), this;
  }
  set x(e51) {
    K.rawvector_set_x(this.__wbg_ptr, e51);
  }
  set y(e51) {
    K.rawvector_set_y(this.__wbg_ptr, e51);
  }
  get x() {
    return K.rawvector_x(this.__wbg_ptr);
  }
  xy() {
    let t2 = K.rawvector_xy(this.__wbg_ptr);
    return e30.__wrap(t2);
  }
  get y() {
    return K.rawvector_y(this.__wbg_ptr);
  }
  yx() {
    let t2 = K.rawvector_yx(this.__wbg_ptr);
    return e30.__wrap(t2);
  }
  static zero() {
    let t2 = K.rawvector_zero();
    return e30.__wrap(t2);
  }
};
Symbol.dispose && (M.prototype[Symbol.dispose] = M.prototype.free);
function pe(e51) {
  K.reserve_memory(e51);
}
function me() {
  let e51, t2;
  try {
    let i2 = K.__wbindgen_add_to_stack_pointer(-16);
    K.version(i2);
    var n2 = R().getInt32(i2 + 0, true), r2 = R().getInt32(i2 + 4, true);
    return e51 = n2, t2 = r2, zt(n2, r2);
  } finally {
    K.__wbindgen_add_to_stack_pointer(16), K.__wbindgen_export2(e51, t2, 1);
  }
}
function he(e51) {
  let t2 = z(e51), n2 = typeof t2 == `boolean` ? t2 : void 0;
  return V(n2) ? 16777215 : +!!n2;
}
function ge(e51) {
  return typeof z(e51) == `function`;
}
function _e(e51) {
  return z(e51) === void 0;
}
function ve(e51, t2) {
  let n2 = z(t2), r2 = typeof n2 == `number` ? n2 : void 0;
  R().setFloat64(e51 + 8, V(r2) ? 0 : r2, true), R().setInt32(e51 + 0, !V(r2), true);
}
function ye(e51, t2) {
  throw Error(zt(e51, t2));
}
function be(e51, t2, n2, r2) {
  return N(z(e51).bind(z(t2), z(n2), z(r2)));
}
function xe() {
  return Wt(function(e51, t2, n2, r2) {
    return N(z(e51).call(z(t2), z(n2), z(r2)));
  }, arguments);
}
function Se() {
  return Wt(function(e51, t2, n2) {
    return N(z(e51).call(z(t2), z(n2)));
  }, arguments);
}
function Ce() {
  return Wt(function(e51, t2, n2, r2, i2) {
    return N(z(e51).call(z(t2), z(n2), z(r2), z(i2)));
  }, arguments);
}
function we(e51) {
  return z(e51).length;
}
function Te(e51) {
  return z(e51).length;
}
function Ee(e51, t2) {
  return N(new Uint8Array(jt(e51, t2)));
}
function De(e51) {
  return N(new Float32Array(e51 >>> 0));
}
function Oe(e51) {
  return z(e51).now();
}
function ke(e51) {
  let t2 = z(e51).performance;
  return N(t2);
}
function Ae(e51, t2, n2) {
  Uint8Array.prototype.set.call(jt(e51, t2), z(n2));
}
function je(e51) {
  return N(u.__wrap(e51));
}
function Me(e51) {
  return N(ae.__wrap(e51));
}
function Ne(e51) {
  return D.__unwrap(z(e51));
}
function Pe(e51) {
  return N(ue.__wrap(e51));
}
function Fe(e51, t2, n2) {
  z(e51).set(I(t2, n2));
}
function Ie(e51, t2, n2) {
  z(e51)[t2 >>> 0] = n2;
}
function Le() {
  let e51 = typeof global > `u` ? null : global;
  return V(e51) ? 0 : N(e51);
}
function Re() {
  let e51 = typeof globalThis > `u` ? null : globalThis;
  return V(e51) ? 0 : N(e51);
}
function ze() {
  let e51 = typeof self > `u` ? null : self;
  return V(e51) ? 0 : N(e51);
}
function Be() {
  let e51 = typeof window > `u` ? null : window;
  return V(e51) ? 0 : N(e51);
}
function Ve(e51) {
  return N(e51);
}
function He(e51) {
  return N(z(e51));
}
function Ue(e51) {
  qt(e51);
}
var We = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawbroadphase_free(e51, 1)), Ge = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawccdsolver_free(e51, 1)), Ke = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawcharactercollision_free(e51, 1)), qe = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawcolliderset_free(e51, 1)), Je = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawcollidershapecasthit_free(e51, 1)), Ye = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawcontactforceevent_free(e51, 1)), Xe = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawcontactmanifold_free(e51, 1)), Ze = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawcontactpair_free(e51, 1)), Qe = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawdebugrenderpipeline_free(e51, 1)), $e = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawdeserializedworld_free(e51, 1)), et = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_raweventqueue_free(e51, 1)), tt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawgenericjoint_free(e51, 1)), nt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawimpulsejointset_free(e51, 1)), rt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawintegrationparameters_free(e51, 1)), it = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawislandmanager_free(e51, 1)), at = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawkinematiccharactercontroller_free(e51, 1)), ot = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawmultibodyjointset_free(e51, 1)), st = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawnarrowphase_free(e51, 1)), ct = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawphysicspipeline_free(e51, 1)), lt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawpidcontroller_free(e51, 1)), ut = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawpointcolliderprojection_free(e51, 1)), dt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawpointprojection_free(e51, 1)), ft = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawraycolliderhit_free(e51, 1)), pt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawraycolliderintersection_free(e51, 1)), mt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawrayintersection_free(e51, 1)), ht = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawrigidbodyset_free(e51, 1)), gt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawrotation_free(e51, 1)), _t = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawserializationpipeline_free(e51, 1)), vt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawshape_free(e51, 1)), yt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawshapecasthit_free(e51, 1)), bt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawshapecontact_free(e51, 1)), xt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawsoftbodybuilder_free(e51, 1)), St = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawsoftbodymaterial_free(e51, 1)), Ct = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawsoftbodyset_free(e51, 1)), wt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawsoftbodytearevent_free(e51, 1)), Tt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawsoftrecoverysettings_free(e51, 1)), Et = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawvhacdparameters_free(e51, 1)), Dt = typeof FinalizationRegistry > `u` ? { register: () => {
}, unregister: () => {
} } : new FinalizationRegistry((e51) => K.__wbg_rawvector_free(e51, 1));
function N(e51) {
  Gt === B.length && B.push(B.length + 1);
  let t2 = Gt;
  return Gt = B[t2], B[t2] = e51, t2;
}
function P(e51, t2) {
  if (!(e51 instanceof t2)) throw Error(`expected instance of ${t2.name}`);
}
function F(e51) {
  if (W == 1) throw Error(`out of js stack`);
  return B[--W] = e51, W;
}
function Ot(e51) {
  e51 < 1028 || (B[e51] = Gt, Gt = e51);
}
function I(e51, t2) {
  return e51 >>>= 0, Pt().subarray(e51 / 4, e51 / 4 + t2);
}
function kt(e51, t2) {
  return e51 >>>= 0, It().subarray(e51 / 8, e51 / 8 + t2);
}
function At(e51, t2) {
  return e51 >>>= 0, Rt().subarray(e51 / 4, e51 / 4 + t2);
}
function L(e51, t2) {
  return e51 >>>= 0, Vt().subarray(e51 / 4, e51 / 4 + t2);
}
function jt(e51, t2) {
  return e51 >>>= 0, Ut().subarray(e51 / 1, e51 / 1 + t2);
}
var Mt = null;
function R() {
  return (Mt === null || Mt.buffer.detached === true || Mt.buffer.detached === void 0 && Mt.buffer !== K.memory.buffer) && (Mt = new DataView(K.memory.buffer)), Mt;
}
var Nt = null;
function Pt() {
  return (Nt === null || Nt.byteLength === 0) && (Nt = new Float32Array(K.memory.buffer)), Nt;
}
var Ft = null;
function It() {
  return (Ft === null || Ft.byteLength === 0) && (Ft = new Float64Array(K.memory.buffer)), Ft;
}
var Lt = null;
function Rt() {
  return (Lt === null || Lt.byteLength === 0) && (Lt = new Int32Array(K.memory.buffer)), Lt;
}
function zt(e51, t2) {
  return Zt(e51 >>> 0, t2);
}
var Bt = null;
function Vt() {
  return (Bt === null || Bt.byteLength === 0) && (Bt = new Uint32Array(K.memory.buffer)), Bt;
}
var Ht = null;
function Ut() {
  return (Ht === null || Ht.byteLength === 0) && (Ht = new Uint8Array(K.memory.buffer)), Ht;
}
function z(e51) {
  return B[e51];
}
function Wt(e51, t2) {
  try {
    return e51.apply(this, t2);
  } catch (e52) {
    K.__wbindgen_export(N(e52));
  }
}
var B = Array(1024).fill(void 0);
B.push(void 0, null, true, false);
var Gt = B.length;
function V(e51) {
  return e51 == null;
}
function H(e51, t2) {
  let n2 = t2(e51.length * 4, 4) >>> 0;
  return Vt().set(e51, n2 / 4), G = e51.length, n2;
}
function U(e51, t2) {
  let n2 = t2(e51.length * 4, 4) >>> 0;
  return Pt().set(e51, n2 / 4), G = e51.length, n2;
}
function Kt(e51, t2) {
  let n2 = t2(e51.length * 4, 4) >>> 0, r2 = R();
  for (let t3 = 0; t3 < e51.length; t3++) r2.setUint32(n2 + 4 * t3, N(e51[t3]), true);
  return G = e51.length, n2;
}
var W = 1024;
function qt(e51) {
  let t2 = z(e51);
  return Ot(e51), t2;
}
var Jt = decoder();
Jt.decode();
var Yt = 2146435072, Xt = 0;
function Zt(e51, t2) {
  return Xt += t2, Xt >= Yt && (Jt = decoder(), Jt.decode(), Xt = t2), Jt.decode(Ut().subarray(e51, e51 + t2));
}
var G = 0, K;
function Qt(e51) {
  K = e51;
}
var $t = e({ __abort_handler: () => Zg, __instance_terminated: () => Qg, __wbg_rawbroadphase_free: () => tn, __wbg_rawccdsolver_free: () => nn, __wbg_rawcharactercollision_free: () => rn, __wbg_rawcolliderset_free: () => an, __wbg_rawcollidershapecasthit_free: () => on, __wbg_rawcontactforceevent_free: () => sn, __wbg_rawcontactmanifold_free: () => cn, __wbg_rawcontactpair_free: () => ln, __wbg_rawdebugrenderpipeline_free: () => un, __wbg_rawdeserializedworld_free: () => dn, __wbg_raweventqueue_free: () => fn, __wbg_rawgenericjoint_free: () => pn, __wbg_rawimpulsejointset_free: () => mn, __wbg_rawintegrationparameters_free: () => hn, __wbg_rawislandmanager_free: () => gn, __wbg_rawkinematiccharactercontroller_free: () => _n, __wbg_rawmultibodyjointset_free: () => vn, __wbg_rawnarrowphase_free: () => yn, __wbg_rawphysicspipeline_free: () => bn, __wbg_rawpidcontroller_free: () => xn, __wbg_rawpointcolliderprojection_free: () => Sn, __wbg_rawpointprojection_free: () => Cn, __wbg_rawraycolliderhit_free: () => wn, __wbg_rawraycolliderintersection_free: () => Tn, __wbg_rawrayintersection_free: () => En, __wbg_rawrigidbodyset_free: () => Dn, __wbg_rawrotation_free: () => On, __wbg_rawserializationpipeline_free: () => kn, __wbg_rawshape_free: () => An, __wbg_rawshapecasthit_free: () => jn, __wbg_rawshapecontact_free: () => Mn, __wbg_rawsoftbodybuilder_free: () => Nn, __wbg_rawsoftbodymaterial_free: () => Pn, __wbg_rawsoftbodyset_free: () => Fn, __wbg_rawsoftbodytearevent_free: () => In, __wbg_rawsoftrecoverysettings_free: () => Ln, __wbg_rawvector_free: () => Rn, __wbg_rawvhacdparameters_free: () => zn, __wbindgen_add_to_stack_pointer: () => e_, __wbindgen_export: () => $g, __wbindgen_export2: () => t_, __wbindgen_export3: () => n_, memory: () => en, rawbroadphase_castRay: () => Bn, rawbroadphase_castRayAndGetNormal: () => Vn, rawbroadphase_castShape: () => Hn, rawbroadphase_collidersWithAabbIntersectingAabb: () => Un, rawbroadphase_intersectionWithShape: () => Wn, rawbroadphase_intersectionsWithPoint: () => Gn, rawbroadphase_intersectionsWithRay: () => Kn, rawbroadphase_intersectionsWithShape: () => qn, rawbroadphase_new: () => Jn, rawbroadphase_projectPoint: () => Yn, rawbroadphase_projectPointAndGetFeature: () => Xn, rawccdsolver_new: () => Zn, rawcharactercollision_handle: () => Qn, rawcharactercollision_new: () => $n, rawcharactercollision_toi: () => er, rawcharactercollision_translationDeltaApplied: () => tr, rawcharactercollision_translationDeltaRemaining: () => nr, rawcharactercollision_worldNormal1: () => rr, rawcharactercollision_worldNormal2: () => ir, rawcharactercollision_worldWitness1: () => ar, rawcharactercollision_worldWitness2: () => or, rawcolliderset_coActiveCollisionTypes: () => sr, rawcolliderset_coActiveEvents: () => cr, rawcolliderset_coActiveHooks: () => lr, rawcolliderset_coCastCollider: () => ur, rawcolliderset_coCastRay: () => dr, rawcolliderset_coCastRayAndGetNormal: () => fr, rawcolliderset_coCastShape: () => pr, rawcolliderset_coCollisionGroups: () => mr, rawcolliderset_coCombineVoxelStates: () => hr, rawcolliderset_coCompoundFlags: () => gr, rawcolliderset_coContactCollider: () => _r, rawcolliderset_coContactForceEventThreshold: () => vr, rawcolliderset_coContactShape: () => yr, rawcolliderset_coContactSkin: () => br, rawcolliderset_coContainsPoint: () => xr, rawcolliderset_coDensity: () => Sr, rawcolliderset_coFriction: () => Cr, rawcolliderset_coFrictionCombineRule: () => wr, rawcolliderset_coHalfExtents: () => Tr, rawcolliderset_coHalfHeight: () => Er, rawcolliderset_coHalfspaceNormal: () => Dr, rawcolliderset_coHeightfieldHeights: () => Or, rawcolliderset_coHeightfieldScale: () => kr, rawcolliderset_coIndices: () => Ar, rawcolliderset_coIntersectsRay: () => jr, rawcolliderset_coIntersectsShape: () => Mr, rawcolliderset_coIsDeformable: () => Nr, rawcolliderset_coIsEnabled: () => Pr, rawcolliderset_coIsSensor: () => Fr, rawcolliderset_coMass: () => Ir, rawcolliderset_coParent: () => Lr, rawcolliderset_coPolylineFlags: () => Rr, rawcolliderset_coProjectPoint: () => zr, rawcolliderset_coPropagateVoxelChange: () => Br, rawcolliderset_coRadius: () => Vr, rawcolliderset_coRestitution: () => Hr, rawcolliderset_coRestitutionCombineRule: () => Ur, rawcolliderset_coRotation: () => Wr, rawcolliderset_coRotationWrtParent: () => Gr, rawcolliderset_coRoundRadius: () => Kr, rawcolliderset_coSetActiveCollisionTypes: () => qr, rawcolliderset_coSetActiveEvents: () => Jr, rawcolliderset_coSetActiveHooks: () => Yr, rawcolliderset_coSetCollisionGroups: () => Xr, rawcolliderset_coSetContactForceEventThreshold: () => Zr, rawcolliderset_coSetContactSkin: () => Qr, rawcolliderset_coSetDensity: () => $r, rawcolliderset_coSetEnabled: () => ei, rawcolliderset_coSetFriction: () => ti, rawcolliderset_coSetFrictionCombineRule: () => ni, rawcolliderset_coSetHalfExtents: () => ri, rawcolliderset_coSetHalfHeight: () => ii, rawcolliderset_coSetMass: () => ai, rawcolliderset_coSetMassProperties: () => oi, rawcolliderset_coSetRadius: () => si, rawcolliderset_coSetRestitution: () => ci, rawcolliderset_coSetRestitutionCombineRule: () => li, rawcolliderset_coSetRotation: () => ui, rawcolliderset_coSetRotationWrtParent: () => di, rawcolliderset_coSetRoundRadius: () => fi, rawcolliderset_coSetSensor: () => pi, rawcolliderset_coSetShape: () => mi, rawcolliderset_coSetSolverGroups: () => hi, rawcolliderset_coSetTranslation: () => gi, rawcolliderset_coSetTranslationWrtParent: () => _i, rawcolliderset_coSetVoxel: () => vi, rawcolliderset_coShape: () => yi, rawcolliderset_coShapeType: () => bi, rawcolliderset_coSoftBody: () => xi, rawcolliderset_coSolverGroups: () => Si, rawcolliderset_coTranslation: () => Ci, rawcolliderset_coTranslationWrtParent: () => wi, rawcolliderset_coTriMeshFlags: () => Ti, rawcolliderset_coVertices: () => Ei, rawcolliderset_coVolume: () => Di, rawcolliderset_coVoxelData: () => Oi, rawcolliderset_coVoxelSize: () => ki, rawcolliderset_contains: () => Ai, rawcolliderset_createCollider: () => ji, rawcolliderset_createDeformableCollider: () => Mi, rawcolliderset_forEachColliderHandle: () => Ni, rawcolliderset_isHandleValid: () => Pi, rawcolliderset_len: () => Fi, rawcolliderset_new: () => Ii, rawcolliderset_remove: () => Li, rawcollidershapecasthit_colliderHandle: () => Ri, rawcollidershapecasthit_getComponents: () => zi, rawcontactforceevent_collider1: () => Bi, rawcontactforceevent_collider2: () => Vi, rawcontactforceevent_max_force_direction: () => Hi, rawcontactforceevent_max_force_magnitude: () => Ui, rawcontactforceevent_total_force: () => Wi, rawcontactforceevent_total_force_magnitude: () => Gi, rawcontactmanifold_contact_dist: () => Ki, rawcontactmanifold_contact_fid1: () => qi, rawcontactmanifold_contact_fid2: () => Ji, rawcontactmanifold_contact_impulse: () => Yi, rawcontactmanifold_contact_local_p1: () => Xi, rawcontactmanifold_contact_local_p2: () => Zi, rawcontactmanifold_contact_tangent_impulse: () => Qi, rawcontactmanifold_friction: () => $i, rawcontactmanifold_local_n1: () => ea, rawcontactmanifold_local_n2: () => ta, rawcontactmanifold_normal: () => na, rawcontactmanifold_num_contacts: () => ra, rawcontactmanifold_num_solver_contacts: () => ia, rawcontactmanifold_restitution: () => aa, rawcontactmanifold_solver_contact_dist: () => oa, rawcontactmanifold_solver_contact_point: () => sa, rawcontactmanifold_solver_contact_tangent_velocity: () => ca, rawcontactmanifold_subshape1: () => la, rawcontactmanifold_subshape2: () => ua, rawcontactpair_collider1: () => da, rawcontactpair_collider2: () => fa, rawcontactpair_contactManifold: () => pa, rawcontactpair_numContactManifolds: () => ma, rawdebugrenderpipeline_colors: () => ha, rawdebugrenderpipeline_new: () => ga, rawdebugrenderpipeline_render: () => _a, rawdebugrenderpipeline_vertices: () => va, rawdeserializedworld_takeBodies: () => ya, rawdeserializedworld_takeBroadPhase: () => ba, rawdeserializedworld_takeColliders: () => xa, rawdeserializedworld_takeGravity: () => Sa, rawdeserializedworld_takeImpulseJoints: () => Ca, rawdeserializedworld_takeIntegrationParameters: () => wa, rawdeserializedworld_takeIslandManager: () => Ta, rawdeserializedworld_takeMultibodyJoints: () => Ea, rawdeserializedworld_takeNarrowPhase: () => Da, rawdeserializedworld_takeSoftBodies: () => Oa, raweventqueue_clear: () => ka, raweventqueue_drainCollisionEvents: () => Aa, raweventqueue_drainContactForceEvents: () => ja, raweventqueue_drainSoftBodyTearEvents: () => Ma, raweventqueue_new: () => Na, rawgenericjoint_fixed: () => Pa, rawgenericjoint_prismatic: () => Fa, rawgenericjoint_revolute: () => Ia, rawgenericjoint_rope: () => La, rawgenericjoint_spring: () => Ra, rawimpulsejointset_contains: () => za, rawimpulsejointset_createJoint: () => Ba, rawimpulsejointset_forEachJointAttachedToRigidBody: () => Va, rawimpulsejointset_forEachJointHandle: () => Ha, rawimpulsejointset_jointAnchor1: () => Ua, rawimpulsejointset_jointAnchor2: () => Wa, rawimpulsejointset_jointBodyHandle1: () => Ga, rawimpulsejointset_jointBodyHandle2: () => Ka, rawimpulsejointset_jointConfigureMotor: () => qa, rawimpulsejointset_jointConfigureMotorModel: () => Ja, rawimpulsejointset_jointConfigureMotorPosition: () => Ya, rawimpulsejointset_jointConfigureMotorVelocity: () => Xa, rawimpulsejointset_jointContactsEnabled: () => Za, rawimpulsejointset_jointLimitsEnabled: () => Qa, rawimpulsejointset_jointLimitsMax: () => $a, rawimpulsejointset_jointLimitsMin: () => eo, rawimpulsejointset_jointSetAnchor1: () => to, rawimpulsejointset_jointSetAnchor2: () => no, rawimpulsejointset_jointSetContactsEnabled: () => ro, rawimpulsejointset_jointSetFrameX1: () => io, rawimpulsejointset_jointSetFrameX2: () => ao, rawimpulsejointset_jointSetLimits: () => oo, rawimpulsejointset_jointSetLocalFrame1: () => so, rawimpulsejointset_jointSetLocalFrame2: () => co, rawimpulsejointset_jointSetMotorMaxForce: () => lo, rawimpulsejointset_jointType: () => uo, rawimpulsejointset_len: () => fo, rawimpulsejointset_new: () => po, rawimpulsejointset_remove: () => mo, rawintegrationparameters_contact_erp: () => ho, rawintegrationparameters_dt: () => go, rawintegrationparameters_lengthUnit: () => _o, rawintegrationparameters_maxCcdSubsteps: () => vo, rawintegrationparameters_new: () => yo, rawintegrationparameters_normalizedAllowedLinearError: () => bo, rawintegrationparameters_normalizedPredictionDistance: () => xo, rawintegrationparameters_numInternalPgsIterations: () => So, rawintegrationparameters_numSolverIterations: () => Co, rawintegrationparameters_set_contact_natural_frequency: () => wo, rawintegrationparameters_set_dt: () => To, rawintegrationparameters_set_lengthUnit: () => Eo, rawintegrationparameters_set_maxCcdSubsteps: () => Do, rawintegrationparameters_set_normalizedAllowedLinearError: () => Oo, rawintegrationparameters_set_normalizedPredictionDistance: () => ko, rawintegrationparameters_set_numInternalPgsIterations: () => Ao, rawintegrationparameters_set_numSolverIterations: () => jo, rawintegrationparameters_set_softBodiesContactStiffening: () => Mo, rawintegrationparameters_set_softBodiesFemLinearTolerance: () => No, rawintegrationparameters_set_softBodiesFemMaxDenseDofs: () => Po, rawintegrationparameters_set_softBodiesFemMaxLinearIterations: () => Fo, rawintegrationparameters_set_softBodiesMaxExtraSubsteps: () => Io, rawintegrationparameters_set_softBodiesRecovery: () => Lo, rawintegrationparameters_set_softBodiesResweepStrain: () => Ro, rawintegrationparameters_softBodiesContactStiffening: () => zo, rawintegrationparameters_softBodiesFemLinearTolerance: () => Bo, rawintegrationparameters_softBodiesFemMaxDenseDofs: () => Vo, rawintegrationparameters_softBodiesFemMaxLinearIterations: () => Ho, rawintegrationparameters_softBodiesMaxExtraSubsteps: () => Uo, rawintegrationparameters_softBodiesRecovery: () => Wo, rawintegrationparameters_softBodiesResweepStrain: () => Go, rawislandmanager_forEachActiveRigidBodyHandle: () => Ko, rawislandmanager_new: () => qo, rawkinematiccharactercontroller_autostepEnabled: () => Jo, rawkinematiccharactercontroller_autostepIncludesDynamicBodies: () => Yo, rawkinematiccharactercontroller_autostepMaxHeight: () => Xo, rawkinematiccharactercontroller_autostepMinWidth: () => Zo, rawkinematiccharactercontroller_computeColliderMovement: () => Qo, rawkinematiccharactercontroller_computedCollision: () => $o, rawkinematiccharactercontroller_computedGrounded: () => es, rawkinematiccharactercontroller_computedMovement: () => ts, rawkinematiccharactercontroller_disableAutostep: () => ns, rawkinematiccharactercontroller_disableSnapToGround: () => rs, rawkinematiccharactercontroller_enableAutostep: () => is, rawkinematiccharactercontroller_enableSnapToGround: () => as, rawkinematiccharactercontroller_maxSlopeClimbAngle: () => os, rawkinematiccharactercontroller_minSlopeSlideAngle: () => ss, rawkinematiccharactercontroller_new: () => cs, rawkinematiccharactercontroller_normalNudgeFactor: () => ls, rawkinematiccharactercontroller_numComputedCollisions: () => us, rawkinematiccharactercontroller_offset: () => ds, rawkinematiccharactercontroller_setMaxSlopeClimbAngle: () => fs, rawkinematiccharactercontroller_setMinSlopeSlideAngle: () => ps, rawkinematiccharactercontroller_setNormalNudgeFactor: () => ms, rawkinematiccharactercontroller_setOffset: () => hs, rawkinematiccharactercontroller_setSlideEnabled: () => gs, rawkinematiccharactercontroller_setUp: () => _s, rawkinematiccharactercontroller_slideEnabled: () => vs, rawkinematiccharactercontroller_snapToGroundDistance: () => ys, rawkinematiccharactercontroller_snapToGroundEnabled: () => bs, rawkinematiccharactercontroller_up: () => xs, rawmultibodyjointset_contains: () => Ss, rawmultibodyjointset_createJoint: () => Cs, rawmultibodyjointset_forEachJointAttachedToRigidBody: () => ws, rawmultibodyjointset_forEachJointHandle: () => Ts, rawmultibodyjointset_jointAnchor1: () => Es, rawmultibodyjointset_jointAnchor2: () => Ds, rawmultibodyjointset_jointContactsEnabled: () => Os, rawmultibodyjointset_jointFrameX1: () => ks, rawmultibodyjointset_jointFrameX2: () => As, rawmultibodyjointset_jointLimitsEnabled: () => js, rawmultibodyjointset_jointLimitsMax: () => Ms, rawmultibodyjointset_jointLimitsMin: () => Ns, rawmultibodyjointset_jointSetContactsEnabled: () => Ps, rawmultibodyjointset_jointType: () => Fs, rawmultibodyjointset_new: () => Is, rawmultibodyjointset_remove: () => Ls, rawnarrowphase_contact_pair: () => Rs, rawnarrowphase_contact_pairs_with: () => zs, rawnarrowphase_intersection_pair: () => Bs, rawnarrowphase_intersection_pairs_with: () => Vs, rawnarrowphase_new: () => Hs, rawphysicspipeline_is_profiler_enabled: () => Us, rawphysicspipeline_new: () => Ws, rawphysicspipeline_set_profiler_enabled: () => Gs, rawphysicspipeline_step: () => Ks, rawphysicspipeline_stepWithEvents: () => qs, rawphysicspipeline_timing_broad_phase: () => Js, rawphysicspipeline_timing_ccd: () => Ys, rawphysicspipeline_timing_ccd_broad_phase: () => Xs, rawphysicspipeline_timing_ccd_narrow_phase: () => Zs, rawphysicspipeline_timing_ccd_solver: () => Qs, rawphysicspipeline_timing_ccd_toi_computation: () => $s, rawphysicspipeline_timing_collision_detection: () => ec, rawphysicspipeline_timing_island_construction: () => tc, rawphysicspipeline_timing_narrow_phase: () => nc, rawphysicspipeline_timing_solver: () => rc, rawphysicspipeline_timing_step: () => ic, rawphysicspipeline_timing_user_changes: () => ac, rawphysicspipeline_timing_velocity_assembly: () => oc, rawphysicspipeline_timing_velocity_resolution: () => sc, rawphysicspipeline_timing_velocity_update: () => cc, rawphysicspipeline_timing_velocity_writeback: () => lc, rawpidcontroller_angular_correction: () => uc, rawpidcontroller_apply_angular_correction: () => dc, rawpidcontroller_apply_linear_correction: () => fc, rawpidcontroller_linear_correction: () => pc, rawpidcontroller_new: () => mc, rawpidcontroller_reset_integrals: () => hc, rawpidcontroller_set_axes_mask: () => gc, rawpidcontroller_set_kd: () => _c, rawpidcontroller_set_ki: () => vc, rawpidcontroller_set_kp: () => yc, rawpointcolliderprojection_colliderHandle: () => bc, rawpointcolliderprojection_featureId: () => xc, rawpointcolliderprojection_featureType: () => Sc, rawpointcolliderprojection_isInside: () => Cc, rawpointcolliderprojection_point: () => wc, rawpointprojection_isInside: () => Tc, rawpointprojection_point: () => Ec, rawraycolliderhit_colliderHandle: () => Dc, rawraycolliderhit_timeOfImpact: () => Oc, rawraycolliderintersection_colliderHandle: () => kc, rawraycolliderintersection_featureId: () => Ac, rawraycolliderintersection_featureType: () => jc, rawraycolliderintersection_normal: () => Mc, rawraycolliderintersection_time_of_impact: () => Nc, rawrayintersection_featureId: () => Pc, rawrayintersection_featureType: () => Fc, rawrayintersection_normal: () => Ic, rawrayintersection_time_of_impact: () => Lc, rawrigidbodyset_contains: () => Rc, rawrigidbodyset_createRigidBody: () => zc, rawrigidbodyset_forEachRigidBodyHandle: () => Bc, rawrigidbodyset_len: () => Vc, rawrigidbodyset_new: () => Hc, rawrigidbodyset_propagateModifiedBodyPositionsToColliders: () => Uc, rawrigidbodyset_rbAddForce: () => Wc, rawrigidbodyset_rbAddForceAtPoint: () => Gc, rawrigidbodyset_rbAddTorque: () => Kc, rawrigidbodyset_rbAdditionalPgsIterations: () => qc, rawrigidbodyset_rbAdditionalSolverIterations: () => Jc, rawrigidbodyset_rbAngularDamping: () => Yc, rawrigidbodyset_rbAngvel: () => Xc, rawrigidbodyset_rbApplyImpulse: () => Zc, rawrigidbodyset_rbApplyImpulseAtPoint: () => Qc, rawrigidbodyset_rbApplyTorqueImpulse: () => $c, rawrigidbodyset_rbBodyType: () => el, rawrigidbodyset_rbCollider: () => tl, rawrigidbodyset_rbDominanceGroup: () => nl, rawrigidbodyset_rbEffectiveAngularInertia: () => rl, rawrigidbodyset_rbEffectiveInvMass: () => il, rawrigidbodyset_rbEffectiveWorldInvInertia: () => al, rawrigidbodyset_rbEnableCcd: () => ol, rawrigidbodyset_rbGravityScale: () => sl, rawrigidbodyset_rbInvMass: () => cl, rawrigidbodyset_rbInvPrincipalInertia: () => ll, rawrigidbodyset_rbIsCcdEnabled: () => ul, rawrigidbodyset_rbIsDynamic: () => dl, rawrigidbodyset_rbIsEnabled: () => fl, rawrigidbodyset_rbIsFixed: () => pl, rawrigidbodyset_rbIsKinematic: () => ml, rawrigidbodyset_rbIsMoving: () => hl, rawrigidbodyset_rbIsSleeping: () => gl, rawrigidbodyset_rbIsSoftFrame: () => _l, rawrigidbodyset_rbLinearDamping: () => vl, rawrigidbodyset_rbLinvel: () => yl, rawrigidbodyset_rbLocalCom: () => bl, rawrigidbodyset_rbLockRotations: () => xl, rawrigidbodyset_rbLockTranslations: () => Sl, rawrigidbodyset_rbMass: () => Cl, rawrigidbodyset_rbNextRotation: () => wl, rawrigidbodyset_rbNextTranslation: () => Tl, rawrigidbodyset_rbNumColliders: () => El, rawrigidbodyset_rbPrincipalInertia: () => Dl, rawrigidbodyset_rbRecomputeMassPropertiesFromColliders: () => Ol, rawrigidbodyset_rbResetForces: () => kl, rawrigidbodyset_rbResetTorques: () => Al, rawrigidbodyset_rbRotation: () => jl, rawrigidbodyset_rbSetAdditionalMass: () => Ml, rawrigidbodyset_rbSetAdditionalMassProperties: () => Nl, rawrigidbodyset_rbSetAdditionalPgsIterations: () => Pl, rawrigidbodyset_rbSetAdditionalSolverIterations: () => Fl, rawrigidbodyset_rbSetAngularDamping: () => Il, rawrigidbodyset_rbSetAngvel: () => Ll, rawrigidbodyset_rbSetBodyType: () => Rl, rawrigidbodyset_rbSetDominanceGroup: () => zl, rawrigidbodyset_rbSetEnabled: () => Bl, rawrigidbodyset_rbSetEnabledTranslations: () => Vl, rawrigidbodyset_rbSetGravityScale: () => Hl, rawrigidbodyset_rbSetLinearDamping: () => Ul, rawrigidbodyset_rbSetLinvel: () => Wl, rawrigidbodyset_rbSetNextKinematicRotation: () => Gl, rawrigidbodyset_rbSetNextKinematicTranslation: () => Kl, rawrigidbodyset_rbSetRotation: () => ql, rawrigidbodyset_rbSetSoftCcdPrediction: () => Jl, rawrigidbodyset_rbSetTranslation: () => Yl, rawrigidbodyset_rbSetUserData: () => Xl, rawrigidbodyset_rbSleep: () => Zl, rawrigidbodyset_rbSoftBody: () => Ql, rawrigidbodyset_rbSoftCcdPrediction: () => $l, rawrigidbodyset_rbSoftCluster: () => eu, rawrigidbodyset_rbTranslation: () => tu, rawrigidbodyset_rbUserData: () => nu, rawrigidbodyset_rbUserForce: () => ru, rawrigidbodyset_rbUserTorque: () => iu, rawrigidbodyset_rbVelocityAtPoint: () => au, rawrigidbodyset_rbWakeUp: () => ou, rawrigidbodyset_rbWorldCom: () => su, rawrigidbodyset_remove: () => cu, rawrotation_angle: () => lu, rawrotation_fromAngle: () => uu, rawrotation_identity: () => du, rawrotation_im: () => fu, rawrotation_re: () => pu, rawserializationpipeline_deserializeAll: () => mu, rawserializationpipeline_new: () => hu, rawserializationpipeline_serializeAll: () => gu, rawshape_ball: () => _u, rawshape_capsule: () => vu, rawshape_castRay: () => yu, rawshape_castRayAndGetNormal: () => bu, rawshape_castShape: () => xu, rawshape_compound: () => Su, rawshape_compoundFlags: () => Cu, rawshape_compoundLen: () => wu, rawshape_compoundRotation: () => Tu, rawshape_compoundShape: () => Eu, rawshape_compoundTranslation: () => Du, rawshape_contactShape: () => Ou, rawshape_containsPoint: () => ku, rawshape_convexDecomposition: () => Au, rawshape_convexDecompositionWithParams: () => ju, rawshape_convexHull: () => Mu, rawshape_convexPolyline: () => Nu, rawshape_cuboid: () => Pu, rawshape_halfExtents: () => Fu, rawshape_halfHeight: () => Iu, rawshape_halfspace: () => Lu, rawshape_halfspaceNormal: () => Ru, rawshape_heightfield: () => zu, rawshape_heightfieldHeights: () => Bu, rawshape_heightfieldScale: () => Vu, rawshape_indices: () => Hu, rawshape_intersectsRay: () => Uu, rawshape_intersectsShape: () => Wu, rawshape_polyline: () => Gu, rawshape_polylineFlags: () => Ku, rawshape_projectPoint: () => qu, rawshape_radius: () => Ju, rawshape_roundConvexHull: () => Yu, rawshape_roundConvexPolyline: () => Xu, rawshape_roundCuboid: () => Zu, rawshape_roundRadius: () => Qu, rawshape_roundTriangle: () => $u, rawshape_segment: () => ed, rawshape_shapeType: () => td, rawshape_triMeshFlags: () => nd, rawshape_triangle: () => rd, rawshape_trimesh: () => id, rawshape_vertices: () => ad, rawshape_voxelData: () => od, rawshape_voxelSize: () => sd, rawshape_voxels: () => cd, rawshape_voxelsFromPoints: () => ld, rawshapecasthit_getComponents: () => ud, rawshapecontact_getComponents: () => dd, rawsoftbodybuilder_addEdges: () => fd, rawsoftbodybuilder_append: () => pd, rawsoftbodybuilder_cellEdges: () => md, rawsoftbodybuilder_disk: () => hd, rawsoftbodybuilder_grid: () => gd, rawsoftbodybuilder_material: () => _d, rawsoftbodybuilder_new: () => vd, rawsoftbodybuilder_numParticles: () => yd, rawsoftbodybuilder_particlePositions: () => bd, rawsoftbodybuilder_polygon: () => xd, rawsoftbodybuilder_polyline: () => Sd, rawsoftbodybuilder_rope: () => Cd, rawsoftbodybuilder_setAdditionalPgsIterations: () => wd, rawsoftbodybuilder_setAdditionalSolverIterations: () => Td, rawsoftbodybuilder_setBendEdges: () => Ed, rawsoftbodybuilder_setCanSleep: () => Dd, rawsoftbodybuilder_setCellModel: () => Od, rawsoftbodybuilder_setCells: () => kd, rawsoftbodybuilder_setDominanceGroup: () => Ad, rawsoftbodybuilder_setEdgeSoftness: () => jd, rawsoftbodybuilder_setEdgeTearResistance: () => Md, rawsoftbodybuilder_setEdges: () => Nd, rawsoftbodybuilder_setGravityScale: () => Pd, rawsoftbodybuilder_setLinearDamping: () => Fd, rawsoftbodybuilder_setMass: () => Id, rawsoftbodybuilder_setMasses: () => Ld, rawsoftbodybuilder_setMaterial: () => Rd, rawsoftbodybuilder_setNoSurfaceCollider: () => zd, rawsoftbodybuilder_setOriented: () => Bd, rawsoftbodybuilder_setParticleMass: () => Vd, rawsoftbodybuilder_setParticleRadius: () => Hd, rawsoftbodybuilder_setPinnedParticles: () => Ud, rawsoftbodybuilder_setPositions: () => Wd, rawsoftbodybuilder_setSelfContacts: () => Gd, rawsoftbodybuilder_setShapeMatching: () => Kd, rawsoftbodybuilder_setSkin: () => qd, rawsoftbodybuilder_setSkinCollision: () => Jd, rawsoftbodybuilder_setSoftness: () => Yd, rawsoftbodybuilder_setSolver: () => Xd, rawsoftbodybuilder_setSurface: () => Zd, rawsoftbodybuilder_setSurfaceCollider: () => Qd, rawsoftbodybuilder_setTensionOnly: () => $d, rawsoftbodybuilder_setVolumeFactor: () => ef, rawsoftbodybuilder_setVolumePreservation: () => tf, rawsoftbodybuilder_surfaceEdges: () => nf, rawsoftbodybuilder_translated: () => rf, rawsoftbodybuilder_volumetric: () => af, rawsoftbodymaterial_bendDampingRatio: () => of, rawsoftbodymaterial_bendFrequency: () => sf, rawsoftbodymaterial_deformationDamping: () => cf, rawsoftbodymaterial_edgeDampingRatio: () => lf, rawsoftbodymaterial_edgeFrequency: () => uf, rawsoftbodymaterial_edgePlasticCreep: () => df, rawsoftbodymaterial_edgePlasticFlow: () => ff, rawsoftbodymaterial_edgePlasticMax: () => pf, rawsoftbodymaterial_edgePlasticYield: () => mf, rawsoftbodymaterial_elasticDampingRatio: () => hf, rawsoftbodymaterial_interiorStrength: () => gf, rawsoftbodymaterial_maxTearsPerStep: () => _f, rawsoftbodymaterial_minPiece: () => vf, rawsoftbodymaterial_new: () => yf, rawsoftbodymaterial_plasticCreep: () => bf, rawsoftbodymaterial_plasticMax: () => xf, rawsoftbodymaterial_plasticYield: () => Sf, rawsoftbodymaterial_poissonRatio: () => Cf, rawsoftbodymaterial_set_bendDampingRatio: () => wf, rawsoftbodymaterial_set_bendFrequency: () => Tf, rawsoftbodymaterial_set_deformationDamping: () => Ef, rawsoftbodymaterial_set_edgeDampingRatio: () => Df, rawsoftbodymaterial_set_edgeFrequency: () => Of, rawsoftbodymaterial_set_edgePlasticCreep: () => kf, rawsoftbodymaterial_set_edgePlasticFlow: () => Af, rawsoftbodymaterial_set_edgePlasticMax: () => jf, rawsoftbodymaterial_set_edgePlasticYield: () => Mf, rawsoftbodymaterial_set_elasticDampingRatio: () => Nf, rawsoftbodymaterial_set_interiorStrength: () => Pf, rawsoftbodymaterial_set_maxTearsPerStep: () => Ff, rawsoftbodymaterial_set_minPiece: () => If, rawsoftbodymaterial_set_plasticCreep: () => Lf, rawsoftbodymaterial_set_plasticMax: () => Rf, rawsoftbodymaterial_set_plasticYield: () => zf, rawsoftbodymaterial_set_poissonRatio: () => Bf, rawsoftbodymaterial_set_shapeMatchingDampingRatio: () => Vf, rawsoftbodymaterial_set_shapeMatchingFrequency: () => Hf, rawsoftbodymaterial_set_tearForce: () => Uf, rawsoftbodymaterial_set_tearSmoothing: () => Wf, rawsoftbodymaterial_set_tearStrain: () => Gf, rawsoftbodymaterial_set_volumeDampingRatio: () => Kf, rawsoftbodymaterial_set_volumeFrequency: () => qf, rawsoftbodymaterial_set_youngModulus: () => Jf, rawsoftbodymaterial_shapeMatchingDampingRatio: () => Yf, rawsoftbodymaterial_shapeMatchingFrequency: () => Xf, rawsoftbodymaterial_tearForce: () => Zf, rawsoftbodymaterial_tearSmoothing: () => Qf, rawsoftbodymaterial_tearStrain: () => $f, rawsoftbodymaterial_tears: () => ep, rawsoftbodymaterial_uniform: () => tp, rawsoftbodymaterial_volumeDampingRatio: () => np, rawsoftbodymaterial_volumeFrequency: () => rp, rawsoftbodymaterial_youngModulus: () => ip, rawsoftbodyset_addCluster: () => ap, rawsoftbodyset_contains: () => op, rawsoftbodyset_cut: () => sp, rawsoftbodyset_forEachSoftBodyHandle: () => cp, rawsoftbodyset_insert: () => lp, rawsoftbodyset_len: () => up, rawsoftbodyset_new: () => dp, rawsoftbodyset_remove: () => fp, rawsoftbodyset_removeCluster: () => pp, rawsoftbodyset_sbAddForce: () => mp, rawsoftbodyset_sbAddParticleForce: () => hp, rawsoftbodyset_sbApplyImpulse: () => gp, rawsoftbodyset_sbApplyImpulseAtPoint: () => _p, rawsoftbodyset_sbApplyParticleImpulse: () => vp, rawsoftbodyset_sbApplyRadialImpulse: () => yp, rawsoftbodyset_sbAttachParticle: () => bp, rawsoftbodyset_sbAttachmentBody: () => xp, rawsoftbodyset_sbAttachmentParticle: () => Sp, rawsoftbodyset_sbBoundary: () => Cp, rawsoftbodyset_sbCellModel: () => wp, rawsoftbodyset_sbCellRestVolume: () => Tp, rawsoftbodyset_sbCellStiffnessScale: () => Ep, rawsoftbodyset_sbCellStress: () => Dp, rawsoftbodyset_sbCellTearResistance: () => Op, rawsoftbodyset_sbCells: () => kp, rawsoftbodyset_sbCenterOfMass: () => Ap, rawsoftbodyset_sbClusterParticles: () => jp, rawsoftbodyset_sbClusterProxy: () => Mp, rawsoftbodyset_sbClusterShapeMatchingEnabled: () => Np, rawsoftbodyset_sbDetachParticle: () => Pp, rawsoftbodyset_sbEdgeImpulse: () => Fp, rawsoftbodyset_sbEdgeIsBend: () => Ip, rawsoftbodyset_sbEdgePlasticStrain: () => Lp, rawsoftbodyset_sbEdgeRestLength: () => Rp, rawsoftbodyset_sbEdgeStress: () => zp, rawsoftbodyset_sbEdgeTearResistance: () => Bp, rawsoftbodyset_sbEdges: () => Vp, rawsoftbodyset_sbEnableClusterShapeMatching: () => Hp, rawsoftbodyset_sbEnableVolumePreservation: () => Up, rawsoftbodyset_sbGravityScale: () => Wp, rawsoftbodyset_sbHasPendingTears: () => Gp, rawsoftbodyset_sbIsClusterLive: () => Kp, rawsoftbodyset_sbIsEnabled: () => qp, rawsoftbodyset_sbIsParticleDamaged: () => Jp, rawsoftbodyset_sbIsParticleOnSurface: () => Yp, rawsoftbodyset_sbIsParticlePinned: () => Xp, rawsoftbodyset_sbIsSleeping: () => Zp, rawsoftbodyset_sbLinearDamping: () => Qp, rawsoftbodyset_sbMass: () => $p, rawsoftbodyset_sbMaterial: () => em, rawsoftbodyset_sbMeshCluster: () => tm, rawsoftbodyset_sbMeshCollider: () => nm, rawsoftbodyset_sbMeshCollisionEnabled: () => rm, rawsoftbodyset_sbMeshIndices: () => im, rawsoftbodyset_sbMeshIsOriented: () => am, rawsoftbodyset_sbMeshIsSkinned: () => om, rawsoftbodyset_sbMeshOfCollider: () => sm, rawsoftbodyset_sbMeshVertices: () => cm, rawsoftbodyset_sbNumAttachments: () => lm, rawsoftbodyset_sbNumCells: () => um, rawsoftbodyset_sbNumClusters: () => dm, rawsoftbodyset_sbNumEdges: () => fm, rawsoftbodyset_sbNumMeshes: () => pm, rawsoftbodyset_sbNumParticles: () => mm, rawsoftbodyset_sbOrigin: () => hm, rawsoftbodyset_sbParticleMass: () => gm, rawsoftbodyset_sbParticlePosition: () => _m, rawsoftbodyset_sbParticlePositions: () => vm, rawsoftbodyset_sbParticleRadius: () => ym, rawsoftbodyset_sbParticleRestPosition: () => bm, rawsoftbodyset_sbParticleVelocities: () => xm, rawsoftbodyset_sbParticleVelocity: () => Sm, rawsoftbodyset_sbPieces: () => Cm, rawsoftbodyset_sbResetForces: () => wm, rawsoftbodyset_sbResetPlasticity: () => Tm, rawsoftbodyset_sbRestVolume: () => Em, rawsoftbodyset_sbRootBody: () => Dm, rawsoftbodyset_sbSetAdditionalPgsIterations: () => Om, rawsoftbodyset_sbSetClusterEdgeSoftness: () => km, rawsoftbodyset_sbSetClusterKinematicTarget: () => Am, rawsoftbodyset_sbSetClusterPinned: () => jm, rawsoftbodyset_sbSetClusterStiffnessScale: () => Mm, rawsoftbodyset_sbSetClusterTearResistance: () => Nm, rawsoftbodyset_sbSetEnabled: () => Pm, rawsoftbodyset_sbSetMaterial: () => Fm, rawsoftbodyset_sbSetParticleKinematicTarget: () => Im, rawsoftbodyset_sbSetParticlePinned: () => Lm, rawsoftbodyset_sbSetParticlePosition: () => Rm, rawsoftbodyset_sbSetParticleVelocity: () => zm, rawsoftbodyset_sbSetSolver: () => Bm, rawsoftbodyset_sbSetUserData: () => Vm, rawsoftbodyset_sbSetVolumeFactor: () => Hm, rawsoftbodyset_sbSolver: () => Um, rawsoftbodyset_sbTearCell: () => Wm, rawsoftbodyset_sbTearEdge: () => Gm, rawsoftbodyset_sbTopologyVersion: () => Km, rawsoftbodyset_sbUserData: () => qm, rawsoftbodyset_sbVolume: () => Jm, rawsoftbodyset_sbVolumeFactor: () => Ym, rawsoftbodyset_sbVolumePreservationEnabled: () => Xm, rawsoftbodyset_sbWakeUp: () => Zm, rawsoftbodyset_tear: () => Qm, rawsoftbodyset_wakeUp: () => $m, rawsoftbodytearevent_clusterSplitCluster: () => eh, rawsoftbodytearevent_clusterSplitKeepsProxy: () => th, rawsoftbodytearevent_clusterSplitProxy: () => nh, rawsoftbodytearevent_clusterSplitSoftBody: () => rh, rawsoftbodytearevent_clusterSplitSource: () => ih, rawsoftbodytearevent_insertedParticles: () => ah, rawsoftbodytearevent_movedJoint: () => oh, rawsoftbodytearevent_movedJointFrom: () => sh, rawsoftbodytearevent_movedJointTo: () => ch, rawsoftbodytearevent_numClusterSplits: () => lh, rawsoftbodytearevent_numMovedJoints: () => uh, rawsoftbodytearevent_numPieces: () => dh, rawsoftbodytearevent_particleDestinationBody: () => fh, rawsoftbodytearevent_particleDestinationIndex: () => ph, rawsoftbodytearevent_pieceClusters: () => mh, rawsoftbodytearevent_pieceParticles: () => hh, rawsoftbodytearevent_pieceSoftBody: () => gh, rawsoftbodytearevent_removedEdges: () => _h, rawsoftbodytearevent_seeds: () => vh, rawsoftbodytearevent_softBody: () => yh, rawsoftbodytearevent_splitParticles: () => bh, rawsoftbodytearevent_tornCells: () => xh, rawsoftbodytearevent_tornEdges: () => Sh, rawsoftrecoverysettings_authoredVelocityMargin: () => Ch, rawsoftrecoverysettings_crossBodyDetection: () => wh, rawsoftrecoverysettings_crossBodyExpelGate: () => Th, rawsoftrecoverysettings_crossingRepulsion: () => Eh, rawsoftrecoverysettings_crossingRepulsionGuide: () => Dh, rawsoftrecoverysettings_crossingRepulsionSelfGuide: () => Oh, rawsoftrecoverysettings_detectionMotionGating: () => kh, rawsoftrecoverysettings_edgeSpeculation: () => Ah, rawsoftrecoverysettings_edgeStandDown: () => jh, rawsoftrecoverysettings_invertedCellDetection: () => Mh, rawsoftrecoverysettings_new: () => Nh, rawsoftrecoverysettings_overlapConstraintPace: () => Ph, rawsoftrecoverysettings_overlapConstraints: () => Fh, rawsoftrecoverysettings_overlapEdgeStandDown: () => Ih, rawsoftrecoverysettings_overlapKeptDepth: () => Lh, rawsoftrecoverysettings_overlapMultiVolume: () => Rh, rawsoftrecoverysettings_overlapNormalPush: () => zh, rawsoftrecoverysettings_overlapPatchConstraints: () => Bh, rawsoftrecoverysettings_overlapPatience: () => Vh, rawsoftrecoverysettings_overlapProgressMargin: () => Hh, rawsoftrecoverysettings_overlapRigid: () => Uh, rawsoftrecoverysettings_overlapSelfRegions: () => Wh, rawsoftrecoverysettings_overlapSkinVolume: () => Gh, rawsoftrecoverysettings_overlapSkipSelfTangled: () => Kh, rawsoftrecoverysettings_overlapSplit: () => qh, rawsoftrecoverysettings_recoveryPace: () => Jh, rawsoftrecoverysettings_selfCrossingDetection: () => Yh, rawsoftrecoverysettings_selfStandDown: () => Xh, rawsoftrecoverysettings_set_authoredVelocityMargin: () => Zh, rawsoftrecoverysettings_set_crossBodyDetection: () => Qh, rawsoftrecoverysettings_set_crossBodyExpelGate: () => $h, rawsoftrecoverysettings_set_crossingRepulsion: () => eg, rawsoftrecoverysettings_set_crossingRepulsionGuide: () => tg, rawsoftrecoverysettings_set_crossingRepulsionSelfGuide: () => ng, rawsoftrecoverysettings_set_detectionMotionGating: () => rg, rawsoftrecoverysettings_set_edgeSpeculation: () => ig, rawsoftrecoverysettings_set_edgeStandDown: () => ag, rawsoftrecoverysettings_set_invertedCellDetection: () => og, rawsoftrecoverysettings_set_overlapConstraintPace: () => sg, rawsoftrecoverysettings_set_overlapConstraints: () => cg, rawsoftrecoverysettings_set_overlapEdgeStandDown: () => lg, rawsoftrecoverysettings_set_overlapKeptDepth: () => ug, rawsoftrecoverysettings_set_overlapMultiVolume: () => dg, rawsoftrecoverysettings_set_overlapNormalPush: () => fg, rawsoftrecoverysettings_set_overlapPatchConstraints: () => pg, rawsoftrecoverysettings_set_overlapPatience: () => mg, rawsoftrecoverysettings_set_overlapProgressMargin: () => hg, rawsoftrecoverysettings_set_overlapRigid: () => gg, rawsoftrecoverysettings_set_overlapSelfRegions: () => _g, rawsoftrecoverysettings_set_overlapSkinVolume: () => vg, rawsoftrecoverysettings_set_overlapSkipSelfTangled: () => yg, rawsoftrecoverysettings_set_overlapSplit: () => bg, rawsoftrecoverysettings_set_recoveryPace: () => xg, rawsoftrecoverysettings_set_selfCrossingDetection: () => Sg, rawsoftrecoverysettings_set_selfStandDown: () => Cg, rawvector_new: () => wg, rawvector_set_x: () => Tg, rawvector_set_y: () => Eg, rawvector_x: () => Dg, rawvector_xy: () => Og, rawvector_y: () => kg, rawvector_yx: () => Ag, rawvector_zero: () => jg, rawvhacdparameters_alpha: () => Mg, rawvhacdparameters_beta: () => Ng, rawvhacdparameters_concavity: () => Pg, rawvhacdparameters_convex_hull_approximation: () => Fg, rawvhacdparameters_convex_hull_downsampling: () => Ig, rawvhacdparameters_max_convex_hulls: () => Lg, rawvhacdparameters_new: () => Rg, rawvhacdparameters_plane_downsampling: () => zg, rawvhacdparameters_resolution: () => Bg, rawvhacdparameters_set_alpha: () => Vg, rawvhacdparameters_set_beta: () => Hg, rawvhacdparameters_set_concavity: () => Ug, rawvhacdparameters_set_convex_hull_approximation: () => Wg, rawvhacdparameters_set_convex_hull_downsampling: () => Gg, rawvhacdparameters_set_max_convex_hulls: () => Kg, rawvhacdparameters_set_plane_downsampling: () => qg, rawvhacdparameters_set_resolution: () => Jg, reserve_memory: () => Yg, version: () => Xg });
URL = globalThis.URL;let en,tn,nn,rn,an,on,sn,cn,ln,un,dn,fn,pn,mn,hn,gn,_n,vn,yn,bn,xn,Sn,Cn,wn,Tn,En,Dn,On,kn,An,jn,Mn,Nn,Pn,Fn,In,Ln,Rn,zn,Bn,Vn,Hn,Un,Wn,Gn,Kn,qn,Jn,Yn,Xn,Zn,Qn,$n,er,tr,nr,rr,ir,ar,or,sr,cr,lr,ur,dr,fr,pr,mr,hr,gr,_r,vr,yr,br,xr,Sr,Cr,wr,Tr,Er,Dr,Or,kr,Ar,jr,Mr,Nr,Pr,Fr,Ir,Lr,Rr,zr,Br,Vr,Hr,Ur,Wr,Gr,Kr,qr,Jr,Yr,Xr,Zr,Qr,$r,ei,ti,ni,ri,ii,ai,oi,si,ci,li,ui,di,fi,pi,mi,hi,gi,_i,vi,yi,bi,xi,Si,Ci,wi,Ti,Ei,Di,Oi,ki,Ai,ji,Mi,Ni,Pi,Fi,Ii,Li,Ri,zi,Bi,Vi,Hi,Ui,Wi,Gi,Ki,qi,Ji,Yi,Xi,Zi,Qi,$i,ea,ta,na,ra,ia,aa,oa,sa,ca,la,ua,da,fa,pa,ma,ha,ga,_a,va,ya,ba,xa,Sa,Ca,wa,Ta,Ea,Da,Oa,ka,Aa,ja,Ma,Na,Pa,Fa,Ia,La,Ra,za,Ba,Va,Ha,Ua,Wa,Ga,Ka,qa,Ja,Ya,Xa,Za,Qa,$a,eo,to,no,ro,io,ao,oo,so,co,lo,uo,fo,po,mo,ho,go,_o,vo,yo,bo,xo,So,Co,wo,To,Eo,Do,Oo,ko,Ao,jo,Mo,No,Po,Fo,Io,Lo,Ro,zo,Bo,Vo,Ho,Uo,Wo,Go,Ko,qo,Jo,Yo,Xo,Zo,Qo,$o,es,ts,ns,rs,is,as,os,ss,cs,ls,us,ds,fs,ps,ms,hs,gs,_s,vs,ys,bs,xs,Ss,Cs,ws,Ts,Es,Ds,Os,ks,As,js,Ms,Ns,Ps,Fs,Is,Ls,Rs,zs,Bs,Vs,Hs,Us,Ws,Gs,Ks,qs,Js,Ys,Xs,Zs,Qs,$s,ec,tc,nc,rc,ic,ac,oc,sc,cc,lc,uc,dc,fc,pc,mc,hc,gc,_c,vc,yc,bc,xc,Sc,Cc,wc,Tc,Ec,Dc,Oc,kc,Ac,jc,Mc,Nc,Pc,Fc,Ic,Lc,Rc,zc,Bc,Vc,Hc,Uc,Wc,Gc,Kc,qc,Jc,Yc,Xc,Zc,Qc,$c,el,tl,nl,rl,il,al,ol,sl,cl,ll,ul,dl,fl,pl,ml,hl,gl,_l,vl,yl,bl,xl,Sl,Cl,wl,Tl,El,Dl,Ol,kl,Al,jl,Ml,Nl,Pl,Fl,Il,Ll,Rl,zl,Bl,Vl,Hl,Ul,Wl,Gl,Kl,ql,Jl,Yl,Xl,Zl,Ql,$l,eu,tu,nu,ru,iu,au,ou,su,cu,lu,uu,du,fu,pu,mu,hu,gu,_u,vu,yu,bu,xu,Su,Cu,wu,Tu,Eu,Du,Ou,ku,Au,ju,Mu,Nu,Pu,Fu,Iu,Lu,Ru,zu,Bu,Vu,Hu,Uu,Wu,Gu,Ku,qu,Ju,Yu,Xu,Zu,Qu,$u,ed,td,nd,rd,id,ad,od,sd,cd,ld,ud,dd,fd,pd,md,hd,gd,_d,vd,yd,bd,xd,Sd,Cd,wd,Td,Ed,Dd,Od,kd,Ad,jd,Md,Nd,Pd,Fd,Id,Ld,Rd,zd,Bd,Vd,Hd,Ud,Wd,Gd,Kd,qd,Jd,Yd,Xd,Zd,Qd,$d,ef,tf,nf,rf,af,of,sf,cf,lf,uf,df,ff,pf,mf,hf,gf,_f,vf,yf,bf,xf,Sf,Cf,wf,Tf,Ef,Df,Of,kf,Af,jf,Mf,Nf,Pf,Ff,If,Lf,Rf,zf,Bf,Vf,Hf,Uf,Wf,Gf,Kf,qf,Jf,Yf,Xf,Zf,Qf,$f,ep,tp,np,rp,ip,ap,op,sp,cp,lp,up,dp,fp,pp,mp,hp,gp,_p,vp,yp,bp,xp,Sp,Cp,wp,Tp,Ep,Dp,Op,kp,Ap,jp,Mp,Np,Pp,Fp,Ip,Lp,Rp,zp,Bp,Vp,Hp,Up,Wp,Gp,Kp,qp,Jp,Yp,Xp,Zp,Qp,$p,em,tm,nm,rm,im,am,om,sm,cm,lm,um,dm,fm,pm,mm,hm,gm,_m,vm,ym,bm,xm,Sm,Cm,wm,Tm,Em,Dm,Om,km,Am,jm,Mm,Nm,Pm,Fm,Im,Lm,Rm,zm,Bm,Vm,Hm,Um,Wm,Gm,Km,qm,Jm,Ym,Xm,Zm,Qm,$m,eh,th,nh,rh,ih,ah,oh,sh,ch,lh,uh,dh,fh,ph,mh,hh,gh,_h,vh,yh,bh,xh,Sh,Ch,wh,Th,Eh,Dh,Oh,kh,Ah,jh,Mh,Nh,Ph,Fh,Ih,Lh,Rh,zh,Bh,Vh,Hh,Uh,Wh,Gh,Kh,qh,Jh,Yh,Xh,Zh,Qh,$h,eg,tg,ng,rg,ig,ag,og,sg,cg,lg,ug,dg,fg,pg,mg,hg,gg,_g,vg,yg,bg,xg,Sg,Cg,wg,Tg,Eg,Dg,Og,kg,Ag,jg,Mg,Ng,Pg,Fg,Ig,Lg,Rg,zg,Bg,Vg,Hg,Ug,Wg,Gg,Kg,qg,Jg,Yg,Xg,Zg,Qg,$g,e_,t_,n_;
export async function initRapier(source,instantiate){const exports=await instantiate(source,{ "./rapier_wasm2d_bg.js": { __wbindgen_object_drop_ref: Ue, __wbg_call_187d372bd5fdd4aa: Se, __wbg_rawraycolliderintersection_new: Me, __wbg_call_939a2607c4484b0b: Ce, __wbg_rawcontactforceevent_new: je, __wbg_rawsoftbodytearevent_new: Pe, __wbg_bind_e7f12e49a3040c89: be, __wbg_call_1875a20c43a36133: xe, __wbg_rawshape_unwrap: Ne, __wbg_performance_3fcf6e32a7e1ed0a: ke, __wbg_now_e7c6795a7f81e10f: Oe, __wbindgen_object_clone_ref: He, __wbg_length_7f3c00c40364105e: Te, __wbg_prototypesetcall_bc27214492979395: Ae, __wbg_length_58572db4c38f3c3e: we, __wbg_set_070bd465f1c195a4: Fe, __wbg_new_from_slice_9a868026ffa4208a: Ee, __wbg_set_index_3a9fd81ba7ece0c0: Ie, __wbg_new_with_length_cc0362bfe8499e5a: De, __wbg_static_accessor_GLOBAL_THIS_10fb7dc1ae063179: Re, __wbg_static_accessor_SELF_0b583911f537483a: ze, __wbg_static_accessor_GLOBAL_266715b9d96ba635: Le, __wbg_static_accessor_WINDOW_d7f903d1508cbdc4: Be, __wbg___wbindgen_number_get_2e0e7dee9f701a71: ve, __wbg___wbindgen_throw_41e9ee4f547fc59a: ye, __wbg___wbindgen_boolean_get_5b446f51afd21013: he, __wbg___wbindgen_is_function_1f9d30630b8b1d3d: ge, __wbg___wbindgen_is_undefined_8865fb403f8fe9d8: _e, __wbindgen_generic_0000000000000001: Ve } });({ memory: en, __wbg_rawbroadphase_free: tn, __wbg_rawccdsolver_free: nn, __wbg_rawcharactercollision_free: rn, __wbg_rawcolliderset_free: an, __wbg_rawcollidershapecasthit_free: on, __wbg_rawcontactforceevent_free: sn, __wbg_rawcontactmanifold_free: cn, __wbg_rawcontactpair_free: ln, __wbg_rawdebugrenderpipeline_free: un, __wbg_rawdeserializedworld_free: dn, __wbg_raweventqueue_free: fn, __wbg_rawgenericjoint_free: pn, __wbg_rawimpulsejointset_free: mn, __wbg_rawintegrationparameters_free: hn, __wbg_rawislandmanager_free: gn, __wbg_rawkinematiccharactercontroller_free: _n, __wbg_rawmultibodyjointset_free: vn, __wbg_rawnarrowphase_free: yn, __wbg_rawphysicspipeline_free: bn, __wbg_rawpidcontroller_free: xn, __wbg_rawpointcolliderprojection_free: Sn, __wbg_rawpointprojection_free: Cn, __wbg_rawraycolliderhit_free: wn, __wbg_rawraycolliderintersection_free: Tn, __wbg_rawrayintersection_free: En, __wbg_rawrigidbodyset_free: Dn, __wbg_rawrotation_free: On, __wbg_rawserializationpipeline_free: kn, __wbg_rawshape_free: An, __wbg_rawshapecasthit_free: jn, __wbg_rawshapecontact_free: Mn, __wbg_rawsoftbodybuilder_free: Nn, __wbg_rawsoftbodymaterial_free: Pn, __wbg_rawsoftbodyset_free: Fn, __wbg_rawsoftbodytearevent_free: In, __wbg_rawsoftrecoverysettings_free: Ln, __wbg_rawvector_free: Rn, __wbg_rawvhacdparameters_free: zn, rawbroadphase_castRay: Bn, rawbroadphase_castRayAndGetNormal: Vn, rawbroadphase_castShape: Hn, rawbroadphase_collidersWithAabbIntersectingAabb: Un, rawbroadphase_intersectionWithShape: Wn, rawbroadphase_intersectionsWithPoint: Gn, rawbroadphase_intersectionsWithRay: Kn, rawbroadphase_intersectionsWithShape: qn, rawbroadphase_new: Jn, rawbroadphase_projectPoint: Yn, rawbroadphase_projectPointAndGetFeature: Xn, rawccdsolver_new: Zn, rawcharactercollision_handle: Qn, rawcharactercollision_new: $n, rawcharactercollision_toi: er, rawcharactercollision_translationDeltaApplied: tr, rawcharactercollision_translationDeltaRemaining: nr, rawcharactercollision_worldNormal1: rr, rawcharactercollision_worldNormal2: ir, rawcharactercollision_worldWitness1: ar, rawcharactercollision_worldWitness2: or, rawcolliderset_coActiveCollisionTypes: sr, rawcolliderset_coActiveEvents: cr, rawcolliderset_coActiveHooks: lr, rawcolliderset_coCastCollider: ur, rawcolliderset_coCastRay: dr, rawcolliderset_coCastRayAndGetNormal: fr, rawcolliderset_coCastShape: pr, rawcolliderset_coCollisionGroups: mr, rawcolliderset_coCombineVoxelStates: hr, rawcolliderset_coCompoundFlags: gr, rawcolliderset_coContactCollider: _r, rawcolliderset_coContactForceEventThreshold: vr, rawcolliderset_coContactShape: yr, rawcolliderset_coContactSkin: br, rawcolliderset_coContainsPoint: xr, rawcolliderset_coDensity: Sr, rawcolliderset_coFriction: Cr, rawcolliderset_coFrictionCombineRule: wr, rawcolliderset_coHalfExtents: Tr, rawcolliderset_coHalfHeight: Er, rawcolliderset_coHalfspaceNormal: Dr, rawcolliderset_coHeightfieldHeights: Or, rawcolliderset_coHeightfieldScale: kr, rawcolliderset_coIndices: Ar, rawcolliderset_coIntersectsRay: jr, rawcolliderset_coIntersectsShape: Mr, rawcolliderset_coIsDeformable: Nr, rawcolliderset_coIsEnabled: Pr, rawcolliderset_coIsSensor: Fr, rawcolliderset_coMass: Ir, rawcolliderset_coParent: Lr, rawcolliderset_coPolylineFlags: Rr, rawcolliderset_coProjectPoint: zr, rawcolliderset_coPropagateVoxelChange: Br, rawcolliderset_coRadius: Vr, rawcolliderset_coRestitution: Hr, rawcolliderset_coRestitutionCombineRule: Ur, rawcolliderset_coRotation: Wr, rawcolliderset_coRotationWrtParent: Gr, rawcolliderset_coRoundRadius: Kr, rawcolliderset_coSetActiveCollisionTypes: qr, rawcolliderset_coSetActiveEvents: Jr, rawcolliderset_coSetActiveHooks: Yr, rawcolliderset_coSetCollisionGroups: Xr, rawcolliderset_coSetContactForceEventThreshold: Zr, rawcolliderset_coSetContactSkin: Qr, rawcolliderset_coSetDensity: $r, rawcolliderset_coSetEnabled: ei, rawcolliderset_coSetFriction: ti, rawcolliderset_coSetFrictionCombineRule: ni, rawcolliderset_coSetHalfExtents: ri, rawcolliderset_coSetHalfHeight: ii, rawcolliderset_coSetMass: ai, rawcolliderset_coSetMassProperties: oi, rawcolliderset_coSetRadius: si, rawcolliderset_coSetRestitution: ci, rawcolliderset_coSetRestitutionCombineRule: li, rawcolliderset_coSetRotation: ui, rawcolliderset_coSetRotationWrtParent: di, rawcolliderset_coSetRoundRadius: fi, rawcolliderset_coSetSensor: pi, rawcolliderset_coSetShape: mi, rawcolliderset_coSetSolverGroups: hi, rawcolliderset_coSetTranslation: gi, rawcolliderset_coSetTranslationWrtParent: _i, rawcolliderset_coSetVoxel: vi, rawcolliderset_coShape: yi, rawcolliderset_coShapeType: bi, rawcolliderset_coSoftBody: xi, rawcolliderset_coSolverGroups: Si, rawcolliderset_coTranslation: Ci, rawcolliderset_coTranslationWrtParent: wi, rawcolliderset_coTriMeshFlags: Ti, rawcolliderset_coVertices: Ei, rawcolliderset_coVolume: Di, rawcolliderset_coVoxelData: Oi, rawcolliderset_coVoxelSize: ki, rawcolliderset_contains: Ai, rawcolliderset_createCollider: ji, rawcolliderset_createDeformableCollider: Mi, rawcolliderset_forEachColliderHandle: Ni, rawcolliderset_isHandleValid: Pi, rawcolliderset_len: Fi, rawcolliderset_new: Ii, rawcolliderset_remove: Li, rawcollidershapecasthit_colliderHandle: Ri, rawcollidershapecasthit_getComponents: zi, rawcontactforceevent_collider1: Bi, rawcontactforceevent_collider2: Vi, rawcontactforceevent_max_force_direction: Hi, rawcontactforceevent_max_force_magnitude: Ui, rawcontactforceevent_total_force: Wi, rawcontactforceevent_total_force_magnitude: Gi, rawcontactmanifold_contact_dist: Ki, rawcontactmanifold_contact_fid1: qi, rawcontactmanifold_contact_fid2: Ji, rawcontactmanifold_contact_impulse: Yi, rawcontactmanifold_contact_local_p1: Xi, rawcontactmanifold_contact_local_p2: Zi, rawcontactmanifold_contact_tangent_impulse: Qi, rawcontactmanifold_friction: $i, rawcontactmanifold_local_n1: ea, rawcontactmanifold_local_n2: ta, rawcontactmanifold_normal: na, rawcontactmanifold_num_contacts: ra, rawcontactmanifold_num_solver_contacts: ia, rawcontactmanifold_restitution: aa, rawcontactmanifold_solver_contact_dist: oa, rawcontactmanifold_solver_contact_point: sa, rawcontactmanifold_solver_contact_tangent_velocity: ca, rawcontactmanifold_subshape1: la, rawcontactmanifold_subshape2: ua, rawcontactpair_collider1: da, rawcontactpair_collider2: fa, rawcontactpair_contactManifold: pa, rawcontactpair_numContactManifolds: ma, rawdebugrenderpipeline_colors: ha, rawdebugrenderpipeline_new: ga, rawdebugrenderpipeline_render: _a, rawdebugrenderpipeline_vertices: va, rawdeserializedworld_takeBodies: ya, rawdeserializedworld_takeBroadPhase: ba, rawdeserializedworld_takeColliders: xa, rawdeserializedworld_takeGravity: Sa, rawdeserializedworld_takeImpulseJoints: Ca, rawdeserializedworld_takeIntegrationParameters: wa, rawdeserializedworld_takeIslandManager: Ta, rawdeserializedworld_takeMultibodyJoints: Ea, rawdeserializedworld_takeNarrowPhase: Da, rawdeserializedworld_takeSoftBodies: Oa, raweventqueue_clear: ka, raweventqueue_drainCollisionEvents: Aa, raweventqueue_drainContactForceEvents: ja, raweventqueue_drainSoftBodyTearEvents: Ma, raweventqueue_new: Na, rawgenericjoint_fixed: Pa, rawgenericjoint_prismatic: Fa, rawgenericjoint_revolute: Ia, rawgenericjoint_rope: La, rawgenericjoint_spring: Ra, rawimpulsejointset_contains: za, rawimpulsejointset_createJoint: Ba, rawimpulsejointset_forEachJointAttachedToRigidBody: Va, rawimpulsejointset_forEachJointHandle: Ha, rawimpulsejointset_jointAnchor1: Ua, rawimpulsejointset_jointAnchor2: Wa, rawimpulsejointset_jointBodyHandle1: Ga, rawimpulsejointset_jointBodyHandle2: Ka, rawimpulsejointset_jointConfigureMotor: qa, rawimpulsejointset_jointConfigureMotorModel: Ja, rawimpulsejointset_jointConfigureMotorPosition: Ya, rawimpulsejointset_jointConfigureMotorVelocity: Xa, rawimpulsejointset_jointContactsEnabled: Za, rawimpulsejointset_jointLimitsEnabled: Qa, rawimpulsejointset_jointLimitsMax: $a, rawimpulsejointset_jointLimitsMin: eo, rawimpulsejointset_jointSetAnchor1: to, rawimpulsejointset_jointSetAnchor2: no, rawimpulsejointset_jointSetContactsEnabled: ro, rawimpulsejointset_jointSetFrameX1: io, rawimpulsejointset_jointSetFrameX2: ao, rawimpulsejointset_jointSetLimits: oo, rawimpulsejointset_jointSetLocalFrame1: so, rawimpulsejointset_jointSetLocalFrame2: co, rawimpulsejointset_jointSetMotorMaxForce: lo, rawimpulsejointset_jointType: uo, rawimpulsejointset_len: fo, rawimpulsejointset_new: po, rawimpulsejointset_remove: mo, rawintegrationparameters_contact_erp: ho, rawintegrationparameters_dt: go, rawintegrationparameters_lengthUnit: _o, rawintegrationparameters_maxCcdSubsteps: vo, rawintegrationparameters_new: yo, rawintegrationparameters_normalizedAllowedLinearError: bo, rawintegrationparameters_normalizedPredictionDistance: xo, rawintegrationparameters_numInternalPgsIterations: So, rawintegrationparameters_numSolverIterations: Co, rawintegrationparameters_set_contact_natural_frequency: wo, rawintegrationparameters_set_dt: To, rawintegrationparameters_set_lengthUnit: Eo, rawintegrationparameters_set_maxCcdSubsteps: Do, rawintegrationparameters_set_normalizedAllowedLinearError: Oo, rawintegrationparameters_set_normalizedPredictionDistance: ko, rawintegrationparameters_set_numInternalPgsIterations: Ao, rawintegrationparameters_set_numSolverIterations: jo, rawintegrationparameters_set_softBodiesContactStiffening: Mo, rawintegrationparameters_set_softBodiesFemLinearTolerance: No, rawintegrationparameters_set_softBodiesFemMaxDenseDofs: Po, rawintegrationparameters_set_softBodiesFemMaxLinearIterations: Fo, rawintegrationparameters_set_softBodiesMaxExtraSubsteps: Io, rawintegrationparameters_set_softBodiesRecovery: Lo, rawintegrationparameters_set_softBodiesResweepStrain: Ro, rawintegrationparameters_softBodiesContactStiffening: zo, rawintegrationparameters_softBodiesFemLinearTolerance: Bo, rawintegrationparameters_softBodiesFemMaxDenseDofs: Vo, rawintegrationparameters_softBodiesFemMaxLinearIterations: Ho, rawintegrationparameters_softBodiesMaxExtraSubsteps: Uo, rawintegrationparameters_softBodiesRecovery: Wo, rawintegrationparameters_softBodiesResweepStrain: Go, rawislandmanager_forEachActiveRigidBodyHandle: Ko, rawislandmanager_new: qo, rawkinematiccharactercontroller_autostepEnabled: Jo, rawkinematiccharactercontroller_autostepIncludesDynamicBodies: Yo, rawkinematiccharactercontroller_autostepMaxHeight: Xo, rawkinematiccharactercontroller_autostepMinWidth: Zo, rawkinematiccharactercontroller_computeColliderMovement: Qo, rawkinematiccharactercontroller_computedCollision: $o, rawkinematiccharactercontroller_computedGrounded: es, rawkinematiccharactercontroller_computedMovement: ts, rawkinematiccharactercontroller_disableAutostep: ns, rawkinematiccharactercontroller_disableSnapToGround: rs, rawkinematiccharactercontroller_enableAutostep: is, rawkinematiccharactercontroller_enableSnapToGround: as, rawkinematiccharactercontroller_maxSlopeClimbAngle: os, rawkinematiccharactercontroller_minSlopeSlideAngle: ss, rawkinematiccharactercontroller_new: cs, rawkinematiccharactercontroller_normalNudgeFactor: ls, rawkinematiccharactercontroller_numComputedCollisions: us, rawkinematiccharactercontroller_offset: ds, rawkinematiccharactercontroller_setMaxSlopeClimbAngle: fs, rawkinematiccharactercontroller_setMinSlopeSlideAngle: ps, rawkinematiccharactercontroller_setNormalNudgeFactor: ms, rawkinematiccharactercontroller_setOffset: hs, rawkinematiccharactercontroller_setSlideEnabled: gs, rawkinematiccharactercontroller_setUp: _s, rawkinematiccharactercontroller_slideEnabled: vs, rawkinematiccharactercontroller_snapToGroundDistance: ys, rawkinematiccharactercontroller_snapToGroundEnabled: bs, rawkinematiccharactercontroller_up: xs, rawmultibodyjointset_contains: Ss, rawmultibodyjointset_createJoint: Cs, rawmultibodyjointset_forEachJointAttachedToRigidBody: ws, rawmultibodyjointset_forEachJointHandle: Ts, rawmultibodyjointset_jointAnchor1: Es, rawmultibodyjointset_jointAnchor2: Ds, rawmultibodyjointset_jointContactsEnabled: Os, rawmultibodyjointset_jointFrameX1: ks, rawmultibodyjointset_jointFrameX2: As, rawmultibodyjointset_jointLimitsEnabled: js, rawmultibodyjointset_jointLimitsMax: Ms, rawmultibodyjointset_jointLimitsMin: Ns, rawmultibodyjointset_jointSetContactsEnabled: Ps, rawmultibodyjointset_jointType: Fs, rawmultibodyjointset_new: Is, rawmultibodyjointset_remove: Ls, rawnarrowphase_contact_pair: Rs, rawnarrowphase_contact_pairs_with: zs, rawnarrowphase_intersection_pair: Bs, rawnarrowphase_intersection_pairs_with: Vs, rawnarrowphase_new: Hs, rawphysicspipeline_is_profiler_enabled: Us, rawphysicspipeline_new: Ws, rawphysicspipeline_set_profiler_enabled: Gs, rawphysicspipeline_step: Ks, rawphysicspipeline_stepWithEvents: qs, rawphysicspipeline_timing_broad_phase: Js, rawphysicspipeline_timing_ccd: Ys, rawphysicspipeline_timing_ccd_broad_phase: Xs, rawphysicspipeline_timing_ccd_narrow_phase: Zs, rawphysicspipeline_timing_ccd_solver: Qs, rawphysicspipeline_timing_ccd_toi_computation: $s, rawphysicspipeline_timing_collision_detection: ec, rawphysicspipeline_timing_island_construction: tc, rawphysicspipeline_timing_narrow_phase: nc, rawphysicspipeline_timing_solver: rc, rawphysicspipeline_timing_step: ic, rawphysicspipeline_timing_user_changes: ac, rawphysicspipeline_timing_velocity_assembly: oc, rawphysicspipeline_timing_velocity_resolution: sc, rawphysicspipeline_timing_velocity_update: cc, rawphysicspipeline_timing_velocity_writeback: lc, rawpidcontroller_angular_correction: uc, rawpidcontroller_apply_angular_correction: dc, rawpidcontroller_apply_linear_correction: fc, rawpidcontroller_linear_correction: pc, rawpidcontroller_new: mc, rawpidcontroller_reset_integrals: hc, rawpidcontroller_set_axes_mask: gc, rawpidcontroller_set_kd: _c, rawpidcontroller_set_ki: vc, rawpidcontroller_set_kp: yc, rawpointcolliderprojection_colliderHandle: bc, rawpointcolliderprojection_featureId: xc, rawpointcolliderprojection_featureType: Sc, rawpointcolliderprojection_isInside: Cc, rawpointcolliderprojection_point: wc, rawpointprojection_isInside: Tc, rawpointprojection_point: Ec, rawraycolliderhit_colliderHandle: Dc, rawraycolliderhit_timeOfImpact: Oc, rawraycolliderintersection_colliderHandle: kc, rawraycolliderintersection_featureId: Ac, rawraycolliderintersection_featureType: jc, rawraycolliderintersection_normal: Mc, rawraycolliderintersection_time_of_impact: Nc, rawrayintersection_featureId: Pc, rawrayintersection_featureType: Fc, rawrayintersection_normal: Ic, rawrayintersection_time_of_impact: Lc, rawrigidbodyset_contains: Rc, rawrigidbodyset_createRigidBody: zc, rawrigidbodyset_forEachRigidBodyHandle: Bc, rawrigidbodyset_len: Vc, rawrigidbodyset_new: Hc, rawrigidbodyset_propagateModifiedBodyPositionsToColliders: Uc, rawrigidbodyset_rbAddForce: Wc, rawrigidbodyset_rbAddForceAtPoint: Gc, rawrigidbodyset_rbAddTorque: Kc, rawrigidbodyset_rbAdditionalPgsIterations: qc, rawrigidbodyset_rbAdditionalSolverIterations: Jc, rawrigidbodyset_rbAngularDamping: Yc, rawrigidbodyset_rbAngvel: Xc, rawrigidbodyset_rbApplyImpulse: Zc, rawrigidbodyset_rbApplyImpulseAtPoint: Qc, rawrigidbodyset_rbApplyTorqueImpulse: $c, rawrigidbodyset_rbBodyType: el, rawrigidbodyset_rbCollider: tl, rawrigidbodyset_rbDominanceGroup: nl, rawrigidbodyset_rbEffectiveAngularInertia: rl, rawrigidbodyset_rbEffectiveInvMass: il, rawrigidbodyset_rbEffectiveWorldInvInertia: al, rawrigidbodyset_rbEnableCcd: ol, rawrigidbodyset_rbGravityScale: sl, rawrigidbodyset_rbInvMass: cl, rawrigidbodyset_rbInvPrincipalInertia: ll, rawrigidbodyset_rbIsCcdEnabled: ul, rawrigidbodyset_rbIsDynamic: dl, rawrigidbodyset_rbIsEnabled: fl, rawrigidbodyset_rbIsFixed: pl, rawrigidbodyset_rbIsKinematic: ml, rawrigidbodyset_rbIsMoving: hl, rawrigidbodyset_rbIsSleeping: gl, rawrigidbodyset_rbIsSoftFrame: _l, rawrigidbodyset_rbLinearDamping: vl, rawrigidbodyset_rbLinvel: yl, rawrigidbodyset_rbLocalCom: bl, rawrigidbodyset_rbLockRotations: xl, rawrigidbodyset_rbLockTranslations: Sl, rawrigidbodyset_rbMass: Cl, rawrigidbodyset_rbNextRotation: wl, rawrigidbodyset_rbNextTranslation: Tl, rawrigidbodyset_rbNumColliders: El, rawrigidbodyset_rbPrincipalInertia: Dl, rawrigidbodyset_rbRecomputeMassPropertiesFromColliders: Ol, rawrigidbodyset_rbResetForces: kl, rawrigidbodyset_rbResetTorques: Al, rawrigidbodyset_rbRotation: jl, rawrigidbodyset_rbSetAdditionalMass: Ml, rawrigidbodyset_rbSetAdditionalMassProperties: Nl, rawrigidbodyset_rbSetAdditionalPgsIterations: Pl, rawrigidbodyset_rbSetAdditionalSolverIterations: Fl, rawrigidbodyset_rbSetAngularDamping: Il, rawrigidbodyset_rbSetAngvel: Ll, rawrigidbodyset_rbSetBodyType: Rl, rawrigidbodyset_rbSetDominanceGroup: zl, rawrigidbodyset_rbSetEnabled: Bl, rawrigidbodyset_rbSetEnabledTranslations: Vl, rawrigidbodyset_rbSetGravityScale: Hl, rawrigidbodyset_rbSetLinearDamping: Ul, rawrigidbodyset_rbSetLinvel: Wl, rawrigidbodyset_rbSetNextKinematicRotation: Gl, rawrigidbodyset_rbSetNextKinematicTranslation: Kl, rawrigidbodyset_rbSetRotation: ql, rawrigidbodyset_rbSetSoftCcdPrediction: Jl, rawrigidbodyset_rbSetTranslation: Yl, rawrigidbodyset_rbSetUserData: Xl, rawrigidbodyset_rbSleep: Zl, rawrigidbodyset_rbSoftBody: Ql, rawrigidbodyset_rbSoftCcdPrediction: $l, rawrigidbodyset_rbSoftCluster: eu, rawrigidbodyset_rbTranslation: tu, rawrigidbodyset_rbUserData: nu, rawrigidbodyset_rbUserForce: ru, rawrigidbodyset_rbUserTorque: iu, rawrigidbodyset_rbVelocityAtPoint: au, rawrigidbodyset_rbWakeUp: ou, rawrigidbodyset_rbWorldCom: su, rawrigidbodyset_remove: cu, rawrotation_angle: lu, rawrotation_fromAngle: uu, rawrotation_identity: du, rawrotation_im: fu, rawrotation_re: pu, rawserializationpipeline_deserializeAll: mu, rawserializationpipeline_new: hu, rawserializationpipeline_serializeAll: gu, rawshape_ball: _u, rawshape_capsule: vu, rawshape_castRay: yu, rawshape_castRayAndGetNormal: bu, rawshape_castShape: xu, rawshape_compound: Su, rawshape_compoundFlags: Cu, rawshape_compoundLen: wu, rawshape_compoundRotation: Tu, rawshape_compoundShape: Eu, rawshape_compoundTranslation: Du, rawshape_contactShape: Ou, rawshape_containsPoint: ku, rawshape_convexDecomposition: Au, rawshape_convexDecompositionWithParams: ju, rawshape_convexHull: Mu, rawshape_convexPolyline: Nu, rawshape_cuboid: Pu, rawshape_halfExtents: Fu, rawshape_halfHeight: Iu, rawshape_halfspace: Lu, rawshape_halfspaceNormal: Ru, rawshape_heightfield: zu, rawshape_heightfieldHeights: Bu, rawshape_heightfieldScale: Vu, rawshape_indices: Hu, rawshape_intersectsRay: Uu, rawshape_intersectsShape: Wu, rawshape_polyline: Gu, rawshape_polylineFlags: Ku, rawshape_projectPoint: qu, rawshape_radius: Ju, rawshape_roundConvexHull: Yu, rawshape_roundConvexPolyline: Xu, rawshape_roundCuboid: Zu, rawshape_roundRadius: Qu, rawshape_roundTriangle: $u, rawshape_segment: ed, rawshape_shapeType: td, rawshape_triMeshFlags: nd, rawshape_triangle: rd, rawshape_trimesh: id, rawshape_vertices: ad, rawshape_voxelData: od, rawshape_voxelSize: sd, rawshape_voxels: cd, rawshape_voxelsFromPoints: ld, rawshapecasthit_getComponents: ud, rawshapecontact_getComponents: dd, rawsoftbodybuilder_addEdges: fd, rawsoftbodybuilder_append: pd, rawsoftbodybuilder_cellEdges: md, rawsoftbodybuilder_disk: hd, rawsoftbodybuilder_grid: gd, rawsoftbodybuilder_material: _d, rawsoftbodybuilder_new: vd, rawsoftbodybuilder_numParticles: yd, rawsoftbodybuilder_particlePositions: bd, rawsoftbodybuilder_polygon: xd, rawsoftbodybuilder_polyline: Sd, rawsoftbodybuilder_rope: Cd, rawsoftbodybuilder_setAdditionalPgsIterations: wd, rawsoftbodybuilder_setAdditionalSolverIterations: Td, rawsoftbodybuilder_setBendEdges: Ed, rawsoftbodybuilder_setCanSleep: Dd, rawsoftbodybuilder_setCellModel: Od, rawsoftbodybuilder_setCells: kd, rawsoftbodybuilder_setDominanceGroup: Ad, rawsoftbodybuilder_setEdgeSoftness: jd, rawsoftbodybuilder_setEdgeTearResistance: Md, rawsoftbodybuilder_setEdges: Nd, rawsoftbodybuilder_setGravityScale: Pd, rawsoftbodybuilder_setLinearDamping: Fd, rawsoftbodybuilder_setMass: Id, rawsoftbodybuilder_setMasses: Ld, rawsoftbodybuilder_setMaterial: Rd, rawsoftbodybuilder_setNoSurfaceCollider: zd, rawsoftbodybuilder_setOriented: Bd, rawsoftbodybuilder_setParticleMass: Vd, rawsoftbodybuilder_setParticleRadius: Hd, rawsoftbodybuilder_setPinnedParticles: Ud, rawsoftbodybuilder_setPositions: Wd, rawsoftbodybuilder_setSelfContacts: Gd, rawsoftbodybuilder_setShapeMatching: Kd, rawsoftbodybuilder_setSkin: qd, rawsoftbodybuilder_setSkinCollision: Jd, rawsoftbodybuilder_setSoftness: Yd, rawsoftbodybuilder_setSolver: Xd, rawsoftbodybuilder_setSurface: Zd, rawsoftbodybuilder_setSurfaceCollider: Qd, rawsoftbodybuilder_setTensionOnly: $d, rawsoftbodybuilder_setVolumeFactor: ef, rawsoftbodybuilder_setVolumePreservation: tf, rawsoftbodybuilder_surfaceEdges: nf, rawsoftbodybuilder_translated: rf, rawsoftbodybuilder_volumetric: af, rawsoftbodymaterial_bendDampingRatio: of, rawsoftbodymaterial_bendFrequency: sf, rawsoftbodymaterial_deformationDamping: cf, rawsoftbodymaterial_edgeDampingRatio: lf, rawsoftbodymaterial_edgeFrequency: uf, rawsoftbodymaterial_edgePlasticCreep: df, rawsoftbodymaterial_edgePlasticFlow: ff, rawsoftbodymaterial_edgePlasticMax: pf, rawsoftbodymaterial_edgePlasticYield: mf, rawsoftbodymaterial_elasticDampingRatio: hf, rawsoftbodymaterial_interiorStrength: gf, rawsoftbodymaterial_maxTearsPerStep: _f, rawsoftbodymaterial_minPiece: vf, rawsoftbodymaterial_new: yf, rawsoftbodymaterial_plasticCreep: bf, rawsoftbodymaterial_plasticMax: xf, rawsoftbodymaterial_plasticYield: Sf, rawsoftbodymaterial_poissonRatio: Cf, rawsoftbodymaterial_set_bendDampingRatio: wf, rawsoftbodymaterial_set_bendFrequency: Tf, rawsoftbodymaterial_set_deformationDamping: Ef, rawsoftbodymaterial_set_edgeDampingRatio: Df, rawsoftbodymaterial_set_edgeFrequency: Of, rawsoftbodymaterial_set_edgePlasticCreep: kf, rawsoftbodymaterial_set_edgePlasticFlow: Af, rawsoftbodymaterial_set_edgePlasticMax: jf, rawsoftbodymaterial_set_edgePlasticYield: Mf, rawsoftbodymaterial_set_elasticDampingRatio: Nf, rawsoftbodymaterial_set_interiorStrength: Pf, rawsoftbodymaterial_set_maxTearsPerStep: Ff, rawsoftbodymaterial_set_minPiece: If, rawsoftbodymaterial_set_plasticCreep: Lf, rawsoftbodymaterial_set_plasticMax: Rf, rawsoftbodymaterial_set_plasticYield: zf, rawsoftbodymaterial_set_poissonRatio: Bf, rawsoftbodymaterial_set_shapeMatchingDampingRatio: Vf, rawsoftbodymaterial_set_shapeMatchingFrequency: Hf, rawsoftbodymaterial_set_tearForce: Uf, rawsoftbodymaterial_set_tearSmoothing: Wf, rawsoftbodymaterial_set_tearStrain: Gf, rawsoftbodymaterial_set_volumeDampingRatio: Kf, rawsoftbodymaterial_set_volumeFrequency: qf, rawsoftbodymaterial_set_youngModulus: Jf, rawsoftbodymaterial_shapeMatchingDampingRatio: Yf, rawsoftbodymaterial_shapeMatchingFrequency: Xf, rawsoftbodymaterial_tearForce: Zf, rawsoftbodymaterial_tearSmoothing: Qf, rawsoftbodymaterial_tearStrain: $f, rawsoftbodymaterial_tears: ep, rawsoftbodymaterial_uniform: tp, rawsoftbodymaterial_volumeDampingRatio: np, rawsoftbodymaterial_volumeFrequency: rp, rawsoftbodymaterial_youngModulus: ip, rawsoftbodyset_addCluster: ap, rawsoftbodyset_contains: op, rawsoftbodyset_cut: sp, rawsoftbodyset_forEachSoftBodyHandle: cp, rawsoftbodyset_insert: lp, rawsoftbodyset_len: up, rawsoftbodyset_new: dp, rawsoftbodyset_remove: fp, rawsoftbodyset_removeCluster: pp, rawsoftbodyset_sbAddForce: mp, rawsoftbodyset_sbAddParticleForce: hp, rawsoftbodyset_sbApplyImpulse: gp, rawsoftbodyset_sbApplyImpulseAtPoint: _p, rawsoftbodyset_sbApplyParticleImpulse: vp, rawsoftbodyset_sbApplyRadialImpulse: yp, rawsoftbodyset_sbAttachParticle: bp, rawsoftbodyset_sbAttachmentBody: xp, rawsoftbodyset_sbAttachmentParticle: Sp, rawsoftbodyset_sbBoundary: Cp, rawsoftbodyset_sbCellModel: wp, rawsoftbodyset_sbCellRestVolume: Tp, rawsoftbodyset_sbCellStiffnessScale: Ep, rawsoftbodyset_sbCellStress: Dp, rawsoftbodyset_sbCellTearResistance: Op, rawsoftbodyset_sbCells: kp, rawsoftbodyset_sbCenterOfMass: Ap, rawsoftbodyset_sbClusterParticles: jp, rawsoftbodyset_sbClusterProxy: Mp, rawsoftbodyset_sbClusterShapeMatchingEnabled: Np, rawsoftbodyset_sbDetachParticle: Pp, rawsoftbodyset_sbEdgeImpulse: Fp, rawsoftbodyset_sbEdgeIsBend: Ip, rawsoftbodyset_sbEdgePlasticStrain: Lp, rawsoftbodyset_sbEdgeRestLength: Rp, rawsoftbodyset_sbEdgeStress: zp, rawsoftbodyset_sbEdgeTearResistance: Bp, rawsoftbodyset_sbEdges: Vp, rawsoftbodyset_sbEnableClusterShapeMatching: Hp, rawsoftbodyset_sbEnableVolumePreservation: Up, rawsoftbodyset_sbGravityScale: Wp, rawsoftbodyset_sbHasPendingTears: Gp, rawsoftbodyset_sbIsClusterLive: Kp, rawsoftbodyset_sbIsEnabled: qp, rawsoftbodyset_sbIsParticleDamaged: Jp, rawsoftbodyset_sbIsParticleOnSurface: Yp, rawsoftbodyset_sbIsParticlePinned: Xp, rawsoftbodyset_sbIsSleeping: Zp, rawsoftbodyset_sbLinearDamping: Qp, rawsoftbodyset_sbMass: $p, rawsoftbodyset_sbMaterial: em, rawsoftbodyset_sbMeshCluster: tm, rawsoftbodyset_sbMeshCollider: nm, rawsoftbodyset_sbMeshCollisionEnabled: rm, rawsoftbodyset_sbMeshIndices: im, rawsoftbodyset_sbMeshIsOriented: am, rawsoftbodyset_sbMeshIsSkinned: om, rawsoftbodyset_sbMeshOfCollider: sm, rawsoftbodyset_sbMeshVertices: cm, rawsoftbodyset_sbNumAttachments: lm, rawsoftbodyset_sbNumCells: um, rawsoftbodyset_sbNumClusters: dm, rawsoftbodyset_sbNumEdges: fm, rawsoftbodyset_sbNumMeshes: pm, rawsoftbodyset_sbNumParticles: mm, rawsoftbodyset_sbOrigin: hm, rawsoftbodyset_sbParticleMass: gm, rawsoftbodyset_sbParticlePosition: _m, rawsoftbodyset_sbParticlePositions: vm, rawsoftbodyset_sbParticleRadius: ym, rawsoftbodyset_sbParticleRestPosition: bm, rawsoftbodyset_sbParticleVelocities: xm, rawsoftbodyset_sbParticleVelocity: Sm, rawsoftbodyset_sbPieces: Cm, rawsoftbodyset_sbResetForces: wm, rawsoftbodyset_sbResetPlasticity: Tm, rawsoftbodyset_sbRestVolume: Em, rawsoftbodyset_sbRootBody: Dm, rawsoftbodyset_sbSetAdditionalPgsIterations: Om, rawsoftbodyset_sbSetClusterEdgeSoftness: km, rawsoftbodyset_sbSetClusterKinematicTarget: Am, rawsoftbodyset_sbSetClusterPinned: jm, rawsoftbodyset_sbSetClusterStiffnessScale: Mm, rawsoftbodyset_sbSetClusterTearResistance: Nm, rawsoftbodyset_sbSetEnabled: Pm, rawsoftbodyset_sbSetMaterial: Fm, rawsoftbodyset_sbSetParticleKinematicTarget: Im, rawsoftbodyset_sbSetParticlePinned: Lm, rawsoftbodyset_sbSetParticlePosition: Rm, rawsoftbodyset_sbSetParticleVelocity: zm, rawsoftbodyset_sbSetSolver: Bm, rawsoftbodyset_sbSetUserData: Vm, rawsoftbodyset_sbSetVolumeFactor: Hm, rawsoftbodyset_sbSolver: Um, rawsoftbodyset_sbTearCell: Wm, rawsoftbodyset_sbTearEdge: Gm, rawsoftbodyset_sbTopologyVersion: Km, rawsoftbodyset_sbUserData: qm, rawsoftbodyset_sbVolume: Jm, rawsoftbodyset_sbVolumeFactor: Ym, rawsoftbodyset_sbVolumePreservationEnabled: Xm, rawsoftbodyset_sbWakeUp: Zm, rawsoftbodyset_tear: Qm, rawsoftbodyset_wakeUp: $m, rawsoftbodytearevent_clusterSplitCluster: eh, rawsoftbodytearevent_clusterSplitKeepsProxy: th, rawsoftbodytearevent_clusterSplitProxy: nh, rawsoftbodytearevent_clusterSplitSoftBody: rh, rawsoftbodytearevent_clusterSplitSource: ih, rawsoftbodytearevent_insertedParticles: ah, rawsoftbodytearevent_movedJoint: oh, rawsoftbodytearevent_movedJointFrom: sh, rawsoftbodytearevent_movedJointTo: ch, rawsoftbodytearevent_numClusterSplits: lh, rawsoftbodytearevent_numMovedJoints: uh, rawsoftbodytearevent_numPieces: dh, rawsoftbodytearevent_particleDestinationBody: fh, rawsoftbodytearevent_particleDestinationIndex: ph, rawsoftbodytearevent_pieceClusters: mh, rawsoftbodytearevent_pieceParticles: hh, rawsoftbodytearevent_pieceSoftBody: gh, rawsoftbodytearevent_removedEdges: _h, rawsoftbodytearevent_seeds: vh, rawsoftbodytearevent_softBody: yh, rawsoftbodytearevent_splitParticles: bh, rawsoftbodytearevent_tornCells: xh, rawsoftbodytearevent_tornEdges: Sh, rawsoftrecoverysettings_authoredVelocityMargin: Ch, rawsoftrecoverysettings_crossBodyDetection: wh, rawsoftrecoverysettings_crossBodyExpelGate: Th, rawsoftrecoverysettings_crossingRepulsion: Eh, rawsoftrecoverysettings_crossingRepulsionGuide: Dh, rawsoftrecoverysettings_crossingRepulsionSelfGuide: Oh, rawsoftrecoverysettings_detectionMotionGating: kh, rawsoftrecoverysettings_edgeSpeculation: Ah, rawsoftrecoverysettings_edgeStandDown: jh, rawsoftrecoverysettings_invertedCellDetection: Mh, rawsoftrecoverysettings_new: Nh, rawsoftrecoverysettings_overlapConstraintPace: Ph, rawsoftrecoverysettings_overlapConstraints: Fh, rawsoftrecoverysettings_overlapEdgeStandDown: Ih, rawsoftrecoverysettings_overlapKeptDepth: Lh, rawsoftrecoverysettings_overlapMultiVolume: Rh, rawsoftrecoverysettings_overlapNormalPush: zh, rawsoftrecoverysettings_overlapPatchConstraints: Bh, rawsoftrecoverysettings_overlapPatience: Vh, rawsoftrecoverysettings_overlapProgressMargin: Hh, rawsoftrecoverysettings_overlapRigid: Uh, rawsoftrecoverysettings_overlapSelfRegions: Wh, rawsoftrecoverysettings_overlapSkinVolume: Gh, rawsoftrecoverysettings_overlapSkipSelfTangled: Kh, rawsoftrecoverysettings_overlapSplit: qh, rawsoftrecoverysettings_recoveryPace: Jh, rawsoftrecoverysettings_selfCrossingDetection: Yh, rawsoftrecoverysettings_selfStandDown: Xh, rawsoftrecoverysettings_set_authoredVelocityMargin: Zh, rawsoftrecoverysettings_set_crossBodyDetection: Qh, rawsoftrecoverysettings_set_crossBodyExpelGate: $h, rawsoftrecoverysettings_set_crossingRepulsion: eg, rawsoftrecoverysettings_set_crossingRepulsionGuide: tg, rawsoftrecoverysettings_set_crossingRepulsionSelfGuide: ng, rawsoftrecoverysettings_set_detectionMotionGating: rg, rawsoftrecoverysettings_set_edgeSpeculation: ig, rawsoftrecoverysettings_set_edgeStandDown: ag, rawsoftrecoverysettings_set_invertedCellDetection: og, rawsoftrecoverysettings_set_overlapConstraintPace: sg, rawsoftrecoverysettings_set_overlapConstraints: cg, rawsoftrecoverysettings_set_overlapEdgeStandDown: lg, rawsoftrecoverysettings_set_overlapKeptDepth: ug, rawsoftrecoverysettings_set_overlapMultiVolume: dg, rawsoftrecoverysettings_set_overlapNormalPush: fg, rawsoftrecoverysettings_set_overlapPatchConstraints: pg, rawsoftrecoverysettings_set_overlapPatience: mg, rawsoftrecoverysettings_set_overlapProgressMargin: hg, rawsoftrecoverysettings_set_overlapRigid: gg, rawsoftrecoverysettings_set_overlapSelfRegions: _g, rawsoftrecoverysettings_set_overlapSkinVolume: vg, rawsoftrecoverysettings_set_overlapSkipSelfTangled: yg, rawsoftrecoverysettings_set_overlapSplit: bg, rawsoftrecoverysettings_set_recoveryPace: xg, rawsoftrecoverysettings_set_selfCrossingDetection: Sg, rawsoftrecoverysettings_set_selfStandDown: Cg, rawvector_new: wg, rawvector_set_x: Tg, rawvector_set_y: Eg, rawvector_x: Dg, rawvector_xy: Og, rawvector_y: kg, rawvector_yx: Ag, rawvector_zero: jg, rawvhacdparameters_alpha: Mg, rawvhacdparameters_beta: Ng, rawvhacdparameters_concavity: Pg, rawvhacdparameters_convex_hull_approximation: Fg, rawvhacdparameters_convex_hull_downsampling: Ig, rawvhacdparameters_max_convex_hulls: Lg, rawvhacdparameters_new: Rg, rawvhacdparameters_plane_downsampling: zg, rawvhacdparameters_resolution: Bg, rawvhacdparameters_set_alpha: Vg, rawvhacdparameters_set_beta: Hg, rawvhacdparameters_set_concavity: Ug, rawvhacdparameters_set_convex_hull_approximation: Wg, rawvhacdparameters_set_convex_hull_downsampling: Gg, rawvhacdparameters_set_max_convex_hulls: Kg, rawvhacdparameters_set_plane_downsampling: qg, rawvhacdparameters_set_resolution: Jg, reserve_memory: Yg, version: Xg, __abort_handler: Zg, __instance_terminated: Qg, __wbindgen_export: $g, __wbindgen_add_to_stack_pointer: e_, __wbindgen_export2: t_, __wbindgen_export3: n_ }=exports);Qt($t);}


var q = new Float32Array(16), r_ = class {
  constructor(e51, t2) {
    this.x = e51, this.y = t2;
  }
}, J = class e31 {
  static new(e51, t2) {
    return new r_(e51, t2);
  }
  static zeros() {
    return e31.new(0, 0);
  }
  static fromBuffer(t2, n2) {
    return t2 ? (n2 ??= e31.zeros(), n2.x = t2[0], n2.y = t2[1], n2) : null;
  }
  static fromRaw(t2) {
    if (!t2) return null;
    let n2 = e31.new(t2.x, t2.y);
    return t2.free(), n2;
  }
  static intoRaw(e51) {
    return new M(e51.x, e51.y);
  }
  static copy(e51, t2) {
    e51.x = t2.x, e51.y = t2.y;
  }
}, Y = class {
  static identity() {
    return 0;
  }
  static fromRaw(e51) {
    if (!e51) return null;
    let t2 = e51.angle;
    return e51.free(), t2;
  }
  static intoRaw(e51) {
    return E.fromAngle(e51);
  }
}, X;
(function(e51) {
  e51[e51.Dynamic = 0] = `Dynamic`, e51[e51.Fixed = 1] = `Fixed`, e51[e51.KinematicPositionBased = 2] = `KinematicPositionBased`, e51[e51.KinematicVelocityBased = 3] = `KinematicVelocityBased`, e51[e51.SoftFrame = 4] = `SoftFrame`;
})(X ||= {});
var i_ = class {
  constructor(e51, t2, n2) {
    this.rawSet = e51, this.colliderSet = t2, this.handle = n2;
  }
  finalizeDeserialization(e51) {
    this.colliderSet = e51;
  }
  isValid() {
    return this.rawSet.contains(this.handle);
  }
  lockTranslations(e51, t2) {
    return this.rawSet.rbLockTranslations(this.handle, e51, t2);
  }
  lockRotations(e51, t2) {
    return this.rawSet.rbLockRotations(this.handle, e51, t2);
  }
  setEnabledTranslations(e51, t2, n2) {
    return this.rawSet.rbSetEnabledTranslations(this.handle, e51, t2, n2);
  }
  restrictTranslations(e51, t2, n2) {
    this.setEnabledTranslations(e51, e51, n2);
  }
  dominanceGroup() {
    return this.rawSet.rbDominanceGroup(this.handle);
  }
  setDominanceGroup(e51) {
    this.rawSet.rbSetDominanceGroup(this.handle, e51);
  }
  additionalSolverIterations() {
    return this.rawSet.rbAdditionalSolverIterations(this.handle);
  }
  additionalPgsIterations() {
    return this.rawSet.rbAdditionalPgsIterations(this.handle);
  }
  setAdditionalPgsIterations(e51) {
    this.rawSet.rbSetAdditionalPgsIterations(this.handle, e51);
  }
  isSoftFrame() {
    return this.rawSet.rbIsSoftFrame(this.handle);
  }
  softBody() {
    let e51 = this.rawSet.rbSoftBody(this.handle);
    return e51 === void 0 ? null : e51;
  }
  softCluster() {
    let e51 = this.rawSet.rbSoftCluster(this.handle);
    return e51 === void 0 ? null : e51;
  }
  setAdditionalSolverIterations(e51) {
    this.rawSet.rbSetAdditionalSolverIterations(this.handle, e51);
  }
  enableCcd(e51) {
    this.rawSet.rbEnableCcd(this.handle, e51);
  }
  setSoftCcdPrediction(e51) {
    this.rawSet.rbSetSoftCcdPrediction(this.handle, e51);
  }
  softCcdPrediction() {
    return this.rawSet.rbSoftCcdPrediction(this.handle);
  }
  translation(e51) {
    return this.rawSet.rbTranslation(this.handle, q), J.fromBuffer(q, e51);
  }
  rotation() {
    return this.rawSet.rbRotation(this.handle);
  }
  nextTranslation(e51) {
    return this.rawSet.rbNextTranslation(this.handle, q), J.fromBuffer(q, e51);
  }
  nextRotation() {
    return this.rawSet.rbNextRotation(this.handle);
  }
  setTranslation(e51, t2) {
    this.rawSet.rbSetTranslation(this.handle, e51.x, e51.y, t2);
  }
  setLinvel(e51, t2) {
    let n2 = J.intoRaw(e51);
    this.rawSet.rbSetLinvel(this.handle, n2, t2), n2.free();
  }
  gravityScale() {
    return this.rawSet.rbGravityScale(this.handle);
  }
  setGravityScale(e51, t2) {
    this.rawSet.rbSetGravityScale(this.handle, e51, t2);
  }
  setRotation(e51, t2) {
    this.rawSet.rbSetRotation(this.handle, e51, t2);
  }
  setAngvel(e51, t2) {
    this.rawSet.rbSetAngvel(this.handle, e51, t2);
  }
  setNextKinematicTranslation(e51) {
    this.rawSet.rbSetNextKinematicTranslation(this.handle, e51.x, e51.y);
  }
  setNextKinematicRotation(e51) {
    this.rawSet.rbSetNextKinematicRotation(this.handle, e51);
  }
  linvel(e51) {
    return this.rawSet.rbLinvel(this.handle, q), J.fromBuffer(q, e51);
  }
  velocityAtPoint(e51, t2) {
    let n2 = J.intoRaw(e51);
    return this.rawSet.rbVelocityAtPoint(this.handle, n2, q), n2.free(), J.fromBuffer(q, t2);
  }
  angvel() {
    return this.rawSet.rbAngvel(this.handle);
  }
  mass() {
    return this.rawSet.rbMass(this.handle);
  }
  effectiveInvMass(e51) {
    return this.rawSet.rbEffectiveInvMass(this.handle, q), J.fromBuffer(q, e51);
  }
  invMass() {
    return this.rawSet.rbInvMass(this.handle);
  }
  localCom(e51) {
    return this.rawSet.rbLocalCom(this.handle, q), J.fromBuffer(q, e51);
  }
  worldCom(e51) {
    return this.rawSet.rbWorldCom(this.handle, q), J.fromBuffer(q, e51);
  }
  invPrincipalInertia() {
    return this.rawSet.rbInvPrincipalInertia(this.handle);
  }
  principalInertia() {
    return this.rawSet.rbPrincipalInertia(this.handle);
  }
  effectiveWorldInvInertia() {
    return this.rawSet.rbEffectiveWorldInvInertia(this.handle);
  }
  effectiveAngularInertia() {
    return this.rawSet.rbEffectiveAngularInertia(this.handle);
  }
  sleep() {
    this.rawSet.rbSleep(this.handle);
  }
  wakeUp() {
    this.rawSet.rbWakeUp(this.handle);
  }
  isCcdEnabled() {
    return this.rawSet.rbIsCcdEnabled(this.handle);
  }
  numColliders() {
    return this.rawSet.rbNumColliders(this.handle);
  }
  collider(e51) {
    return this.colliderSet.get(this.rawSet.rbCollider(this.handle, e51));
  }
  setEnabled(e51) {
    this.rawSet.rbSetEnabled(this.handle, e51);
  }
  isEnabled() {
    return this.rawSet.rbIsEnabled(this.handle);
  }
  bodyType() {
    return this.rawSet.rbBodyType(this.handle);
  }
  setBodyType(e51, t2) {
    return this.rawSet.rbSetBodyType(this.handle, e51, t2);
  }
  isSleeping() {
    return this.rawSet.rbIsSleeping(this.handle);
  }
  isMoving() {
    return this.rawSet.rbIsMoving(this.handle);
  }
  isFixed() {
    return this.rawSet.rbIsFixed(this.handle);
  }
  isKinematic() {
    return this.rawSet.rbIsKinematic(this.handle);
  }
  isDynamic() {
    return this.rawSet.rbIsDynamic(this.handle);
  }
  linearDamping() {
    return this.rawSet.rbLinearDamping(this.handle);
  }
  angularDamping() {
    return this.rawSet.rbAngularDamping(this.handle);
  }
  setLinearDamping(e51) {
    this.rawSet.rbSetLinearDamping(this.handle, e51);
  }
  recomputeMassPropertiesFromColliders() {
    this.rawSet.rbRecomputeMassPropertiesFromColliders(this.handle, this.colliderSet.raw);
  }
  setAdditionalMass(e51, t2) {
    this.rawSet.rbSetAdditionalMass(this.handle, e51, t2);
  }
  setAdditionalMassProperties(e51, t2, n2, r2) {
    let i2 = J.intoRaw(t2);
    this.rawSet.rbSetAdditionalMassProperties(this.handle, e51, i2, n2, r2), i2.free();
  }
  setAngularDamping(e51) {
    this.rawSet.rbSetAngularDamping(this.handle, e51);
  }
  resetForces(e51) {
    this.rawSet.rbResetForces(this.handle, e51);
  }
  resetTorques(e51) {
    this.rawSet.rbResetTorques(this.handle, e51);
  }
  addForce(e51, t2) {
    let n2 = J.intoRaw(e51);
    this.rawSet.rbAddForce(this.handle, n2, t2), n2.free();
  }
  applyImpulse(e51, t2) {
    let n2 = J.intoRaw(e51);
    this.rawSet.rbApplyImpulse(this.handle, n2, t2), n2.free();
  }
  addTorque(e51, t2) {
    this.rawSet.rbAddTorque(this.handle, e51, t2);
  }
  applyTorqueImpulse(e51, t2) {
    this.rawSet.rbApplyTorqueImpulse(this.handle, e51, t2);
  }
  addForceAtPoint(e51, t2, n2) {
    let r2 = J.intoRaw(e51), i2 = J.intoRaw(t2);
    this.rawSet.rbAddForceAtPoint(this.handle, r2, i2, n2), r2.free(), i2.free();
  }
  applyImpulseAtPoint(e51, t2, n2) {
    let r2 = J.intoRaw(e51), i2 = J.intoRaw(t2);
    this.rawSet.rbApplyImpulseAtPoint(this.handle, r2, i2, n2), r2.free(), i2.free();
  }
  userForce(e51) {
    return this.rawSet.rbUserForce(this.handle, q), J.fromBuffer(q, e51);
  }
  userTorque() {
    return this.rawSet.rbUserTorque(this.handle);
  }
}, a_ = class e32 {
  constructor(e51) {
    this.enabled = true, this.status = e51, this.translation = J.zeros(), this.rotation = Y.identity(), this.gravityScale = 1, this.linvel = J.zeros(), this.mass = 0, this.massOnly = false, this.centerOfMass = J.zeros(), this.translationsEnabledX = true, this.translationsEnabledY = true, this.angvel = 0, this.principalAngularInertia = 0, this.rotationsEnabled = true, this.linearDamping = 0, this.angularDamping = 0, this.canSleep = true, this.sleeping = false, this.ccdEnabled = false, this.softCcdPrediction = 0, this.dominanceGroup = 0, this.additionalSolverIterations = 0, this.additionalPgsIterations = 0;
  }
  static dynamic() {
    return new e32(X.Dynamic);
  }
  static kinematicPositionBased() {
    return new e32(X.KinematicPositionBased);
  }
  static kinematicVelocityBased() {
    return new e32(X.KinematicVelocityBased);
  }
  static fixed() {
    return new e32(X.Fixed);
  }
  static newDynamic() {
    return new e32(X.Dynamic);
  }
  static newKinematicPositionBased() {
    return new e32(X.KinematicPositionBased);
  }
  static newKinematicVelocityBased() {
    return new e32(X.KinematicVelocityBased);
  }
  static newStatic() {
    return new e32(X.Fixed);
  }
  setDominanceGroup(e51) {
    return this.dominanceGroup = e51, this;
  }
  setAdditionalSolverIterations(e51) {
    return this.additionalSolverIterations = e51, this;
  }
  setAdditionalPgsIterations(e51) {
    return this.additionalPgsIterations = e51, this;
  }
  setEnabled(e51) {
    return this.enabled = e51, this;
  }
  setTranslation(e51, t2) {
    if (typeof e51 != `number` || typeof t2 != `number`) throw TypeError(`The translation components must be numbers.`);
    return this.translation = { x: e51, y: t2 }, this;
  }
  setRotation(e51) {
    return this.rotation = e51, this;
  }
  setGravityScale(e51) {
    return this.gravityScale = e51, this;
  }
  setAdditionalMass(e51) {
    return this.mass = e51, this.massOnly = true, this;
  }
  setLinvel(e51, t2) {
    if (typeof e51 != `number` || typeof t2 != `number`) throw TypeError(`The linvel components must be numbers.`);
    return this.linvel = { x: e51, y: t2 }, this;
  }
  setAngvel(e51) {
    return this.angvel = e51, this;
  }
  setAdditionalMassProperties(e51, t2, n2) {
    return this.mass = e51, J.copy(this.centerOfMass, t2), this.principalAngularInertia = n2, this.massOnly = false, this;
  }
  enabledTranslations(e51, t2) {
    return this.translationsEnabledX = e51, this.translationsEnabledY = t2, this;
  }
  restrictTranslations(e51, t2) {
    return this.enabledTranslations(e51, t2);
  }
  lockTranslations() {
    return this.restrictTranslations(false, false);
  }
  lockRotations() {
    return this.rotationsEnabled = false, this;
  }
  setLinearDamping(e51) {
    return this.linearDamping = e51, this;
  }
  setAngularDamping(e51) {
    return this.angularDamping = e51, this;
  }
  setCanSleep(e51) {
    return this.canSleep = e51, this;
  }
  setSleeping(e51) {
    return this.sleeping = e51, this;
  }
  setCcdEnabled(e51) {
    return this.ccdEnabled = e51, this;
  }
  setSoftCcdPrediction(e51) {
    return this.softCcdPrediction = e51, this;
  }
  setUserData(e51) {
    return this.userData = e51, this;
  }
}, o_ = class {
  constructor() {
    this.fconv = new Float64Array(1), this.uconv = new Uint32Array(this.fconv.buffer), this.data = [], this.size = 0;
  }
  set(e51, t2) {
    let n2 = this.index(e51);
    for (; this.data.length <= n2; ) this.data.push(null);
    this.data[n2] ?? (this.size += 1), this.data[n2] = t2;
  }
  len() {
    return this.size;
  }
  delete(e51) {
    let t2 = this.index(e51);
    t2 < this.data.length && (this.data[t2] != null && --this.size, this.data[t2] = null);
  }
  clear() {
    this.data = [];
  }
  get(e51) {
    let t2 = this.index(e51);
    return t2 < this.data.length ? this.data[t2] : null;
  }
  forEach(e51) {
    for (let t2 of this.data) t2 != null && e51(t2);
  }
  getAll() {
    return this.data.filter((e51) => e51 != null);
  }
  index(e51) {
    return this.fconv[0] = e51, this.uconv[0];
  }
}, s_ = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new T(), this.map = new o_(), e51 && e51.forEachRigidBodyHandle((t2) => {
      this.map.set(t2, new i_(e51, null, t2));
    });
  }
  finalizeDeserialization(e51) {
    this.map.forEach((t2) => t2.finalizeDeserialization(e51));
  }
  createRigidBody(e51, t2) {
    let n2 = J.intoRaw(t2.translation), r2 = Y.intoRaw(t2.rotation), i2 = J.intoRaw(t2.linvel), a2 = J.intoRaw(t2.centerOfMass), o2 = this.raw.createRigidBody(t2.enabled, n2, r2, t2.gravityScale, t2.mass, t2.massOnly, a2, i2, t2.angvel, t2.principalAngularInertia, t2.translationsEnabledX, t2.translationsEnabledY, t2.rotationsEnabled, t2.linearDamping, t2.angularDamping, t2.status, t2.canSleep, t2.sleeping, t2.softCcdPrediction, t2.ccdEnabled, t2.dominanceGroup, t2.additionalSolverIterations, t2.additionalPgsIterations);
    n2.free(), r2.free(), i2.free(), a2.free();
    let s2 = new i_(this.raw, e51, o2);
    return s2.userData = t2.userData, this.map.set(o2, s2), s2;
  }
  remove(e51, t2, n2, r2, i2, a2) {
    for (let t3 = 0; t3 < this.raw.rbNumColliders(e51); t3 += 1) n2.unmap(this.raw.rbCollider(e51, t3));
    i2.forEachJointHandleAttachedToRigidBody(e51, (e52) => i2.unmap(e52)), a2.forEachJointHandleAttachedToRigidBody(e51, (e52) => a2.unmap(e52)), this.raw.remove(e51, t2.raw, n2.raw, r2.raw, i2.raw, a2.raw), this.map.delete(e51), n2.unmapRemovedColliders();
  }
  mapNewBodies(e51) {
    this.raw.forEachRigidBodyHandle((t2) => {
      this.map.get(t2) || this.map.set(t2, new i_(this.raw, e51, t2));
    });
  }
  unmapRemovedBodies() {
    for (let e51 of this.map.getAll()) this.raw.contains(e51.handle) || this.map.delete(e51.handle);
  }
  len() {
    return this.map.len();
  }
  contains(e51) {
    return this.get(e51) != null;
  }
  get(e51) {
    return this.map.get(e51);
  }
  forEach(e51) {
    this.map.forEach(e51);
  }
  forEachActiveRigidBody(e51, t2) {
    e51.forEachActiveRigidBodyHandle((e52) => {
      t2(this.get(e52));
    });
  }
  getAll() {
    return this.map.getAll();
  }
}, c_;
(function(e51) {
  e51[e51.Vertex = 0] = `Vertex`, e51[e51.Face = 1] = `Face`, e51[e51.Unknown = 2] = `Unknown`;
})(c_ ||= {});
var l_ = class {
  constructor(e51, t2) {
    this.origin = e51, this.dir = t2;
  }
  pointAt(e51) {
    return { x: this.origin.x + this.dir.x * e51, y: this.origin.y + this.dir.y * e51 };
  }
}, u_ = class e33 {
  constructor(e51, t2, n2, r2) {
    this.featureType = c_.Unknown, this.featureId = void 0, this.timeOfImpact = e51, this.normal = t2, r2 !== void 0 && (this.featureId = r2), n2 !== void 0 && (this.featureType = n2);
  }
  static fromBuffer(t2, n2) {
    return t2 ? (t2.normal(q), n2 ??= new e33(0, J.zeros()), n2.timeOfImpact = t2.time_of_impact(), n2.normal = J.fromBuffer(q, n2.normal), n2.featureType = t2.featureType(), n2.featureId = t2.featureId(), t2.free(), n2) : null;
  }
}, d_ = class e34 {
  constructor(e51, t2, n2, r2, i2) {
    this.featureType = c_.Unknown, this.featureId = void 0, this.collider = e51, this.timeOfImpact = t2, this.normal = n2, i2 !== void 0 && (this.featureId = i2), r2 !== void 0 && (this.featureType = r2);
  }
  static fromBuffer(t2, n2, r2) {
    return n2 ? (n2.normal(q), r2 ??= new e34(null, 0, J.zeros()), r2.collider = t2.get(n2.colliderHandle()), r2.timeOfImpact = n2.time_of_impact(), r2.normal = J.fromBuffer(q, r2.normal), r2.featureType = n2.featureType(), r2.featureId = n2.featureId(), n2.free(), r2) : null;
  }
}, f_ = class e35 {
  constructor(e51, t2) {
    this.collider = e51, this.timeOfImpact = t2;
  }
  static fromRaw(t2, n2) {
    if (!n2) return null;
    let r2 = new e35(t2.get(n2.colliderHandle()), n2.timeOfImpact());
    return n2.free(), r2;
  }
}, p_ = class e36 {
  constructor(e51, t2) {
    this.point = e51, this.isInside = t2;
  }
  static fromBuffer(t2, n2) {
    return t2 ? (t2.point(q), n2 ??= new e36(J.zeros(), false), n2.point = J.fromBuffer(q, n2.point), n2.isInside = t2.isInside(), t2.free(), n2) : null;
  }
}, m_ = class e37 {
  constructor(e51, t2, n2, r2, i2) {
    this.featureType = c_.Unknown, this.featureId = void 0, this.collider = e51, this.point = t2, this.isInside = n2, i2 !== void 0 && (this.featureId = i2), r2 !== void 0 && (this.featureType = r2);
  }
  static fromBuffer(t2, n2, r2) {
    return n2 ? (n2.point(q), r2 ??= new e37(null, J.zeros(), false), r2.collider = t2.get(n2.colliderHandle()), r2.point = J.fromBuffer(q, r2.point), r2.isInside = n2.isInside(), r2.featureType = n2.featureType(), r2.featureId = n2.featureId(), n2.free(), r2) : null;
  }
}, h_ = class e38 {
  constructor(e51, t2, n2, r2, i2) {
    this.time_of_impact = e51, this.witness1 = t2, this.witness2 = n2, this.normal1 = r2, this.normal2 = i2;
  }
  static fromBuffer(t2, n2, r2) {
    return n2 ? (r2 ??= new e38(0, J.zeros(), J.zeros(), J.zeros(), J.zeros()), r2.time_of_impact = n2[0], r2.witness1.x = n2[1], r2.witness1.y = n2[2], r2.witness2.x = n2[3], r2.witness2.y = n2[4], r2.normal1.x = n2[5], r2.normal1.y = n2[6], r2.normal2.x = n2[7], r2.normal2.y = n2[8], r2) : null;
  }
}, g_ = class e39 extends h_ {
  constructor(e51, t2, n2, r2, i2, a2) {
    super(t2, n2, r2, i2, a2), this.collider = e51;
  }
  static fromBuffer(t2, n2, r2) {
    return n2 ? (r2 ??= new e39(null, 0, J.zeros(), J.zeros(), J.zeros(), J.zeros()), r2.collider = t2, r2.time_of_impact = n2[0], r2.witness1.x = n2[1], r2.witness1.y = n2[2], r2.witness2.x = n2[3], r2.witness2.y = n2[4], r2.normal1.x = n2[5], r2.normal1.y = n2[6], r2.normal2.x = n2[7], r2.normal2.y = n2[8], r2) : null;
  }
}, __ = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new a();
  }
  castRay(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2) {
    let d2 = J.intoRaw(r2.origin), f2 = J.intoRaw(r2.dir), p2 = f_.fromRaw(n2, this.raw.castRay(e51.raw, t2.raw, n2.raw, d2, f2, i2, a2, o2, s2, c2, l2, u2));
    return d2.free(), f2.free(), p2;
  }
  castRayAndGetNormal(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2) {
    let f2 = J.intoRaw(r2.origin), p2 = J.intoRaw(r2.dir), m2 = d_.fromBuffer(n2, this.raw.castRayAndGetNormal(e51.raw, t2.raw, n2.raw, f2, p2, i2, a2, o2, s2, c2, l2, u2), d2);
    return f2.free(), p2.free(), m2;
  }
  intersectionsWithRay(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2) {
    let f2 = J.intoRaw(r2.origin), p2 = J.intoRaw(r2.dir);
    this.raw.intersectionsWithRay(e51.raw, t2.raw, n2.raw, f2, p2, i2, a2, (e52) => o2(d_.fromBuffer(n2, e52)), s2, c2, l2, u2, d2), f2.free(), p2.free();
  }
  intersectionWithShape(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2) {
    let d2 = J.intoRaw(r2), f2 = Y.intoRaw(i2), p2 = a2.intoRaw(), m2 = this.raw.intersectionWithShape(e51.raw, t2.raw, n2.raw, d2, f2, p2, o2, s2, c2, l2, u2);
    return d2.free(), f2.free(), p2.free(), m2;
  }
  projectPoint(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2) {
    let d2 = J.intoRaw(r2), f2 = m_.fromBuffer(n2, this.raw.projectPoint(e51.raw, t2.raw, n2.raw, d2, i2, a2, o2, s2, c2, l2), u2);
    return d2.free(), f2;
  }
  projectPointAndGetFeature(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2) {
    let u2 = J.intoRaw(r2), d2 = m_.fromBuffer(n2, this.raw.projectPointAndGetFeature(e51.raw, t2.raw, n2.raw, u2, i2, a2, o2, s2, c2), l2);
    return u2.free(), d2;
  }
  intersectionsWithPoint(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2) {
    let u2 = J.intoRaw(r2);
    this.raw.intersectionsWithPoint(e51.raw, t2.raw, n2.raw, u2, i2, a2, o2, s2, c2, l2), u2.free();
  }
  castShape(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2, m2, h2) {
    let g2 = J.intoRaw(r2), _2 = Y.intoRaw(i2), v2 = J.intoRaw(a2), y2 = o2.intoRaw(), b2 = this.raw.castShape(e51.raw, t2.raw, n2.raw, g2, _2, v2, y2, s2, c2, l2, u2, d2, f2, p2, m2), x2 = null;
    if (b2) {
      let e52 = b2.colliderHandle();
      b2.getComponents(q), x2 = g_.fromBuffer(n2.get(e52), q, h2), b2.free();
    }
    return g2.free(), _2.free(), v2.free(), y2.free(), x2;
  }
  intersectionsWithShape(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2) {
    let f2 = J.intoRaw(r2), p2 = Y.intoRaw(i2), m2 = a2.intoRaw();
    this.raw.intersectionsWithShape(e51.raw, t2.raw, n2.raw, f2, p2, m2, o2, s2, c2, l2, u2, d2), f2.free(), p2.free(), m2.free();
  }
  collidersWithAabbIntersectingAabb(e51, t2, n2, r2, i2, a2) {
    let o2 = J.intoRaw(r2), s2 = J.intoRaw(i2);
    this.raw.collidersWithAabbIntersectingAabb(e51.raw, t2.raw, n2.raw, o2, s2, a2), o2.free(), s2.free();
  }
}, v_ = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new C(), this.tempManifold = new y_(null);
  }
  contactPairsWith(e51, t2) {
    this.raw.contact_pairs_with(e51, t2);
  }
  intersectionPairsWith(e51, t2) {
    this.raw.intersection_pairs_with(e51, t2);
  }
  contactPair(e51, t2, n2, r2) {
    let i2 = this.raw.contact_pair(e51, t2);
    if (i2) {
      let t3 = i2.collider1() != e51, a2 = 0;
      for (; a2 < i2.numContactManifolds(); ++a2) this.tempManifold.bodies = n2, this.tempManifold.raw = i2.contactManifold(a2), this.tempManifold.raw && r2(this.tempManifold, t3), this.tempManifold.free();
      i2.free();
    }
  }
  intersectionPair(e51, t2) {
    return this.raw.intersection_pair(e51, t2);
  }
}, y_ = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  constructor(e51, t2) {
    this.raw = e51, this.bodies = t2;
  }
  normal(e51) {
    return this.raw.normal(q), J.fromBuffer(q, e51);
  }
  localNormal1(e51) {
    return this.raw.local_n1(q), J.fromBuffer(q, e51);
  }
  localNormal2(e51) {
    return this.raw.local_n2(q), J.fromBuffer(q, e51);
  }
  subshape1() {
    return this.raw.subshape1();
  }
  subshape2() {
    return this.raw.subshape2();
  }
  numContacts() {
    return this.raw.num_contacts();
  }
  localContactPoint1(e51, t2) {
    return this.raw.contact_local_p1(e51, q) ? J.fromBuffer(q, t2) : null;
  }
  localContactPoint2(e51, t2) {
    return this.raw.contact_local_p2(e51, q) ? J.fromBuffer(q, t2) : null;
  }
  contactDist(e51) {
    return this.raw.contact_dist(e51);
  }
  contactFid1(e51) {
    return this.raw.contact_fid1(e51);
  }
  contactFid2(e51) {
    return this.raw.contact_fid2(e51);
  }
  contactImpulse(e51) {
    return this.raw.contact_impulse(e51);
  }
  contactTangentImpulse(e51) {
    return this.raw.contact_tangent_impulse(e51);
  }
  numSolverContacts() {
    return this.raw.num_solver_contacts();
  }
  solverContactPoint(e51, t2) {
    return this.raw.solver_contact_point(this.bodies.raw, e51, q) ? J.fromBuffer(q, t2) : null;
  }
  solverContactDist(e51) {
    return this.raw.solver_contact_dist(e51);
  }
  friction() {
    return this.raw.friction();
  }
  restitution() {
    return this.raw.restitution();
  }
  solverContactTangentVelocity(e51, t2) {
    return this.raw.solver_contact_tangent_velocity(e51, q), J.fromBuffer(q, t2);
  }
}, b_ = class e40 {
  constructor(e51, t2, n2, r2, i2) {
    this.distance = e51, this.point1 = t2, this.point2 = n2, this.normal1 = r2, this.normal2 = i2;
  }
  static fromBuffer(t2, n2) {
    return t2 ? (t2.getComponents(q), t2.free(), n2 ??= new e40(0, J.zeros(), J.zeros(), J.zeros(), J.zeros()), n2.distance = q[0], n2.point1.x = q[1], n2.point1.y = q[2], n2.point2.x = q[3], n2.point2.y = q[4], n2.normal1.x = q[5], n2.normal1.y = q[6], n2.normal2.x = q[7], n2.normal2.y = q[8], n2) : null;
  }
}, Z = class {
  static fromRaw(e51, t2) {
    let n2 = e51.coShapeType(t2);
    if (n2 === O.Compound) return P_.fromRawShape(e51.coShape(t2));
    let r2, i2, a2, o2, s2, c2;
    switch (n2) {
      case O.Ball:
        return new w_(e51.coRadius(t2));
      case O.Cuboid:
        return e51.coHalfExtents(t2, q), new E_(q[0], q[1]);
      case O.RoundCuboid:
        return r2 = e51.coRoundRadius(t2), e51.coHalfExtents(t2, q), new D_(q[0], q[1], r2);
      case O.Capsule:
        return o2 = e51.coHalfHeight(t2), s2 = e51.coRadius(t2), new O_(o2, s2);
      case O.Segment:
        return i2 = e51.coVertices(t2), new k_(J.new(i2[0], i2[1]), J.new(i2[2], i2[3]));
      case O.Polyline:
        return i2 = e51.coVertices(t2), a2 = e51.coIndices(t2), new M_(i2, a2, e51.coPolylineFlags(t2));
      case O.Triangle:
        return i2 = e51.coVertices(t2), new A_(J.new(i2[0], i2[1]), J.new(i2[2], i2[3]), J.new(i2[4], i2[5]));
      case O.RoundTriangle:
        return i2 = e51.coVertices(t2), r2 = e51.coRoundRadius(t2), new j_(J.new(i2[0], i2[1]), J.new(i2[2], i2[3]), J.new(i2[4], i2[5]), r2);
      case O.HalfSpace:
        return e51.coHalfspaceNormal(t2, q), c2 = J.fromBuffer(q), new T_(c2);
      case O.Voxels:
        return new N_(e51.coVoxelData(t2), e51.coVoxelSize(t2));
      case O.TriMesh:
        i2 = e51.coVertices(t2), a2 = e51.coIndices(t2);
        let l2 = e51.coTriMeshFlags(t2);
        return new F_(i2, a2, l2);
      case O.HeightField:
        let u2 = e51.coHeightfieldHeights(t2);
        return e51.coHeightfieldScale(t2, q), new R_(u2, { x: q[0], y: q[1] });
      case O.ConvexPolygon:
        return i2 = e51.coVertices(t2), new I_(i2, false);
      case O.RoundConvexPolygon:
        return i2 = e51.coVertices(t2), r2 = e51.coRoundRadius(t2), new L_(i2, r2, false);
      default:
        throw Error(`unknown shape type: ` + n2);
    }
  }
  static fromRawShape(e51) {
    if (!e51) return null;
    let t2, n2, r2, i2, a2, o2, s2, c2 = e51.shapeType();
    try {
      switch (c2) {
        case O.Ball:
          return new w_(e51.radius());
        case O.Cuboid:
          return t2 = J.fromRaw(e51.halfExtents()), new E_(t2.x, t2.y);
        case O.RoundCuboid:
          return t2 = J.fromRaw(e51.halfExtents()), n2 = e51.roundRadius(), new D_(t2.x, t2.y, n2);
        case O.Capsule:
          return a2 = e51.halfHeight(), o2 = e51.radius(), new O_(a2, o2);
        case O.Segment:
          return r2 = e51.vertices(), new k_(J.new(r2[0], r2[1]), J.new(r2[2], r2[3]));
        case O.Polyline:
          return r2 = e51.vertices(), i2 = e51.indices(), new M_(r2, i2, e51.polylineFlags());
        case O.Triangle:
          return r2 = e51.vertices(), new A_(J.new(r2[0], r2[1]), J.new(r2[2], r2[3]), J.new(r2[4], r2[5]));
        case O.RoundTriangle:
          return r2 = e51.vertices(), n2 = e51.roundRadius(), new j_(J.new(r2[0], r2[1]), J.new(r2[2], r2[3]), J.new(r2[4], r2[5]), n2);
        case O.HalfSpace:
          return s2 = J.fromRaw(e51.halfspaceNormal()), new T_(s2);
        case O.Voxels:
          return new N_(e51.voxelData(), J.fromRaw(e51.voxelSize()));
        case O.TriMesh:
          r2 = e51.vertices(), i2 = e51.indices();
          let l2 = e51.triMeshFlags();
          return new F_(r2, i2, l2);
        case O.HeightField:
          let u2 = J.fromRaw(e51.heightfieldScale());
          return new R_(e51.heightfieldHeights(), u2);
        case O.ConvexPolygon:
          return r2 = e51.vertices(), new I_(r2, false);
        case O.RoundConvexPolygon:
          return r2 = e51.vertices(), n2 = e51.roundRadius(), new L_(r2, n2, false);
        case O.Compound:
          return P_.fromRawShape(e51);
        default:
          throw Error(`unknown shape type: ` + c2);
      }
    } finally {
      c2 !== O.Compound && e51.free();
    }
  }
  castShape(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2) {
    let d2 = J.intoRaw(e51), f2 = Y.intoRaw(t2), p2 = J.intoRaw(n2), m2 = J.intoRaw(i2), h2 = Y.intoRaw(a2), g2 = J.intoRaw(o2), _2 = this.intoRaw(), v2 = r2.intoRaw(), y2 = _2.castShape(d2, f2, p2, v2, m2, h2, g2, s2, c2, l2), b2 = null;
    return y2 && (y2.getComponents(q), b2 = h_.fromBuffer(null, q, u2), y2.free()), d2.free(), f2.free(), p2.free(), m2.free(), h2.free(), g2.free(), _2.free(), v2.free(), b2;
  }
  intersectsShape(e51, t2, n2, r2, i2) {
    let a2 = J.intoRaw(e51), o2 = Y.intoRaw(t2), s2 = J.intoRaw(r2), c2 = Y.intoRaw(i2), l2 = this.intoRaw(), u2 = n2.intoRaw(), d2 = l2.intersectsShape(a2, o2, u2, s2, c2);
    return a2.free(), o2.free(), s2.free(), c2.free(), l2.free(), u2.free(), d2;
  }
  contactShape(e51, t2, n2, r2, i2, a2, o2) {
    let s2 = J.intoRaw(e51), c2 = Y.intoRaw(t2), l2 = J.intoRaw(r2), u2 = Y.intoRaw(i2), d2 = this.intoRaw(), f2 = n2.intoRaw(), p2 = b_.fromBuffer(d2.contactShape(s2, c2, f2, l2, u2, a2), o2);
    return s2.free(), c2.free(), l2.free(), u2.free(), d2.free(), f2.free(), p2;
  }
  containsPoint(e51, t2, n2) {
    let r2 = J.intoRaw(e51), i2 = Y.intoRaw(t2), a2 = J.intoRaw(n2), o2 = this.intoRaw(), s2 = o2.containsPoint(r2, i2, a2);
    return r2.free(), i2.free(), a2.free(), o2.free(), s2;
  }
  projectPoint(e51, t2, n2, r2, i2) {
    let a2 = J.intoRaw(e51), o2 = Y.intoRaw(t2), s2 = J.intoRaw(n2), c2 = this.intoRaw(), l2 = p_.fromBuffer(c2.projectPoint(a2, o2, s2, r2), i2);
    return a2.free(), o2.free(), s2.free(), c2.free(), l2;
  }
  intersectsRay(e51, t2, n2, r2) {
    let i2 = J.intoRaw(t2), a2 = Y.intoRaw(n2), o2 = J.intoRaw(e51.origin), s2 = J.intoRaw(e51.dir), c2 = this.intoRaw(), l2 = c2.intersectsRay(i2, a2, o2, s2, r2);
    return i2.free(), a2.free(), o2.free(), s2.free(), c2.free(), l2;
  }
  castRay(e51, t2, n2, r2, i2) {
    let a2 = J.intoRaw(t2), o2 = Y.intoRaw(n2), s2 = J.intoRaw(e51.origin), c2 = J.intoRaw(e51.dir), l2 = this.intoRaw(), u2 = l2.castRay(a2, o2, s2, c2, r2, i2);
    return a2.free(), o2.free(), s2.free(), c2.free(), l2.free(), u2;
  }
  castRayAndGetNormal(e51, t2, n2, r2, i2, a2) {
    let o2 = J.intoRaw(t2), s2 = Y.intoRaw(n2), c2 = J.intoRaw(e51.origin), l2 = J.intoRaw(e51.dir), u2 = this.intoRaw(), d2 = u_.fromBuffer(u2.castRayAndGetNormal(o2, s2, c2, l2, r2, i2), a2);
    return o2.free(), s2.free(), c2.free(), l2.free(), u2.free(), d2;
  }
}, Q;
(function(e51) {
  e51[e51.Ball = 0] = `Ball`, e51[e51.Cuboid = 1] = `Cuboid`, e51[e51.Capsule = 2] = `Capsule`, e51[e51.Segment = 3] = `Segment`, e51[e51.Polyline = 4] = `Polyline`, e51[e51.Triangle = 5] = `Triangle`, e51[e51.TriMesh = 6] = `TriMesh`, e51[e51.HeightField = 7] = `HeightField`, e51[e51.Compound = 8] = `Compound`, e51[e51.ConvexPolygon = 9] = `ConvexPolygon`, e51[e51.RoundCuboid = 10] = `RoundCuboid`, e51[e51.RoundTriangle = 11] = `RoundTriangle`, e51[e51.RoundConvexPolygon = 12] = `RoundConvexPolygon`, e51[e51.HalfSpace = 13] = `HalfSpace`, e51[e51.Voxels = 14] = `Voxels`;
})(Q ||= {});
var x_;
(function(e51) {
  e51[e51.ORIENTED = 1] = `ORIENTED`, e51[e51.DEFORMABLE = 2] = `DEFORMABLE`;
})(x_ ||= {});
var S_;
(function(e51) {
  e51[e51.FIX_INTERNAL_EDGES = 1] = `FIX_INTERNAL_EDGES`;
})(S_ ||= {});
var C_;
(function(e51) {
  e51[e51.DELETE_BAD_TOPOLOGY_TRIANGLES = 4] = `DELETE_BAD_TOPOLOGY_TRIANGLES`, e51[e51.ORIENTED = 8] = `ORIENTED`, e51[e51.MERGE_DUPLICATE_VERTICES = 16] = `MERGE_DUPLICATE_VERTICES`, e51[e51.DELETE_DEGENERATE_TRIANGLES = 32] = `DELETE_DEGENERATE_TRIANGLES`, e51[e51.DELETE_DUPLICATE_TRIANGLES = 64] = `DELETE_DUPLICATE_TRIANGLES`, e51[e51.FIX_INTERNAL_EDGES = 144] = `FIX_INTERNAL_EDGES`, e51[e51.DEFORMABLE = 256] = `DEFORMABLE`, e51[e51.FIX_INTERNAL_EDGES_TWO_SIDED = 656] = `FIX_INTERNAL_EDGES_TWO_SIDED`;
})(C_ ||= {});
var w_ = class extends Z {
  constructor(e51) {
    super(), this.type = Q.Ball, this.radius = e51;
  }
  intoRaw() {
    return D.ball(this.radius);
  }
}, T_ = class extends Z {
  constructor(e51) {
    super(), this.type = Q.HalfSpace, this.normal = e51;
  }
  intoRaw() {
    let e51 = J.intoRaw(this.normal), t2 = D.halfspace(e51);
    return e51.free(), t2;
  }
}, E_ = class extends Z {
  constructor(e51, t2) {
    super(), this.type = Q.Cuboid, this.halfExtents = J.new(e51, t2);
  }
  intoRaw() {
    return D.cuboid(this.halfExtents.x, this.halfExtents.y);
  }
}, D_ = class extends Z {
  constructor(e51, t2, n2) {
    super(), this.type = Q.RoundCuboid, this.halfExtents = J.new(e51, t2), this.borderRadius = n2;
  }
  intoRaw() {
    return D.roundCuboid(this.halfExtents.x, this.halfExtents.y, this.borderRadius);
  }
}, O_ = class extends Z {
  constructor(e51, t2) {
    super(), this.type = Q.Capsule, this.halfHeight = e51, this.radius = t2;
  }
  intoRaw() {
    return D.capsule(this.halfHeight, this.radius);
  }
}, k_ = class extends Z {
  constructor(e51, t2) {
    super(), this.type = Q.Segment, this.a = e51, this.b = t2;
  }
  intoRaw() {
    let e51 = J.intoRaw(this.a), t2 = J.intoRaw(this.b), n2 = D.segment(e51, t2);
    return e51.free(), t2.free(), n2;
  }
}, A_ = class extends Z {
  constructor(e51, t2, n2) {
    super(), this.type = Q.Triangle, this.a = e51, this.b = t2, this.c = n2;
  }
  intoRaw() {
    let e51 = J.intoRaw(this.a), t2 = J.intoRaw(this.b), n2 = J.intoRaw(this.c), r2 = D.triangle(e51, t2, n2);
    return e51.free(), t2.free(), n2.free(), r2;
  }
}, j_ = class extends Z {
  constructor(e51, t2, n2, r2) {
    super(), this.type = Q.RoundTriangle, this.a = e51, this.b = t2, this.c = n2, this.borderRadius = r2;
  }
  intoRaw() {
    let e51 = J.intoRaw(this.a), t2 = J.intoRaw(this.b), n2 = J.intoRaw(this.c), r2 = D.roundTriangle(e51, t2, n2, this.borderRadius);
    return e51.free(), t2.free(), n2.free(), r2;
  }
}, M_ = class extends Z {
  constructor(e51, t2, n2) {
    super(), this.type = Q.Polyline, this.vertices = e51, this.indices = t2 ?? new Uint32Array(), this.flags = n2 ?? 0;
  }
  intoRaw() {
    return D.polyline(this.vertices, this.indices, this.flags);
  }
}, N_ = class extends Z {
  constructor(e51, t2) {
    super(), this.type = Q.Voxels, this.data = e51, this.voxelSize = t2;
  }
  intoRaw() {
    let e51 = J.intoRaw(this.voxelSize), t2;
    return t2 = this.data instanceof Int32Array ? D.voxels(e51, this.data) : D.voxelsFromPoints(e51, this.data), e51.free(), t2;
  }
}, P_ = class e41 extends Z {
  constructor(e51, t2, n2, r2) {
    if (super(), this.type = Q.Compound, e51.length !== t2.length || e51.length !== n2.length) throw Error(`shapes, positions, and rotations arrays must have the same length`);
    if (e51.length === 0) throw Error(`a compound shape must contain at least one shape`);
    if (e51.some((e52) => e52.type === Q.Compound)) throw Error(`nested compound shapes are not allowed`);
    this.shapes = e51, this.positions = t2, this.rotations = n2, this.flags = r2 ?? 0;
  }
  static fromRawShape(t2) {
    try {
      let n2 = t2.compoundLen();
      if (n2 == null) throw Error(`Expected a raw compound shape.`);
      let r2 = Array(n2), i2 = Array(n2), a2 = Array(n2);
      for (let e51 = 0; e51 < n2; e51++) r2[e51] = Z.fromRawShape(t2.compoundShape(e51)), i2[e51] = J.fromRaw(t2.compoundTranslation(e51)), a2[e51] = Y.fromRaw(t2.compoundRotation(e51));
      return new e41(r2, i2, a2, t2.compoundFlags());
    } finally {
      t2.free();
    }
  }
  intoRaw() {
    let e51 = this.shapes.map((e52) => e52.intoRaw()), t2 = new Float32Array(this.positions.length * 2);
    this.positions.forEach((e52, n3) => {
      t2[n3 * 2] = e52.x, t2[n3 * 2 + 1] = e52.y;
    });
    let n2 = new Float32Array(this.rotations.length);
    return this.rotations.forEach((e52, t3) => {
      n2[t3] = e52;
    }), D.compound(e51, t2, n2, this.flags);
  }
}, F_ = class extends Z {
  constructor(e51, t2, n2) {
    super(), this.type = Q.TriMesh, this.vertices = e51, this.indices = t2, this.flags = n2;
  }
  intoRaw() {
    return D.trimesh(this.vertices, this.indices, this.flags);
  }
}, I_ = class extends Z {
  constructor(e51, t2) {
    super(), this.type = Q.ConvexPolygon, this.vertices = e51, this.skipConvexHullComputation = !!t2;
  }
  intoRaw() {
    return this.skipConvexHullComputation ? D.convexPolyline(this.vertices) : D.convexHull(this.vertices);
  }
}, L_ = class extends Z {
  constructor(e51, t2, n2) {
    super(), this.type = Q.RoundConvexPolygon, this.vertices = e51, this.borderRadius = t2, this.skipConvexHullComputation = !!n2;
  }
  intoRaw() {
    return this.skipConvexHullComputation ? D.roundConvexPolyline(this.vertices, this.borderRadius) : D.roundConvexHull(this.vertices, this.borderRadius);
  }
}, R_ = class extends Z {
  constructor(e51, t2) {
    super(), this.type = Q.HeightField, this.heights = e51, this.scale = t2;
  }
  intoRaw() {
    let e51 = J.intoRaw(this.scale), t2 = D.heightfield(this.heights, e51);
    return e51.free(), t2;
  }
}, z_ = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new te();
  }
  step(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2) {
    let p2 = J.intoRaw(e51);
    d2 ? this.raw.stepWithEvents(p2, t2.raw, n2.raw, r2.raw, i2.raw, a2.raw, o2.raw, s2.raw, c2.raw, l2.raw, u2.raw, d2.raw, f2, f2 ? f2.filterContactPair : null, f2 ? f2.filterIntersectionPair : null) : this.raw.step(p2, t2.raw, n2.raw, r2.raw, i2.raw, a2.raw, o2.raw, s2.raw, c2.raw, l2.raw, u2.raw), p2.free();
  }
}, B_ = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new se();
  }
  serializeAll(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2) {
    let u2 = J.intoRaw(e51), d2 = this.raw.serializeAll(u2, t2.raw, n2.raw, r2.raw, i2.raw, a2.raw, o2.raw, s2.raw, c2.raw, l2.raw);
    return u2.free(), d2;
  }
  deserializeAll(e51) {
    return q_.fromRaw(this.raw.deserializeAll(e51));
  }
}, V_ = class {
  constructor(e51, t2) {
    this.vertices = e51, this.colors = t2;
  }
}, H_ = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.vertices = void 0, this.colors = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new p();
  }
  render(e51, t2, n2, r2, i2, a2, o2, s2) {
    this.raw.render(e51.raw, t2.raw, n2.raw, r2.raw, i2.raw, a2.raw, o2, t2.castClosure(s2)), this.vertices = this.raw.vertices(), this.colors = this.raw.colors();
  }
}, U_ = class {
}, W_ = class {
  constructor(e51, t2, n2, r2, i2, a2) {
    this.params = t2, this.bodies = i2, this.colliders = a2, this.broadPhase = n2, this.narrowPhase = r2, this.raw = new ee(e51), this.rawCharacterCollision = new s(), this._applyImpulsesToDynamicBodies = false, this._characterMass = null;
  }
  free() {
    this.raw && (this.raw.free(), this.rawCharacterCollision.free()), this.raw = void 0, this.rawCharacterCollision = void 0;
  }
  up() {
    return this.raw.up();
  }
  setUp(e51) {
    let t2 = J.intoRaw(e51);
    return this.raw.setUp(t2);
  }
  applyImpulsesToDynamicBodies() {
    return this._applyImpulsesToDynamicBodies;
  }
  setApplyImpulsesToDynamicBodies(e51) {
    this._applyImpulsesToDynamicBodies = e51;
  }
  characterMass() {
    return this._characterMass;
  }
  setCharacterMass(e51) {
    this._characterMass = e51;
  }
  offset() {
    return this.raw.offset();
  }
  setOffset(e51) {
    this.raw.setOffset(e51);
  }
  normalNudgeFactor() {
    return this.raw.normalNudgeFactor();
  }
  setNormalNudgeFactor(e51) {
    this.raw.setNormalNudgeFactor(e51);
  }
  slideEnabled() {
    return this.raw.slideEnabled();
  }
  setSlideEnabled(e51) {
    this.raw.setSlideEnabled(e51);
  }
  autostepMaxHeight() {
    return this.raw.autostepMaxHeight();
  }
  autostepMinWidth() {
    return this.raw.autostepMinWidth();
  }
  autostepIncludesDynamicBodies() {
    return this.raw.autostepIncludesDynamicBodies();
  }
  autostepEnabled() {
    return this.raw.autostepEnabled();
  }
  enableAutostep(e51, t2, n2) {
    this.raw.enableAutostep(e51, t2, n2);
  }
  disableAutostep() {
    return this.raw.disableAutostep();
  }
  maxSlopeClimbAngle() {
    return this.raw.maxSlopeClimbAngle();
  }
  setMaxSlopeClimbAngle(e51) {
    this.raw.setMaxSlopeClimbAngle(e51);
  }
  minSlopeSlideAngle() {
    return this.raw.minSlopeSlideAngle();
  }
  setMinSlopeSlideAngle(e51) {
    this.raw.setMinSlopeSlideAngle(e51);
  }
  snapToGroundDistance() {
    return this.raw.snapToGroundDistance();
  }
  enableSnapToGround(e51) {
    this.raw.enableSnapToGround(e51);
  }
  disableSnapToGround() {
    this.raw.disableSnapToGround();
  }
  snapToGroundEnabled() {
    return this.raw.snapToGroundEnabled();
  }
  computeColliderMovement(e51, t2, n2, r2, i2) {
    let a2 = J.intoRaw(t2);
    this.raw.computeColliderMovement(this.params.dt, this.broadPhase.raw, this.narrowPhase.raw, this.bodies.raw, this.colliders.raw, e51.handle, a2, this._applyImpulsesToDynamicBodies, this._characterMass, n2, r2, this.colliders.castClosure(i2)), a2.free();
  }
  computedMovement(e51) {
    return this.raw.computedMovement(q), J.fromBuffer(q, e51);
  }
  computedGrounded() {
    return this.raw.computedGrounded();
  }
  numComputedCollisions() {
    return this.raw.numComputedCollisions();
  }
  computedCollision(e51, t2) {
    if (this.raw.computedCollision(e51, this.rawCharacterCollision)) {
      let e52 = this.rawCharacterCollision;
      return t2 ??= new U_(), e52.translationDeltaApplied(q), t2.translationDeltaApplied = J.fromBuffer(q, t2.translationDeltaApplied), e52.translationDeltaRemaining(q), t2.translationDeltaRemaining = J.fromBuffer(q, t2.translationDeltaRemaining), t2.toi = e52.toi(), e52.worldWitness1(q), t2.witness1 = J.fromBuffer(q, t2.witness1), e52.worldWitness2(q), t2.witness2 = J.fromBuffer(q, t2.witness2), e52.worldNormal1(q), t2.normal1 = J.fromBuffer(q, t2.normal1), e52.worldNormal2(q), t2.normal2 = J.fromBuffer(q, t2.normal2), t2.collider = this.colliders.get(e52.handle()), t2;
    }
    return null;
  }
}, G_;
(function(e51) {
  e51[e51.None = 0] = `None`, e51[e51.LinX = 1] = `LinX`, e51[e51.LinY = 2] = `LinY`, e51[e51.LinZ = 4] = `LinZ`, e51[e51.AngZ = 32] = `AngZ`, e51[e51.AllLin = 3] = `AllLin`, e51[e51.AllAng = 32] = `AllAng`, e51[e51.All = 35] = `All`;
})(G_ ||= {});
var K_ = class {
  constructor(e51, t2, n2, r2, i2, a2) {
    this.params = e51, this.bodies = t2, this.raw = new w(n2, r2, i2, a2);
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  setKp(e51, t2) {
    this.raw.set_kp(e51, t2);
  }
  setKi(e51, t2) {
    this.raw.set_kp(e51, t2);
  }
  setKd(e51, t2) {
    this.raw.set_kp(e51, t2);
  }
  setAxes(e51) {
    this.raw.set_axes_mask(e51);
  }
  resetIntegrals() {
    this.raw.reset_integrals();
  }
  applyLinearCorrection(e51, t2, n2) {
    let r2 = J.intoRaw(t2), i2 = J.intoRaw(n2);
    this.raw.apply_linear_correction(this.params.dt, this.bodies.raw, e51.handle, r2, i2), r2.free(), i2.free();
  }
  applyAngularCorrection(e51, t2, n2) {
    this.raw.apply_angular_correction(this.params.dt, this.bodies.raw, e51.handle, t2, n2);
  }
  linearCorrection(e51, t2, n2, r2) {
    let i2 = J.intoRaw(t2), a2 = J.intoRaw(n2);
    return this.raw.linear_correction(this.params.dt, this.bodies.raw, e51.handle, i2, a2, q), i2.free(), a2.free(), J.fromBuffer(q, r2);
  }
  angularCorrection(e51, t2, n2) {
    return this.raw.angular_correction(this.params.dt, this.bodies.raw, e51.handle, t2, n2);
  }
}, q_ = class e42 {
  free() {
    this.integrationParameters.free(), this.islands.free(), this.broadPhase.free(), this.narrowPhase.free(), this.bodies.free(), this.colliders.free(), this.impulseJoints.free(), this.multibodyJoints.free(), this.softBodies.free(), this.ccdSolver.free(), this.physicsPipeline.free(), this.serializationPipeline.free(), this.debugRenderPipeline.free(), this.characterControllers.forEach((e51) => e51.free()), this.pidControllers.forEach((e51) => e51.free()), this.integrationParameters = void 0, this.islands = void 0, this.broadPhase = void 0, this.narrowPhase = void 0, this.bodies = void 0, this.colliders = void 0, this.ccdSolver = void 0, this.impulseJoints = void 0, this.multibodyJoints = void 0, this.softBodies = void 0, this.physicsPipeline = void 0, this.serializationPipeline = void 0, this.debugRenderPipeline = void 0, this.characterControllers = void 0, this.pidControllers = void 0;
  }
  constructor(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2, f2, p2) {
    this.gravity = e51, this.integrationParameters = new gv(t2), this.islands = new Lv(n2), this.broadPhase = new __(r2), this.narrowPhase = new v_(i2), this.bodies = new s_(a2), this.colliders = new iv(o2), this.impulseJoints = new Ov(c2), this.multibodyJoints = new Pv(l2), this.softBodies = new Rv(s2), this.ccdSolver = new Iv(u2), this.physicsPipeline = new z_(d2), this.serializationPipeline = new B_(f2), this.debugRenderPipeline = new H_(p2), this.characterControllers = /* @__PURE__ */ new Set(), this.pidControllers = /* @__PURE__ */ new Set(), this.impulseJoints.finalizeDeserialization(this.bodies), this.bodies.finalizeDeserialization(this.colliders), this.colliders.finalizeDeserialization(this.bodies), this.softBodies.finalizeDeserialization(this.bodies, this.colliders);
  }
  static fromRaw(t2) {
    return t2 ? new e42(J.fromRaw(t2.takeGravity()), t2.takeIntegrationParameters(), t2.takeIslandManager(), t2.takeBroadPhase(), t2.takeNarrowPhase(), t2.takeBodies(), t2.takeColliders(), t2.takeSoftBodies(), t2.takeImpulseJoints(), t2.takeMultibodyJoints()) : null;
  }
  takeSnapshot() {
    return this.serializationPipeline.serializeAll(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.softBodies, this.impulseJoints, this.multibodyJoints);
  }
  static restoreSnapshot(e51) {
    return new B_().deserializeAll(e51);
  }
  debugRender(e51, t2) {
    return this.debugRenderPipeline.render(this.bodies, this.colliders, this.softBodies, this.impulseJoints, this.multibodyJoints, this.narrowPhase, e51, t2), new V_(this.debugRenderPipeline.vertices, this.debugRenderPipeline.colors);
  }
  step(e51, t2) {
    this.physicsPipeline.step(this.gravity, this.integrationParameters, this.islands, this.broadPhase, this.narrowPhase, this.bodies, this.colliders, this.softBodies, this.impulseJoints, this.multibodyJoints, this.ccdSolver, e51, t2), this.mapNewSoftBodies();
  }
  mapNewSoftBodies() {
    this.softBodies.mapNewSoftBodies(this.bodies, this.colliders), this.bodies.mapNewBodies(this.colliders), this.colliders.mapNewColliders(this.bodies), this.bodies.unmapRemovedBodies(), this.colliders.unmapRemovedColliders(), this.impulseJoints.unmapRemovedJoints(), this.multibodyJoints.unmapRemovedJoints();
  }
  propagateModifiedBodyPositionsToColliders() {
    this.bodies.raw.propagateModifiedBodyPositionsToColliders(this.colliders.raw);
  }
  get timestep() {
    return this.integrationParameters.dt;
  }
  set timestep(e51) {
    this.integrationParameters.dt = e51;
  }
  get lengthUnit() {
    return this.integrationParameters.lengthUnit;
  }
  set lengthUnit(e51) {
    this.integrationParameters.lengthUnit = e51;
  }
  get numSolverIterations() {
    return this.integrationParameters.numSolverIterations;
  }
  set numSolverIterations(e51) {
    this.integrationParameters.numSolverIterations = e51;
  }
  get numInternalPgsIterations() {
    return this.integrationParameters.numInternalPgsIterations;
  }
  set numInternalPgsIterations(e51) {
    this.integrationParameters.numInternalPgsIterations = e51;
  }
  get maxCcdSubsteps() {
    return this.integrationParameters.maxCcdSubsteps;
  }
  set maxCcdSubsteps(e51) {
    this.integrationParameters.maxCcdSubsteps = e51;
  }
  createRigidBody(e51) {
    return this.bodies.createRigidBody(this.colliders, e51);
  }
  createCharacterController(e51) {
    let t2 = new W_(e51, this.integrationParameters, this.broadPhase, this.narrowPhase, this.bodies, this.colliders);
    return this.characterControllers.add(t2), t2;
  }
  removeCharacterController(e51) {
    this.characterControllers.delete(e51), e51.free();
  }
  createPidController(e51, t2, n2, r2) {
    let i2 = new K_(this.integrationParameters, this.bodies, e51, t2, n2, r2);
    return this.pidControllers.add(i2), i2;
  }
  removePidController(e51) {
    this.pidControllers.delete(e51), e51.free();
  }
  createCollider(e51, t2) {
    let n2 = t2 ? t2.handle : void 0;
    return this.colliders.createCollider(this.bodies, e51, n2);
  }
  createSoftBody(e51) {
    return this.softBodies.createSoftBody(this.bodies, this.colliders, e51);
  }
  createDeformableCollider(e51, t2, n2) {
    return this.colliders.createDeformableCollider(this.bodies, this.softBodies, e51, t2, n2.handle);
  }
  addSoftBodyCluster(e51, t2) {
    return this.softBodies.addCluster(e51.handle, t2, this.bodies, this.colliders);
  }
  removeSoftBodyCluster(e51, t2) {
    return this.softBodies.removeCluster(e51.handle, t2, this.islands, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
  }
  tearSoftBody(e51, t2, n2) {
    return this.softBodies.tear(e51.handle, t2, n2, this.islands, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
  }
  cutSoftBody(e51, t2) {
    return this.softBodies.cut(e51.handle, t2, this.islands, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
  }
  wakeUpSoftBody(e51, t2) {
    this.softBodies.wakeUp(e51.handle, this.bodies, t2);
  }
  createImpulseJoint(e51, t2, n2, r2) {
    return this.impulseJoints.createJoint(this.bodies, e51, t2.handle, n2.handle, r2);
  }
  createMultibodyJoint(e51, t2, n2, r2) {
    return this.multibodyJoints.createJoint(e51, t2.handle, n2.handle, r2);
  }
  getRigidBody(e51) {
    return this.bodies.get(e51);
  }
  getCollider(e51) {
    return this.colliders.get(e51);
  }
  getImpulseJoint(e51) {
    return this.impulseJoints.get(e51);
  }
  getMultibodyJoint(e51) {
    return this.multibodyJoints.get(e51);
  }
  getSoftBody(e51) {
    return this.softBodies.get(e51);
  }
  removeRigidBody(e51) {
    this.bodies && this.bodies.remove(e51.handle, this.islands, this.colliders, this.softBodies, this.impulseJoints, this.multibodyJoints);
  }
  removeSoftBody(e51) {
    this.softBodies && this.softBodies.remove(e51.handle, this.islands, this.bodies, this.colliders, this.impulseJoints, this.multibodyJoints);
  }
  removeCollider(e51, t2) {
    this.colliders && this.colliders.remove(e51.handle, this.islands, this.bodies, this.softBodies, t2);
  }
  removeImpulseJoint(e51, t2) {
    this.impulseJoints && this.impulseJoints.remove(e51.handle, t2);
  }
  removeMultibodyJoint(e51, t2) {
    this.impulseJoints && this.multibodyJoints.remove(e51.handle, t2);
  }
  forEachCollider(e51) {
    this.colliders.forEach(e51);
  }
  forEachRigidBody(e51) {
    this.bodies.forEach(e51);
  }
  forEachActiveRigidBody(e51) {
    this.bodies.forEachActiveRigidBody(this.islands, e51);
  }
  forEachSoftBody(e51) {
    this.softBodies.forEach(e51);
  }
  castRay(e51, t2, n2, r2, i2, a2, o2, s2) {
    return this.broadPhase.castRay(this.narrowPhase, this.bodies, this.colliders, e51, t2, n2, r2, i2, a2 ? a2.handle : null, o2 ? o2.handle : null, this.colliders.castClosure(s2));
  }
  castRayAndGetNormal(e51, t2, n2, r2, i2, a2, o2, s2) {
    return this.broadPhase.castRayAndGetNormal(this.narrowPhase, this.bodies, this.colliders, e51, t2, n2, r2, i2, a2 ? a2.handle : null, o2 ? o2.handle : null, this.colliders.castClosure(s2));
  }
  intersectionsWithRay(e51, t2, n2, r2, i2, a2, o2, s2, c2) {
    this.broadPhase.intersectionsWithRay(this.narrowPhase, this.bodies, this.colliders, e51, t2, n2, r2, i2, a2, o2 ? o2.handle : null, s2 ? s2.handle : null, this.colliders.castClosure(c2));
  }
  intersectionWithShape(e51, t2, n2, r2, i2, a2, o2, s2) {
    let c2 = this.broadPhase.intersectionWithShape(this.narrowPhase, this.bodies, this.colliders, e51, t2, n2, r2, i2, a2 ? a2.handle : null, o2 ? o2.handle : null, this.colliders.castClosure(s2));
    return c2 == null ? null : this.colliders.get(c2);
  }
  projectPoint(e51, t2, n2, r2, i2, a2, o2) {
    return this.broadPhase.projectPoint(this.narrowPhase, this.bodies, this.colliders, e51, t2, n2, r2, i2 ? i2.handle : null, a2 ? a2.handle : null, this.colliders.castClosure(o2));
  }
  projectPointAndGetFeature(e51, t2, n2, r2, i2, a2) {
    return this.broadPhase.projectPointAndGetFeature(this.narrowPhase, this.bodies, this.colliders, e51, t2, n2, r2 ? r2.handle : null, i2 ? i2.handle : null, this.colliders.castClosure(a2));
  }
  intersectionsWithPoint(e51, t2, n2, r2, i2, a2, o2) {
    this.broadPhase.intersectionsWithPoint(this.narrowPhase, this.bodies, this.colliders, e51, this.colliders.castClosure(t2), n2, r2, i2 ? i2.handle : null, a2 ? a2.handle : null, this.colliders.castClosure(o2));
  }
  castShape(e51, t2, n2, r2, i2, a2, o2, s2, c2, l2, u2, d2) {
    return this.broadPhase.castShape(this.narrowPhase, this.bodies, this.colliders, e51, t2, n2, r2, i2, a2, o2, s2, c2, l2 ? l2.handle : null, u2 ? u2.handle : null, this.colliders.castClosure(d2));
  }
  intersectionsWithShape(e51, t2, n2, r2, i2, a2, o2, s2, c2) {
    this.broadPhase.intersectionsWithShape(this.narrowPhase, this.bodies, this.colliders, e51, t2, n2, this.colliders.castClosure(r2), i2, a2, o2 ? o2.handle : null, s2 ? s2.handle : null, this.colliders.castClosure(c2));
  }
  collidersWithAabbIntersectingAabb(e51, t2, n2) {
    this.broadPhase.collidersWithAabbIntersectingAabb(this.narrowPhase, this.bodies, this.colliders, e51, t2, this.colliders.castClosure(n2));
  }
  contactPairsWith(e51, t2) {
    this.narrowPhase.contactPairsWith(e51.handle, this.colliders.castClosure(t2));
  }
  intersectionPairsWith(e51, t2) {
    this.narrowPhase.intersectionPairsWith(e51.handle, this.colliders.castClosure(t2));
  }
  contactPair(e51, t2, n2) {
    this.narrowPhase.contactPair(e51.handle, t2.handle, this.bodies, n2);
  }
  intersectionPair(e51, t2) {
    return this.narrowPhase.intersectionPair(e51.handle, t2.handle);
  }
  set profilerEnabled(e51) {
    this.physicsPipeline.raw.set_profiler_enabled(e51);
  }
  get profilerEnabled() {
    return this.physicsPipeline.raw.is_profiler_enabled();
  }
  timingStep() {
    return this.physicsPipeline.raw.timing_step();
  }
  timingCollisionDetection() {
    return this.physicsPipeline.raw.timing_collision_detection();
  }
  timingBroadPhase() {
    return this.physicsPipeline.raw.timing_broad_phase();
  }
  timingNarrowPhase() {
    return this.physicsPipeline.raw.timing_narrow_phase();
  }
  timingSolver() {
    return this.physicsPipeline.raw.timing_solver();
  }
  timingVelocityAssembly() {
    return this.physicsPipeline.raw.timing_velocity_assembly();
  }
  timingVelocityResolution() {
    return this.physicsPipeline.raw.timing_velocity_resolution();
  }
  timingVelocityUpdate() {
    return this.physicsPipeline.raw.timing_velocity_update();
  }
  timingVelocityWriteback() {
    return this.physicsPipeline.raw.timing_velocity_writeback();
  }
  timingCcd() {
    return this.physicsPipeline.raw.timing_ccd();
  }
  timingCcdToiComputation() {
    return this.physicsPipeline.raw.timing_ccd_toi_computation();
  }
  timingCcdBroadPhase() {
    return this.physicsPipeline.raw.timing_ccd_broad_phase();
  }
  timingCcdNarrowPhase() {
    return this.physicsPipeline.raw.timing_ccd_narrow_phase();
  }
  timingCcdSolver() {
    return this.physicsPipeline.raw.timing_ccd_solver();
  }
  timingIslandConstruction() {
    return this.physicsPipeline.raw.timing_island_construction();
  }
  timingUserChanges() {
    return this.physicsPipeline.raw.timing_user_changes();
  }
}, J_;
(function(e51) {
  e51[e51.NONE = 0] = `NONE`, e51[e51.COLLISION_EVENTS = 1] = `COLLISION_EVENTS`, e51[e51.CONTACT_FORCE_EVENTS = 2] = `CONTACT_FORCE_EVENTS`;
})(J_ ||= {});
var Y_ = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  collider1() {
    return this.raw.collider1();
  }
  collider2() {
    return this.raw.collider2();
  }
  totalForce(e51) {
    return this.raw.total_force(q), J.fromBuffer(q, e51);
  }
  totalForceMagnitude() {
    return this.raw.total_force_magnitude();
  }
  maxForceDirection(e51) {
    return this.raw.max_force_direction(q), J.fromBuffer(q, e51);
  }
  maxForceMagnitude() {
    return this.raw.max_force_magnitude();
  }
}, X_ = class {
  constructor(e51, t2) {
    this.raw = t2 || new h(e51);
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  drainCollisionEvents(e51) {
    this.raw.drainCollisionEvents(e51);
  }
  drainContactForceEvents(e51) {
    let t2 = new Y_();
    this.raw.drainContactForceEvents((n2) => {
      t2.raw = n2, e51(t2), t2.free();
    });
  }
  drainSoftBodyTearEvents(e51) {
    let t2 = new hv();
    this.raw.drainSoftBodyTearEvents((n2) => {
      t2.raw = n2, e51(t2), t2.free();
    });
  }
  clear() {
    this.raw.clear();
  }
}, Z_;
(function(e51) {
  e51[e51.NONE = 0] = `NONE`, e51[e51.FILTER_CONTACT_PAIRS = 1] = `FILTER_CONTACT_PAIRS`, e51[e51.FILTER_INTERSECTION_PAIRS = 2] = `FILTER_INTERSECTION_PAIRS`;
})(Z_ ||= {});
var Q_;
(function(e51) {
  e51[e51.EMPTY = 0] = `EMPTY`, e51[e51.COMPUTE_IMPULSE = 1] = `COMPUTE_IMPULSE`;
})(Q_ ||= {});
var $_;
(function(e51) {
  e51[e51.EXCLUDE_FIXED = 1] = `EXCLUDE_FIXED`, e51[e51.EXCLUDE_KINEMATIC = 2] = `EXCLUDE_KINEMATIC`, e51[e51.EXCLUDE_DYNAMIC = 4] = `EXCLUDE_DYNAMIC`, e51[e51.EXCLUDE_SENSORS = 8] = `EXCLUDE_SENSORS`, e51[e51.EXCLUDE_SOLIDS = 16] = `EXCLUDE_SOLIDS`, e51[e51.ONLY_DYNAMIC = 3] = `ONLY_DYNAMIC`, e51[e51.ONLY_KINEMATIC = 5] = `ONLY_KINEMATIC`, e51[e51.ONLY_FIXED = 6] = `ONLY_FIXED`;
})($_ ||= {});
var ev;
(function(e51) {
  e51[e51.DYNAMIC_DYNAMIC = 1] = `DYNAMIC_DYNAMIC`, e51[e51.DYNAMIC_KINEMATIC = 12] = `DYNAMIC_KINEMATIC`, e51[e51.DYNAMIC_FIXED = 2] = `DYNAMIC_FIXED`, e51[e51.KINEMATIC_KINEMATIC = 52224] = `KINEMATIC_KINEMATIC`, e51[e51.KINEMATIC_FIXED = 8704] = `KINEMATIC_FIXED`, e51[e51.FIXED_FIXED = 32] = `FIXED_FIXED`, e51[e51.DEFAULT = 15] = `DEFAULT`, e51[e51.ALL = 60943] = `ALL`;
})(ev ||= {});
var tv = class {
  constructor(e51, t2, n2, r2) {
    this.colliderSet = e51, this.handle = t2, this._parent = n2, this._shape = r2;
  }
  finalizeDeserialization(e51) {
    this.handle != null && (this._parent = e51.get(this.colliderSet.raw.coParent(this.handle)));
  }
  ensureShapeIsCached() {
    this._shape ||= Z.fromRaw(this.colliderSet.raw, this.handle);
  }
  get shape() {
    return this.ensureShapeIsCached(), this._shape;
  }
  clearShapeCache() {
    this._shape = null;
  }
  isValid() {
    return this.colliderSet.raw.contains(this.handle);
  }
  translation(e51) {
    return this.colliderSet.raw.coTranslation(this.handle, q), J.fromBuffer(q, e51);
  }
  translationWrtParent(e51) {
    return this.colliderSet.raw.coTranslationWrtParent(this.handle, q) ? J.fromBuffer(q, e51) : null;
  }
  rotation() {
    return this.colliderSet.raw.coRotation(this.handle);
  }
  rotationWrtParent() {
    let e51 = this.colliderSet.raw.coRotationWrtParent(this.handle);
    return isNaN(e51) ? null : e51;
  }
  isSensor() {
    return this.colliderSet.raw.coIsSensor(this.handle);
  }
  setSensor(e51) {
    this.colliderSet.raw.coSetSensor(this.handle, e51);
  }
  setShape(e51) {
    let t2 = e51.intoRaw();
    this.colliderSet.raw.coSetShape(this.handle, t2), t2.free(), this._shape = e51;
  }
  setEnabled(e51) {
    this.colliderSet.raw.coSetEnabled(this.handle, e51);
  }
  isEnabled() {
    return this.colliderSet.raw.coIsEnabled(this.handle);
  }
  setRestitution(e51) {
    this.colliderSet.raw.coSetRestitution(this.handle, e51);
  }
  setFriction(e51) {
    this.colliderSet.raw.coSetFriction(this.handle, e51);
  }
  frictionCombineRule() {
    return this.colliderSet.raw.coFrictionCombineRule(this.handle);
  }
  setFrictionCombineRule(e51) {
    this.colliderSet.raw.coSetFrictionCombineRule(this.handle, e51);
  }
  restitutionCombineRule() {
    return this.colliderSet.raw.coRestitutionCombineRule(this.handle);
  }
  setRestitutionCombineRule(e51) {
    this.colliderSet.raw.coSetRestitutionCombineRule(this.handle, e51);
  }
  setCollisionGroups(e51) {
    this.colliderSet.raw.coSetCollisionGroups(this.handle, e51);
  }
  setSolverGroups(e51) {
    this.colliderSet.raw.coSetSolverGroups(this.handle, e51);
  }
  contactSkin() {
    return this.colliderSet.raw.coContactSkin(this.handle);
  }
  setContactSkin(e51) {
    return this.colliderSet.raw.coSetContactSkin(this.handle, e51);
  }
  activeHooks() {
    return this.colliderSet.raw.coActiveHooks(this.handle);
  }
  setActiveHooks(e51) {
    this.colliderSet.raw.coSetActiveHooks(this.handle, e51);
  }
  activeEvents() {
    return this.colliderSet.raw.coActiveEvents(this.handle);
  }
  setActiveEvents(e51) {
    this.colliderSet.raw.coSetActiveEvents(this.handle, e51);
  }
  activeCollisionTypes() {
    return this.colliderSet.raw.coActiveCollisionTypes(this.handle);
  }
  setContactForceEventThreshold(e51) {
    return this.colliderSet.raw.coSetContactForceEventThreshold(this.handle, e51);
  }
  contactForceEventThreshold() {
    return this.colliderSet.raw.coContactForceEventThreshold(this.handle);
  }
  setActiveCollisionTypes(e51) {
    this.colliderSet.raw.coSetActiveCollisionTypes(this.handle, e51);
  }
  setDensity(e51) {
    this.colliderSet.raw.coSetDensity(this.handle, e51);
  }
  setMass(e51) {
    this.colliderSet.raw.coSetMass(this.handle, e51);
  }
  setMassProperties(e51, t2, n2) {
    let r2 = J.intoRaw(t2);
    this.colliderSet.raw.coSetMassProperties(this.handle, e51, r2, n2), r2.free();
  }
  setTranslation(e51) {
    this.colliderSet.raw.coSetTranslation(this.handle, e51.x, e51.y);
  }
  setTranslationWrtParent(e51) {
    this.colliderSet.raw.coSetTranslationWrtParent(this.handle, e51.x, e51.y);
  }
  setRotation(e51) {
    this.colliderSet.raw.coSetRotation(this.handle, e51);
  }
  setRotationWrtParent(e51) {
    this.colliderSet.raw.coSetRotationWrtParent(this.handle, e51);
  }
  shapeType() {
    return this.colliderSet.raw.coShapeType(this.handle);
  }
  halfExtents(e51) {
    return this.colliderSet.raw.coHalfExtents(this.handle, q) ? J.fromBuffer(q, e51) : null;
  }
  setHalfExtents(e51) {
    let t2 = J.intoRaw(e51);
    this.colliderSet.raw.coSetHalfExtents(this.handle, t2);
  }
  radius() {
    return this.colliderSet.raw.coRadius(this.handle);
  }
  setRadius(e51) {
    this.colliderSet.raw.coSetRadius(this.handle, e51);
  }
  roundRadius() {
    return this.colliderSet.raw.coRoundRadius(this.handle);
  }
  setRoundRadius(e51) {
    this.colliderSet.raw.coSetRoundRadius(this.handle, e51);
  }
  halfHeight() {
    return this.colliderSet.raw.coHalfHeight(this.handle);
  }
  setHalfHeight(e51) {
    this.colliderSet.raw.coSetHalfHeight(this.handle, e51);
  }
  setVoxel(e51, t2, n2) {
    this.colliderSet.raw.coSetVoxel(this.handle, e51, t2, n2), this._shape = null;
  }
  propagateVoxelChange(e51, t2, n2, r2, i2) {
    this.colliderSet.raw.coPropagateVoxelChange(this.handle, e51.handle, t2, n2, r2, i2), this._shape = null;
  }
  combineVoxelStates(e51, t2, n2) {
    this.colliderSet.raw.coCombineVoxelStates(this.handle, e51.handle, t2, n2), this._shape = null;
  }
  vertices() {
    return this.colliderSet.raw.coVertices(this.handle);
  }
  indices() {
    return this.colliderSet.raw.coIndices(this.handle);
  }
  heightfieldHeights() {
    return this.colliderSet.raw.coHeightfieldHeights(this.handle);
  }
  heightfieldScale(e51) {
    return this.colliderSet.raw.coHeightfieldScale(this.handle, q) ? J.fromBuffer(q, e51) : null;
  }
  parent() {
    return this._parent;
  }
  softBody() {
    let e51 = this.colliderSet.raw.coSoftBody(this.handle);
    return e51 === void 0 ? null : e51;
  }
  isDeformable() {
    return this.colliderSet.raw.coIsDeformable(this.handle);
  }
  friction() {
    return this.colliderSet.raw.coFriction(this.handle);
  }
  restitution() {
    return this.colliderSet.raw.coRestitution(this.handle);
  }
  density() {
    return this.colliderSet.raw.coDensity(this.handle);
  }
  mass() {
    return this.colliderSet.raw.coMass(this.handle);
  }
  volume() {
    return this.colliderSet.raw.coVolume(this.handle);
  }
  collisionGroups() {
    return this.colliderSet.raw.coCollisionGroups(this.handle);
  }
  solverGroups() {
    return this.colliderSet.raw.coSolverGroups(this.handle);
  }
  containsPoint(e51) {
    let t2 = J.intoRaw(e51), n2 = this.colliderSet.raw.coContainsPoint(this.handle, t2);
    return t2.free(), n2;
  }
  projectPoint(e51, t2, n2) {
    let r2 = J.intoRaw(e51), i2 = p_.fromBuffer(this.colliderSet.raw.coProjectPoint(this.handle, r2, t2), n2);
    return r2.free(), i2;
  }
  intersectsRay(e51, t2) {
    let n2 = J.intoRaw(e51.origin), r2 = J.intoRaw(e51.dir), i2 = this.colliderSet.raw.coIntersectsRay(this.handle, n2, r2, t2);
    return n2.free(), r2.free(), i2;
  }
  castShape(e51, t2, n2, r2, i2, a2, o2, s2, c2) {
    let l2 = J.intoRaw(e51), u2 = J.intoRaw(n2), d2 = Y.intoRaw(r2), f2 = J.intoRaw(i2), p2 = t2.intoRaw(), m2 = this.colliderSet.raw.coCastShape(this.handle, l2, p2, u2, d2, f2, a2, o2, s2), h2 = null;
    return m2 && (m2.getComponents(q), h2 = h_.fromBuffer(null, q, c2), m2.free()), l2.free(), u2.free(), d2.free(), f2.free(), p2.free(), h2;
  }
  castCollider(e51, t2, n2, r2, i2, a2, o2) {
    let s2 = J.intoRaw(e51), c2 = J.intoRaw(n2), l2 = this.colliderSet.raw.coCastCollider(this.handle, s2, t2.handle, c2, r2, i2, a2), u2 = null;
    if (l2) {
      let e52 = l2.colliderHandle();
      l2.getComponents(q), u2 = g_.fromBuffer(this.colliderSet.get(e52), q, o2), l2.free();
    }
    return s2.free(), c2.free(), u2;
  }
  intersectsShape(e51, t2, n2) {
    let r2 = J.intoRaw(t2), i2 = Y.intoRaw(n2), a2 = e51.intoRaw(), o2 = this.colliderSet.raw.coIntersectsShape(this.handle, a2, r2, i2);
    return r2.free(), i2.free(), a2.free(), o2;
  }
  contactShape(e51, t2, n2, r2, i2) {
    let a2 = J.intoRaw(t2), o2 = Y.intoRaw(n2), s2 = e51.intoRaw(), c2 = b_.fromBuffer(this.colliderSet.raw.coContactShape(this.handle, s2, a2, o2, r2), i2);
    return a2.free(), o2.free(), s2.free(), c2;
  }
  contactCollider(e51, t2, n2) {
    return b_.fromBuffer(this.colliderSet.raw.coContactCollider(this.handle, e51.handle, t2), n2);
  }
  castRay(e51, t2, n2) {
    let r2 = J.intoRaw(e51.origin), i2 = J.intoRaw(e51.dir), a2 = this.colliderSet.raw.coCastRay(this.handle, r2, i2, t2, n2);
    return r2.free(), i2.free(), a2;
  }
  castRayAndGetNormal(e51, t2, n2, r2) {
    let i2 = J.intoRaw(e51.origin), a2 = J.intoRaw(e51.dir), o2 = u_.fromBuffer(this.colliderSet.raw.coCastRayAndGetNormal(this.handle, i2, a2, t2, n2), r2);
    return i2.free(), a2.free(), o2;
  }
}, nv;
(function(e51) {
  e51[e51.Density = 0] = `Density`, e51[e51.Mass = 1] = `Mass`, e51[e51.MassProps = 2] = `MassProps`;
})(nv ||= {});
var rv = class e43 {
  constructor(e51) {
    this.enabled = true, this.shape = e51, this.massPropsMode = nv.Density, this.density = 1, this.friction = 0.5, this.restitution = 0, this.rotation = Y.identity(), this.translation = J.zeros(), this.isSensor = false, this.collisionGroups = 4294967295, this.solverGroups = 4294967295, this.frictionCombineRule = Fv.Average, this.restitutionCombineRule = Fv.Average, this.activeCollisionTypes = ev.DEFAULT, this.activeEvents = J_.NONE, this.activeHooks = Z_.NONE, this.mass = 0, this.centerOfMass = J.zeros(), this.contactForceEventThreshold = 0, this.contactSkin = 0, this.principalAngularInertia = 0, this.rotationsEnabled = true;
  }
  static ball(t2) {
    let n2 = new w_(t2);
    return new e43(n2);
  }
  static capsule(t2, n2) {
    let r2 = new O_(t2, n2);
    return new e43(r2);
  }
  static segment(t2, n2) {
    let r2 = new k_(t2, n2);
    return new e43(r2);
  }
  static triangle(t2, n2, r2) {
    let i2 = new A_(t2, n2, r2);
    return new e43(i2);
  }
  static roundTriangle(t2, n2, r2, i2) {
    let a2 = new j_(t2, n2, r2, i2);
    return new e43(a2);
  }
  static polyline(t2, n2, r2) {
    let i2 = new M_(t2, n2, r2);
    return new e43(i2);
  }
  static voxels(t2, n2) {
    let r2 = new N_(t2, n2);
    return new e43(r2);
  }
  static trimesh(t2, n2, r2) {
    let i2 = new F_(t2, n2, r2);
    return new e43(i2);
  }
  static cuboid(t2, n2) {
    let r2 = new E_(t2, n2);
    return new e43(r2);
  }
  static roundCuboid(t2, n2, r2) {
    let i2 = new D_(t2, n2, r2);
    return new e43(i2);
  }
  static halfspace(t2) {
    let n2 = new T_(t2);
    return new e43(n2);
  }
  static heightfield(t2, n2) {
    let r2 = new R_(t2, n2);
    return new e43(r2);
  }
  static convexHull(t2) {
    let n2 = new I_(t2, false);
    return new e43(n2);
  }
  static convexPolyline(t2) {
    let n2 = new I_(t2, true);
    return new e43(n2);
  }
  static roundConvexHull(t2, n2) {
    let r2 = new L_(t2, n2, false);
    return new e43(r2);
  }
  static roundConvexPolyline(t2, n2) {
    let r2 = new L_(t2, n2, true);
    return new e43(r2);
  }
  static compound(t2, n2, r2, i2) {
    let a2 = new P_(t2, n2, r2, i2);
    return new e43(a2);
  }
  static convexDecomposition(t2, n2, r2, i2) {
    let a2, o2 = i2 ?? 0;
    if (r2) {
      let e51 = new fe();
      r2.alpha !== void 0 && (e51.alpha = r2.alpha), r2.beta !== void 0 && (e51.beta = r2.beta), r2.concavity !== void 0 && (e51.concavity = r2.concavity), r2.planeDownsampling !== void 0 && (e51.plane_downsampling = r2.planeDownsampling), r2.convexHullDownsampling !== void 0 && (e51.convex_hull_downsampling = r2.convexHullDownsampling), r2.maxConvexHulls !== void 0 && (e51.max_convex_hulls = r2.maxConvexHulls), r2.resolution !== void 0 && (e51.resolution = r2.resolution), r2.convexHullApproximation !== void 0 && (e51.convex_hull_approximation = r2.convexHullApproximation), a2 = D.convexDecompositionWithParams(t2, n2, e51, o2), e51.free();
    } else a2 = D.convexDecomposition(t2, n2, o2);
    if (!a2) return null;
    let s2 = Z.fromRawShape(a2);
    return new e43(s2);
  }
  setTranslation(e51, t2) {
    if (typeof e51 != `number` || typeof t2 != `number`) throw TypeError(`The translation components must be numbers.`);
    return this.translation = { x: e51, y: t2 }, this;
  }
  setRotation(e51) {
    return this.rotation = e51, this;
  }
  setSensor(e51) {
    return this.isSensor = e51, this;
  }
  setEnabled(e51) {
    return this.enabled = e51, this;
  }
  setContactSkin(e51) {
    return this.contactSkin = e51, this;
  }
  setDensity(e51) {
    return this.massPropsMode = nv.Density, this.density = e51, this;
  }
  setMass(e51) {
    return this.massPropsMode = nv.Mass, this.mass = e51, this;
  }
  setMassProperties(e51, t2, n2) {
    return this.massPropsMode = nv.MassProps, this.mass = e51, J.copy(this.centerOfMass, t2), this.principalAngularInertia = n2, this;
  }
  setRestitution(e51) {
    return this.restitution = e51, this;
  }
  setFriction(e51) {
    return this.friction = e51, this;
  }
  setFrictionCombineRule(e51) {
    return this.frictionCombineRule = e51, this;
  }
  setRestitutionCombineRule(e51) {
    return this.restitutionCombineRule = e51, this;
  }
  setCollisionGroups(e51) {
    return this.collisionGroups = e51, this;
  }
  setSolverGroups(e51) {
    return this.solverGroups = e51, this;
  }
  setActiveHooks(e51) {
    return this.activeHooks = e51, this;
  }
  setActiveEvents(e51) {
    return this.activeEvents = e51, this;
  }
  setActiveCollisionTypes(e51) {
    return this.activeCollisionTypes = e51, this;
  }
  setContactForceEventThreshold(e51) {
    return this.contactForceEventThreshold = e51, this;
  }
}, iv = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new c(), this.map = new o_(), e51 && e51.forEachColliderHandle((e52) => {
      this.map.set(e52, new tv(this, e52, null));
    });
  }
  castClosure(e51) {
    return (t2) => {
      if (e51) return e51(this.get(t2));
    };
  }
  finalizeDeserialization(e51) {
    this.map.forEach((t2) => t2.finalizeDeserialization(e51));
  }
  createCollider(e51, t2, n2) {
    let r2 = n2 != null && n2 != null;
    if (r2 && isNaN(n2)) throw Error(`Cannot create a collider with a parent rigid-body handle that is not a number.`);
    let i2 = t2.shape.intoRaw(), a2 = J.intoRaw(t2.translation), o2 = Y.intoRaw(t2.rotation), s2 = J.intoRaw(t2.centerOfMass), c2 = this.raw.createCollider(t2.enabled, i2, a2, o2, t2.massPropsMode, t2.mass, s2, t2.principalAngularInertia, t2.density, t2.friction, t2.restitution, t2.frictionCombineRule, t2.restitutionCombineRule, t2.isSensor, t2.collisionGroups, t2.solverGroups, t2.activeCollisionTypes, t2.activeHooks, t2.activeEvents, t2.contactForceEventThreshold, t2.contactSkin, r2, r2 ? n2 : 0, e51.raw);
    i2.free(), a2.free(), o2.free(), s2.free();
    let l2 = r2 ? e51.get(n2) : null, u2 = new tv(this, c2, l2, t2.shape);
    return this.map.set(c2, u2), u2;
  }
  createDeformableCollider(e51, t2, n2, r2, i2) {
    let a2 = n2.shape.intoRaw(), o2 = J.intoRaw(n2.translation), s2 = Y.intoRaw(n2.rotation), c2 = J.intoRaw(n2.centerOfMass), l2 = this.raw.createDeformableCollider(n2.enabled, a2, o2, s2, n2.massPropsMode, n2.mass, c2, n2.principalAngularInertia, n2.density, n2.friction, n2.restitution, n2.frictionCombineRule, n2.restitutionCombineRule, n2.isSensor, n2.collisionGroups, n2.solverGroups, n2.activeCollisionTypes, n2.activeHooks, n2.activeEvents, n2.contactForceEventThreshold, n2.contactSkin, r2.rawMode(), r2.particles, r2.eps, r2.selfContacts, i2, e51.raw, t2.raw);
    if (a2.free(), o2.free(), s2.free(), c2.free(), l2 === void 0) return null;
    let u2 = e51.get(i2), d2 = new tv(this, l2, u2, n2.shape);
    return this.map.set(l2, d2), d2;
  }
  mapNewColliders(e51) {
    this.raw.forEachColliderHandle((t2) => {
      if (!this.map.get(t2)) {
        let n2 = this.raw.coParent(t2), r2 = n2 === void 0 ? null : e51.get(n2);
        this.map.set(t2, new tv(this, t2, r2));
      }
    });
  }
  unmapRemovedColliders() {
    for (let e51 of this.map.getAll()) this.raw.contains(e51.handle) || this.map.delete(e51.handle);
  }
  remove(e51, t2, n2, r2, i2) {
    this.raw.remove(e51, t2.raw, n2.raw, r2.raw, i2), this.unmap(e51);
  }
  unmap(e51) {
    this.map.delete(e51);
  }
  get(e51) {
    return this.map.get(e51);
  }
  len() {
    return this.map.len();
  }
  contains(e51) {
    return this.get(e51) != null;
  }
  forEach(e51) {
    this.map.forEach(e51);
  }
  getAll() {
    return this.map.getAll();
  }
}, av;
(function(e51) {
  e51[e51.Volume = 0] = `Volume`, e51[e51.Corotational = 1] = `Corotational`, e51[e51.NeoHookean = 2] = `NeoHookean`;
})(av ||= {});
var ov;
(function(e51) {
  e51[e51.Both = 0] = `Both`, e51[e51.Compression = 1] = `Compression`, e51[e51.Tension = 2] = `Tension`;
})(ov ||= {});
var sv;
(function(e51) {
  e51[e51.Constraints = 0] = `Constraints`, e51[e51.Fem = 1] = `Fem`;
})(sv ||= {});
var cv;
(function(e51) {
  e51[e51.Keep = 0] = `Keep`, e51[e51.StandDown = 1] = `StandDown`, e51[e51.AlongNormal = 2] = `AlongNormal`;
})(cv ||= {});
var lv = class e44 {
  constructor() {
    e44.copyFromRaw(this, new de(), true);
  }
  static fromRaw(t2) {
    let n2 = new e44();
    return e44.copyFromRaw(n2, t2, true), n2;
  }
  static copyFromRaw(e51, t2, n2) {
    e51.authoredVelocityMargin = t2.authoredVelocityMargin, e51.edgeSpeculation = t2.edgeSpeculation, e51.invertedCellDetection = t2.invertedCellDetection, e51.selfCrossingDetection = t2.selfCrossingDetection, e51.detectionMotionGating = t2.detectionMotionGating, e51.crossBodyDetection = t2.crossBodyDetection, e51.selfStandDown = t2.selfStandDown, e51.crossBodyExpelGate = t2.crossBodyExpelGate, e51.edgeStandDown = t2.edgeStandDown, e51.crossingRepulsion = t2.crossingRepulsion, e51.crossingRepulsionGuide = t2.crossingRepulsionGuide, e51.crossingRepulsionSelfGuide = t2.crossingRepulsionSelfGuide, e51.overlapConstraints = t2.overlapConstraints, e51.overlapRigid = t2.overlapRigid, e51.overlapSkipSelfTangled = t2.overlapSkipSelfTangled, e51.overlapEdgeStandDown = t2.overlapEdgeStandDown, e51.overlapSkinVolume = t2.overlapSkinVolume, e51.overlapSelfRegions = t2.overlapSelfRegions, e51.overlapNormalPush = t2.overlapNormalPush, e51.overlapMultiVolume = t2.overlapMultiVolume, e51.recoveryPace = t2.recoveryPace, e51.overlapConstraintPace = t2.overlapConstraintPace, e51.overlapKeptDepth = t2.overlapKeptDepth, e51.overlapProgressMargin = t2.overlapProgressMargin, e51.overlapSplit = t2.overlapSplit, e51.overlapPatience = t2.overlapPatience, e51.overlapPatchConstraints = t2.overlapPatchConstraints, n2 && t2.free();
  }
  intoRaw() {
    let e51 = new de();
    return e51.authoredVelocityMargin = this.authoredVelocityMargin, e51.edgeSpeculation = this.edgeSpeculation, e51.invertedCellDetection = this.invertedCellDetection, e51.selfCrossingDetection = this.selfCrossingDetection, e51.detectionMotionGating = this.detectionMotionGating, e51.crossBodyDetection = this.crossBodyDetection, e51.selfStandDown = this.selfStandDown, e51.crossBodyExpelGate = this.crossBodyExpelGate, e51.edgeStandDown = this.edgeStandDown, e51.crossingRepulsion = this.crossingRepulsion, e51.crossingRepulsionGuide = this.crossingRepulsionGuide, e51.crossingRepulsionSelfGuide = this.crossingRepulsionSelfGuide, e51.overlapConstraints = this.overlapConstraints, e51.overlapRigid = this.overlapRigid, e51.overlapSkipSelfTangled = this.overlapSkipSelfTangled, e51.overlapEdgeStandDown = this.overlapEdgeStandDown, e51.overlapSkinVolume = this.overlapSkinVolume, e51.overlapSelfRegions = this.overlapSelfRegions, e51.overlapNormalPush = this.overlapNormalPush, e51.overlapMultiVolume = this.overlapMultiVolume, e51.recoveryPace = this.recoveryPace, e51.overlapConstraintPace = this.overlapConstraintPace, e51.overlapKeptDepth = this.overlapKeptDepth, e51.overlapProgressMargin = this.overlapProgressMargin, e51.overlapSplit = this.overlapSplit, e51.overlapPatience = this.overlapPatience, e51.overlapPatchConstraints = this.overlapPatchConstraints, e51;
  }
}, uv;
(function(e51) {
  e51[e51.Direct = 0] = `Direct`, e51[e51.DirectByPosition = 1] = `DirectByPosition`, e51[e51.Skinned = 2] = `Skinned`;
})(uv ||= {});
var dv = class e45 {
  constructor(e51) {
    this.mode = e51, this.particles = new Uint32Array(), this.eps = 0, this.selfContacts = false;
  }
  static direct(t2) {
    let n2 = new e45(uv.Direct);
    return n2.particles = Uint32Array.from(t2), n2;
  }
  static directByPosition(t2) {
    let n2 = new e45(uv.DirectByPosition);
    return n2.eps = t2, n2;
  }
  static skinned() {
    return new e45(uv.Skinned);
  }
  setSelfContacts(e51) {
    return this.selfContacts = e51, this;
  }
  rawMode() {
    return this.mode;
  }
}, fv = class e46 {
  constructor() {
    e46.copyFromRaw(this, new A(), true);
  }
  static uniform(t2, n2) {
    let r2 = new e46(), i2 = A.uniform(t2, n2);
    return e46.copyFromRaw(r2, i2, true), r2;
  }
  static fromRaw(t2) {
    let n2 = new e46();
    return e46.copyFromRaw(n2, t2, true), n2;
  }
  static copyFromRaw(e51, t2, n2) {
    e51.edgeSoftness = { naturalFrequency: t2.edgeFrequency, dampingRatio: t2.edgeDampingRatio }, e51.bendSoftness = { naturalFrequency: t2.bendFrequency, dampingRatio: t2.bendDampingRatio }, e51.volumeSoftness = { naturalFrequency: t2.volumeFrequency, dampingRatio: t2.volumeDampingRatio }, e51.shapeMatchingSoftness = { naturalFrequency: t2.shapeMatchingFrequency, dampingRatio: t2.shapeMatchingDampingRatio }, e51.youngModulus = t2.youngModulus, e51.poissonRatio = t2.poissonRatio, e51.elasticDampingRatio = t2.elasticDampingRatio, e51.plasticYield = t2.plasticYield, e51.plasticCreep = t2.plasticCreep, e51.plasticMax = t2.plasticMax, e51.deformationDamping = t2.deformationDamping, e51.edgePlasticYield = t2.edgePlasticYield, e51.edgePlasticCreep = t2.edgePlasticCreep, e51.edgePlasticMax = t2.edgePlasticMax, e51.edgePlasticFlow = t2.edgePlasticFlow, e51.tearStrain = t2.tearStrain ?? null, e51.tearForce = t2.tearForce ?? null, e51.tearSmoothing = t2.tearSmoothing, e51.interiorStrength = t2.interiorStrength, e51.maxTearsPerStep = t2.maxTearsPerStep, e51.minPiece = t2.minPiece ?? null, n2 && t2.free();
  }
  intoRaw() {
    let e51 = new A();
    return e51.edgeFrequency = this.edgeSoftness.naturalFrequency, e51.edgeDampingRatio = this.edgeSoftness.dampingRatio, e51.bendFrequency = this.bendSoftness.naturalFrequency, e51.bendDampingRatio = this.bendSoftness.dampingRatio, e51.volumeFrequency = this.volumeSoftness.naturalFrequency, e51.volumeDampingRatio = this.volumeSoftness.dampingRatio, e51.shapeMatchingFrequency = this.shapeMatchingSoftness.naturalFrequency, e51.shapeMatchingDampingRatio = this.shapeMatchingSoftness.dampingRatio, e51.youngModulus = this.youngModulus, e51.poissonRatio = this.poissonRatio, e51.elasticDampingRatio = this.elasticDampingRatio, e51.plasticYield = this.plasticYield, e51.plasticCreep = this.plasticCreep, e51.plasticMax = this.plasticMax, e51.deformationDamping = this.deformationDamping, e51.edgePlasticYield = this.edgePlasticYield, e51.edgePlasticCreep = this.edgePlasticCreep, e51.edgePlasticMax = this.edgePlasticMax, e51.edgePlasticFlow = this.edgePlasticFlow, e51.tearStrain = this.tearStrain ?? void 0, e51.tearForce = this.tearForce ?? void 0, e51.tearSmoothing = this.tearSmoothing, e51.interiorStrength = this.interiorStrength, e51.maxTearsPerStep = this.maxTearsPerStep, e51.minPiece = this.minPiece ?? void 0, e51;
  }
}, pv = class {
  constructor(e51, t2, n2, r2) {
    this.rawSet = e51, this.bodies = t2, this.colliders = n2, this.handle = r2;
  }
  finalizeDeserialization(e51, t2) {
    this.bodies = e51, this.colliders = t2;
  }
  isValid() {
    return this.rawSet.contains(this.handle);
  }
  topologyVersion() {
    return this.rawSet.sbTopologyVersion(this.handle);
  }
  numParticles() {
    return this.rawSet.sbNumParticles(this.handle);
  }
  particlePosition(e51, t2) {
    return this.rawSet.sbParticlePosition(this.handle, e51, q), J.fromBuffer(q, t2);
  }
  particlePositions() {
    return this.rawSet.sbParticlePositions(this.handle);
  }
  particleVelocity(e51, t2) {
    return this.rawSet.sbParticleVelocity(this.handle, e51, q), J.fromBuffer(q, t2);
  }
  particleVelocities() {
    return this.rawSet.sbParticleVelocities(this.handle);
  }
  particleRestPosition(e51, t2) {
    return this.rawSet.sbParticleRestPosition(this.handle, e51, q), J.fromBuffer(q, t2);
  }
  particleMass(e51) {
    return this.rawSet.sbParticleMass(this.handle, e51);
  }
  isParticlePinned(e51) {
    return this.rawSet.sbIsParticlePinned(this.handle, e51);
  }
  isParticleOnSurface(e51) {
    return this.rawSet.sbIsParticleOnSurface(this.handle, e51);
  }
  isParticleDamaged(e51) {
    return this.rawSet.sbIsParticleDamaged(this.handle, e51);
  }
  setParticlePosition(e51, t2) {
    let n2 = J.intoRaw(t2);
    this.rawSet.sbSetParticlePosition(this.handle, e51, n2), n2.free();
  }
  setParticleVelocity(e51, t2) {
    let n2 = J.intoRaw(t2);
    this.rawSet.sbSetParticleVelocity(this.handle, e51, n2), n2.free();
  }
  setParticleKinematicTarget(e51, t2) {
    let n2 = J.intoRaw(t2);
    this.rawSet.sbSetParticleKinematicTarget(this.handle, e51, n2), n2.free();
  }
  setParticlePinned(e51, t2) {
    this.rawSet.sbSetParticlePinned(this.handle, e51, t2);
  }
  attachParticle(e51, t2) {
    this.rawSet.sbAttachParticle(this.handle, e51, t2.handle, this.bodies.raw);
  }
  detachParticle(e51) {
    return this.rawSet.sbDetachParticle(this.handle, e51);
  }
  numAttachments() {
    return this.rawSet.sbNumAttachments(this.handle);
  }
  attachmentParticle(e51) {
    return this.rawSet.sbAttachmentParticle(this.handle, e51);
  }
  attachmentBody(e51) {
    return this.bodies.get(this.rawSet.sbAttachmentBody(this.handle, e51));
  }
  numEdges() {
    return this.rawSet.sbNumEdges(this.handle);
  }
  edges() {
    return this.rawSet.sbEdges(this.handle);
  }
  edgeRestLength(e51) {
    return this.rawSet.sbEdgeRestLength(this.handle, e51);
  }
  isEdgeBend(e51) {
    return this.rawSet.sbEdgeIsBend(this.handle, e51);
  }
  edgeImpulse(e51) {
    return this.rawSet.sbEdgeImpulse(this.handle, e51);
  }
  edgeStress(e51) {
    return this.rawSet.sbEdgeStress(this.handle, e51);
  }
  edgePlasticStrain(e51) {
    return this.rawSet.sbEdgePlasticStrain(this.handle, e51);
  }
  edgeTearResistance(e51) {
    return this.rawSet.sbEdgeTearResistance(this.handle, e51);
  }
  numCells() {
    return this.rawSet.sbNumCells(this.handle);
  }
  cells() {
    return this.rawSet.sbCells(this.handle);
  }
  cellRestVolume(e51) {
    return this.rawSet.sbCellRestVolume(this.handle, e51);
  }
  cellStress(e51) {
    return this.rawSet.sbCellStress(this.handle, e51);
  }
  cellStiffnessScale(e51) {
    return this.rawSet.sbCellStiffnessScale(this.handle, e51);
  }
  cellTearResistance(e51) {
    return this.rawSet.sbCellTearResistance(this.handle, e51);
  }
  boundary() {
    return this.rawSet.sbBoundary(this.handle);
  }
  material() {
    return fv.fromRaw(this.rawSet.sbMaterial(this.handle));
  }
  setMaterial(e51) {
    let t2 = e51.intoRaw();
    this.rawSet.sbSetMaterial(this.handle, t2), t2.free();
  }
  cellModel() {
    return this.rawSet.sbCellModel(this.handle);
  }
  solver() {
    return this.rawSet.sbSolver(this.handle);
  }
  setSolver(e51) {
    this.rawSet.sbSetSolver(this.handle, e51);
  }
  volumePreservationEnabled() {
    return this.rawSet.sbVolumePreservationEnabled(this.handle);
  }
  enableVolumePreservation(e51) {
    this.rawSet.sbEnableVolumePreservation(this.handle, e51);
  }
  restVolume() {
    return this.rawSet.sbRestVolume(this.handle);
  }
  volume() {
    return this.rawSet.sbVolume(this.handle);
  }
  volumeFactor() {
    return this.rawSet.sbVolumeFactor(this.handle);
  }
  setVolumeFactor(e51) {
    this.rawSet.sbSetVolumeFactor(this.handle, e51);
  }
  particleRadius() {
    return this.rawSet.sbParticleRadius(this.handle);
  }
  resetPlasticity() {
    this.rawSet.sbResetPlasticity(this.handle);
  }
  rootBody() {
    return this.bodies.get(this.rawSet.sbRootBody(this.handle));
  }
  origin() {
    let e51 = this.rawSet.sbOrigin(this.handle);
    return e51 === void 0 ? null : e51;
  }
  pieces() {
    return Array.from(this.rawSet.sbPieces(this.handle));
  }
  centerOfMass(e51) {
    return this.rawSet.sbCenterOfMass(this.handle, q), J.fromBuffer(q, e51);
  }
  mass() {
    return this.rawSet.sbMass(this.handle);
  }
  isSleeping() {
    return this.rawSet.sbIsSleeping(this.handle);
  }
  wakeUp() {
    this.rawSet.sbWakeUp(this.handle);
  }
  isEnabled() {
    return this.rawSet.sbIsEnabled(this.handle);
  }
  setEnabled(e51) {
    this.rawSet.sbSetEnabled(this.handle, e51);
  }
  setAdditionalPgsIterations(e51) {
    this.rawSet.sbSetAdditionalPgsIterations(this.handle, e51);
  }
  linearDamping() {
    return this.rawSet.sbLinearDamping(this.handle);
  }
  gravityScale() {
    return this.rawSet.sbGravityScale(this.handle);
  }
  addForce(e51, t2) {
    let n2 = J.intoRaw(e51);
    this.rawSet.sbAddForce(this.handle, n2, t2), n2.free();
  }
  addParticleForce(e51, t2, n2) {
    let r2 = J.intoRaw(t2);
    this.rawSet.sbAddParticleForce(this.handle, e51, r2, n2), r2.free();
  }
  resetForces(e51) {
    this.rawSet.sbResetForces(this.handle, e51);
  }
  applyImpulse(e51, t2) {
    let n2 = J.intoRaw(e51);
    this.rawSet.sbApplyImpulse(this.handle, n2, t2), n2.free();
  }
  applyParticleImpulse(e51, t2, n2) {
    let r2 = J.intoRaw(t2);
    this.rawSet.sbApplyParticleImpulse(this.handle, e51, r2, n2), r2.free();
  }
  applyImpulseAtPoint(e51, t2, n2, r2) {
    let i2 = J.intoRaw(e51), a2 = J.intoRaw(t2);
    this.rawSet.sbApplyImpulseAtPoint(this.handle, i2, a2, n2, r2), i2.free(), a2.free();
  }
  applyRadialImpulse(e51, t2, n2, r2) {
    let i2 = J.intoRaw(e51);
    this.rawSet.sbApplyRadialImpulse(this.handle, i2, t2, n2, r2), i2.free();
  }
  tearEdge(e51) {
    this.rawSet.sbTearEdge(this.handle, e51);
  }
  tearCell(e51) {
    this.rawSet.sbTearCell(this.handle, e51);
  }
  hasPendingTears() {
    return this.rawSet.sbHasPendingTears(this.handle);
  }
  numClusters() {
    return this.rawSet.sbNumClusters(this.handle);
  }
  isClusterLive(e51) {
    return this.rawSet.sbIsClusterLive(this.handle, e51);
  }
  clusterProxy(e51) {
    let t2 = this.rawSet.sbClusterProxy(this.handle, e51);
    return t2 === void 0 ? null : this.bodies.get(t2);
  }
  clusterParticles(e51) {
    return this.rawSet.sbClusterParticles(this.handle, e51);
  }
  clusterShapeMatchingEnabled(e51) {
    return this.rawSet.sbClusterShapeMatchingEnabled(this.handle, e51);
  }
  enableClusterShapeMatching(e51, t2) {
    this.rawSet.sbEnableClusterShapeMatching(this.handle, e51, t2);
  }
  setClusterStiffnessScale(e51, t2) {
    this.rawSet.sbSetClusterStiffnessScale(this.handle, e51, t2);
  }
  setClusterEdgeSoftness(e51, t2) {
    this.rawSet.sbSetClusterEdgeSoftness(this.handle, e51, t2 ? t2.naturalFrequency : void 0, t2 ? t2.dampingRatio : void 0);
  }
  setClusterTearResistance(e51, t2) {
    this.rawSet.sbSetClusterTearResistance(this.handle, e51, t2);
  }
  setClusterPinned(e51, t2) {
    this.rawSet.sbSetClusterPinned(this.handle, e51, t2);
  }
  setClusterKinematicTarget(e51, t2, n2) {
    let r2 = J.intoRaw(t2), i2 = Y.intoRaw(n2);
    this.rawSet.sbSetClusterKinematicTarget(this.handle, e51, r2, i2), r2.free(), i2.free();
  }
  numMeshes() {
    return this.rawSet.sbNumMeshes(this.handle);
  }
  meshCluster(e51) {
    let t2 = this.rawSet.sbMeshCluster(this.handle, e51);
    return t2 === void 0 ? null : t2;
  }
  meshCollider(e51) {
    let t2 = this.rawSet.sbMeshCollider(this.handle, e51);
    return t2 === void 0 ? null : this.colliders.get(t2);
  }
  isMeshSkinned(e51) {
    return this.rawSet.sbMeshIsSkinned(this.handle, e51);
  }
  meshCollisionEnabled(e51) {
    return this.rawSet.sbMeshCollisionEnabled(this.handle, e51);
  }
  isMeshOriented(e51) {
    return this.rawSet.sbMeshIsOriented(this.handle, e51);
  }
  meshVertices(e51) {
    return this.rawSet.sbMeshVertices(this.handle, e51);
  }
  meshIndices(e51) {
    return this.rawSet.sbMeshIndices(this.handle, e51);
  }
  meshOfCollider(e51) {
    let t2 = this.rawSet.sbMeshOfCollider(this.handle, e51.handle);
    return t2 === void 0 ? null : t2;
  }
}, mv = class e47 {
  constructor(e51) {
    let t2 = e51 ? Float32Array.from(e51) : new Float32Array();
    this.generator = () => new k(t2), this.setters = [], this.material = null, this.softness = null, this.particleMass = 1, this.mass = null, this.masses = null, this.pinnedParticles = new Uint32Array(), this.cellModel = av.Volume, this.solver = sv.Constraints, this.volumePreservation = null, this.volumeFactor = 1, this.shapeMatching = null, this.selfContacts = false, this.oriented = null, this.particleRadius = null, this.surfaceCollider = rv.ball(0.05), this.skinCollision = false, this.translation = null, this.linearDamping = 0, this.gravityScale = 1, this.additionalSolverIterations = 0, this.additionalPgsIterations = 3, this.canSleep = true, this.dominanceGroup = 0;
  }
  static withGenerator(t2) {
    let n2 = t2();
    if (!n2) return null;
    n2.free();
    let r2 = new e47();
    return r2.generator = t2, r2;
  }
  static rope(t2, n2, r2) {
    return e47.withGenerator(() => {
      let e51 = J.intoRaw(t2), i2 = J.intoRaw(n2), a2 = k.rope(e51, i2, r2);
      return e51.free(), i2.free(), a2;
    });
  }
  static volumetric(t2, n2, r2, i2 = false) {
    return e47.withGenerator(() => k.volumetric(t2, n2, r2, i2));
  }
  static polyline(t2, n2) {
    let r2 = n2 ?? new Uint32Array();
    return e47.withGenerator(() => k.polyline(t2, r2));
  }
  static polygon(t2) {
    let n2 = Float32Array.from(t2);
    return e47.withGenerator(() => k.polygon(n2));
  }
  static disk(t2, n2, r2) {
    return e47.withGenerator(() => {
      let e51 = J.intoRaw(t2), i2 = k.disk(e51, n2, r2);
      return e51.free(), i2;
    });
  }
  static grid(t2, n2, r2, i2) {
    return e47.withGenerator(() => {
      let e51 = J.intoRaw(t2), a2 = J.intoRaw(n2), o2 = k.grid(e51, a2, r2, i2);
      return e51.free(), a2.free(), o2;
    });
  }
  setMaterial(e51) {
    return this.material = e51, this;
  }
  setSoftness(e51, t2) {
    return this.softness = { naturalFrequency: e51, dampingRatio: t2 }, this;
  }
  setParticleMass(e51) {
    return this.particleMass = e51, this.masses = null, this;
  }
  setMass(e51) {
    return this.mass = e51, this;
  }
  setMasses(e51) {
    return this.masses = Float32Array.from(e51), this;
  }
  setPinnedParticles(e51) {
    return this.pinnedParticles = Uint32Array.from(e51), this;
  }
  setEdges(e51) {
    let t2 = Uint32Array.from(e51);
    return this.setters.push((e52) => e52.setEdges(t2)), this;
  }
  addEdges(e51) {
    let t2 = Uint32Array.from(e51);
    return this.setters.push((e52) => e52.addEdges(t2)), this;
  }
  setBendEdges(e51) {
    let t2 = Uint32Array.from(e51);
    return this.setters.push((e52) => e52.setBendEdges(t2)), this;
  }
  setTensionOnly() {
    return this.setters.push((e51) => e51.setTensionOnly()), this;
  }
  setCells(e51) {
    let t2 = Uint32Array.from(e51);
    return this.setters.push((e52) => e52.setCells(t2)), this;
  }
  setSurface(e51) {
    let t2 = Uint32Array.from(e51);
    return this.setters.push((e52) => e52.setSurface(t2)), this;
  }
  setSkin(e51, t2) {
    let n2 = Float32Array.from(e51), r2 = Uint32Array.from(t2);
    return this.setters.push((e52) => e52.setSkin(n2, r2)), this;
  }
  setSkinCollision(e51) {
    return this.skinCollision = e51, this;
  }
  setEdgeSoftness(e51, t2) {
    let n2 = Uint32Array.from(e51), r2 = Float32Array.from(t2.map((e52) => e52.naturalFrequency)), i2 = Float32Array.from(t2.map((e52) => e52.dampingRatio));
    return this.setters.push((e52) => e52.setEdgeSoftness(n2, r2, i2)), this;
  }
  setEdgeTearResistance(e51, t2) {
    let n2 = Uint32Array.from(e51), r2 = Float32Array.from(t2);
    return this.setters.push((e52) => e52.setEdgeTearResistance(n2, r2)), this;
  }
  setCellModel(e51) {
    return this.cellModel = e51, this;
  }
  setSolver(e51) {
    return this.solver = e51, this;
  }
  setVolumePreservation(e51) {
    return this.volumePreservation = e51, this;
  }
  setVolumeFactor(e51) {
    return this.volumeFactor = e51, this.volumePreservation = true, this;
  }
  setShapeMatching(e51) {
    return this.shapeMatching = e51, this;
  }
  setSelfContacts(e51) {
    return this.selfContacts = e51, this;
  }
  setOriented(e51) {
    return this.oriented = e51, this;
  }
  setParticleRadius(e51) {
    return this.particleRadius = e51, this;
  }
  setSurfaceCollider(e51) {
    return this.surfaceCollider = e51, this;
  }
  setNoSurfaceCollider() {
    return this.surfaceCollider = null, this;
  }
  setTranslation(e51) {
    return this.translation = e51, this;
  }
  setLinearDamping(e51) {
    return this.linearDamping = e51, this;
  }
  setGravityScale(e51) {
    return this.gravityScale = e51, this;
  }
  setAdditionalSolverIterations(e51) {
    return this.additionalSolverIterations = e51, this;
  }
  setAdditionalPgsIterations(e51) {
    return this.additionalPgsIterations = e51, this;
  }
  setCanSleep(e51) {
    return this.canSleep = e51, this;
  }
  setDominanceGroup(e51) {
    return this.dominanceGroup = e51, this;
  }
  setUserData(e51) {
    return this.userData = e51, this;
  }
  append(e51) {
    return this.setters.push((t2) => {
      let n2 = e51.intoRaw();
      t2.append(n2), n2.free();
    }), this;
  }
  intoRaw() {
    let e51 = this.generator();
    for (let t2 of this.setters) t2(e51);
    if (this.material) {
      let t2 = this.material.intoRaw();
      e51.setMaterial(t2), t2.free();
    }
    if (this.softness && e51.setSoftness(this.softness.naturalFrequency, this.softness.dampingRatio), this.masses ? e51.setMasses(this.masses) : e51.setParticleMass(this.particleMass), this.mass !== null && e51.setMass(this.mass), e51.setPinnedParticles(this.pinnedParticles), e51.setCellModel(this.cellModel), e51.setSolver(this.solver), this.volumePreservation !== null && e51.setVolumePreservation(this.volumePreservation), e51.setVolumeFactor(this.volumeFactor), this.shapeMatching !== null && e51.setShapeMatching(this.shapeMatching), e51.setSelfContacts(this.selfContacts), this.oriented !== null && e51.setOriented(this.oriented), this.particleRadius !== null && e51.setParticleRadius(this.particleRadius), e51.setSkinCollision(this.skinCollision), this.surfaceCollider) {
      let t2 = this.surfaceCollider;
      e51.setSurfaceCollider(t2.friction, t2.restitution, t2.frictionCombineRule, t2.restitutionCombineRule, t2.isSensor, t2.collisionGroups, t2.solverGroups, t2.activeCollisionTypes, t2.activeHooks, t2.activeEvents, t2.contactForceEventThreshold, t2.contactSkin);
    } else e51.setNoSurfaceCollider();
    if (this.translation) {
      let t2 = J.intoRaw(this.translation);
      e51.translated(t2), t2.free();
    }
    return e51.setLinearDamping(this.linearDamping), e51.setGravityScale(this.gravityScale), e51.setAdditionalSolverIterations(this.additionalSolverIterations), e51.setAdditionalPgsIterations(this.additionalPgsIterations), e51.setCanSleep(this.canSleep), e51.setDominanceGroup(this.dominanceGroup), e51;
  }
  numParticles() {
    let e51 = this.intoRaw(), t2 = e51.numParticles();
    return e51.free(), t2;
  }
  particlePositions() {
    let e51 = this.intoRaw(), t2 = e51.particlePositions();
    return e51.free(), t2;
  }
}, hv = class {
  constructor(e51) {
    this.raw = e51;
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  softBody() {
    return this.raw.softBody();
  }
  tornEdges() {
    return this.raw.tornEdges();
  }
  tornCells() {
    return this.raw.tornCells();
  }
  removedEdges() {
    return this.raw.removedEdges();
  }
  splitParticles() {
    return this.raw.splitParticles();
  }
  insertedParticles() {
    return this.raw.insertedParticles();
  }
  seeds() {
    return this.raw.seeds();
  }
  numPieces() {
    return this.raw.numPieces();
  }
  pieceSoftBody(e51) {
    return this.raw.pieceSoftBody(e51);
  }
  pieceParticles(e51) {
    return this.raw.pieceParticles(e51);
  }
  pieceClusters(e51) {
    return this.raw.pieceClusters(e51);
  }
  numClusterSplits() {
    return this.raw.numClusterSplits();
  }
  clusterSplitSource(e51) {
    return this.raw.clusterSplitSource(e51);
  }
  clusterSplitSoftBody(e51) {
    return this.raw.clusterSplitSoftBody(e51);
  }
  clusterSplitCluster(e51) {
    return this.raw.clusterSplitCluster(e51);
  }
  clusterSplitProxy(e51) {
    return this.raw.clusterSplitProxy(e51);
  }
  clusterSplitKeepsProxy(e51) {
    return this.raw.clusterSplitKeepsProxy(e51);
  }
  numMovedJoints() {
    return this.raw.numMovedJoints();
  }
  movedJoint(e51) {
    return this.raw.movedJoint(e51);
  }
  movedJointFrom(e51) {
    return this.raw.movedJointFrom(e51);
  }
  movedJointTo(e51) {
    return this.raw.movedJointTo(e51);
  }
  particleDestination(e51) {
    let t2 = this.raw.particleDestinationBody(e51), n2 = this.raw.particleDestinationIndex(e51);
    return t2 === void 0 || n2 === void 0 ? null : { softBody: t2, particle: n2 };
  }
}, gv = class {
  constructor(e51) {
    this.raw = e51 || new v();
  }
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  get dt() {
    return this.raw.dt;
  }
  get contact_erp() {
    return this.raw.contact_erp;
  }
  get lengthUnit() {
    return this.raw.lengthUnit;
  }
  get normalizedAllowedLinearError() {
    return this.raw.normalizedAllowedLinearError;
  }
  get normalizedPredictionDistance() {
    return this.raw.normalizedPredictionDistance;
  }
  get numSolverIterations() {
    return this.raw.numSolverIterations;
  }
  get numInternalPgsIterations() {
    return this.raw.numInternalPgsIterations;
  }
  get maxCcdSubsteps() {
    return this.raw.maxCcdSubsteps;
  }
  get softBodiesResweepStrain() {
    return this.raw.softBodiesResweepStrain;
  }
  get softBodiesMaxExtraSubsteps() {
    return this.raw.softBodiesMaxExtraSubsteps;
  }
  get softBodiesContactStiffening() {
    return this.raw.softBodiesContactStiffening;
  }
  get softBodiesRecovery() {
    return lv.fromRaw(this.raw.softBodiesRecovery);
  }
  get softBodiesFemLinearTolerance() {
    return this.raw.softBodiesFemLinearTolerance;
  }
  get softBodiesFemMaxLinearIterations() {
    return this.raw.softBodiesFemMaxLinearIterations;
  }
  get softBodiesFemMaxDenseDofs() {
    return this.raw.softBodiesFemMaxDenseDofs;
  }
  set dt(e51) {
    this.raw.dt = e51;
  }
  set softBodiesResweepStrain(e51) {
    this.raw.softBodiesResweepStrain = e51;
  }
  set softBodiesMaxExtraSubsteps(e51) {
    this.raw.softBodiesMaxExtraSubsteps = e51;
  }
  set softBodiesContactStiffening(e51) {
    this.raw.softBodiesContactStiffening = e51;
  }
  set softBodiesRecovery(e51) {
    let t2 = e51.intoRaw();
    this.raw.softBodiesRecovery = t2, t2.free();
  }
  set softBodiesFemLinearTolerance(e51) {
    this.raw.softBodiesFemLinearTolerance = e51;
  }
  set softBodiesFemMaxLinearIterations(e51) {
    this.raw.softBodiesFemMaxLinearIterations = e51;
  }
  set softBodiesFemMaxDenseDofs(e51) {
    this.raw.softBodiesFemMaxDenseDofs = e51;
  }
  set contact_natural_frequency(e51) {
    this.raw.contact_natural_frequency = e51;
  }
  set lengthUnit(e51) {
    this.raw.lengthUnit = e51;
  }
  set normalizedAllowedLinearError(e51) {
    this.raw.normalizedAllowedLinearError = e51;
  }
  set normalizedPredictionDistance(e51) {
    this.raw.normalizedPredictionDistance = e51;
  }
  set numSolverIterations(e51) {
    this.raw.numSolverIterations = e51;
  }
  set numInternalPgsIterations(e51) {
    this.raw.numInternalPgsIterations = e51;
  }
  set maxCcdSubsteps(e51) {
    this.raw.maxCcdSubsteps = e51;
  }
}, $;
(function(e51) {
  e51[e51.Revolute = 0] = `Revolute`, e51[e51.Fixed = 1] = `Fixed`, e51[e51.Prismatic = 2] = `Prismatic`, e51[e51.Rope = 3] = `Rope`, e51[e51.Spring = 4] = `Spring`;
})($ ||= {});
var _v;
(function(e51) {
  e51[e51.AccelerationBased = 0] = `AccelerationBased`, e51[e51.ForceBased = 1] = `ForceBased`;
})(_v ||= {});
var vv;
(function(e51) {
  e51[e51.LinX = 0] = `LinX`, e51[e51.LinY = 1] = `LinY`, e51[e51.AngX = 2] = `AngX`;
})(vv ||= {});
var yv;
(function(e51) {
  e51[e51.LinX = 1] = `LinX`, e51[e51.LinY = 2] = `LinY`, e51[e51.LinZ = 4] = `LinZ`, e51[e51.AngX = 8] = `AngX`, e51[e51.AngY = 16] = `AngY`, e51[e51.AngZ = 32] = `AngZ`;
})(yv ||= {});
var bv = class e48 {
  constructor(e51, t2, n2) {
    this.rawSet = e51, this.bodySet = t2, this.handle = n2;
  }
  static newTyped(t2, n2, r2) {
    switch (t2.jointType(r2)) {
      case x.Revolute:
        return new Ev(t2, n2, r2);
      case x.Prismatic:
        return new Tv(t2, n2, r2);
      case x.Fixed:
        return new Sv(t2, n2, r2);
      case x.Spring:
        return new wv(t2, n2, r2);
      case x.Rope:
        return new Cv(t2, n2, r2);
      default:
        return new e48(t2, n2, r2);
    }
  }
  finalizeDeserialization(e51) {
    this.bodySet = e51;
  }
  isValid() {
    return this.rawSet.contains(this.handle);
  }
  body1() {
    return this.bodySet.get(this.rawSet.jointBodyHandle1(this.handle));
  }
  body2() {
    return this.bodySet.get(this.rawSet.jointBodyHandle2(this.handle));
  }
  type() {
    return this.rawSet.jointType(this.handle);
  }
  anchor1(e51) {
    return this.rawSet.jointAnchor1(this.handle, q), J.fromBuffer(q, e51);
  }
  anchor2(e51) {
    return this.rawSet.jointAnchor2(this.handle, q), J.fromBuffer(q, e51);
  }
  setAnchor1(e51) {
    let t2 = J.intoRaw(e51);
    this.rawSet.jointSetAnchor1(this.handle, t2), t2.free();
  }
  setAnchor2(e51) {
    let t2 = J.intoRaw(e51);
    this.rawSet.jointSetAnchor2(this.handle, t2), t2.free();
  }
  setContactsEnabled(e51) {
    this.rawSet.jointSetContactsEnabled(this.handle, e51);
  }
  contactsEnabled() {
    return this.rawSet.jointContactsEnabled(this.handle);
  }
}, xv = class extends bv {
  limitsEnabled() {
    return this.rawSet.jointLimitsEnabled(this.handle, this.rawAxis());
  }
  limitsMin() {
    return this.rawSet.jointLimitsMin(this.handle, this.rawAxis());
  }
  limitsMax() {
    return this.rawSet.jointLimitsMax(this.handle, this.rawAxis());
  }
  setLimits(e51, t2) {
    this.rawSet.jointSetLimits(this.handle, this.rawAxis(), e51, t2);
  }
  configureMotorModel(e51) {
    this.rawSet.jointConfigureMotorModel(this.handle, this.rawAxis(), e51);
  }
  setMotorMaxForce(e51) {
    this.rawSet.jointSetMotorMaxForce(this.handle, this.rawAxis(), e51);
  }
  configureMotorVelocity(e51, t2) {
    this.rawSet.jointConfigureMotorVelocity(this.handle, this.rawAxis(), e51, t2);
  }
  configureMotorPosition(e51, t2, n2) {
    this.rawSet.jointConfigureMotorPosition(this.handle, this.rawAxis(), e51, t2, n2);
  }
  configureMotor(e51, t2, n2, r2) {
    this.rawSet.jointConfigureMotor(this.handle, this.rawAxis(), e51, t2, n2, r2);
  }
}, Sv = class extends bv {
}, Cv = class extends bv {
}, wv = class extends bv {
}, Tv = class extends xv {
  rawAxis() {
    return b.LinX;
  }
}, Ev = class extends xv {
  rawAxis() {
    return b.AngX;
  }
}, Dv = class e49 {
  constructor() {
  }
  static fixed(t2, n2, r2, i2) {
    let a2 = new e49();
    return a2.anchor1 = t2, a2.anchor2 = r2, a2.frame1 = n2, a2.frame2 = i2, a2.jointType = $.Fixed, a2;
  }
  static spring(t2, n2, r2, i2, a2) {
    let o2 = new e49();
    return o2.anchor1 = i2, o2.anchor2 = a2, o2.length = t2, o2.stiffness = n2, o2.damping = r2, o2.jointType = $.Spring, o2;
  }
  static rope(t2, n2, r2) {
    let i2 = new e49();
    return i2.anchor1 = n2, i2.anchor2 = r2, i2.length = t2, i2.jointType = $.Rope, i2;
  }
  static revolute(t2, n2) {
    let r2 = new e49();
    return r2.anchor1 = t2, r2.anchor2 = n2, r2.jointType = $.Revolute, r2;
  }
  static prismatic(t2, n2, r2) {
    let i2 = new e49();
    return i2.anchor1 = t2, i2.anchor2 = n2, i2.axis = r2, i2.jointType = $.Prismatic, i2;
  }
  intoRaw() {
    let e51 = J.intoRaw(this.anchor1), t2 = J.intoRaw(this.anchor2), n2, r2, i2 = false, a2 = 0, o2 = 0;
    switch (this.jointType) {
      case $.Fixed:
        let s2 = Y.intoRaw(this.frame1), c2 = Y.intoRaw(this.frame2);
        r2 = g.fixed(e51, s2, t2, c2), s2.free(), c2.free();
        break;
      case $.Spring:
        r2 = g.spring(this.length, this.stiffness, this.damping, e51, t2);
        break;
      case $.Rope:
        r2 = g.rope(this.length, e51, t2);
        break;
      case $.Prismatic:
        n2 = J.intoRaw(this.axis), this.limitsEnabled && (i2 = true, a2 = this.limits[0], o2 = this.limits[1]), r2 = g.prismatic(e51, t2, n2, i2, a2, o2), n2.free();
        break;
      case $.Revolute:
        r2 = g.revolute(e51, t2);
    }
    return e51.free(), t2.free(), r2;
  }
}, Ov = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new _(), this.map = new o_(), e51 && e51.forEachJointHandle((t2) => {
      this.map.set(t2, bv.newTyped(e51, null, t2));
    });
  }
  finalizeDeserialization(e51) {
    this.map.forEach((t2) => t2.finalizeDeserialization(e51));
  }
  createJoint(e51, t2, n2, r2, i2) {
    let a2 = t2.intoRaw(), o2 = this.raw.createJoint(a2, n2, r2, i2);
    a2.free();
    let s2 = bv.newTyped(this.raw, e51, o2);
    return this.map.set(o2, s2), s2;
  }
  remove(e51, t2) {
    this.raw.remove(e51, t2), this.unmap(e51);
  }
  forEachJointHandleAttachedToRigidBody(e51, t2) {
    this.raw.forEachJointAttachedToRigidBody(e51, t2);
  }
  unmap(e51) {
    this.map.delete(e51);
  }
  unmapRemovedJoints() {
    for (let e51 of this.map.getAll()) this.raw.contains(e51.handle) || this.map.delete(e51.handle);
  }
  len() {
    return this.map.len();
  }
  contains(e51) {
    return this.get(e51) != null;
  }
  get(e51) {
    return this.map.get(e51);
  }
  forEach(e51) {
    this.map.forEach(e51);
  }
  getAll() {
    return this.map.getAll();
  }
}, kv = class e50 {
  constructor(e51, t2) {
    this.rawSet = e51, this.handle = t2;
  }
  static newTyped(t2, n2) {
    switch (t2.jointType(n2)) {
      case x.Revolute:
        return new Nv(t2, n2);
      case x.Prismatic:
        return new Mv(t2, n2);
      case x.Fixed:
        return new jv(t2, n2);
      default:
        return new e50(t2, n2);
    }
  }
  isValid() {
    return this.rawSet.contains(this.handle);
  }
  setContactsEnabled(e51) {
    this.rawSet.jointSetContactsEnabled(this.handle, e51);
  }
  contactsEnabled() {
    return this.rawSet.jointContactsEnabled(this.handle);
  }
}, Av = class extends kv {
}, jv = class extends kv {
}, Mv = class extends Av {
  rawAxis() {
    return b.LinX;
  }
}, Nv = class extends Av {
  rawAxis() {
    return b.AngX;
  }
}, Pv = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new S(), this.map = new o_(), e51 && e51.forEachJointHandle((e52) => {
      this.map.set(e52, kv.newTyped(this.raw, e52));
    });
  }
  createJoint(e51, t2, n2, r2) {
    let i2 = e51.intoRaw(), a2 = this.raw.createJoint(i2, t2, n2, r2);
    i2.free();
    let o2 = kv.newTyped(this.raw, a2);
    return this.map.set(a2, o2), o2;
  }
  remove(e51, t2) {
    this.raw.remove(e51, t2), this.map.delete(e51);
  }
  unmap(e51) {
    this.map.delete(e51);
  }
  unmapRemovedJoints() {
    for (let e51 of this.map.getAll()) this.raw.contains(e51.handle) || this.map.delete(e51.handle);
  }
  len() {
    return this.map.len();
  }
  contains(e51) {
    return this.get(e51) != null;
  }
  get(e51) {
    return this.map.get(e51);
  }
  forEach(e51) {
    this.map.forEach(e51);
  }
  forEachJointHandleAttachedToRigidBody(e51, t2) {
    this.raw.forEachJointAttachedToRigidBody(e51, t2);
  }
  getAll() {
    return this.map.getAll();
  }
}, Fv;
(function(e51) {
  e51[e51.Average = 0] = `Average`, e51[e51.Min = 1] = `Min`, e51[e51.Multiply = 2] = `Multiply`, e51[e51.Max = 3] = `Max`;
})(Fv ||= {});
var Iv = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new o();
  }
}, Lv = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new y();
  }
  forEachActiveRigidBodyHandle(e51) {
    this.raw.forEachActiveRigidBodyHandle(e51);
  }
}, Rv = class {
  free() {
    this.raw && this.raw.free(), this.raw = void 0, this.map && this.map.clear(), this.map = void 0;
  }
  constructor(e51) {
    this.raw = e51 || new j(), this.map = new o_(), e51 && e51.forEachSoftBodyHandle((t2) => {
      this.map.set(t2, new pv(e51, null, null, t2));
    });
  }
  finalizeDeserialization(e51, t2) {
    this.map.forEach((n2) => n2.finalizeDeserialization(e51, t2));
  }
  createSoftBody(e51, t2, n2) {
    let r2 = n2.intoRaw(), i2 = this.raw.insert(r2, e51.raw, t2.raw);
    r2.free(), e51.mapNewBodies(t2), t2.mapNewColliders(e51);
    let a2 = new pv(this.raw, e51, t2, i2);
    return a2.userData = n2.userData, this.map.set(i2, a2), a2;
  }
  remove(e51, t2, n2, r2, i2, a2) {
    this.raw.remove(e51, t2.raw, n2.raw, r2.raw, i2.raw, a2.raw), this.map.delete(e51), n2.unmapRemovedBodies(), r2.unmapRemovedColliders(), i2.unmapRemovedJoints(), a2.unmapRemovedJoints();
  }
  addCluster(e51, t2, n2, r2) {
    let i2 = this.raw.addCluster(e51, Uint32Array.from(t2), n2.raw, r2.raw);
    return n2.mapNewBodies(r2), i2 === void 0 ? null : i2;
  }
  removeCluster(e51, t2, n2, r2, i2, a2, o2) {
    let s2 = this.raw.removeCluster(e51, t2, n2.raw, r2.raw, i2.raw, a2.raw, o2.raw);
    return r2.unmapRemovedBodies(), i2.unmapRemovedColliders(), a2.unmapRemovedJoints(), o2.unmapRemovedJoints(), s2;
  }
  tear(e51, t2, n2, r2, i2, a2, o2, s2) {
    let c2 = this.raw.tear(e51, Uint32Array.from(t2), Uint32Array.from(n2), r2.raw, i2.raw, a2.raw, o2.raw, s2.raw);
    return this.finishTopologyChange(c2, i2, a2, o2, s2);
  }
  cut(e51, t2, n2, r2, i2, a2, o2) {
    let s2 = [];
    for (let e52 of t2) s2.push(e52.x, e52.y);
    let c2 = this.raw.cut(e51, Float32Array.from(s2), n2.raw, r2.raw, i2.raw, a2.raw, o2.raw);
    return this.finishTopologyChange(c2, r2, i2, a2, o2);
  }
  finishTopologyChange(e51, t2, n2, r2, i2) {
    return e51 ? (this.mapNewSoftBodies(t2, n2), t2.mapNewBodies(n2), n2.mapNewColliders(t2), t2.unmapRemovedBodies(), n2.unmapRemovedColliders(), r2.unmapRemovedJoints(), i2.unmapRemovedJoints(), new hv(e51)) : null;
  }
  mapNewSoftBodies(e51, t2) {
    this.raw.forEachSoftBodyHandle((n2) => {
      this.map.get(n2) || this.map.set(n2, new pv(this.raw, e51, t2, n2));
    });
  }
  wakeUp(e51, t2, n2) {
    this.raw.wakeUp(e51, t2.raw, n2);
  }
  len() {
    return this.map.len();
  }
  contains(e51) {
    return this.get(e51) != null;
  }
  get(e51) {
    return this.map.get(e51);
  }
  forEach(e51) {
    this.map.forEach(e51);
  }
  getAll() {
    return this.map.getAll();
  }
}, zv = e({ ActiveCollisionTypes: () => ev, ActiveEvents: () => J_, ActiveHooks: () => Z_, Ball: () => w_, BroadPhase: () => __, CCDSolver: () => Iv, Capsule: () => O_, CharacterCollision: () => U_, CoefficientCombineRule: () => Fv, Collider: () => tv, ColliderDesc: () => rv, ColliderSet: () => iv, ColliderShapeCastHit: () => g_, Compound: () => P_, CompoundFlags: () => S_, ConvexPolygon: () => I_, Cuboid: () => E_, DebugRenderBuffers: () => V_, DebugRenderPipeline: () => H_, EventQueue: () => X_, FeatureType: () => c_, FixedImpulseJoint: () => Sv, FixedMultibodyJoint: () => jv, HalfSpace: () => T_, Heightfield: () => R_, ImpulseJoint: () => bv, ImpulseJointSet: () => Ov, IntegrationParameters: () => gv, IslandManager: () => Lv, JointAxesMask: () => yv, JointAxis: () => vv, JointData: () => Dv, JointType: () => $, KinematicCharacterController: () => W_, MassPropsMode: () => nv, MotorModel: () => _v, MultibodyJoint: () => kv, MultibodyJointSet: () => Pv, NarrowPhase: () => v_, PhysicsPipeline: () => z_, PidAxesMask: () => G_, PidController: () => K_, PointColliderProjection: () => m_, PointProjection: () => p_, Polyline: () => M_, PolylineFlags: () => x_, PrismaticImpulseJoint: () => Tv, PrismaticMultibodyJoint: () => Mv, QueryFilterFlags: () => $_, Ray: () => l_, RayColliderHit: () => f_, RayColliderIntersection: () => d_, RayIntersection: () => u_, RevoluteImpulseJoint: () => Ev, RevoluteMultibodyJoint: () => Nv, RigidBody: () => i_, RigidBodyDesc: () => a_, RigidBodySet: () => s_, RigidBodyType: () => X, RopeImpulseJoint: () => Cv, RotationOps: () => Y, RoundConvexPolygon: () => L_, RoundCuboid: () => D_, RoundTriangle: () => j_, Segment: () => k_, SerializationPipeline: () => B_, Shape: () => Z, ShapeCastHit: () => h_, ShapeContact: () => b_, ShapeType: () => Q, SoftBody: () => pv, SoftBodyCellModel: () => av, SoftBodyDesc: () => mv, SoftBodyMaterial: () => fv, SoftBodySet: () => Rv, SoftBodySolver: () => sv, SoftBodyTearEvent: () => hv, SoftEdgePlasticFlow: () => ov, SoftMeshBinding: () => dv, SoftMeshBindingMode: () => uv, SoftPatchConstraints: () => cv, SoftRecoverySettings: () => lv, SolverFlags: () => Q_, SpringImpulseJoint: () => wv, TempContactForceEvent: () => Y_, TempContactManifold: () => y_, TriMesh: () => F_, TriMeshFlags: () => C_, Triangle: () => A_, UnitImpulseJoint: () => xv, UnitMultibodyJoint: () => Av, Vector2: () => r_, VectorOps: () => J, Voxels: () => N_, World: () => q_, reserveMemory: () => Vv, scratchBuffer: () => q, version: () => Bv });
function Bv() {
  return me();
}
function Vv(e51) {
  pe(e51);
}
var Hv = zv;
export { U_ as $, mv as A, h_ as At, ev as B, a_ as Bt, Ev as C, A_ as Ct, gv as D, y_ as Dt, xv as E, v_ as Et, dv as F, d_ as Ft, Z_ as G, q as Gt, rv as H, Y as Ht, uv as I, u_ as It, X_ as J, Q_ as K, cv as L, c_ as Lt, sv as M, p_ as Mt, hv as N, l_ as Nt, pv as O, __ as Ot, ov as P, f_ as Pt, K_ as Q, lv as R, s_ as Rt, Tv as S, C_ as St, wv as T, b_ as Tt, nv as U, r_ as Ut, tv as V, X as Vt, $_ as W, J as Wt, q_ as X, Y_ as Y, G_ as Z, yv as _, j_ as _t, Lv as a, w_ as at, $ as b, Q as bt, Pv as c, S_ as ct, Mv as d, T_ as dt, W_ as et, Nv as f, R_ as ft, bv as g, D_ as gt, Sv as h, L_ as ht, Rv as i, z_ as it, fv as j, m_ as jt, av as k, g_ as kt, jv as l, I_ as lt, Ov as m, x_ as mt, Vv as n, H_ as nt, Iv as o, O_ as ot, Av as p, M_ as pt, J_ as q, Bv as r, B_ as rt, Fv as s, P_ as st, Hv as t, V_ as tt, kv as u, E_ as ut, vv as v, k_ as vt, Cv as w, N_ as wt, _v as x, F_ as xt, Dv as y, Z as yt, iv as z, i_ as zt };
