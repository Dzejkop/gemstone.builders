import { Vec2 } from "./math";
import { Renderer } from "./rendering/renderer";

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

  public installTrackers(renderer: Renderer) {
    const canvas = renderer.ctx.canvas;

    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();

      let rendererOffset = renderer.offset();

      const mouseX = event.clientX - rect.left - rendererOffset.x;
      const mouseY = event.clientY - rect.top - rendererOffset.y;

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
