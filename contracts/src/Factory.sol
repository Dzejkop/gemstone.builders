// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract Factory is Ownable {
    constructor() Ownable(msg.sender) {
        this;
    }

    // Mapping of address to factory hash
    // A player must commit to a given factory
    mapping(address => bytes32) public factoryHashes;

    // The state of a given factory
    mapping(bytes32 => bytes32) public factoryStates;

    function updateFactory(bytes32 factoryHash) external {
        factoryHashes[msg.sender] = factoryHash;
        factoryStates[factoryHash] = 0x0000000000000000000000000000000000000000000000000000000000000000;
    }
}
