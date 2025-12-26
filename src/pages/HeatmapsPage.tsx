import { useEffect, useState } from 'react';
import type { HeatmapCell, Asset, Exchange } from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { HeatmapGrid } from '../components/charts/HeatmapGrid';
import { basicAssets, supportedExchanges } from '../utils/markets';
import { fetchFundingSeries, fetchLiveFunding } from '../services/fundingService';

const buildFundingHeatmap = (
  series: { timestamp: string; rate: number }[],
  days = 30
): HeatmapCell[] => {
  const now = new Date();
  const start = new Date(now.getTime() - (days - 1) * 24 * 60 * 60 * 1000);
  const buckets = new Map<string, { sum: number; count: number }>();

  series.forEach((point) => {
    const date = new Date(point.timestamp);
    if (date < start || date > now) return;
    const dayOffset = Math.floor(
      (date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000)
    );
    const dayLabel = `${dayOffset - (days - 1)}d`;
    const hour = date.getUTCHours();
    const key = `${dayLabel}-${hour}`;
    const bucket = buckets.get(key) ?? { sum: 0, count: 0 };
    bucket.sum += point.rate;
    bucket.count += 1;
    buckets.set(key, bucket);
  });

  const cells: HeatmapCell[] = [];
  for (let d = 0; d < days; d += 1) {
    const dayLabel = `${d - (days - 1)}d`;
    for (let h = 0; h < 24; h += 1) {
      const key = `${dayLabel}-${h}`;
      const bucket = buckets.get(key);
      const value = bucket ? bucket.sum / bucket.count : 0;
      cells.push({ x: dayLabel, y: `${h}:00`, value });
    }
  }
  return cells;
};

const buildExchangeHeatmap = (
  assets: Asset[],
  exchanges: Exchange[],
  snapshots: {
    asset: Asset;
    exchange: Exchange;
    currentRate: number;
  }[]
): HeatmapCell[] => {
  const cells: HeatmapCell[] = [];
  const lookup = new Map<string, number>();
  snapshots.forEach((snap) => {
    lookup.set(`${snap.asset}-${snap.exchange}`, snap.currentRate);
  });

  exchanges.forEach((exchange) => {
    assets.forEach((asset) => {
      const value = lookup.get(`${asset}-${exchange}`) ?? 0;
      cells.push({ x: asset, y: exchange, value });
    });
  });

  return cells;
};

export const HeatmapsPage = () => {
  const [fundingHmap, setFundingHmap] = useState<HeatmapCell[]>([]);
  const [exchangeHmap, setExchangeHmap] = useState<HeatmapCell[]>([]);
  const [asset, setAsset] = useState<Asset>('BTC');
  const [exchange, setExchange] = useState<Exchange>('Binance');
  const assets = basicAssets;
  const exchanges = supportedExchanges;

  useEffect(() => {
    const load = async () => {
      const series = await fetchFundingSeries(asset, exchange, 200);
      setFundingHmap(buildFundingHeatmap(series));
      const snapshots = await fetchLiveFunding();
      setExchangeHmap(buildExchangeHeatmap(assets, exchanges, snapshots));
    };
    void load();
  }, [asset, exchange, assets, exchanges]);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Funding heatmaps
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          Heatmaps compress a lot of information into one view. Use them to
          identify intraday or cross-venue patterns that are invisible in single
          time series.
        </p>
      </div>

      <Card>
        <CardHeader
          title="Intraday funding intensity"
          subtitle="Rows are hours of the day, columns are days. Colors show normalized funding levels."
        />
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Asset</span>
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value as Asset)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
            >
              {assets.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Exchange</span>
            <select
              value={exchange}
              onChange={(e) => setExchange(e.target.value as Exchange)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
            >
              {exchanges.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>
          <span className="text-[0.7rem] text-slate-500">
            Hint: look for hours that consistently light up green or red across
            many days.
          </span>
        </div>
        <HeatmapGrid data={fundingHmap} xLabel="Days" yLabel="Hour of day" />
      </Card>

      <Card>
        <CardHeader
          title="Cross-exchange funding map"
          subtitle="Rows are exchanges, columns are assets. Colors show the latest funding print."
        />
        <HeatmapGrid data={exchangeHmap} xLabel="Asset" yLabel="Exchange" />
      </Card>
    </div>
  );
};
