use serde::{Deserialize, Serialize};

use crate::hashing::{
    hash_board_to_decimal_string, hash_resource_state_to_decimal_string, ProverInput,
};

pub const EMPTY: u8 = 0;
pub const MINE: u8 = 1;
pub const BELT_DOWN: u8 = 2;
pub const EXPORTER: u8 = 3;

pub const CARBON: u8 = 0;
pub const DIAMOND: u8 = 1;
pub const NUM_RESOURCES: usize = 2;

pub const BOARD_SIZE: usize = 5;

pub type Board = [[u8; BOARD_SIZE]; BOARD_SIZE];
// Count of resources on each tile, per resource
pub type ResourceState = [[[i32; BOARD_SIZE]; BOARD_SIZE]; NUM_RESOURCES];

pub fn empty_state() -> ResourceState {
    [[[0; BOARD_SIZE]; BOARD_SIZE]; NUM_RESOURCES]
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct GameState {
    pub board: Board,
    pub resource_state: ResourceState,
}

#[derive(Clone, Debug, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub struct SimulateOutput {
    pub new_state: GameState,
    pub resource_input: [i32; NUM_RESOURCES],
    pub resource_output: [i32; NUM_RESOURCES],
}

impl GameState {
    pub fn empty() -> Self {
        Self {
            board: [[EMPTY; BOARD_SIZE]; BOARD_SIZE],
            resource_state: empty_state(),
        }
    }

    pub fn advance(self) -> SimulateOutput {
        let resource_input = [0; NUM_RESOURCES];
        let mut resource_output = [0; NUM_RESOURCES];

        let mut new_resource_state = self.resource_state.clone();

        for y in 0..BOARD_SIZE {
            for x in 0..BOARD_SIZE {
                match self.board[y][x] {
                    MINE => {
                        new_resource_state[CARBON as usize][(y + 1) % BOARD_SIZE][x] += 1;
                    }
                    BELT_DOWN => {
                        for r in 0..NUM_RESOURCES {
                            new_resource_state[r][(y + 1) % BOARD_SIZE][x] +=
                                self.resource_state[r][y][x];

                            new_resource_state[r][y][x] -= self.resource_state[r][y][x];
                        }
                    }
                    EXPORTER => {
                        for r in 0..NUM_RESOURCES {
                            new_resource_state[r][y][x] -= self.resource_state[r][y][x];
                            resource_output[r] += self.resource_state[r][y][x];
                        }
                    }
                    _ => {}
                }
            }
        }

        SimulateOutput {
            new_state: Self {
                board: self.board,
                resource_state: new_resource_state,
            },
            resource_input,
            resource_output,
        }
    }

    pub fn board_hash(&self) -> anyhow::Result<String> {
        hash_board_to_decimal_string(&self.board)
    }

    pub fn resource_state_hash(&self) -> anyhow::Result<String> {
        hash_resource_state_to_decimal_string(&self.resource_state)
    }

    pub fn construct_prover_input(&self) -> anyhow::Result<ProverInput> {
        tracing::info!("Constructing prover Hashing board");
        let board_hash = self.board_hash()?;

        tracing::info!("Hashing state");
        let state_hash = self.resource_state_hash()?;

        tracing::info!("Generating new state");
        let new_state = self.clone().advance();

        Ok(ProverInput {
            board: self.board,
            board_hash,
            resource_state: self.resource_state,
            state_hash,
            resource_input: [0; NUM_RESOURCES],
            resource_output_state: new_state.new_state.resource_state,
        })
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn serialize_empty() {
        const S: &str = indoc::indoc! {r#"
            {
                "board": [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ],
                "resourceState": [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]
            }
        "#};
        let empty = GameState::empty();

        let empty_s = serde_json::to_string(&empty).unwrap();

        println!("empty_s: {}", empty_s);
        let deserilized: GameState = serde_json::from_str(S).unwrap();

        assert_eq!(deserilized, empty);
    }

    #[test]
    fn advance() {
        const INIT: &str = indoc::indoc! {r#"
            {
                "board": [
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 2, 0],
                    [0, 0, 0, 2, 0],
                    [0, 0, 0, 2, 0],
                    [0, 0, 0, 3, 0]
                ],
                "resourceState": [
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ],
                    [
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0],
                        [0, 0, 0, 0, 0]
                    ]
                ]
            }
        "#};

        const EXPECTED: &str = indoc::indoc! {
            r#"
            [
                [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 1, 0],
                    [0, 0, 0, 1, 0]
                ],
                [
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0],
                    [0, 0, 0, 0, 0]
                ]
            ]
            "#
        };

        let initial: GameState = serde_json::from_str(INIT).unwrap();

        let mut state = initial.clone();

        for _ in 0..5 {
            state = state.advance().new_state;
        }

        let expected: ResourceState = serde_json::from_str(EXPECTED).unwrap();

        assert_eq!(state.resource_state, expected);
    }
}
