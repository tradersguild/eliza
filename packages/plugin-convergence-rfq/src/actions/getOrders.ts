import { Action, ActionExample, Handler, IAgentRuntime } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class GetOrdersAction implements Action {
  private provider!: ConvergenceProvider;

  public name = 'getOrders';
  public description = 'Get orders for an owner address';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'Get orders for address' },
      user: 'user'
    }]
  ];
  public similes = ['fetch', 'list', 'orders'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    return Promise.resolve(!!params.owner);
  }

  async execute(params: { owner: string }) {
    try {
      const orders = await this.provider.getOrders(params.owner);
      return {
        success: true,
        data: orders
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}