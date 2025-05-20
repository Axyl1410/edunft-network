import { Injectable, Logger } from '@nestjs/common';
import { ethers } from 'ethers';
import { ConfigService } from '@nestjs/config';
import QuestionReward from '../contracts/QuestionReward.json';

@Injectable()
export class BlockchainService {
  private readonly logger = new Logger(BlockchainService.name);
  private provider: ethers.JsonRpcProvider;
  private contract: ethers.Contract;
  private wallet: ethers.Wallet;

  constructor(private configService: ConfigService) {
    const rpcUrl = this.configService.get<string>('BLOCKCHAIN_RPC_URL');
    const privateKey = this.configService.get<string>('BLOCKCHAIN_PRIVATE_KEY');
    const contractAddress = this.configService.get<string>('QUESTION_REWARD_CONTRACT_ADDRESS');

    this.provider = new ethers.JsonRpcProvider(rpcUrl);
    this.wallet = new ethers.Wallet(privateKey, this.provider);
    this.contract = new ethers.Contract(
      contractAddress,
      QuestionReward.abi,
      this.wallet
    );
  }

  async createQuestion(questionId: string, rewardAmount: string): Promise<string> {
    try {
      const tx = await this.contract.createQuestion(
        ethers.keccak256(ethers.toUtf8Bytes(questionId)),
        ethers.parseEther(rewardAmount)
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      this.logger.error('Error creating question:', error);
      throw error;
    }
  }

  async submitAnswer(questionId: string): Promise<string> {
    try {
      const tx = await this.contract.submitAnswer(
        ethers.keccak256(ethers.toUtf8Bytes(questionId))
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      this.logger.error('Error submitting answer:', error);
      throw error;
    }
  }

  async voteAnswer(questionId: string, answererAddress: string): Promise<string> {
    try {
      const tx = await this.contract.voteAnswer(
        ethers.keccak256(ethers.toUtf8Bytes(questionId)),
        answererAddress
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      this.logger.error('Error voting answer:', error);
      throw error;
    }
  }

  async acceptAnswer(questionId: string, answererAddress: string): Promise<string> {
    try {
      const tx = await this.contract.acceptAnswer(
        ethers.keccak256(ethers.toUtf8Bytes(questionId)),
        answererAddress
      );
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      this.logger.error('Error accepting answer:', error);
      throw error;
    }
  }

  async getQuestionDetails(questionId: string) {
    try {
      const details = await this.contract.getQuestionDetails(
        ethers.keccak256(ethers.toUtf8Bytes(questionId))
      );
      return {
        author: details[0],
        rewardAmount: ethers.formatEther(details[1]),
        isActive: details[2],
        isAnswered: details[3],
        acceptedAnswer: details[4],
      };
    } catch (error) {
      this.logger.error('Error getting question details:', error);
      throw error;
    }
  }

  async getAnswerVotes(questionId: string, answererAddress: string): Promise<number> {
    try {
      const votes = await this.contract.getAnswerVotes(
        ethers.keccak256(ethers.toUtf8Bytes(questionId)),
        answererAddress
      );
      return Number(votes);
    } catch (error) {
      this.logger.error('Error getting answer votes:', error);
      throw error;
    }
  }
} 