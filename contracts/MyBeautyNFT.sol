// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./SalesActivation.sol";

contract MyBeautyNFT is ERC721Enumerable, Ownable, SalesActivation {
    /**
     * Variables
     */
    string public nftURI;
    uint256 public price = 0.01 ether;
    uint256 public max_sales_beauty = 100;
    uint256 public presaleListMax = 2;
    mapping(address => bool) public presaleList;
    mapping(address => uint256) public presaleListClaimed;
    address public claimFundAddress;

    /**
     * Events
     */
    event Presale(uint256 indexed quantity, address indexed buyer);
    event Mint(uint256 indexed quantity, address indexed buyer);

    constructor(
        string memory _nftURI,
        uint256 _publicSalesStartTime,
        uint256 _preSalesStartTime,
        uint256 _preSalesEndTime,
        address _claimFundAddress
    ) ERC721("MyBeauty", "MB") SalesActivation(_publicSalesStartTime, _preSalesStartTime, _preSalesEndTime) {
        setBaseURI(_nftURI);
        claimFundAddress = _claimFundAddress;
    }

    /**
     * Functions
     */
    function presale(uint256 beautyNumber) external payable isPreSalesActive {
        uint256 supply = totalSupply();
        require(presaleList[msg.sender], "You are not on the Allowlist");
        require(presaleListClaimed[msg.sender] + beautyNumber <= presaleListMax, "Purchase exceeds max allowed");
        require(msg.value >= price * beautyNumber, "You don't send enough eth to purchase the beauties");
        require(supply + beautyNumber <= max_sales_beauty, "Exceeds maximum beauty supply");
        require(tx.origin == msg.sender, "Contracts are not allowed to mint");

        for (uint256 i = 0; i < beautyNumber; i++) {
            presaleListClaimed[msg.sender] += 1;
            _safeMint(msg.sender, supply + i);
        }
        emit Presale(beautyNumber, msg.sender);
    }

    function mint(uint256 beautyNumber) external payable isPublicSalesActive {
        uint256 supply = totalSupply();
        require(supply + beautyNumber <= max_sales_beauty, "Exceeds maximum beauty supply");
        require(beautyNumber > 0, "You cannot mint 0 Beauty.");
        require(beautyNumber <= 50, "You are not allowed to buy this many beauty at once.");
        require(msg.value >= price * beautyNumber, "You don't send enough eth to purchase the beauties");
        require(tx.origin == msg.sender, "Contracts not allowed");

        for (uint256 i = 0; i < beautyNumber; i++) {
            _safeMint(msg.sender, supply + i);
        }
        emit Mint(beautyNumber, msg.sender);
    }

    function withdraw() external onlyOwner {
        uint256 _balance = address(this).balance;
        require(payable(claimFundAddress).send(_balance));
    }

    /**
     * Getter/Setter
     */
    function addToPresaleList(address[] calldata _presaleList) external onlyOwner {
        for (uint256 i = 0; i < _presaleList.length; i++) {
            presaleList[_presaleList[i]] = true;
            presaleListClaimed[_presaleList[i]] > 0 ? presaleListClaimed[_presaleList[i]] : 0;
        }
    }

    function onPresaleList(address _presaleCheck) public view returns (bool) {
        return presaleList[_presaleCheck];
    }

    function removeFromPresaleList(address[] calldata _removeList) external onlyOwner {
        for (uint256 i = 0; i < _removeList.length; i++) {
            presaleList[_removeList[i]] = false;
        }
    }

    function setBaseURI(string memory _uri) public onlyOwner {
        nftURI = _uri;
    }

    function setTotalSales(uint256 _totalBeauty) external onlyOwner {
        max_sales_beauty = _totalBeauty;
    }

    function setpresaleListMax(uint256 _maxPresaleListMax) external onlyOwner {
        presaleListMax = _maxPresaleListMax;
    }

    function setPrice(uint256 _newPrice) external onlyOwner {
        price = _newPrice;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return nftURI;
    }
}
