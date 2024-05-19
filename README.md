# Gemstone Builders

Gemstone Builders is a resource gathering type of game with a ZK rule engine and on-chain global economy.

Deployed to Ethereum Sepolia testnet and ZK-Sync Era.

It was created as a project for ZK Hack Kraków 2024.

## How do I play?
You can start playing relatively easily. You'll need to:

### 1. Create a random private key and fund it for gas
Easiest way to do this is by using [cast from foundry](https://getfoundry.sh/)
```
> cast wallet new
```

Example output:
```
Successfully created new keypair.
Address:     0xFfeaCe3e2a02D34D4F5b89b8F9B55f0282b5dFb3
Private key: 0xdda83541e1e21aa12c041a352dc2b475caca314cb71735125151d90d8c52fae1
```

Fund it with some testnet ETH to cover gas costs.

### 2. Start a local prover
The state of your factory and the proving logic runs locally on your machine.

In order to be able to play this game you need to run our client locally. We recommend using our docker image. As it's the fastest way to download the prover with all the necessary dependencies included:

```bash
> # Update if necessary
> docker pull ghcr.io/dzejkop/gemstone.builders:latest

> docker run -v ./factory/:/app/state/ -e PRIVATE_KEY=<YOUR_PRIVATE_KEY> -p 3123:3123 ghcr.io/dzejkop/gemstone.builders:latest
```

You'll notice that you only need to provide your private key. The ZK artifacts are already included in the image and the program uses the public Sepolia RPC by default.

You might have noticed the exported port 3123 - this is the port over which the frontend will communicate.

### 3. Go play!
Now and now for the easiest step, just go to https://gemstone.builders and start playing!

If the website is down you can also host the frontend yourself by running the following commands

```bash
> cd frontend
> npm install
> npm run start
```

## Deployments

### Sepolia

[Factory : 0x73a7dc5345A6603c3f88cbb850366Cb841512847](https://sepolia.etherscan.io/address/0x73a7dc5345a6603c3f88cbb850366cb841512847)

[Carbon : 0x1bf889cfC18E02ffB61eb61CF19eACb2E3C23b25](https://sepolia.etherscan.io/address/0x1bf889cfC18E02ffB61eb61CF19eACb2E3C23b25)

[Diamond : 0xD9eE089A6Dc5A17785E2a913D6865234d3952190](https://sepolia.etherscan.io/address/0xD9eE089A6Dc5A17785E2a913D6865234d3952190)

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
