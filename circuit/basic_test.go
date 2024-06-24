package main

import (
	"testing"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/test"
)

func emptyBoard() [BoardSize][BoardSize]frontend.Variable {
	var board [BoardSize][BoardSize]frontend.Variable
	for i := 0; i < BoardSize; i++ {
		for j := 0; j < BoardSize; j++ {
			board[i][j] = 0
		}
	}
	return board
}

func EmptyBoard(t *testing.T) {
	assert := test.NewAssert(t)

	var circuit FactoryStepCircuit

	assert.ProverSucceeded(&circuit, &FactoryStepCircuit{
		Board:       emptyBoard(),
		BoardHash:   "5601622037464432928535729495475920949004661208983986791997724060639169417717",
		InState:     emptyBoard(),
		InStateHash: "5601622037464432928535729495475920949004661208983986791997724060639169417717",
	}, test.WithCurves(ecc.BN254))
}
