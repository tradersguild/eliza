import { Client, IAgentRuntime } from "@elizaos/core";
import { MarketData } from './types';
import fetch from 'node-fetch';

export class DeribitClient implements Client {
    private readonly baseUrl = 'https://www.deribit.com/api/v2';

    // Required Client interface methods
    async start(runtime: IAgentRuntime): Promise<unknown> {
        console.log("[DeribitClient] Starting client...");
        // Initialize connection to Deribit
        return Promise.resolve();
    }

    async stop(runtime: IAgentRuntime): Promise<unknown> {
        try {
            console.log("[DeribitClient] Stopping client...");
            // Cleanup any active connections/intervals
            return Promise.resolve();
        } catch (error) {
            console.error("[DeribitClient] Error stopping client:", error);
            throw error;
        }
    }

    // Original DeribitClient methods
    async getMarketData(): Promise<MarketData> {
        console.log("[DeribitClient] Fetching market data...");
        const [btcData, ethData] = await Promise.all([
            this.getAssetData('BTC'),
            this.getAssetData('ETH')
        ]);

        // Let's log to verify data
        console.log("Market Data Retrieved:", {
            btc: btcData,
            eth: ethData
        });

        return {
            btc: btcData,
            eth: ethData
        };
    }

    private async getAssetData(asset: string): Promise<{
        perpetual: {
            mark_price: number;
            index_price: number;
            basis: string;
            funding: {
                current: number;
                predicted_8h: number;
            };
            open_interest: number;
            volume_24h: number;
            price_change_24h: string;
        };
        options: {
            total_open_interest: number;
            put_call_ratio: string;
            active_strikes: number;
            puts_oi: number;
            calls_oi: number;
        };
        market_depth: {
            best_bid: number;
            best_ask: number;
            spread: string;
            bid_size: number;
            ask_size: number;
        };
        timestamp: string;
    }> {
        const [perpData, optionsData] = await Promise.all([
            this.getPerpetualData(asset),
            this.getOptionsData(asset)
        ]);

        return {
            perpetual: {
                mark_price: perpData.mark_price,
                index_price: perpData.index_price,
                basis: ((perpData.mark_price / perpData.index_price - 1) * 100).toFixed(4),
                funding: {
                    current: perpData.current_funding,
                    predicted_8h: perpData.funding_8h
                },
                open_interest: perpData.open_interest,
                volume_24h: perpData.volume_24h,
                price_change_24h: perpData.price_change_24h
            },
            options: {
                total_open_interest: optionsData.total_oi,
                put_call_ratio: optionsData.put_call_ratio,
                active_strikes: optionsData.active_strikes,
                puts_oi: optionsData.puts_oi,
                calls_oi: optionsData.calls_oi
            },
            market_depth: {
                best_bid: perpData.best_bid_price,
                best_ask: perpData.best_ask_price,
                spread: (perpData.best_ask_price - perpData.best_bid_price).toFixed(2),
                bid_size: perpData.bid_size,
                ask_size: perpData.ask_size
            },
            timestamp: perpData.timestamp
        };
    }

    private async getPerpetualData(asset: string) {
        const response = await fetch(`${this.baseUrl}/public/ticker?instrument_name=${asset}-PERPETUAL`);
        return response.json();
    }

    private async getOptionsData(asset: string) {
        const response = await fetch(`${this.baseUrl}/public/get_book_summary_by_currency?currency=${asset}&kind=option`);
        return response.json();
    }
}