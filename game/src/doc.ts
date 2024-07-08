import { querySelector, querySelectorAll } from "./utils";
import { createIcons, SkipBack, SkipForward, Play, Pause } from "lucide";

createIcons({
  icons: {
    SkipBack,
    SkipForward,
    Play,
    Pause,
  },
});

export enum Mode {
  Build = "build",
  Simulate = "simulate",
  Program = "program",
}

export let currentMode = Mode.Build;

// Drawer functionality
function setupDrawer(
  container: HTMLElement,
  handle: HTMLElement,
  left: boolean = false
) {
  let isOpen = false;

  handle.addEventListener("click", () => {
    isOpen = !isOpen;

    const openTranslation = "translateX(0)";
    const closedTranslation = left ? "translateX(-100%)" : "translateX(100%)";

    container.style.transform = isOpen ? openTranslation : closedTranslation;
  });
}

let buildDrawerContainer: HTMLElement = querySelector("#buildDrawerContainer");
let propertiesDrawerContainer: HTMLElement = querySelector(
  "#propertiesDrawerContainer"
);
let buildDrawerHandle: HTMLElement = querySelector("#buildDrawerHandle");
let propertiesDrawerHandle: HTMLElement = querySelector(
  "#propertiesDrawerHandle"
);

setupDrawer(buildDrawerContainer, buildDrawerHandle);
setupDrawer(propertiesDrawerContainer, propertiesDrawerHandle, true);

// Mode selector functionality
const modeButtons: HTMLElement[] = querySelectorAll(".mode-btn");
const timelineControls: HTMLElement = querySelector("#timelineControls");

function setActiveMode(mode: Mode) {
  modeButtons.forEach((btn) => {
    if (btn.dataset.mode === mode) {
      btn.classList.add("bg-blue-600", "text-white");
      btn.classList.remove("text-gray-300");
    } else {
      btn.classList.remove("bg-blue-600", "text-white");
      btn.classList.add("text-gray-300");
    }
  });
  currentMode = mode;
  timelineControls.style.display = mode === "simulate" ? "flex" : "none";
  console.log("Current mode:", mode);
}

modeButtons.forEach((btn) => {
  btn.addEventListener("click", () => setActiveMode(btn.dataset.mode as Mode));
});

// Set initial active mode
setActiveMode(currentMode);

// Timeline control functionality
const playPauseBtn: HTMLButtonElement = querySelector("#playPause");
const stepBackwardBtn: HTMLButtonElement = querySelector("#stepBackward");
const stepForwardBtn: HTMLButtonElement = querySelector("#stepForward");
const timelineSlider: HTMLInputElement = querySelector("#timelineSlider");

let isPlaying = false;

playPauseBtn.addEventListener("click", () => {
  isPlaying = !isPlaying;
  playPauseBtn
    .querySelector("#i")! // TODO: Type safe?
    .setAttribute("data-lucide", isPlaying ? "pause" : "play");
  console.log(isPlaying ? "Playing" : "Paused");
});

stepBackwardBtn.addEventListener("click", () => {
  console.log("Step backward");
  timelineSlider.value = Math.max(
    0,
    parseInt(timelineSlider.value) - 1
  ).toString();
});

stepForwardBtn.addEventListener("click", () => {
  console.log("Step forward");
  timelineSlider.value = Math.min(
    100,
    parseInt(timelineSlider.value) + 1
  ).toString();
});

timelineSlider.addEventListener("input", () => {
  console.log("Timeline position:", timelineSlider.value);
});

// BigInt input validation
function validateBigIntInput(input: HTMLInputElement) {
  input.addEventListener("input", function () {
    try {
      BigInt(this.value);
      this.classList.remove("border-red-500");
    } catch (error) {
      this.classList.add("border-red-500");
    }
  });
}

validateBigIntInput(querySelector("#xCoord"));
validateBigIntInput(querySelector("#yCoord"));
