import { RobotArm } from "./building/arm";
import { ConveyorBelt } from "./building/belt";
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
  Belt = "Belt",
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
  gridPos(): Vec2;
  drawReal(renderer: Renderer, s: number): void;
  drawGhost(renderer: Renderer, pos: Vec2, params: AllBuildingParams): void;
  zkId(): ZkId;
  active?: boolean;
  toggle?(): void;
}

export const buildingToClass = {
  [BuildingType.Empty]: Empty,
  [BuildingType.Belt]: ConveyorBelt,
  [BuildingType.Mine]: Mine,
  [BuildingType.Factory]: Factory,
  [BuildingType.RobotArm]: RobotArm,
};

export const buildingClassToType: Record<string, BuildingType> = {
  [Empty.name]: BuildingType.Empty,
  [ConveyorBelt.name]: BuildingType.Belt,
  [Mine.name]: BuildingType.Mine,
  [Factory.name]: BuildingType.Factory,
  [RobotArm.name]: BuildingType.RobotArm,
};

// Used to draw ghosts & stuff like that
export const allBuildings = {
  Empty: new Empty(),
  Belt: new ConveyorBelt(),
  Mine: new Mine(),
  Factory: new Factory(),
  RobotArm: new RobotArm(),
};
