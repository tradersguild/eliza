import type { Character } from "@elizaos/core";

export const deribitCharacterConfig = {
    clients: ["deribit"],
    clientConfig: {
        deribit: {
            interval: 3600000, // Check every hour
            thresholds: {
                fundingChange: 0.02,
                priceChange: 0.05
            }
        }
    }
} as const;