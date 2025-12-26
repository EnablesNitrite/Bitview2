import type {
  Asset,
  Exchange,
  FundingSnapshot,
  FundingPoint,
  FundingAnalytics,
  AdvancedMetric
} from '../types/core';
import { basicAssets, getAssetSymbol, supportedExchanges } from '../utils/markets';
import { fetchVolatilitySeries } from './volatilityService';

type FundingTicker = {
  rate: number;
  nextFundingTime?: number;
};

const fetchJson = async <T>(url: string, init?: RequestInit): Promise<T> => {
  const res = await fetch(url, init);
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
};

const sortByTimestamp = (points: FundingPoint[]) =>
  [...points].sort((a, b) =>
    new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

const fetchBinanceFundingHistory = async (
  asset: Asset,
  limit: number
): Promise<FundingPoint[]> => {
  const symbol = getAssetSymbol(asset, 'Binance');
  const url = `https://fapi.binance.com/fapi/v1/fundingRate?symbol=${symbol}&limit=${limit}`;
  const data = await fetchJson<
    { fundingRate: string; fundingTime: number }[]
  >(url);
  return sortByTimestamp(
    data.map((item) => ({
      timestamp: new Date(item.fundingTime).toISOString(),
      rate: Number(item.fundingRate)
    }))
  );
};

const fetchBybitFundingHistory = async (
  asset: Asset,
  limit: number
): Promise<FundingPoint[]> => {
  const symbol = getAssetSymbol(asset, 'Bybit');
  const url = `https://api.bybit.com/v5/market/funding/history?category=linear&symbol=${symbol}&limit=${limit}`;
  const data = await fetchJson<{
    result: { list: { fundingRate: string; fundingRateTimestamp: string }[] };
  }>(url);
  return sortByTimestamp(
    (data.result?.list ?? []).map((item) => ({
      timestamp: new Date(Number(item.fundingRateTimestamp)).toISOString(),
      rate: Number(item.fundingRate)
    }))
  );
};

const fetchOkxFundingHistory = async (
  asset: Asset,
  limit: number
): Promise<FundingPoint[]> => {
  const symbol = getAssetSymbol(asset, 'OKX');
  const url = `https://www.okx.com/api/v5/public/funding-rate-history?instId=${symbol}&limit=${limit}`;
  const data = await fetchJson<{ data: { fundingRate: string; fundingTime: string }[] }>(
    url
  );
  return sortByTimestamp(
    (data.data ?? []).map((item) => ({
      timestamp: new Date(Number(item.fundingTime)).toISOString(),
      rate: Number(item.fundingRate)
    }))
  );
};

const fetchBinanceFundingTicker = async (asset: Asset): Promise<FundingTicker> => {
  const symbol = getAssetSymbol(asset, 'Binance');
  const url = `https://fapi.binance.com/fapi/v1/premiumIndex?symbol=${symbol}`;
  const data = await fetchJson<{ lastFundingRate: string; nextFundingTime: number }>(
    url
  );
  return {
    rate: Number(data.lastFundingRate),
    nextFundingTime: Number(data.nextFundingTime)
  };
};

const fetchBybitFundingTicker = async (asset: Asset): Promise<FundingTicker> => {
  const symbol = getAssetSymbol(asset, 'Bybit');
  const url = `https://api.bybit.com/v5/market/tickers?category=linear&symbol=${symbol}`;
  const data = await fetchJson<{ result: { list: { fundingRate: string; nextFundingTime: string }[] } }>(
    url
  );
  const ticker = data.result?.list?.[0];
  return {
    rate: Number(ticker?.fundingRate ?? 0),
    nextFundingTime: ticker?.nextFundingTime ? Number(ticker.nextFundingTime) : undefined
  };
};

const fetchOkxFundingTicker = async (asset: Asset): Promise<FundingTicker> => {
  const symbol = getAssetSymbol(asset, 'OKX');
  const url = `https://www.okx.com/api/v5/public/funding-rate?instId=${symbol}`;
  const data = await fetchJson<{ data: { fundingRate: string; nextFundingTime: string }[] }>(
    url
  );
  const ticker = data.data?.[0];
  return {
    rate: Number(ticker?.fundingRate ?? 0),
    nextFundingTime: ticker?.nextFundingTime ? Number(ticker.nextFundingTime) : undefined
  };
};

const fetchFundingHistory = async (
  asset: Asset,
  exchange: Exchange,
  limit: number
): Promise<FundingPoint[]> => {
  switch (exchange) {
    case 'Binance':
      return fetchBinanceFundingHistory(asset, limit);
    case 'Bybit':
      return fetchBybitFundingHistory(asset, limit);
    case 'OKX':
      return fetchOkxFundingHistory(asset, limit);
    default:
      return [];
  }
};

const fetchFundingTicker = async (
  asset: Asset,
  exchange: Exchange
): Promise<FundingTicker | null> => {
  switch (exchange) {
    case 'Binance':
      return fetchBinanceFundingTicker(asset);
    case 'Bybit':
      return fetchBybitFundingTicker(asset);
    case 'OKX':
      return fetchOkxFundingTicker(asset);
    default:
      return null;
  }
};

const calculateStats = (series: FundingPoint[]) => {
  const rates = series.map((p) => p.rate);
  const mean =
    rates.reduce((acc, rate) => acc + rate, 0) / Math.max(1, rates.length);
  const variance =
    rates.reduce((acc, rate) => acc + (rate - mean) ** 2, 0) /
    Math.max(1, rates.length);
  const stdev = Math.sqrt(variance);
  return { mean, stdev };
};

const calculateRolling = (series: FundingPoint[], window: number) => {
  const windowSeries = series.slice(-window);
  if (!windowSeries.length) return 0;
  return (
    windowSeries.reduce((acc, point) => acc + point.rate, 0) /
    Math.max(1, windowSeries.length)
  );
};

export const fetchLiveFunding = async (): Promise<FundingSnapshot[]> => {
  const assets = basicAssets;
  const exchanges = supportedExchanges;
  const combos = assets.flatMap((asset) =>
    exchanges.map((exchange) => ({ asset, exchange }))
  );

  const results = await Promise.all(
    combos.map(async ({ asset, exchange }) => {
      try {
        const [series, ticker] = await Promise.all([
          fetchFundingHistory(asset, exchange, 96),
          fetchFundingTicker(asset, exchange)
        ]);
        const sorted = sortByTimestamp(series);
        const latestRate = ticker?.rate ?? sorted.at(-1)?.rate ?? 0;
        const nextFundingTime = ticker?.nextFundingTime;
        const { mean, stdev } = calculateStats(sorted);
        const zScore = stdev ? (latestRate - mean) / stdev : 0;
        const rolling8h = calculateRolling(sorted, 1);
        const rolling24h = calculateRolling(sorted, 3);
        const nextFundingInMinutes = nextFundingTime
          ? Math.max(0, Math.round((nextFundingTime - Date.now()) / 60000))
          : 0;
        return {
          id: `${asset}-${exchange}`,
          asset,
          exchange,
          currentRate: latestRate,
          nextFundingInMinutes,
          rolling8h,
          rolling24h,
          zScore
        } as FundingSnapshot;
      } catch (error) {
        return null;
      }
    })
  );

  return results.filter((item): item is FundingSnapshot => Boolean(item));
};

export const fetchFundingSeries = async (
  asset: Asset,
  exchange: Exchange,
  limit = 96
): Promise<FundingPoint[]> => {
  return fetchFundingHistory(asset, exchange, limit);
};

export const fetchFundingAnalytics = async (
  asset: Asset,
  exchange: Exchange
): Promise<FundingAnalytics> => {
  const series = await fetchFundingHistory(asset, exchange, 96);
  const { mean, stdev } = calculateStats(series);
  const current = series.at(-1)?.rate ?? mean;
  const zScore = stdev ? (current - mean) / stdev : 0;
  const rolling8h = calculateRolling(series, 1);
  const rolling24h = calculateRolling(series, 3);
  return {
    asset,
    exchange,
    currentRate: current,
    mean,
    stdev,
    zScore,
    rolling8h,
    rolling24h
  };
};

const formatScore = (value: number, max = 100) =>
  `${Math.min(max, Math.max(0, Math.round(value)))} / ${max}`;

export const fetchAdvancedMetrics = async (): Promise<AdvancedMetric[]> => {
  const analytics = await fetchFundingAnalytics('BTC', 'Binance');
  const volSeries = await fetchVolatilitySeries('BTC', 30);
  const latestVol = volSeries.at(-1)?.realizedVol ?? 0;
  const fundingRisk = Math.abs(analytics.zScore) * 20 + latestVol * 10;
  const fundingVolRatio =
    latestVol > 0 ? Math.abs(analytics.currentRate) / latestVol : 0;

  const fundingSeries = await fetchFundingSeries('BTC', 'Binance', 90);
  let negativeStreak = 0;
  for (let i = fundingSeries.length - 1; i >= 0; i -= 1) {
    if (fundingSeries[i].rate < 0) {
      negativeStreak += 1;
    } else {
      break;
    }
  }

  const meanReversionProbability = Math.max(
    0,
    Math.min(1, 1 - Math.abs(analytics.zScore) / 3)
  );

  return [
    {
      id: 'risk-index',
      label: 'Funding Risk Index',
      value: formatScore(fundingRisk),
      description:
        'Composite of funding z-score and realized volatility from live BTC data.',
      trend: analytics.zScore > 1 ? 'up' : analytics.zScore < -1 ? 'down' : 'flat'
    },
    {
      id: 'fv-ratio',
      label: 'Funding / Vol Ratio',
      value: fundingVolRatio.toFixed(2),
      description:
        'Current funding divided by realized volatility to gauge carry per unit of risk.',
      trend: fundingVolRatio > 1.5 ? 'up' : fundingVolRatio < 0.5 ? 'down' : 'flat'
    },
    {
      id: 'neg-streak',
      label: 'Negative Funding Streak',
      value: `${negativeStreak} periods`,
      description:
        'Consecutive funding intervals with negative prints on Binance BTC perps.',
      trend: negativeStreak > 6 ? 'down' : negativeStreak > 2 ? 'flat' : 'up'
    },
    {
      id: 'mr-prob',
      label: 'Mean Reversion Probability',
      value: `${Math.round(meanReversionProbability * 100)}%`,
      description:
        'Simple probability proxy based on how stretched funding is vs its mean.',
      trend: meanReversionProbability > 0.6 ? 'up' : meanReversionProbability < 0.4 ? 'down' : 'flat'
    }
  ];
};
