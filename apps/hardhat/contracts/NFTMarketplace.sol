// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/// @title Simple NFT Marketplace
/// @dev Sellers escrow their NFT here; buyers pay and receive the NFT immediately.
contract NFTMarketplace is ReentrancyGuard {
    struct Listing {
        address seller;
        address collection;
        uint256 tokenId;
        uint256 price;
    }

    uint256 public listingCount;
    mapping(uint256 => Listing) public listings;

    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address collection,
        uint256 tokenId,
        uint256 price
    );
    event Sale(uint256 indexed listingId, address indexed buyer);
    event ListingCancelled(uint256 indexed listingId);

    /// @notice Create a new listing; transfers NFT into escrow
    function createListing(
        address collection,
        uint256 tokenId,
        uint256 price
    ) external nonReentrant {
        require(price > 0, "Price must be > 0");
        IERC721 nft = IERC721(collection);
        require(nft.ownerOf(tokenId) == msg.sender, "Not the owner");
        require(
            nft.getApproved(tokenId) == address(this) ||
                nft.isApprovedForAll(msg.sender, address(this)),
            "Marketplace not approved"
        );

        nft.transferFrom(msg.sender, address(this), tokenId);
        listingCount++;
        listings[listingCount] = Listing(
            msg.sender,
            collection,
            tokenId,
            price
        );
        emit Listed(listingCount, msg.sender, collection, tokenId, price);
    }

    /// @notice Purchase a listed NFT; ETH is forwarded to seller
    function buy(uint256 listingId) external payable nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.price > 0, "Listing does not exist");
        require(msg.value >= listing.price, "Insufficient payment");

        uint256 price = listing.price;
        address seller = listing.seller;
        address collection = listing.collection;
        uint256 tokenId = listing.tokenId;

        delete listings[listingId];

        payable(seller).transfer(price);
        IERC721(collection).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        emit Sale(listingId, msg.sender);
    }

    /// @notice Cancel your own listing and get your NFT back
    function cancelListing(uint256 listingId) external nonReentrant {
        Listing storage listing = listings[listingId];
        require(listing.seller == msg.sender, "Not the seller");

        address collection = listing.collection;
        uint256 tokenId = listing.tokenId;

        delete listings[listingId];

        IERC721(collection).safeTransferFrom(
            address(this),
            msg.sender,
            tokenId
        );
        emit ListingCancelled(listingId);
    }
}
