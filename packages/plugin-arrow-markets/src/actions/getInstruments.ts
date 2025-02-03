import { Action, ActionExample, Handler, IAgentRuntime } from '@elizaos/core';
import { Ticker } from '@shapeshifter-technologies/arrow-rfq-sdk';
import { ArrowMarketsProvider } from '../providers/ArrowMarketsProvider';

export class GetInstrumentsAction implements Action {
  private provider: ArrowMarketsProvider;

  public name = 'getInstruments';
  public description = 'Get available trading instruments and their strike grids';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'List available instruments' },
      user: 'user'
    }]
  ];
  public similes = ['list', 'instruments', 'markets', 'options'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    if (!params.ticker) {
      return false;
    }
    return true;
  }

  async execute(params: { ticker?: Ticker }) {
    try {
      const instruments = await this.provider.getInstruments(params.ticker);

      return {
        success: true,
        data: instruments
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}
