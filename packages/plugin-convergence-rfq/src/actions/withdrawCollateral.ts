import { Action, ActionExample, Handler, IAgentRuntime } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class WithdrawCollateralAction implements Action {
  private provider!: ConvergenceProvider;

  public name = 'withdrawCollateral';
  public description = 'Withdraw collateral from your account';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'Withdraw collateral from account' },
      user: 'user'
    }]
  ];
  public similes = ['withdraw', 'remove', 'take'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    return Promise.resolve(!!(params.amount && params.currency));
  }

  async execute(params: {amount: number, currency: string}) {
    try {
      const result = await this.provider.withdrawCollateral({ amount: params.amount, currency: params.currency });
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