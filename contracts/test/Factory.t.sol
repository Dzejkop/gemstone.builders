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

        // resources[0] = new Resource("Carbon", "CRBN");
        // resources[1] = new Resource("Diamond", "DMND");

        // factory.registerResource(0, resources[0]);
        // factory.registerResource(1, resources[1]);

        // resources[0].mint(address(this), 1000);
        // resources[1].mint(address(this), 1000);

        // resources[0].transferOwnership(address(factory));
        // resources[1].transferOwnership(address(factory));
    }

    function test_Lock() public {
        // console.log("Locking resources");

        // resources[0].approve(address(factory), 1000);
        // resources[1].approve(address(factory), 1000);

        // assertEq(resources[0].balanceOf(address(this)), 1000);
        // assertEq(resources[1].balanceOf(address(this)), 1000);

        // factory.lock([100, 100]);

        // assertEq(resources[0].balanceOf(address(this)), 900);
        // assertEq(resources[1].balanceOf(address(this)), 900);

        // assertEq(resources[0].balanceOf(address(factory)), 100);
        // assertEq(resources[1].balanceOf(address(factory)), 100);

        // factory.payout([100, 100]);

        // assertEq(resources[0].balanceOf(address(factory)), 0);
        // assertEq(resources[1].balanceOf(address(factory)), 0);

        // assertEq(resources[0].balanceOf(address(this)), 1000);
        // assertEq(resources[1].balanceOf(address(this)), 1000);
    }

    function test_Step() public {
        resources[0].approve(address(factory), 1000);
        resources[1].approve(address(factory), 1000);

        assertEq(resources[0].balanceOf(address(this)), 1000);
        assertEq(resources[1].balanceOf(address(this)), 1000);

        factory.lock([100, 100]);

        factory.updateFactory(
            14134542808059336215610642737102186593698642764541150088606982554532975269907
        );

        factory.step(
            [
                0x1f1be4c9befd52dd76a45babf52cdca8749f4c31e41e2567f89e01664664e0e5,
                0x096cc295b412ccf3f8d56d6cb24173cfe635e04f1131d01ff2f384982b6e0e34
            ],
            [
                [
                    0x19df061491df2c2625fd4255d92209647ddd1aeca8574f472c71f81fb6815fa4,
                    0x2ff3fcade9d98315e1eefc2df64df8f79720a6d018ceb4867e68a8ae981d3dfd
                ],
                [
                    0x252526f2b4e47ea5069be8fa8d1f2021e492e96aad429059bd1e988a181a1e17,
                    0x0daf2438d76d4c50ad591508d90650f473fbb22b28f0b2be82be85c30f8a9adb
                ]
            ],
            [
                0x0a72bc1cb1112bf0ce2a55a6f95734bf9bd8daa8e1619a5b96c7e1cd601888e6,
                0x025dd8ce6fc1dc56a3ebf10c212a84f2551d62a0ed1d5e5b023c30ca41331a6a
            ],
            [
                0x17c242005c65149a741860ca3117635bee4e5e95547be68f010d183d6e238ce1,
                0x0000000000000000000000000000000000000000000000000000000000000000,
                0x0000000000000000000000000000000000000000000000000000000000000000,
                0x1f3fde233544f53b47e48c3a58f70028e742b1a4487d61d3c407d7acba28d813,
                0x2b42128d30056a45fc11b7ee56b9825eedbbfc27a65730dc7abd545344a78e74,
                0x0000000000000000000000000000000000000000000000000000000000000000,
                0x0000000000000000000000000000000000000000000000000000000000000000
            ]
        );

        uint256[2] memory balances = factory.userBalance(address(this));

        assertEq(balances[0], 100);
        assertEq(balances[1], 100);
    }
}
