import type { HeatmapCell } from '../../types/core';
import { formatPercent } from '../../utils/formatters';

interface Props {
  data: HeatmapCell[];
  xLabel: string;
  yLabel: string;
}

const colorForValue = (v: number) => {
  const clamped = Math.max(-0.0015, Math.min(0.0015, v));
  const norm = (clamped + 0.0015) / 0.003;
  const r = norm < 0.5 ? 120 : 120 + (norm - 0.5) * 2 * 80;
  const g = norm < 0.5 ? 200 - norm * 2 * 80 : 120;
  const b = 150;
  return `rgba(${r},${g},${b},0.9)`;
};

export const HeatmapGrid = ({ data, xLabel, yLabel }: Props) => {
  const xs = Array.from(new Set(data.map((d) => d.x)));
  const ys = Array.from(new Set(data.map((d) => d.y)));

  return (
    <div className="w-full overflow-auto">
      <div className="inline-block min-w-[480px]">
        <div className="mb-1 flex justify-between text-[0.65rem] text-slate-400">
          <span>{yLabel}</span>
          <span>{xLabel}</span>
        </div>
        <div className="grid" style={{ gridTemplateColumns: `80px repeat(${xs.length}, 1fr)` }}>
          <div />
          {xs.map((x) => (
            <div
              key={x}
              className="px-1 pb-1 text-center text-[0.6rem] text-slate-500"
            >
              {x}
            </div>
          ))}
          {ys.map((y) => (
            <>
              <div
                key={`row-${y}`}
                className="pr-1 text-right text-[0.6rem] text-slate-500 flex items-center"
              >
                {y}
              </div>
              {xs.map((x) => {
                const cell = data.find((d) => d.x === x && d.y === y);
                const value = cell?.value ?? 0;
                return (
                  <div
                    key={`${x}-${y}`}
                    className="h-6 cursor-default border border-slate-900/40 text-[0.6rem] text-slate-900 flex items-center justify-center"
                    style={{ background: colorForValue(value) }}
                    title={formatPercent(value, 3)}
                  >
                    {/* keep label subtle */}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  );
};
