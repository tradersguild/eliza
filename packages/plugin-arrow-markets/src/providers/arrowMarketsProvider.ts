import { Provider } from '@elizaos/core';
import { ethers } from 'ethers';
import { IAgentRuntime, Memory, State } from '@elizaos/core';
import { Ticker } from '@shapeshifter-technologies/arrow-rfq-sdk';
import { ARROW_RFQ_API_URL } from '../constants';
import { getStrikeGrid } from '@shapeshifter-technologies/arrow-rfq-sdk/lib/common/utils/strike-grid';
import { AppVersion, ContractType, Network, OrderType } from '@shapeshifter-technologies/arrow-rfq-sdk';
import axios from 'axios';
import { convertTickerDateFormat } from '@shapeshifter-technologies/arrow-rfq-sdk/lib/common/utils/time';
import { getBulkRFQOptionPrice } from '@shapeshifter-technologies/arrow-rfq-sdk';
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
    try {
      // Get available expirations
      const { data: { expirations } } = await axios.get(
        `${this.baseUrl}/options/expirations`
      );

      const instruments = [];

      // For each expiration, get strike grids for both calls and puts
      for (const expiration of expirations) {
        const readableExpiration = convertTickerDateFormat(new Date(expiration * 1000).toISOString().slice(0,10).replace(/-/g, ''));

        // Get call options grid
        const callGrid = await getStrikeGrid(
          ticker,
          readableExpiration,
          ContractType.CALL,
          AppVersion.TESTNET,
          Network.Testnet
        );

        // Get put options grid
        const putGrid = await getStrikeGrid(
          ticker,
          readableExpiration,
          ContractType.PUT,
          AppVersion.TESTNET,
          Network.Testnet
        );

        instruments.push({
          expiration: expiration * 1000,
          calls: {
            buy: callGrid.buyStrikeGrid,
            sell: callGrid.sellStrikeGrid
          },
          puts: {
            buy: putGrid.buyStrikeGrid,
            sell: putGrid.sellStrikeGrid
          }
        });
      }

      return instruments;
    } catch (error) {
      console.error('Error getting instruments:', error);
      throw error;
    }
  }

  async getLatestQuote(
    options: Array<{
      contractType: ContractType;
      strike: number;
      orderType: OrderType;
      readableExpiration: string;
      ticker: Ticker;
    }>,
    appVersion: AppVersion,
    networkVersion: Network
  ) {
    try {
      // Get pricing information
      const pricingInfo = await getBulkRFQOptionPrice(
        options,
        appVersion as AppVersion,
        networkVersion as Network
      );

      return {
        pricing: pricingInfo
      };
    } catch (error) {
      console.error('Error creating RFQ:', error);
      throw error;
    }
  }

  // Helper method to get wallet address
  getWalletAddress(): string {
    return this.wallet.address;
  }

  public async get(runtime: IAgentRuntime, message: Memory, state?: State): Promise<any> {
    return this;
  }
}
