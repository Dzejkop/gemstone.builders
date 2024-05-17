import { WitnessTester } from "circomkit";
import { circomkit } from "./common";

describe("assembly", () => {
  const B = 3;
  let circuit: WitnessTester<
    ["board", "boardHash", "resourceState", "stateHash", "resourceInput"],
    ["resourceOutputState", "outputStateHash", "resourceOutput"]
  >;

  describe("basic", () => {
    before(async () => {
      circuit = await circomkit.WitnessTester(`assembly_${B}`, {
        file: "assembly",
        template: "Assembly",
        params: [B],
      });
      console.log("#constraints:", await circuit.getConstraintCount());
    });

    it("empty state", async () => {
      await circuit.expectPass(
        {
          board: [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
          boardHash: "13646148465123258486880311354089387061311186640515840741156454775071304041723",
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
          stateHash: "563012732457004937300219974948322150019032550112199487599075704750360529532",
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
          outputStateHash: "563012732457004937300219974948322150019032550112199487599075704750360529532",
          resourceOutput: [0, 0],
        }
      );
    });

    it("belt moves down", async () => {
      await circuit.expectPass(
        {
          board: [
            [0, 2, 0],
            [0, 0, 0],
            [0, 0, 0],
          ],
          boardHash: "2738256657389200618343777125986421326949441684554040140813762259804738451764",
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
          stateHash: "9300161517131298423169189188493243916136645938164971588530079193701860533735",
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
          outputStateHash: "11416959632478696117663342021836357138051734868242263599280011231008452483710",
          resourceOutput: [0, 0],
        }
      );
    });
  });
});
