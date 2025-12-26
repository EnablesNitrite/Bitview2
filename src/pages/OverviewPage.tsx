import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { InsightBox } from '../components/common/InsightBox';
import { useLiveFunding } from '../hooks/useLiveFunding';
import { formatPercent } from '../utils/formatters';
import { Link } from 'react-router-dom';
import { VolatilityChart } from '../components/charts/VolatilityChart';
import { fetchVolatilitySeries } from '../services/volatilityService';
import { useEffect, useState } from 'react';
import type { VolatilityPoint } from '../types/core';

export const OverviewPage = () => {
  const { data: funding, loading } = useLiveFunding();
  const [btcVol, setBtcVol] = useState<VolatilityPoint[]>([]);
  const [ethVol, setEthVol] = useState<VolatilityPoint[]>([]);

  useEffect(() => {
    (async () => {
      setBtcVol(await fetchVolatilitySeries('BTC', 30));
      setEthVol(await fetchVolatilitySeries('ETH', 30));
    })();
  }, []);

  const btc = funding?.filter((f) => f.asset === 'BTC') ?? [];
  const eth = funding?.filter((f) => f.asset === 'ETH') ?? [];
  const avg = (arr: typeof btc) =>
    arr.length ? arr.reduce((a, b) => a + b.currentRate, 0) / arr.length : 0;

  const avgBtc = avg(btc);
  const avgEth = avg(eth);

  const mostBullish = funding
    ? [...funding].sort((a, b) => b.currentRate - a.currentRate)[0]
    : undefined;
  const mostBearish = funding
    ? [...funding].sort((a, b) => a.currentRate - b.currentRate)[0]
    : undefined;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Overview
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-xl">
            High-level view of funding, volatility and cross-exchange spreads.
            Use this page as your morning read to decide whether to lean into
            carry, mean-reversion or stay flat.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/app/funding">
            <Button size="sm" variant="secondary">
              View live funding
            </Button>
          </Link>
          <Link to="/app/pro/arbitrage">
            <Button size="sm" variant="soft">
              Peek arbitrage engine
            </Button>
          </Link>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader
            title="BTC funding snapshot"
            subtitle="Average across Binance, Bybit, and OKX."
          />
          <div className="space-y-2 text-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Avg BTC funding</span>
              <span
                className={`text-base font-semibold ${
                  avgBtc >= 0 ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {loading ? '—' : formatPercent(avgBtc, 3)}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Positive funding means longs pay shorts. Elevated positive funding
              can be a signal to harvest carry or fade crowded longs.
            </p>
          </div>
        </Card>
        <Card>
          <CardHeader
            title="ETH funding snapshot"
            subtitle="Same venues, ETH perps."
          />
          <div className="space-y-2 text-sm">
            <div className="flex items-baseline justify-between">
              <span className="text-xs text-slate-400">Avg ETH funding</span>
              <span
                className={`text-base font-semibold ${
                  avgEth >= 0 ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {loading ? '—' : formatPercent(avgEth, 3)}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Compare ETH vs BTC funding to understand where leverage is
              concentrated. Wide gaps hint at rotation flows.
            </p>
          </div>
        </Card>
        <Card>
          <CardHeader
            title="Extremes"
            subtitle="Where funding is most stretched right now."
          />
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Most bullish</span>
              <span className="font-medium text-emerald-300">
                {mostBullish
                  ? `${mostBullish.asset} @ ${mostBullish.exchange} · ${formatPercent(mostBullish.currentRate, 3)}`
                  : '—'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Most bearish</span>
              <span className="font-medium text-rose-300">
                {mostBearish
                  ? `${mostBearish.asset} @ ${mostBearish.exchange} · ${formatPercent(mostBearish.currentRate, 3)}`
                  : '—'}
              </span>
            </div>
            <p className="text-[0.7rem] text-slate-500">
              Extremes often precede local reversals. Use the Historical &
              Analytics page to see whether these are one-off spikes or
              persistent regimes.
            </p>
          </div>
        </Card>
      </section>

      <section className="grid gap-4 md:grid-cols-[minmax(0,1.6fr)_minmax(0,1.1fr)]">
        <Card>
          <CardHeader
            title="BTC vs ETH realized volatility"
            subtitle="30-day realized volatility from spot price history."
          />
          <div className="grid gap-4 md:grid-cols-2">
            <div className="h-56">
              {btcVol.length > 0 && <VolatilityChart data={btcVol} />}
            </div>
            <div className="h-56">
              {ethVol.length > 0 && <VolatilityChart data={ethVol} />}
            </div>
          </div>
        </Card>
        <div className="space-y-3">
          <InsightBox title="Today’s market insights">
            <ul className="list-disc space-y-1 pl-4">
              <li>
                If BTC funding is positive while volatility compresses, carry
                trades become more attractive — but watch for sharp regime
                shifts.
              </li>
              <li>
                Negative funding with high realized volatility often indicates
                aggressive short hedging rather than pure directional bets.
              </li>
              <li>
                Funding spreads across exchanges above ~0.15% annualized can
                justify cross-exchange basis trades, depending on fees and
                leverage.
              </li>
            </ul>
          </InsightBox>
          <InsightBox title="How to use this dashboard">
            Think of PerpLens as a radar. Start here, then deep dive into the
            Funding, Volatility and Pro modules when something looks out of
            place: stretched z-scores, unusual vol regimes or wide spreads.
          </InsightBox>
        </div>
      </section>
    </div>
  );
};
