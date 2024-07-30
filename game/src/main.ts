import "./style.css";
import "./doc";

import { Vec2 } from "./math";
import { BTN, Mouse } from "./mouse";
import { Building, Rotation, allBuildings } from "./building";
import { Game } from "./game";
import { Renderer } from "./rendering/renderer";
import { Item } from "./item";
import { querySelector } from "./utils";
import { MAP_SIZE } from "./consts";
import { Time } from "./time";
import init from "gb-noise";
import { TerrainRenderer } from "./terrain";
import { Keyboard } from "./keyboard";
import { GameDoc } from "./doc";
import { TrackRenderer } from "./rendering/trackRenderer";

// Context setup
const canvas = querySelector<HTMLCanvasElement>("#gameCanvas");

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Cannot get 2d context");
}

const doc = new GameDoc();
const time = new Time();

const tileset = new Image();
tileset.src = "/tileset.png";

const trackContainer = querySelector("#timelineTracks") as HTMLElement;

const renderer = new Renderer(ctx, tileset);
const trackRenderer = new TrackRenderer(trackContainer);
const terrainRenderer = new TerrainRenderer();

let mouse = new Mouse();
mouse.installListeners(renderer);

let keyboard = new Keyboard();
keyboard.installListeners();

const resizeCanvas = () => {
  const smallestDimension = Math.min(window.innerWidth, window.innerHeight);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer.tileSize = (smallestDimension * 0.75) / 8;
  terrainRenderer.tileSize = (smallestDimension * 0.75) / 8;
};

window.addEventListener("resize", (_ev) => {
  resizeCanvas();
});

resizeCanvas();

const slotSize = renderer.tileSize * 8;

let canvasXOffset = (renderer.ctx.canvas.width / 2) - (slotSize / 2);
let canvasYOffset = (renderer.ctx.canvas.height / 2) - (slotSize / 2);
renderer.camera.pos = new Vec2(-canvasXOffset, -canvasYOffset);

Game.instance().items.push(new Item());

// TODO: Temporary, we should a nullable object/enum in the future
let isBuilding = true;

async function main() {
  await init();

  // Initial render
  requestAnimationFrame(mainLoop);
}

function mainLoop() {
  time.update();

  renderer.clear();
  trackRenderer.clear();

  terrainRenderer.render(doc, renderer);
  renderer.drawGrid(MAP_SIZE);

  // TEMP: Animation state
  let animState = Math.sin(time.ts) * 0.5 + 0.5;

  const game = Game.instance();

  for (const building of game.buildings) {
    building.drawReal(renderer, animState);
    building.drawTrack(trackRenderer);
  }

  const translateSpeed = 1000.0;
  if (keyboard.isKeyDown("d")) {
    renderer.camera.pos = renderer.camera.pos.add(
      Vec2.RIGHT.mul(time.dts * translateSpeed)
    );
  }

  if (keyboard.isKeyDown("a")) {
    renderer.camera.pos = renderer.camera.pos.add(
      Vec2.LEFT.mul(time.dts * translateSpeed)
    );
  }

  if (keyboard.isKeyDown("w")) {
    renderer.camera.pos = renderer.camera.pos.add(
      Vec2.UP.mul(time.dts * translateSpeed)
    );
  }

  if (keyboard.isKeyDown("s")) {
    renderer.camera.pos = renderer.camera.pos.add(
      Vec2.DOWN.mul(time.dts * translateSpeed)
    );
  }

  if (isBuilding) {
    const tilePos = mouse.pos.div(renderer.tileSize).floor();

    const realPos = tilePos.mul(renderer.tileSize);

    if (game.selectedBuilding !== null) {
      if (game.isValidPosition(tilePos)) {
        // TODO: Tint with transparency somehow

        allBuildings[game.selectedBuilding].drawGhost(renderer, tilePos, {
          armFlipped: false,
          rotation: Rotation.Up,
        });

        if (mouse.btnClick[BTN.LEFT]) {
          game.build(tilePos);
        }
      } else {
        // TODO: Better highlight
        renderer.drawSprite(realPos, Vec2.ONE);
      }
    }
  }

  mouse.reset();

  // TODO: Limit FPS?
  requestAnimationFrame(mainLoop);
}

main();
