pragma circom 2.0.0;

include "factory.circom";
include "circomlib/circuits/poseidon.circom";

function ryx2i(r, y, x, B) {
  return (r * B * B ) + (y * B) + x;
}

function yx2i(y, x, B) {
  return ryx2i(0, y, x, B);
}

template Assembly(B) {
  var S = B * B;

  signal input board[B][B];
  signal input boardHash;

  signal input resourceState[N()][B][B];
  signal input stateHash;

  signal input resourceInput[N()];

  signal output resourceOutputState[N()][B][B];
  signal output outputStateHash;
  signal output resourceOutput[N()];

  // Calculate the board
  component factory = Factory(B);
  factory.board <== board;
  factory.resourceState <== resourceState;
  factory.resourceInput <== resourceInput;

  resourceOutputState <== factory.resourceOutputState;
  resourceOutput <== factory.resourceOutput;

  // Hash the board
  component boardRowHashes[B];
  component boardHasher = Poseidon(B);
  for (var y = 0; y < B; y++) {
    boardRowHashes[y] = Poseidon(B);
    boardRowHashes[y].inputs <== board[y];
    boardHasher.inputs[y] <== boardRowHashes[y].out;
  }

  // Hash the resource states
  component stateRowHashes[N()][B];
  component stateColumnHashes[N()];
  component stateHasher = Poseidon(N());
  for (var r = 0; r < N(); r++) {
    stateColumnHashes[r] = Poseidon(B);
    for (var y = 0; y < B; y++) {
      stateRowHashes[r][y] = Poseidon(B);
      stateRowHashes[r][y].inputs <== resourceState[r][y];

      stateColumnHashes[r].inputs[y] <== stateRowHashes[r][y].out;
    }
    stateHasher.inputs[r] <== stateColumnHashes[r].out;
  }

  // Hash the output state
  component outputStateRowHashes[N()][B];
  component outputStateColumnHashes[N()];
  component outputStateHasher = Poseidon(N());
  for (var r = 0; r < N(); r++) {
    outputStateColumnHashes[r] = Poseidon(B);
    for (var y = 0; y < B; y++) {
      outputStateRowHashes[r][y] = Poseidon(B);
      outputStateRowHashes[r][y].inputs <== resourceOutputState[r][y];

      outputStateColumnHashes[r].inputs[y] <== outputStateRowHashes[r][y].out;
    }
    outputStateHasher.inputs[r] <== outputStateColumnHashes[r].out;
  }

  // Validate hashes
  boardHasher.out === boardHash;
  stateHasher.out === stateHash;

  // Output the hash
  outputStateHash <== outputStateHasher.out;
}
