pragma circom 2.0.0;

include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/mux1.circom";
include "circomlib/circuits/mux4.circom";
include "circomlib/circuits/comparators.circom";

// Number of resources
// 0 == Carbon
// 1 == Diamond
function N() {
  return 2;
}

// RIGHT = 0;
// DOWN = 1;
// LEFT = 2;
// UP = 3;

// Wrapped decrement
function wdec(x, B) {
    if (x == 0) {
        return B - 1;
    } else {
        return x - 1;
    }
}

// Wrapped increment
function winc(x, B) {
    var r = x + 1;
    if (r >= B) {
        return 0;
    } else {
        return r;
    }
}

template Cell() {
  signal input building;
  signal input state[N()];
  signal input neighbours[N()][4];

  // The output value at the cell
  signal output out[N()];
  // The outputs at neighbour cells
  signal output neighboursOutput[N()][4];
  // The export output
  signal output exports[N()];

  var EMPTY = 0;
  var CARBON_MINE = 1;
  var DOWN_BELT = 2;
  var EXPORTER = 3;
  var COMPRESSOR = 4;
  var FIRST_UNDEFINED = 5;
  var UD05 = 5;
  var UD06 = 6;
  var UD07 = 7;
  var UD08 = 8;
  var UD09 = 9;
  var UD10 = 10;
  var UD11 = 11;
  var UD12 = 12;
  var UD13 = 13;
  var UD14 = 14;
  var UD15 = 15;
  var NUM_BUILDINGS = 16;

  component n2b = Num2Bits(4);
  n2b.in <== building;

  // ### Conditions ###
  component atLeastTwoCarbonPresent = GreaterEqThan(32);
  atLeastTwoCarbonPresent.in[0] <== state[0];
  atLeastTwoCarbonPresent.in[1] <== 2;

  component compressorCarbonState = Mux1();
  compressorCarbonState.s <== atLeastTwoCarbonPresent.out;
  compressorCarbonState.c[0] <== state[0]; // Not enough carbon
  compressorCarbonState.c[1] <== state[0] - 2; // Enough carbon

  component compressorDiamondOutput = Mux1();
  compressorDiamondOutput.s <== atLeastTwoCarbonPresent.out;
  compressorDiamondOutput.c[0] <== 0; // Not enough carbon, nothing
  compressorDiamondOutput.c[1] <== 1; // Enough carbon,

  // ### State muxes ###
  component mux[2];

  mux[0] = Mux4();
  mux[0].s <== n2b.out;
  // Every building except empty and compressor destroys carbon
  for (var b = 0; b < NUM_BUILDINGS; b++) {
    if (b != EMPTY && b != COMPRESSOR) {
      mux[0].c[b] <== 0;
    }
  }
  mux[0].c[EMPTY] <== state[0]; // persist state
  mux[0].c[COMPRESSOR] <== compressorCarbonState.out;

  mux[1] = Mux4();
  mux[1].s <== n2b.out;
  // Every building except empty destroys diamonds
  for (var b = 0; b < NUM_BUILDINGS; b++) {
    if (b != EMPTY) {
      mux[1].c[b] <== 0;
    }
  }
  mux[1].c[EMPTY] <== state[1]; // persist state


  // ### Neighbour muxes ###
  component nMux[N()][4];
  for (var r = 0; r < N(); r++) {
    for (var n = 0; n < 4; n++) {
      nMux[r][n] = Mux4();
      nMux[r][n].s <== n2b.out;

      // Empty building
      // Always zero
      nMux[r][n].c[EMPTY] <== 0;

      // Undefined buildings
      // Always zero
      for (var b = FIRST_UNDEFINED; b < NUM_BUILDINGS; b++) {
        nMux[r][n].c[b] <== 0;
      }
    }
  }

  // ### Export muxes ###
  component eMux[N()];
  for (var r = 0; r < N(); r++) {
    eMux[r] = Mux4();
    eMux[r].s <== n2b.out;

    // Only EXPORTER exports anything
    for (var b = 0; b < NUM_BUILDINGS; b++) {
      if (b == EXPORTER) {
        eMux[r].c[b] <== state[r];
      } else {
        eMux[r].c[b] <== 0;
      }
    }
  }

  // ### Logic ###
  // Right - Carbon
  nMux[0][0].c[CARBON_MINE] <== 0;
  nMux[0][0].c[DOWN_BELT] <== 0;
  nMux[0][0].c[EXPORTER] <== 0;
  nMux[0][0].c[COMPRESSOR] <== 0;

  // Right - Diamond
  nMux[1][0].c[CARBON_MINE] <== 0;
  nMux[1][0].c[DOWN_BELT] <== 0;
  nMux[1][0].c[EXPORTER] <== 0;
  nMux[1][0].c[COMPRESSOR] <== compressorDiamondOutput.out;

  // Down - Carbon
  nMux[0][1].c[CARBON_MINE] <== 1; // mine (1) produces carbon below (1)
  nMux[0][1].c[DOWN_BELT] <== state[0]; // down belt (2) moves down (1)
  nMux[0][1].c[EXPORTER] <== 0;
  nMux[0][1].c[COMPRESSOR] <== 0;

  // Down - Diamond
  nMux[1][1].c[CARBON_MINE] <== 0;
  nMux[1][1].c[DOWN_BELT] <== state[1]; // down belt (2) moves down (1)
  nMux[1][1].c[EXPORTER] <== 0;
  nMux[1][1].c[COMPRESSOR] <== 0;

  // Left - Carbon
  nMux[0][2].c[CARBON_MINE] <== 0;
  nMux[0][2].c[DOWN_BELT] <== 0;
  nMux[0][2].c[EXPORTER] <== 0;
  nMux[0][2].c[COMPRESSOR] <== 0;

  // Left - Diamond
  nMux[1][2].c[CARBON_MINE] <== 0;
  nMux[1][2].c[DOWN_BELT] <== 0;
  nMux[1][2].c[EXPORTER] <== 0;
  nMux[1][2].c[COMPRESSOR] <== 0;

  // Up - Carbon
  nMux[0][3].c[CARBON_MINE] <== 0;
  nMux[0][3].c[DOWN_BELT] <== 0;
  nMux[0][3].c[EXPORTER] <== 0;
  nMux[0][3].c[COMPRESSOR] <== 0;

  // Up - Carbon
  nMux[1][3].c[CARBON_MINE] <== 0;
  nMux[1][3].c[DOWN_BELT] <== 0;
  nMux[1][3].c[EXPORTER] <== 0;
  nMux[1][3].c[COMPRESSOR] <== 0;

  for (var r = 0; r < N(); r++) {
    out[r] <== mux[r].out;

    neighboursOutput[r][0] <== nMux[r][0].out;
    neighboursOutput[r][1] <== nMux[r][1].out;
    neighboursOutput[r][2] <== nMux[r][2].out;
    neighboursOutput[r][3] <== nMux[r][3].out;

    exports[r] <== eMux[r].out;
  }
}

