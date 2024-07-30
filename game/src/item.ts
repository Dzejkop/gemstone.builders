import { Vec2 } from "./math";
import { Renderer } from "./rendering/renderer";

export class Item {
  private readonly spriteCoords = new Vec2(0, 7);

  draw(renderer: Renderer, pos: Vec2) {
    renderer.drawSprite(pos, this.spriteCoords);
  }
}
