export class Vec2 {
  static ZERO: Vec2 = new Vec2(0, 0);
  static ONE: Vec2 = new Vec2(1, 1);

  constructor(public readonly x: number, public readonly y: number) {}

  public add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  public sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  public mul(n: number): Vec2 {
    return new Vec2(this.x * n, this.y * n);
  }

  public div(n: number): Vec2 {
    return new Vec2(this.x / n, this.y / n);
  }

  public floor(): Vec2 {
    return new Vec2(Math.floor(this.x), Math.floor(this.y));
  }

  public rotate(angle: number): Vec2 {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return new Vec2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }
}
