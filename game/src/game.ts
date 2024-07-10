import { Building, buildingToClass, BuildingType } from "./building";
import { MAP_SIZE } from "./consts";
import { Item } from "./item";
import { Vec2 } from "./math";

let singleton: Game | null = null;

export class Game {
  public buildings: Building[] = [];
  public items: Item[] = [];
  public selectedBuilding: BuildingType | null = null;
  public id = 0;

  static instance(): Game {
    if (!singleton) {
      singleton = new Game();
    }
    return singleton;
  }

  constructor() {
    this.id = Math.floor(Math.random() * 100000);
  }

  public isValidPosition(pos: Vec2): boolean {
    const onGrid =
      pos.x >= 0 && pos.x < MAP_SIZE && pos.y >= 0 && pos.y < MAP_SIZE;
    if (!onGrid) {
      return false;
    }

    if (this.selectedBuilding !== BuildingType.Empty) {
      for (const building of this.buildings) {
        const buildingPos = building.gridPos();
        if (buildingPos.x === pos.x && buildingPos.y === pos.y) {
          return false;
        }
      }
    }

    return true;
  }

  public selectBuilding(building: BuildingType | null): void {
    this.selectedBuilding = building;
  }

  public build(tilePos: Vec2): void {
    if (!this.isValidPosition(tilePos)) {
      throw new Error("Invalid position");
    }
    if (!this.selectedBuilding) {
      return;
    }
    this.clearPosition(tilePos);

    if (this.selectedBuilding !== BuildingType.Empty) {
      const buildingClass = buildingToClass[this.selectedBuilding];
      this.buildings.push(new buildingClass(tilePos));
    }
  }

  private clearPosition(pos: Vec2): void {
    this.buildings = this.buildings.filter((building) => {
      const buildingPos = building.gridPos();
      return buildingPos.x !== pos.x || buildingPos.y !== pos.y;
    });
  }
}
