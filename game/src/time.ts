export class Time {
  public startTime: number = Date.now();
  public currentTime: number = 0;

  // Milliseconds since start
  public t: number = 0;

  // Seconds since start
  public ts: number = 0;

  // Deltas
  public dt: number = 0;
  public dts: number = 0;

  public update() {
    const now = Date.now();

    this.dt = now - this.currentTime;
    this.dts = this.dt / 1000.0;

    this.currentTime = now;

    this.t = this.currentTime - this.startTime;
    this.ts = this.t / 1000.0;
  }
}
