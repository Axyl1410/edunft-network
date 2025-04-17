// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        uint256 price;
    }
    mapping(address => mapping(uint256 => Listing)) public listings;

    event ItemListed(
        address indexed nft,
        uint256 indexed tokenId,
        address seller,
        uint256 price
    );
    event ItemCanceled(address indexed nft, uint256 indexed tokenId);
    event ItemBought(
        address indexed nft,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );

    function listItem(address nft, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price>0");
        IERC721(nft).transferFrom(msg.sender, address(this), tokenId);
        listings[nft][tokenId] = Listing(msg.sender, price);
        emit ItemListed(nft, tokenId, msg.sender, price);
    }

    function cancelListing(address nft, uint256 tokenId) external {
        Listing memory l = listings[nft][tokenId];
        require(l.seller == msg.sender, "Not seller");
        delete listings[nft][tokenId];
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);
        emit ItemCanceled(nft, tokenId);
    }

    function buyItem(
        address nft,
        uint256 tokenId
    ) external payable nonReentrant {
        Listing memory l = listings[nft][tokenId];
        require(l.price > 0, "Not listed");
        require(msg.value == l.price, "Wrong price");
        delete listings[nft][tokenId];
        (bool ok, ) = payable(l.seller).call{value: msg.value}("");
        require(ok, "Payment failed");
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);
        emit ItemBought(nft, tokenId, msg.sender, l.price);
    }
}
