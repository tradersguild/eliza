import { Action, ActionExample, Handler, IAgentRuntime } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class AddCollateralAction implements Action {
  private provider!: ConvergenceProvider;

  public name = 'addCollateral';
  public description = 'Add collateral to your account';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'Add collateral to account' },
      user: 'user'
    }]
  ];
  public similes = ['deposit', 'fund', 'add'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    return Promise.resolve(!!(params.amount && params.currency));
  }

  async execute(params: {amount: number, currency: string}) {
    try {
      const result = await this.provider.addCollateral({ amount: params.amount, currency: params.currency });
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