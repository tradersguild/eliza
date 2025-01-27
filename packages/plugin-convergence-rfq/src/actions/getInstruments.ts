import { Action, ActionExample, Handler, IAgentRuntime } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class GetInstrumentsAction implements Action {
  private provider!: ConvergenceProvider;

  public name = 'getInstruments';
  public description = 'Get available trading instruments';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'List available instruments' },
      user: 'user'
    }]
  ];
  public similes = ['list', 'instruments', 'markets'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    return Promise.resolve(true); // No required params
  }

  async execute(params: {}) {
    try {
      const instruments = await this.provider.getInstruments();
      return {
        success: true,
        data: instruments
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}