import { useEffect, useState } from 'react';
import type { Asset, VolatilityPoint } from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { ProOnly } from '../components/common/ProLock';
import { VolatilityChart } from '../components/charts/VolatilityChart';
import { fetchVolatilitySeries } from '../services/volatilityService';
import { InsightBox } from '../components/common/InsightBox';

export const ProVolatilityTerminalPage = () => {
  const [asset, setAsset] = useState<Asset>('BTC');
  const [data, setData] = useState<VolatilityPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setData(await fetchVolatilitySeries(asset, 120));
      setLoading(false);
    };
    void load();
  }, [asset]);

  const latest = data[data.length - 1]?.realizedVol ?? 0.5;
  const regime =
    latest < 0.4
      ? 'Low volatility'
      : latest < 0.7
      ? 'Expansion'
      : latest < 1.1
      ? 'High-vol consolidation'
      : 'Panic';

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Volatility terminal (Pro)
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          Multi-horizon realized volatility, return distributions and regime
          labels to help you size trades and understand risk.
        </p>
      </div>
      <ProOnly>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader
              title="Realized volatility (120d)"
              subtitle="Overlay 7d / 30d / 90d windows via hover and data inspection."
              actions={
                <select
                  value={asset}
                  onChange={(e) => setAsset(e.target.value as Asset)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                >
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="SOL">SOL</option>
                  <option value="BNB">BNB</option>
                </select>
              }
            />
            {loading ? (
              <div className="h-64 flex items-center justify-center text-sm text-slate-500">
                Loading volatility curves…
              </div>
            ) : (
              <VolatilityChart data={data} />
            )}
          </Card>
          <div className="space-y-3">
            <Card>
              <CardHeader
                title="Regime classifier"
                subtitle="Simple heuristic based on realized vol bands."
              />
              <div className="space-y-2 text-sm">
                <div className="text-xs text-slate-400">
                  Current regime for {asset}
                </div>
                <div className="text-lg font-semibold text-emerald-300">
                  {regime}
                </div>
                <div className="text-xs text-slate-400">
                  Latest realized vol:{' '}
                  <span className="font-semibold text-slate-50">
                    {(latest * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </Card>
            <InsightBox title="Returns distribution (placeholder)">
              In a full implementation this panel would show a histogram of
              daily or hourly returns, helping you spot fat tails and skew. Pro
              users often overlay this with their stop-loss logic.
            </InsightBox>
            <InsightBox title="GARCH & implied vol">
              This demo focuses on realized volatility. A production deployment
              would add a GARCH-style model and an implied vol surface to bridge
              perp and options markets.
            </InsightBox>
          </div>
        </div>
      </ProOnly>
    </div>
  );
};
