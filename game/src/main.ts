import "./style.css";

import { Vec2 } from "./math";
import { BTN, Mouse } from "./mouse";
import { Building } from "./building";
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
window.addEventListener("resize", (_ev) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.width = 720; // 8 * renderer.tileSize;
canvas.height = 720; // TODO: move tileSize to a config or calculate dynamically based on device size

const tileset = new Image();
tileset.src = "/tileset.png";
tileset.style.imageRendering = "pixelated";

tileset.onload = function () {
  canvas.addEventListener("click", handleCanvasClick);
};

// Game setup
const game = new Game(8, 8);
game.build(Building.Mine, 0, 0);
game.build(Building.BeltDown, 1, 0);
game.build(Building.Factory, 2, 0);

const renderer = new Renderer(ctx, tileset);

function render() {
  renderer.render(game);
  // TODO: for build mode don't set any delay between renders
  // TODO: for simulate mode add 1s delay
  // TODO: for execution mode, delay is the time it takes for the local prover to return the result
  requestAnimationFrame(render);
}

// Initial render
requestAnimationFrame(render);

function handleCanvasClick(event: { clientX: number; clientY: number; }) {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const col = Math.floor(x / renderer.tileSize);
  const row = Math.floor(y / renderer.tileSize);

  game.build(Building.Mine, row, col); // TODO: build selected building
}
