import { MAP_SIZE } from "../consts";
import { xCoord, yCoord } from "../doc";
import { Vec2 } from "../math";
import { tile } from "gb-noise";

export class Renderer {
  public tileSize = 90;
  public readonly tilesetTileSize = 16;

  constructor(
    public readonly ctx: CanvasRenderingContext2D,
    public readonly tileset: HTMLImageElement,
  ) {}

  public clear() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.ctx.imageSmoothingEnabled = false;
  }

  // Offset that puts the center of the tile map in the middle of the screen
  offset(): Vec2 {
    let canvasOffset = new Vec2(
      this.ctx.canvas.width / 2,
      this.ctx.canvas.height / 2,
    );
    let mapOffset = new Vec2(
      (MAP_SIZE * this.tileSize) / 2,
      (MAP_SIZE * this.tileSize) / 2,
    );

    return canvasOffset.sub(mapOffset);
  }

  public drawGrid(gridSize: number): void {
    const offset = this.offset();

    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 1;

    // Draw grid lines
    for (let row = 0; row < gridSize; row++) {
      this.ctx.beginPath();
      this.ctx.moveTo(offset.x, row * this.tileSize + offset.y);
      this.ctx.lineTo(
        this.tileSize * gridSize + offset.x,
        row * this.tileSize + offset.y,
      );
      this.ctx.stroke();
    }

    for (let col = 0; col < gridSize; col++) {
      this.ctx.beginPath();
      this.ctx.moveTo(col * this.tileSize + offset.x, offset.y);
      this.ctx.lineTo(
        col * this.tileSize + offset.x,
        this.tileSize * gridSize + offset.y,
      );
      this.ctx.stroke();
    }

    // Draw border
    this.ctx.beginPath();
    this.ctx.strokeStyle = "black";
    this.ctx.lineWidth = 4;
    this.ctx.moveTo(offset.x, offset.y);
    this.ctx.lineTo(this.tileSize * gridSize + offset.x, offset.y);
    this.ctx.lineTo(
      this.tileSize * gridSize + offset.x,
      this.tileSize * gridSize + offset.y,
    );
    this.ctx.lineTo(offset.x, this.tileSize * gridSize + offset.y);
    this.ctx.lineTo(offset.x, offset.y);
    this.ctx.stroke();
  }

  public drawTerrain() {
    const offset = this.offset();
    const tileOffset = offset.div(this.tileSize).ceil();
    const biggestDimension = Math.max(
      this.ctx.canvas.width,
      this.ctx.canvas.height,
    );
    const numTilesOnCanvas = biggestDimension / this.tileSize;

    // let startTile = tileOffset.sub(new Vec2(numTilesOnCanvas / 2, numTilesOnCanvas / 2));
    let startTile = tileOffset.neg();

    let endTile = startTile.add(new Vec2(numTilesOnCanvas, numTilesOnCanvas));

    for (let x = startTile.x; x < endTile.x; x++) {
      for (let y = startTile.y; y < endTile.y; y++) {
        this.drawTile(new Vec2(x, y));
      }
    }
  }

  public drawTile(
    // tile position
    pos: Vec2,
  ) {
    const xOffset = xCoord * BigInt(MAP_SIZE);
    const yOffset = yCoord * BigInt(MAP_SIZE);

    let v = tile(xOffset + BigInt(pos.x), yOffset + BigInt(pos.y));
    v = (v + 1.0) / 2.0; // map from [-1, 1] to [0, 1]

    let grass = new Vec2(12, 2);
    let dirt = new Vec2(16, 2);
    if (v > 0.5) {
      this.drawSprite(pos.mul(this.tileSize), dirt);
    } else {
      this.drawSprite(pos.mul(this.tileSize), grass);
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
    anchor: Vec2 = new Vec2(0.5, 0.5),
  ) {
    let offset = this.offset();

    this.ctx.save();
    this.ctx.translate(
      offset.x + pos.x + anchor.x * this.tileSize,
      offset.y + pos.y + anchor.y * this.tileSize,
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
      spriteSize.y * this.tileSize,
    );
    this.ctx.restore();
  }
}
