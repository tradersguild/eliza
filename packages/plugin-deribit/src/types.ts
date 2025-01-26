import type { AgentRuntime, UUID } from "@elizaos/core";
import { Memory } from "@elizaos/core";

// Deribit API response

export interface MarketData {
    btc?: {
        perpetual: {
            mark_price: number;
            index_price: number;
            basis: string;  // Comes as percentage string with '%'
            funding: {
                current: number;      // Comes as decimal (e.g. 0.00015655)
                predicted_8h: number; // Comes as decimal (e.g. 0.00014765)
            };
            open_interest: number;
            volume_24h: number;       // Comes as decimal
            price_change_24h: string; // Comes as percentage string with '%'
        };
        options: {
            total_open_interest: number;
            put_call_ratio: string;   // Comes as string (e.g. "0.494")
            active_strikes: number;
            puts_oi: number;
            calls_oi: number;
        };
        market_depth: {
            best_bid: number;
            best_ask: number;
            spread: string;          // Comes as string (e.g. "0.50")
            bid_size: number;
            ask_size: number;
        };
        timestamp: string;           // ISO string
    };
    eth?: {
        // Same structure as btc
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
    };
    sol?: {
        // Same structure as btc
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
    };
}

interface MarketDataContent {
    type: "MARKET_DATA";
    text: string;
    data: MarketData;
    [key: string]: any;
}

export interface MarketMetadata {
    isMarketUpdate: boolean;
    btcPrice?: number;
    ethPrice?: number;
    solPrice?: number;
    timestamp?: string;
}

export interface MarketDataMemory extends Memory {
    userId: UUID;
    agentId: UUID;
    roomId: UUID;
    content: {
        type: string;
        text: string;
        data?: any;
        metadata?: MarketMetadata;
    };
}

export interface MarketAnalysisState extends Record<string, any> {
    marketData?: MarketData;
}