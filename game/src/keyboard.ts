export class Keyboard {
  private keyDown: Map<string, boolean> = new Map();

  public installListeners() {
    document.addEventListener("keydown", (event) => {
      this.keyDown.set(event.key, true);
    });

    document.addEventListener("keyup", (event) => {
      this.keyDown.set(event.key, false);
    });
  }

  public isKeyDown(key: string): boolean {
    return this.keyDown.get(key) ?? false;
  }
}
