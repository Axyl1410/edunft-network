// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract MyNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    string public collectionImage;
    string public collectionDescription;

    constructor(
        string memory name_,
        string memory symbol_,
        string memory image_,
        string memory description_
    )
        ERC721(name_, symbol_)
        Ownable(msg.sender) // Call Ownable constructor
    {
        collectionImage = image_;
        collectionDescription = description_;
    }

    function mint(
        address to,
        string calldata tokenURI_
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);
        return tokenId;
    }

    // Optional: Function to update collection metadata later
    function setCollectionMetadata(
        string memory image_,
        string memory description_
    ) external onlyOwner {
        collectionImage = image_;
        collectionDescription = description_;
    }
}
