import { Plugin } from '@elizaos/core';
import { ConvergenceProvider } from './providers/convergenceProvider';
import { GetOrdersAction } from './actions/getOrders';
import { CreateRFQAction } from './actions/create-rfq';
import { RespondToRFQAction } from './actions/respond-to-rfq';
import { CreateCollateralAccountAction } from './actions/createCollateralAccount';
import { GetInstrumentsAction } from './actions/getInstruments';
import { AddCollateralAction } from './actions/addCollateral';
import { WithdrawCollateralAction } from './actions/withdrawCollateral';

export class ConvergenceRFQPlugin extends Plugin {
  name = 'convergence-rfq';

  async setup() {
    await super.setup();

    // Register providers
    await this.registerProvider('convergence', ConvergenceProvider);

    // Register actions
    await this.registerAction('getOrders', GetOrdersAction);
    await this.registerAction('createRFQ', CreateRFQAction);
    await this.registerAction('respondToRFQ', RespondToRFQAction);
    await this.registerAction('createCollateralAccount', CreateCollateralAccountAction);
    await this.registerAction('getInstruments', GetInstrumentsAction);
    await this.registerAction('addCollateral', AddCollateralAction);
    await this.registerAction('withdrawCollateral', WithdrawCollateralAction);
  }
}