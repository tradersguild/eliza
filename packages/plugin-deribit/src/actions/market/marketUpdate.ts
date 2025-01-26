import { Action, IAgentRuntime, generateText, ModelClass } from "@elizaos/core";
import { MarketDataMemory } from "../../types";

export const marketUpdateAction: Action = {
    name: "MARKET_UPDATE",
    description: "Posts market analysis updates",
    similes: ["post market update", "share market analysis"],
    examples: [],
    validate: async (_runtime, _message) => true,
    handler: async (_runtime: IAgentRuntime, message: MarketDataMemory) => {
        // Check if we should post based on last post time
        const lastPostTime = await _runtime.cacheManager.get('lastMarketPostTime');
        const now = Date.now();
        const minInterval = 1000 * 60 * 60 * 2; // 2 hours minimum between posts

        if (lastPostTime && (now - parseInt(lastPostTime)) < minInterval) {
            console.log("[MarketUpdateAction] Skipping - too soon since last post");
            return { shouldPost: false };
        }

        if (message.content?.metadata?.isMarketUpdate) {
            console.log("[MarketUpdateAction] Processing market update:", message.content.text);

            const text = await generateText({
                runtime: _runtime,
                context: message.content.data,
                modelClass: ModelClass.LARGE,
                temperature: 0.7,
                maxTokens: 280
            });

            // Store last post time
            await _runtime.cacheManager.set('lastMarketPostTime', now.toString());

            return {
                tweet: text,
                shouldPost: true
            };
        }

        console.log("[MarketUpdateAction] Skipping non-market message");
        return { shouldPost: false };
    }
};