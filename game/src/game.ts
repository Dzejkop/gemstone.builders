import { Building, BuildingType } from "./building";
import { MAP_SIZE } from "./consts";
import { Vec2 } from "./math";

export class Game {
  public buildings: Building[] = [];
  public selectedBuilding: BuildingType | null = null;

  constructor() {}

  public isValidPosition(pos: Vec2): boolean {
    const onGrid = pos.x >= 0 && pos.x < MAP_SIZE && pos.y >= 0 && pos.y < MAP_SIZE;
    if (!onGrid) {
        return false;
    }

    for (const building of this.buildings) {
        const buildingPos = building.gridPos();
        if (buildingPos.x === pos.x && buildingPos.y === pos.y) {
            return false;
        }
    }

    return true;
  }
}
