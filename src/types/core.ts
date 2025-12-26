export type Plan = 'basic' | 'pro';

export type Asset =
  | 'BTC'
  | 'ETH'
  | 'SOL'
  | 'BNB'
  | 'DOGE'
  | 'XRP'
  | 'LTC';

export type Exchange = 'Binance' | 'Bybit' | 'OKX' | 'Bitget' | 'Deribit';

export interface FundingPoint {
  timestamp: string; // ISO
  rate: number; // e.g. 0.01 => 1%
}

export interface FundingSnapshot {
  id: string;
  asset: Asset;
  exchange: Exchange;
  currentRate: number;
  nextFundingInMinutes: number;
  rolling8h: number;
  rolling24h: number;
  zScore: number;
}

export interface VolatilityPoint {
  timestamp: string;
  realizedVol: number;
  atr: number;
  stdev: number;
}

export interface HeatmapCell {
  x: string;
  y: string;
  value: number;
}

export type AlertDelivery = 'email' | 'telegram' | 'discord';

export type BasicAlertType = 'fundingAbove' | 'fundingNegative' | 'highVol';

export interface AlertBase {
  id: string;
  asset: Asset;
  exchange?: Exchange;
  active: boolean;
  createdAt: string;
}

export interface BasicAlert extends AlertBase {
  plan: 'basic';
  type: BasicAlertType;
  threshold?: number;
  delivery: AlertDelivery;
}

export type ProAlertType =
  | 'arbitrage'
  | 'spread'
  | 'fundingReversal'
  | 'extremeZ'
  | 'volRegime';

export interface ProAlert extends AlertBase {
  plan: 'pro';
  type: ProAlertType;
  params?: Record<string, unknown>;
  delivery: AlertDelivery | 'sms';
}

export type Alert = BasicAlert | ProAlert;

export interface ArbitrageOpportunity {
  id: string;
  asset: Asset;
  longExchange: Exchange;
  shortExchange: Exchange;
  spread: number;
  estProfitAnnualized: number;
  estFeesImpact: number;
  netYield: number;
  riskLevel: 'conservative' | 'moderate' | 'aggressive';
  isTop?: boolean;
}

export interface FundingAnalytics {
  asset: Asset;
  exchange: Exchange;
  currentRate: number;
  mean: number;
  stdev: number;
  zScore: number;
  rolling8h: number;
  rolling24h: number;
}

export interface AdvancedMetric {
  id: string;
  label: string;
  value: string;
  description: string;
  trend: 'up' | 'down' | 'flat';
}
