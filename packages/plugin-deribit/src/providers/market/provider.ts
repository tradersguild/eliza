import { MarketData } from "../../types";
import { DeribitClient } from "@elizaos/client-deribit";
import { IAgentRuntime, Memory, Provider } from "@elizaos/core";

export class MarketProvider implements Provider {
    private client: DeribitClient;
    private isInitialized = false;

    async initialize() {
        if (this.isInitialized) return;

        this.client = new DeribitClient();
        this.isInitialized = true;
        console.log("[MarketProvider] Initialized");
    }

    async getMarketData(): Promise<MarketData | null> {
        if (!this.isInitialized) {
            console.error("[MarketProvider] Not initialized");
            return null;
        }

        try {
            return await this.client.getMarketData();
        } catch (error) {
            console.error("[MarketProvider] Failed to fetch market data:", error);
            return null;
        }
    }

    isReady(): boolean {
        return this.isInitialized;
    }

    async cleanup(): Promise<void> {
        this.isInitialized = false;
    }

    async get(runtime: IAgentRuntime, message: Memory) {
        return this.getMarketData();
    }
}