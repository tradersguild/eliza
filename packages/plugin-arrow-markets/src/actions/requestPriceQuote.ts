import { Action, ActionExample, Handler, IAgentRuntime } from '@elizaos/core';
import { Ticker, ContractType, OrderType, AppVersion, Network } from '@shapeshifter-technologies/arrow-rfq-sdk';
import { ArrowMarketsProvider } from '../providers/ArrowMarketsProvider';

export class RequestPriceQuoteAction implements Action {
  private provider: ArrowMarketsProvider;

  public name = 'requestPriceQuote';
  public description = 'Request a price quote for options trading';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'Request price quote for BTC options' },
      user: 'user'
    }]
  ];
  public similes = ['price', 'quote', 'request'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    if (!params.options || !Array.isArray(params.options) || params.options.length === 0) {
      return false;
    }
    return true;
  }

  async execute(params: {
    options: Array<{
      contractType: ContractType;
      strike: number;
      orderType: OrderType;
      readableExpiration: string;
      ticker: Ticker;
    }>;
    appVersion?: AppVersion;
    networkVersion?: Network;
  }) {
    try {
      const priceQuote = await this.provider.getLatestQuote(
        params.options,
        params.appVersion || AppVersion.TESTNET,
        params.networkVersion || Network.Testnet
      );

      return {
        success: true,
        data: priceQuote
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}
