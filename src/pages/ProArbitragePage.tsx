import { useEffect, useState } from 'react';
import type { ArbitrageOpportunity, Asset } from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { fetchArbitrageOpps } from '../services/arbitrageService';
import { formatPercent } from '../utils/formatters';
import { ProOnly } from '../components/common/ProLock';
import { basicAssets } from '../utils/markets';

export const ProArbitragePage = () => {
  const [data, setData] = useState<ArbitrageOpportunity[]>([]);
  const [asset, setAsset] = useState<Asset>('BTC');
  const [minSpread, setMinSpread] = useState(0.0005);
  const [risk, setRisk] =
    useState<ArbitrageOpportunity['riskLevel'] | 'any'>('any');
  const [loading, setLoading] = useState(true);
  const assets = basicAssets;

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setData(await fetchArbitrageOpps());
      setLoading(false);
    };
    void load();
  }, []);

  const filtered = data.filter((o) => {
    if (asset && o.asset !== asset) return false;
    if (o.spread < minSpread) return false;
    if (risk !== 'any' && o.riskLevel !== risk) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Cross-exchange arbitrage engine
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          Identify potential hedged funding trades by pairing long and short
          perps across venues. Always consider exchange risk, fees and
          operational complexity.
        </p>
      </div>
      <ProOnly>
        <Card>
          <CardHeader
            title="Filters"
            subtitle="Focus on specific assets, minimum spread and risk profile."
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
              <span className="text-slate-400">Min spread</span>
              <input
                type="number"
                value={(minSpread * 100).toFixed(3)}
                onChange={(e) => setMinSpread(Number(e.target.value) / 100)}
                className="w-24 rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                step="0.005"
              />
              <span className="text-slate-500 text-[0.7rem]">per period</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-400">Risk profile</span>
              <select
                value={risk}
                onChange={(e) =>
                  setRisk(e.target.value as ArbitrageOpportunity['riskLevel'] | 'any')
                }
                className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
              >
                <option value="any">Any</option>
                <option value="conservative">Conservative</option>
                <option value="moderate">Moderate</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </div>
        </Card>

        <Card padding="none">
          <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5 text-xs">
            <span className="font-semibold uppercase tracking-wide text-slate-500">
              Opportunities
            </span>
            <span className="text-slate-500">
              Sorted by net expected yield, fees inclusive.
            </span>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center text-sm text-slate-500">
              Scanning venues for opportunities…
            </div>
          ) : filtered.length === 0 ? (
            <div className="h-48 flex items-center justify-center text-sm text-slate-500">
              No opportunities match the current filters.
            </div>
          ) : (
            <div className="max-h-[440px] overflow-auto">
              <table className="min-w-full divide-y divide-slate-800 text-xs">
                <thead className="bg-slate-950/80 sticky top-0 z-10">
                  <tr>
                    <th className="px-4 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                      Asset
                    </th>
                    <th className="px-4 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                      Long
                    </th>
                    <th className="px-4 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                      Short
                    </th>
                    <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                      Funding spread
                    </th>
                    <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                      Est. profit (ann.)
                    </th>
                    <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                      Fees impact
                    </th>
                    <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                      Net yield
                    </th>
                    <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                      Risk
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filtered
                    .sort((a, b) => b.netYield - a.netYield)
                    .map((o) => (
                      <tr
                        key={o.id}
                        className="hover:bg-slate-900/80"
                      >
                        <td className="px-4 py-2 text-[0.8rem] font-medium text-slate-50">
                          {o.asset}
                        </td>
                        <td className="px-4 py-2 text-[0.8rem] text-emerald-200">
                          Long {o.longExchange}
                        </td>
                        <td className="px-4 py-2 text-[0.8rem] text-rose-200">
                          Short {o.shortExchange}
                        </td>
                        <td className="px-4 py-2 text-right text-[0.8rem] text-emerald-300">
                          {formatPercent(o.spread, 3)}
                        </td>
                        <td className="px-4 py-2 text-right text-[0.8rem] text-slate-200">
                          {formatPercent(o.estProfitAnnualized, 1)}
                        </td>
                        <td className="px-4 py-2 text-right text-[0.8rem] text-slate-400">
                          {formatPercent(o.estFeesImpact, 3)}
                        </td>
                        <td className="px-4 py-2 text-right text-[0.8rem]">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${
                              o.netYield > 0
                                ? 'bg-emerald-500/10 text-emerald-300'
                                : 'bg-rose-500/10 text-rose-300'
                            }`}
                          >
                            {formatPercent(o.netYield, 1)}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right text-[0.75rem] text-slate-300">
                          {o.riskLevel}
                          {o.isTop && (
                            <span className="ml-1 rounded-full bg-emerald-500/20 px-1.5 py-0.5 text-[0.6rem] text-emerald-200">
                              Top opp
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="border-t border-slate-800 px-4 py-2 text-[0.7rem] text-slate-500">
            Micro-insight: This module surfaces funding-driven opportunities
            only. In practice you&apos;d also constrain by basis, borrow rates,
            capital efficiency and exchange limits.
          </div>
        </Card>
      </ProOnly>
    </div>
  );
};
