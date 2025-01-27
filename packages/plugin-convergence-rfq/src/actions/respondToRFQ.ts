import { Action } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';
import { ActionExample, IAgentRuntime, Handler } from '@elizaos/core';

export class RespondToRFQAction implements Action {
  private provider!: ConvergenceProvider;

  // Required Action interface properties
  public name = 'respondToRFQ';
  public description = 'Respond to an RFQ with a price';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'Respond to RFQ with price' },
      user: 'user'
    }]
  ];
  public similes = ['quote', 'price', 'respond'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    return Promise.resolve(!!(params.rfqId && typeof params.price === 'number'));
  }

  async execute(params: {rfqId: string, price: number}) {
    try {
      const response = await this.provider.respondToRFQ({ rfqId: params.rfqId, price: params.price });
      return {
        success: true,
        data: response
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}