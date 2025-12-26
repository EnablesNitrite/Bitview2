import { useEffect, useState } from 'react';
import type { Asset, VolatilityPoint } from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { VolatilityChart } from '../components/charts/VolatilityChart';
import { fetchVolatilitySeries } from '../services/volatilityService';
import { InsightBox } from '../components/common/InsightBox';
import { InfoTooltip } from '../components/common/InfoTooltip';

export const VolatilityPage = () => {
  const [asset, setAsset] = useState<Asset>('BTC');
  const [data, setData] = useState<VolatilityPoint[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setData(await fetchVolatilitySeries(asset, 60));
      setLoading(false);
    };
    void load();
  }, [asset]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Volatility (Basic)
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-xl">
            Realized volatility tells you how dangerous a funding regime is. The
            same 0.03% funding feels very different in a sleepy vs panic market.
          </p>
        </div>
        <InfoTooltip text="Realized volatility is based on actual price moves, whereas implied volatility is derived from options. In the Basic plan we focus on realized vol as a proxy for risk." />
      </div>

      <Card>
        <CardHeader
          title="Realized volatility"
          subtitle="Rolling realized volatility approximated from mock price paths."
          actions={
            <select
              value={asset}
              onChange={(e) => setAsset(e.target.value as Asset)}
              className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
            >
              <option value="BTC">BTC</option>
              <option value="ETH">ETH</option>
            </select>
          }
        />
        {loading ? (
          <div className="h-64 flex items-center justify-center text-sm text-slate-500">
            Loading volatility…
          </div>
        ) : (
          <VolatilityChart data={data} />
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <InsightBox title="Volatility vs funding">
          Funding risk is nonlinear. When volatility is low, high funding can be
          harvested with relatively tight stops. When volatility spikes, the
          same funding level implies much higher liquidation and gap risk.
        </InsightBox>
        <InsightBox title="Volatility regimes">
          We think in regimes: low vol (range-bound), expansion (trend breaks),
          panic (one-way, gappy) and high-vol consolidation (post-shock chop).
          In Pro, the volatility terminal classifies the current regime for each
          asset.
        </InsightBox>
      </div>
    </div>
  );
};
