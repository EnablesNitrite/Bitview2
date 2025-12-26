import { useEffect, useState } from 'react';
import type { HeatmapCell } from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { HeatmapGrid } from '../components/charts/HeatmapGrid';
import {
  mockFundingHeatmap,
  mockExchangeHeatmap,
  getBasicAssets,
  getExchanges
} from '../utils/mock';
import type { Asset, Exchange } from '../types/core';

export const HeatmapsPage = () => {
  const [fundingHmap, setFundingHmap] = useState<HeatmapCell[]>([]);
  const [exchangeHmap, setExchangeHmap] = useState<HeatmapCell[]>([]);
  const [asset, setAsset] = useState<Asset>('BTC');
  const [exchange, setExchange] = useState<Exchange>('Binance');
  const assets = getBasicAssets();
  const exchanges = getExchanges();

  useEffect(() => {
    setFundingHmap(mockFundingHeatmap());
    setExchangeHmap(mockExchangeHeatmap());
  }, [asset, exchange]);

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
        <HeatmapGrid
          data={fundingHmap}
          xLabel="Days"
          yLabel="Hour of day"
        />
      </Card>

      <Card>
        <CardHeader
          title="Cross-exchange funding map"
          subtitle="Rows are exchanges, columns are assets. Colors show the latest funding print."
        />
        <HeatmapGrid
          data={exchangeHmap}
          xLabel="Asset"
          yLabel="Exchange"
        />
      </Card>
    </div>
  );
};
