import { AllBuildingParams, Building } from "../building";
import { Vec2 } from "../math";
import { Renderer } from "../rendering/renderer";
import { TrackRenderer } from "../rendering/trackRenderer";
import { ZkId } from "./zkIds";

export class Mine implements Building {
  private static readonly baseTile = new Vec2(3, 2);

  constructor(
    public readonly pos: Vec2 = new Vec2(0, 0),
    params: AllBuildingParams = {},
  ) {}

  drawTrack(renderer: TrackRenderer): void {
    renderer.draw(this.constructor.name, this.pos);
  }

  gridPos(): Vec2 {
    return this.pos;
  }

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
