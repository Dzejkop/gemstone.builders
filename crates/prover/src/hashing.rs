// pub fn hash_game_

use ff_ce::PrimeField;
use num_bigint::BigInt;
use num_traits::Num;
use poseidon_rs::{Fr, FrRepr};
use serde::{Deserialize, Serialize};

use crate::game::{Board, GameState, ResourceState, BOARD_SIZE, NUM_RESOURCES};

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ProverInput {
    pub board: Board,
    pub board_hash: String,
    pub resource_state: ResourceState,
    pub state_hash: String,
    pub resource_input: [i32; NUM_RESOURCES],
    pub resource_output_state: ResourceState,
}

pub fn hash_board_to_decimal_string(board: &Board) -> anyhow::Result<String> {
    let hash = hash_board(board)?;
    fr_to_decimal_string(hash)
}

fn fr_to_decimal_string(fr: Fr) -> anyhow::Result<String> {
    let hex_str = fr.into_repr().to_string();
    let number = BigInt::from_str_radix(hex_str.trim_start_matches("0x"), 16)?;
    Ok(number.to_string())
}

pub fn hash_board(board: &Board) -> anyhow::Result<Fr> {
    hash_array(board)
}

pub fn hash_array<T, const A: usize, const B: usize>(arr: &[[T; A]; B]) -> anyhow::Result<Fr>
where
    T: Conv,
{
    let mut xs = Vec::with_capacity(BOARD_SIZE);

    for row in arr {
        let poseidon = poseidon_rs::Poseidon::new();
        let mut fr_row = Vec::with_capacity(row.len());

        for v in row {
            fr_row.push(Fr::from_repr(FrRepr::from(v.conv()))?);
        }

        let h = poseidon
            .hash(fr_row)
            .map_err(|err| anyhow::anyhow!("Failed to hash row: {}", err))?;

        xs.push(h);
    }

    let poseidon = poseidon_rs::Poseidon::new();
    let h = poseidon
        .hash(xs)
        .map_err(|err| anyhow::anyhow!("Failed to hash board: {}", err))?;

    Ok(h)
}

pub fn hash_resource_state(r: &ResourceState) -> anyhow::Result<Fr> {
    let mut xs = Vec::with_capacity(NUM_RESOURCES);

    for board in r {
        xs.push(hash_array(board)?);
    }

    let poseidon = poseidon_rs::Poseidon::new();
    let h = poseidon
        .hash(xs)
        .map_err(|err| anyhow::anyhow!("Failed to hash board: {}", err))?;

    Ok(h)
}

pub fn hash_resource_state_to_decimal_string(r: &ResourceState) -> anyhow::Result<String> {
    let hash = hash_resource_state(r)?;
    fr_to_decimal_string(hash)
}

pub trait Conv: Copy {
    fn conv(self) -> Fr;
}

impl Conv for u8 {
    fn conv(self) -> Fr {
        Fr::from_repr(FrRepr::from(self as u64)).unwrap()
    }
}

impl Conv for i32 {
    fn conv(self) -> Fr {
        Fr::from_repr(FrRepr::from(self as u64)).unwrap()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn hash_empty_board() {
        let board = [[0; BOARD_SIZE]; BOARD_SIZE];
        let hash = hash_board_to_decimal_string(&board).unwrap();
        assert_eq!(
            hash,
            "19261153649140605024552417994922546473530072875902678653210025980873274131905"
        );
    }

    #[test]
    fn hash_empty_resource_state() {
        let resource_state = [[[0; BOARD_SIZE]; BOARD_SIZE]; NUM_RESOURCES];
        let hash = hash_resource_state_to_decimal_string(&resource_state).unwrap();

        assert_eq!(
            hash,
            "19566192433199768019714648174629306541205224169280620721690837488103428951668"
        );
    }
}
