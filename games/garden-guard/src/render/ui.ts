import { CHALLENGES, CHAPTERS, LEVELS, PERKS, PLANTS, PLANT_ORDER, ZOMBIES, type PlantKind, type ZombieKind } from '../core/content';
import { unlockedLevel } from '../core/save';
import type { Hit, View } from '../view';
import { drawPlant, drawZombie } from './actors';
import { C, arrow, box, ellipse, icon, label, line, star, sunIcon, wrap, type Ctx, type Rect } from './draw';
import { background, drawBoard, gardenIllustration, type BoardLayout } from './world';

export function boardLayout(v: Pick<View, 'w' | 'h' | 'safeTop' | 'safeBottom'>): BoardLayout {
  const portrait = v.w < 700;
  const top = Math.max(14, v.safeTop + 8);
  const seedY = top + (portrait ? 91 : 54);
  const seedH = portrait ? (v.h < 720 ? 66 : 77) : (v.h < 500 ? 53 : 83);
  const y = seedY + (portrait ? seedH * 2 + 22 : seedH + 23) + 36;
  const maxW = Math.min(1080, v.w - (portrait ? 66 : 116));
  const h = Math.min(portrait ? 355 : 425, v.h - y - (portrait ? 127 : 81) - v.safeBottom);
  const w = Math.min(maxW, h * (portrait ? 1.42 : 2.55));
  return { x: (v.w - w) / 2 + 8, y, w, h, cw: w / 9, rh: h / 5 };
}
export class Renderer {
  private hits: Hit[] = [];
  constructor(private ctx: Ctx) {}
  private hit(id: string, rect: Rect, text: string, disabled = false) { this.hits.push({ ...rect, id, label: text, disabled }); }
  private button(id: string, text: string, r: Rect, kind: 'primary' | 'light' | 'dark' = 'light', disabled = false) {
    const ctx = this.ctx, fill = disabled ? '#ced4b9' : kind === 'primary' ? C.sun : kind === 'dark' ? C.ink : C.paper;
    box(ctx, { ...r, y: r.y + 4 }, kind === 'primary' ? '#b99243' : kind === 'dark' ? '#0c2b26' : '#b6c29c', 13);
    box(ctx, r, fill, 13, disabled ? '#b7c0a2' : kind === 'dark' ? '#0b3028' : '#b2bd94', 1.5);
    label(ctx, text, r.x + r.w / 2, r.y + r.h / 2, r.h < 48 ? 14 : 17, disabled ? '#75836c' : kind === 'dark' ? C.paper : C.ink, 700, 'center', r.w - 16);
    this.hit(id, r, text, disabled);
  }
  private iconButton(id: string, type: Parameters<typeof icon>[1], r: Rect, name: string) {
    box(this.ctx, r, 'rgba(255,249,222,.75)', 13, 'rgba(119,148,93,.3)', 1);
    icon(this.ctx, type, r.x + r.w / 2, r.y + r.h / 2, 21); this.hit(id, r, name);
  }
  private heading(v: View, title: string, sub?: string) {
    const top = Math.max(16, v.safeTop + 10), left = Math.max(20, (v.w - 1060) / 2);
    this.button('home', '返回', { x: left, y: top, w: 66, h: 44 });
    label(this.ctx, title, v.w / 2, top + 21, v.w < 700 ? 23 : 30, C.ink, 800, 'center');
    if (sub) label(this.ctx, sub, v.w / 2, top + 65, 14, C.muted, 500, 'center', v.w - 36);
    return top;
  }
  render(v: View): Hit[] {
    this.hits = [];
    const ctx = this.ctx;
    ctx.clearRect(0, 0, v.w, v.h);
    background(ctx, v.w, v.h, (v.screen === 'playing' || v.screen === 'result') && v.game?.config.biome === 'night');
    switch (v.screen) {
      case 'home': this.home(v); break;
      case 'levels': this.levels(v); break;
      case 'adventure': this.adventure(v); break;
      case 'challenges': this.challenges(v); break;
      case 'almanac': this.almanac(v); break;
      case 'playing': this.battle(v); break;
      case 'result': this.battle(v); this.overlay(v, view => this.result(view), 498); break;
      case 'perks': this.perks(v); break;
    }
    if (v.modal) this.overlay(v, view => this.modal(view), ({ settings: 430, help: 510, pause: 423, brief: 540, leave: 300, 'new-adventure': 300, detail: 418 })[v.modal]);
    if (v.toast) {
      const width = Math.min(v.w - 30, 470), y = v.h - Math.max(28, v.safeBottom + 18) - 44;
      box(ctx, { x: (v.w - width) / 2, y, w: width, h: 44 }, 'rgba(20,62,50,.94)', 12);
      label(ctx, v.toast, v.w / 2, y + 22, 13, C.paper, 600, 'center', width - 24);
    }
    return this.hits;
  }
  private overlay(v: View, draw: (view: View) => void, height: number) {
    const scale = Math.min(1, (v.h - v.safeTop - v.safeBottom - 40) / height);
    this.ctx.save(); this.ctx.scale(scale, scale);
    draw({ ...v, w: v.w / scale, h: v.h / scale, safeTop: v.safeTop / scale, safeBottom: v.safeBottom / scale });
    this.ctx.restore();
    if (scale !== 1) this.hits = this.hits.map(h => ({ ...h, x: h.x * scale, y: h.y * scale, w: h.w * scale, h: h.h * scale }));
  }
  private home(v: View) {
    const ctx = this.ctx, mobile = v.w < 700, top = Math.max(16, v.safeTop + 10), left = Math.max(24, (v.w - 1140) / 2);
    drawPlant(ctx, 'pea', left + 15, top + 21, 34, 0);
    label(ctx, '花园守卫', left + 43, top + 22, 16, C.ink, 800);
    this.iconButton('settings', 'gear', { x: v.w - left - 44, y: top, w: 44, h: 44 }, '设置');
    const totalStars = Object.values(v.save.levels).reduce((a, b) => a + b, 0);
    star(ctx, v.w - left - 119, top + 21, 10); label(ctx, `${totalStars} / ${LEVELS.length * 3}`, v.w - left - 101, top + 22, 13, C.ink, 700);
    if (mobile) {
      const compact = v.h < 740;
      label(ctx, '小小植物，大大守护。', 24, top + 89, compact ? 27 : 30, C.ink, 900, 'left', v.w - 40);
      this.button('career:open',`补给站 · ${v.coins??0} 金币 · 签到 / 强化`,{x:24,y:top+108,w:v.w-48,h:30});
      const artH = Math.min(280, Math.max(185, v.h * .3));
      gardenIllustration(ctx, { x: -3, y: top + 142, w: v.w + 3, h: artH }, v.save.settings.reducedMotion ? 0 : v.time);
      const primaryY = top + 142 + artH + 7;
      this.button('continue-level', Object.keys(v.save.levels).length ? `继续守卫  ·  第 ${unlockedLevel(v.save)} 关` : '开始守卫', { x: 24, y: primaryY, w: v.w - 48, h: 58 }, 'primary');
      const y = primaryY + 80, w = (v.w - 60) / 2;
      this.modeCard('adventure', '冒险远征', v.save.adventure ? '继续你的花园之旅' : '五场战斗，一路成长', 'sunflower', { x: 24, y, w, h: 91 });
      this.modeCard('challenges', '挑战模式', '特殊规则，更多可能', 'cherry', { x: 36 + w, y, w, h: 91 });
      const footY = Math.min(v.h - 64 - v.safeBottom, y + 116);
      this.button('levels', '关卡地图', { x: 24, y: footY, w, h: 44 });
      this.button('almanac', '植物与僵尸图鉴', { x: 36 + w, y: footY, w, h: 44 });
    } else {
      const mid = Math.max(150, Math.min(240, v.h * .3)), textW = Math.min(420, v.w * .39);
      label(ctx, '花园守卫', left, mid, Math.min(74, v.w * .061), C.ink, 900);
      label(ctx, '小小植物，大大守护。', left + 3, mid + 65, 24, C.ink, 700);
      this.button('career:open',`花园补给站 · ${v.coins??0} 金币`,{x:left,y:mid+92,w:textW,h:42});
      gardenIllustration(ctx, { x: left + textW + 22, y: mid - 116, w: Math.min(710, v.w - left - textW - 26), h: Math.min(450, v.h * .63) }, v.save.settings.reducedMotion ? 0 : v.time);
      this.button('continue-level', Object.keys(v.save.levels).length ? `继续守卫  ·  第 ${unlockedLevel(v.save)} 关` : '开始守卫', { x: left, y: mid + 156, w: textW, h: 62 }, 'primary');
      this.modeCard('adventure', '冒险远征', '五场战斗，一路成长', 'sunflower', { x: left, y: mid + 238, w: (textW - 16) / 2, h: 102 });
      this.modeCard('challenges', '挑战模式', '十二种规则，全植物无尽', 'cherry', { x: left + (textW + 16) / 2, y: mid + 238, w: (textW - 16) / 2, h: 102 });
      const footY = Math.min(v.h - 74, mid + 375);
      this.button('levels', '关卡地图', { x: left, y: footY, w: 130, h: 44 });
      this.button('almanac', '植物与僵尸图鉴', { x: left + 146, y: footY, w: 170, h: 44 });
      label(ctx, '点击种子卡，再点击草坪种植', v.w - left, v.h - 40, 13, C.muted, 500, 'right');
    }
  }
  private modeCard(id: string, title: string, sub: string, plant: PlantKind, r: Rect) {
    box(this.ctx, { ...r, y: r.y + 3 }, '#b9c69e', 15); box(this.ctx, r, '#f8f6dd', 15, '#bfccaa', 1.5);
    drawPlant(this.ctx, plant, r.x + r.w - 31, r.y + 32, 39, 0);
    label(this.ctx, title, r.x + 15, r.y + 30, 18, C.ink, 800, 'left', r.w - 55);
    label(this.ctx, sub, r.x + 15, r.y + 63, 12, C.muted, 500, 'left', r.w - 24);
    this.hit(id, r, title);
  }
  private levels(v: View) {
    const ctx = this.ctx, top = this.heading(v, '关卡地图'), mobile = v.w < 700;
    const x = Math.max(24, (v.w - 900) / 2), w = v.w - x * 2;
    label(ctx, CHAPTERS[v.chapter], v.w / 2, top + 92, 28, C.ink, 900, 'center');
    label(ctx, `第 ${v.chapter + 1} 章 / 共 ${CHAPTERS.length} 章`, v.w / 2, top + 128, 13, C.muted, 600, 'center');
    this.button('chapter:prev', '上一章', { x, y: top + 80, w: 70, h: 44 }, 'light', v.chapter === 0);
    this.button('chapter:next', '下一章', { x: x + w - 70, y: top + 80, w: 70, h: 44 }, 'light', v.chapter === CHAPTERS.length - 1);
    const mapY = top + 158, mapH = Math.min(410, v.h - mapY - 164 - v.safeBottom);
    box(ctx, { x, y: mapY, w, h: mapH }, v.chapter === 1 ? '#a4bfad' : '#cfdfac', 32, '#afc28f', 2);
    const points = mobile ? [[.2, .2], [.69, .38], [.28, .62], [.73, .81]] : [[.16, .64], [.38, .36], [.64, .6], [.85, .3]];
    const nodes = points.map(([a, b]) => ({ x: x + a * w, y: mapY + b * mapH }));
    const trail = nodes.flatMap(n => [n.x, n.y]); line(ctx, trail, '#a0b87e', 26); line(ctx, trail, '#e8dcab', 19);
    for (let i = 0; i < 22; i++) { const xx = x + 16 + (i * 71 % (w - 32)), yy = mapY + 14 + (i * 97 % (mapH - 28)); ellipse(ctx, xx, yy, 3, 5, '#a8c489'); }
    drawPlant(ctx, v.chapter === 1 ? 'mushroom' : 'sunflower', x + w * .82, mapY + mapH * .12, mobile ? 44 : 75);
    drawPlant(ctx, 'pea', x + w * .14, mapY + mapH * .84, mobile ? 45 : 70);
    nodes.forEach((n, i) => {
      const id = v.chapter * 4 + i + 1, locked = id > unlockedLevel(v.save), stars = v.save.levels[String(id)] ?? 0;
      ellipse(ctx, n.x, n.y + 4, 27, 27, locked ? '#8a9b73' : '#aa853e');
      ellipse(ctx, n.x, n.y, 27, 27, locked ? '#bac7a2' : stars ? '#f3d77e' : '#fff3c4', locked ? '#8da078' : '#98793c', 2);
      if (locked) icon(ctx, 'lock', n.x, n.y, 22, '#738768'); else label(ctx, `${v.chapter + 1}-${i + 1}`, n.x, n.y, 17, C.ink, 800, 'center');
      for (let s = 0; s < 3; s++) star(ctx, n.x - 17 + s * 17, n.y + 36, 7, s < stars);
      label(ctx, LEVELS[id - 1].name, n.x, n.y + 58, 12, C.ink, 600, 'center');
      this.hit(`level:${id}`, { x: n.x - 35, y: n.y - 32, w: 70, h: 81 }, locked ? `${LEVELS[id - 1].name}，完成前一关后解锁` : `第 ${id} 关 ${LEVELS[id - 1].name}，${stars} 星`, locked);
    });
    const foot = mapY + mapH + 30;
    label(ctx, '守住草坪，点亮每一颗星', v.w / 2, foot, 16, C.ink, 700, 'center');
    label(ctx, '保留全部割草机即可获得三星', v.w / 2, foot + 28, 13, C.muted, 500, 'center');
    this.button('continue-level', `进入第 ${unlockedLevel(v.save)} 关`, { x: v.w / 2 - Math.min(w, 330) / 2, y: foot + 53, w: Math.min(w, 330), h: 52 }, 'primary');
  }
  private adventure(v: View) {
    const ctx = this.ctx, top = this.heading(v, '冒险远征', '每场胜利，选择一份礼物。把花园带到更远的地方。');
    const w = Math.min(v.w - 48, 640), x = (v.w - w) / 2;
    const artH = Math.min(285, v.h * .31);
    gardenIllustration(ctx, { x: v.w / 2 - Math.min(530, v.w) / 2, y: top + 88, w: Math.min(530, v.w), h: artH }, v.save.settings.reducedMotion ? 0 : v.time, v.save.adventure && v.save.adventure.round > 2 ? 'night' : 'day');
    const y = top + 94 + artH, current = v.save.adventure?.round ?? 1;
    line(ctx, [x + 24, y + 20, x + w - 24, y + 20], '#b4c998', 6);
    for (let i = 1; i <= 5; i++) { const xx = x + 24 + (w - 48) * (i - 1) / 4; ellipse(ctx, xx, y + 20, 20, 20, i <= current ? C.sun : '#d1ddbb', i <= current ? '#bb9849' : '#a5bb8c', 2); label(ctx, String(i), xx, y + 20, 16, C.ink, 800, 'center'); }
    label(ctx, v.save.adventure ? `旅途进行中 · 第 ${current} 场` : '从一颗种子，走向整片森林', v.w / 2, y + 76, v.w < 700 ? 22 : 27, C.ink, 800, 'center', w);
    wrap(ctx, v.save.adventure ? `已获得：${v.save.adventure.perks.length ? v.save.adventure.perks.map(p => PERKS.find(k => k.id === p)!.name).join('、') : '即将获得第一份升级'}` : '连续守卫五处花园，关间自由选择强化。失败可以重试当前场，离开后也能继续旅途。', x + 6, y + 115, w - 12, 14, C.muted, 24, 3);
    this.button('adventure:continue', v.save.adventure ? v.save.adventure.awaitingPerk ? '领取升级，继续旅途' : '继续冒险' : '开启冒险', { x, y: y + 187, w, h: 56 }, 'primary');
    if (v.save.adventure) this.button('adventure:new', '重新出发', { x: v.w / 2 - 65, y: y + 263, w: 130, h: 44 });
    else label(ctx, `已完成 ${v.save.adventuresWon} 次远征`, v.w / 2, y + 280, 13, C.muted, 500, 'center');
  }
  private challenges(v: View) {
    const ctx = this.ctx, top = this.heading(v, '挑战模式', '换一种规则，试试你的花园战术。');
    const w = Math.min(v.w - 40, 740), x = (v.w - w) / 2, start = top + 105;
    const h = Math.min(120, (v.h - start - 104 - v.safeBottom) / 4 - 14);
    CHALLENGES.slice(v.challengePage * 4, v.challengePage * 4 + 4).forEach((c, i) => {
      const y = start + i * (h + 14), best = v.save.challenges[c.id];
      box(ctx, { x, y: y + 3, w, h }, '#b1c299', 17); box(ctx, { x, y, w, h }, C.paper, 17, '#bfccaa', 1.5);
      ellipse(ctx, x + 47, y + h / 2, 33, 33, ['#ede3b2', '#d3e5dd', '#e9d7b2', '#d4dfbb'][i]);
      drawPlant(ctx, c.plant, x + 47, y + h / 2 + 3, 57);
      label(ctx, c.name, x + 92, y + h * .29, 19, C.ink, 800);
      label(ctx, c.subtitle, x + 92, y + h * .56, 12, C.muted, 500, 'left', w - 126);
      label(ctx, best ? c.id === 'endless' ? `已完成 ${best.cleared ?? 0} 波 · ${best.score} 分` : `最佳 ${best.score} 分 · 通关 ${best.wins} 次` : '尚未挑战', x + 92, y + h * .8, 11, '#8c7652', 600, 'left', w - 128);
      arrow(ctx, x + w - 20, y + h / 2, 7);
      this.hit(`challenge:${c.id}`, { x, y, w, h }, `${c.name}，${c.description}`);
    });
    this.pager(v, 'challenge-page', v.challengePage, Math.ceil(CHALLENGES.length / 4));
  }
  private almanac(v: View) {
    const ctx = this.ctx, top = this.heading(v, '花园图鉴'), mobile = v.w < 700;
    const w = Math.min(v.w - 40, 960), x = (v.w - w) / 2;
    this.button('almanac:plants', '植物伙伴', { x: v.w / 2 - 150, y: top + 65, w: 142, h: 44 }, v.almanac === 'plants' ? 'dark' : 'light');
    this.button('almanac:zombies', '僵尸来客', { x: v.w / 2 + 8, y: top + 65, w: 142, h: 44 }, v.almanac === 'zombies' ? 'dark' : 'light');
    const all = v.almanac === 'plants' ? PLANT_ORDER : Object.keys(ZOMBIES) as ZombieKind[], keys = all.slice(v.almanacPage * 8, v.almanacPage * 8 + 8), cols = mobile ? 2 : 4, rows = 8 / cols;
    const cw = (w - (cols - 1) * 12) / cols, h = Math.min(mobile ? 124 : 185, (v.h - top - 230 - v.safeBottom) / rows - 12);
    keys.forEach((k, i) => {
      const xx = x + (i % cols) * (cw + 12), yy = top + 137 + Math.floor(i / cols) * (h + 12);
      box(ctx, { x: xx, y: yy, w: cw, h }, C.paper, 15, '#bfccaa', 1.5);
      if (v.almanac === 'plants') drawPlant(ctx, k as PlantKind, xx + cw / 2, yy + h * .37, h * .48);
      else drawZombie(ctx, k as ZombieKind, xx + cw / 2, yy + h * .4, h * .49);
      const info = v.almanac === 'plants' ? PLANTS[k as PlantKind] : ZOMBIES[k as ZombieKind];
      label(ctx, info.name, xx + cw / 2, yy + h * .74, 15, C.ink, 700, 'center');
      label(ctx, v.almanac === 'plants' ? `${PLANTS[k as PlantKind].cost} 阳光 · ${PLANTS[k as PlantKind].role}` : `${ZOMBIES[k as ZombieKind].hp} 生命`, xx + cw / 2, yy + h * .91, 11, C.muted, 500, 'center', cw - 12);
      this.hit(`inspect:${k}`, { x: xx, y: yy, w: cw, h }, `${info.name}，查看详细介绍`);
    });
    this.pager(v, 'almanac-page', v.almanacPage, Math.ceil(all.length / 8));
  }
  private pager(v: View, id: string, page: number, pages: number) {
    const y = v.h - v.safeBottom - 61, w = Math.min(400, v.w - 48), x = (v.w - w) / 2;
    this.button(`${id}:prev`, '上一页', {x,y,w:86,h:44}, 'light', page === 0);
    label(this.ctx, `${page + 1} / ${pages}`, v.w / 2, y + 22, 14, C.ink, 700, 'center');
    this.button(`${id}:next`, '下一页', {x:x+w-86,y,w:86,h:44}, 'light', page === pages - 1);
  }
  private battle(v: View) {
    if (!v.game) return;
    const ctx = this.ctx, g = v.game, mobile = v.w < 700, top = Math.max(14, v.safeTop + 8), b = boardLayout(v), left = Math.max(16, (v.w - 1120) / 2), night = g.config.biome === 'night';
    box(ctx, { x: left, y: top, w: 113, h: 44 }, C.paper, 14, '#b5bd91', 1.5); sunIcon(ctx, left + 24, top + 22, 12); label(ctx, String(g.sun), left + 46, top + 23, 24, C.ink, 800);
    this.hit('collect', { x: left, y: top, w: 113, h: 44 }, `${g.sun} 阳光，点击收集全部阳光`);
    this.iconButton('pause', 'pause', { x: v.w - left - 44, y: top, w: 44, h: 44 }, '暂停游戏');
    if (!mobile) this.iconButton('sound', v.save.settings.sound ? 'sound' : 'mute', { x: v.w - left - 98, y: top, w: 44, h: 44 }, v.save.settings.sound ? '关闭声音' : '打开声音');
    label(ctx, g.config.title, mobile ? left : v.w / 2, top + (mobile ? 66 : 13), mobile ? 16 : 18, night ? C.paper : C.ink, 800, mobile ? 'left' : 'center', mobile ? v.w - 156 : v.w * .45);
    label(ctx, g.waveText, mobile ? v.w - left : v.w / 2, top + (mobile ? 66 : 36), 13, night ? '#c8dcc0' : C.muted, 600, mobile ? 'right' : 'center');
    if (mobile) { box(ctx, { x: left + 130, y: top + 17, w: v.w - left * 2 - 194, h: 10 }, night ? '#35554b' : '#bfce9f', 5); box(ctx, { x: left + 130, y: top + 17, w: (v.w - left * 2 - 194) * g.progress, h: 10 }, C.sun, 5); }
    const rackY = top + (mobile ? 91 : 54), cardH = mobile ? (v.h < 720 ? 66 : 77) : (v.h < 500 ? 53 : 83), cols = mobile ? 4 : 8;
    const rackW = Math.min(v.w - 32, 1060), cardW = (rackW - (cols - 1) * 7) / cols, rackX = (v.w - rackW) / 2;
    for (let i = 0; i < Math.min(8, PLANT_ORDER.length - v.seedPage * 8); i++) {
      const k = PLANT_ORDER[v.seedPage * 8 + i], info = PLANTS[k], x = rackX + i % cols * (cardW + 7), y = rackY + Math.floor(i / cols) * (cardH + 7), usable = g.config.allowed.includes(k), selected = v.selected === k && !v.shovel;
      box(ctx, { x, y: y + 3, w: cardW, h: cardH }, selected ? '#b99540' : '#8eab79', 9);
      box(ctx, { x, y, w: cardW, h: cardH }, selected ? '#fff0b5' : usable ? C.paper : '#bdcbb0', 9, selected ? '#d4aa39' : '#96ad7f', selected ? 2.5 : 1.5);
      if (usable) {
        drawPlant(ctx, k, x + cardW * .3, y + cardH * .43, cardH * .51, 0);
        label(ctx, String(info.cost), x + cardW * .75, y + cardH * .43, mobile ? 17 : 20, g.sun >= info.cost ? C.ink : '#a48d73', 800, 'center');
        label(ctx, info.name, x + cardW / 2, y + cardH - 12, 11, C.ink, 600, 'center');
        if (g.cooldowns[k] > 0) { box(ctx, { x, y, w: cardW, h: cardH * Math.min(1, g.cooldowns[k] / info.cooldown) }, 'rgba(34,67,44,.4)', 7); label(ctx, `${Math.ceil(g.cooldowns[k])}s`, x + cardW / 2, y + cardH / 2, 20, '#fff7d8', 800, 'center'); }
        this.hit(`seed:${k}`, { x, y, w: cardW, h: cardH }, `${info.name}，${info.cost} 阳光，${info.role}${g.cooldowns[k] > 0 ? '，冷却中' : ''}`);
      } else { icon(ctx, 'lock', x + cardW / 2, y + cardH * .4, 17, '#7e9272'); label(ctx, '未携带', x + cardW / 2, y + cardH - 12, 11, '#6d8264', 500, 'center'); }
    }
    const pageY = rackY + (mobile ? cardH * 2 + 7 : cardH) + 5;
    this.button('seeds:prev', '上一袋 Q', {x:rackX,y:pageY,w:86,h:32}, 'light', v.seedPage === 0);
    const bagPages = Math.ceil(PLANT_ORDER.length / 8);
    const bagSummary = v.w < 360 ? `${v.seedPage + 1}/${bagPages} · ${g.config.allowed.length} 种` : `${v.seedPage + 1} / ${bagPages} 袋 · 可用 ${g.config.allowed.length} 种`;
    label(ctx, bagSummary, v.w / 2, pageY + 16, 12, night ? C.paper : C.ink, 700, 'center', rackW - 188);
    this.button('seeds:next', '下一袋 E', {x:rackX+rackW-86,y:pageY,w:86,h:32}, 'light', v.seedPage === Math.ceil(PLANT_ORDER.length / 8) - 1);
    drawBoard(ctx, g, b, v.time, v.cursor, v.shovel ? 'shovel' : v.selected, v.save.settings.reducedMotion);
    for (let row = 0; row < 5; row++) for (let col = 0; col < 9; col++) {
      const plant = g.plants.find(p => p.row === row && p.col === col);
      this.hit(`cell:${row}:${col}`, { x: b.x + col * b.cw, y: b.y + row * b.rh, w: b.cw, h: b.rh }, `第 ${row + 1} 行第 ${col + 1} 列，${plant ? PLANTS[plant.kind].name : '空地'}`);
    }
    for (const s of g.suns) this.hit(`sun:${s.id}`, { x: b.x + s.x * b.cw - 22, y: b.y + (s.y + .4) * b.rh - 22, w: 44, h: 44 }, `收集 ${s.value} 阳光`);
    label(ctx, g.waveNotice, v.w / 2, b.y + b.h + 23, 11, night ? '#d5e7d0' : C.ink, 600, 'center', v.w - 30);
    const toolY = b.y + b.h + 34, toolW = mobile ? (v.w - 48) / 3 : 116, toolX = mobile ? 16 : b.x;
    this.button('shovel', v.shovel ? '取消铲除' : '铲子', { x: toolX, y: toolY, w: toolW, h: 44 }, v.shovel ? 'primary' : 'light');
    this.button('speed', `${v.speed}× 速度`, { x: toolX + toolW + 8, y: toolY, w: toolW, h: 44 });
    this.button('help', '玩法提示', { x: toolX + (toolW + 8) * 2, y: toolY, w: toolW, h: 44 });
    const hint = v.shovel ? '点击植物移除 · 不返还阳光' : v.selected ? `${PLANTS[v.selected].name}：${PLANTS[v.selected].role}，点击空地种植` : '先点种子卡，再点草坪。金色阳光记得收集。';
    if (mobile) label(ctx, hint, v.w / 2, toolY + 75, 12, night ? '#c7d9ba' : C.muted, 500, 'center', v.w - 30);
    else if (b.w >= 760) label(ctx, hint, b.x + b.w, toolY + 23, 13, night ? '#c7d9ba' : C.muted, 500, 'right', b.w - 400);
    if (g.elapsed < 4) { box(ctx, { x: v.w / 2 - Math.min(270, b.w - 16) / 2, y: b.y + b.h / 2 - 25, w: Math.min(270, b.w - 16), h: 50 }, 'rgba(255,245,214,.94)', 15); label(ctx, '准备好，种下你的第一株植物！', v.w / 2, b.y + b.h / 2, 14, C.ink, 800, 'center', b.w - 34); }
  }
  private veil(v: View, height: number, width = 420): Rect {
    this.hits = [];
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(15,40,32,.58)'; ctx.fillRect(0, 0, v.w, v.h);
    const w = Math.min(width, v.w - 32), h = Math.min(height, v.h - v.safeTop - v.safeBottom - 40), r = { x: (v.w - w) / 2, y: Math.max(v.safeTop + 20, (v.h - h) / 2), w, h };
    box(ctx, { ...r, y: r.y + 7 }, '#5b5935', 24); box(ctx, r, C.paper, 24, '#a8b386', 2);
    return r;
  }
  private result(v: View) {
    if (!v.game) return;
    const g = v.game, ctx = this.ctx, won = g.state === 'won', endless = g.config.endless, r = this.veil(v, 498);
    drawPlant(ctx, won ? 'sunflower' : 'wallnut', v.w / 2, r.y + 77, 85, v.save.settings.reducedMotion ? 0 : v.time, won ? 1 : .4);
    label(ctx, won ? '花园守住了！' : endless ? '又守住了一段时光' : '僵尸闯进了花园', v.w / 2, r.y + 146, 26, C.ink, 900, 'center', r.w - 34);
    label(ctx, won ? g.config.mode === 'adventure' && Number(g.config.id) === 5 ? '五处花园，全部守护成功' : '每一株植物，都是小小的英雄。' : '调整植物搭配，再试一次吧。', v.w / 2, r.y + 183, 13, C.muted, 500, 'center', r.w - 30);
    if (won) for (let i = 0; i < 3; i++) star(ctx, v.w / 2 - 40 + i * 40, r.y + 230, 17, i < g.stars);
    else label(ctx, `${endless ? g.clearedWaves + ' 波完成' : g.wave + ' 波进攻'} · 坚守 ${Math.floor(g.elapsed / 60)} 分 ${Math.floor(g.elapsed % 60)} 秒`, v.w / 2, r.y + 230, 16, C.ink, 700, 'center');
    label(ctx, `击退 ${g.kills} 只僵尸     得分 ${g.score}`, v.w / 2, r.y + 279, 16, C.ink, 700, 'center');
    const next = won && (g.config.mode === 'levels' && Number(g.config.id) < LEVELS.length || g.config.mode === 'adventure' && Number(g.config.id) < 5);
    this.button(next ? 'next' : 'retry', next ? g.config.mode === 'adventure' ? '选择升级，继续冒险' : '下一关' : '再玩一次', { x: r.x + 25, y: r.y + 329, w: r.w - 50, h: 54 }, 'primary');
    this.button('result:back', g.config.mode === 'levels' ? '返回地图' : g.config.mode === 'adventure' ? '返回冒险' : '返回挑战', { x: r.x + 25, y: r.y + 402, w: r.w - 50, h: 48 });
  }
  private perks(v: View) {
    const ctx = this.ctx, top = this.heading(v, '花园的礼物', '选择一项强化，带入接下来的每一场战斗。');
    const a = v.save.adventure, w = Math.min(600, v.w - 40), x = (v.w - w) / 2;
    if (!a) return;
    label(ctx, `第 ${a.round} 场守卫成功`, v.w / 2, top + 120, 22, C.ink, 800, 'center');
    for (let i = 0; i < 3; i++) {
      const perk = PERKS[(a.round - 1 + i) % PERKS.length], y = top + 163 + i * 123;
      box(ctx, { x, y, w, h: 104 }, C.paper, 17, '#b9c997', 2); drawPlant(ctx, perk.plant, x + 48, y + 52, 62);
      label(ctx, perk.name, x + 94, y + 35, 20, C.ink, 800); label(ctx, perk.description, x + 94, y + 69, 12, C.muted, 500, 'left', w - 110);
      this.hit(`perk:${perk.id}`, { x, y, w, h: 104 }, `${perk.name}，${perk.description}`);
    }
    label(ctx, '升级会自动保存，可以随时回来继续', v.w / 2, top + 565, 13, C.muted, 500, 'center', v.w - 40);
  }
  private modal(v: View) {
    const ctx = this.ctx;
    if (v.modal === 'brief' && v.brief) {
      const g = v.brief, r = this.veil(v, 540), intro = g.mode === 'levels' ? LEVELS[Number(g.id) - 1].intro : g.mode === 'challenge' ? CHALLENGES.find(c => c.id === g.id)!.description : '守住这一处花园，胜利后选择强化，继续向前。';
      label(ctx, g.mode === 'levels' ? '准备守卫' : g.mode === 'adventure' ? '冒险远征' : '特别挑战', v.w / 2, r.y + 38, 14, C.muted, 700, 'center');
      label(ctx, g.title, v.w / 2, r.y + 82, 25, C.ink, 900, 'center', r.w - 30);
      wrap(ctx, intro, r.x + 26, r.y + 128, r.w - 52, 15, C.muted, 25, 3);
      box(ctx, { x: r.x + 24, y: r.y + 212, w: r.w - 48, h: 56 }, '#e6e8c4', 12);
      sunIcon(ctx, r.x + 48, r.y + 240, 11); label(ctx, `${g.startSun} 初始阳光`, r.x + 68, r.y + 240, 14, C.ink, 700);
      label(ctx, g.endless ? '无尽波次' : `${g.waves} 波进攻`, r.x + r.w - 40, r.y + 240, 14, C.ink, 700, 'right');
      label(ctx, '本场种子袋', r.x + 26, r.y + 296, 14, C.ink, 700);
      const cols = Math.min(7, g.allowed.length), sw = (r.w - 52) / cols;
      g.allowed.forEach((p, i) => { const x = r.x + 26 + (i % cols + .5) * sw, y = r.y + 326 + Math.floor(i / cols) * 43; drawPlant(ctx, p, x, y, Math.min(32, sw)); label(ctx, String(PLANTS[p].cost), x, y + 19, 10, C.muted, 600, 'center'); });
      this.button('start', '开始种植', { x: r.x + 24, y: r.y + 412, w: r.w - 48, h: 54 }, 'primary');
      this.button('close', '返回', { x: v.w / 2 - 48, y: r.y + 482, w: 96, h: 40 });
    } else if (v.modal === 'settings') {
      const r = this.veil(v, 430);
      label(ctx, '花园设置', v.w / 2, r.y + 44, 26, C.ink, 800, 'center');
      const settings = [['sound', '游戏音效', '轻轻一声，种下新伙伴'], ['autoSun', '自动收集阳光', '阳光落下后自动收入'], ['reducedMotion', '减少动态效果', '关闭摇摆与飞散粒子']] as const;
      settings.forEach(([id, title, sub], i) => {
        const y = r.y + 94 + i * 83, on = v.save.settings[id];
        label(ctx, title, r.x + 26, y + 4, 17, C.ink, 700); label(ctx, sub, r.x + 26, y + 32, 12, C.muted);
        box(ctx, { x: r.x + r.w - 81, y: y - 8, w: 55, h: 30 }, on ? '#6a9d4f' : '#bdc7a6', 16); ellipse(ctx, r.x + r.w - (on ? 43 : 64), y + 7, 11, 11, C.paper);
        this.hit(`setting:${id}`, { x: r.x + 18, y: y - 16, w: r.w - 36, h: 65 }, `${title}，当前${on ? '已开启' : '已关闭'}`);
      });
      this.button('close', '保存并返回', { x: r.x + 26, y: r.y + 347, w: r.w - 52, h: 52 }, 'primary');
    } else if (v.modal === 'help') {
      const r = this.veil(v, 510);
      label(ctx, '让花园生长起来', v.w / 2, r.y + 43, 24, C.ink, 800, 'center');
      const tips = ['点种子卡，再点空地种植。每一行都要有攻击植物。', '点金色阳光收集；也可以点左上角阳光数，一次收集全部。', '向日葵生产阳光，坚果挡住僵尸。夜晚没有天降阳光。', '铲子移除植物但不返还阳光。割草机每行只能使用一次。', '电脑：Q / E 翻袋，1–8 选当前袋，方向键选格，回车种植；S 收阳光，X 铲子，空格暂停。'];
      let y = r.y + 98;
      tips.forEach((t, i) => { ellipse(ctx, r.x + 30, y, 4, 4, '#7da653'); y += wrap(ctx, t, r.x + 44, y, r.w - 70, 13, C.muted, 22, 3) + (i === 4 ? 0 : 13); });
      this.button('close', '我知道了', { x: r.x + 26, y: r.y + r.h - 77, w: r.w - 52, h: 52 }, 'primary');
    } else if (v.modal === 'pause') {
      const r = this.veil(v, 423);
      drawPlant(ctx, 'wallnut', v.w / 2, r.y + 75, 72); label(ctx, '花园休息一下', v.w / 2, r.y + 141, 26, C.ink, 800, 'center');
      this.button('close', '继续守卫', { x: r.x + 25, y: r.y + 192, w: r.w - 50, h: 54 }, 'primary');
      this.button('settings', '花园设置', { x: r.x + 25, y: r.y + 264, w: (r.w - 62) / 2, h: 48 });
      this.button('retry', '重新开始', { x: r.x + r.w / 2 + 6, y: r.y + 264, w: (r.w - 62) / 2, h: 48 });
      this.button('leave', '返回花园', { x: r.x + 25, y: r.y + 333, w: r.w - 50, h: 48 });
    } else if (v.modal === 'leave' || v.modal === 'new-adventure') {
      const fresh = v.modal === 'new-adventure', r = this.veil(v, 300);
      label(ctx, fresh ? '重新开启冒险？' : '暂时离开花园？', v.w / 2, r.y + 50, 24, C.ink, 800, 'center');
      wrap(ctx, fresh ? '这会替换当前冒险进度，重新从第一场开始。' : v.game?.config.mode === 'adventure' ? '本场战斗会重新开始，已获得的冒险强化仍会保留。' : '本场战斗不会保存，已获得的关卡星星和最佳纪录会保留。', r.x + 26, r.y + 106, r.w - 52, 14, C.muted, 24, 3);
      this.button(fresh ? 'adventure:reset' : 'leave:confirm', fresh ? '重新出发' : '返回花园', { x: r.x + 26, y: r.y + 206, w: (r.w - 64) / 2, h: 50 });
      this.button('close', '继续守卫', { x: r.x + r.w / 2 + 6, y: r.y + 206, w: (r.w - 64) / 2, h: 50 }, 'primary');
    } else if (v.modal === 'detail') {
      const plant = v.detail in PLANTS, data = plant ? PLANTS[v.detail as PlantKind] : ZOMBIES[v.detail as ZombieKind], r = this.veil(v, 418);
      if (plant) drawPlant(ctx, v.detail as PlantKind, v.w / 2, r.y + 98, 110); else drawZombie(ctx, v.detail as ZombieKind, v.w / 2, r.y + 106, 105);
      label(ctx, data.name, v.w / 2, r.y + 178, 26, C.ink, 800, 'center');
      wrap(ctx, data.description, r.x + 28, r.y + 229, r.w - 56, 15, C.muted, 26, 4);
      this.button('close', '收好图鉴', { x: r.x + 26, y: r.y + 340, w: r.w - 52, h: 52 }, 'primary');
    }
  }
}
