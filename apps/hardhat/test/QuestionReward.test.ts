import { expect } from "chai";
import { ethers } from "hardhat";
import { QuestionReward } from "../typechain-types";
import { SignerWithAddress } from "@nomicfoundation/hardhat-ethers/signers";

describe("QuestionReward", function () {
  let questionReward: QuestionReward & {
    mint: (to: string, amount: bigint) => Promise<any>;
  };
  let owner: SignerWithAddress;
  let questionCreator: SignerWithAddress;
  let answerer: SignerWithAddress;
  let treasury: SignerWithAddress;
  let poorUser: SignerWithAddress;
  const questionId = ethers.keccak256(ethers.toUtf8Bytes("test-question"));
  const rewardAmount = ethers.parseEther("1.0"); // 1 token

  beforeEach(async function () {
    [owner, questionCreator, answerer, treasury, poorUser] = await ethers.getSigners();
    console.log("Deploying contract...");
    console.log("Owner:", owner.address);
    console.log("Question Creator:", questionCreator.address);
    console.log("Answerer:", answerer.address);
    console.log("Treasury:", treasury.address);
    console.log("Poor User:", poorUser.address);

    // Deploy contract
    const QuestionReward = await ethers.getContractFactory("QuestionReward");
    questionReward = await QuestionReward.deploy(
      owner.address,
      "Forma Sketchpad",
      "TIA",
      treasury.address
    ) as QuestionReward & {
      mint: (to: string, amount: bigint) => Promise<any>;
    };
    await questionReward.waitForDeployment();
    console.log("Contract deployed at:", await questionReward.getAddress());

    // Verify contract deployment
    const contractAddress = await questionReward.getAddress();
    expect(contractAddress).to.not.equal(ethers.ZeroAddress);
    console.log("Contract address verified");

    // Grant QUESTION_CREATOR_ROLE to questionCreator
    const QUESTION_CREATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("QUESTION_CREATOR_ROLE"));
    await questionReward.grantRole(QUESTION_CREATOR_ROLE, questionCreator.address);
    console.log("QUESTION_CREATOR_ROLE granted to:", questionCreator.address);

    // Verify role assignment
    const hasCreatorRole = await questionReward.hasRole(QUESTION_CREATOR_ROLE, questionCreator.address);
    expect(hasCreatorRole).to.be.true;
    console.log("Role assignment verified");

    // Mint tokens to questionCreator using owner account
    console.log("Minting tokens to questionCreator...");
    await questionReward.connect(owner).mint(questionCreator.address, ethers.parseEther("10.0"));
    
    // Verify token balance
    const balance = await questionReward.balanceOf(questionCreator.address);
    expect(balance).to.equal(ethers.parseEther("10.0"));
    console.log("Token balance verified:", ethers.formatEther(balance));
  });

  describe("Token Minting", function () {
    it("Should allow minting 0 tokens", async function () {
      const initialBalance = await questionReward.balanceOf(poorUser.address);
      await questionReward.connect(owner).mint(poorUser.address, 0);
      const finalBalance = await questionReward.balanceOf(poorUser.address);
      expect(finalBalance).to.equal(initialBalance);
    });

    it("Should fail if non-minter tries to mint", async function () {
      await expect(
        questionReward.connect(poorUser).mint(poorUser.address, ethers.parseEther("1.0"))
      ).to.be.revertedWith("Not authorized");
    });
  });

  describe("Question Creation", function () {
    it("Should allow authorized user to create question", async function () {
      await questionReward.connect(questionCreator).createQuestion(questionId, rewardAmount);
      const question = await questionReward.getQuestionDetails(questionId);
      
      expect(question.author).to.equal(questionCreator.address);
      expect(question.rewardAmount).to.equal(rewardAmount);
      expect(question.isActive).to.be.true;
      expect(question.isAnswered).to.be.false;
      expect(question.acceptedAnswer).to.equal(ethers.ZeroAddress);
    });

    it("Should fail if user is not authorized", async function () {
      await expect(
        questionReward.connect(answerer).createQuestion(questionId, rewardAmount)
      ).to.be.revertedWith("Not authorized");
    });

    it("Should fail if reward amount is zero", async function () {
      await expect(
        questionReward.connect(questionCreator).createQuestion(questionId, 0)
      ).to.be.revertedWith("Reward amount must be greater than 0");
    });

    it("Should fail if user has insufficient balance", async function () {
      // Grant role to poorUser but don't mint any tokens
      const QUESTION_CREATOR_ROLE = ethers.keccak256(ethers.toUtf8Bytes("QUESTION_CREATOR_ROLE"));
      await questionReward.grantRole(QUESTION_CREATOR_ROLE, poorUser.address);
      
      await expect(
        questionReward.connect(poorUser).createQuestion(questionId, rewardAmount)
      ).to.be.revertedWith("Insufficient balance");
    });
  });

  describe("Answer Acceptance", function () {
    beforeEach(async function () {
      await questionReward.connect(questionCreator).createQuestion(questionId, rewardAmount);
    });

    it("Should distribute rewards correctly when answer is accepted", async function () {
      const initialAnswererBalance = await questionReward.balanceOf(answerer.address);
      const initialTreasuryBalance = await questionReward.balanceOf(treasury.address);

      await questionReward.connect(questionCreator).acceptAnswer(questionId, answerer.address);

      const finalAnswererBalance = await questionReward.balanceOf(answerer.address);
      const finalTreasuryBalance = await questionReward.balanceOf(treasury.address);

      // 95% to answerer
      expect(finalAnswererBalance - initialAnswererBalance).to.equal(
        rewardAmount * BigInt(95) / BigInt(100)
      );

      // 5% to treasury
      expect(finalTreasuryBalance - initialTreasuryBalance).to.equal(
        rewardAmount * BigInt(5) / BigInt(100)
      );

      // Check question status
      const question = await questionReward.getQuestionDetails(questionId);
      expect(question.isAnswered).to.be.true;
      expect(question.acceptedAnswer).to.equal(answerer.address);
    });

    it("Should not allow non-author to accept answer", async function () {
      await expect(
        questionReward.connect(answerer).acceptAnswer(questionId, answerer.address)
      ).to.be.revertedWith("Only author can accept answer");
    });

    it("Should not allow accepting answer for inactive question", async function () {
      // Create another question and accept it to make the first one inactive
      const anotherQuestionId = ethers.keccak256(ethers.toUtf8Bytes("another-question"));
      await questionReward.connect(questionCreator).createQuestion(anotherQuestionId, rewardAmount);
      await questionReward.connect(questionCreator).acceptAnswer(anotherQuestionId, answerer.address);

      // Deactivate the first question
      await questionReward.connect(questionCreator).createQuestion(questionId, rewardAmount);
      await questionReward.connect(questionCreator).acceptAnswer(questionId, answerer.address);

      await expect(
        questionReward.connect(questionCreator).acceptAnswer(questionId, answerer.address)
      ).to.be.revertedWith("Question already answered");
    });

    it("Should not allow accepting answer after question is answered", async function () {
      await questionReward.connect(questionCreator).acceptAnswer(questionId, answerer.address);
      await expect(
        questionReward.connect(questionCreator).acceptAnswer(questionId, answerer.address)
      ).to.be.revertedWith("Question already answered");
    });

    it("Should not allow author to accept their own answer", async function () {
      await expect(
        questionReward.connect(questionCreator).acceptAnswer(questionId, questionCreator.address)
      ).to.be.revertedWith("Cannot accept own answer");
    });
  });
}); 