import { useState } from 'react';
import type { Exchange } from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { ProOnly } from '../components/common/ProLock';
import { Button } from '../components/ui/Button';
import { getExchanges } from '../utils/mock';
import { formatNumber, formatPercent } from '../utils/formatters';

export const ProSimulatorPage = () => {
  const exchanges = getExchanges();
  const [capital, setCapital] = useState(100_000);
  const [leverage, setLeverage] = useState(3);
  const [durationDays, setDurationDays] = useState(7);
  const [fundingSpread, setFundingSpread] = useState(0.0009);
  const [fees, setFees] = useState(0.0003);
  const [vol, setVol] = useState(0.7);
  const [longEx, setLongEx] = useState<Exchange>('Binance');
  const [shortEx, setShortEx] = useState<Exchange>('Bybit');

  const notional = capital * leverage;
  const periodsPerDay = 3;
  const periods = durationDays * periodsPerDay;
  const gross = notional * fundingSpread * periods;
  const feeCost = notional * fees * periods;
  const expectedPnl = gross - feeCost;
  const roi = expectedPnl / capital;

  const bestCase = expectedPnl * 1.5;
  const worstCase = expectedPnl - vol * capital * 0.4;

  const breakEvenVol =
    expectedPnl > 0 ? (expectedPnl / (capital * 0.4)) : 0.3;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
          Arbitrage PnL simulator
        </h1>
        <p className="mt-1 text-xs text-slate-400 max-w-xl">
          Sanity check a hedged funding trade before you wire capital. This is
          a simple, deterministic sketch — real desks also simulate borrow
          costs, basis, slippage and tail scenarios.
        </p>
      </div>
      <ProOnly>
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <Card>
            <CardHeader
              title="Inputs"
              subtitle="Capital, leverage, duration, funding spread, fees and volatility assumption."
            />
            <div className="grid gap-3 md:grid-cols-2 text-xs">
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Capital (USD)</label>
                <input
                  type="number"
                  value={capital}
                  onChange={(e) => setCapital(Number(e.target.value))}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Leverage</label>
                <input
                  type="number"
                  value={leverage}
                  onChange={(e) => setLeverage(Number(e.target.value))}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                  step="0.5"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Holding duration (days)</label>
                <input
                  type="number"
                  value={durationDays}
                  onChange={(e) => setDurationDays(Number(e.target.value))}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Funding spread per period</label>
                <input
                  type="number"
                  value={(fundingSpread * 100).toFixed(3)}
                  onChange={(e) =>
                    setFundingSpread(Number(e.target.value) / 100)
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                  step="0.005"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Fees per period</label>
                <input
                  type="number"
                  value={(fees * 100).toFixed(3)}
                  onChange={(e) => setFees(Number(e.target.value) / 100)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                  step="0.005"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">
                  Volatility assumption (realized, annual)
                </label>
                <input
                  type="number"
                  value={(vol * 100).toFixed(1)}
                  onChange={(e) => setVol(Number(e.target.value) / 100)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                  step="1"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Long exchange</label>
                <select
                  value={longEx}
                  onChange={(e) => setLongEx(e.target.value as Exchange)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                >
                  {exchanges.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Short exchange</label>
                <select
                  value={shortEx}
                  onChange={(e) => setShortEx(e.target.value as Exchange)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                >
                  {exchanges.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 text-[0.7rem] text-slate-500">
              This simulator assumes 3 funding events per day. In reality,
              schedules differ by venue (8h, hourly, variable).
            </div>
          </Card>
          <Card>
            <CardHeader
              title="Simulated outcome"
              subtitle="Quick sense-check — not investment advice."
            />
            <div className="space-y-3 text-sm">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-900/80 p-3">
                  <div className="text-slate-400">Notional exposure</div>
                  <div className="mt-1 text-lg font-semibold text-slate-50">
                    ${formatNumber(notional, 0)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3">
                  <div className="text-slate-400">Expected PnL</div>
                  <div className="mt-1 text-lg font-semibold text-emerald-300">
                    ${formatNumber(expectedPnl, 0)} ({formatPercent(roi, 2)})
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl bg-slate-900/80 p-3">
                  <div className="text-slate-400">Best case (carry + drift)</div>
                  <div className="mt-1 text-sm font-semibold text-emerald-300">
                    ${formatNumber(bestCase, 0)}
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-3">
                  <div className="text-slate-400">Worst case (vol shock)</div>
                  <div className="mt-1 text-sm font-semibold text-rose-300">
                    ${formatNumber(worstCase, 0)}
                  </div>
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/80 p-3 text-xs">
                <div className="text-slate-400">Break-even volatility</div>
                <div className="mt-1 text-sm font-semibold text-slate-50">
                  {(breakEvenVol * 100).toFixed(1)}% realized
                </div>
                <p className="mt-1 text-[0.7rem] text-slate-500">
                  If realized volatility exceeds this level, PnL is likely to be
                  dominated by hedging slippage and adverse moves rather than
                  funding carry.
                </p>
              </div>
              <Button
                size="sm"
                variant="secondary"
              >
                Export scenario to CSV (placeholder)
              </Button>
            </div>
          </Card>
        </div>
      </ProOnly>
    </div>
  );
};
