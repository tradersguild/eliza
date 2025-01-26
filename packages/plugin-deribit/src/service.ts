import { Service, ServiceType, IAgentRuntime } from "@elizaos/core";
import { MarketProvider } from "./providers/market/provider";
import { MarketDataMemory } from "./types";

export class MarketDataService extends Service {
    static get serviceType() {
        return ServiceType.DERIBIT;
    }

    private provider: MarketProvider;
    private runtime: IAgentRuntime;

    constructor() {
        super();
        this.provider = new MarketProvider();
    }

    async initialize(runtime: IAgentRuntime): Promise<void> {
        this.runtime = runtime;
        await this.provider.initialize();
    }

    async getMarketData() {
        const data = await this.provider.getMarketData();
        if (!data) {
            console.log("[MarketDataService] No market data available");
            return null;
        }

        // Add hash/timestamp check
        const dataHash = JSON.stringify(data);
        const lastDataHash = await this.runtime.cacheManager.get('lastMarketDataHash');
        if (dataHash === lastDataHash) {
            console.log("[MarketDataService] No new market data");
            return null;
        }

        await this.runtime.cacheManager.set('lastMarketDataHash', dataHash);

        console.log("[MarketDataService] New market data available");
        return {
            content: {
                type: "MARKET_DATA",
                data: data,
                text: this.formatMarketUpdate(data),
                metadata: {
                    isMarketUpdate: true,
                    timestamp: new Date().toISOString()
                }
            }
        } as MarketDataMemory;
    }

    private formatMarketUpdate(data: any): string {
        // Format market data into readable text
        return `Market Update: ${new Date().toISOString()}`;
    }

    async cleanup(): Promise<void> {
        await this.provider.cleanup();
    }
}