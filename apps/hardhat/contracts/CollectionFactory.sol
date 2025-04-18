// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./MyNFT.sol";

contract CollectionFactory {
    address[] public collections;
    event CollectionCreated(address indexed collection, address indexed owner);

    function createCollection(
        string calldata name_,
        string calldata symbol_,
        string calldata image_,
        string calldata description_
    ) external {
        // Pass metadata to MyNFT constructor
        MyNFT col = new MyNFT(name_, symbol_, image_, description_);
        col.transferOwnership(msg.sender);
        collections.push(address(col));
        emit CollectionCreated(address(col), msg.sender);
    }

    function allCollections() external view returns (address[] memory) {
        return collections;
    }
}
