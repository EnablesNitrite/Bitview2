import { useState } from 'react';
import type {
  AlertDelivery,
  Asset,
  BasicAlertType,
  Exchange
} from '../types/core';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAlertsStore } from '../store/alertStore';
import { getBasicAssets, getExchanges } from '../utils/mock';
import { InfoTooltip } from '../components/common/InfoTooltip';

export const AlertsPage = () => {
  const assets = getBasicAssets();
  const exchanges = getExchanges();
  const [type, setType] = useState<BasicAlertType>('fundingAbove');
  const [asset, setAsset] = useState<Asset>('BTC');
  const [exchange, setExchange] = useState<Exchange | 'any'>('any');
  const [threshold, setThreshold] = useState(0.0008);
  const [delivery, setDelivery] = useState<AlertDelivery>('email');

  const { alerts, addBasicAlert, removeAlert } = useAlertsStore();
  const basicAlerts = alerts.filter((a) => a.plan === 'basic');
  const limitReached = basicAlerts.length >= 2;

  const submit = () => {
    if (limitReached) return;
    addBasicAlert({
      type,
      asset,
      exchange: exchange === 'any' ? undefined : exchange,
      threshold: type === 'fundingAbove' ? threshold : undefined,
      delivery
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-50">
            Alerts (Basic)
          </h1>
          <p className="mt-1 text-xs text-slate-400 max-w-xl">
            Configure simple alerts so you don&apos;t need to stare at the
            dashboard. Basic lets you keep 2 alerts live; Pro unlocks
            arbitrage-grade alerting.
          </p>
        </div>
        <InfoTooltip text="Use alerts to catch regime changes while you’re away from the screen. For example: when funding flips from positive to negative, or realized volatility jumps above your comfort zone." />
      </div>

      <Card>
        <CardHeader
          title="Create basic alert"
          subtitle="Funding & volatility triggers with Email or Telegram delivery (mock UI)."
        />
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 text-xs">
            <div className="flex flex-col gap-1">
              <label className="text-slate-300">Condition</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as BasicAlertType)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
              >
                <option value="fundingAbove">Funding &gt; X%</option>
                <option value="fundingNegative">Funding &lt; 0</option>
                <option value="highVol">High volatility</option>
              </select>
            </div>
            <div className="flex gap-3">
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-slate-300">Asset</label>
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
              <div className="flex flex-1 flex-col gap-1">
                <label className="text-slate-300">Exchange</label>
                <select
                  value={exchange}
                  onChange={(e) =>
                    setExchange(e.target.value as Exchange | 'any')
                  }
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                >
                  <option value="any">Any</option>
                  {exchanges.map((ex) => (
                    <option key={ex} value={ex}>
                      {ex}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {type === 'fundingAbove' && (
              <div className="flex flex-col gap-1">
                <label className="text-slate-300">Threshold (%)</label>
                <input
                  type="number"
                  value={(threshold * 100).toFixed(3)}
                  onChange={(e) => setThreshold(Number(e.target.value) / 100)}
                  className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
                  step="0.005"
                />
              </div>
            )}
            <div className="flex flex-col gap-1">
              <label className="text-slate-300">Delivery</label>
              <select
                value={delivery}
                onChange={(e) => setDelivery(e.target.value as AlertDelivery)}
                className="rounded-xl border border-slate-700 bg-slate-900 px-2 py-1 text-xs"
              >
                <option value="email">Email</option>
                <option value="telegram">Telegram</option>
                <option value="discord">Discord</option>
              </select>
            </div>
            <Button
              size="sm"
              onClick={submit}
              disabled={limitReached}
            >
              {limitReached ? 'Basic plan: limit reached' : 'Create alert'}
            </Button>
            <p className="text-[0.7rem] text-slate-500">
              Free plan: up to 2 alerts. Upgrade to Pro for arbitrage, spread
              and regime-change alerts with cooldowns.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-200">
              Active alerts
            </h3>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60">
              {basicAlerts.length === 0 ? (
                <div className="px-3 py-4 text-center text-[0.75rem] text-slate-500">
                  No alerts yet. For starters, set one alert for funding &gt;
                  0.08% and another for negative funding on BTC.
                </div>
              ) : (
                <ul className="divide-y divide-slate-800 text-xs">
                  {basicAlerts.map((a) => (
                    <li
                      key={a.id}
                      className="flex items-center justify-between gap-2 px-3 py-2"
                    >
                      <div>
                        <div className="font-medium text-slate-100">
                          {a.type === 'fundingAbove' &&
                            `Funding > ${(a.threshold ?? 0) * 100}%`}
                          {a.type === 'fundingNegative' && 'Funding < 0'}
                          {a.type === 'highVol' && 'High realized volatility'}
                        </div>
                        <div className="text-[0.7rem] text-slate-500">
                          {a.asset} ·{' '}
                          {a.exchange ? a.exchange : 'Any exchange'} ·{' '}
                          {a.delivery.toUpperCase()}
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAlert(a.id)}
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};
