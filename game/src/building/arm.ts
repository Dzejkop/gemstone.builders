import { AllBuildingParams, Building, Rotation } from "../building";
import { Item } from "../item";
import { Vec2 } from "../math";
import { Renderer } from "../rendering/renderer";
import { ZkId } from "./zkIds";

export class RobotArm implements Building {
  private static readonly armBaseTile = new Vec2(9, 5);
  private static readonly armTile = new Vec2(10, 5);
  private static readonly armTileSize = new Vec2(2, 1);

  private readonly armFlipped: boolean;
  private readonly rotation: Rotation;

  public heldItem: Item | null = null;

  constructor(
    public readonly pos: Vec2 = new Vec2(0, 0),
    params: AllBuildingParams = {},
  ) {
    this.armFlipped = params.armFlipped || false;
    this.rotation = params.rotation || Rotation.Up;
  }

  gridPos(): Vec2 {
    return this.pos;
  }

  /// Draws the real image of the robot arm
  drawReal(renderer: Renderer, s: number) {
    const armRotation = (Math.PI / 2) * s;

    let centerPixelPos = this.pos.mul(renderer.tileSize);
    let armPixelPos = centerPixelPos.add(
      new Vec2(1.0, 0.0).mul(renderer.tileSize).rotate(armRotation),
    );

    renderer.drawSprite(this.pos.mul(renderer.tileSize), RobotArm.armBaseTile);

    if (this.heldItem) {
      // let armSlotPos =
      this.heldItem.draw(renderer, armPixelPos);
    }

    renderer.drawSprite(
      this.pos.mul(renderer.tileSize),
      RobotArm.armTile,
      RobotArm.armTileSize,
      armRotation,
    );
  }

  public drawGhost(renderer: Renderer, pos: Vec2, _params: AllBuildingParams) {
    renderer.drawSprite(pos.mul(renderer.tileSize), RobotArm.armBaseTile);
    renderer.drawSprite(
      pos.mul(renderer.tileSize),
      RobotArm.armTile,
      RobotArm.armTileSize,
      0,
    );
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