// Reduces the state from the cell and neighbours
template CellReducer() {
  signal input state[N()];
  signal input neighbours[N()][4];

  signal output out[N()];

  for (var r = 0; r < N(); r++) {
    out[r] <== state[r] + neighbours[r][0] + neighbours[r][1] + neighbours[r][2] + neighbours[r][3];
  }
}

template GridAccumulate(B) {
  signal input in[B][B];
  signal output out;

  signal rowSums[B][B];
  signal sums[B];

  for (var y = 0; y < B; y++) {
    rowSums[y][0] <== in[y][0];

    for (var x = 1; x < B; x++) {
      rowSums[y][x] <== in[y][x] + rowSums[y][x - 1];
    }
  }

  sums[0] <== rowSums[0][B - 1];
  for (var y = 1; y < B; y++) {
    sums[y] <== rowSums[y][B - 1] + sums[y - 1];
  }

  sums[B - 1] ==> out;
}

template Factory(B) {
  signal input board[B][B];
  signal input resourceState[N()][B][B];
  signal input resourceInput[N()];

  component cells[B][B];
  component cellReducers[B][B];
  component accumulators[N()];

  signal output resourceOutputState[N()][B][B];
  signal output resourceOutput[N()];

  // Init cells
  for (var y = 0; y < B; y++) {
    for (var x = 0; x < B; x++) {
      cells[y][x] = Cell();
      cellReducers[y][x] = CellReducer();

      cells[y][x].building <== board[y][x];
    }
  }

  // Init cell inputs
  for (var r = 0; r < N(); r++) {
    for (var y = 0; y < B; y++) {
      for (var x = 0; x < B; x++) {
        cells[y][x].state[r] <== resourceState[r][y][x];

        // Input from neighbouring cells
        cells[y][x].neighbours[r][0] <== board[y][winc(x, B)];
        cells[y][x].neighbours[r][1] <== board[winc(y, B)][x];
        cells[y][x].neighbours[r][2] <== board[y][wdec(x, B)];
        cells[y][x].neighbours[r][3] <== board[wdec(y, B)][x];
      }
    }
  }

  // Init reducers
  for (var r = 0; r < N(); r++) {
    for (var y = 0; y < B; y++) {
      for (var x = 0; x < B; x++) {
        cellReducers[y][x].state[r] <== cells[y][x].out[r];

        // Output to neighbouring cells
        // From right
        cellReducers[y][x].neighbours[r][0] <== cells[y][winc(x, B)].neighboursOutput[r][2];
        // From down
        cellReducers[y][x].neighbours[r][1] <== cells[winc(y, B)][x].neighboursOutput[r][3];
        // From left
        cellReducers[y][x].neighbours[r][2] <== cells[y][wdec(x, B)].neighboursOutput[r][0];
        // From up
        cellReducers[y][x].neighbours[r][3] <== cells[wdec(y, B)][x].neighboursOutput[r][1];
      }
    }
  }

  // Handle cell outputs
  for (var r = 0; r < N(); r++) {
    for (var y = 0; y < B; y++) {
      for (var x = 0; x < B; x++) {
        resourceOutputState[r][y][x] <== cellReducers[y][x].out[r];
      }
    }
  }

  // TODO: Handle output state
  for (var r = 0; r < N(); r++) {
    accumulators[r] = GridAccumulate(B);

    for (var y = 0; y < B; y++) {
      for (var x = 0; x < B; x++) {
        accumulators[r].in[y][x] <== cells[y][x].exports[r];
      }
    }

    resourceOutput[r] <== accumulators[r].out;
  }
}