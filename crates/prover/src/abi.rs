alloy_sol_types::sol! {
    #[derive(Debug)]
    #[sol(rpc)]
    contract Factory is Ownable {
        // Mapping of address to factory hash
        // A player must commit to a given factory
        mapping(address => uint256) public factoryHashes;

        // The state of a given factory
        mapping(uint256 => uint256) public factoryStates;

        // Balances of resources per each player
        mapping(address => uint256[2]) public balances;

        function updateFactory(uint256 factoryHash) external;
        function step(
            uint256[2] calldata pa,
            uint256[2][2] calldata pb,
            uint256[2] calldata pc,
            uint256[7] calldata publicInputs
        ) external;
    }
}
