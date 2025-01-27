import { Provider } from '@elizaos/core';
import {
  Connection,
  Keypair,
  Transaction,
  PublicKey,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { RFQParams, RFQResponse, Order, CollateralAccount } from '../types';
import { IAgentRuntime, Memory, State } from '@elizaos/core';

export class ConvergenceProvider implements Provider {
  public name = 'convergence';

  private apiKey: string;
  private baseUrl: string;
  private connection: Connection;
  private wallet: Keypair;

  constructor(config: any) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://dev.api.convergence.so';
    this.connection = new Connection(config.rpcUrl);
    this.wallet = Keypair.fromSecretKey(Buffer.from(config.privateKey, 'hex'));
  }

  async getOrders(owner: string) {
    // TODO: Implement get orders
    return [];
  }

  async createRFQ(params: {
    instrumentId: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    price?: number
  }) {
    // TODO: Implement RFQ creation
    return params;
  }

  async respondToRFQ(params: { rfqId: string, price: number }) {
    // TODO: Implement RFQ response
    return params;
  }

  async getInstruments() {
    // TODO: Implement get instruments
    return [];
  }

  async getCollateralAccount(owner: string): Promise<CollateralAccount> {
    const response = await fetch(`${this.baseUrl}/api/collateral/${owner}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }

  async createCollateralAccount(params: { currency: string }) {
    // TODO: Implement create collateral account
    return params;
  }

  async addCollateral(params: { amount: number, currency: string }) {
    // TODO: Implement add collateral
    return params;
  }

  async withdrawCollateral(params: { amount: number, currency: string }) {
    // TODO: Implement withdraw collateral
    return params;
  }

  async getRFQs(params?: any) {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    const response = await fetch(`${this.baseUrl}/api/rfq?${queryString}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }

  async getRFQById(rfqId: string) {
    const response = await fetch(`${this.baseUrl}/api/rfq/${rfqId}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }

  async cancelRFQ(rfqId: string) {
    const response = await fetch(`${this.baseUrl}/api/rfq/${rfqId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }

  async confirmRFQResponse(rfqId: string, responseId: string) {
    const response = await fetch(`${this.baseUrl}/api/rfq/${rfqId}/confirm`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ responseId })
    });
    return response.json();
  }

  async settleRFQResponse(rfqId: string, responseId: string, settlementData: any) {
    const response = await fetch(`${this.baseUrl}/api/rfq/${rfqId}/settle`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ responseId, settlementData })
    });
    return response.json();
  }

  // Helper method to get wallet public key
  getWalletPublicKey(): PublicKey {
    return this.wallet.publicKey;
  }

  public async get(runtime: IAgentRuntime, message: Memory, state?: State): Promise<any> {
    return this;
  }
}