import { Plugin } from "@elizaos/core";
import { RequestPriceQuoteAction } from "./actions/requestPriceQuote";
import { GetInstrumentsAction } from "./actions/getInstruments";
import { GetVolumeAction } from "./actions/getVolume";
import { GetOpenInterestAction } from "./actions/getOpenInterest";

// Initialize the action instances
const requestPriceQuote = new RequestPriceQuoteAction();
const getInstruments = new GetInstrumentsAction();
const getVolume = new GetVolumeAction();
const getOpenInterest = new GetOpenInterestAction();

export const arrowMarketsPlugin: Plugin = {
    name: "arrow-markets",
    description: "Arrow Markets plugin for Eliza",
    actions: [
        requestPriceQuote,
        getInstruments,
        getVolume,
        getOpenInterest
    ],
    // evaluators analyze the situations and actions taken by the agent. they run after each agent action
    // allowing the agent to reflect on what happened and potentially trigger additional actions or modifications
    evaluators: [],
    // providers supply information and state to the agent's context, help agent access necessary data
    providers: [],
};
export default arrowMarketsPlugin;
