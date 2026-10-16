/** Fixed simulation time, independent of display refresh rate. */
export class FixedClock {
  private last: number | null = null;
  private accumulator = 0;
  constructor(
    readonly step = 1 / 60,
    readonly maxDelta = 0.1,
  ) {}
  reset() {
    this.last = null;
    this.accumulator = 0;
  }
  advance(now: number, active: boolean, update: () => void) {
    if (!Number.isFinite(now)) return;
    const delta =
      this.last === null
        ? 0
        : Math.max(0, Math.min(this.maxDelta, (now - this.last) / 1000));
    this.last = now;
    if (!active) {
      this.accumulator = 0;
      return;
    }
    this.accumulator += delta;
    while (this.accumulator + 1e-9 >= this.step) {
      update();
      this.accumulator -= this.step;
    }
  }
}
