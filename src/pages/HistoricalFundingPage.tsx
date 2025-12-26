import { useEffect, useState } from 'react';
import type { Asset, Exchange, FundingPoint } from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { InfoTooltip } from '../components/common/InfoTooltip';
import { getBasicAssets, getExchanges } from '../utils/mock';
import { fetchFundingSeries } from '../services/fundingService';
import { FundingLineChart } from '../components/charts/FundingLineChart';

type Range = '24h' | '7d' | '30d' | '90d';

export const HistoricalFundingPage = () => {
  const assets = getBasicAssets();
  const exchanges = getExchanges();
  const [asset, setAsset] = useState<Asset>('BTC');
  const [exchange, setExchange] = useState(exchanges[0]);
  const [range, setRange] = useState<Range>('7d');
  const [cumulative, setCumulative] = useState(false);
  const [data, setData] = useState<FundingPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const base = range === '24h' ? 24 : range === '7d' ? 24 * 7 : 24 * 30;
      const points = Math.min(240, base);
      setData(await fetchFundingSeries(asset, exchange));
      setLoading(false);
    };
    void load();
  }, [asset, exchange, range]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Historical funding
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-xl">
            Funding is most informative when you look at its path, not just
            today&apos;s print. Use the controls to inspect how persistent
            positive or negative funding has been.
          </p>
        </div>
        <InfoTooltip text="Persistent positive funding can signal leveraged long build-ups; persistent negative funding hints at protected shorts and hedging flows." />
      </div>

      <Card>
        <CardHeader
          title="Controls"
          subtitle="Asset, exchange, time window and cumulative vs point-in-time view."
        />
        <div className="flex flex-wrap items-center gap-3 text-xs">
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
          <div className="flex items-center gap-1">
            {(['24h', '7d', '30d', '90d'] as Range[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRange(r)}
                className={`rounded-full px-3 py-1 text-[0.7rem] ${
                  range === r
                    ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/40'
                    : 'bg-slate-900 text-slate-300 border border-slate-700'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
          <label className="flex items-center gap-1 text-[0.7rem] text-slate-300">
            <input
              type="checkbox"
              className="h-3 w-3 rounded border-slate-600 bg-slate-900"
              checked={cumulative}
              onChange={(e) => setCumulative(e.target.checked)}
            />
            Cumulative view
          </label>
        </div>
      </Card>

      <Card>
        <CardHeader
          title={`${asset} funding on ${exchange}`}
          subtitle={
            cumulative
              ? 'Cumulative funding helps you understand the drag or carry over the selected period.'
              : 'Point-in-time funding shows how aggressive longs or shorts have been at each interval.'
          }
        />
        {loading ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-500">
            Loading funding path…
          </div>
        ) : (
          <FundingLineChart data={data} showCumulative={cumulative} />
        )}
      </Card>
    </div>
  );
};
