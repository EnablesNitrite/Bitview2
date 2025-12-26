import type { ArbitrageOpportunity } from '../types/core';
import { fetchLiveFunding } from './fundingService';

const estimateRisk = (spread: number): ArbitrageOpportunity['riskLevel'] => {
  if (spread > 0.0012) return 'aggressive';
  if (spread > 0.0006) return 'moderate';
  return 'conservative';
};

export const fetchArbitrageOpps = async (): Promise<ArbitrageOpportunity[]> => {
  const snapshots = await fetchLiveFunding();
  const byAsset = snapshots.reduce<Record<string, typeof snapshots>>(
    (acc, snapshot) => {
      acc[snapshot.asset] = acc[snapshot.asset] ?? [];
      acc[snapshot.asset].push(snapshot);
      return acc;
    },
    {}
  );

  const opportunities: ArbitrageOpportunity[] = [];

  Object.values(byAsset).forEach((rows) => {
    if (rows.length < 2) return;
    const sorted = [...rows].sort((a, b) => a.currentRate - b.currentRate);
    const lowest = sorted[0];
    const highest = sorted[sorted.length - 1];
    const spread = highest.currentRate - lowest.currentRate;
    const estFeesImpact = 0.00025;
    const netYield = spread - estFeesImpact;

    opportunities.push({
      id: `${lowest.asset}-${lowest.exchange}-${highest.exchange}`,
      asset: lowest.asset,
      longExchange: lowest.exchange,
      shortExchange: highest.exchange,
      spread,
      estProfitAnnualized: netYield * 365 * 3,
      estFeesImpact,
      netYield: netYield * 365 * 3,
      riskLevel: estimateRisk(spread),
      isTop: false
    });
  });

  const sorted = opportunities.sort((a, b) => b.netYield - a.netYield);
  if (sorted[0]) sorted[0].isTop = true;
  return sorted;
};
