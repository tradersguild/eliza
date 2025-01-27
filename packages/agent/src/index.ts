import { Agent } from '@elizaos/core';
import ConvergenceRFQPlugin from '@elizaos/plugin-convergence-rfq';

export default class ElizaAgent extends Agent {
  async setup() {
    // Register the Convergence RFQ plugin
    await this.loadPlugin(ConvergenceRFQPlugin, {
      apiKey: process.env.CONVERGENCE_API_KEY,
      baseUrl: process.env.CONVERGENCE_API_URL,
      rpcUrl: process.env.SOLANA_RPC_URL,
      privateKey: process.env.SOLANA_PRIVATE_KEY
    });

    // ... other plugin registrations
  }
}