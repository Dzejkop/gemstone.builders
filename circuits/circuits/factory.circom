pragma circom 2.0.0;

include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/gates.circom";
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
  // The import output
  signal output imports[N()];
  // The export output
  signal output exports[N()];

  // Buildings
  var EMPTY = 0;
  var CARBON_MINE = 1;
  var DIAMOND_IMPORTER = 2;
  var EXPORTER = 3;
  var CARBON_COMPRESSOR = 4;
  var RIGHT_BELT = 5;
  var DOWN_BELT = 6;
  var LEFT_BELT = 7;
  var UP_BELT = 8;
  var DIAMOND_CHIPPER = 9; // 2 CRBN + 1 DMND => 1 CRBN (left) + 2 DMND (down)
  var BURNER = 10;
  var FIRST_UNDEFINED = 11;
  var UD11 = 11;
  var UD12 = 12;
  var UD13 = 13;
  var UD14 = 14;
  var UD15 = 15;
  var NUM_BUILDINGS = 16;

  // Resources
  var CRBN = 0;
  var DMND = 1;

  // Directions
  var R = 0;
  var D = 1;
  var L = 2;
  var U = 3;

  component n2b = Num2Bits(4);
  n2b.in <== building;

  // ### Conditions ###
  component atLeastTwoCarbonPresent = GreaterEqThan(32);
  atLeastTwoCarbonPresent.in[0] <== state[CRBN];
  atLeastTwoCarbonPresent.in[1] <== 2;

  component atLeastOneDiamondPresent = GreaterEqThan(32);
  atLeastOneDiamondPresent.in[0] <== state[DMND];
  atLeastOneDiamondPresent.in[1] <== 1;

  component diamondChipperShouldProduce = AND();
  diamondChipperShouldProduce.a <== atLeastOneDiamondPresent.out;
  diamondChipperShouldProduce.b <== atLeastTwoCarbonPresent.out;

  component compressorCarbonState = Mux1();
  compressorCarbonState.s <== atLeastTwoCarbonPresent.out;
  compressorCarbonState.c[0] <== state[0]; // Not enough carbon
  compressorCarbonState.c[1] <== state[0] - 2; // Enough carbon

  component compressorDiamondOutput = Mux1();
  compressorDiamondOutput.s <== atLeastTwoCarbonPresent.out;
  compressorDiamondOutput.c[0] <== 0; // Not enough carbon, nothing
  compressorDiamondOutput.c[1] <== 1; // Enough carbon,

  component diamondChipperCarbonState = Mux1();
  diamondChipperCarbonState.s <== diamondChipperShouldProduce.out;
  diamondChipperCarbonState.c[0] <== state[CRBN];
  diamondChipperCarbonState.c[1] <== state[CRBN] - 2;

  component diamondChipperDiamondState = Mux1();
  diamondChipperDiamondState.s <== diamondChipperShouldProduce.out;
  diamondChipperDiamondState.c[0] <== state[DMND];
  diamondChipperDiamondState.c[1] <== state[DMND] - 1;

  component diamondChipperCarbonOutput = Mux1();
  diamondChipperCarbonOutput.s <== diamondChipperShouldProduce.out;
  diamondChipperCarbonOutput.c[0] <== 0;
  diamondChipperCarbonOutput.c[1] <== 1;

  component diamondChipperDiamondOutput = Mux1();
  diamondChipperDiamondOutput.s <== diamondChipperShouldProduce.out;
  diamondChipperDiamondOutput.c[0] <== 0;
  diamondChipperDiamondOutput.c[1] <== 2;

  // ### State muxes ###
  component mux[2];

  mux[CRBN] = Mux4();
  mux[CRBN].s <== n2b.out;
  // Every building except empty, carbon compressor and diamond chipper destroys carbon
  for (var b = 0; b < NUM_BUILDINGS; b++) {
    if (b != EMPTY && b != CARBON_COMPRESSOR && b != DIAMOND_CHIPPER) {
      mux[CRBN].c[b] <== 0;
    }
  }
  mux[CRBN].c[EMPTY] <== state[0]; // persist state
  mux[CRBN].c[CARBON_COMPRESSOR] <== compressorCarbonState.out;
  mux[CRBN].c[DIAMOND_CHIPPER] <== diamondChipperCarbonState.out;

  mux[DMND] = Mux4();
  mux[DMND].s <== n2b.out;
  // Every building except empty and DIAMOND_CHIPPER destroys diamonds
  for (var b = 0; b < NUM_BUILDINGS; b++) {
    if (b != EMPTY && b != DIAMOND_CHIPPER) {
      mux[DMND].c[b] <== 0;
    }
  }
  mux[DMND].c[EMPTY] <== state[DMND]; // persist state
  mux[DMND].c[DIAMOND_CHIPPER] <== diamondChipperDiamondState.out;


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

  // ### Import muxes ###
  component iMux[N()];
  for (var r = 0; r < N(); r++) {
    iMux[r] = Mux4();
    iMux[r].s <== n2b.out;

    // Only DIAMOND_IMPORTER imports anything
    for (var b = 0; b < NUM_BUILDINGS; b++) {
      if (b != DIAMOND_IMPORTER) {
        iMux[r].c[b] <== 0;
      }
    }
  }

  iMux[CRBN].c[DIAMOND_IMPORTER] <== 0;
  iMux[DMND].c[DIAMOND_IMPORTER] <== 1;

  // ### Logic ###
  // Right - Carbon
  nMux[CRBN][R].c[CARBON_MINE] <== 0;
  nMux[CRBN][R].c[DIAMOND_IMPORTER] <== 0;
  nMux[CRBN][R].c[EXPORTER] <== 0;
  nMux[CRBN][R].c[CARBON_COMPRESSOR] <== 0;
  nMux[CRBN][R].c[RIGHT_BELT] <== state[CRBN];
  nMux[CRBN][R].c[DOWN_BELT] <== 0;
  nMux[CRBN][R].c[LEFT_BELT] <== 0;
  nMux[CRBN][R].c[UP_BELT] <== 0;
  nMux[CRBN][R].c[DIAMOND_CHIPPER] <== 0;
  nMux[CRBN][R].c[BURNER] <== 0;

  // Right - Diamond
  nMux[DMND][R].c[CARBON_MINE] <== 0;
  nMux[DMND][R].c[DIAMOND_IMPORTER] <== 0;
  nMux[DMND][R].c[EXPORTER] <== 0;
  nMux[DMND][R].c[CARBON_COMPRESSOR] <== compressorDiamondOutput.out;
  nMux[DMND][R].c[RIGHT_BELT] <== state[DMND];
  nMux[DMND][R].c[DOWN_BELT] <== 0;
  nMux[DMND][R].c[LEFT_BELT] <== 0;
  nMux[DMND][R].c[UP_BELT] <== 0;
  nMux[DMND][R].c[DIAMOND_CHIPPER] <== 0;
  nMux[DMND][R].c[BURNER] <== 0;

  // Down - Carbon
  nMux[CRBN][D].c[CARBON_MINE] <== 1; // mine (1) produces carbon below (1)
  nMux[CRBN][D].c[DIAMOND_IMPORTER] <== 0;
  nMux[CRBN][D].c[EXPORTER] <== 0;
  nMux[CRBN][D].c[CARBON_COMPRESSOR] <== 0;
  nMux[CRBN][D].c[RIGHT_BELT] <== 0;
  nMux[CRBN][D].c[DOWN_BELT] <== state[CRBN]; // down belt (2) moves down (1)
  nMux[CRBN][D].c[LEFT_BELT] <== 0;
  nMux[CRBN][D].c[UP_BELT] <== 0;
  nMux[CRBN][D].c[DIAMOND_CHIPPER] <== 0;
  nMux[CRBN][D].c[BURNER] <== 0;

  // Down - Diamond
  nMux[DMND][D].c[CARBON_MINE] <== 0;
  nMux[DMND][D].c[DIAMOND_IMPORTER] <== 1;
  nMux[DMND][D].c[EXPORTER] <== 0;
  nMux[DMND][D].c[CARBON_COMPRESSOR] <== 0;
  nMux[DMND][D].c[RIGHT_BELT] <== 0;
  nMux[DMND][D].c[DOWN_BELT] <== state[DMND]; // down belt (2) moves down (1)
  nMux[DMND][D].c[LEFT_BELT] <== 0;
  nMux[DMND][D].c[UP_BELT] <== 0;
  nMux[DMND][D].c[DIAMOND_CHIPPER] <== diamondChipperDiamondOutput.out;
  nMux[DMND][D].c[BURNER] <== 0;

  // Left - Carbon
  nMux[CRBN][L].c[CARBON_MINE] <== 0;
  nMux[CRBN][L].c[DIAMOND_IMPORTER] <== 0;
  nMux[CRBN][L].c[EXPORTER] <== 0;
  nMux[CRBN][L].c[CARBON_COMPRESSOR] <== 0;
  nMux[CRBN][L].c[RIGHT_BELT] <== 0;
  nMux[CRBN][L].c[DOWN_BELT] <== 0;
  nMux[CRBN][L].c[LEFT_BELT] <== state[CRBN];
  nMux[CRBN][L].c[UP_BELT] <== 0;
  nMux[CRBN][L].c[DIAMOND_CHIPPER] <== diamondChipperCarbonOutput.out;
  nMux[CRBN][L].c[BURNER] <== 0;

  // Left - Diamond
  nMux[DMND][L].c[CARBON_MINE] <== 0;
  nMux[DMND][L].c[DIAMOND_IMPORTER] <== 0;
  nMux[DMND][L].c[EXPORTER] <== 0;
  nMux[DMND][L].c[CARBON_COMPRESSOR] <== 0;
  nMux[DMND][L].c[RIGHT_BELT] <== 0;
  nMux[DMND][L].c[DOWN_BELT] <== 0;
  nMux[DMND][L].c[LEFT_BELT] <== state[DMND];
  nMux[DMND][L].c[UP_BELT] <== 0;
  nMux[DMND][L].c[DIAMOND_CHIPPER] <== 0;
  nMux[DMND][L].c[BURNER] <== 0;

  // Up - Carbon
  nMux[CRBN][U].c[CARBON_MINE] <== 0;
  nMux[CRBN][U].c[DIAMOND_IMPORTER] <== 0;
  nMux[CRBN][U].c[EXPORTER] <== 0;
  nMux[CRBN][U].c[CARBON_COMPRESSOR] <== 0;
  nMux[CRBN][U].c[RIGHT_BELT] <== 0;
  nMux[CRBN][U].c[DOWN_BELT] <== 0;
  nMux[CRBN][U].c[LEFT_BELT] <== 0;
  nMux[CRBN][U].c[UP_BELT] <== state[CRBN];
  nMux[CRBN][U].c[DIAMOND_CHIPPER] <== 0;
  nMux[CRBN][U].c[BURNER] <== 0;

  // Up - Diamond
  nMux[DMND][U].c[CARBON_MINE] <== 0;
  nMux[DMND][U].c[DIAMOND_IMPORTER] <== 0;
  nMux[DMND][U].c[EXPORTER] <== 0;
  nMux[DMND][U].c[CARBON_COMPRESSOR] <== 0;
  nMux[DMND][U].c[RIGHT_BELT] <== 0;
  nMux[DMND][U].c[DOWN_BELT] <== 0;
  nMux[DMND][U].c[LEFT_BELT] <== 0;
  nMux[DMND][U].c[UP_BELT] <== state[DMND];
  nMux[DMND][U].c[DIAMOND_CHIPPER] <== 0;
  nMux[DMND][U].c[BURNER] <== 0;

  for (var r = 0; r < N(); r++) {
    out[r] <== mux[r].out;

    neighboursOutput[r][R] <== nMux[r][R].out;
    neighboursOutput[r][D] <== nMux[r][D].out;
    neighboursOutput[r][L] <== nMux[r][L].out;
    neighboursOutput[r][U] <== nMux[r][U].out;

    exports[r] <== eMux[r].out;
    imports[r] <== iMux[r].out;
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
  component importAccumulators[N()];
  component exportAccumulators[N()];

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
    importAccumulators[r] = GridAccumulate(B);
    exportAccumulators[r] = GridAccumulate(B);

    for (var y = 0; y < B; y++) {
      for (var x = 0; x < B; x++) {
        importAccumulators[r].in[y][x] <== cells[y][x].imports[r];
        exportAccumulators[r].in[y][x] <== cells[y][x].exports[r];
      }
    }

    resourceInput[r] === importAccumulators[r].out;
    resourceOutput[r] <== exportAccumulators[r].out;
  }
}