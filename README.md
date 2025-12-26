# PerpLens – Funding & Volatility Intelligence

A sleek, quant-style funding rates & volatility analytics dashboard built with **Vite + React + TypeScript + Tailwind**.

The app ships with a **Basic (Free) plan** and a **Pro (Paid) plan**. For this demo, all data is mocked but the architecture is ready to be wired to real APIs (funding, volatility, arbitrage, alerts, exports).

---

## 1. Tech stack

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** for styling (dark quant/fintech theme)
- **React Router v6** for routing
- **Zustand** for lightweight global state (plan + alerts)
- **Recharts** for charts & heatmaps

Project structure:

```text
funding-dashboard/
  ├─ index.html
  ├─ package.json
  ├─ vite.config.ts
  ├─ tailwind.config.cjs
  ├─ postcss.config.cjs
  └─ src/
     ├─ main.tsx
     ├─ App.tsx
     ├─ index.css
     ├─ layouts/
     │  └─ AppLayout.tsx
     ├─ components/
     │  ├─ layout/
     │  │  ├─ Sidebar.tsx
     │  │  └─ Topbar.tsx
     │  ├─ charts/
     │  │  ├─ FundingLineChart.tsx
     │  │  ├─ VolatilityChart.tsx
     │  │  └─ HeatmapGrid.tsx
     │  ├─ common/
     │  │  ├─ InfoTooltip.tsx
     │  │  ├─ InsightBox.tsx
     │  │  ├─ PlanBadge.tsx
     │  │  └─ ProLock.tsx
     │  └─ ui/
     │     ├─ Button.tsx
     │     ├─ Card.tsx
     │     ├─ Badge.tsx
     │     └─ Tooltip.tsx
     ├─ pages/
     │  ├─ LandingPage.tsx
     │  ├─ OverviewPage.tsx
     │  ├─ FundingRatesPage.tsx
     │  ├─ HistoricalFundingPage.tsx
     │  ├─ VolatilityPage.tsx
     │  ├─ HeatmapsPage.tsx
     │  ├─ AlertsPage.tsx
     │  ├─ ProArbitragePage.tsx
     │  ├─ ProSimulatorPage.tsx
     │  ├─ ProVolatilityTerminalPage.tsx
     │  ├─ ProAdvancedAnalyticsPage.tsx
     │  ├─ ProAlertsPage.tsx
     │  ├─ ProExportPage.tsx
     │  ├─ ProCustomDashboardPage.tsx
     │  └─ SettingsPage.tsx
     ├─ hooks/
     │  └─ useLiveFunding.ts
     ├─ services/
     │  ├─ fundingService.ts
     │  ├─ volatilityService.ts
     │  └─ arbitrageService.ts
     ├─ store/
     │  ├─ planStore.ts
     │  └─ alertStore.ts
     ├─ types/
     │  └─ core.ts
     └─ utils/
        ├─ formatters.ts
        └─ mock.ts
```

---

## 2. Getting started

### Install dependencies

```bash
npm install
# or
pnpm install
# or
yarn
```

### Run the dev server

