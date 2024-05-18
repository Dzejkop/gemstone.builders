// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {Resource} from "../src/Resource.sol";

contract ResourceTest is Test {
    Resource public counter;

    function setUp() public {
        counter = new Resource("Test", "TST");
    }

    function test_Mint() public {
        counter.mint(address(this), 100);
        assertEq(counter.balanceOf(address(this)), 100);
    }
}
