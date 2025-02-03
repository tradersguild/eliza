import { Plugin } from "@elizaos/core";
import { getOptionChain } from "./actions/getOptionChain";

export const arrowMarketsPlugin: Plugin = {
    name: "arrow-markets",
    description: "Arrow Markets plugin for Eliza",
    actions: [getOptionChain],
    // evaluators analyze the situations and actions taken by the agent. they run after each agent action
    // allowing the agent to reflect on what happened and potentially trigger additional actions or modifications
    evaluators: [],
    // providers supply information and state to the agent's context, help agent access necessary data
    providers: [],
};
export default arrowMarketsPlugin;
