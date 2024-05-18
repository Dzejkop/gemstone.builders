// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Groth16Verifier} from "./groth16_verifier.sol";

contract Factory is Ownable {
    uint256 CLEAR_STATE_HASH =
        19566192433199768019714648174629306541205224169280620721690837488103428951668;

    Groth16Verifier verifier = new Groth16Verifier();

    constructor() Ownable(msg.sender) {
        this;
    }

    // Mapping of address to factory hash
    // A player must commit to a given factory
    mapping(address => uint256) public factoryHashes;

    // The state of a given factory
    mapping(uint256 => uint256) public factoryStates;

    // Resource token contracts
    IERC20[2] public resourceTokens;

    // Balances of resources per each player
    mapping(address => uint256[2]) public balances;

    function registerResource(uint256 id, IERC20 token) external onlyOwner {
        resourceTokens[id] = token;
    }

    function updateFactory(uint256 factoryHash) external {
        factoryHashes[msg.sender] = factoryHash;

        // Clear state
        factoryStates[factoryHash] = CLEAR_STATE_HASH;
    }

    // Lock resources
    function lock(uint8[2] calldata amounts) external {
        require(resourceTokens[0].balanceOf(msg.sender) >= amounts[0]);
        require(resourceTokens[1].balanceOf(msg.sender) >= amounts[1]);

        resourceTokens[0].transferFrom(msg.sender, address(this), amounts[0]);
        resourceTokens[1].transferFrom(msg.sender, address(this), amounts[1]);

        balances[msg.sender][0] = amounts[0];
        balances[msg.sender][1] = amounts[1];
    }

    function payout(uint8[2] calldata amounts) external {
        require(balances[msg.sender][0] >= amounts[0]);
        require(balances[msg.sender][1] >= amounts[1]);

        resourceTokens[0].transfer(msg.sender, amounts[0]);
        resourceTokens[1].transfer(msg.sender, amounts[1]);
    }

    function userBalance() external view returns (uint256[2] memory) {
        return balances[msg.sender];
    }

    function step(
        uint256[2] calldata pa,
        uint256[2][2] calldata pb,
        uint256[2] calldata pc,
        uint256[7] calldata publicInputs
    ) external {
        // Unpack the public inputs
        uint256 factoryHash = publicInputs[3];
        uint256 factoryState = publicInputs[4];

        uint256[2] memory resourceInputs = [publicInputs[5], publicInputs[6]];
        uint256[2] memory resourceOutputs = [publicInputs[1], publicInputs[2]];
        uint256 outputStateHash = publicInputs[0];

        require(factoryHashes[msg.sender] == factoryHash);
        require(factoryStates[factoryHash] == factoryState);

        uint256[2] memory userBalances = balances[msg.sender];

        // Require input to match balance
        require(userBalances[0] >= resourceInputs[0]);
        require(userBalances[1] >= resourceInputs[1]);

        // Verify the proof
        require(verifier.verifyProof(pa, pb, pc, publicInputs));

        // Update the state
        factoryStates[factoryHash] = outputStateHash;

        // Update the balances
        userBalances[0] -= resourceInputs[0];
        userBalances[1] -= resourceInputs[1];
        userBalances[0] += resourceOutputs[0];
        userBalances[1] += resourceOutputs[1];
    }
}
