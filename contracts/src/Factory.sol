// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {IERC20} from "openzeppelin-contracts/contracts/token/ERC20/IERC20.sol";
import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";
import {Groth16Verifier} from "./groth16_verifier.sol";
import {Resource} from "./Resource.sol";

contract Factory is Ownable {
    uint256 constant NUM_RESOURCES = 2;
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
    Resource[NUM_RESOURCES] public resourceTokens;

    // Balances of resources per each player
    mapping(address => uint256[NUM_RESOURCES]) public balances;

    function registerResource(uint256 id, Resource token) external onlyOwner {
        resourceTokens[id] = token;
    }

    function updateFactory(uint256 factoryHash) external {
        factoryHashes[msg.sender] = factoryHash;

        // Clear state
        factoryStates[factoryHash] = CLEAR_STATE_HASH;
    }

    // Lock resources
    function lock(uint8[2] calldata amounts) external {
        for (uint256 i = 0; i < NUM_RESOURCES; i++) {
            require(resourceTokens[i].balanceOf(msg.sender) >= amounts[i]);
        }

        for (uint256 i = 0; i < NUM_RESOURCES; i++) {
            resourceTokens[i].transferFrom(msg.sender, address(this), amounts[i]);
            balances[msg.sender][i] = amounts[i];
        }
    }

    function payout(uint8[2] calldata amounts) external {
        for (uint256 i = 0; i < NUM_RESOURCES; i++) {
            require(balances[msg.sender][i] >= amounts[i]);
        }
        for (uint256 i = 0; i < NUM_RESOURCES; i++) {
            resourceTokens[i].transfer(msg.sender, amounts[i]);
        }
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

        uint256[NUM_RESOURCES] memory resourceInputs = [publicInputs[5], publicInputs[6]];
        uint256[NUM_RESOURCES] memory resourceOutputs = [publicInputs[1], publicInputs[2]];
        uint256 outputStateHash = publicInputs[0];

        require(factoryHashes[msg.sender] == factoryHash);
        require(factoryStates[factoryHash] == factoryState);

        // Require input to match balance
        for (uint256 i = 0; i < NUM_RESOURCES; i++) {
            // Must have at least that much in their balance
            require(balances[msg.sender][i] >= resourceInputs[i]);
        }

        // Verify the proof
        require(verifier.verifyProof(pa, pb, pc, publicInputs));

        // Update the state
        factoryStates[factoryHash] = outputStateHash;

        // Mint or burn resources
        for (uint256 i = 0; i < NUM_RESOURCES; i++) {
            if (resourceOutputs[i] > resourceInputs[i]) {
                resourceTokens[i].mint(msg.sender, resourceOutputs[i] - resourceInputs[i]);
            } else {
                resourceTokens[i].burn(msg.sender, resourceInputs[i] - resourceOutputs[i]);
            }
        }

        // Update the balances
        for (uint256 i = 0; i < NUM_RESOURCES; i++) {
            balances[msg.sender][i] -= resourceInputs[i];
            balances[msg.sender][i] += resourceOutputs[i];
        }
    }
}
