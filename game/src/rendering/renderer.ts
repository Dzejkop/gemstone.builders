import { Vec2 } from "../math";

export class Renderer {
  public tileSize = 90;
  public readonly tilesetTileSize = 16;

  constructor(
    public readonly ctx: CanvasRenderingContext2D,
    public readonly tileset: HTMLImageElement
  ) {}

  public clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.imageSmoothingEnabled = false;
  }

  public drawGrid(gridSize: number): void {
    // Draw grid lines
    for (let row = 0; row < gridSize; row++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, row * this.tileSize);
      this.ctx.lineTo(this.tileSize * gridSize, row * this.tileSize);
      this.ctx.stroke();
    }

    for (let col = 0; col < gridSize; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(col * this.tileSize, 0);
      this.ctx.lineTo(col * this.tileSize, this.tileSize * gridSize);
      this.ctx.stroke();
    }
  }

  public drawSprite(
    // pixel position
    pos: Vec2,
    // sprite coordinates in the tileset (in tiles)
    spriteCoords: Vec2,
    // Sprite size (in tiles)
    spriteSize: Vec2 = new Vec2(1, 1),
    rotation: number = 0.0,
    // The anchor along which rotation happens
    // In relative values
    // By default it's the middle of a 16x16 tile
    anchor: Vec2 = new Vec2(0.5, 0.5)
  ) {
    this.ctx.save();
    this.ctx.translate(
      pos.x + anchor.x * this.tileSize,
      pos.y + anchor.y * this.tileSize
    );
    this.ctx.rotate(rotation);
    this.ctx.drawImage(
      this.tileset,
      spriteCoords.x * this.tilesetTileSize,
      spriteCoords.y * this.tilesetTileSize,
      spriteSize.x * this.tilesetTileSize,
      spriteSize.y * this.tilesetTileSize,
      -anchor.x * this.tileSize,
      -anchor.y * this.tileSize,
      spriteSize.x * this.tileSize,
      spriteSize.y * this.tileSize
    );
    this.ctx.restore();
  }
}