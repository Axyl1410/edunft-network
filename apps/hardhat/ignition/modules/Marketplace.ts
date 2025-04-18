import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const MarketplaceModule = buildModule("MarketplaceModule", (m) => {
  // Deploy CollectionFactory - it has no constructor arguments
  const collectionFactory = m.contract("CollectionFactory");

  // Deploy NFTMarketplace - it has no constructor arguments
  // The Ownable constructor is called implicitly with msg.sender (the deployer)
  const nftMarketplace = m.contract("NFTMarketplace");

  // Return the deployed contract instances so they can be accessed after deployment
  return { collectionFactory, nftMarketplace };
});

export default MarketplaceModule;
