// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Ownable} from "openzeppelin-contracts/contracts/access/Ownable.sol";

contract Factory is Ownable {
    constructor() Ownable(msg.sender) {
        this;
    }
}
