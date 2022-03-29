// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract LeverageAMMExchange {
    using SafeMath for uint256;
    // Reserves for TWD
    uint256 Rt;
    // Reserves for USD
    uint256 Ru;
    mapping (address => uint256) _deposits;
    mapping (address => uint256) _buyInfo;
    // Leverage
    uint16 maxLeverage = 10;

    constructor(
        uint256 _rt,
        uint256 _ru
    ) {
        Rt = _rt;
        Ru = _ru;
    }

    function setMaxLeverage(uint16 _leverage) external {
        maxLeverage = _leverage;
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

    function convertAtoB(uint256 _assetA, uint256 _leverage) public pure returns(uint256 _assetB) {
        _assetB = _assetA.mul(_leverage);
    }

    function convertBtoA(uint256 _assetB, uint256 _leverage) public pure returns(uint256 _assetA) {
        _assetA = _assetB.div(_leverage);
    }

    function deposit(uint256 _assetA) public {
        _deposits[msg.sender] = _deposits[msg.sender].add(_assetA);
    }

    function getRemainedAmount(address _user) public view returns(uint256){
        return _deposits[_user].mul(maxLeverage).sub(_buyInfo[_user]);
    }

    function openPosition(uint256 _leverage) public {
        require(_deposits[msg.sender].mul(maxLeverage) >= _buyInfo[msg.sender].add(_deposits[msg.sender].mul(_leverage)), "Insufficient");
        _buyInfo[msg.sender] = _buyInfo[msg.sender].add(_deposits[msg.sender].mul(_leverage));
    }
}