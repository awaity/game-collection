/** Minimal runnable milestone; the full deterministic simulation follows separately. */
export class Battle {
  time = 0;
  x = 0;
  target = 0;
  distance = 0;
  troops = 10;
  gate = { x: -4, distance: 20, value: 0, hits: 0, passed: false };
  boss = { hp: 300, maxHp: 300, distance: 56 };
  bullets: { x: number; distance: number }[] = [];
  phase: 'ready' | 'playing' | 'paused' | 'won' | 'lost' = 'ready';
  shots = 0;
  private fire = 0;

  step(dt: number) {
    if (this.phase !== 'playing') return;
    this.time += dt;
    this.x += Math.max(-dt * 8, Math.min(dt * 8, this.target - this.x));
    this.distance = Math.min(49, this.distance + dt * 3.5);
    this.fire -= dt;
    if (this.fire <= 0) {
      this.fire += .3;
      for (let i = 0; i < this.troops; i++) {
        this.bullets.push({ x: this.x + (i % 5 - 2) * .6, distance: this.distance - Math.floor(i / 5) * .6 });
        this.shots++;
      }
    }
    this.bullets = this.bullets.filter(b => {
      const previous = b.distance; b.distance += dt * 51;
      if (!this.gate.passed && previous < 20 && b.distance >= 20 && Math.abs(b.x - this.gate.x) < 1.8) {
        this.gate.hits++;
        this.gate.value = Math.floor(this.gate.hits / 8); return false;
      }
      if (previous < 56 && b.distance >= 56 && Math.abs(b.x) < 2) { this.boss.hp = Math.max(0, this.boss.hp - 1); return false; }
      return b.distance < this.distance + 35;
    });
    if (!this.gate.passed && this.distance >= 20) {
      if (Math.abs(this.x - this.gate.x) < 1.8) this.troops += this.gate.value;
      this.gate.passed = true;
    }
    if (this.boss.hp === 0) this.phase = 'won';
    else if (this.time >= 35) this.phase = 'lost';
  }
}
