// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";
import {console} from "forge-std/console.sol";
import {Factory} from "../src/Factory.sol";
import {Resource} from "../src/Resource.sol";

contract FactoryTest is Test {
    Factory public factory;

    Resource[2] public resources;

    function setUp() public {
        factory = new Factory();

        resources[0] = new Resource("Carbon", "CRBN");
        resources[1] = new Resource("Diamond", "DMND");

        factory.registerResrouce(0, resources[0]);
        factory.registerResrouce(1, resources[1]);
    }

    function test_Lock() public {
        console.log("Locking resources");

        resources[0].mint(address(this), 1000);
        resources[1].mint(address(this), 1000);

        resources[0].approve(address(factory), 1000);
        resources[1].approve(address(factory), 1000);

        assertEq(resources[0].balanceOf(address(this)), 1000);
        assertEq(resources[1].balanceOf(address(this)), 1000);

        factory.lock([100, 100]);

        assertEq(resources[0].balanceOf(address(this)), 900);
        assertEq(resources[1].balanceOf(address(this)), 900);

        assertEq(resources[0].balanceOf(address(factory)), 100);
        assertEq(resources[1].balanceOf(address(factory)), 100);

        factory.payout([100, 100]);

        assertEq(resources[0].balanceOf(address(factory)), 0);
        assertEq(resources[1].balanceOf(address(factory)), 0);

        assertEq(resources[0].balanceOf(address(this)), 1000);
        assertEq(resources[1].balanceOf(address(this)), 1000);
    }
}
