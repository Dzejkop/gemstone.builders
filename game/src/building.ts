import { RobotArm } from "./building/arm";
import { ConveyorBeltDown } from "./building/beltDown";
import { ConveyorBeltLeft } from "./building/beltLeft";
import { ConveyorBeltRight } from "./building/beltRight";
import { ConveyorBeltUp } from "./building/beltUp";
import { Empty } from "./building/empty";
import { Factory } from "./building/factory";
import { Mine } from "./building/mine";
import { ZkId } from "./building/zkIds";
import { Vec2 } from "./math";
import { Renderer } from "./rendering/renderer";

export enum BuildingType {
  Empty = "Empty",
  Mine = "Mine",
  Factory = "Factory",
  BeltDown = "BeltDown",
  BeltUp = "BeltUp",
  BeltLeft = "BeltLeft",
  BeltRight = "BeltRight",
  RobotArm = "RobotArm",
}

export enum Rotation {
  Up = 0,
  Right = 1,
  Down = 2,
  Left = 3,
}

// TODO: Maybe there's a better way
export type AllBuildingParams = {
  armFlipped?: boolean;
  rotation?: Rotation;
};

export interface Building {
  // update(s: number): void;
  gridPos(): Vec2;
  drawReal(renderer: Renderer, s: number): void;
  drawGhost(renderer: Renderer, pos: Vec2, params: AllBuildingParams): void;
  zkId(): ZkId;
}

export const buildingToClass = {
  [BuildingType.Empty]: Empty,
  [BuildingType.BeltDown]: ConveyorBeltDown,
  [BuildingType.BeltUp]: ConveyorBeltUp,
  [BuildingType.BeltLeft]: ConveyorBeltLeft,
  [BuildingType.BeltRight]: ConveyorBeltRight,
  [BuildingType.Mine]: Mine,
  [BuildingType.Factory]: Factory,
  [BuildingType.RobotArm]: RobotArm,
};

// Used to draw ghosts & stuff like that
export const allBuildings = {
  Empty: new Empty(),
  BeltDown: new ConveyorBeltDown(),
  BeltUp: new ConveyorBeltUp(),
  BeltLeft: new ConveyorBeltLeft(),
  BeltRight: new ConveyorBeltRight(),
  Mine: new Mine(),
  Factory: new Factory(),
  RobotArm: new RobotArm(),
};
