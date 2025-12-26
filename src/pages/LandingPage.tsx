import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-950 to-slate-900 text-slate-50">
      <div className="mx-auto flex max-w-6xl flex-col px-5 pb-16 pt-6">
        <header className="mb-10 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500/20 border border-emerald-400/40">
              <span className="text-sm font-black text-emerald-300">π</span>
            </div>
            <div>
              <div className="text-xs font-semibold tracking-wide text-slate-50">
                PerpLens
              </div>
              <div className="text-[0.65rem] text-slate-400">
                Funding & Volatility Intelligence
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/app/overview">
              <Button variant="ghost" size="sm">
                View Dashboard
              </Button>
            </Link>
            <Link to="/app/overview">
              <Button size="sm" variant="primary">
                Start Free
              </Button>
            </Link>
          </div>
        </header>

        <main className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] items-start">
          <section>
            <Badge variant="success" className="mb-3">
              Designed for funding traders & basis desks
            </Badge>
            <h1 className="mb-4 text-balance text-4xl font-semibold tracking-tight text-slate-50 sm:text-5xl">
              See funding, volatility & arbitrage in one quant-grade terminal.
            </h1>
            <p className="mb-6 max-w-xl text-sm leading-relaxed text-slate-300">
              PerpLens ingests funding rates and realized volatility across
              perpetual swaps, normalizes them and surfaces the signals that
              actually matter for directional, carry and cross-exchange
              strategies.
            </p>
            <div className="mb-6 flex flex-wrap gap-3">
              <Link to="/app/overview">
                <Button size="lg" variant="primary">
                  Launch dashboard
                </Button>
              </Link>
              <a href="#pricing">
                <Button size="lg" variant="ghost">
                  Compare Basic vs Pro
                </Button>
              </a>
            </div>
            <ul className="grid gap-3 text-xs text-slate-300 sm:grid-cols-2">
              <li className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/20 text-[0.6rem] text-emerald-300 flex items-center justify-center">
                  ✓
                </span>
                <span>Live, cross-exchange funding across BTC & ETH.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/20 text-[0.6rem] text-emerald-300 flex items-center justify-center">
                  ✓
                </span>
                <span>Normalized z-scores, spreads and volatility overlays.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/20 text-[0.6rem] text-emerald-300 flex items-center justify-center">
                  ✓
                </span>
                <span>Arbitrage engine & PnL simulator in Pro.</span>
              </li>
              <li className="flex gap-2">
                <span className="mt-0.5 h-4 w-4 rounded-full bg-emerald-500/20 text-[0.6rem] text-emerald-300 flex items-center justify-center">
                  ✓
                </span>
                <span>Email & Telegram alerting for key regimes.</span>
              </li>
            </ul>
          </section>

          <section className="space-y-4">
            <Card className="bg-slate-900/80 border-slate-700/80 shadow-soft">
              <CardHeader
                title="Dashboard preview"
                subtitle="A quant-style layout focused on signal, not noise."
              />
              <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3">
                <div className="mb-2 grid grid-cols-3 gap-2 text-[0.6rem]">
                  <div className="rounded-xl bg-slate-900/80 p-2">
                    <div className="text-slate-400">Avg BTC funding</div>
                    <div className="text-sm font-semibold text-emerald-300 mt-1">
                      +0.021%
                    </div>
                    <div className="text-[0.65rem] text-emerald-400">
                      Carry-friendly
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 p-2">
                    <div className="text-slate-400">Avg ETH funding</div>
                    <div className="text-sm font-semibold text-emerald-300 mt-1">
                      +0.018%
                    </div>
                    <div className="text-[0.65rem] text-slate-400">
                      Slightly elevated
                    </div>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 p-2">
                    <div className="text-slate-400">Vol regime</div>
                    <div className="text-sm font-semibold text-amber-300 mt-1">
                      Expansion
                    </div>
                    <div className="text-[0.65rem] text-slate-400">
                      Whipsaw risk ↑
                    </div>
                  </div>
                </div>
                <div className="h-32 rounded-xl bg-gradient-to-tr from-emerald-500/15 via-slate-900 to-sky-500/15 border border-slate-800/80" />
                <div className="grid grid-cols-2 gap-2 text-[0.65rem]">
                  <div className="rounded-xl bg-slate-900/80 p-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-300">Basic</span>
                      <Badge variant="outline">Free</Badge>
                    </div>
                    <ul className="space-y-0.5 text-slate-400">
                      <li>• Live funding & heatmaps</li>
                      <li>• BTC/ETH vol metrics</li>
                      <li>• 2 simple alerts</li>
                    </ul>
                  </div>
                  <div className="rounded-xl bg-slate-900/80 p-2">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-slate-300">Pro</span>
                      <Badge variant="pro">Pro</Badge>
                    </div>
                    <ul className="space-y-0.5 text-slate-400">
                      <li>• Arbitrage engine</li>
                      <li>• Volatility terminal</li>
                      <li>• API / CSV export</li>
                    </ul>
                  </div>
                </div>
              </div>
            </Card>

            <Card id="pricing">
              <CardHeader
                title="Pricing overview"
                subtitle="Start on Basic, flip to Pro when you need full cross-exchange coverage."
              />
              <div className="grid gap-3 text-sm md:grid-cols-2">
                <div className="rounded-2xl border border-slate-700 bg-slate-950/60 p-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-100">
                      Basic
                    </span>
                    <Badge variant="outline">Free</Badge>
                  </div>
                  <div className="text-lg font-semibold text-slate-50 mb-1">
                    $0 / forever
                  </div>
                  <ul className="space-y-1 text-xs text-slate-300">
                    <li>• Live funding table (BTC & ETH)</li>
                    <li>• Historical charts & heatmaps</li>
                    <li>• Basic vol metrics & 2 alerts</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-violet-500/50 bg-violet-950/40 p-3">
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-100">
                      Pro
                    </span>
                    <Badge variant="pro">Pro</Badge>
                  </div>
                  <div className="text-lg font-semibold text-violet-100 mb-1">
                    Custom / desk
                  </div>
                  <ul className="space-y-1 text-xs text-violet-100/90">
                    <li>• Cross-exchange arbitrage engine</li>
                    <li>• Full volatility terminal & regimes</li>
                    <li>• Pro alerts + CSV / API export</li>
                  </ul>
                </div>
              </div>
            </Card>
          </section>
        </main>
      </div>
    </div>
  );
};
