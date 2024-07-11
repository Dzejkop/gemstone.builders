import { AllBuildingParams, Building, Rotation } from "../building";
import { Vec2 } from "../math";
import { Renderer } from "../rendering/renderer";
import { ZkId } from "./zkIds";

export class ConveyorBelt implements Building {
  private static readonly baseTile = new Vec2(1, 3);
  private static readonly tileSize = new Vec2(1, 1);

  private readonly rotation: Rotation;

  constructor(
    public readonly pos: Vec2 = new Vec2(0, 0),
    params: AllBuildingParams = {},
  ) {
    this.rotation = params.rotation || Rotation.Up;
  }

  public gridPos(): Vec2 {
    return this.pos;
  }

  /// Draws the real image of the robot arm
  public drawReal(renderer: Renderer, s: number) {
    renderer.drawSprite(this.pos.mul(renderer.tileSize), ConveyorBelt.baseTile, ConveyorBelt.tileSize, this.rotationAngle());
  }

  public drawGhost(renderer: Renderer, pos: Vec2, params: AllBuildingParams) {
    console.log("Drawing ghost", this.rotation);
    renderer.drawSprite(pos.mul(renderer.tileSize), ConveyorBelt.baseTile, ConveyorBelt.tileSize, this.rotationAngle());
  }

  public zkId() {
    if (this.rotation === Rotation.Up) {
      return ZkId.BeltUp;
    } else if (this.rotation === Rotation.Right) {
      return ZkId.BeltRight;
    } else if (this.rotation === Rotation.Down) {
      return ZkId.BeltDown;
    } else {
      return ZkId.BeltLeft;
    }
  }

  private rotationAngle(): number {
    switch (this.rotation) {
      case Rotation.Down:
        return 0;
      case Rotation.Right:
        return Math.PI * 1.5;
      case Rotation.Up:
        return Math.PI;
      case Rotation.Left:
        return Math.PI / 2;
    }
  }
}
