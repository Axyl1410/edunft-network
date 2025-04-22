// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface INFTCollection {
    function mint(address to) external;
}

/// @title NFT Drop Contract
/// @dev Users must pick an allowed NFTCollection address before calling mint()
contract NFTDrop is Ownable {
    uint256 public price;
    mapping(address => bool) public allowedCollections;

    event CollectionAllowed(address indexed collection);
    event CollectionDisallowed(address indexed collection);
    event NFTMinted(address indexed collection, address indexed to);

    constructor(uint256 _price) {
        price = _price;
    }

    /// @notice Admin can update the mint price
    function setPrice(uint256 _price) external onlyOwner {
        price = _price;
    }

    /// @notice Allow a specific NFTCollection contract to be used
    function allowCollection(address collection) external onlyOwner {
        allowedCollections[collection] = true;
        emit CollectionAllowed(collection);
    }

    /// @notice Disallow a specific NFTCollection contract
    function disallowCollection(address collection) external onlyOwner {
        allowedCollections[collection] = false;
        emit CollectionDisallowed(collection);
    }

    /// @notice Mint from a chosen, pre-approved collection by paying `price`
    function mint(address collection) external payable {
        require(
            allowedCollections[collection],
            "NFTDrop: collection not allowed"
        );
        require(msg.value >= price, "NFTDrop: insufficient payment");

        INFTCollection(collection).mint(msg.sender);
        emit NFTMinted(collection, msg.sender);
    }

    /// @notice Withdraw all ETH to owner
    function withdraw() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
    }
}
