import { Action } from '@elizaos/core';
import { ConvergenceProvider } from '../providers/convergenceProvider';

export class CreateCollateralAccountAction extends Action {
  provider: ConvergenceProvider;

  async execute(params: {currency: string}) {
    try {
      // Get the wallet's public key
      const walletPubkey = this.provider.getWalletPublicKey();

      // Create the collateral account
      const account = await this.provider.createCollateralAccount({
        ...params,
        owner: walletPubkey.toString()
      });

      return {
        success: true,
        data: account
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}