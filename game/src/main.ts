import "./style.css";

import { Vec2 } from "./math";
import { BTN, Mouse } from "./mouse";
import { BuildingType } from "./building";
import { Game } from "./game";
import { Renderer } from "./renderer";

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
  const maxSize = Math.min(window.innerWidth, window.innerHeight);

  const size = maxSize * 0.8;
  const closestMultileOf8 = Math.floor(size / 8) * 8;

  canvas.width = closestMultileOf8;
  canvas.height = closestMultileOf8;
  renderer.tileSize = canvas.width / 8;
}

window.addEventListener("resize", (_ev) => {
  console.log("resize");
  resizeCanvas();
});

resizeCanvas();


// Game setup
const game = new Game(8, 8);
game.build(BuildingType.Mine, 0, 0);
game.build(BuildingType.BeltDown, 1, 0);
game.build(BuildingType.Factory, 2, 0);


function mainLoop() {
  renderer.render(game);

  if (mouse.btnClick[BTN.LEFT]) {
    const x = mouse.pos.x;
    const y = mouse.pos.y;

    const col = Math.floor(x / renderer.tileSize);
    const row = Math.floor(y / renderer.tileSize);

    game.build(BuildingType.Mine, row, col); // TODO: build selected building
  }

  mouse.reset();

  // TODO: Limit FPS?
  requestAnimationFrame(mainLoop);
}

// Initial render
requestAnimationFrame(mainLoop);
