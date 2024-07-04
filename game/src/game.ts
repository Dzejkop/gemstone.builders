import { Building } from './building';

export class Game {
    private buildings: Array<Building>;

    constructor(public readonly rows: number, public readonly cols: number) {
        this.buildings = new Array<Building>(rows * cols).fill(Building.Empty);
    }

    public getBuildings(): Array<Building> {
        return this.buildings;
    }

    public build(building: Building, row: number, col: number): void {
        if (this.isValidPosition(row, col)) {
            this.buildings[row * this.cols + col] = building;
        } else {
            throw new Error("Invalid position");
        }
    }

    private isValidPosition(row: number, col: number): boolean {
        return row >= 0 && row < this.rows && col >= 0 && col < this.cols;
    }
}
