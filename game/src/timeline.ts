import { BuildingType } from "./building";
import { Building } from "./building";
import { Game } from "./game";
import { CYCLE_STEPS } from "./game";
import { Vec2 } from "./math";

function createStepCheckbox(cycleStep: number, pos: Vec2): HTMLInputElement {
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.checked = true;
  checkbox.style.margin = "0 2px";
  checkbox.dataset.step = cycleStep.toString();
  
  if (cycleStep === Game.instance().currentStep) {
    checkbox.classList.add("current-step");
  }
  
  checkbox.addEventListener("change", (e) => {
    const building = Game.instance().buildings.find(
      (b: Building) => b.gridPos().x === pos.x && b.gridPos().y === pos.y
    );
    if (building) {
      building.cycles[cycleStep] = (e.target as HTMLInputElement).checked;
    }
  });

  return checkbox;
}

export function updateTimelineTracks(buildingType: BuildingType, pos: Vec2): void {
  const timelineTracks = document.getElementById("timelineTracks");
  if (!timelineTracks) return;

  let group = timelineTracks.querySelector(`[data-type="${buildingType}"]`) as HTMLElement | null;
  if (!group) {
    group = document.createElement("div");
    group.className = "flex flex-col";
    group.innerHTML = buildingType;
    group.dataset.type = buildingType;
    timelineTracks.appendChild(group);
  }

  const buildingName = `${buildingType}-${pos.x}-${pos.y}`;

  const buildingItem = document.createElement("div");
  buildingItem.dataset.pos = `${pos.x}-${pos.y}`;
  buildingItem.className = "building-item flex flex-row";
  buildingItem.innerHTML = `<div class="max-w-18">${buildingName}</div>`;
  const checkboxesContainer = document.createElement("div");
  checkboxesContainer.className = "flex flex-row";

  for (let i = 0; i < CYCLE_STEPS; i++) {
    const checkboxDiv = document.createElement("div");
    checkboxDiv.appendChild(createStepCheckbox(i, pos));
    checkboxesContainer.appendChild(checkboxDiv);
  }
  
  buildingItem.appendChild(checkboxesContainer);
  timelineTracks.appendChild(buildingItem);

  // Sort the building items by their position
  const buildingItems = Array.from(group.querySelectorAll('.building-item')) as HTMLElement[];
  buildingItems.sort((a, b) => {
    const [aX, aY] = a.dataset.pos!.split('-').map(Number);
    const [bX, bY] = b.dataset.pos!.split('-').map(Number);
    if (aX !== bX) return aX - bX;
    return aY - bY;
  });
  // group.innerHTML = '';
  buildingItems.forEach(item => timelineTracks.appendChild(item));
}

export function removeFromTimelineTracks(buildingType: BuildingType, pos: Vec2): void {
  const timelineTracks = document.getElementById("timelineTracks");
  if (!timelineTracks) return;

  const group = timelineTracks.querySelector(`[data-type="${buildingType}"]`) as HTMLElement | null;
  if (!group) return;

  const posString = `${pos.x}-${pos.y}`;
  const buildingItem = group.querySelector(`.building-item[data-pos="${posString}"]`);
  if (buildingItem) {
    group.removeChild(buildingItem);
  }
}

export function updateTimelineHighlight() {
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  allCheckboxes.forEach((checkbox: Element) => {
    const step = parseInt((checkbox as HTMLInputElement).dataset.step || "0");
    if (step === Game.instance().currentStep) {
      checkbox.classList.add("current-step");
    } else {
      checkbox.classList.remove("current-step");
    }
  });
}
