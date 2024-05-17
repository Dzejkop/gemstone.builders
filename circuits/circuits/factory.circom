pragma circom 2.0.0;

include "circomlib/circuits/bitify.circom";
include "circomlib/circuits/mux2.circom";
include "circomlib/circuits/comparators.circom";

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
  signal output resourceExport[N()];

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
  }

  // TODO: Add resource exporting
  for (var r = 0; r < N(); r++) {
    resourceExport[r] <== 0;
  }
}

template ResourceCell() {
  signal input building;
  signal input state;
  signal input resource;
  signal input neighbours[4];

  component n2b = Num2Bits(2);
  n2b.in <== building;

  component isCarbon = IsEqual();
  isCarbon.in[0] <== resource;
  isCarbon.in[1] <== 0;

  component mux = Mux2();
  mux.s <== n2b.out;
  mux.c[0] <== state; // persist state
  mux.c[1] <== 0;
  mux.c[2] <== 0;
  mux.c[3] <== 0;

  component nMux[4];
  for (var n = 0; n < 4; n++) {
    nMux[n] = Mux2();
    nMux[n].s <== n2b.out;

    // Empty building
    // Always zero
    nMux[n].c[0] <== 0;
  }

  // Right
  nMux[0].c[1] <== 0;
  nMux[0].c[2] <== 0;
  nMux[0].c[3] <== 0;

  // Down
  nMux[1].c[1] <== isCarbon.out; // mine (1) produces carbon below (1)
  nMux[1].c[2] <== state; // down belt (2) moves down (1)
  nMux[1].c[3] <== 0;

  // Left
  nMux[2].c[1] <== 0;
  nMux[2].c[2] <== 0;
  nMux[2].c[3] <== 0;

  // Up
  nMux[3].c[1] <== 0;
  nMux[3].c[2] <== 0;
  nMux[3].c[3] <== 0;

  signal output out;
  signal output neighboursOutput[4];

  out <== mux.out;
  for (var n = 0; n < 4; n++) {
    neighboursOutput[n] <== nMux[n].out;
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

template Factory(B) {
  signal input board[B][B];
  signal input resourceState[N()][B][B];
  signal input resourceInput[N()];

  component cells[B][B];
  component cellReducers[B][B];

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
    resourceOutput[r] <== 0;
  }
}