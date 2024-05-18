# zk-hack-diamonds

## Running locally

1. Start anvil
```
> anvil
```

2. Deploy & setup the contracts
```
> cd contracts
> source deployLocal.sh
> # THE COMMAND BELOW NEEDS TO BE RERUN TO CLEANUP THE STATE
> # MUST BE RUN IN THE SAME SESSION AS deployLocal.sh
> # AS IT DEPENDS ON THE EXPORTED ENV VARS
> bash registerFactory.sh
```

3. If cleaning up the state
```
> rm -rf state
```

4. Start prover
```
> cargo run --release -p prover
```

And cancel it after the first transaction

5. Update the local state
In the file `./state/game.json`

Ensure the the factory looks like this
```
1  0  0  0  0
2  0  0  0  0
2  0  0  0  0
2  0  0  0  0
3  0  0  0  0
```

1. Start the prover again
```
> cargo run --release -p prover
```
