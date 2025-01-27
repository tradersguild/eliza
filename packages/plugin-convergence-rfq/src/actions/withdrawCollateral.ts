import { Action } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class WithdrawCollateralAction extends Action {
  provider: ConvergenceProvider;

  async execute(params: {amount: number, currency: string, destination: string}) {
    try {
      const result = await this.provider.withdrawCollateral(params);
      return {
        success: true,
        data: result
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}