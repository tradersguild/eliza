import { Plugin } from "@elizaos/core";
import { DeribitClient } from "@elizaos/client-deribit";
import { MarketDataService } from "./service";
import { marketAnalysisEvaluator } from "./evaluators/market/evaluator";
import { marketUpdateAction } from "./actions/market/marketUpdate";
import { MarketProvider } from "./providers/market/provider";

export const deribitPlugin: Plugin = {
    name: "deribit",
    description: "Deribit market analysis plugin",
    services: [new MarketDataService()],
    evaluators: [marketAnalysisEvaluator],
    clients: [new DeribitClient()],
    actions: [marketUpdateAction],
    providers: [new MarketProvider()]
};

export default deribitPlugin;