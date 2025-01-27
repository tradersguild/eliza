import { Plugin } from '@elizaos/core';
import { ConvergenceProvider } from './providers/convergenceProvider';
import { GetOrdersAction } from './actions/getOrders';
import { CreateRFQAction } from './actions/createRFQ';
import { RespondToRFQAction } from './actions/respondToRFQ';
import { CreateCollateralAccountAction } from './actions/createCollateralAccount';
import { GetInstrumentsAction } from './actions/getInstruments';
import { AddCollateralAction } from './actions/addCollateral';
import { WithdrawCollateralAction } from './actions/withdrawCollateral';

export default class ConvergenceRFQPlugin extends Plugin {
  name = 'convergence-rfq';

  async setup() {
    // Register providers
    this.registerProvider('convergence', ConvergenceProvider);

    // Register actions
    this.registerAction('getOrders', GetOrdersAction);
    this.registerAction('createRFQ', CreateRFQAction);
    this.registerAction('respondToRFQ', RespondToRFQAction);
    this.registerAction('createCollateralAccount', CreateCollateralAccountAction);
    this.registerAction('getInstruments', GetInstrumentsAction);
    this.registerAction('addCollateral', AddCollateralAction);
    this.registerAction('withdrawCollateral', WithdrawCollateralAction);
  }
}