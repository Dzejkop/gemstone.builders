import { BuildingType, RobotArm } from './building';
import { Game } from './game';
import { Vec2 } from './math';

const arm = new RobotArm(new Vec2(0, 0));

export class Renderer {
    public tileSize = 90;
    private tilesetTileSize = 16;

    constructor(public readonly ctx: CanvasRenderingContext2D, public readonly tileset: HTMLImageElement) {
    }

    public render(gameState: Game): void {
      this.ctx.imageSmoothingEnabled = false;

      this.drawGrid(gameState);
      this.drawBuildings(gameState);
      this.testDraw();
    }

    private testDraw(): void {
    }

    private drawGrid(gameState: Game): void {
      for (let row = 0; row < gameState.rows; row++) {
        for (let col = 0; col < gameState.cols; col++) {
          const x = col * this.tileSize;
          const y = row * this.tileSize;
          this.ctx.strokeStyle = "black";
          this.ctx.lineWidth = 1;
          this.ctx.strokeRect(x, y, this.tileSize, this.tileSize);
        }
      }
    }

    private drawBuildings(gameState: Game): void {
      const buildings = gameState.getBuildings();

      for (let row = 0; row < gameState.rows; row++) {
        for (let col = 0; col < gameState.cols; col++) {
          const building = buildings[row * gameState.cols + col];
          if (building !== BuildingType.Empty) {
            this.drawBuilding(building, row, col);
          }
        }
      }
    }

    private drawBuilding(building: BuildingType, row: number, col: number): void {
      const x = col * this.tileSize;
      const y = row * this.tileSize;
      const coords = this.buildingTileCoordinates(building);
      this.ctx.drawImage(
        this.tileset,
        coords.y,
        coords.x,
        this.tilesetTileSize,
        this.tilesetTileSize,
        x,
        y,
        this.tileSize,
        this.tileSize
      );
    }

    private buildingTileCoordinates(building: BuildingType): Vec2 {
      const buildings = {
        [BuildingType.Empty]: new Vec2(6 * this.tilesetTileSize, 10 * this.tilesetTileSize),
        [BuildingType.Mine]: new Vec2(0, 0),
        [BuildingType.Factory]: new Vec2(1 * this.tilesetTileSize, 2 * this.tilesetTileSize),
        [BuildingType.BeltDown]: new Vec2(3 * this.tilesetTileSize, 1 * this.tilesetTileSize),
      }
      return buildings[building];
    }

}
