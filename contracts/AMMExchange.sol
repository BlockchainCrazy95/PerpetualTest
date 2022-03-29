// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract AMMExchange {
    using SafeMath for uint256;
    // Reserves for TWD
    uint256 Rt;
    // Reserves for USD
    uint256 Ru;

    constructor(
        uint256 _rt,
        uint256 _ru
    ) {
        Rt = _rt;
        Ru = _ru;
    }

    function calcExchange(uint256 _x) public view returns(uint256 _y) {
        _y = Ru.sub(Rt.mul(Ru).div(Rt.add(_x)));
    }

    function exchange(uint256 _x) external {
        uint256 _y = calcExchange(_x);
        Rt = Rt.add(_x);
        Ru = Ru.sub(_y);
    }
    
    function getRt() external view returns(uint256) {
        return Rt;
    }

    function getRu() external view returns(uint256) {
        return Ru;
    }
}