import { Action, ActionExample, Handler, IAgentRuntime } from '@elizaos/core';
import { AppVersion, ContractType, Network, Ticker } from '@shapeshifter-technologies/arrow-rfq-sdk';
import axios from 'axios';
import { getCurrentTimeUTC } from '@shapeshifter-technologies/arrow-rfq-sdk/lib/common/utils/time';
import { ARROW_RFQ_API_URL } from '../constants';

export class GetInstrumentsAction implements Action {
  public name = 'getInstruments';
  public description = 'Get available trading instruments and their strike grids';
  public examples: ActionExample[][] = [
    [{
      content: { text: 'List available instruments' },
      user: 'user'
    }]
  ];
  public similes = ['list', 'instruments', 'markets', 'options'];
  public handler: Handler = async (runtime: IAgentRuntime, params: any) => {
    return this.execute(params);
  };

  public validate = async (params: any): Promise<boolean> => {
    if (!params.ticker) {
      return false;
    }
    return true;
  }

  async execute(params: { ticker?: Ticker }) {
    try {
      const getStrikeGrid = (await import('@shapeshifter-technologies/arrow-rfq-sdk')).getStrikeGrid;

      // Get available expirations
      const { data } = await axios.get(`${ARROW_RFQ_API_URL}/options/expirations`);
      let expirations = data.expirations;

      const today = getCurrentTimeUTC().dayJsTimestamp.format('dddd');
      if (today === 'Friday') {
        expirations = expirations.filter(
          expiration => getTimeUTC(expiration).millisTimestamp !== getCurrentTimeUTC().millisTimestamp
        );
      }
      expirations = expirations.map(expiration => expiration * 1000);

      const ticker = params.ticker || Ticker.ETH;
      const readableExpiration = expirations[0].toString(); // Use first available expiration

      // Get both CALL and PUT options
      const [callGrid, putGrid] = await Promise.all([
        getStrikeGrid(
          ticker,
          readableExpiration,
          ContractType.CALL,
          AppVersion.TESTNET,
          Network.Testnet
        ),
        getStrikeGrid(
          ticker,
          readableExpiration,
          ContractType.PUT,
          AppVersion.TESTNET,
          Network.Testnet
        )
      ]);

      return {
        success: true,
        data: {
          ticker,
          expiration: readableExpiration,
          availableExpirations: expirations,
          calls: {
            buy: callGrid.buyStrikeGrid,
            sell: callGrid.sellStrikeGrid
          },
          puts: {
            buy: putGrid.buyStrikeGrid,
            sell: putGrid.sellStrikeGrid
          }
        }
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Unknown error'
      };
    }
  }
}
