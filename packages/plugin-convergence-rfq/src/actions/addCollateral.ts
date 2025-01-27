import { Action } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class AddCollateralAction extends Action {
  provider: ConvergenceProvider;

  async execute(params: {amount: number, currency: string}) {
    try {
      const result = await this.provider.addCollateral(params);
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