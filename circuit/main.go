package main

import (
	"fmt"
	"time"

	"github.com/consensys/gnark-crypto/ecc"
	"github.com/consensys/gnark/backend/groth16"
	"github.com/consensys/gnark/frontend"
	"github.com/consensys/gnark/frontend/cs/r1cs"
	"github.com/consensys/gnark/std/hash/mimc"
)

const BoardSize = 16

const (
	Empty = 0

	// Buildings
	MineRight = 1
	MineDown  = 2
	MineLeft  = 3
	MineUp    = 4

	BeltRight = 5
	BeltDown  = 6
	BeltLeft  = 7
	BeltUp    = 8

	Compressor = 9

	// Resources
	Coal     = 1
	CoalDust = 2
	Diamond  = 3
	Iron     = 4
)

type FactoryStepCircuit struct {
	Board     [BoardSize][BoardSize]frontend.Variable `gnark:",secret"`
	BoardHash frontend.Variable                       `gnark:",public"`

	InState     [BoardSize][BoardSize]frontend.Variable `gnark:",secret"`
	InStateHash frontend.Variable                       `gnark:",public"`

	OutState     [BoardSize][BoardSize]frontend.Variable `gnark:",secret"`
	OutStateHash frontend.Variable                       `gnark:",public"`
}

func (circuit *FactoryStepCircuit) Define(api frontend.API) error {
	boardHash, _ := mimc.NewMiMC(api)
	for y := 0; y < BoardSize; y++ {
		for x := 0; x < BoardSize; x++ {
			boardHash.Write(circuit.Board[y][x])
		}
	}

	var updateCount [BoardSize][BoardSize]frontend.Variable
	for y := 0; y < BoardSize; y++ {
		for x := 0; x < BoardSize; x++ {
			updateCount[y][x] = api.Add
		}
	}

	inStateHash, _ := mimc.NewMiMC(api)
	for y := 0; y < BoardSize; y++ {
		for x := 0; x < BoardSize; x++ {
			inStateHash.Write(circuit.InState[y][x])
		}
	}

	outStateHash, _ := mimc.NewMiMC(api)
	for y := 0; y < BoardSize; y++ {
		for x := 0; x < BoardSize; x++ {
			outStateHash.Write(circuit.OutState[y][x])
		}
	}

	for y := 0; y < BoardSize; y++ {
		for x := 0; x < BoardSize; x++ {

		}
	}

	api.AssertIsEqual(circuit.BoardHash, boardHash.Sum())
	api.AssertIsEqual(circuit.InStateHash, inStateHash.Sum())
	api.AssertIsEqual(circuit.OutStateHash, outStateHash.Sum())

	return nil
}

func main() {
	var board [BoardSize][BoardSize]frontend.Variable
	for i := 0; i < BoardSize; i++ {
		for j := 0; j < BoardSize; j++ {
			board[i][j] = 0
		}
	}

	var state [BoardSize][BoardSize]frontend.Variable
	for i := 0; i < BoardSize; i++ {
		for j := 0; j < BoardSize; j++ {
			state[i][j] = 0
		}
	}

	var outState [BoardSize][BoardSize]frontend.Variable
	for i := 0; i < BoardSize; i++ {
		for j := 0; j < BoardSize; j++ {
			outState[i][j] = 0
		}
	}

	var circuit FactoryStepCircuit = FactoryStepCircuit{
		Board:        board,
		BoardHash:    "5601622037464432928535729495475920949004661208983986791997724060639169417717",
		InState:      state,
		InStateHash:  "5601622037464432928535729495475920949004661208983986791997724060639169417717",
		OutState:     outState,
		OutStateHash: "5601622037464432928535729495475920949004661208983986791997724060639169417717",
	}

	cs, err := frontend.Compile(ecc.BN254.ScalarField(), r1cs.NewBuilder, &circuit)
	if err != nil {
		panic(err)
	}

	circuit = FactoryStepCircuit{
		Board:        board,
		BoardHash:    "5601622037464432928535729495475920949004661208983986791997724060639169417717",
		InState:      state,
		InStateHash:  "5601622037464432928535729495475920949004661208983986791997724060639169417717",
		OutState:     outState,
		OutStateHash: "5601622037464432928535729495475920949004661208983986791997724060639169417717",
	}

	witness, err := frontend.NewWitness(&circuit, ecc.BN254.ScalarField())
	if err != nil {
		panic(err)
	}

	pk, _, err := groth16.Setup(cs)
	if err != nil {
		panic(err)
	}

	start := time.Now()
	_, err = groth16.Prove(cs, pk, witness)
	if err != nil {
		panic(err)
	}
	elapsed := time.Since(start)
	fmt.Println("Proof generation time:", elapsed)
}
