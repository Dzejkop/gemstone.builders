import "./style.css";

import { Vec2 } from "./math";
import { BTN, Mouse } from "./mouse";
import { BuildingType, Rotation, allBuildings } from "./building";
import { Game } from "./game";
import { Renderer } from "./rendering/renderer";
import { RobotArm } from "./building/arm";
import { Item } from "./item";

// Context setup
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

if (!canvas) {
  throw new Error("Cannot find canvas element");
}

if (!(canvas instanceof HTMLCanvasElement)) {
  throw new Error("Element is not a canvas");
}

const ctx = canvas.getContext("2d");

if (!ctx) {
  throw new Error("Cannot get 2d context");
}

ctx.imageSmoothingEnabled = false;

let mouse = new Mouse();

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  mouse.pos = new Vec2(mouseX, mouseY);
});

// Mouse button state
canvas.addEventListener("mousedown", (event) => {
  mouse.btnDown[event.button] = true;
});
canvas.addEventListener("mouseup", (event) => {
  mouse.btnDown[event.button] = false;
});
canvas.addEventListener("click", (event) => {
  mouse.btnClick[event.button] = true;
});

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
initialRobotArm.heldItem = new Item();
game.buildings.push(initialRobotArm);

// TODO: Temporary, we should a nullable object/enum in the future
let isBuilding = true;

const startTime = Date.now();
let lastTime = Date.now();

function mainLoop() {
  const currentTime = Date.now();

  lastTime = currentTime;
  let t = currentTime - startTime;
  let ts = t / 1000.0;

  renderer.clear();

  renderer.drawGrid(8);

  // TEMP: Animation state
  let animState = Math.sin(ts) * 0.5 + 0.5;

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
