import { AllBuildingParams, Building, Rotation } from "../building";
import { Vec2 } from "../math";
import { Renderer } from "../renderer";
import { ZkId } from "./zkIds";

export class RobotArm implements Building {
  private static readonly armBaseTile = new Vec2(9, 5);
  private static readonly armTile = new Vec2(10, 5);
  private static readonly armTileSize = new Vec2(2, 1);

  private readonly armFlipped: boolean;
  private readonly rotation: Rotation;

  constructor(
    public readonly pos: Vec2 = new Vec2(0, 0),
    params: AllBuildingParams = {},
  ) {
    this.armFlipped = params.armFlipped || false;
    this.rotation = params.rotation || Rotation.Up;
  }

  update(s: number) {

  }

  gridPos(): Vec2 {
    return this.pos;
  }

  /// Draws the real image of the robot arm
  drawReal(renderer: Renderer) {
    renderer.drawSprite(this.pos.mul(renderer.tileSize), RobotArm.armBaseTile);
    renderer.drawSprite(this.pos.mul(renderer.tileSize), RobotArm.armTile, RobotArm.armTileSize, 0);
  }

  public drawGhost(
    renderer: Renderer,
    pos: Vec2,
    _params: AllBuildingParams
  ) {
    renderer.drawSprite(pos.mul(renderer.tileSize), RobotArm.armBaseTile);
    renderer.drawSprite(pos.mul(renderer.tileSize), RobotArm.armTile, RobotArm.armTileSize, 0);
  }

  public zkId() {
    if (this.armFlipped) {
      if (this.rotation === Rotation.Up) {
        return ZkId.RobotArmUR;
      } else if (this.rotation === Rotation.Right) {
        return ZkId.RobotArmRD;
      } else if (this.rotation === Rotation.Down) {
        return ZkId.RobotArmDL;
      } else {
        return ZkId.RobotArmLU;
      }
    } else {
      if (this.rotation === Rotation.Up) {
        return ZkId.RobotArmUL;
      } else if (this.rotation === Rotation.Right) {
        return ZkId.RobotArmLD;
      } else if (this.rotation === Rotation.Down) {
        return ZkId.RobotArmDR;
      } else {
        return ZkId.RobotArmRU;
      }
    }
  }
}
