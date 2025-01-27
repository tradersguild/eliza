import { Action } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class GetInstrumentsAction extends Action {
  provider: ConvergenceProvider;

  async execute() {
    try {
      const instruments = await this.provider.getInstruments();
      return {
        success: true,
        data: instruments
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}