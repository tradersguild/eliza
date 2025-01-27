export interface RFQParams {
  instrumentId: string;
  side: 'BUY' | 'SELL';
  quantity: number;
  price?: number;
  expiryTime?: number;
  settlementTime?: number;
}

export interface RFQResponse {
  rfqId: string;
  price: number;
  quantity: number;
  side: 'BUY' | 'SELL';
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'EXPIRED';
  settlementData?: any;
}

export interface Order {
  id: string;
  instrumentId: string;
  owner: string;
  side: 'BUY' | 'SELL';
  price: number;
  quantity: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
}

export interface CollateralAccount {
  address: string;
  owner: string;
  balance: number;
  currency: string;
}