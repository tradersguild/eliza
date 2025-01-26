import { Evaluator, State, Memory } from "@elizaos/core";
import { MarketDataMemory } from "../../types";

export const marketAnalysisEvaluator: Evaluator = {
    name: "market_analysis",
    description: "Analyzes market data",
    similes: ["analyze market data", "evaluate market conditions"],
    examples: [],
    handler: async (_runtime, message: MarketDataMemory, state: State) => {
        // Simply pass raw data to state for character to analyze
        return {
            ...state,
            response: message.content.data,
            context: "market_analysis",
            metadata: {
                timestamp: new Date().toISOString(),
                isMarketUpdate: true
            }
        } as State;
    },
    validate: async (_runtime, message: Memory) => {
        if (process.env.ENABLE_ACTION_PROCESSING !== 'true') {
            return false;
        }

        return message.content.type === "MARKET_DATA" && !!message.content.data;
    }
};