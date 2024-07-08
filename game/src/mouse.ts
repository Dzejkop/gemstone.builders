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

  public installTrackers(canvas: HTMLCanvasElement) {
    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      this.pos = new Vec2(mouseX, mouseY);
    });

    // Mouse button state
    canvas.addEventListener("mousedown", (event) => {
      this.btnDown[event.button] = true;
    });
    canvas.addEventListener("mouseup", (event) => {
      this.btnDown[event.button] = false;
    });
    canvas.addEventListener("click", (event) => {
      this.btnClick[event.button] = true;
    });
  }
}
