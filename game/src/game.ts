import { Building, buildingClassToType, buildingToClass, BuildingType } from "./building";
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
      updateTimelineTracks(this.selectedBuilding, tilePos);
    }
  }

  private clearPosition(pos: Vec2): void {
    const removedBuilding = this.buildings.find((building) => {
      const buildingPos = building.gridPos();
      return buildingPos.x === pos.x && buildingPos.y === pos.y;
    });

    this.buildings = this.buildings.filter((building) => {
      const buildingPos = building.gridPos();
      return buildingPos.x !== pos.x || buildingPos.y !== pos.y;
    });

    if (removedBuilding) {
      const buildingType = buildingClassToType[removedBuilding.constructor.name];
      removeFromTimelineTracks(buildingType, pos);
    }
  }
}

function updateTimelineTracks(buildingType: BuildingType, pos: Vec2): void {
  const timelineTracks = document.getElementById("timelineTracks");
  if (!timelineTracks) return;

  let group = timelineTracks.querySelector(`[data-type="${buildingType}"]`) as HTMLElement | null;
  if (!group) {
    group = document.createElement("div");
    group.dataset.type = buildingType;
    group.innerHTML = `<div class="font-bold">${buildingType}</div>`;
    timelineTracks.appendChild(group);
  }

  const buildingName = `${buildingType}-${pos.x}-${pos.y}`;

  const buildingItem = document.createElement("div");
  buildingItem.dataset.pos = `${pos.x}-${pos.y}`;
  buildingItem.className = "building-item";
  buildingItem.textContent = buildingName;
  group.appendChild(buildingItem);

  const buildingItems = Array.from(group.querySelectorAll('.building-item')) as HTMLElement[];
  buildingItems.sort((a, b) => {
    const [aX, aY] = a.dataset.pos!.split('-').map(Number);
    const [bX, bY] = b.dataset.pos!.split('-').map(Number);
    if (aX !== bX) return aX - bX;
    return aY - bY;
  });
  group.innerHTML = '';
  buildingItems.forEach(item => group.appendChild(item));
}

function removeFromTimelineTracks(buildingType: BuildingType, pos: Vec2): void {
  const timelineTracks = document.getElementById("timelineTracks");
  if (!timelineTracks) return;

  const group = timelineTracks.querySelector(`[data-type="${buildingType}"]`) as HTMLElement | null;
  if (!group) return;

  const posString = `${pos.x}-${pos.y}`;
  const buildingItem = group.querySelector(`.building-item[data-pos="${posString}"]`);
  if (buildingItem) {
    group.removeChild(buildingItem);
  }
}

function getBuildingTypeFromClass(building: Building): BuildingType {
  for (const [type, cls] of Object.entries(buildingToClass)) {
    if (building instanceof cls) {
      return type as BuildingType;
    }
  }
  return BuildingType.Empty;
}
