import { AllBuildingParams, Building } from "../building";
import { Vec2 } from "../math";
import { Renderer } from "../rendering/renderer";
import { ZkId } from "./zkIds";

export class Mine implements Building {
  private static readonly baseTile = new Vec2(0, 0);

  constructor(
    public readonly pos: Vec2 = new Vec2(0, 0),
    params: AllBuildingParams = {},
  ) {}

  gridPos(): Vec2 {
    return this.pos;
  }

  /// Draws the real image of the robot arm
  drawReal(renderer: Renderer, s: number) {
    renderer.drawSprite(this.pos.mul(renderer.tileSize), Mine.baseTile);
  }

  public drawGhost(renderer: Renderer, pos: Vec2, _params: AllBuildingParams) {
    renderer.drawSprite(pos.mul(renderer.tileSize), Mine.baseTile);
  }

  public zkId() {
    return ZkId.Mine;
  }
}
