import { Vec2 } from "./math";
import { Renderer } from "./rendering/renderer";
import { xCoord, yCoord } from "./doc";
import { MAP_SIZE } from "./consts";
import {
  Resource,
  tile_noise,
  tile_resources,
  TileNoise,
  TileResources,
} from "gb-noise";

type NoiseCached = { noise: TileNoise; resources: TileResources };

export class TerrainRenderer {
  public tileSize = 90;

  // TODO: Cache based on map chunks not single tiles
  private cache: Map<string, NoiseCached> = new Map();

  public render(renderer: Renderer) {
    const tileOffset = new Vec2(10, 10);
    const biggestDimension = Math.max(
      renderer.ctx.canvas.width,
      renderer.ctx.canvas.height,
    );
    const numTilesOnCanvas = biggestDimension / renderer.tileSize;

    // let startTile = tileOffset.sub(new Vec2(numTilesOnCanvas / 2, numTilesOnCanvas / 2));
    let startTile = tileOffset.neg();

    let endTile = startTile
      .add(new Vec2(numTilesOnCanvas, numTilesOnCanvas))
      .add(Vec2.ONE);

    for (let x = startTile.x; x < endTile.x; x++) {
      for (let y = startTile.y; y < endTile.y; y++) {
        this.drawTile(renderer, new Vec2(x, y));
      }
    }
  }

  public drawTile(
    renderer: Renderer,
    // tile position
    pos: Vec2,
  ) {
    const xOffset = xCoord * BigInt(MAP_SIZE);
    const yOffset = yCoord * BigInt(MAP_SIZE);

    const x = xOffset + BigInt(pos.x);
    const y = yOffset + BigInt(pos.y);

    let cacheKey = `${x}:${y}`;

    const cached = this.cache.get(cacheKey);
    let noise: TileNoise;
    let resources: TileResources;

    if (cached !== undefined) {
      noise = cached.noise;
      resources = cached.resources;
    } else {
      console.log(`Cache miss at x: ${x}, y: ${y} - recalculating tile values`);

      noise = tile_noise(xOffset + BigInt(pos.x), yOffset + BigInt(pos.y));
      resources = tile_resources(noise);

      this.cache.set(cacheKey, { noise, resources });
    }

    let v = noise.biome;

    let grass = new Vec2(12, 2);
    let dirt = new Vec2(16, 2);
    if (v > 0.5) {
      renderer.drawSprite(pos.mul(this.tileSize), dirt);
    } else {
      renderer.drawSprite(pos.mul(this.tileSize), grass);
    }

    let carbon = new Vec2(11, 8);
    if (resources.resource === Resource.Carbon) {
      renderer.drawSprite(pos.mul(this.tileSize), carbon);
    }
  }
}
