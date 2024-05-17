pragma circom 2.0.0;

include "circomlib/circuits/bitify.circom";

function N() {
  return 2;
}

// var UP = 0;
// var RIGHT = 1;
// var DOWN = 2;
// var LEFT = 3;

// template Cell(B) {
//   signal input building;
//   signal input state[N];
//   signal input neighboursInput[N][4];
// }

template Factory(B) {
  signal input board[B][B];
  signal input resourceState[N()][B][B];
  signal input resourceInput[N()];

  signal output resourceOutputState[N()][B][B];
  signal output resourceOutput[N()];

  for (var r = 0; r < N(); r++) {
    for (var y = 0; y < B; y++) {
      for (var x = 0; x < B; x++) {
        resourceOutputState[r][y][x] <== 0;
      }
    }
    resourceOutput[r] <== 0;
  }
}