import type { Asset, VolatilityPoint } from '../types/core';

const COINCAP_API_KEY = import.meta.env.VITE_COINCAP_API_KEY as
  | string
  | undefined;

const assetToCoincapId: Record<Asset, string> = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  SOL: 'solana',
  BNB: 'binance-coin',
  DOGE: 'dogecoin',
  XRP: 'xrp',
  LTC: 'litecoin'
};

type CoincapHistoryPoint = {
  priceUsd: string;
  time: number;
};

type CoincapHistoryResponse = {
  data: CoincapHistoryPoint[];
};

const fetchJson = async <T>(url: string): Promise<T> => {
  const res = await fetch(url, {
    headers: COINCAP_API_KEY
      ? {
          Authorization: `Bearer ${COINCAP_API_KEY}`
        }
      : undefined
  });
  if (!res.ok) {
    throw new Error(`Request failed: ${res.status}`);
  }
  return (await res.json()) as T;
};

const standardDeviation = (values: number[]) => {
  if (!values.length) return 0;
  const mean = values.reduce((acc, value) => acc + value, 0) / values.length;
  const variance =
    values.reduce((acc, value) => acc + (value - mean) ** 2, 0) /
    values.length;
  return Math.sqrt(variance);
};

export const fetchVolatilitySeries = async (
  asset: Asset,
  days: number
): Promise<VolatilityPoint[]> => {
  const id = assetToCoincapId[asset];
  const end = Date.now();
  const start = end - days * 24 * 60 * 60 * 1000;
  const url = `https://api.coincap.io/v2/assets/${id}/history?interval=d1&start=${start}&end=${end}`;
  const data = await fetchJson<CoincapHistoryResponse>(url);
  const prices = data.data
    .map((point) => ({
      time: point.time,
      price: Number(point.priceUsd)
    }))
    .filter((point) => Number.isFinite(point.price))
    .sort((a, b) => a.time - b.time);

  const returns: number[] = [];
  for (let i = 1; i < prices.length; i += 1) {
    const prev = prices[i - 1].price;
    const next = prices[i].price;
    returns.push(Math.log(next / prev));
  }

  const window = Math.min(14, returns.length);

  return prices.slice(1).map((point, idx) => {
    const sliceStart = Math.max(0, idx - window + 1);
    const windowReturns = returns.slice(sliceStart, idx + 1);
    const stdev = standardDeviation(windowReturns);
    const realizedVol = stdev * Math.sqrt(365);
    const atr =
      windowReturns.reduce((acc, value) => acc + Math.abs(value), 0) /
      Math.max(1, windowReturns.length) *
      Math.sqrt(365);

    return {
      timestamp: new Date(point.time).toISOString(),
      realizedVol,
      atr,
      stdev
    };
  });
};
