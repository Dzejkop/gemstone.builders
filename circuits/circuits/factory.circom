pragma circom 2.0.0;

include "circomlib/circuits/bitify.circom";

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

template Cell(B) {
  signal input building;
  signal input state[N()];
  signal input neighbours[N()][4];

    // The output value at the cell
  signal output out[N()];
  // The outputs at neighbour cells
  signal output neighboursOutput[N()][4];
  // The export output
  signal output resourceExport[N()];

  for (var r = 0; r < N(); r++) {
    out[r] <== 0;

    neighboursOutput[r][0] <== 0;
    neighboursOutput[r][1] <== state[r];
    neighboursOutput[r][2] <== 0;
    neighboursOutput[r][3] <== 0;

    resourceExport[r] <== 0;
  }
}

// Reduces the state from the cell and neighbours
template CellReducer(B) {
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
      cells[y][x] = Cell(B);
      cellReducers[y][x] = CellReducer(B);

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