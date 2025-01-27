import { Provider } from '@elizaos/core';
import {
  Connection,
  Keypair,
  Transaction,
  PublicKey,
  sendAndConfirmTransaction
} from '@solana/web3.js';
import { RFQParams, RFQResponse, Order, CollateralAccount } from '../types';

export class ConvergenceProvider extends Provider {
  private apiKey: string;
  private baseUrl: string;
  private connection: Connection;
  private wallet: Keypair;

  constructor(config: any) {
    super();
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://dev.api.convergence.so';
    this.connection = new Connection(config.rpcUrl);
    this.wallet = Keypair.fromSecretKey(Buffer.from(config.privateKey, 'hex'));
  }

  async getOrders(owner: string) {
    const response = await fetch(`${this.baseUrl}/api/orders?owner=${owner}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }

  async createRFQ(params: any) {
    const response = await fetch(`${this.baseUrl}/api/rfq`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params)
    });
    return response.json();
  }

  async respondToRFQ(rfqId: string, response: any) {
    const url = `${this.baseUrl}/api/rfq/${rfqId}/respond`;
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(response)
    });
    return resp.json();
  }

  async getInstruments() {
    const response = await fetch(`${this.baseUrl}/api/instruments`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }

  async getCollateralAccount(owner: string): Promise<CollateralAccount> {
    const response = await fetch(`${this.baseUrl}/api/collateral/${owner}`, {
      headers: {
        'Authorization': `Bearer ${this.apiKey}`
      }
    });
    return response.json();
  }

  async createCollateralAccount(params: {currency: string}) {
    try {
      // Get the create account transaction data
      const response = await fetch(`${this.baseUrl}/api/collateral/create/prepare`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      const { transaction: serializedTransaction } = await response.json();

      // Deserialize and sign the transaction
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
      transaction.sign(this.wallet);

      // Send and confirm the transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet]
      );

      // Confirm the account creation with Convergence
      const confirmResponse = await fetch(`${this.baseUrl}/api/collateral/create/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          signature,
          ...params
        })
      });

      return confirmResponse.json();
    } catch (error) {
      throw new Error(`Failed to create collateral account: ${error.message}`);
    }
  }

  async addCollateral(params: {amount: number, currency: string}) {
    try {
      // First get the transaction data from Convergence
      const response = await fetch(`${this.baseUrl}/api/collateral/fund/prepare`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      const { transaction: serializedTransaction, signers } = await response.json();

      // Deserialize the transaction
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));

      // Sign the transaction with Eliza's wallet
      transaction.sign(this.wallet);

      // Send and confirm the transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet]
      );

      // Notify Convergence of the completed transaction
      const confirmResponse = await fetch(`${this.baseUrl}/api/collateral/fund/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          signature,
          ...params
        })
      });

      return confirmResponse.json();
    } catch (error) {
      throw new Error(`Failed to add collateral: ${error.message}`);
    }
  }

  async withdrawCollateral(params: {amount: number, currency: string, destination: string}) {
    try {
      // Get the withdrawal transaction data
      const response = await fetch(`${this.baseUrl}/api/collateral/withdraw/prepare`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(params)
      });

      const { transaction: serializedTransaction } = await response.json();

      // Deserialize and sign the transaction
      const transaction = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
      transaction.sign(this.wallet);

      // Send and confirm the transaction
      const signature = await sendAndConfirmTransaction(
        this.connection,
        transaction,
        [this.wallet]
      );

      // Confirm the withdrawal with Convergence
      const confirmResponse = await fetch(`${this.baseUrl}/api/collateral/withdraw/confirm`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          signature,
          ...params
        })
      });

      return confirmResponse.json();
    } catch (error) {
      throw new Error(`Failed to withdraw collateral: ${error.message}`);
    }
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
}