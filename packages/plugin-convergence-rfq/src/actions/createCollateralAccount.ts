import { Action, ActionExample, Content, Handler, IAgentRuntime } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class CreateCollateralAccountAction implements Action {
  private provider!: ConvergenceProvider;

  public name = 'createCollateralAccount';
  public description = 'Create a new collateral account';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'Create collateral account' },
      user: 'user'
    }]
  ];
  public similes = ['create', 'account', 'collateral'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    return Promise.resolve(!!params.currency);
  }

  async execute(params: {currency: string}) {
    try {
      const result = await this.provider.createCollateralAccount({ currency: params.currency });
      return {
        success: true,
        data: result
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}