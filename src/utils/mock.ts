import type {
  Asset,
  Exchange,
  FundingSnapshot,
  FundingPoint,
  VolatilityPoint,
  ArbitrageOpportunity,
  HeatmapCell,
  AdvancedMetric
} from '../types/core';

const assets: Asset[] = ['BTC', 'ETH', 'SOL', 'BNB', 'DOGE', 'XRP', 'LTC'];
const basicAssets: Asset[] = ['BTC', 'ETH'];
const exchanges: Exchange[] = ['Binance', 'Bybit', 'OKX', 'Bitget', 'Deribit'];

export const getBasicAssets = () => basicAssets;
export const getAllAssets = () => assets;
export const getExchanges = () => exchanges;

const now = Date.now();

const rand = (min: number, max: number) =>
  min + Math.random() * (max - min);

export const mockFundingSnapshots = (): FundingSnapshot[] => {
  const result: FundingSnapshot[] = [];
  for (const asset of basicAssets) {
    for (const ex of exchanges) {
      const current = rand(-0.0008, 0.0012);
      const mean = 0.0001;
      const stdev = 0.0005;
      const z = (current - mean) / stdev;
      result.push({
        id: `${asset}-${ex}`,
        asset,
        exchange: ex,
        currentRate: current,
        nextFundingInMinutes: Math.floor(rand(10, 480)),
        rolling8h: current + rand(-0.0002, 0.0002),
        rolling24h: current + rand(-0.0003, 0.0003),
        zScore: z
      });
    }
  }
  return result;
};

export const mockFundingSeries = (
  asset: Asset,
  exchange: Exchange,
  points = 48
): FundingPoint[] =>
  Array.from({ length: points }).map((_, i) => {
    const t = now - (points - i) * 60 * 60 * 1000;
    const base = asset === 'BTC' ? 0.0001 : 0.00012;
    const seasonal = Math.sin(i / 4) * 0.0002;
    const noise = rand(-0.0002, 0.0002);
    return {
      timestamp: new Date(t).toISOString(),
      rate: base + seasonal + noise
    };
  });

export const mockVolatilitySeries = (
  asset: Asset,
  days = 60
): VolatilityPoint[] =>
  Array.from({ length: days }).map((_, i) => {
    const t = now - (days - i) * 24 * 60 * 60 * 1000;
    const base = asset === 'BTC' ? 0.6 : 0.8;
    const regime = Math.sin(i / 10) * 0.2;
    const noise = rand(-0.05, 0.05);
    const realizedVol = Math.max(0.1, base + regime + noise);
    return {
      timestamp: new Date(t).toISOString(),
      realizedVol,
      atr: realizedVol / 2,
      stdev: realizedVol / 3
    };
  });

export const mockArbitrageOpps = (): ArbitrageOpportunity[] => {
  const combos: [Asset, Exchange, Exchange][] = [
    ['BTC', 'Binance', 'Bybit'],
    ['BTC', 'OKX', 'Deribit'],
    ['ETH', 'Binance', 'Bybit'],
    ['ETH', 'Bybit', 'OKX']
  ];
  return combos.map(([asset, longEx, shortEx], idx) => {
    const spread = rand(0.0004, 0.0015);
    const fees = rand(0.0001, 0.0004);
    const net = spread - fees;
    const risk: ArbitrageOpportunity['riskLevel'] =
      idx === 0 ? 'conservative' : idx === 1 ? 'moderate' : 'aggressive';
    return {
      id: `${asset}-${longEx}-${shortEx}`,
      asset,
      longExchange: longEx,
      shortExchange: shortEx,
      spread,
      estProfitAnnualized: net * 365 * 3,
      estFeesImpact: fees,
      netYield: net * 365 * 3,
      riskLevel: risk,
      isTop: idx === 0
    };
  });
};

export const mockFundingHeatmap = (): HeatmapCell[] => {
  const cells: HeatmapCell[] = [];
  const days = 30;
  for (let d = 0; d < days; d++) {
    const dayLabel = `${d - days + 1}d`;
    for (let h = 0; h < 24; h++) {
      cells.push({
        x: dayLabel,
        y: `${h}:00`,
        value: rand(-0.001, 0.0015)
      });
    }
  }
  return cells;
};

export const mockExchangeHeatmap = (): HeatmapCell[] => {
  const cells: HeatmapCell[] = [];
  for (const ex of exchanges) {
    for (const asset of basicAssets) {
      cells.push({
        x: asset,
        y: ex,
        value: rand(-0.0008, 0.0012)
      });
    }
  }
  return cells;
};

export const mockAdvancedMetrics = (): AdvancedMetric[] => [
  {
    id: 'risk-index',
    label: 'Funding Risk Index',
    value: '63 / 100',
    description:
      'Composite of funding level, volatility and negative streaks. Elevated but not extreme.',
    trend: 'up'
  },
  {
    id: 'fv-ratio',
    label: 'Funding / Vol Ratio',
    value: '1.8',
    description:
      'Reward per unit of realized volatility. Values above 1.5 are attractive for carry.',
    trend: 'up'
  },
  {
    id: 'neg-streak',
    label: 'Negative Funding Streak',
    value: '9 periods',
    description:
      'Consecutive periods with funding below zero. Suggests persistent short demand.',
    trend: 'flat'
  },
  {
    id: 'mr-prob',
    label: 'Mean Reversion Probability',
    value: '41%',
    description:
      'Probability that funding normalizes towards its historical mean over the next 24h.',
    trend: 'down'
  }
];
