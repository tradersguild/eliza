/**********************************************
 *           ARROW COMMON INTERFACES          *
 **********************************************/

export enum ArrowProduct {
    AMM = "amm",
    VAULT = "vault",
}

export enum Network {
    Mainnet = "mainnet",
    Testnet = "testnet",
}

export enum Chain {
    Avalanche = "avalanche",
}

export enum Ticker {
    AVAX = "AVAX",
    ETH = "ETH",
    BTC = "BTC",
}

export enum Currency {
    USD = "usd",
    EUR = "eur",
}

export type Strike = number[];

export enum ContractType {
    CALL = 0,
    PUT = 1,
}

export enum PositionStrategy {
    CALL = 0,
    PUT = 1,
    CALL_SPREAD = 2,
    PUT_SPREAD = 3,
    BUTTERFLY = 4,
    IRON_CONDOR = 5,
    STRADDLE = 7,
    STRANGLE = 8,
    CUSTOM = 6,
}

export enum OrderType {
    OPEN_LONG = 0,
    CLOSE_LONG = 1,
    OPEN_SHORT = 2,
    CLOSE_SHORT = 3,
}

export enum PositionStrategyType {
    LONG_CALL = "Long Call",
    SHORT_CALL = "Short Call",
    LONG_PUT = "Long Put",
    SHORT_PUT = "Short Put",
    CALL_DEBIT_SPREAD = "Call Debit Spread",
    CALL_CREDIT_SPREAD = "Call Credit Spread",
    PUT_DEBIT_SPREAD = "Put Debit Spread",
    PUT_CREDIT_SPREAD = "Put Credit Spread",
    PUT_SPREAD = "Put Spread",
    LONG_IRON_CONDOR = "Long Iron Condor",
    SHORT_IRON_CONDOR = "Short Iron Condor",
    LONG_CONDOR = "Long Condor",
    LONG_IRON_BUTTERFLY = "Long Iron Butterfly",
    SHORT_IRON_BUTTERFLY = "Short Iron Butterfly",
    SHORT_CONDOR = "Short Condor",
    LONG_BUTTERFLY = "Long Butterfly",
    SHORT_BUTTERFLY = "Short Butterfly",
    LONG_STRANGLE = "Long Strangle",
    LONG_STRADDLE = "Long Straddle",
    SHORT_STRANGLE = "Short Strangle",
    SHORT_STRADDLE = "Short Straddle",
    CUSTOM = "Custom",
}

export interface Option {
    ticker: Ticker;
    contractType: ContractType;
    orderType: OrderType;
    strike: number;
    price: number | null;
    readableExpiration: string;
    expirationTimestamp: number;
    quantity: number;
    greeks: Greeks | null;
}

export interface Position {
    symbol?: string;
    ticker: Ticker;
    leverage?: number;
    optionLegs: Option[];
    strategyType: PositionStrategy;
    orderType: OrderType;
    ratio: number;
    positionId?: number;
    price: number | null;
    spotPrice?: number;
    priceHistory?: {
        date: number;
        price: number;
    }[];
    greeks: Greeks | null;
}

export interface Greeks {
    delta: number;
    gamma: number;
    rho: number;
    theta: number;
    vega: number;
}
