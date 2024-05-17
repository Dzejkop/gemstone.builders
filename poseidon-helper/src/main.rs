use ff_ce::PrimeField;
use poseidon_rs::{Fr, Poseidon};

macro_rules! f {
    ($x:expr) => {
        Fr::from_str(stringify!($x)).unwrap()
    };
}

fn hash_array(array: Vec<Vec<Fr>>) -> Fr {
    let mut xs = vec![];

    for row in array {
        let poseidon = Poseidon::new();
        let h = poseidon.hash(row).unwrap();
        xs.push(h);
    }

    let poseidon = Poseidon::new();
    let h = poseidon.hash(xs).unwrap();
    h
}

fn hash_tensor(tensor: Vec<Vec<Vec<Fr>>>) -> Fr {
    let mut xs = vec![];

    for array in tensor {
        let h = hash_array(array);
        xs.push(h);
    }

    let poseidon = Poseidon::new();
    let h = poseidon.hash(xs).unwrap();
    h
}

fn main() {
    let board = vec![
        vec![f!(0), f!(2), f!(0)],
        vec![f!(0), f!(0), f!(0)],
        vec![f!(0), f!(0), f!(0)],
    ];

    let resource_state = vec![
        vec![
            vec![f!(0), f!(0), f!(0)],
            vec![f!(0), f!(1), f!(0)],
            vec![f!(0), f!(0), f!(0)],
        ],
        vec![
            vec![f!(0), f!(0), f!(0)],
            vec![f!(0), f!(0), f!(0)],
            vec![f!(0), f!(0), f!(0)],
        ],
    ];

    let board_hash = hash_array(board);
    let state_hash = hash_tensor(resource_state);

    println!("board_hash = {board_hash}");
    println!("state_hash = {state_hash}");
}
