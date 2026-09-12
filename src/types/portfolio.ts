export interface PortfolioItem {
  id: string;
  symbol: string;
  market: 'US' | 'TW';
  shares: number;
  buyDate: string;
  costPrice: number;
}

export interface StockPrice {
  currentPrice: number;
  previousClose: number;
  currency: 'USD' | 'TWD';
}

export interface PricesData {
  updatedAt: string;
  exchangeRate: {
    USDTWD: number;
  };
  data: Record<string, StockPrice>;
}

export interface HoldingDetail extends PortfolioItem {
  currentPrice: number;
  previousClose: number;
  currency: 'USD' | 'TWD';
  
  // 原幣計算欄位
  currentValueLocal: number;
  totalCostLocal: number;
  totalProfitLocal: number;
  totalProfitRateLocal: number;
  todayProfitLocal: number;
  todayProfitRateLocal: number;
  
  // 目標計價幣別 (TWD 或 USD) 計算欄位
  currentValueTarget: number;
  totalCostTarget: number;
  totalProfitTarget: number;
  todayProfitTarget: number;
}

export interface PortfolioSummary {
  totalValueTarget: number;
  totalCostTarget: number;
  totalProfitTarget: number;
  totalProfitRateTarget: number;
  todayProfitTarget: number;
  todayProfitRateTarget: number;
  holdings: HoldingDetail[];
  updatedAt: string;
}
