import { Service, ServiceType, IAgentRuntime, Clients } from "@elizaos/core";
import { DeribitClientInterface, MarketData } from './types';
import { DeribitClient } from "./client";

export class MarketDataService extends Service {
    static get serviceType() {
        return ServiceType.DERIBIT;
    }

    private lastData: MarketData | null = null;
    private runtime: IAgentRuntime;

    async initialize(runtime: IAgentRuntime): Promise<void> {
        this.runtime = runtime;
        const client = this.runtime.clients[Clients.DERIBIT] as DeribitClient;
        const data = await client.getMarketData();
        console.log("Service received data:", data);
        this.lastData = data;
    }

    public getLatestData(): MarketData | null {
        return this.lastData;
    }

    private isValidMarketData(data: any): data is MarketData {
        return data?.btc?.perpetual?.mark_price !== undefined
            && data?.eth?.perpetual?.mark_price !== undefined;
    }
}