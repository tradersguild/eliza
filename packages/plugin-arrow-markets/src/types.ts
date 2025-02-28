export interface volumeReponse {
    daily_notional_volume: number,
    daily_premium_volume: number,
    total_notional_volume: number
}

export interface OpenInterestDetail {
    strike: number;
    call_oi: number;
    put_oi: number;
    total_oi: number;
  }
  
  export interface OpenInterestExpiry {
    expiration: string;
    total_oi: number;
    details: OpenInterestDetail[];
  }
  
  export interface OpenInterestByUnderlying {
    [underlying: string]: number;
  }
  
  export interface DetailedBreakdown {
    [underlying: string]: OpenInterestExpiry[];
  }
  
  export interface OpenInterestResponse {
    total_open_interest: number;
    open_interest_by_underlying: OpenInterestByUnderlying;
    detailed_breakdown: DetailedBreakdown;
  }