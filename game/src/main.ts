import "./style.css";

import { Vec2 } from "./math";
import { BTN, Mouse } from "./mouse";

const canvas = document.getElementById("gameCanvas");

const startTime = Date.now();

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

const tileset = new Image();
tileset.src = "/tileset.png";
tileset.style.imageRendering = "pixelated";

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
window.addEventListener("resize", (ev) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let destX = 0;
let destY = 0;

// TODO: Add types
const floatingInfoWindow: any = document.getElementById("floatingInfoWindow");
const infoTitle: any = document.getElementById("infoTitle");
const infoDescription: any = document.getElementById("infoDescription");

// TODO: Add types
function showFloatingInfo(x: any, y: any, title: any, description: any) {
  infoTitle.textContent = title;
  infoDescription.textContent = description;

  // Position the window
  const windowWidth = floatingInfoWindow.offsetWidth;
  const windowHeight = floatingInfoWindow.offsetHeight;
  const canvasRect = canvas?.getBoundingClientRect()!;

  // Ensure the window doesn't go off-screen
  let posX = x + canvasRect.left;
  let posY = y + canvasRect.top;

  if (posX + windowWidth > window.innerWidth) {
    posX = window.innerWidth - windowWidth - 10;
  }
  if (posY + windowHeight > window.innerHeight) {
    posY = window.innerHeight - windowHeight - 10;
  }

  floatingInfoWindow.style.left = `${posX}px`;
  floatingInfoWindow.style.top = `${posY}px`;

  // Show the window
  floatingInfoWindow.style.display = "block";
}

function hideFloatingInfo() {
  floatingInfoWindow.style.display = "none";
}

const render = () => {
  destX = mouse.pos.x - 16 / 2;
  destY = mouse.pos.y - 16 / 2;

  const spriteWidth = 128;
  const spriteHeight = 128;

  // Save the current state
  ctx.imageSmoothingEnabled = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let tileSize = 64;
  let xTiles = canvas.width / tileSize;
  let yTiles = canvas.height / tileSize;

  // TODO: Draw lines instead of rects
  for (let x = 0; x < xTiles; x++) {
    for (let y = 0; y < yTiles; y++) {
      // random looking offsets
      let xOff = (x + x * 7 + y * 91) % 2;
      let yOff = (y + y * 7 + x * 13) % 2;
      ctx.drawImage(
        tileset,
        (12 + xOff) * 16,
        (2 + yOff) * 16,
        16,
        16,
        x * tileSize,
        y * tileSize,
        tileSize,
        tileSize
      );
    }
  }

  ctx.save();

  // Move the origin to the center of the image to rotate around its center
  ctx.translate(destX + 16 / 2, destY + 16 / 2);
  let t = Date.now() - startTime;

  const radiansPerSecond = Math.PI / 2.0;
  const seconds = t / 1000.0;

  ctx.rotate(seconds * radiansPerSecond);

  // Draw the image, adjusting the draw position since we've translated the context
  ctx.drawImage(
    tileset, // Source image
    16,
    16, // Source X and Y in the tileset
    16,
    16, // Width and height of the source tile
    -spriteWidth / 2,
    -spriteHeight / 2, // Adjusted destination X and Y on the canvas
    spriteWidth,
    spriteHeight // Width and height to draw on the canvas
  );

  // Restore the original state
  ctx.restore();

  ctx.fillStyle = "none";
  ctx.strokeStyle = "#00000020";
  ctx.lineWidth = 3;

  // Draw grid
  for (let x = 0; x < xTiles; x++) {
    for (let y = 0; y < yTiles; y++) {
      ctx.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    }
  }

  const mouseTileX = Math.floor(mouse.pos.x / tileSize);
  const mouseTileY = Math.floor(mouse.pos.y / tileSize);

  // highlight tile
  ctx.fillStyle = "#ffffff20";
  ctx.fillRect(
    mouseTileX * tileSize,
    mouseTileY * tileSize,
    tileSize,
    tileSize
  );

  // TEMP: Just for testing
  if (mouse.btnDown[BTN.LEFT]) {
    showFloatingInfo(
      (mouseTileX + 1.5) * tileSize,
      mouseTileY * tileSize,
      "Tile",
      "Description"
    );
  } else {
    hideFloatingInfo();
  }

  // Reset the click state
  mouse.btnClick = [false, false, false];

  // Request the next frame
  requestAnimationFrame(render);
};

console.log("Start");
requestAnimationFrame(render);
