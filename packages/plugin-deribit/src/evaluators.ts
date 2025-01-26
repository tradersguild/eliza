import { Evaluator, State, Memory } from "@elizaos/core";
import { MarketDataMemory } from "./types";
import { MarketData } from "./types";

export const marketAnalysisEvaluator: Evaluator = {
    name: "market_analysis",
    description: "Analyzes market data",
    similes: ["analyze market data", "evaluate market conditions"],
    examples: [],
    handler: async (_runtime, message: MarketDataMemory, state: State) => {
        const data = message.content.data as MarketData;

        if (!data || !data.btc || !data.eth) {
            console.log("[MarketAnalysisEvaluator] Missing market data");
            return state;
        }

        // Format market metrics
        const analysis = `📊 Market Update:
BTC: $${data.btc.perpetual.mark_price.toLocaleString()} | Funding: ${(data.btc.perpetual.funding.current * 100).toFixed(4)}%
ETH: $${data.eth.perpetual.mark_price.toLocaleString()} | Funding: ${(data.eth.perpetual.funding.current * 100).toFixed(4)}%

Key Metrics:
- BTC Put/Call Ratio: ${data.btc.options.put_call_ratio}
- ETH Basis: ${data.eth.perpetual.basis}
- 24h Volume: $${(data.btc.perpetual.volume_24h * data.btc.perpetual.mark_price / 1000000).toFixed(1)}M`;

        return {
            ...state,
            response: analysis,
            context: "market_analysis",
            metadata: {
                btcPrice: data.btc.perpetual.mark_price,
                ethPrice: data.eth.perpetual.mark_price,
                timestamp: new Date().toISOString(),
                isMarketUpdate: true
            }
        } as State;
    },
    validate: async (_runtime, message: Memory) => {
        const isValid = message.content.type === "MARKET_DATA" && !!message.content.data;
        console.log("[MarketAnalysisEvaluator] Validating message:", {
            type: message.content.type,
            hasData: !!message.content.data,
            isValid
        });
        return isValid;
    }
};