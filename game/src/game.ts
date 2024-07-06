import { BuildingType } from './building';

export class Game {
    private buildings: Array<BuildingType>;

    constructor(public readonly rows: number, public readonly cols: number) {
        this.buildings = new Array<BuildingType>(rows * cols).fill(BuildingType.Empty);
    }

    public getBuildings(): Array<BuildingType> {
        return this.buildings;
    }

    public build(building: BuildingType, row: number, col: number): void {
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
