import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function main() {
  console.log("Starting deployment process...");
  
  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await deployer.provider?.getBalance(deployer.address) || 0), "ETH");

  // Get addresses from .env
  const defaultAdmin = process.env.DEFAULT_ADMIN_ADDRESS || deployer.address;
  const systemTreasury = process.env.SYSTEM_TREASURY_ADDRESS || deployer.address;
  const tokenName = process.env.TOKEN_NAME || "Forma Sketchpad";
  const tokenSymbol = process.env.TOKEN_SYMBOL || "TIA";

  console.log("\nUsing configuration from .env:");
  console.log("- Default Admin:", defaultAdmin);
  console.log("- System Treasury:", systemTreasury);
  console.log("- Token Name:", tokenName);
  console.log("- Token Symbol:", tokenSymbol);

  console.log("\nDeploying QuestionReward contract...");
  const QuestionReward = await ethers.getContractFactory("QuestionReward");
  console.log("Contract factory created");

  const questionReward = await QuestionReward.deploy(
    defaultAdmin,
    tokenName,
    tokenSymbol,
    systemTreasury
  );

  console.log("\nWaiting for deployment transaction...");
  await questionReward.waitForDeployment();
  const contractAddress = await questionReward.getAddress();
  console.log("\nDeployment successful!");
  console.log("QuestionReward contract deployed to:", contractAddress);

  // Verify roles
  console.log("\nVerifying roles...");
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  const QUESTION_CREATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("QUESTION_CREATOR_ROLE"));
  const DEFAULT_ADMIN_ROLE = ethers.keccak256(ethers.toUtf8Bytes("DEFAULT_ADMIN_ROLE"));

  const hasMinterRole = await questionReward.hasRole(MINTER_ROLE, defaultAdmin);
  const hasCreatorRole = await questionReward.hasRole(QUESTION_CREATOR_ROLE, defaultAdmin);
  const hasAdminRole = await questionReward.hasRole(DEFAULT_ADMIN_ROLE, defaultAdmin);

  console.log("Default Admin has MINTER_ROLE:", hasMinterRole);
  console.log("Default Admin has QUESTION_CREATOR_ROLE:", hasCreatorRole);
  console.log("Default Admin has DEFAULT_ADMIN_ROLE:", hasAdminRole);

  // Verify treasury
  const treasury = await questionReward.systemTreasury();
  console.log("\nSystem Treasury address:", treasury);
  console.log("Expected Treasury address:", systemTreasury);
  console.log("Treasury address matches:", treasury.toLowerCase() === systemTreasury.toLowerCase());

  console.log("\nDeployment process completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nDeployment failed!");
    console.error("Error details:", error);
    process.exit(1);
  }); 