import { _decorator, Component, KeyCode, Vec3 } from 'cc';
import { GameView } from 'db://assets/collection/runtime';
import { Battle } from './core';
const { ccclass } = _decorator;

@ccclass('FinalDoor')
export class FinalDoor extends Component {
  private ui!: GameView;
  private battle = new Battle();
  private accumulator = 0;
  private axis = 0;

  start() {
    this.ui = new GameView('final-door.save.v1');
    this.ui.onHide = () => { if (this.battle.phase === 'playing') this.battle.phase = 'paused'; };
    this.ui.onKey = (e, down) => {
      if (e.keyCode === KeyCode.ARROW_LEFT || e.keyCode === KeyCode.KEY_A) this.axis = down ? -1 : 0;
      if (e.keyCode === KeyCode.ARROW_RIGHT || e.keyCode === KeyCode.KEY_D) this.axis = down ? 1 : 0;
      if (down && e.keyCode === KeyCode.SPACE) this.toggle();
      if (down && e.keyCode === KeyCode.KEY_R) this.restart();
    };
    this.ui.onTouch = (e, phase) => {
      const p = e.getUILocation();
      if (phase !== 'end' && p.y > 120 && p.y < this.ui.height - 140) this.battle.target = Math.max(-5.3, Math.min(5.3, (p.x / this.ui.width - .5) * 13));
    };
  }

  private restart() { this.battle = new Battle(); this.battle.phase = 'playing'; }
  private toggle() {
    this.battle.phase = this.battle.phase === 'playing' ? 'paused' : this.battle.phase === 'paused' ? 'playing' : this.battle.phase;
  }

  update(dt: number) {
    if (!this.ui) return;
    this.accumulator += Math.min(dt, .1);
    while (this.accumulator >= 1 / 60) {
      this.battle.target = Math.max(-5.3, Math.min(5.3, this.battle.target + this.axis * .1));
      this.battle.step(1 / 60); this.accumulator -= 1 / 60;
    }
    const b = this.battle, ui = this.ui, half = ui.height / 2;
    ui.platform.state(b.phase === 'ready' ? 'menu' : b.phase === 'playing' ? 'playing' : b.phase === 'paused' ? 'paused' : 'result');
    ui.begin();
    ui.shape('sea', 'box', '#294a69', 0, -.8, -45, 350, .1, 350);
    ui.shape('road', 'box', '#707e96', 0, -.2, -35, 13.25, .35, 120);
    for (let k = -2; k < 20; k++) {
      const z = b.distance % 6 - k * 6;
      ui.shape(`line${k}`, 'box', '#edf6ff', 0, .01, z, .12, .02, 1.2);
      for (const side of [-1, 1]) {
        ui.shape(`rail${k}/${side}`, 'box', '#9db2ca', side * 6.8, .6, z, .15, .17, 6);
        ui.shape(`post${k}/${side}`, 'box', '#4f677f', side * 6.8, .35, z, .2, .9, .2);
      }
    }
    for (let i = 0; i < b.troops; i++) {
      const x = b.x + (i % 5 - 2) * .6, z = Math.floor(i / 5) * .6;
      ui.shape(`body${i}`, 'cylinder', '#078ada', x, .6, z, .42, .8, .42);
      ui.shape(`head${i}`, 'sphere', '#35c3ff', x, 1.15, z, .57, .52, .57);
      ui.shape(`gun${i}`, 'box', '#25465b', x + .25, .78, z - .4, .13, .15, .55);
    }
    if (!b.gate.passed) {
      ui.shape('gate', 'box', '#118ef0', -4, 1.1, b.distance - 20, 3.8, 1.7, .25);
      ui.worldText('gate-value', `+${b.gate.value}`, new Vec3(-4, 1.5, b.distance - 20), 28);
    }
    const z = b.distance - b.boss.distance;
    ui.shape('boss', 'cylinder', '#d22950', 0, 2, z, 3, 4, 2.8);
    ui.shape('boss-head', 'sphere', '#ff6084', 0, 4.2, z, 2.6, 2.6, 2.6);
    ui.worldText('boss-hp', `${b.boss.hp}`, new Vec3(0, 6, z), 20);
    b.bullets.forEach((p, i) => ui.shape(`bullet${i}`, 'box', '#baf5ff', p.x, .8, b.distance - p.distance, .06, .06, .5));
    ui.text('title', '最后一道门', -ui.width / 2 + 96, half - 44, 21, '#f1f8ff', 175);
    ui.text('subtitle', '蓝焰突围 · 蓝湾前哨', -ui.width / 2 + 96, half - 74, 12, '#a9cbdf', 180);
    ui.text('troops', `真实队伍 ${b.troops}`, ui.width / 2 - 75, half - 58, 20, '#c4efff', 150);
    if (b.phase === 'ready') {
      ui.text('hint', '射击门值，壮大队伍。左右拖动，自动开火。', 0, -half + 130, 13);
      ui.button('start', '接管战斗', 0, -half + 75, 170, () => this.restart(), true);
    } else if (b.phase === 'playing') {
      ui.text('hint', '左右拖动 · A / D 移动 · 空格暂停', 0, -half + 110, 12, '#c4d7e6');
      ui.button('pause', '暂停', 0, -half + 65, 100, () => this.toggle());
    } else {
      ui.text('result', b.phase === 'paused' ? '战斗已暂停' : b.phase === 'won' ? '突破防线' : '突围失败', 0, 75, 30);
      ui.text('report', `${b.shots} 发射击 · ${b.troops} 名队员`, 0, 25, 16);
      ui.button('continue', b.phase === 'paused' ? '继续战斗' : '重新突围', 0, -45, 170, () => b.phase === 'paused' ? this.toggle() : this.restart(), true);
      ui.button('home', '返回集合点', 0, -105, 170, () => { this.battle = new Battle(); });
    }
  }
  onDestroy() { this.ui?.destroy(); }
}
