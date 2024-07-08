import { querySelector } from "./utils";
import {
  createIcons,
  SkipBack,
  SkipForward,
  Play,
  Pause,
  Circle,
  CircleDot,
} from "lucide";

createIcons({
  icons: {
    SkipBack,
    SkipForward,
    Play,
    Pause,
    Circle,
    CircleDot,
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
  let isOpen = true;

  const openTranslation = "translateX(0)";
  const closedTranslation = left ? "translateX(-100%)" : "translateX(100%)";

  const update = () => {
    container.style.transform = isOpen ? openTranslation : closedTranslation;
  };

  update();

  handle.addEventListener("click", () => {
    isOpen = !isOpen;
    update();
  });
}

let buildDrawerContainer: HTMLElement = querySelector("#buildDrawerContainer");
let leftDrawerContainer: HTMLElement = querySelector("#leftDrawerContainer");
let buildDrawerHandle: HTMLElement = querySelector("#buildDrawerHandle");
let leftDrawerHandle: HTMLElement = querySelector("#leftDrawerHandle");

setupDrawer(buildDrawerContainer, buildDrawerHandle);
setupDrawer(leftDrawerContainer, leftDrawerHandle, true);

// Mode selector functionality
// const timelineControls: HTMLElement = querySelector("#timelineControls");

// Timeline control functionality
const playPauseBtn: HTMLButtonElement = querySelector("#playPause");
const stepBackwardBtn: HTMLButtonElement = querySelector("#stepBackward");
const stepForwardBtn: HTMLButtonElement = querySelector("#stepForward");
const recordBtn: HTMLButtonElement = querySelector("#record");
const timelineSlider: HTMLInputElement = querySelector("#timelineSlider");

const playPausePlayIcon: HTMLElement = querySelector("#playPause > #start");
const playPausePauseIcon: HTMLElement = querySelector("#playPause > #stop");

const recordStartIcon: HTMLElement = querySelector("#record > #start");
const recordStopIcon: HTMLElement = querySelector("#record > #stop");

export let isPlaying = false;
export let isRecording = false;

playPauseBtn.addEventListener("click", () => {
  isPlaying = !isPlaying;

  if (isPlaying) {
    playPausePlayIcon.classList.add("hidden");
    playPausePauseIcon.classList.remove("hidden");
  } else {
    playPausePlayIcon.classList.remove("hidden");
    playPausePauseIcon.classList.add("hidden");
  }
});

recordBtn.addEventListener("click", () => {
  isRecording = !isRecording;

  if (isRecording) {
    recordStartIcon.classList.add("hidden");
    recordStopIcon.classList.remove("hidden");
  } else {
    recordStartIcon.classList.remove("hidden");
    recordStopIcon.classList.add("hidden");
  }
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

const xCoordElem: HTMLInputElement = querySelector("#xCoord");
const yCoordElem: HTMLInputElement = querySelector("#yCoord");
export let xCoord = BigInt(0);
export let yCoord = BigInt(0);

// BigInt input validation
const validateCoordInputs = () => {
  try {
    xCoord = BigInt(xCoordElem.value);
    xCoordElem.classList.remove("border-red-500");
  } catch (error) {
    xCoordElem.classList.add("border-red-500");
  }
  try {
    yCoord = BigInt(yCoordElem.value);
    yCoordElem.classList.remove("border-red-500");
  } catch (error) {
    yCoordElem.classList.add("border-red-500");
  }
};

validateCoordInputs();
xCoordElem.addEventListener("input", () => validateCoordInputs());
yCoordElem.addEventListener("input", () => validateCoordInputs());
