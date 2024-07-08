export class Time {
    public startTime: number = Date.now();
    public currentTime: number = 0;

    // Milliseconds since start
    public t: number = 0;

    // Seconds since start
    public ts: number = 0;

    public update() {
        this.currentTime = Date.now();
        this.t = this.currentTime - this.startTime;
        this.ts = this.t / 1000.0;
    }
}
