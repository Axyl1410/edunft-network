import { Injectable } from '@nestjs/common';
import { ethers } from 'ethers';

interface QuestionRewardContract extends ethers.BaseContract {
  balanceOf(address: string): Promise<bigint>;
  createQuestion(
    questionId: string,
    rewardAmount: bigint,
  ): Promise<ethers.ContractTransactionResponse>;
  acceptAnswer(
    questionId: string,
    answerer: string,
  ): Promise<ethers.ContractTransactionResponse>;
  submitAnswer(
    questionId: string,
    answerId: string,
  ): Promise<ethers.ContractTransactionResponse>;
  voteAnswer(
    questionId: string,
    answerId: string,
    vote: number,
  ): Promise<ethers.ContractTransactionResponse>;
}

@Injectable()
export class BlockchainService {
  private provider: ethers.JsonRpcProvider;
  private contract: QuestionRewardContract;

  constructor() {
    // Initialize provider and contract
    this.provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
    this.contract = new ethers.Contract(
      process.env.QUESTION_REWARD_ADDRESS,
      [
        'function balanceOf(address) view returns (uint256)',
        'function createQuestion(bytes32,uint256)',
        'function acceptAnswer(bytes32,address)',
        'function submitAnswer(bytes32,bytes32)',
        'function voteAnswer(bytes32,bytes32,uint8)',
      ],
      this.provider,
    ) as unknown as QuestionRewardContract;
  }

  async getBalance(address: string): Promise<bigint> {
    return await this.contract.balanceOf(address);
  }

  async createQuestion(
    questionId: string,
    rewardAmount: bigint,
    signer: ethers.Signer,
  ) {
    const contractWithSigner = this.contract.connect(
      signer,
    ) as QuestionRewardContract;
    return await contractWithSigner.createQuestion(questionId, rewardAmount);
  }

  async acceptAnswer(
    questionId: string,
    answerer: string,
    signer: ethers.Signer,
  ) {
    const contractWithSigner = this.contract.connect(
      signer,
    ) as QuestionRewardContract;
    return await contractWithSigner.acceptAnswer(questionId, answerer);
  }

  async submitAnswer(
    questionId: string,
    answerId: string,
    signer: ethers.Signer,
  ) {
    const contractWithSigner = this.contract.connect(
      signer,
    ) as QuestionRewardContract;
    return await contractWithSigner.submitAnswer(questionId, answerId);
  }

  async voteAnswer(
    questionId: string,
    answerId: string,
    vote: number,
    signer: ethers.Signer,
  ) {
    const contractWithSigner = this.contract.connect(
      signer,
    ) as QuestionRewardContract;
    return await contractWithSigner.voteAnswer(questionId, answerId, vote);
  }
}
