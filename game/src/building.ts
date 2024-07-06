import { RobotArm } from "./building/arm";
import { ZkId } from "./building/zkIds";
import { Vec2 } from "./math";
import { Renderer } from "./rendering/renderer";

export enum BuildingType {
  Empty = "Empty",
  Mine = "Mine",
  Factory = "Factory",
  BeltDown = "BeltDown",
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
}

export interface Building {
  // update(s: number): void;
  gridPos(): Vec2;
  drawReal(renderer: Renderer, s: number): void;
  drawGhost(renderer: Renderer, pos: Vec2, params: AllBuildingParams): void;
  zkId(): ZkId;
}

// Used to draw ghosts & stuff like that
export const allBuildings = {
  RobotArm: new RobotArm(),
};
