// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

// Inherit from Ownable to manage who can set metadata
contract NFTMarketplace is Ownable(msg.sender) {
    struct Listing {
        address seller;
        uint256 price;
    }

    // Contract metadata
    string public contractImage;
    string public contractDescription;

    // Constructor is now empty as Ownable is initialized in the inheritance list
    constructor() {
        // Ownable constructor called with msg.sender above
    }

    // Function to set contract metadata (only owner)
    function setContractMetadata(
        string memory image_,
        string memory description_
    ) external onlyOwner {
        contractImage = image_;
        contractDescription = description_;
    }

    // nft contract => tokenId => Listing
    mapping(address => mapping(uint256 => Listing)) public listings;

    // simple reentrancy guard
    bool private _locked;

    modifier nonReentrant() {
        require(!_locked, "Reentrant call");
        _locked = true;
        _;
        _locked = false;
    }

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

    /// @notice List an NFT for sale. Transfers NFT into marketplace custody.
    function listItem(address nft, uint256 tokenId, uint256 price) external {
        require(price > 0, "Price must be > 0");
        IERC721(nft).transferFrom(msg.sender, address(this), tokenId);
        listings[nft][tokenId] = Listing(msg.sender, price);
        emit ItemListed(nft, tokenId, msg.sender, price);
    }

    /// @notice Cancel a listing and return NFT to seller
    function cancelListing(address nft, uint256 tokenId) external {
        Listing memory l = listings[nft][tokenId];
        require(l.seller == msg.sender, "Not seller");
        delete listings[nft][tokenId];
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);
        emit ItemCanceled(nft, tokenId);
    }

    /// @notice Buy a listed NFT. Sends funds to seller, transfers NFT to buyer.
    function buyItem(
        address nft,
        uint256 tokenId
    ) external payable nonReentrant {
        Listing memory l = listings[nft][tokenId];
        require(l.price > 0, "Not listed");
        require(msg.value == l.price, "Incorrect price");

        // clear listing first to prevent reentrancy
        delete listings[nft][tokenId];

        // pay seller
        (bool ok, ) = payable(l.seller).call{value: msg.value}("");
        require(ok, "Payment failed");

        // transfer NFT to buyer
        IERC721(nft).transferFrom(address(this), msg.sender, tokenId);
        emit ItemBought(nft, tokenId, msg.sender, l.price);
    }
}
