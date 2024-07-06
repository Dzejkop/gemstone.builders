import { Vec2 } from "./math";

export enum BuildingType {
    Empty = "Empty",
    Mine = "Mine",
    Factory = "Factory",
    BeltDown = "BeltDown",
}

export class RobotArm {
    constructor(public readonly pos: Vec2) {}

    /// Draws the real image of the robot arm
    public drawReal() {

    }
}

// TODO: Add buildings metadata
// { inputs: [{ resource: Resource, amount: number }], outputs: [{ resource: Resource, amount: number }], terrain: [Terrain] }