```bash
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

### Build for production

```bash
npm run build
npm run preview
```

Vite will output a production build to `dist/`.

---

## 3. Basic vs Pro feature surface

### Basic (Free) plan

Accessible without gating:

- **Landing / marketing page** (`/`)
- **Overview** (`/app/overview`)
  - Summary cards for BTC/ETH funding, extremes, and volatility snapshot
  - “Today’s market insights” and usage guidance
- **Live funding dashboard** (`/app/funding`)
  - Sortable table (asset, exchange, current rate, time to next, 8h/24h rolling, z-score)
  - Filters: asset, exchange, “extreme funding only”
  - Funding micro-insights via tooltips
- **Historical funding** (`/app/historical`)
  - Asset & exchange selectors
  - Time ranges: 24h / 7d / 30d / 90d
  - Line chart with toggle for point-in-time vs cumulative funding
- **Basic volatility** (`/app/volatility`)
  - 60d realized volatility series for BTC/ETH
  - Educational insight boxes on funding vs vol & regimes
- **Heatmaps** (`/app/heatmaps`)
  - Funding heatmap (day vs hour)
  - Exchange comparison heatmap (exchange vs asset)
- **Simple alerts** (`/app/alerts`)
  - Conditions: `funding > X%`, `funding < 0`, `high volatility`
  - Asset & exchange selectors, Email/Telegram/Discord delivery (mock)
  - Up to **2 active alerts** with clear free-tier limit
- **Settings** (`/app/settings`)
  - Local toggle between Basic & Pro (no auth; demo only)

### Pro (Paid) plan

Visible in the UI with **Pro** badges and blur/lock when on Basic. In this demo, toggle to Pro in **Settings**.

- **Cross-exchange arbitrage engine** (`/app/pro/arbitrage`)
  - Table of mock opportunities (asset, long/short venue, spread, estimated net yield, risk profile)
  - Filters: asset, min spread, risk tolerance
- **Arbitrage PnL simulator** (`/app/pro/simulator`)
  - Inputs: capital, leverage, duration, funding spread, fees, volatility, exchange pair
  - Outputs: expected PnL, ROI, best/worst-case PnL, break-even vol
- **Volatility terminal** (`/app/pro/volatility`)
  - 120d realized vol chart (BTC/ETH/SOL/BNB)
  - Simple regime classifier (low / expansion / panic / high-vol consolidation)
  - Placeholders for returns histogram & GARCH/IV
- **Advanced analytics** (`/app/pro/analytics`)
  - Cards for composite metrics: Funding Risk Index, Funding/Vol Ratio, Negative Funding Streak, Mean Reversion Probability, etc.
- **Pro alerts** (`/app/pro/alerts`)
  - UX copy for arbitrage, spread, funding reversal & regime-change alerts
  - Extended delivery options (Telegram, Discord, Email, SMS placeholder)
- **CSV / API export** (`/app/pro/export`)
  - Mock buttons for CSV/image exports
  - API key placeholder panel with scopes and sample request
- **Custom dashboard layout** (`/app/pro/custom`)
  - Local layout configuration for key widgets
  - Theme toggle (dark/light; dark fully designed)
  - “Save layout” mock with confirmation

---

## 4. Wiring real data

The app is structured so you can easily replace the mocked data with real APIs:

- **Funding**
  - `services/fundingService.ts`
    - `fetchLiveFunding()`
    - `fetchFundingSeries(asset, exchange)`
    - `fetchFundingAnalytics(asset, exchange)`
- **Volatility**
  - `services/volatilityService.ts`
    - `fetchVolatilitySeries(asset, days)`
- **Arbitrage**
  - `services/arbitrageService.ts`
    - `fetchArbitrageOpps()`

Each currently returns mocked data generated in `utils/mock.ts`. You can swap the implementation with real HTTP calls (e.g. `fetch`, `axios`, or a dedicated client) and keep the rest of the app unchanged.

**API keys & secrets** should live in environment variables such as:

```bash
VITE_FUNDING_API_KEY=YOUR_KEY_HERE
```

…and be accessed via `import.meta.env.VITE_FUNDING_API_KEY` inside the service files. For this demo they are left as placeholders and not required to run.

---

## 5. UX & design notes

- Dark, quant/fintech aesthetic with subtle emerald & violet accents.
- Left sidebar with clear navigation & Pro section.
- Top bar with app name, plan indicator, and avatar.
- Consistent cards, rounded-2xl corners, soft shadows.
- Tooltips (`InfoTooltip`) for micro-education on funding, vol and regimes.
- Pro-only sections use `ProOnly` / `ProLocked`:
  - Blurred content
  - Pro badge
  - “Switch to Pro (demo)” CTA

---

## 6. Known limitations

- All numbers are **mocked**; they are illustrative only.
- No persistence beyond in-memory state for alerts / layout (localStorage could be added easily).
- No authentication or billing — the plan is toggled locally in Settings.

You can now open the app, explore the **Basic** experience, flip to **Pro** in Settings, and see how the product communicates the value of the upgraded tier.
