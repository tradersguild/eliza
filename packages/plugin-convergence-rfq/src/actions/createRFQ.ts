import { Action, ActionExample, Handler, IAgentRuntime } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class CreateRFQAction implements Action {
  private provider!: ConvergenceProvider;

  public name = 'createRFQ';
  public description = 'Create a new RFQ';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'Create RFQ for instrument' },
      user: 'user'
    }]
  ];
  public similes = ['request', 'quote', 'rfq'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    return Promise.resolve(!!(params.instrumentId && params.side && params.quantity));
  }

  async execute(params: {
    instrumentId: string,
    side: 'BUY' | 'SELL',
    quantity: number,
    price?: number
  }) {
    try {
      const rfq = await this.provider.createRFQ(params);
      return {
        success: true,
        data: rfq
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}