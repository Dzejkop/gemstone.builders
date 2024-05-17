pragma circom 2.0.0;

include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/mux2.circom";
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

  component rc[N()];

  for (var r = 0; r < N(); r++) {
    rc[r] = ResourceCell();
    rc[r].resource <== r;
    rc[r].building <== building;
    rc[r].state <== state[r];
    rc[r].neighbours[0] <== neighbours[r][0];
    rc[r].neighbours[1] <== neighbours[r][1];
    rc[r].neighbours[2] <== neighbours[r][2];
    rc[r].neighbours[3] <== neighbours[r][3];

    out[r] <== rc[r].out;
    neighboursOutput[r][0] <== rc[r].neighboursOutput[0];
    neighboursOutput[r][1] <== rc[r].neighboursOutput[1];
    neighboursOutput[r][2] <== rc[r].neighboursOutput[2];
    neighboursOutput[r][3] <== rc[r].neighboursOutput[3];

    exports[r] <== rc[r].export;
  }
}

template ResourceCell() {
  signal input building;
  signal input state;
  signal input resource;
  signal input neighbours[4];

  signal output out;
  signal output neighboursOutput[4];
  signal output export;

  var EMPTY = 0;
  var CARBON_MINE = 1;
  var DOWN_BELT = 2;
  var EXPORTER = 3;

  component n2b = Num2Bits(2);
  n2b.in <== building;

  component isCarbon = IsEqual();
  isCarbon.in[0] <== resource;
  isCarbon.in[1] <== 0;

  component mux = Mux2();
  mux.s <== n2b.out;
  mux.c[EMPTY] <== state; // persist state
  mux.c[CARBON_MINE] <== 0;
  mux.c[DOWN_BELT] <== 0;
  mux.c[EXPORTER] <== 0;

  component nMux[4];
  for (var n = 0; n < 4; n++) {
    nMux[n] = Mux2();
    nMux[n].s <== n2b.out;

    // Empty building
    // Always zero
    nMux[n].c[EMPTY] <== 0;
  }

  // Export mux
  component eMux = Mux2();
  eMux.s <== n2b.out;

  eMux.c[EMPTY] <== 0;
  eMux.c[CARBON_MINE] <== 0;
  eMux.c[DOWN_BELT] <== 0;
  eMux.c[EXPORTER] <== state; // Export state

  // Right
  nMux[0].c[CARBON_MINE] <== 0;
  nMux[0].c[DOWN_BELT] <== 0;
  nMux[0].c[EXPORTER] <== 0;

  // Down
  nMux[1].c[CARBON_MINE] <== isCarbon.out; // mine (1) produces carbon below (1)
  nMux[1].c[DOWN_BELT] <== state; // down belt (2) moves down (1)
  nMux[1].c[EXPORTER] <== 0;

  // Left
  nMux[2].c[CARBON_MINE] <== 0;
  nMux[2].c[DOWN_BELT] <== 0;
  nMux[2].c[EXPORTER] <== 0;

  // Up
  nMux[3].c[CARBON_MINE] <== 0;
  nMux[3].c[DOWN_BELT] <== 0;
  nMux[3].c[EXPORTER] <== 0;

  out <== mux.out;
  for (var n = 0; n < 4; n++) {
    neighboursOutput[n] <== nMux[n].out;
  }
  export <== eMux.out;
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