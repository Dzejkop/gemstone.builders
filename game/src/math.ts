export class Vec2 {
  static ZERO: Vec2 = new Vec2(0, 0);

  constructor(public readonly x: number, public readonly y: number) {}

  public add(other: Vec2): Vec2 {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  public sub(other: Vec2): Vec2 {
    return new Vec2(this.x - other.x, this.y - other.y);
  }
}
