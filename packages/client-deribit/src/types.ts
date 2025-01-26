export interface MarketData {
    btc?: {
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
    eth?: {
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

export interface DeribitClientInterface {
    getMarketData(): Promise<MarketData>;
}