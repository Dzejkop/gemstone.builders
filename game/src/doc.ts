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
import { BuildingType } from "./building";
import { Game } from "./game";

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

function renderBuildingList(buildingsList: HTMLElement) {
  for (const buildingName of Object.values(BuildingType)) {
    let building = createBuildingMenuItem(buildingsList, buildingName);
    buildingsList.appendChild(building);
  }
}

function createBuildingMenuItem(
  buildingsList: HTMLElement,
  buildingName: string
): HTMLElement {
  let building = document.createElement("div");
  building.className =
    "flex items-center justify-center bg-gray-700 aspect-square rounded-md cursor-pointer";
  building.textContent = buildingName;
  building.addEventListener("click", () => {
    const selected = buildingName as BuildingType;
    deselectAllBuildings(buildingsList);
    const game = Game.instance();
    if (game.selectedBuilding == selected) {
      game.selectBuilding(null);
    } else {
      building.classList.add("bg-red-500");
      game.selectBuilding(selected);
    }
  });

  return building;
}

function deselectAllBuildings(buildingsList: HTMLElement) {
  for (const child of buildingsList.children) {
    child.classList.remove("bg-red-500");
  }
}

export class GameDoc {
  public currentMode: Mode = Mode.Build;

  private buildDrawerContainer: HTMLElement;
  private leftDrawerContainer: HTMLElement;
  private buildDrawerHandle: HTMLElement;
  private leftDrawerHandle: HTMLElement;

  private playPauseBtn: HTMLButtonElement;
  private stepBackwardBtn: HTMLButtonElement;
  private stepForwardBtn: HTMLButtonElement;
  private recordBtn: HTMLButtonElement;
  private timelineSlider: HTMLInputElement;
  private playPausePlayIcon: HTMLElement;
  private playPausePauseIcon: HTMLElement;
  private recordStartIcon: HTMLElement;
  private recordStopIcon: HTMLElement;

  public isPlaying = false;
  public isRecording = false;

  public xCoord = BigInt(0);
  public yCoord = BigInt(0);

  constructor() {
    this.buildDrawerContainer = querySelector("#buildDrawerContainer");
    this.leftDrawerContainer = querySelector("#leftDrawerContainer");
    this.buildDrawerHandle = querySelector("#buildDrawerHandle");
    this.leftDrawerHandle = querySelector("#leftDrawerHandle");

    setupDrawer(this.buildDrawerContainer, this.buildDrawerHandle);
    setupDrawer(this.leftDrawerContainer, this.leftDrawerHandle, true);

    // Timeline control functionality
    this.playPauseBtn = querySelector("#playPause");
    this.stepBackwardBtn = querySelector("#stepBackward");
    this.stepForwardBtn = querySelector("#stepForward");
    this.recordBtn = querySelector("#record");
    this.timelineSlider = querySelector("#timelineSlider");
    this.playPausePlayIcon = querySelector("#playPause > #start");
    this.playPausePauseIcon = querySelector("#playPause > #stop");
    this.recordStartIcon = querySelector("#record > #start");
    this.recordStopIcon = querySelector("#record > #stop");

    this.playPauseBtn.addEventListener("click", () => {
      this.isPlaying = !this.isPlaying;

      if (this.isPlaying) {
        this.playPausePlayIcon.classList.add("hidden");
        this.playPausePauseIcon.classList.remove("hidden");
      } else {
        this.playPausePlayIcon.classList.remove("hidden");
        this.playPausePauseIcon.classList.add("hidden");
      }
    });

    this.recordBtn.addEventListener("click", () => {
      this.isRecording = !this.isRecording;

      if (this.isRecording) {
        this.recordStartIcon.classList.add("hidden");
        this.recordStopIcon.classList.remove("hidden");
      } else {
        this.recordStartIcon.classList.remove("hidden");
        this.recordStopIcon.classList.add("hidden");
      }
    });

    this.stepBackwardBtn.addEventListener("click", () => {
      console.log("Step backward");
      this.timelineSlider.value = Math.max(
        0,
        parseInt(this.timelineSlider.value) - 1
      ).toString();
    });

    this.stepForwardBtn.addEventListener("click", () => {
      console.log("Step forward");
      this.timelineSlider.value = Math.min(
        100,
        parseInt(this.timelineSlider.value) + 1
      ).toString();
    });

    this.timelineSlider.addEventListener("input", () => {
      console.log("Timeline position:", this.timelineSlider.value);
    });

    const xCoordElem: HTMLInputElement = querySelector("#xCoord");
    const yCoordElem: HTMLInputElement = querySelector("#yCoord");

    const validateCoordInputs = () => {
      try {
        this.xCoord = BigInt(xCoordElem.value);
        xCoordElem.classList.remove("border-red-500");
      } catch (error) {
        xCoordElem.classList.add("border-red-500");
      }
      try {
        this.yCoord = BigInt(yCoordElem.value);
        yCoordElem.classList.remove("border-red-500");
      } catch (error) {
        yCoordElem.classList.add("border-red-500");
      }
    };

    validateCoordInputs();
    xCoordElem.addEventListener("input", () => validateCoordInputs());
    yCoordElem.addEventListener("input", () => validateCoordInputs());

    // Build menu
    let buildingsList = querySelector("#buildDrawer div") as HTMLElement;
    renderBuildingList(buildingsList);
  }
}
