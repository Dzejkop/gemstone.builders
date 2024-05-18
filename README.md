# Gemstone Builders

Gemstone Builders is a resource gathering type of game with a ZK rule engine and on-chain global economy.

Deployed to Ethereum Sepolia testnet and ZK-Sync Era.

It was created as a project for ZK Hack Kraków 2024.

## Tech stack

- ZK: circom, snarkjs
- Local server: Rust, Solidity
- Local client: JS/React

## Chellanges

- Game board size limited to 16x16 - proving time for bigger boards was taking too long to provide decent UX
- Bringing game rules to the curcuit

## Running locally

1. Start anvil

```
anvil
```

2. Deploy & setup the contracts

```
cd contracts
source deployLocal.sh
# THE COMMAND BELOW NEEDS TO BE RERUN TO CLEANUP THE STATE
# MUST BE RUN IN THE SAME SESSION AS deployLocal.sh
# AS IT DEPENDS ON THE EXPORTED ENV VARS
bash registerFactory.sh
```

3. Start prover

```
cargo run --release -p prover
```

4. Start browser client

```
cd frontend
npm start
```

### Need to clean the state?

```
rm -rf state
cargo run --release -p prover
```
