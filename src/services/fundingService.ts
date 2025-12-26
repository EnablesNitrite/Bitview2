import type {
  Asset,
  Exchange,
  FundingSnapshot,
  FundingPoint,
  FundingAnalytics
} from '../types/core';
import {
  mockAdvancedMetrics,
  mockFundingSeries,
  mockFundingSnapshots
} from '../utils/mock';

export const fetchLiveFunding = async (): Promise<FundingSnapshot[]> => {
  await new Promise((r) => setTimeout(r, 400));
  return mockFundingSnapshots();
};

export const fetchFundingSeries = async (
  asset: Asset,
  exchange: Exchange
): Promise<FundingPoint[]> => {
  await new Promise((r) => setTimeout(r, 300));
  return mockFundingSeries(asset, exchange);
};

export const fetchFundingAnalytics = async (
  asset: Asset,
  exchange: Exchange
): Promise<FundingAnalytics> => {
  await new Promise((r) => setTimeout(r, 250));
  const series = mockFundingSeries(asset, exchange, 96);
  const mean =
    series.reduce((acc, p) => acc + p.rate, 0) / Math.max(1, series.length);
  const variance =
    series.reduce((acc, p) => acc + (p.rate - mean) ** 2, 0) /
    Math.max(1, series.length);
  const stdev = Math.sqrt(variance);
  const current = series[series.length - 1]?.rate ?? mean;
  const zScore = stdev ? (current - mean) / stdev : 0;
  const rolling8h =
    series.slice(-8).reduce((acc, p) => acc + p.rate, 0) / Math.max(1, 8);
  const rolling24h =
    series.slice(-24).reduce((acc, p) => acc + p.rate, 0) / Math.max(1, 24);
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

export const fetchAdvancedMetrics = async () => {
  await new Promise((r) => setTimeout(r, 250));
  return mockAdvancedMetrics();
};
