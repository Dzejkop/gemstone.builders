import "./style.css";
import "./doc";

import { Vec2 } from "./math";
import { BTN, Mouse } from "./mouse";
import { BuildingType, Rotation, allBuildings } from "./building";
import { Game } from "./game";
import { Renderer } from "./rendering/renderer";
import { RobotArm } from "./building/arm";
import { Item } from "./item";
import { querySelector } from "./utils";
import { MAP_SIZE } from "./consts";
import { Time } from "./time";

// Context setup
const canvas = querySelector<HTMLCanvasElement>("#gameCanvas");

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Cannot get 2d context");
}

let mouse = new Mouse();
mouse.installTrackers(canvas);

const time = new Time();

const tileset = new Image();
tileset.src = "/tileset.png";

const renderer = new Renderer(ctx, tileset);

const resizeCanvas = () => {
  const smallestDimension = Math.min(window.innerWidth, window.innerHeight);

  // TODO: Smarter?
  //       we need to figure the space needed for other UI elements and resize according to that
  const size = smallestDimension * 0.7;
  const closestMultileOf8 = Math.floor(size / 8) * 8;

  canvas.width = closestMultileOf8;
  canvas.height = closestMultileOf8;
  renderer.tileSize = canvas.width / 8;
};

window.addEventListener("resize", (_ev) => {
  resizeCanvas();
});

resizeCanvas();

const game = new Game();

let initialRobotArm = new RobotArm();
game.buildings.push(initialRobotArm);

game.items.push(new Item())

// TODO: Temporary, we should a nullable object/enum in the future
let isBuilding = true;

function mainLoop() {
  time.update();

  renderer.clear();

  renderer.drawGrid(MAP_SIZE);

  // TEMP: Animation state
  let animState = Math.sin(time.ts) * 0.5 + 0.5;

  for (const building of game.buildings) {
    building.drawReal(renderer, animState);
  }

  if (isBuilding) {
    const tilePos = mouse.pos.div(renderer.tileSize).floor();

    const realPos = tilePos.mul(renderer.tileSize);

    if (game.isValidPosition(tilePos)) {
      // TODO: Tint with transparency somehow
      allBuildings[BuildingType.RobotArm].drawGhost(renderer, tilePos, {
        armFlipped: false,
        rotation: Rotation.Up,
      });

      if (mouse.btnClick[BTN.LEFT]) {
        game.buildings.push(new RobotArm(tilePos));
      }
    } else {
      // TODO: Better highlight
      renderer.drawSprite(realPos, Vec2.ONE);
    }
  }

  mouse.reset();

  // TODO: Limit FPS?
  requestAnimationFrame(mainLoop);
}

// Initial render
requestAnimationFrame(mainLoop);
