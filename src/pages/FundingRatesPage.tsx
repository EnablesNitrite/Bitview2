import { useMemo, useState } from 'react';
import type { Asset, Exchange, FundingSnapshot } from '../types/core';
import { useLiveFunding } from '../hooks/useLiveFunding';
import { Card, CardHeader } from '../components/ui/Card';
import { InfoTooltip } from '../components/common/InfoTooltip';
import { Button } from '../components/ui/Button';
import { getBasicAssets, getExchanges } from '../utils/mock';
import { formatPercent, formatDateTime } from '../utils/formatters';

type SortKey = 'asset' | 'exchange' | 'currentRate';

export const FundingRatesPage = () => {
  const { data, loading, error } = useLiveFunding();
  const [assetFilter, setAssetFilter] = useState<Asset | 'all'>('all');
  const [exchangeFilter, setExchangeFilter] = useState<Exchange | 'all'>('all');
  const [onlyExtreme, setOnlyExtreme] = useState(false);
  const [sortKey, setSortKey] = useState<SortKey>('currentRate');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const assets = getBasicAssets();
  const exchanges = getExchanges();

  const rows = useMemo(() => {
    if (!data) return [];
    let filtered: FundingSnapshot[] = data;
    if (assetFilter !== 'all') {
      filtered = filtered.filter((f) => f.asset === assetFilter);
    }
    if (exchangeFilter !== 'all') {
      filtered = filtered.filter((f) => f.exchange === exchangeFilter);
    }
    if (onlyExtreme) {
      filtered = filtered.filter(
        (f) => Math.abs(f.currentRate) > 0.0008 || f.currentRate < 0
      );
    }
    const sorted = [...filtered].sort((a, b) => {
      const dir = sortDir === 'asc' ? 1 : -1;
      if (sortKey === 'asset') {
        return dir * a.asset.localeCompare(b.asset);
      }
      if (sortKey === 'exchange') {
        return dir * a.exchange.localeCompare(b.exchange);
      }
      return dir * (a.currentRate - b.currentRate);
    });
    return sorted;
  }, [data, assetFilter, exchangeFilter, onlyExtreme, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('desc');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Live funding rates
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-xl">
            Snapshot of BTC and ETH perp funding across Binance, Bybit, OKX,
            Bitget and Deribit. Use the filters to isolate assets, venues and
            extreme regimes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <InfoTooltip text="Funding rates keep perp prices anchored to spot. Positive funding means longs pay shorts; negative means shorts pay longs." />
          <Button size="sm" variant="ghost">
            Refresh
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Filters"
          subtitle="Narrow down by asset, exchange or focus on extreme conditions."
        />
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Asset</span>
            <select
              className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
              value={assetFilter}
              onChange={(e) => setAssetFilter(e.target.value as Asset | 'all')}
            >
              <option value="all">All</option>
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
              className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
              value={exchangeFilter}
              onChange={(e) =>
                setExchangeFilter(e.target.value as Exchange | 'all')
              }
            >
              <option value="all">All</option>
              {exchanges.map((ex) => (
                <option key={ex} value={ex}>
                  {ex}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setOnlyExtreme((v) => !v)}
            className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[0.65rem] ${
              onlyExtreme
                ? 'border-emerald-500/60 bg-emerald-500/10 text-emerald-200'
                : 'border-slate-700 bg-slate-900 text-slate-300'
            }`}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-rose-400" />
            Extreme funding only
          </button>
          <span className="text-[0.65rem] text-slate-500">
            Extreme = |funding| &gt; 0.08% or negative funding.
          </span>
        </div>
      </Card>

      <Card padding="none">
        <div className="flex items-center justify-between border-b border-slate-800 px-4 py-2.5">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Live funding snapshot
          </div>
          <div className="text-[0.7rem] text-slate-500">
            Updated {formatDateTime(new Date().toISOString())}
          </div>
        </div>
        <div className="max-h-[480px] overflow-auto">
          <table className="min-w-full divide-y divide-slate-800 text-xs">
            <thead className="bg-slate-950/80 sticky top-0 z-10">
              <tr>
                <th className="px-4 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                  #
                </th>
                <th
                  className="px-4 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 cursor-pointer"
                  onClick={() => toggleSort('asset')}
                >
                  Asset
                </th>
                <th
                  className="px-4 py-2 text-left text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 cursor-pointer"
                  onClick={() => toggleSort('exchange')}
                >
                  Exchange
                </th>
                <th
                  className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500 cursor-pointer"
                  onClick={() => toggleSort('currentRate')}
                >
                  Current funding
                </th>
                <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                  Next funding
                </th>
                <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                  8h rolling
                </th>
                <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                  24h rolling
                </th>
                <th className="px-4 py-2 text-right text-[0.65rem] font-semibold uppercase tracking-wide text-slate-500">
                  Z-Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    Loading live funding…
                  </td>
                </tr>
              )}
              {error && !loading && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-rose-400"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!loading && rows.length === 0 && !error && (
                <tr>
                  <td
                    colSpan={8}
                    className="px-4 py-10 text-center text-sm text-slate-500"
                  >
                    No rows match the current filters.
                  </td>
                </tr>
              )}
              {!loading &&
                rows.map((row, idx) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-900/80"
                  >
                    <td className="px-4 py-2 text-[0.7rem] text-slate-500">
                      {idx + 1}
                    </td>
                    <td className="px-4 py-2 text-[0.8rem] font-medium text-slate-50">
                      {row.asset}
                    </td>
                    <td className="px-4 py-2 text-[0.8rem] text-slate-300">
                      {row.exchange}
                    </td>
                    <td className="px-4 py-2 text-right text-[0.8rem]">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[0.7rem] font-semibold ${
                          row.currentRate >= 0
                            ? 'bg-emerald-500/10 text-emerald-300'
                            : 'bg-rose-500/10 text-rose-300'
                        }`}
                      >
                        {formatPercent(row.currentRate, 3)}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right text-[0.75rem] text-slate-300">
                      in ~{row.nextFundingInMinutes}m
                    </td>
                    <td className="px-4 py-2 text-right text-[0.75rem] text-slate-300">
                      {formatPercent(row.rolling8h, 3)}
                    </td>
                    <td className="px-4 py-2 text-right text-[0.75rem] text-slate-300">
                      {formatPercent(row.rolling24h, 3)}
                    </td>
                    <td className="px-4 py-2 text-right text-[0.75rem]">
                      <span
                        className={`text-[0.75rem] font-semibold ${
                          row.zScore > 1.5
                            ? 'text-emerald-300'
                            : row.zScore < -1.5
                            ? 'text-rose-300'
                            : 'text-slate-300'
                        }`}
                      >
                        {row.zScore.toFixed(2)}
                      </span>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-slate-800 px-4 py-2 text-[0.65rem] text-slate-500">
          Tip: Sort by Z-Score to quickly find where funding is most stretched
          versus its own history. Combine with heatmaps for intraday patterns.
        </div>
      </Card>
    </div>
  );
};
