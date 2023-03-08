// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract SalesActivation is Ownable {
    /**
     * Variables
     */
    uint256 public publicSalesStartTime;
    uint256 public preSalesStartTime;
    uint256 public preSalesEndTime;

    /**
     * Modifiers
     */
    modifier isPublicSalesActive() {
        require(isPublicSalesActivated(), "Public sales not started");
        _;
    }

    modifier isPreSalesActive() {
        require(isPreSalesActivated(), "Presales not started");
        _;
    }

    constructor(uint256 _publicSalesStartTime, uint256 _preSalesStartTime, uint256 _preSalesEndTime) {
        publicSalesStartTime = _publicSalesStartTime;
        preSalesStartTime = _preSalesStartTime;
        preSalesEndTime = _preSalesEndTime;
    }

    /**
     * Functions
     */
    function isPublicSalesActivated() public view returns (bool) {
        return publicSalesStartTime > 0 && block.timestamp >= publicSalesStartTime;
    }

    function setPublicSalesTime(uint256 _startTime) external onlyOwner {
        publicSalesStartTime = _startTime;
    }

    function isPreSalesActivated() public view returns (bool) {
        return
            preSalesStartTime > 0 &&
            preSalesEndTime > 0 &&
            block.timestamp >= preSalesStartTime &&
            block.timestamp <= preSalesEndTime;
    }

    function setPreSalesTime(uint256 _startTime, uint256 _endTime) external onlyOwner {
        require(_endTime >= _startTime, "PreSalesActivation: End time should be later than start time");
        preSalesStartTime = _startTime;
        preSalesEndTime = _endTime;
    }
}
