import { Provider } from '@elizaos/core';
import { ethers } from 'ethers';
import { IAgentRuntime, Memory, State } from '@elizaos/core';
import { Ticker } from '@shapeshifter-technologies/arrow-rfq-sdk';
import { ARROW_RFQ_API_URL } from '../constants';

export class ArrowMarketsProvider implements Provider {
  public name = 'arrowmarkets';

  private baseUrl: string;
  private provider: ethers.providers.JsonRpcProvider;
  private wallet: ethers.Wallet;

  constructor(config: any) {
    this.baseUrl = config.baseUrl || ARROW_RFQ_API_URL;
    this.provider = new ethers.providers.JsonRpcProvider(config.rpcUrl);
    this.wallet = new ethers.Wallet(config.privateKey, this.provider);
  }

  async getInstruments(ticker: Ticker) {
    // TODO: Implement get instruments
    return [];
  }

// Helper method to get wallet address
  getWalletAddress(): string {
    return this.wallet.address;
  }

  public async get(runtime: IAgentRuntime, message: Memory, state?: State): Promise<any> {
    return this;
  }
}
