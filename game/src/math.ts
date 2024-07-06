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
}
