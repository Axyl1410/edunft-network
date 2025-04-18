import { loadFixture } from "@nomicfoundation/hardhat-toolbox-viem/network-helpers";
import chai, { expect } from "chai";
import chaiAsPromised from "chai-as-promised";
import hre from "hardhat";
import { getAddress, parseEther } from "viem";

chai.use(chaiAsPromised);

describe("NFT Marketplace Full Flow", function () {
  // Fixture to deploy contracts and set up initial state
  async function deployMarketplaceFixture() {
    const [owner, user1, user2] = await hre.viem.getWalletClients();
    const publicClient = await hre.viem.getPublicClient();

    // Deploy CollectionFactory
    const collectionFactory =
      await hre.viem.deployContract("CollectionFactory");

    // Deploy NFTMarketplace
    const marketplace = await hre.viem.deployContract("NFTMarketplace");

    // Collection details
    const collectionName = "Test NFT";
    const collectionSymbol = "TNFT";
    const collectionImage = "ipfs://collection_image_hash";
    const collectionDescription = "This is a test collection.";

    // User 1 creates a collection
    const tx = await collectionFactory.write.createCollection(
      [
        collectionName,
        collectionSymbol,
        collectionImage,
        collectionDescription,
      ],
      { account: user1.account },
    );
    await publicClient.waitForTransactionReceipt({ hash: tx });

    // Get the created collection address from events (more robust than relying on array index)
    const events = await collectionFactory.getEvents.CollectionCreated();
    expect(events).to.have.lengthOf(1);
    const collectionAddress = events[0].args.collection;
    expect(collectionAddress).to.not.be.undefined;

    // Get contract instance for the created collection
    const nftCollection = await hre.viem.getContractAt(
      "MyNFT",
      collectionAddress!, // Use non-null assertion as we expect it to be defined
      { client: { wallet: user1 } }, // Interact as user1 (the owner)
    );

    // Mint an NFT in the collection to user1
    const tokenURI = "ipfs://token_metadata_hash";
    const mintTx = await nftCollection.write.mint([
      user1.account.address,
      tokenURI,
    ]);
    await publicClient.waitForTransactionReceipt({ hash: mintTx });
    const tokenId = 0n; // Assuming the first token minted has ID 0

    return {
      marketplace,
      collectionFactory,
      nftCollection,
      owner, // Marketplace owner
      user1, // Collection owner and NFT owner
      user2, // Potential buyer
      publicClient,
      collectionName,
      collectionSymbol,
      collectionImage,
      collectionDescription,
      tokenId,
      tokenURI,
    };
  }

  describe("Deployment and Setup", function () {
    it("Should deploy CollectionFactory", async function () {
      const { collectionFactory } = await loadFixture(deployMarketplaceFixture);
      expect(collectionFactory.address).to.match(/^0x[a-fA-F0-9]{40}$/);
    });

    it("Should deploy NFTMarketplace and set owner", async function () {
      const { marketplace, owner } = await loadFixture(
        deployMarketplaceFixture,
      );
      expect(marketplace.address).to.match(/^0x[a-fA-F0-9]{40}$/);
      expect(await marketplace.read.owner()).to.equal(
        getAddress(owner.account.address),
      );
    });

    it("Should allow creating a collection via Factory", async function () {
      const {
        nftCollection,
        user1,
        collectionName,
        collectionSymbol,
        collectionImage,
        collectionDescription,
      } = await loadFixture(deployMarketplaceFixture);
      expect(nftCollection.address).to.match(/^0x[a-fA-F0-9]{40}$/);
      expect(await nftCollection.read.name()).to.equal(collectionName);
      expect(await nftCollection.read.symbol()).to.equal(collectionSymbol);
      expect(await nftCollection.read.owner()).to.equal(
        getAddress(user1.account.address),
      );
      expect(await nftCollection.read.collectionImage()).to.equal(
        collectionImage,
      );
      expect(await nftCollection.read.collectionDescription()).to.equal(
        collectionDescription,
      );
    });

    it("Should mint an NFT to the correct owner with correct URI", async function () {
      const { nftCollection, user1, tokenId, tokenURI } = await loadFixture(
        deployMarketplaceFixture,
      );
      expect(await nftCollection.read.ownerOf([tokenId])).to.equal(
        getAddress(user1.account.address),
      );
      expect(await nftCollection.read.tokenURI([tokenId])).to.equal(tokenURI);
    });
  });

  describe("Marketplace Functionality", function () {
    it("Should allow setting marketplace metadata by owner", async function () {
      const { marketplace, owner, publicClient } = await loadFixture(
        deployMarketplaceFixture,
      );
      const newImage = "ipfs://new_market_image";
      const newDesc = "New marketplace description";

      const tx = await marketplace.write.setContractMetadata(
        [newImage, newDesc],
        { account: owner.account },
      );
      await publicClient.waitForTransactionReceipt({ hash: tx });

      expect(await marketplace.read.contractImage()).to.equal(newImage);
      expect(await marketplace.read.contractDescription()).to.equal(newDesc);
    });

    it("Should prevent non-owner from setting marketplace metadata", async function () {
      const { marketplace, user1 } = await loadFixture(
        deployMarketplaceFixture,
      );
      const newImage = "ipfs://new_market_image";
      const newDesc = "New marketplace description";

      await expect(
        marketplace.write.setContractMetadata([newImage, newDesc], {
          account: user1.account,
        }),
      ).to.be.rejectedWith("OwnableUnauthorizedAccount"); // Or specific error from Ownable
    });

    it("Should allow listing an NFT", async function () {
      const { marketplace, nftCollection, user1, tokenId, publicClient } =
        await loadFixture(deployMarketplaceFixture);
      const price = parseEther("1");

      // User1 needs to approve the marketplace to transfer the NFT
      const approveTx = await nftCollection.write.approve(
        [marketplace.address, tokenId],
        { account: user1.account },
      );
      await publicClient.waitForTransactionReceipt({ hash: approveTx });

      // User1 lists the item
      const listTx = await marketplace.write.listItem(
        [nftCollection.address, tokenId, price],
        { account: user1.account },
      );
      await publicClient.waitForTransactionReceipt({ hash: listTx });

      // Verify NFT is now owned by marketplace
      expect(await nftCollection.read.ownerOf([tokenId])).to.equal(
        getAddress(marketplace.address),
      );

      // Verify listing details
      const listing = await marketplace.read.listings([
        nftCollection.address,
        tokenId,
      ]);
      expect(listing[0]).to.equal(getAddress(user1.account.address)); // seller is at index 0
      expect(listing[1]).to.equal(price); // price is at index 1

      // Verify event
      const listEvents = await marketplace.getEvents.ItemListed();
      expect(listEvents).to.have.lengthOf(1);
      expect(listEvents[0].args.nft).to.equal(
        getAddress(nftCollection.address),
      );
      expect(listEvents[0].args.tokenId).to.equal(tokenId);
      expect(listEvents[0].args.seller).to.equal(
        getAddress(user1.account.address),
      );
      expect(listEvents[0].args.price).to.equal(price);
    });

    it("Should allow buying a listed NFT", async function () {
      const {
        marketplace,
        nftCollection,
        user1,
        user2,
        tokenId,
        publicClient,
      } = await loadFixture(deployMarketplaceFixture);
      const price = parseEther("1");

      // User1 approves and lists
      await nftCollection.write.approve([marketplace.address, tokenId], {
        account: user1.account,
      });
      await marketplace.write.listItem(
        [nftCollection.address, tokenId, price],
        { account: user1.account },
      );

      const sellerBalanceBefore = await publicClient.getBalance({
        address: user1.account.address,
      });

      // User2 buys the item
      const buyTx = await marketplace.write.buyItem(
        [nftCollection.address, tokenId],
        {
          account: user2.account,
          value: price, // Send ETH with the transaction
        },
      );
      const receipt = await publicClient.waitForTransactionReceipt({
        hash: buyTx,
      });

      // Verify NFT ownership change
      expect(await nftCollection.read.ownerOf([tokenId])).to.equal(
        getAddress(user2.account.address),
      );

      // Verify listing is removed
      const listing = await marketplace.read.listings([
        nftCollection.address,
        tokenId,
      ]);
      expect(listing[0]).to.equal(
        getAddress("0x0000000000000000000000000000000000000000"),
      ); // Check for zero address (seller at index 0)
      expect(listing[1]).to.equal(0n); // price at index 1

      // Verify seller received funds (approximately, considering gas costs for buyer)
      const sellerBalanceAfter = await publicClient.getBalance({
        address: user1.account.address,
      });
      expect(sellerBalanceAfter).to.equal(sellerBalanceBefore + price);

      // Verify event
      const buyEvents = await marketplace.getEvents.ItemBought();
      // Note: Event filtering might be needed if other tests run concurrently
      const relevantEvent = buyEvents.find(
        (e) =>
          e.args.tokenId === tokenId &&
          getAddress(e.args.nft!) === getAddress(nftCollection.address),
      );
      expect(relevantEvent).to.not.be.undefined;
      expect(relevantEvent!.args.buyer).to.equal(
        getAddress(user2.account.address),
      );
      expect(relevantEvent!.args.price).to.equal(price);
    });

    it("Should allow canceling a listing", async function () {
      const { marketplace, nftCollection, user1, tokenId, publicClient } =
        await loadFixture(deployMarketplaceFixture);
      const price = parseEther("1");

      // User1 approves and lists
      await nftCollection.write.approve([marketplace.address, tokenId], {
        account: user1.account,
      });
      await marketplace.write.listItem(
        [nftCollection.address, tokenId, price],
        { account: user1.account },
      );

      // User1 cancels the listing
      const cancelTx = await marketplace.write.cancelListing(
        [nftCollection.address, tokenId],
        { account: user1.account },
      );
      await publicClient.waitForTransactionReceipt({ hash: cancelTx });

      // Verify NFT ownership back to user1
      expect(await nftCollection.read.ownerOf([tokenId])).to.equal(
        getAddress(user1.account.address),
      );

      // Verify listing is removed
      const listing = await marketplace.read.listings([
        nftCollection.address,
        tokenId,
      ]);
      expect(listing[0]).to.equal(
        getAddress("0x0000000000000000000000000000000000000000"),
      ); // seller at index 0
      expect(listing[1]).to.equal(0n); // price at index 1

      // Verify event
      const cancelEvents = await marketplace.getEvents.ItemCanceled();
      const relevantEvent = cancelEvents.find(
        (e) =>
          e.args.tokenId === tokenId &&
          getAddress(e.args.nft!) === getAddress(nftCollection.address),
      );
      expect(relevantEvent).to.not.be.undefined;
    });

    // Add more tests:
    // - Failing to buy (insufficient funds, item not listed)
    // - Failing to list (not owner, price 0)
    // - Failing to cancel (not seller, item not listed)
    // - Failing to set metadata (not owner)
    // - Testing MyNFT's setCollectionMetadata
  });
});
