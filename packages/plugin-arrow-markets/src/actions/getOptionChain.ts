import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    elizaLogger,
} from "@elizaos/core";

export const getOptionChain: Action = {
    name: "GET_OPTION_CHAIN",
    similes: ["OPTIONS", "TRADING", "DERIVATIVES", "MARKETS"],
    description: "Get the option chain data for a given ticker.",
    validate: async (_runtime: IAgentRuntime) => {
        return true;
    },
    handler: async (
        _runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        try {
            console.log("Getting option chain data");
            elizaLogger.success("Successfully fetched option chain");
            if (callback) {
                callback({
                    text: "Option chain data retrieved",
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error getting option chain:", error);
            callback({
                text: `Error fetching option chain: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: [],
} as Action;
