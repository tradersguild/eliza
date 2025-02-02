import {
    Action,
    IAgentRuntime,
    Memory,
    State,
    HandlerCallback,
    elizaLogger,
} from "@elizaos/core";
import { validateArrowConfig } from "../enviroment";
import axios from "axios";

export const getOptionChain: Action = {
    name: "GET_OPTION_CHAIN",
    similes: ["OPTIONS", "TRADING", "DERIVATIVES", "MARKETS"],
    description: "Get the option chain data for a given ticker.",
    validate: async (runtime: IAgentRuntime) => {
        try {
            await validateArrowConfig(runtime);
            return true;
        } catch (error) {
            return false;
        }
    },
    handler: async (
        runtime: IAgentRuntime,
        _message: Memory,
        _state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        try {
            const config = await validateArrowConfig(runtime);
            const response = await axios.get(
                `${config.ARROW_API_URL}/options/chain`
            );

            elizaLogger.success("Successfully fetched option chain");
            if (callback) {
                callback({
                    text: "Option chain data retrieved",
                    content: response.data,
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
