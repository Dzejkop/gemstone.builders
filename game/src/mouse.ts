import { Vec2 } from "./math";

export const BTN = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
};

export class Mouse {
  public pos: Vec2 = Vec2.ZERO;
  public btnDown: boolean[] = [false, false, false];
  public btnClick: boolean[] = [false, false, false];

  public reset() {
    this.btnClick = [false, false, false];
  }
}
