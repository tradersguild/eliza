import { Action } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class GetOrdersAction extends Action {
  provider: ConvergenceProvider;

  async execute(params: any) {
    const { owner } = params;

    if (!owner) {
      throw new Error('Owner address is required');
    }

    try {
      const orders = await this.provider.getOrders(owner);
      return {
        success: true,
        data: orders
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}