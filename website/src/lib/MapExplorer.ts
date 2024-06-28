import { createNoise2D, type NoiseFunction2D } from "simplex-noise";

export class MapExplorer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private tileSize: number = 32;
  private chunkSize: number = 8;
  private zoom: number = 1;
  private offsetX: number = 0;
  private offsetY: number = 0;
  private isPanning: boolean = false;
  private lastX: number = 0;
  private lastY: number = 0;
  private noise: NoiseFunction2D = createNoise2D();

  private zoomLevelElement: HTMLElement;
  private viewportPositionElement: HTMLElement;
  private showGrid: boolean = false;
  private currentLayer: string = "world";
  private isInteractive: boolean = true;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d")!;

    this.zoomLevelElement = document.getElementById("zoomLevel")!;
    this.viewportPositionElement = document.getElementById("viewportPosition")!;

    this.resizeCanvas();
    this.attachEventListeners();
    this.render();
    this.updateUI();
  }

  private resizeCanvas(): void {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  private attachEventListeners(): void {
    window.addEventListener("resize", () => this.resizeCanvas());
    this.canvas.addEventListener("wheel", (e) => this.handleZoom(e));
    this.canvas.addEventListener("mousedown", (e) => this.handlePanStart(e));
    this.canvas.addEventListener("mousemove", (e) => this.handlePanMove(e));
    this.canvas.addEventListener("mouseup", () => this.handlePanEnd());
  }

  private handleZoom(e: WheelEvent): void {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;

    // Calculate mouse position relative to the canvas
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Calculate world coordinates of the mouse position
    const worldX = this.offsetX + mouseX / this.zoom;
    const worldY = this.offsetY + mouseY / this.zoom;

    // Apply zoom
    const oldZoom = this.zoom;
    this.zoom *= zoomFactor;

    // Adjust offset to zoom towards mouse position
    this.offsetX = worldX - mouseX / this.zoom;
    this.offsetY = worldY - mouseY / this.zoom;

    this.render();
    this.updateUI();
  }

  private handlePanStart(e: MouseEvent): void {
    this.isPanning = true;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
  }

  private handlePanMove(e: MouseEvent): void {
    if (!this.isPanning) return;
    const dx = this.lastX - e.clientX;
    const dy = this.lastY - e.clientY;
    this.offsetX += dx / this.zoom;
    this.offsetY += dy / this.zoom;
    this.lastX = e.clientX;
    this.lastY = e.clientY;
    this.render();
    this.updateUI();
  }

  private handlePanEnd(): void {
    this.isPanning = false;
  }

  private getTileColor(x: number, y: number): string {
    const value = this.noise(x / 100, y / 100);
    const r = Math.floor((value + 1) * 127.5);
    const g = Math.floor((1 - value) * 127.5);
    const b = Math.floor(127.5);
    return `rgb(${r},${g},${b})`;
  }

  private render(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    const tilesX =
      Math.ceil(this.canvas.width / (this.tileSize * this.zoom)) + 1;
    const tilesY =
      Math.ceil(this.canvas.height / (this.tileSize * this.zoom)) + 1;

    for (let y = -1; y < tilesY; y++) {
      for (let x = -1; x < tilesX; x++) {
        const worldX = Math.floor(x + this.offsetX / this.tileSize);
        const worldY = Math.floor(y + this.offsetY / this.tileSize);
        const color = this.getTileColor(worldX, worldY);

        this.ctx.fillStyle = color;
        if (this.showGrid) {
          this.ctx.strokeStyle = "rgba(0, 0, 0, 1.0)";
        } else {
          this.ctx.strokeStyle = "transparent";
        }

        const tileX =
          x * this.tileSize * this.zoom -
          (this.offsetX % this.tileSize) * this.zoom;
        const tileY =
          y * this.tileSize * this.zoom -
          (this.offsetY % this.tileSize) * this.zoom;

        this.ctx.fillRect(
          tileX,
          tileY,
          this.tileSize * this.zoom,
          this.tileSize * this.zoom,
        );
      }
    }
  }

  public toggleGrid(): void {
    this.showGrid = !this.showGrid;
    this.render();
  }

  public setLayer(layer: string): void {
    this.currentLayer = layer;
    this.render();
  }

  public toggleInteractive(): void {
    this.isInteractive = !this.isInteractive;
    if (this.isInteractive) {
      this.attachEventListeners();
    } else {
      this.removeEventListeners();
    }
  }

  private removeEventListeners(): void {
    this.canvas.removeEventListener("wheel", this.handleZoom);
    this.canvas.removeEventListener("mousedown", this.handlePanStart);
    this.canvas.removeEventListener("mousemove", this.handlePanMove);
    this.canvas.removeEventListener("mouseup", this.handlePanEnd);
  }

  private updateUI(): void {
    this.zoomLevelElement.textContent = `Zoom: ${this.zoom.toFixed(2)}x`;
    this.viewportPositionElement.textContent = `Position: (${Math.round(this.offsetX)}, ${Math.round(this.offsetY)})`;
  }
}
