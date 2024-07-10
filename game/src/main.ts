import "./style.css";
import "./doc";

import { Vec2 } from "./math";
import { BTN, Mouse } from "./mouse";
import { Rotation, allBuildings } from "./building";
import { Game } from "./game";
import { Renderer } from "./rendering/renderer";
import { RobotArm } from "./building/arm";
import { Item } from "./item";
import { querySelector } from "./utils";
import { MAP_SIZE } from "./consts";
import { Time } from "./time";
import init from "gb-noise";

export let isGbLoaded = false;
async function initGbNoise() {
  await init();

  isGbLoaded = true;
}

initGbNoise();

// Context setup
const canvas = querySelector<HTMLCanvasElement>("#gameCanvas");

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Cannot get 2d context");
}

const time = new Time();

const tileset = new Image();
tileset.src = "/tileset.png";

const renderer = new Renderer(ctx, tileset);

let mouse = new Mouse();
mouse.installTrackers(renderer);

const resizeCanvas = () => {
  const smallestDimension = Math.min(window.innerWidth, window.innerHeight);

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  renderer.tileSize = (smallestDimension * 0.75) / 8;
};

window.addEventListener("resize", (_ev) => {
  resizeCanvas();
});

resizeCanvas();

let initialRobotArm = new RobotArm();
Game.instance().buildings.push(initialRobotArm);
Game.instance().items.push(new Item());

// TODO: Temporary, we should a nullable object/enum in the future
let isBuilding = true;

function mainLoop() {
  time.update();

  renderer.clear();

  if (isGbLoaded) {
    // for (let x = 0; x < MAP_SIZE; x++) {
    //   for (let y = 0; y < MAP_SIZE; y++) {
    //     renderer.drawTile(new Vec2(x, y));
    //   }
    // }

    renderer.drawTerrain();
  }

  renderer.drawGrid(MAP_SIZE);

  // TEMP: Animation state
  let animState = Math.sin(time.ts) * 0.5 + 0.5;

  const game = Game.instance();

  for (const building of game.buildings) {
    building.drawReal(renderer, animState);
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

// Initial render
requestAnimationFrame(mainLoop);
