import { WitnessTester } from "circomkit";
import { circomkit } from "./common";

describe("factory", () => {
  const B = 3;
  let circuit: WitnessTester<["board", "resourceState", "resourceInput"], ["resourceOutputState", "resourceOutput"]>;

  describe("basic", () => {
    before(async () => {
      circuit = await circomkit.WitnessTester(`factory_${B}`, {
        file: "factory",
        template: "Factory",
        params: [B],
      });
      console.log("#constraints:", await circuit.getConstraintCount());
    });

    it("empty board and nothing happens", async () => {
      await circuit.expectPass(
        {
          board: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
          resourceState: [
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          resourceInput: [0, 0],
        },
        {
          resourceOutputState: [
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          resourceOutput: [0, 0],
        }
      );
    });

    it("conveyor belt moves down", async () => {
      await circuit.expectPass(
        {
          board: [
            [0, 2, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
          resourceState: [
            [
              [0, 1, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          resourceInput: [0, 0],
        },
        {
          resourceOutputState: [
            [
              [0, 0, 0],
              [0, 1, 0],
              [0, 0, 0],
            ],
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          resourceOutput: [0, 0],
        }
      );
    });

    it("mine creates carbon below it", async () => {
      await circuit.expectPass(
        {
          board: [
            [0, 1, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
          resourceState: [
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          resourceInput: [0, 0],
        },
        {
          resourceOutputState: [
            [
              [0, 0, 0],
              [0, 1, 0],
              [0, 0, 0],
            ],
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          resourceOutput: [0, 0],
        }
      );
    });

    it("exporter exports", async () => {
      await circuit.expectPass(
        {
          board: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 3, 0],
          ],
          resourceState: [
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 5, 0],
            ],
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          resourceInput: [0, 0],
        },
        {
          resourceOutputState: [
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
            [
              [0, 0, 0],
              [0, 0, 0],
              [0, 0, 0],
            ],
          ],
          resourceOutput: [5, 0],
        }
      );
    });
  });
});
